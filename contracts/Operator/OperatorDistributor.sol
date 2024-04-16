// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import '../UpgradeableBase.sol';
import '../Whitelist/Whitelist.sol';
import '../FundRouter.sol';
import '../PriceFetcher.sol';
import '../Tokens/WETHVault.sol';
import './NodeAccountFactory.sol';
import './NodeAccount.sol';

import '../Utils/Constants.sol';
import '../Utils/Errors.sol';

import '../Interfaces/IWETH.sol';
import '../Interfaces/RocketPool/IRocketStorage.sol';
import '../Interfaces/RocketPool/IMinipool.sol';
import '../Interfaces/RocketPool/IRocketNodeManager.sol';
import '../Interfaces/RocketPool/IRocketNodeStaking.sol';

contract OperatorDistributor is UpgradeableBase, Errors {
    event MinipoolCreated(address indexed _minipoolAddress, address indexed _nodeAddress);
    event MinipoolDestroyed(address indexed _minipoolAddress, address indexed _nodeAddress);
    event WarningNoMiniPoolsToHarvest();
    event WarningMinipoolNotStaking(address indexed _minipoolAddress, MinipoolStatus indexed _status);

    using Math for uint256;

    // The total amount of Ether (ETH) funded or allocated by the contract.
    // This variable keeps track of the ETH resources managed within this contract,
    uint256 public fundedEth;

    // The total amount of Rocket Pool tokens (RPL) funded or allocated by the contract.
    // This field is used to track the RPL token balance managed by the contract,
    uint256 public fundedRpl;

    address[] public minipoolAddresses;

    uint256 public nextMinipoolHavestIndex;
    uint256 public targetStakeRatio;

    uint256 public numMinipoolsProcessedPerInterval;

    uint256 public requiredLEBStaked;

    mapping(address => uint256) public minipoolIndexMap;
    mapping(address => uint256) public minipoolAmountFundedEth;
    mapping(address => uint256) public minipoolAmountFundedRpl;

    mapping(address => address[]) public nodeOperatorOwnedMinipools;
    mapping(address => uint256) public nodeOperatorEthStaked;

    constructor() initializer {}

    /**
     * @notice Initializes the contract with the provided storage address.
     * @dev This function should only be called once, during contract creation or proxy initialization.
     * It overrides the `initialize` function from a parent contract.
     * @param _directory The address of the storage contract.
     */
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);
        targetStakeRatio = 1.5e18; // 150%
        numMinipoolsProcessedPerInterval = 1;

        // defaulting these to 8eth to only allow LEB8 minipools
        requiredLEBStaked = 8 ether;
    }

    /**
     * @notice Receives incoming Ether and adds it to the queued balance.
     * @dev This is the fallback function that is called when Ether is sent directly to the contract.
     */
    receive() external payable {
        address payable dp = _directory.getDepositPoolAddress();
        console.log('fallback od initial');
        console.log(address(this).balance);

        if (msg.sender != dp) {
            (bool success, ) = dp.call{value: msg.value}('');
            require(success, 'low level call failed in od');
            FundRouter(dp).sendEthToDistributors();
        }

        console.log('fallback od final');
        console.log(address(this).balance);
    }

    function _rebalanceLiquidity() internal nonReentrant {
        address payable dp = _directory.getDepositPoolAddress();
        (bool success, ) = dp.call{value: address(this).balance}('');
        require(success, 'low level call failed in od');
        FundRouter(dp).sendEthToDistributors();

        IERC20 rpl = IERC20(_directory.getRPLAddress());
        SafeERC20.safeTransfer(rpl, dp, rpl.balanceOf(address(this)));
        FundRouter(dp).sendRplToDistributors();
    }

    /// @notice Gets the total ETH value locked inside the protocol, including inside of validators, the OperatorDistributor,
    /// and this contract.
    /// @dev This function sums up the balance of this contract with the amount of funded ETH across all minipools.
    /// Ensure that all sources of ETH (like the OperatorDistributor) are properly accounted for in the calculation.
    /// @return The total amount of Ether locked inside the protocol.
    function getTvlEth() public view returns (uint) {
        return address(this).balance + fundedEth;
    }

    /// @notice Gets the total RPL value locked inside the protocol, including inside of validators, the OperatorDistributor,
    /// and this contract.
    /// @dev This function calculates the total RPL by summing up the balance of RPL tokens of this contract
    /// with the amount of funded RPL across all minipools. It retrieves the RPL token address from the `_directory` contract.
    /// Ensure that all sources of RPL (like the OperatorDistributor) are accurately accounted for.
    /// @return The total amount of RPL tokens locked inside the protocol.
    function getTvlRpl() public view returns (uint) {
        return IERC20(_directory.getRPLAddress()).balanceOf(address(this)) + fundedRpl;
    }

    /**
     * @notice Removes a minipool address from the tracked list when a node operator exits.
     * @dev This function efficiently reorders the minipool addresses array and updates the index map.
     * It then resets the funded amount of ETH and RPL tokens for the removed minipool.
     * Should only be called by authorized protocol actors or admin.
     * @param _address The address of the minipool to be removed.
     *
     * Emits a `MinipoolDestroyed` event upon successful removal.
     */ function removeMinipoolAddress(address _address) public onlyProtocolOrAdmin {
        uint index = minipoolIndexMap[_address] - 1;
        require(index < minipoolAddresses.length, 'Address not found.');

        // Move the last address into the spot located by index
        address lastAddress = minipoolAddresses[minipoolAddresses.length - 1];
        minipoolAddresses[index] = lastAddress;
        minipoolIndexMap[lastAddress] = index;

        // Remove the last address
        minipoolAddresses.pop();
        delete minipoolIndexMap[_address];

        // Set amount funded to 0 since it's being returned to DP
        minipoolAmountFundedEth[_address] = 0;
        minipoolAmountFundedRpl[_address] = 0;

        emit MinipoolDestroyed(_address, IMinipool(_address).getNodeAddress());
    }

    /**
     * @notice Removes a node operator and all associated minipools.
     * @dev Iterates through all minipools owned by the node operator and removes them.
     * This action cannot be reversed, so it should be executed with caution.
     * Only authorized protocol actors or admin can call this function.
     * @param _address The address of the node operator to be removed.
     */
    function removeNodeOperator(address _address) external onlyProtocolOrAdmin {
        // remove all minipools owned by node operator
        address[] memory minipools = nodeOperatorOwnedMinipools[_address];
        for (uint i = 0; i < minipools.length; i++) {
            removeMinipoolAddress(minipools[i]);
        }
        delete nodeOperatorOwnedMinipools[_address];
    }

    /**
     * @notice Prepares a node for minipool creation by setting up necessary staking and validations.
     * @dev This function first validates the node's withdrawal address, then calculates the required amount of
     * RPL to stake based on the number of validators associated with the node, and performs a top-up.
     * Only the protocol or admin can call this function.
     * @param _NodeAccount The address of the validator account belonging to the Node Operator
     */
    function provisionLiquiditiesForMinipoolCreation(
        address _nodeOperator,
        address _NodeAccount,
        uint256 _bond
    ) external onlyProtocolOrAdmin {
        _rebalanceLiquidity();
        require(_bond == requiredLEBStaked, 'OperatorDistributor: Bad _bond amount, should be `requiredLEBStaked`');
        fundedEth += _bond;
        nodeOperatorEthStaked[_nodeOperator] += _bond;

        // by default this bonds 150% of stake according to max stake defined here: https://docs.rocketpool.net/guides/node/create-validator#staking-rpl
        (bool success, bytes memory data) = _NodeAccount.call{value: _bond}('');
        if (!success) {
            console.log('LowLevelEthTransfer 1');
            console.log('balance eth', address(this).balance);
            console.log(_bond);
            revert LowLevelEthTransfer(success, data);
        }
    }

    /**
     * @notice Tops up the node operator's RPL stake if it falls below the target stake ratio.
     * @dev This function checks the current staking ratio of the node (calculated as ETH staked times its price in RPL
     * divided by RPL staked). If the ratio is below a predefined target, it calculates the necessary RPL amount to
     * bring the stake ratio back to the target. Then, the function either stakes the required RPL or stakes
     * the remaining RPL balance if it's not enough.
     * @param _NodeAccount The address of the node.
     * @param _ethStaked The amount of ETH currently staked by the node operator.
     */
    function rebalanceRplStake(address _NodeAccount, uint256 _ethStaked) public onlyProtocolOrAdmin {
        console.log('rebalanceRplStake()');
        IRocketNodeStaking rocketNodeStaking = IRocketNodeStaking(_directory.getRocketNodeStakingAddress());
        uint256 rplStaked = rocketNodeStaking.getNodeRPLStake(_NodeAccount);

        console.log('rebalanceRplStake.rplStaked', rplStaked);

        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();
        console.log('rebalanceRplStake.ethPriceInRpl', ethPriceInRpl);

        uint256 stakeRatio = rplStaked == 0 ? 1e18 : ((_ethStaked * ethPriceInRpl * 1e18) / rplStaked) / 1e18;
        console.log('rebalanceRplStake.stakeRatio', stakeRatio);
        console.log('rebalanceRplStake.targetStakeRatio', targetStakeRatio);

        uint256 targetStake = ((_ethStaked * ethPriceInRpl) / targetStakeRatio);

        if (targetStake > rplStaked) {
            // stake more
            uint256 stakeIncrease = targetStake - rplStaked;
            fundedRpl += stakeIncrease;

            console.log('rebalanceRplStake.stakeIncrease', stakeIncrease);
            _performTopUp(_NodeAccount, stakeIncrease);
        }

        if (targetStake < rplStaked) {
            uint256 excessRpl = rplStaked - targetStake;
            console.log('rebalanceRplStake.excessRpl', excessRpl);

            fundedRpl -= excessRpl;
            FundRouter(_directory.getDepositPoolAddress()).unstakeRpl(_NodeAccount, excessRpl);

            // Update the amount of RPL funded by the node
            minipoolAmountFundedRpl[_NodeAccount] -= excessRpl;
        }
    }

    function _performTopUp(address _NodeAccount, uint256 _requiredStake) internal {
        uint256 currentRplBalance = IERC20(_directory.getRPLAddress()).balanceOf(address(this));
        if (currentRplBalance >= _requiredStake) {
            if (_requiredStake == 0) {
                return;
            }
            // stakeRPLOnBehalfOf
            // transfer RPL to deposit pool
            IERC20(_directory.getRPLAddress()).transfer(
                _directory.getDepositPoolAddress(),
                _requiredStake
            );
            FundRouter(_directory.getDepositPoolAddress()).stakeRPLFor(_NodeAccount, _requiredStake);
        } else {
            if (currentRplBalance == 0) {
                return;
            }
            // stake what we have
            IERC20(_directory.getRPLAddress()).transfer(
                _directory.getDepositPoolAddress(),
                currentRplBalance
            );
            FundRouter(_directory.getDepositPoolAddress()).stakeRPLFor(_NodeAccount, currentRplBalance);
        }
    }

    /**
     * @notice Calculates the amount of RPL needed to top up the node operator's stake to the target stake ratio.
     * @dev This view function checks the current staking ratio of the node (calculated as ETH staked times its price in RPL
     * divided by RPL staked). If the ratio is below a predefined target, it returns the necessary RPL amount to
     * bring the stake ratio back to the target.
     * @param _existingRplStake Prior crap staked
     * @param _ethStaked The amount of ETH currently staked by the node operator.
     * @return requiredStakeRpl The amount of RPL required to top up to the target stake ratio.
     */
    function calculateRequiredRplTopUp(
        uint256 _existingRplStake,
        uint256 _ethStaked
    ) public view returns (uint256 requiredStakeRpl) {
        console.log('before calling getPriceFetcherAddress');
        console.logAddress(getDirectory().getPriceFetcherAddress());
        console.log('B');
        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();
        console.log('price', ethPriceInRpl);
        uint256 stakeRatio = _existingRplStake == 0 ? 1e18 : (_ethStaked * ethPriceInRpl * 1e18) / _existingRplStake;
        if (stakeRatio < targetStakeRatio) {
            uint256 minuend = ((_ethStaked * ethPriceInRpl) / targetStakeRatio);
            requiredStakeRpl = minuend < _existingRplStake ? 0 : minuend - _existingRplStake;
        } else {
            requiredStakeRpl = 0;
        }
        return requiredStakeRpl;
    }

    /**
     * @notice Calculates the amount of RPL that can be withdrawn from the node operator's stake without falling below the target stake ratio.
     * @dev This view function checks the current staking ratio of the node (calculated as ETH staked times its price in RPL
     * divided by RPL staked). If the ratio is above a predefined target, it returns the maximum RPL amount that can be withdrawn
     * while still maintaining at least the target stake ratio.
     * @param _existingRplStake The amount of RPL currently staked by the node operator.
     * @param _ethStaked The amount of ETH currently staked by the node operator.
     * @return withdrawableStakeRpl The maximum amount of RPL that can be withdrawn while maintaining the target stake ratio.
     */
    function calculateRequiredRplTopDown(
        uint256 _existingRplStake,
        uint256 _ethStaked
    ) public view returns (uint256 withdrawableStakeRpl) {
        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        uint256 stakeRatio = _existingRplStake == 0 ? 1e18 : (_ethStaked * ethPriceInRpl * 1e18) / _existingRplStake;
        if (stakeRatio > targetStakeRatio) {
            uint256 maxRplStake = (_ethStaked * ethPriceInRpl) / targetStakeRatio;
            withdrawableStakeRpl = _existingRplStake > maxRplStake ? _existingRplStake - maxRplStake : 0;
        } else {
            withdrawableStakeRpl = 0;
        }
        return withdrawableStakeRpl;
    }

    /**
     * @notice Processes rewards for a predefined number of minipools. This function is meant to be called during
     * the creation of new intervals. It serves to withdraw rewards from minipools and to top up the RPL stake.
     * @dev The function first checks if there are any minipools to process. If there aren't, it emits a warning event
     * and exits. Otherwise, it calls the internal function _processNextMinipool() for a certain number of times defined
     * by numMinipoolsProcessedPerInterval.
     */
    function processNextMinipool() external onlyProtocol {
        if (minipoolAddresses.length == 0) {
            emit WarningNoMiniPoolsToHarvest();
            return;
        }

        for (uint i = 0; i < numMinipoolsProcessedPerInterval; i++) {
            console.log('processNextMinipool() at', i);
            _processNextMinipool();
        }
    }

    function OnMinipoolCreated(address newMinipoolAddress, address nodeAddress, uint256 bond) external {
        if (!_directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender)) {
            revert BadRole(Constants.CORE_PROTOCOL_ROLE, msg.sender);
        }

        // register minipool with node operator
        Whitelist whitelist = Whitelist(getDirectory().getWhitelistAddress());
        whitelist.registerNewValidator(nodeAddress);

        // new minipool owned by node operator
        nodeOperatorOwnedMinipools[nodeAddress].push(newMinipoolAddress);

        // add minipool to minipoolAddresses
        minipoolAddresses.push(newMinipoolAddress);
        minipoolIndexMap[newMinipoolAddress] = minipoolAddresses.length;

        emit MinipoolCreated(newMinipoolAddress, nodeAddress);

        // updated amount funded eth
        minipoolAmountFundedEth[newMinipoolAddress] = bond;
    }

    /**
     * @dev Processes a single minipool by performing RPL top-up and distributing balance if certain conditions are met.
     */
    function _processNextMinipool() internal {
        if(nextMinipoolHavestIndex > minipoolAddresses.length - 1) {
            nextMinipoolHavestIndex = 0;
        }

        uint256 index = nextMinipoolHavestIndex;
        IMinipool minipool = IMinipool(minipoolAddresses[index]);

        MinipoolStatus minipoolStatus = minipool.getStatus();
        console.log('_processNextMinipool.status=', uint256(minipoolStatus));
        if (minipoolStatus != MinipoolStatus.Staking) {
            emit WarningMinipoolNotStaking(address(minipool), minipoolStatus);
            return;
        }

        // process top up
        address nodeAddress = minipool.getNodeAddress();
        address nodeOperator = NodeAccount(nodeAddress).nodeOperator();
        console.log('_processNextMinipool.nodeAddress:');
        console.logAddress(nodeAddress);
        uint256 ethStaked = nodeOperatorEthStaked[nodeOperator];

        console.log('_processNextMinipool.ethStaked', ethStaked);

        rebalanceRplStake(nodeAddress, ethStaked);
        //performTopDown(nodeAddress, ethStaked);


        uint256 balance = minipool.getNodeDepositBalance();
        // TODO: Talk to Mike: used to pass  balance >= 8 ether but whent this is true, it will always revert
        if (balance >= 8 ether) {
            //minipool.distributeBalance(false);
            NodeAccount(
                NodeAccountFactory(_directory.getNodeAccountFactoryAddress()).minipoolNodeAccountMap(
                    address(minipool)
                )
            ).distributeBalance(false, address(minipool));
        }

        nextMinipoolHavestIndex++;
    }

    /**
     * @notice Set the number of minipools to be processed per interval.
     * @dev This function can only be called by the contract's admin.
     * Adjusting this parameter allows the admin to control and optimize the load
     * on the network for each interval, especially in scenarios with a large number of minipools.
     * @param _numMinipoolsProcessedPerInterval The new number of minipools to process per interval.
     */
    function setNumMinipoolsProcessedPerInterval(uint256 _numMinipoolsProcessedPerInterval) external onlyAdmin {
        numMinipoolsProcessedPerInterval = _numMinipoolsProcessedPerInterval;
    }

    function setBondRequirments(uint256 _requiredLEBStaked) external onlyAdmin {
        requiredLEBStaked = _requiredLEBStaked;
    }

    function setTargetStakeRatio(uint256 _targetStakeRatio) external onlyAdmin {
        targetStakeRatio = _targetStakeRatio;
    }

    function onNodeOperatorDissolved(address _nodeOperator, uint256 _bond) external onlyProtocol {
        fundedEth -= _bond;
        nodeOperatorEthStaked[_nodeOperator] -= _bond;
    }


    /**
     * @notice Retrieves the list of minipool addresses managed by the contract.
     * @dev This function provides a way to fetch all the current minipool addresses in memory.
     * Useful for off-chain services or frontend interfaces that need to display or interact
     * with the various minipools.
     * @return A list of addresses corresponding to the minipools.
     */
    function getMinipoolAddresses() external view returns (address[] memory) {
        return minipoolAddresses;
    }

    function transferWEthToVault(uint256 _amount) external returns (uint256) {
        address vault = _directory.getWETHVaultAddress();
        require(msg.sender == vault, 'caller must be vault');
        address weth = _directory.getWETHAddress();

        // Check if there's enough WETH in the contract
        uint256 wethBalance = IWETH(weth).balanceOf(address(this));
        if (wethBalance >= _amount) {
            IWETH(weth).deposit{value: _amount}();
            SafeERC20.safeTransfer(IERC20(weth), vault, _amount);
            return _amount;
        } else {
            return 0;
        }
    }

    function transferRplToVault(uint256 _amount) external returns (uint256) {
        address vault = _directory.getRPLVaultAddress();
        require(msg.sender == vault, 'caller must be vault');

        // Check if there's enough RPL in the contract
        address rpl = IERC4626Upgradeable(vault).asset();
        uint256 rplBalance = IERC20(rpl).balanceOf(address(this));
        if (rplBalance >= _amount) {
            SafeERC20.safeTransfer(IERC20(rpl), vault, _amount);
            return _amount;
        } else {
            return 0;
        }
    }
}
