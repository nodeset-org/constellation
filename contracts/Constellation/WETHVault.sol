// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';

import './RPLVault.sol';
import './Utils/PriceFetcher.sol';
import './Utils/UpgradeableBase.sol';
import './MerkleClaimStreamer.sol';
import './Utils/Constants.sol';
import '../Interfaces/RocketPool/IMinipool.sol';
import '../Interfaces/IConstellationOracle.sol';
import '../Interfaces/IWETH.sol';

/// @custom:security-contact info@nodeoperator.org
contract WETHVault is UpgradeableBase, ERC4626Upgradeable {
    using Math for uint256;

    string constant NAME = 'Constellation ETH';
    string constant SYMBOL = 'xrETH';

    /**
     * @notice Sets the liquidity reserve as a percentage of TVL. E.g. if set to 2% (0.02e18), then 2% of the 
     * ETH backing xrETH will be reserved for withdrawals. If the reserve is below maximum, it will be refilled before assets are
     * put to work with the OperatorDistributor.
     */
    uint256 public liquidityReservePercent;

    /**
     * @notice the maximum percentage of ETH/RPL TVL allowed 
     * @dev this is a simple percentage, because the RPL TVL is calculated using its price in ETH
     */
    uint256 public maxWethRplRatio;

    uint256 public treasuryFee; // Treasury fee in basis points
    uint256 public nodeOperatorFee; // NO fee in basis points
    
    // To prevent oracle sandwich attacks, there is a small fee charged on mint
    // see the original issue for RP for more details: https://consensys.io/diligence/audits/2021/04/rocketpool/#rockettokenreth---sandwiching-opportunity-on-price-updates
    uint256 public mintFee;

    bool public depositsEnabled;

    /**
     * @notice Initializes the vault with necessary parameters and settings.
     * @dev This function sets up the vault's token references, fee structures, and various configurations. 
     * It's intended to be called once after deployment.
     * @param directoryAddress Address of the directory contract to reference other platform contracts.
     * @param weth Address of the WETH token contract to be used in this vault.
     */
    function initializeVault(address directoryAddress, address weth) public virtual initializer {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(weth));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        liquidityReservePercent = 0.1e18; // 10% of TVL
        maxWethRplRatio = 40e18; // 400% at start (4 ETH of xrETH for 1 ETH of xRPL)

        // default fees with 14% rETH commission mean WETHVault share returns are equal to base ETH staking rewards
        treasuryFee = 0.14788e18; 
        nodeOperatorFee = 0.14788e18;
        mintFee = 0.0003e18; // .03% by default
        depositsEnabled = true;
    }

    /**
     * @notice Handles deposits into the vault, ensuring compliance with RPL coverage ratio and distribution of fees.
     * @dev This function first checks if the RPL coverage ratio is below the maximum threshold, and then continues with the deposit process. 
     * It updates the depositor's position, and distributes the assets to the OperatorDistributor for utilization.
     * @param caller The address initiating the deposit.
     * @param receiver The address designated to receive the issued shares for the deposit.
     * @param assets The amount of assets being deposited.
     * @param shares The number of shares to be exchanged for the deposit.
     */
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual override nonReentrant {
        require(depositsEnabled, "deposits are disabled"); // emergency switch for deposits
        require(caller == receiver, 'caller must be receiver');
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }
        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        
        require(tvlRatioEthRpl(assets, true) <= maxWethRplRatio, 'insufficient RPL coverage');

        uint256 mintFeePortion = this.getMintFeePortion(assets);

        super._deposit(caller, receiver, assets, shares);
        
        address treasuryAddress = getDirectory().getTreasuryAddress();
        if(mintFeePortion > 0 && treasuryAddress != address(this))
            SafeERC20.safeTransfer(IERC20(asset()), treasuryAddress, mintFeePortion); // transfer the mint fee to the treasury

        // move everything to operator distributor in anticipation of rebalancing everything
        SafeERC20.safeTransfer(IERC20(asset()), address(od), IERC20(asset()).balanceOf(address(this)));
        od.processNextMinipool();
        od.rebalanceWethVault(); // just in case there is no minipool balances to process, rebalance anyway
    }

    /**
     * @notice Handles withdrawals from the vault, updating the position and distributing fees to operators and the treasury.
     * @dev This function distributes the assets to the receiver and also transfers the assets from the OperatorDistributor as necessary.
     * May revert if the liquidity reserves are too low.
     * @param caller The address initiating the withdrawal.
     * @param receiver The address designated to receive the withdrawn assets.
     * @param owner The address that owns the shares being redeemed.
     * @param assets The amount of assets being withdrawn.
     * @param shares The number of shares to be burned in exchange for the withdrawal.
     */
    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override nonReentrant {
        require(caller == receiver, 'caller must be receiver');
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }
        require(IERC20(asset()).balanceOf(address(this)) >= assets, 'Not enough liquidity to withdraw');
        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        // first process a minipool to give the best chance at actually withdrawing
        od.processNextMinipool();

        // required violation of CHECKS/EFFECTS/INTERACTIONS: need to change WETH balance here before rebalancing the rest of the protocol
        super._withdraw(caller, receiver, owner, assets, shares);

        od.rebalanceWethVault();
    }

    /// @dev Preview taking an entry fee on deposit. See {IERC4626-previewDeposit}.
    function previewDeposit(uint256 assets) public view virtual override returns (uint256) {
        uint256 fee = this.getMintFeePortion(assets);
        return super.previewDeposit(assets - fee);
    }

    /// @dev Preview adding an entry fee on mint. See {IERC4626-previewMint}.
    function previewMint(uint256 shares) public view virtual override returns (uint256) {
        uint256 assets = super.previewMint(shares);
        return assets + this.getMintFeePortion(assets);
    }

    /**
     * @notice Retrieves the total yield available for distribution.
     * @dev This function calculates the yield that can be distributed by subtracting the total yield already distributed 
     * from the total yield accrued as reported by the Oracle.
     * @return distributableYield The total yield available for distribution.
     */
    function getDistributableYield() public view returns (uint256 distributableYield, bool signed) {
        int256 oracleError = int256(OperatorDistributor(_directory.getOperatorDistributorAddress()).oracleError());
        int256 outstandingYield = (IConstellationOracle(getDirectory().getOracleAddress())).getTotalYieldAccrued();
        if(outstandingYield == 0)
            return (0, false);
        // if the most recent reported yield is less than the oracleError, there's no unrealized yield remaining
        int256 totalUnrealizedAccrual = outstandingYield >= 0 ? outstandingYield - oracleError : outstandingYield + oracleError;

        int256 diff = totalUnrealizedAccrual;
        if (diff >= 0) {
            signed = false;
            distributableYield = uint256(diff);
        } else {
            signed = true;
            distributableYield = uint256(-diff);
        }
    }

    /**
     * @notice Returns the total assets managed by this vault. That is, all the ETH backing xrETH.
     * @dev This function calculates the total assets by summing the vault's own assets, the distributable yield,
     * and the assets held in OperatorDistributor. 
     * @return The aggregated total assets managed by this vault.
     */
    function totalAssets() public view override returns (uint256) {
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        (uint256 distributableYield, bool signed) = this.getDistributableYield();
        uint256 merkleRewards = MerkleClaimStreamer(getDirectory().getMerkleClaimStreamerAddress()).getStreamedTvlEth();
        return (
            uint256(
                int(IERC20(asset()).balanceOf(address(this)) + od.getTvlEth() +  merkleRewards)  +
                    (signed ? -int(distributableYield) : int(distributableYield))
            )
        );
    }

    /**
     * @notice Calculates the Total Value Locked (TVL) ratio between ETH and RPL within the contract.
     * @dev This function computes the ratio of the total value locked in ETH to the total value locked in RPL.
     * It first retrieves the TVLs in ETH and RPL, then calculates the price of ETH in RPL units using a PriceFetcher.
     * The ratio is given by (TVL in ETH * ETH price in RPL) / TVL in RPL. If TVL in RPL is 0, it returns a predefined
     * ratio of 1e18 to handle division by zero errors.
     * @return uint256 The ratio of TVL in ETH to TVL in RPL, scaled by 1e18.
     */
    function tvlRatioEthRpl(uint256 newDeposit, bool isWeth) public view returns (uint256) {
        uint256 tvlEth = totalAssets();
        uint256 tvlRpl = RPLVault(getDirectory().getRPLVaultAddress()).totalAssets();

        if (tvlRpl == 0) return 1e18;

        uint256 rplPerEth = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        return isWeth ? ((tvlEth + newDeposit) * rplPerEth) / tvlRpl : (tvlEth * rplPerEth) / (tvlRpl + newDeposit);
    }

    /**
     * @notice Calculates the missing liquidity needed to meet the liquidity reserve after a specified deposit.
     * @dev Compares the current balance with the required liquidity based on the total assets including the deposit and mint fee.
     * @param deposit The amount of the new deposit to consider in the liquidity calculation.
     * @return The amount of liquidity required after the specified deposit.
     */
    function getMissingLiquidityAfterDeposit(uint256 deposit) public view returns (uint256) {
        uint256 fullBalance = totalAssets() + deposit - this.getMintFeePortion(deposit);
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 requiredBalance = liquidityReservePercent.mulDiv(fullBalance, 1e18, Math.Rounding.Up);
        return requiredBalance > currentBalance ? requiredBalance - currentBalance: 0;
    }

    /// @dev for dev/testing
    function getMissingLiquidityAfterDepositNoFee(uint256 deposit) public view returns (uint256) {
        uint256 fullBalance = totalAssets() + deposit;
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 requiredBalance = liquidityReservePercent.mulDiv(fullBalance, 1e18, Math.Rounding.Up);
        return requiredBalance > currentBalance ? requiredBalance - currentBalance: 0;
    }

    /**
     * @notice Calculates the missing liquidity needed to meet the liquidity reserve.
     * @dev This function calculates the current assets needed to hit the liquidity reserve 
     * based the current total assets of the vault.
     * @return The amount of liquidity required.
     */
    function getMissingLiquidity() public view returns (uint256) {
        return getMissingLiquidityAfterDepositNoFee(0);
    }

    /**
     * @notice Calculates the xrETH portion of rewards for a specified amount of income
     */
    function getIncomeAfterFees(uint256 income) public view returns (uint256){
        return income - income.mulDiv((treasuryFee + nodeOperatorFee), 1e18);
    }

    /// @notice Calculates the mint fee portion of a specific deposit amount.
    /// @param _amount The deposit expected
    function getMintFeePortion(uint256 _amount) external view returns (uint256) {
        return _amount.mulDiv(mintFee, 1e18, Math.Rounding.Up);
    }


    /// Calculates the treasury portion of a specific RPL reward amount.
    /// @param _amount The RPL reward expected
    function getTreasuryPortion(uint256 _amount) external view returns (uint256) {
        return _amount.mulDiv(treasuryFee, 1e18);
    }


    /// Calculates the operator portion of a specific RPL reward amount.
    /// @param _amount The RPL reward expected
    function getOperatorPortion(uint256 _amount) external view returns (uint256) {
        return _amount.mulDiv(nodeOperatorFee, 1e18);
    }

    /**ADMIN FUNCTIONS */

    /**
     * @notice Sets the minimum ETH/RPL coverage ratio for the vault.
     * @dev This function allows the admin to update the RPL coverage ratio, which determines the 
     * minimum ETH/RPL coverage required for the vault's health.
     * @param _maxWethRplRatio The new ETH/RPL coverage ratio to be set.
     */
    function setMaxWethRplRatio(uint256 _maxWethRplRatio) external onlyShortTimelock {
        maxWethRplRatio = _maxWethRplRatio;
    }

    /**
     * @notice Sets the treasury fee.
     * @dev This function allows the admin to update the treasury fee.
     * This fee and the total fee must not exceed 100%.
     * @param _treasuryFee The new treasury fee (1e18 = 100%).
     */
    function setTreasuryFee(uint256 _treasuryFee) external onlyMediumTimelock {
        require(_treasuryFee <= 1e18, 'Fee too high');
        require(_treasuryFee + nodeOperatorFee <= 1e18, 'Total fees cannot exceed 100%');
        treasuryFee = _treasuryFee;
    }

    /**
     * @notice Sets the node operator fee.
     * @dev This function allows the admin to update the node operator fee.
     * This fee and the total fee must not exceed 100%.
     * @param _nodeOperatorFee The new node operator fee (1e18 = 100%).
     */
    function setNodeOperatorFee(uint256 _nodeOperatorFee) external onlyMediumTimelock {
        require(_nodeOperatorFee <= 1e18, 'Fee too high');
        require(treasuryFee + _nodeOperatorFee <= 1e18, 'Total fees cannot exceed 100%');
        nodeOperatorFee = _nodeOperatorFee;
    }

    /**
     * @notice Sets protocol fees.
     * @dev This function allows the admin to update the node operator fee.
     * The total fee must not exceed 100%. (1e18 = 100%)
     * @param _nodeOperatorFee The new node operator fee.
     * @param _treasuryFee The new treasury fee.
     */
    function setProtocolFees(uint256 _nodeOperatorFee, uint256 _treasuryFee) external onlyMediumTimelock {
        require(_treasuryFee <= 1e18, 'Fee too high');
        require(_nodeOperatorFee <= 1e18, 'Fee too high');
        require(_treasuryFee + _nodeOperatorFee <= 1e18, 'Total fees cannot exceed 100%');
        nodeOperatorFee = _nodeOperatorFee;
        treasuryFee = _treasuryFee;
    }

    /**
     * @notice Sets the liquidity reserve as a percentage of TVL. E.g. if set to 2% (0.02e18), then 2% of the 
     * ETH backing xrETH will be reserved for withdrawals. If the reserve is below maximum, it will be refilled before assets are
     * put to work with the OperatorDistributor.
     * @dev This function allows the admin to update the liquidity reserve which determines the amount available for withdrawals.
     * The liquidity rserve must be a reasonable percentage between 0 and 100%. 1e18 = 100%
     * @param _liquidityReservePercent The new liquidity reserve percentage.
     * @custom:requires This function can only be called by an address with the Medium Timelock role.
     */
    function setLiquidityReservePercent(uint256 _liquidityReservePercent) external onlyShortTimelock {
        require(_liquidityReservePercent >= 0, 'WETHVault: liquidity reserve percentage must be positive');
        require(_liquidityReservePercent <= 1e18, 'WETHVault: liquidity reserve percentage must be less than or equal to 100%');

        liquidityReservePercent = _liquidityReservePercent;

        // rebalance entire balance of the contract to ensure the new liquidity reserve is respected
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        SafeERC20.safeTransfer(IERC20(asset()), address(od), IERC20(asset()).balanceOf(address(this)));
        od.rebalanceWethVault();
    }

    function setMintFee(uint256 newMintFee) external onlyMediumTimelock() {
        require(newMintFee >= 0 && newMintFee <= 1e18, "new mint fee must be between 0 and 100%");
        mintFee = newMintFee;
    }

    function setDepositsEnabled(bool _newValue) external onlyAdmin {
        depositsEnabled = _newValue;
    }
}