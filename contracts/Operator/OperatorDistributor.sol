// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../UpgradeableBase.sol';
import '../Whitelist/Whitelist.sol';
import '../AssetRouter.sol';
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
    event MinipoolDestroyed(address indexed _minipoolAddress);
    event WarningNoMiniPoolsToHarvest();

    event WarningMinipoolNotStaking(
        address indexed _minipoolAddress,
        MinipoolStatus indexed _status,
        bool indexed _isFinalized
    );

    using Math for uint256;

    // Target ratio of ETH to RPL stake.
    // RPL will be staked if the stake balance is below this and unstaked if the balance is above.
    uint256 public targetStakeRatio;

    // Minimum ratio of ETH to RPL stake.
    uint256 public minimumStakeRatio;

    // Required amount of ETH staked for a minipool to be active.
    uint256 public requiredLEBStaked;

    // The amount the oracle has already included in its summation
    uint256 public oracleError;

    uint256 public balanceEth;
    uint256 public balanceRpl;

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
        targetStakeRatio = 0.6e18; // 60% of bonded ETH by default.
        minimumStakeRatio = 0.15e18; // 15% of matched ETH by default
        requiredLEBStaked = 8 ether; // Default to 8 ETH to align with specific minipool configurations.
    }

    /**
     * @notice Fallback function to handle incoming Ether transactions.
     */
    receive() external payable {
        revert('To fund this contract, please deposit into WETHVault instead.');
    }

    /**
     * @notice Rebalances liquidity by transferring all collected ETH and RPL tokens to the deposit pool.
     * @dev Calls to external contracts for transferring balances and ensures successful execution of these calls.
     */
    function _rebalanceLiquidity() internal nonReentrant {
        AssetRouter ar = AssetRouter(_directory.getAssetRouterAddress());

        IWETH weth = IWETH(_directory.getWETHAddress());
        weth.deposit{value: balanceEth}();

        SafeERC20.safeTransfer(weth, address(ar), balanceEth);
        ar.onWethBalanceIncrease(balanceEth);
        balanceEth = 0;
        ar.sendEthToDistributors();

        IERC20 rpl = IERC20(_directory.getRPLAddress());
        SafeERC20.safeTransfer(rpl, address(ar), balanceRpl);
        ar.onRplBalanceIncrease(balanceRpl);
        balanceRpl = 0;
        ar.sendRplToDistributors();
    }

    /**
     * @notice Returns the total ETH held by the contract, including both the balance of this contract and the staked ETH.
     * @return uint256 Total amount of ETH under the management of the contract.
     */
    function getTvlEth() public view returns (uint) {
        return balanceEth + SuperNodeAccount(_directory.getSuperNodeAddress()).getTotalEthStaked();
    }

    /**
     * @notice Returns the total RPL held by the contract, including both the balance of this contract and the staked RPL.
     * @return uint256 Total amount of RPL under the management of the contract.
     */
    function getTvlRpl() public view returns (uint) {
        return balanceRpl + IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).getTotalRPLStake();
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

        address superNode = _directory.getSuperNodeAddress();

        console.log('od.provisionLiquiditiesForMinipoolCreation.balanceEth', balanceEth);
        console.log('od.provisionLiquiditiesForMinipoolCreation.balance', address(this).balance);
        console.log(
            'od.provisionLiquiditiesForMinipoolCreation.balanceOf.weth',
            IERC20(_directory.getWETHAddress()).balanceOf(address(this))
        );

        (bool success, bytes memory data) = superNode.call{value: _bond}('');
        if (!success) {
            console.log('LowLevelEthTransfer 1');
            console.log('balance eth', address(this).balance);
            console.log(_bond);
            revert LowLevelEthTransfer(success, data);
        }

        balanceEth -= _bond;
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

        console.log('rebalanceRplStake.targetStakeRatio', targetStakeRatio);

        uint256 targetStake = targetStakeRatio.mulDiv(_ethStaked * ethPriceInRpl, 1e18 * 10 ** 18);
        console.log('od.rebalanceRplStake.targetStake', targetStake);
        if (targetStake > rplStaked) {
            // stake more
            uint256 stakeIncrease = targetStake - rplStaked;
            console.log('rebalanceRplStake.stakeIncrease', stakeIncrease);
            console.log('od.rebalanceRplStake.balanceOf', IERC20(_directory.getRPLAddress()).balanceOf(address(this)));
            console.log('od.rebalanceRplStake.balanceRpl', balanceRpl);

            _performTopUp(_nodeAccount, stakeIncrease);
            console.log('rebalanceRplStake.actualStakeIncrease', stakeIncrease);
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
                console.log('rebalanceRplStake.excessRpl', excessRpl);
                balanceRpl += excessRpl;
                AssetRouter(_directory.getAssetRouterAddress()).unstakeRpl(_nodeAccount, excessRpl);
            } else {
                console.log('failed to rebalanceRplStake.excessRpl', excessRpl);
            }
            console.log('excessRpl', excessRpl);
            console.log('noShortfall', noShortfall);
        }
        console.log('finished rebalanceRplStake.targetStake', targetStake);
        console.log('finished rebalanceRplStake.rplStaked', rplStaked);
    }

    function _performTopUp(address _superNode, uint256 _requiredStake) internal returns (uint256) {
        uint256 currentRplBalance = balanceRpl;
        console.log('_performTopUp.currentRplBalance', currentRplBalance);
        console.log('od._performTopup.balanceOf', IERC20(_directory.getRPLAddress()).balanceOf(address(this)));
        if (currentRplBalance >= _requiredStake) {
            if (_requiredStake == 0) {
                return 0;
            }
            // stakeRPLOnBehalfOf
            // transfer RPL to deposit pool
            IERC20(_directory.getRPLAddress()).transfer(_directory.getAssetRouterAddress(), _requiredStake);
            AssetRouter(_directory.getAssetRouterAddress()).stakeRPLFor(_superNode, _requiredStake);
            balanceRpl -= _requiredStake;
            console.log('_performTopUp._requiredStake', _requiredStake);
            return _requiredStake;
        } else {
            if (currentRplBalance == 0) {
                return 0;
            }
            // stake what we have
            console.log('od._performTopup.balanceRpl', balanceRpl);
            console.log('od._performTopup.balanceOf', IERC20(_directory.getRPLAddress()).balanceOf(address(this)));
            IERC20(_directory.getRPLAddress()).transfer(_directory.getAssetRouterAddress(), balanceRpl);
            AssetRouter(_directory.getAssetRouterAddress()).stakeRPLFor(_superNode, balanceRpl);
            balanceRpl = 0;
            console.log('_performTopUp.currentRplBalance', balanceRpl);
            return currentRplBalance;
        }
    }

    /**
     * @notice Calculates the additional RPL needed to maintain the minimum staking ratio.
     * @param _existingRplStake Current amount of RPL staked by the node.
     * @param _rpEthMatched Amount of ETH currently staked by the node.
     * @return requiredStakeRpl Amount of additional RPL needed.
     */
    function calculateRplStakeShortfall(
        uint256 _existingRplStake,
        uint256 _rpEthMatched
    ) public view returns (uint256 requiredStakeRpl) {
        console.log('existing rpl staked', _existingRplStake);
        console.log('_rpEthMatched', _rpEthMatched);
        console.logAddress(getDirectory().getPriceFetcherAddress());
        console.log('B');
        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();
        console.log('price', ethPriceInRpl);
        uint256 matchedStakeRatio = _existingRplStake == 0
            ? 0
            : ((_rpEthMatched * ethPriceInRpl * 1e18) / _existingRplStake) / 1e18;
        console.log('matchedStakeRatio', matchedStakeRatio);
        console.log('minimumStakeRatio', minimumStakeRatio);
        if (matchedStakeRatio < minimumStakeRatio) {
            uint256 minuend = minimumStakeRatio.mulDiv(_rpEthMatched * ethPriceInRpl, 1e18 * 10 ** 18);
            console.log('calculateRplStakeShortfall.minuend', minuend);
            requiredStakeRpl = minuend < _existingRplStake ? 0 : minuend - _existingRplStake;
        } else {
            requiredStakeRpl = 0;
        }
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
            uint256 maxRplStake = targetStakeRatio.mulDiv(_ethStaked * ethPriceInRpl, 1e18 * 10 ** 18);
            withdrawableStakeRpl = _existingRplStake > maxRplStake ? _existingRplStake - maxRplStake : 0;
        } else {
            withdrawableStakeRpl = 0;
        }
        return withdrawableStakeRpl;
    }

    /**
     * @notice Process the next minipool in line.
     * Handles RPL top-up and balance distribution based on minipool's current state.
     * Although this can be called manually, this typically happens automatically as part of other state changes
     * like claiming NO fees or depositing/withdrawing from the token vaults.
     */
    function processNextMinipool() external {
        _processNextMinipool();
    }

    /**
     * @notice Handles the creation of a minipool, registers the node, and logs the event.
     * @param newMinipoolAddress Address of the newly created minipool.
     * @param nodeAddress Address of the node operator.
     */
    function onMinipoolCreated(address newMinipoolAddress, address nodeAddress) external {
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

        rebalanceRplStake(sna.getTotalEthStaked());

        IMinipool minipool = sna.getNextMinipool();
        if (address(minipool) == address(0)) {
            return;
        }

        MinipoolStatus status = minipool.getStatus();
        if (minipool.getFinalised() || status != MinipoolStatus.Staking) {
            return;
        }

        uint256 totalBalance = address(minipool).balance - minipool.getNodeRefundBalance();
        if (totalBalance == 0) {
            return;
        }

        AssetRouter ar = AssetRouter(_directory.getAssetRouterAddress());
        ar.openGate();
        uint256 initialBalance = address(ar).balance;

        
        if (totalBalance < 8 ether) {
            // minipool is still staking
            console.log('withdrawal address before skim', _directory.getAssetRouterAddress().balance);
            ar.onClaimSkimmedRewards(minipool);
            console.log('withdrawal address after skim', _directory.getAssetRouterAddress().balance);
        } else {
            // the minipool is exited
            ar.onExitedMinipool(minipool);
            this.onNodeMinipoolDestroy(sna.getSubNodeOpFromMinipool(address(minipool)));
        }

        uint256 finalBalance = address(ar).balance;
        ar.closeGate();
        console.log('finalBalance', finalBalance);
        console.log('initialBalance', initialBalance);
        uint256 rewards = finalBalance - initialBalance;
        console.log('rewards recieved', rewards);
        ar.onEthRewardsReceived(rewards, address(minipool));
    }

    /**
     * @notice Sets the required ETH stake for activating a minipool.
     * @param _requiredLEBStaked Amount of ETH required.
     */
    function setBondRequirements(uint256 _requiredLEBStaked) external onlyAdmin {
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
     * @notice Sets the minimum ETH to RPL stake ratio.
     * @dev Adjusts the minimum ratio used to maintain balance between ETH and RPL stakes.
     * Minipools can't be created if the new stake ratio would be below this amount.
     * @param _minimumStakeRatio The new minimum stake ratio to be set.
     */
    function setMinimumStakeRatio(uint256 _minimumStakeRatio) external onlyAdmin {
        minimumStakeRatio = _minimumStakeRatio;
    }

    /**
     * @notice Handles the destruction of a minipool by a node operator.
     * @param _nodeOperator Address of the node operator.
     */
    function onNodeMinipoolDestroy(address _nodeOperator) external onlyProtocol {
        Whitelist(getDirectory().getWhitelistAddress()).removeValidator(_nodeOperator);
        emit MinipoolDestroyed(_nodeOperator);
    }

    /**
     * @notice Resets the oracle error.
     */
    function resetOracleError() external onlyProtocol {
        oracleError = 0;
    }

    function onIncreaseOracleError(uint256 _amount) external onlyProtocol {
        oracleError += _amount;
    }

    function onEthBalanceIncrease(uint256 _amount) external payable onlyProtocol {
        require(msg.value == _amount, '_amount must match msg.value');
        balanceEth += _amount;
    }

    function onEthBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceEth -= _amount;
    }

    function onRplBalanceIncrease(uint256 _amount) external onlyProtocol {
        balanceRpl += _amount;
        console.log('od.onRplBalanceIncrease.newBalance is', balanceRpl);
        console.log('od.onRplBalanceIncrease.balanceOf', IERC20(_directory.getRPLAddress()).balanceOf(address(this)));
    }

    function onRplBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceRpl -= _amount;
    }
}
