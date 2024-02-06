// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../UpgradeableBase.sol';
import '../Whitelist/Whitelist.sol';
import '../DepositPool.sol';
import '../PriceFetcher.sol';

import '../Utils/Constants.sol';
import '../Utils/Errors.sol';

import '../Interfaces/RocketPool/IRocketStorage.sol';
import '../Interfaces/RocketPool/IMinipool.sol';
import '../Interfaces/RocketPool/IRocketNodeManager.sol';
import '../Interfaces/RocketPool/IRocketNodeStaking.sol';

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract OperatorDistributor is UpgradeableBase, Errors {
    event MinipoolCreated(address indexed _minipoolAddress, address indexed _nodeAddress);
    event MinipoolDestroyed(address indexed _minipoolAddress, address indexed _nodeAddress);
    event WarningNoMiniPoolsToHarvest();
    event WarningMinipoolNotStaking(address indexed _minipoolAddress, MinipoolStatus indexed _status);

    uint public _queuedEth;

    address[] public minipoolAddresses;

    uint256 public nextMinipoolHavestIndex;
    uint256 public targetStakeRatio;

    uint256 public numMinipoolsProcessedPerInterval;

    uint256 public upperBondRequirement;
    uint256 public lowerBondRequirement;

    mapping(address => uint256) public minipoolIndexMap;
    mapping(address => uint256) public minipoolAmountFundedEth;
    mapping(address => uint256) public minipoolAmountFundedRpl;

    mapping(address => address[]) nodeOperatorOwnedMinipools;

    constructor() initializer {}

    /**
     * @notice Initializes the contract with the provided storage address.
     * @dev This function should only be called once, during contract creation or proxy initialization.
     * It overrides the `initialize` function from a parent contract.
     * @param _directoryAddress The address of the storage contract.
     */
    function initialize(address _directoryAddress) public override initializer {
        super.initialize(_directoryAddress);
        targetStakeRatio = 1.5e18; // 150%
        numMinipoolsProcessedPerInterval = 1;

        // defaulting these to 8eth to only allow LEB8 minipools
        upperBondRequirement = 8 ether;
        lowerBondRequirement = 8 ether;
    }

    /**
     * @notice Receives incoming Ether and adds it to the queued balance.
     * @dev This is the fallback function that is called when Ether is sent directly to the contract.
     * Ensure that any mechanisms consuming `_queuedEth` are secure.
     */
    receive() external payable {
        _queuedEth += msg.value;
    }

    /**
     * @notice Returns the total amount of Ether funded across all minipools.
     * @dev Iterates over all minipool addresses and sums up the funded Ether from each minipool.
     * Make sure to be cautious with this function as it could be expensive in gas if the `minipoolAddresses` array becomes large.
     * @return amountFunded The total amount of Ether funded in all minipools.
     */
    function getAmountFundedEth() public view returns (uint256) {
        uint256 amountFunded;
        for (uint i = 0; i < minipoolAddresses.length; i++) {
            amountFunded += minipoolAmountFundedEth[minipoolAddresses[i]];
        }
        return amountFunded;
    }

    /**
     * @notice Returns the total amount of RPL tokens funded across all minipools.
     * @dev Iterates over all minipool addresses and sums up the funded RPL tokens from each minipool.
     * Be cautious using this function as it could become gas-expensive if the `minipoolAddresses` array grows significantly.
     * @return amountFunded The total amount of RPL tokens funded in all minipools.
     */
    function getAmountFundedRpl() public view returns (uint256) {
        uint256 amountFunded;
        for (uint i = 0; i < minipoolAddresses.length; i++) {
            amountFunded += minipoolAmountFundedRpl[minipoolAddresses[i]];
        }
        return amountFunded;
    }

    /// @notice Gets the total ETH value locked inside the protocol, including inside of validators, the OperatorDistributor,
    /// and this contract.
    /// @dev This function sums up the balance of this contract with the amount of funded ETH across all minipools.
    /// Ensure that all sources of ETH (like the OperatorDistributor) are properly accounted for in the calculation.
    /// @return The total amount of Ether locked inside the protocol.
    function getTvlEth() public view returns (uint) {
        return address(this).balance + getAmountFundedEth();
    }

    /// @notice Gets the total RPL value locked inside the protocol, including inside of validators, the OperatorDistributor,
    /// and this contract.
    /// @dev This function calculates the total RPL by summing up the balance of RPL tokens of this contract
    /// with the amount of funded RPL across all minipools. It retrieves the RPL token address from the `_directory` contract.
    /// Ensure that all sources of RPL (like the OperatorDistributor) are accurately accounted for.
    /// @return The total amount of RPL tokens locked inside the protocol.
    function getTvlRpl() public view returns (uint) {
        return RocketTokenRPLInterface(_directory.getRPLAddress()).balanceOf(address(this)) + getAmountFundedRpl();
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
     * @notice Stakes the minimum required RPL tokens on behalf of a node.
     * @dev This function first fetches the node's minimum RPL stake requirement,
     * approves the Node Staking contract to spend the RPL, and then stakes the RPL for the node.
     * It assumes that the contract already holds enough RPL tokens for the staking process.
     * @param _nodeAddress The address of the node for which RPL should be staked.
     */
    function _stakeRPLFor(address _nodeAddress) internal {
        IRocketNodeStaking nodeStaking = IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress());
        uint256 minimumRplStake = IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress())
            .getNodeMinimumRPLStake(_nodeAddress);

        // approve the node staking contract to spend the RPL
        RocketTokenRPLInterface rpl = RocketTokenRPLInterface(_directory.getRPLAddress());
        require(rpl.approve(getDirectory().getRocketNodeStakingAddress(), minimumRplStake));

        // update amount funded rpl
        minipoolAmountFundedRpl[_nodeAddress] = minimumRplStake;

        nodeStaking.stakeRPLFor(_nodeAddress, minimumRplStake);
    }

    /**
     * @notice Validates that the withdrawal address for a node is set to the Deposit Pool address.
     * @dev This function fetches the node's withdrawal address from RocketStorage and checks if
     * it matches the Deposit Pool address. Throws an error if they don't match.
     * It is a security check to ensure minipools delegate control to the Deposit Pool.
     * @param _nodeAddress The address of the node whose withdrawal address should be validated.
     */
    function _validateWithdrawalAddress(address _nodeAddress) internal view {
        IRocketStorage rocketStorage = IRocketStorage(getDirectory().getRocketStorageAddress());

        address withdrawalAddress = rocketStorage.getNodeWithdrawalAddress(_nodeAddress);

        address depositPoolAddr = getDirectory().getDepositPoolAddress();

        require(
            withdrawalAddress == depositPoolAddr,
            'OperatorDistributor: minipool must delegate control to deposit pool'
        );
    }

    /**
     * @notice Prepares a node for minipool creation by setting up necessary staking and validations.
     * @dev This function first validates the node's withdrawal address, then calculates the required amount of
     * RPL to stake based on the number of validators associated with the node, and performs a top-up.
     * It stakes an amount equivalent to `(2.4 + 100% padding) ether` worth of RPL for each validator of the node.
     * Only the protocol or admin can call this function.
     * @param _validatorAccount The address of the validator account belonging to the Node Operator
     */
    function provisionLiquiditiesForMinipoolCreation(
        address _nodeOperator,
        address _validatorAccount,
        uint256 _bond
    ) external onlyProtocolOrAdmin {
        // stakes (2.4 + 100% padding) eth worth of rpl for the node
        _validateWithdrawalAddress(_validatorAccount);
        require(_bond == 8 ether, "OperatorDistributor: Bad _bond amount, should be 8");

        uint256 numValidators = Whitelist(_directory.getWhitelistAddress()).getNumberOfValidators(_nodeOperator);

        performTopUp(_validatorAccount, 24 ether * numValidators);
        (bool success, bytes memory data) = _validatorAccount.call{value: _bond}('');
        if (!success) {
            revert LowLevelEthTransfer(success, data);
        }
    }

    /**
     * @notice Tops up the node operator's RPL stake if it falls below the target stake ratio.
     * @dev This function checks the current staking ratio of the node (calculated as ETH staked times its price in RPL
     * divided by RPL staked). If the ratio is below a predefined target, it calculates the necessary RPL amount to
     * bring the stake ratio back to the target. Then, the function either stakes the required RPL or stakes
     * the remaining RPL balance if it's not enough.
     * @param _validatorAccount The address of the node operator.
     * @param _ethStaked The amount of ETH currently staked by the node operator.
     */
    function performTopUp(address _validatorAccount, uint256 _ethStaked) public onlyProtocolOrAdmin {
        uint256 rplStaked = IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).getNodeRPLStake(
            _validatorAccount
        );
        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        uint256 stakeRatio = rplStaked == 0 ? 1e18 : (_ethStaked * ethPriceInRpl * 1e18) / rplStaked;
        if (stakeRatio < targetStakeRatio) {
            uint256 minuend = ((_ethStaked * ethPriceInRpl) / targetStakeRatio);
            uint256 requiredStakeRpl = minuend < rplStaked ? 0 : minuend - rplStaked;
            // Make sure the contract has enough RPL to stake
            uint256 currentRplBalance = RocketTokenRPLInterface(_directory.getRPLAddress()).balanceOf(address(this));
            if (currentRplBalance >= requiredStakeRpl) {
                if (requiredStakeRpl == 0) {
                    return;
                }
                // stakeRPLOnBehalfOf
                // transfer RPL to deposit pool
                RocketTokenRPLInterface(_directory.getRPLAddress()).transfer(
                    _directory.getDepositPoolAddress(),
                    requiredStakeRpl
                );
                DepositPool(_directory.getDepositPoolAddress()).stakeRPLFor(_validatorAccount, requiredStakeRpl);
            } else {
                if (currentRplBalance == 0) {
                    return;
                }
                // stake what we have
                RocketTokenRPLInterface(_directory.getRPLAddress()).transfer(
                    _directory.getDepositPoolAddress(),
                    currentRplBalance
                );
                DepositPool(_directory.getDepositPoolAddress()).stakeRPLFor(_validatorAccount, currentRplBalance);
            }
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
        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

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
        uint256 index = nextMinipoolHavestIndex % minipoolAddresses.length;
        IMinipool minipool = IMinipool(minipoolAddresses[index]);

        if (minipool.getStatus() != MinipoolStatus.Staking) {
            emit WarningMinipoolNotStaking(address(minipool), minipool.getStatus());
            return;
        }

        // process top up
        address nodeAddress = minipool.getNodeAddress();

        uint256 numberOfValidators = Whitelist(_directory.getWhitelistAddress()).getNumberOfValidators(nodeAddress);

        performTopUp(nodeAddress, 8 * numberOfValidators);

        nextMinipoolHavestIndex = index + 1;

        uint256 balance = minipool.getNodeDepositBalance();
        minipool.distributeBalance(balance >= 8 ether);
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

    function setBondRequirments(uint256 _upperBound, uint256 _lowerBound) external onlyAdmin {
        require(_upperBound >= _lowerBound && _lowerBound <= _upperBound, Constants.BAD_BOND_BOUNDS);
        upperBondRequirement = _upperBound;
        lowerBondRequirement = _lowerBound;
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
}
