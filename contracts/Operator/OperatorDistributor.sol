// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../UpgradeableBase.sol';
import '../Whitelist/Whitelist.sol';
import '../FundRouter.sol';
import '../PriceFetcher.sol';
import '../Tokens/WETHVault.sol';
import './SuperNodeAccount.sol';

import '../Utils/Constants.sol';
import '../Utils/Errors.sol';

import '../Interfaces/IWETH.sol';
import '../Interfaces/RocketPool/IRocketStorage.sol';
import '../Interfaces/RocketPool/IMinipool.sol';
import '../Interfaces/RocketPool/IRocketNodeManager.sol';
import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/RocketPool/IRocketDAOProtocolSettingsRewards.sol';

/**
 * @title OperatorDistributor
 * @author Theodore Clapp, Mike Leach
 * @dev Manages distribution and staking of ETH and RPL tokens for node operators in a decentralized network.
 * Inherits from UpgradeableBase and Errors to use their functionalities for upgradeability and error handling.
 */
contract OperatorDistributor is UpgradeableBase, Errors {
    event MinipoolCreated(address indexed _minipoolAddress, address indexed _nodeAddress);
    event MinipoolDestroyed(address indexed _minipoolAddress, address indexed _nodeAddress);
    event WarningNoMiniPoolsToHarvest();
    event WarningMinipoolNotStaking(
        address indexed _minipoolAddress,
        MinipoolStatus indexed _status,
        bool indexed _isFinalized
    );

    using Math for uint256;

    // The total amount of Ether (ETH) funded or allocated by the contract.
    // This variable keeps track of the ETH resources managed within this contract,
    // Total amount of Ether (ETH) funded or allocated by the contract.
    uint256 public fundedEth;

    // The total amount of Rocket Pool tokens (RPL) funded or allocated by the contract.
    // This field is used to track the RPL token balance managed by the contract,
    // Total amount of Rocket Pool tokens (RPL) funded or allocated by the contract.
    uint256 public fundedRpl;

    // Target ratio of ETH to RPL stake.
    uint256 public targetStakeRatio;

    // Required amount of ETH staked for a minipool to be active.
    uint256 public requiredLEBStaked;

    // The amount the oracle has already included in its summation
    uint256 public oracleError;

    constructor() initializer {}

    /**
     * @notice Initializes the contract with the provided storage address.
     * @dev This function should only be called once, during contract creation or proxy initialization.
     * It overrides the `initialize` function from a parent contract.
     * @param _directory The address of the storage contract.
     */
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);
        // defaulting these to 8eth to only allow LEB8 minipools
        targetStakeRatio = 1.5e18; // Set to 150% as a default ratio.
        requiredLEBStaked = 8 ether; // Default to 8 ETH to align with specific minipool configurations.
    }

    /**
     * @notice Fallback function to handle incoming Ether transactions.
     * @dev Automatically routes incoming ETH to the FundRouter contract for distribution unless sent by the deposit pool directly.
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

    /**
     * @notice Rebalances liquidity by transferring all collected ETH and RPL tokens to the deposit pool.
     * @dev Calls to external contracts for transferring balances and ensures successful execution of these calls.
     */
    function _rebalanceLiquidity() internal nonReentrant {
        address payable dp = _directory.getDepositPoolAddress();
        (bool success, ) = dp.call{value: address(this).balance}('');
        require(success, 'low level call failed in od');
        FundRouter(dp).sendEthToDistributors();

        IERC20 rpl = IERC20(_directory.getRPLAddress());
        SafeERC20.safeTransfer(rpl, dp, rpl.balanceOf(address(this)));
        FundRouter(dp).sendRplToDistributors();
    }

    /**
     * @notice Returns the total ETH held by the contract, including both the balance of this contract and the funded ETH.
     * @return uint256 Total amount of ETH under the management of the contract.
     */
    function getTvlEth() public view returns (uint) {
        return address(this).balance + fundedEth;
    }

    /**
     * @notice Returns the total RPL held by the contract, including both the balance of this contract and the funded RPL.
     * @return uint256 Total amount of RPL under the management of the contract.
     */
    function getTvlRpl() public view returns (uint) {
        return IERC20(_directory.getRPLAddress()).balanceOf(address(this)) + fundedRpl;
    }

    /**
     * @notice Allocates the necessary liquidity for the creation of a new minipool.
     * @param _bond The amount of ETH required to be staked for the minipool.
     */
    function provisionLiquiditiesForMinipoolCreation(uint256 _bond) external onlyProtocolOrAdmin {
        console.log('provisionLiquiditiesForMinipoolCreation.pre-RebalanceLiquidities');
        _rebalanceLiquidity();
        console.log('provisionLiquiditiesForMinipoolCreation.post-RebalanceLiquidities');
        require(_bond == requiredLEBStaked, 'OperatorDistributor: Bad _bond amount, should be `requiredLEBStaked`');
        fundedEth += _bond;

        address superNode = _directory.getSuperNodeAddress();

        (bool success, bytes memory data) = superNode.call{value: _bond}('');
        if (!success) {
            console.log('LowLevelEthTransfer 1');
            console.log('balance eth', address(this).balance);
            console.log(_bond);
            revert LowLevelEthTransfer(success, data);
        }
        console.log('finished provisionLiquiditiesForMinipoolCreation');
    }

    /**
     * @notice Adjusts the RPL stake of a node operator to maintain the target stake ratio.
     * @dev Calculates required adjustments to the RPL stake based on the current ETH price and staking metrics.
     * @param _ethStaked Amount of ETH currently staked by the node operator.
     */
    function rebalanceRplStake(uint256 _ethStaked) public onlyProtocolOrAdmin {
        address _nodeAccount = _directory.getSuperNodeAddress();

        console.log('rebalanceRplStake()');
        IRocketNodeStaking rocketNodeStaking = IRocketNodeStaking(_directory.getRocketNodeStakingAddress());
        uint256 rplStaked = rocketNodeStaking.getNodeRPLStake(_nodeAccount);
        uint256 lockedStake = rocketNodeStaking.getNodeRPLLocked(_nodeAccount);

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
            _performTopUp(_nodeAccount, stakeIncrease);
        }

        if (targetStake < rplStaked) {
            uint256 elapsed = block.timestamp -
                IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).getNodeRPLStakedTime(_nodeAccount);

            // NOTE: what happens if rpl staked is 0 and locked stake is postive?
            uint256 excessRpl = rplStaked - targetStake;
            bool noShortfall = rplStaked - excessRpl - lockedStake >=
                rocketNodeStaking.getNodeMaximumRPLStake(_nodeAccount);
            if (
                elapsed >=
                IRocketDAOProtocolSettingsRewards(_directory.getRocketDAOProtocolSettingsRewardsAddress())
                    .getRewardsClaimIntervalTime() &&
                noShortfall
            ) {
                // NOTE: to auditors: double check that all cases are covered such that withdrawRPL will not revert execution
                fundedRpl -= excessRpl;
                console.log('rebalanceRplStake.excessRpl', excessRpl);
                FundRouter(_directory.getDepositPoolAddress()).unstakeRpl(_nodeAccount, excessRpl);
            } else {
                console.log('failed to rebalanceRplStake.excessRpl', excessRpl);
            }
            console.log('excessRpl', excessRpl);
            console.log('noShortfall', noShortfall);
        }
        console.log('finished rebalanceRplStake.targetStake', targetStake);
        console.log('finished rebalanceRplStake.rplStaked', rplStaked);
    }

    function _performTopUp(address _superNode, uint256 _requiredStake) internal {
        uint256 currentRplBalance = IERC20(_directory.getRPLAddress()).balanceOf(address(this));
        if (currentRplBalance >= _requiredStake) {
            if (_requiredStake == 0) {
                return;
            }
            // stakeRPLOnBehalfOf
            // transfer RPL to deposit pool
            IERC20(_directory.getRPLAddress()).transfer(_directory.getDepositPoolAddress(), _requiredStake);
            FundRouter(_directory.getDepositPoolAddress()).stakeRPLFor(_superNode, _requiredStake);
        } else {
            if (currentRplBalance == 0) {
                return;
            }
            // stake what we have
            IERC20(_directory.getRPLAddress()).transfer(_directory.getDepositPoolAddress(), currentRplBalance);
            FundRouter(_directory.getDepositPoolAddress()).stakeRPLFor(_superNode, currentRplBalance);
        }
    }

    /**
     * @notice Calculates the additional RPL needed to maintain the target staking ratio.
     * @param _existingRplStake Current amount of RPL staked by the node.
     * @param _ethStaked Amount of ETH currently staked by the node.
     * @return requiredStakeRpl Amount of additional RPL needed.
     */
    function calculateRplStakeShortfall(
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

            // do we _ethStaked / ethPriceInRpl * targetStakeRatio ???
            uint256 minuend = ((_ethStaked * ethPriceInRpl) / targetStakeRatio);
            requiredStakeRpl = minuend < _existingRplStake ? 0 : minuend - _existingRplStake;
        } else {
            requiredStakeRpl = 0;
        }
        return requiredStakeRpl;
    }

    /**
     * @notice Calculates the maximum RPL that can be withdrawn while maintaining the target staking ratio.
     * @param _existingRplStake Current amount of RPL staked by the node.
     * @param _ethStaked Amount of ETH currently staked by the node.
     * @return withdrawableStakeRpl Maximum RPL that can be safely withdrawn.
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
     * @notice Internal function to process the next minipool in line.
     * Handles RPL top-up and balance distribution based on minipool's current state.
     */
    function processNextMinipool() external {
        _processNextMinipool();
    }

    /**
     * @notice Handles the creation of a minipool, registers the node, and logs the event.
     * @param newMinipoolAddress Address of the newly created minipool.
     * @param nodeAddress Address of the node operator.
     * @param bond Amount of ETH bonded for the minipool.
     */
    function onMinipoolCreated(address newMinipoolAddress, address nodeAddress, uint256 bond) external {
        if (!_directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender)) {
            revert BadRole(Constants.CORE_PROTOCOL_ROLE, msg.sender);
        }

        // register minipool with node operator
        Whitelist whitelist = Whitelist(getDirectory().getWhitelistAddress());
        whitelist.registerNewValidator(nodeAddress);

        emit MinipoolCreated(newMinipoolAddress, nodeAddress);
    }

    /**
     * @dev Processes a single minipool by performing RPL top-up and distributing balance if certain conditions are met.
     */
    function _processNextMinipool() internal {
        SuperNodeAccount sna = SuperNodeAccount(_directory.getSuperNodeAddress());

        rebalanceRplStake(sna.totalEthStaking());

        /**
         * @dev We are only calling distributeBalance with a true flag to prevent griefing vectors. This ensures we
         * are only collecting skimmed rewards and not doing anything related to full withdrawals or finalizations.
         * One example is that if we pass false to distributeBalance, it opens a scenario where operators are forced to
         * finalize due to having more than 8 ETH. This could result in slashings from griefing vectors.
         */
        IMinipool minipool = sna.getNextMinipool();
        if (address(minipool) != address(0)) {
            uint256 totalBalance = address(minipool).balance - minipool.getNodeRefundBalance();
            if (totalBalance < 8 ether) {
                // track incoming eth
                uint256 initalBalance = _directory.getDepositPoolAddress().balance;
                minipool.distributeBalance(true);
                uint256 finalBalance = _directory.getDepositPoolAddress().balance;
                oracleError += finalBalance - initalBalance;
            }
        }
    }

    /**
     * @notice Sets the required ETH stake for activating a minipool.
     * @param _requiredLEBStaked Amount of ETH required.
     */
    function setBondRequirments(uint256 _requiredLEBStaked) external onlyAdmin {
        requiredLEBStaked = _requiredLEBStaked;
    }

    /**
     * @notice Sets the target ETH to RPL stake ratio.
     * @dev Adjusts the target ratio used to maintain balance between ETH and RPL stakes.
     * @param _targetStakeRatio The new target stake ratio to be set.
     */
    function setTargetStakeRatio(uint256 _targetStakeRatio) external onlyAdmin {
        targetStakeRatio = _targetStakeRatio;
    }

    /**
     * @notice Handles the destruction of a minipool by a node operator.
     * @param _nodeOperator Address of the node operator.
     * @param _bond Amount of ETH bonded that needs to be subtracted from the total funded ETH.
     */
    function onNodeMinipoolDestroy(address _nodeOperator, uint256 _bond) external onlyProtocol {
        fundedEth -= _bond;
    }

    /**
     * @notice Transfers WETH to a specified vault, provided the contract has enough balance.
     * @param _amount Amount of WETH to transfer.
     * @return uint256 Amount of WETH transferred.
     */
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

    /**
     * @notice Resets the oracle error.
     */
    function resetOracleError() external onlyProtocol {
        oracleError = 0;
    }

    /**
     * @notice Transfers RPL to a specified vault, provided the contract has enough balance.
     * @param _amount Amount of RPL to transfer.
     * @return uint256 Amount of RPL transferred.
     */
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
