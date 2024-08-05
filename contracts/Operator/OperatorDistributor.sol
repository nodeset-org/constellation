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
 * @dev Manages distribution and staking of ETH and RPL tokens for 
 * decentralized node operators to stake with a single Rocket Pool "supernode".
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

    // Target ratio of SuperNode's bonded ETH to RPL stake.
    // RPL will be staked if the stake balance is below this and unstaked if the balance is above.
    uint256 public targetStakeRatio;

    // Minimum ratio of matched rETH to RPL stake allowed in the node.
    uint256 public minimumStakeRatio;

    // The amount the oracle has already included in its summation
    // This is important to track because when a minipool is skimmed, its balance will have 
    // been reported already by the oracle, so there will be an extra amount of ETH TVL reported
    // otherwise
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
        targetStakeRatio = 0.6e18; // 60% of bonded ETH by default.
        minimumStakeRatio = 0.15e18; // 15% of matched ETH by default
    }

    /**
     * @notice Rebalances liquidity by transferring all collected ETH and RPL tokens to the AssetRouter.
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
     * @notice Returns the total ETH managed by the contract, including both the balance of this contract 
     * and the SuperNode's staked ETH.
     * @return uint256 Total amount of ETH under the management of the contract.
     */
    function getTvlEth() public view returns (uint) {
        return balanceEth + SuperNodeAccount(_directory.getSuperNodeAddress()).getTotalEthStaked();
    }

    /**
     * @notice Returns the total RPL managed by the contract, including both the balance of this contract 
     * and the SuperNode's staked RPL.
     * @return uint256 Total amount of RPL under the management of the contract.
     */
    function getTvlRpl() public view returns (uint) {
        return balanceRpl + IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).getTotalRPLStake();
    }

    /**
     * @notice Allocates the necessary liquidity for the creation of a new minipool.
     * @param _bond The amount of ETH required to be staked for the minipool.
     */
    function provisionLiquiditiesForMinipoolCreation(uint256 _bond) external onlyProtocol {
        console.log('provisionLiquiditiesForMinipoolCreation.pre-RebalanceLiquidities');
        _rebalanceLiquidity();
        console.log('provisionLiquiditiesForMinipoolCreation.post-RebalanceLiquidities');
        require(_bond == SuperNodeAccount(getDirectory().getSuperNodeAddress()).bond(), 'OperatorDistributor: Bad _bond amount, should be `SuperNodeAccount.bond`');

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
     * @notice Adjusts the RPL stake of the SuperNode to maintain the target RPL stake ratio based on the current ETH price
     *  and staking metrics.
     * @dev Anyone can call to rebalance the current stake, but normally called during processMinipool() or minipool creation. 
     * @param _ethStaked Amount of ETH currently staked in the SuperNode.
     */
    function rebalanceRplStake(uint256 _ethStaked) public {
        address _nodeAccount = _directory.getSuperNodeAddress();

        IRocketNodeStaking rocketNodeStaking = IRocketNodeStaking(_directory.getRocketNodeStakingAddress());
        uint256 rplStaked = rocketNodeStaking.getNodeRPLStake(_nodeAccount);
        uint256 lockedStake = rocketNodeStaking.getNodeRPLLocked(_nodeAccount);

        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        uint256 targetStake = targetStakeRatio.mulDiv(_ethStaked * ethPriceInRpl, 1e18 * 10 ** 18);
        
        // stake more
        if (targetStake > rplStaked) {
            uint256 stakeIncrease = targetStake - rplStaked;
            if (stakeIncrease == 0) return;

            uint256 currentRplBalance = balanceRpl;

            if (currentRplBalance >= stakeIncrease) {
                // transfer RPL to asset router
                IERC20(_directory.getRPLAddress()).transfer(_directory.getAssetRouterAddress(), stakeIncrease);
                AssetRouter(_directory.getAssetRouterAddress()).stakeRpl(stakeIncrease);
                balanceRpl -= stakeIncrease;

            } else {
                // stake what we have
                if (currentRplBalance == 0) return;
                IERC20(_directory.getRPLAddress()).transfer(_directory.getAssetRouterAddress(), balanceRpl);
                AssetRouter(_directory.getAssetRouterAddress()).stakeRpl(balanceRpl);
                balanceRpl = 0;
            }
        }

        // unstake
        if (targetStake < rplStaked) {
            uint256 elapsed = block.timestamp -
                IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).getNodeRPLStakedTime(_nodeAccount);

            uint256 excessRpl = rplStaked - targetStake;
            bool noShortfall = rplStaked - excessRpl - lockedStake >=
                rocketNodeStaking.getNodeMaximumRPLStake(_nodeAccount);
            if (
                elapsed >=
                IRocketDAOProtocolSettingsRewards(_directory.getRocketDAOProtocolSettingsRewardsAddress())
                    .getRewardsClaimIntervalTime() &&
                noShortfall
            ) {
                // NOTE: to auditors: double check that all cases are covered such that unstakeRpl will not revert execution
                balanceRpl += excessRpl;
                AssetRouter(_directory.getAssetRouterAddress()).unstakeRpl(excessRpl);
            } else {
                console.log('failed to rebalanceRplStake.excessRpl', excessRpl);
            }
            console.log('excessRpl', excessRpl);
            console.log('noShortfall', noShortfall);
        }
    }

    /**
     * @notice Calculates the additional RPL needed to maintain the minimum staking ratio.
     * @param _existingRplStake Current amount of RPL staked by the node.
     * @param _rpEthMatched Amount of ETH currently staked by the node.
     * @return requiredStakeRpl Amount of additional RPL needed to reach the minimumStakeRatio.
     */
    function calculateRplStakeShortfall(
        uint256 _existingRplStake,
        uint256 _rpEthMatched
    ) public view returns (uint256 requiredStakeRpl) {
        console.logAddress(getDirectory().getPriceFetcherAddress());
        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();
        uint256 matchedStakeRatio = _existingRplStake == 0
            ? 0
            : ((_rpEthMatched * ethPriceInRpl * 1e18) / _existingRplStake) / 1e18;
        if (matchedStakeRatio < minimumStakeRatio) {
            uint256 minuend = minimumStakeRatio.mulDiv(_rpEthMatched * ethPriceInRpl, 1e18 * 10 ** 18);
            requiredStakeRpl = minuend < _existingRplStake ? 0 : minuend - _existingRplStake;
        } else {
            requiredStakeRpl = 0;
        }
    }

    /**
     * @notice Calculates the maximum RPL that can be withdrawn while maintaining the target staking ratio.
     * @dev Used for tests
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
     * Handles RPL rebalancing and minipool distribution based on minipool's current state.
     * Although this can be called manually, this typically happens automatically as part of other state changes
     * like claiming NO fees or depositing/withdrawing from the token vaults.
     * See processMinipool() for more info (this is a very important function).
     */
    function processNextMinipool() public {
        processMinipool(SuperNodeAccount(getDirectory().getSuperNodeAddress()).getNextMinipool());
    }

    /**
     * @notice Handles the creation of a minipool and emits the event.
     * @param newMinipoolAddress Address of the newly created minipool.
     * @param nodeAddress Address of the node operator.
     */
    function onMinipoolCreated(address newMinipoolAddress, address nodeAddress) external onlyProtocol {
        // register minipool with node operator
        Whitelist whitelist = Whitelist(getDirectory().getWhitelistAddress());
        whitelist.registerNewValidator(nodeAddress);

        emit MinipoolCreated(newMinipoolAddress, nodeAddress);
    }

    /**
     * @custom:author Mike Leach (Wander)
     * @notice This is the "tick" function of the protocol. It's the heartbeat of Constellation, called every time there is a major state change:
     * - Deposits and withdrawals from the xrETH and xRPL vaults
     * - When operators are added or removed
     * - When operators claim rewards
     * @dev Performs a RPL stake rebalance for the node and distributes the outstanding balance for a minipool.
     */
    function processMinipool(IMinipool minipool) public {
        if (address(minipool) == address(0)) {
            return; // should only happen if there are no miniopools in the system
        }
        if (address(minipool).balance == 0) {
            return;
        }
        SuperNodeAccount sna = SuperNodeAccount(_directory.getSuperNodeAddress());
        require(sna.minipoolIndex(address(minipool)) < sna.getNumMinipools(), "Must be a minipool managed by Constellation");

        if(YieldDistributor(getDirectory().getYieldDistributorAddress()).getIsEndOfIntervalTime() &&
            YieldDistributor(getDirectory().getYieldDistributorAddress()).yieldAccruedInInterval() > 0 && 
            YieldDistributor(getDirectory().getYieldDistributorAddress()).currentInterval() != 0){
            YieldDistributor(getDirectory().getYieldDistributorAddress()).finalizeInterval(); // finalize the interval and process over there instead
            return;
        }

        rebalanceRplStake(sna.getTotalEthStaked());

        MinipoolStatus status = minipool.getStatus();

        if (minipool.getFinalised() || status != MinipoolStatus.Staking) {
            return;
        }
        
        // get refs and data
        AssetRouter ar = AssetRouter(_directory.getAssetRouterAddress());
        (, uint256 treasuryFee, uint256 noFee, ) = sna.minipoolData(address(minipool));   

        // allow deposits into AssetRouter
        ar.openGate();

        console.log('balance of minipool contract', address(minipool).balance);

        // determine the difference in node share and remaining bond amount
        uint256 depositBalance = minipool.getNodeDepositBalance();
        console.log('depositBalance', depositBalance);
        // if nodeshare - original deposit is <= 0 then it's an exit but there are no rewards (it's been penalized)
        uint256 rewards = 0;
        uint256 balanceAfterRefund = address(minipool).balance - minipool.getNodeRefundBalance();
        //uint256 totalBalance = IRocketDAOProtocolSettingsMinipool(getDirectory().getRocketDAOProtocolSettingsMinipool()).getLaunchBalance() + balanceAfterRefund;
        
        if(balanceAfterRefund >= depositBalance) { // it's an exit, and any extra nodeShare is rewards
            console.log("MINIPOOL STATUS: exited");
            uint256 remainingBond = minipool.calculateNodeShare(balanceAfterRefund) < depositBalance ? minipool.calculateNodeShare(balanceAfterRefund) : depositBalance;
            rewards = minipool.calculateNodeShare(balanceAfterRefund) > depositBalance ? minipool.calculateNodeShare(balanceAfterRefund) - depositBalance : 0;  
            console.log('exit rewards expected', rewards);
            console.log('node share of bond', minipool.calculateNodeShare(balanceAfterRefund));
            // withdrawal address calls distributeBalance(false)
            ar.onExitedMinipool(minipool);
            // stop tracking
            this.onNodeMinipoolDestroy(sna.getSubNodeOpFromMinipool(address(minipool)));
            // both bond and rewards are received
            ar.onEthRewardsAndBondReceived(rewards, remainingBond, treasuryFee, noFee);
        } else if (balanceAfterRefund < depositBalance) { // it's still staking
            console.log("MINIPOOL STATUS: still staking");
            rewards = minipool.calculateNodeShare(balanceAfterRefund);
            // withdrawal address calls distributeBalance(true)
            ar.onClaimSkimmedRewards(minipool);
            // calculate only rewards
            ar.onEthRewardsReceived(rewards, treasuryFee, noFee);
        }
        console.log('rewards recieved', rewards);   
        ar.sendEthToDistributors(); 
        // lock down AssetRouter again
        ar.closeGate();
    }

    /**
     * @notice Sets the target ratio of the SuperNode's bonded ETH to RPL stake.
     * @dev RPL will be staked or unstaked to try to reach this ratio during some common state changes. 
     * See rebalanceRplStake()
     * @param _targetStakeRatio The new target stake ratio to be set.
     */
    function setTargetStakeRatio(uint256 _targetStakeRatio) external onlyAdmin {
        targetStakeRatio = _targetStakeRatio;
    }

    /**
     * @notice Sets the minimum ratio of matched rETH to RPL stake allowed in the node.
     * @dev minipools can't be created if the new stake ratio would be below this amount.
     * @param _minimumStakeRatio The new minimum stake ratio to be set.
     */
    function setMinimumStakeRatio(uint256 _minimumStakeRatio) external onlyAdmin {
        minimumStakeRatio = _minimumStakeRatio;
    }

    /**
     * @notice Handles the destruction of a minipool.
     * @param _nodeOperator Address of the sub node operator that created the minipool.
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
    }

    function onRplBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceRpl -= _amount;
    }
}
