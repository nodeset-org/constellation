// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../UpgradeableBase.sol';
import '../Whitelist/Whitelist.sol';
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
import '../Interfaces/RocketPool/IRocketDAOProtocolSettingsMinipool.sol';

/**
 * @title OperatorDistributor
 * @author Theodore Clapp, Mike Leach
 * @dev Manages distribution and staking of ETH and RPL tokens for 
 * decentralized node operators to stake with a single Rocket Pool "supernode".
 * Serves as the withdrawal address for the SuperNode and has functions for rebalancing liquidity across the protocol.
 * Serves as the withdrawal address for the SuperNode and has functions for rebalancing liquidity across the protocol.
 * Inherits from UpgradeableBase and Errors to use their functionalities for upgradeability and error handling.
 */
contract OperatorDistributor is UpgradeableBase, Errors {
    event WarningNoMiniPoolsToHarvest();
    event SuspectedPenalizedMinipoolExit(address minipool);

    event WarningMinipoolNotStaking(
        address indexed _minipoolAddress,
        MinipoolStatus indexed _status,
        bool indexed _isFinalized
    );

    using Math for uint256;

    // Target ratio of SuperNode's bonded ETH to RPL stake.
    // RPL will be staked if the stake balance is below this and unstaked if the balance is above.
    uint256 public targetStakeRatio;
    
    /**
     * @notice Sets the target ratio of the SuperNode's bonded ETH to RPL stake.
     * @dev RPL will be staked or unstaked to try to reach this ratio during some common state changes. 
     * See rebalanceRplStake()
     * @param _targetStakeRatio The new target stake ratio to be set.
     */
    function setTargetStakeRatio(uint256 _targetStakeRatio) external onlyAdmin {
        targetStakeRatio = _targetStakeRatio;
    }

    // Minimum ratio of matched rETH to RPL stake allowed in the node.
    uint256 public minimumStakeRatio;

    /**
     * @notice Sets the minimum ratio of matched rETH to RPL stake allowed in the node.
     * @dev minipools can't be created if the new stake ratio would be below this amount.
     * @param _minimumStakeRatio The new minimum stake ratio to be set.
     */
    function setMinimumStakeRatio(uint256 _minimumStakeRatio) external onlyAdmin {
        minimumStakeRatio = _minimumStakeRatio;
    }

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

    // Index for the current minipool being processed
    uint256 public currentMinipool;

    // The amount the oracle has already included in its summation
    // This is important to track because when a minipool is skimmed, its balance will have 
    // been reported already by the oracle, so there will be an extra amount of ETH TVL reported
    // otherwise
    uint256 public oracleError;

    /**
     * VIEWS
     */

    /**
     * @notice Returns the total ETH and WETH managed by the contract, including both the ETH+WETH balances of this contract 
     * @notice Returns the total ETH and WETH managed by the contract, including both the ETH+WETH balances of this contract 
     * and the SuperNode's staked ETH.
     * @return uint256 Total amount of ETH under the management of the contract.
     */
    function getTvlEth() public view returns (uint) {
        return address(this).balance + IWETH(_directory.getWETHAddress()).balanceOf(address(this)) + SuperNodeAccount(_directory.getSuperNodeAddress()).getTotalEthStaked();
    }

    /**
     * @notice Returns the total RPL managed by the contract, including both the balance of this contract 
     * and the SuperNode's staked RPL.
     * @return uint256 Total amount of RPL under the management of the contract.
     */
    function getTvlRpl() public view returns (uint) {
        return IERC20(_directory.getRPLAddress()).balanceOf(address(this)) + IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).getTotalRPLStake();
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
     * @dev This function helps read state for the rotation and handling of different minipools within the system.
     * @return IMinipool Returns the next minipool to process. Returns a binding to the zero address if there are no minipools.
     */
    function getNextMinipool() public view returns (IMinipool) {
        SuperNodeAccount sna = SuperNodeAccount(getDirectory().getSuperNodeAddress());
        if (sna.getNumMinipools() == 0) {
            return IMinipool(address(0));
        }
        return IMinipool(sna.minipools(currentMinipool % sna.getNumMinipools()));
    }


    /**
     * PUBLIC ACTIONS
     */

    receive() external payable {}

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
        
        // need to stake more
        if (targetStake > rplStaked) {
            uint256 stakeIncrease = targetStake - rplStaked;
            if (stakeIncrease == 0) return;

            uint256 currentRplBalance = IERC20(_directory.getRPLAddress()).balanceOf(address(this));

            if (currentRplBalance >= stakeIncrease) {
                this.stakeRpl(stakeIncrease);
            } else {
                // stake what we have
                if (currentRplBalance == 0) return;
                this.stakeRpl(currentRplBalance);
            }
        }

        // need to unstake
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
                this.unstakeRpl(excessRpl);
            }
        }
    }

    /**
     * @notice Process the next minipool in line, then increments currentMinipool.
     * Handles RPL rebalancing and minipool distribution based on minipool's current state.
     * Although this can be called manually, this typically happens automatically as part of other state changes
     * like claiming NO fees or depositing/withdrawing from the token vaults.
     * See processMinipool() for more info (this is a very important function).
     */
    function processNextMinipool() public {
        IMinipool nextMinipool = getNextMinipool();
        if (address(nextMinipool) == address(0)) {
            // Nothing to do
            return;
        }
        processMinipool(nextMinipool);
        currentMinipool = currentMinipool + 1 < SuperNodeAccount(getDirectory().getSuperNodeAddress()).getNumMinipools() ? currentMinipool + 1 : 0;
    }
    
    /**
     * @custom:author Mike Leach (Wander)
     * @notice This is the "tick" function of the protocol. It's the heartbeat of Constellation, called every time there is a major state change:
     * - Deposits and withdrawals from the xrETH and xRPL vaults
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
        require(sna.getIsMinipoolRecognized(address(minipool)), "Must be a minipool managed by Constellation"); 

        this.rebalanceRplStake(sna.getTotalEthStaked());

        MinipoolStatus status = minipool.getStatus();

        if (minipool.getFinalised() || status != MinipoolStatus.Staking) {
            return;
        }
        
        // get refs and data
        (, uint256 treasuryFee, uint256 noFee, ) = sna.minipoolData(address(minipool));   

        // determine the difference in node share and remaining bond amount
        uint256 depositBalance = minipool.getNodeDepositBalance();
        // if nodeshare - original deposit is <= 0 then it's an exit but there are no rewards (it's been penalized)
        uint256 rewards = 0;

        // In Constellation, the node refund balance is assumed to be 100% rewards, but this isn't always true in RP 
        // there are three cases, none of which should be possible in Constellation:
        // - LEB bond reductions
        // - depositType == MinipoolDeposit.Full
        // - prepareVacancy() -- used for solo node migrations to RP
        uint256 balanceAfterRefund = address(minipool).balance - minipool.getNodeRefundBalance();

        if(balanceAfterRefund >= depositBalance) { // it's an exit
            // In case there is a penalty, just return so it can be handled manually.
            // This prevents the case where someone sends 8 ETH to the minipool and it's automatically closed, 
            // causing RP to think it's been slashed for 24 ETH even though the validator is still operating
            if(address(minipool).balance < IRocketDAOProtocolSettingsMinipool(getDirectory().getRocketDAOProtocolSettingsMinipool()).getLaunchBalance()) {
                emit SuspectedPenalizedMinipoolExit(address(minipool));
                return;
            }

            this.distributeExitedMinipool(minipool);
            
        } else if (balanceAfterRefund < depositBalance) { // it's still staking
            uint256 priorBalance = address(this).balance;
            // withdrawal address calls distributeBalance(true)
            minipool.distributeBalance(true);
            // calculate rewards
            rewards = address(this).balance > priorBalance ? address(this).balance - priorBalance : 0;
            this.onEthBeaconRewardsReceived(rewards, treasuryFee, noFee);
        }
 
        this.rebalanceWethVault();
    }

    /**
     * INTERNAL
     */

    /// @notice Unstakes a specified amount of RPL tokens.
    /// @dev This function unstakes a specified amount of RPL tokens from the Rocket Node Staking contract.
    /// @param _amount The amount of RPL tokens to unstake.
    /// @dev The tokens will be withdrawn from the Rocket Node Staking contract into this contract. 
    /// Outside callers MUST call onRplBalanceIncrease or onRplBalanceDecrease to appropriately account for this.
    function unstakeRpl(uint256 _amount) external onlyProtocol {
        IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).withdrawRPL(getDirectory().getSuperNodeAddress(), _amount);
    }

    /// @notice Stakes a specified amount of RPL tokens on behalf of the SuperNode.
    /// @dev This function allows the protocol to stake a specified amount of RPL tokens on the SuperNode
    ///      using the Rocket Node Staking contract.
    /// @param _amount The amount of RPL tokens to stake.
    /// @dev This function ensures that the specified amount of RPL tokens is approved and then staked 
    /// for the SuperNode.
    function stakeRpl(uint256 _amount) external onlyProtocol {
        SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), _directory.getRocketNodeStakingAddress(), 0);
        SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), _directory.getRocketNodeStakingAddress(), _amount);
        IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).stakeRPLFor(getDirectory().getSuperNodeAddress(), _amount);
    }

    /// @notice Distributes ETH to the vault and operator distributor.
    /// @dev This function converts the WETH balance to ETH, sends the required capital to the vault, 
    /// and the surplus ETH to the OperatorDistributor.
    function rebalanceWethVault() public onlyProtocol {
        IWETH weth = IWETH(_directory.getWETHAddress());

        // Initialize the vault and operator distributor addresses
        WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());

        uint256 requiredWeth = vweth.getMissingLiquidity();
        console.log("rebalancing by sending", requiredWeth, "from OD to WETHVault");
        uint256 wethBalance = IERC20(address(weth)).balanceOf(address(this));
        uint256 balanceEthAndWeth = IERC20(address(weth)).balanceOf(address(this)) + address(this).balance;
        console.log("balanceEthAndWeth", balanceEthAndWeth);
        if (balanceEthAndWeth >= requiredWeth) { 
            // there's extra ETH that can be kept here for minipools, so only send required amount
            // figure out how much to wrap, then wrap it
            uint256 wrapNeeded = requiredWeth > wethBalance ? requiredWeth - wethBalance : 0;
            if(wrapNeeded != 0) 
                weth.deposit{value: wrapNeeded}();
            // send amount needed to vault
            SafeERC20.safeTransfer(weth, address(vweth), requiredWeth);
            // unwrap the remaining balance to keep for minipool creation
            weth.withdraw(IERC20(address(weth)).balanceOf(address(this)));
        } else { 
            // not enough available to fill up the liquidity reserve, so send everything we can
            // wrap everything in this contract and give back to the WethVault for liquidity
            weth.deposit{value: address(this).balance}();
            SafeERC20.safeTransfer(IERC20(address(weth)), address(vweth), address(this).balance);
        }
    }

    /// @notice Distributes RPL to the vault and operator distributor.
    /// @dev This function transfers the required RPL capital to the vault and any surplus RPL to the operator distributor.
    function rebalanceRplVault() public onlyProtocol {

        // Initialize the RPLVault and the Operator Distributor addresses
        RPLVault vrpl = RPLVault(getDirectory().getRPLVaultAddress());

        IERC20 rpl = IERC20(_directory.getRPLAddress());
        uint256 rplBalance = rpl.balanceOf(address(this));

        // Fetch the required capital in RPL and the total RPL balance of the contract
        uint256 requiredRpl = vrpl.getRequiredCollateral();

        // Transfer RPL to the RPLVault
        if (rplBalance >= requiredRpl) { 
            // there's extra that can be kept here for minipools, so only send required amount
            SafeERC20.safeTransfer(IERC20(address(rpl)), address(vrpl), requiredRpl);
        } else { 
            // not enough here to fill up the liquidity reserve, so send everything we can
            SafeERC20.safeTransfer(IERC20(address(rpl)), address(vrpl), rplBalance);
        }
    }

    /// @notice Called by the protocol when a minipool is distributed to this contract, which acts as the SuperNode 
    /// withdrawal address for both ETH and RPL from Rocket Pool.
    /// Splits incoming assets up among the Treasury, YieldDistributor, and the WETHVault/OperatorDistributor based on the 
    /// rewardsAmount expected.
    /// @param rewardAmount amount of ETH rewards expected
    /// @param avgTreasuryFee Average treasury fee for the rewards received across all the minipools the rewards came from
    /// @param avgOperatorsFee Average operator fee for the rewards received across all the minipools the rewards came from
    function onEthBeaconRewardsReceived(uint256 rewardAmount, uint256 avgTreasuryFee, uint256 avgOperatorsFee) public onlyProtocol {
        if(rewardAmount == 0)
            return;

        uint256 treasuryPortion = rewardAmount.mulDiv(avgTreasuryFee, 1e18);
        uint256 nodeOperatorPortion = rewardAmount.mulDiv(avgOperatorsFee, 1e18);

        (bool success, ) = getDirectory().getTreasuryAddress().call{value: treasuryPortion}('');
        require(success, 'Transfer to treasury failed');

        (bool success2, ) = getDirectory().getOperatorRewardAddress().call{value: nodeOperatorPortion}('');
        require(success2, 'Transfer to operator fee address failed');

        uint256 xrETHPortion = rewardAmount - treasuryPortion - nodeOperatorPortion;

        OperatorDistributor(getDirectory().getOperatorDistributorAddress()).onIncreaseOracleError(xrETHPortion);
    }

    /// @notice Finalizes and distributes the balance of an exited minipool.
    /// @dev Callable by the admin in case there is a need for manual finalization of an exited minipool.
    /// This should only happen if the minipool was slashed or otherwise penalized so the balance is below 32 ETH upon exit.
    /// Otherwise, the processNextMinipool() function would finalize the minipool normally with this function.
    function distributeExitedMinipool(IMinipool minipool) public onlyProtocolOrAdmin {
        SuperNodeAccount sna = SuperNodeAccount(getDirectory().getSuperNodeAddress());
       
        uint256 balanceAfterRefund = address(minipool).balance - minipool.getNodeRefundBalance();
        uint256 rewards = minipool.calculateNodeShare(balanceAfterRefund) >  minipool.getNodeDepositBalance() 
            ? minipool.calculateNodeShare(balanceAfterRefund) -  minipool.getNodeDepositBalance()
            : 0;

        minipool.distributeBalance(false);
        // decrement validator count for operator
        
        // stop tracking minipool
        (address subNodeOperator, uint256 treasuryFee, uint256 noFee, ) = sna.minipoolData(address(minipool));   
        Whitelist(getDirectory().getWhitelistAddress()).removeValidator(subNodeOperator);
        sna.removeMinipool(address(minipool));
        // account for rewards 
        this.onEthBeaconRewardsReceived(rewards, treasuryFee, noFee);
    }

    /**
     * @notice Allocates the necessary liquidity for the creation of a new minipool.
     * @param _bond The amount of ETH required to be staked for the minipool.
     */
    function provisionLiquiditiesForMinipoolCreation(uint256 _bond) external onlyProtocol {
        rebalanceWethVault();
        rebalanceRplVault();

        require(_bond == SuperNodeAccount(getDirectory().getSuperNodeAddress()).bond(), 'OperatorDistributor: Bad _bond amount, should be `SuperNodeAccount.bond`');

        address superNode = _directory.getSuperNodeAddress();

        (bool success, bytes memory data) = superNode.call{value: _bond}('');
        if (!success) {
            revert LowLevelEthTransfer(success, data);
        }
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

    function transferMerkleClaimToStreamer(uint256 ethAmount, uint256 rplAmount) external onlyProtocol {
        (bool success, ) = getDirectory().getMerkleClaimStreamerAddress().call{value: ethAmount}('');
        require(success, "ETH transfer to MerkleClaimStreamer failed");

        SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), getDirectory().getMerkleClaimStreamerAddress(), rplAmount);
        SafeERC20.safeTransfer(IERC20(_directory.getRPLAddress()), getDirectory().getMerkleClaimStreamerAddress(), rplAmount);
    }
}
