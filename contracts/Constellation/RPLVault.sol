// SPDX-License-Identifier: GPL v3

/**
  *    /***        /***          /******                                  /**               /** /**             /**     /**                    
  *   /**_/       |_  **        /**__  **                                | **              | **| **            | **    |__/                    
  *  | **   /** /** | **       | **  \__/  /******  /*******   /******* /******    /****** | **| **  /******  /******   /**  /******  /******* 
  *  /***  |__/|__/ | ***      | **       /**__  **| **__  ** /**_____/|_  **_/   /**__  **| **| ** |____  **|_  **_/  | ** /**__  **| **__  **
  * |  **           | **       | **      | **  \ **| **  \ **|  ******   | **    | ********| **| **  /*******  | **    | **| **  \ **| **  \ **
  *  \ **   /** /** | **       | **    **| **  | **| **  | ** \____  **  | ** /* | **_____/| **| ** /**__  **  | ** /* | **| **  | **| **  | **
  *  |  ***|__/|__/***         |  ******||  ****** | **  | ** /*******   | ****  |  *******| **| **| ********  | ****  | **|  ****** | **  | **
  *   \___/       |___/         \______/  \______/ |__/  |__/|_______/    \___/   \_______/|__/|__/ \_______/   \___/  |__/ \______/ |__/  |__/
  *
  *  A liquid staking protocol extending Rocket Pool.
  *  Made w/ <3 by {::}
  *
  *  For more information, visit https://nodeset.io
  *
  *  @author Mike Leach (Wander), Nick Steinhilber (NickS), Theodore Clapp (mryamz), Joe Clapis (jcrtp), Huy Nguyen, Andy Rose (Barbalute)
  *  @custom:security-info https://docs.nodeset.io/nodeset/security-notice
  **/

pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './WETHVault.sol';
import './SuperNodeAccount.sol';
import './MerkleClaimStreamer.sol';

import './Utils/UpgradeableBase.sol';
import './OperatorDistributor.sol';

import './Utils/PriceFetcher.sol';

/**
 * @title RPLVault
 * @author Theodore Clapp, Mike Leach
 * @dev An ERC-4626 vault for staking RPL with a single node run by a decentralized operator set.
 * @notice These vault shares will increase or decrease in value according to the rewards or penalties applied to the SuperNodeAccount by Rocket Pool.
 */
contract RPLVault is UpgradeableBase, ERC4626Upgradeable {
    using Math for uint256;

    event TreasuryFeeChanged(uint256 oldFee, uint256 newFee);
    event MinWethRplRatioChanged(uint256 oldValue, uint256 newValue);
    event RPLLiquidityReservePercentChanged(uint256 oldValue, uint256 newValue);
    event DifferingSenderRecipientEnabledChanged(bool indexed oldValue, bool indexed newValue);

    string constant NAME = 'Constellation RPL';
    string constant SYMBOL = 'xRPL';

    uint256 public treasuryFee;

    /**
     * @notice Sets the liquidity reserve as a percentage of TVL. E.g. if set to 2% (0.02e18), then 2% of the 
     * RPL backing xRPL will be reserved for withdrawals. If the reserve is below maximum, it will be refilled before assets are
     * put to work with the OperatorDistributor.
     */
    uint256 public liquidityReservePercent;

    /**
     * @notice the minimum percentage of ETH/RPL TVL allowed 
     * @dev this is a simple percentage, because the RPL TVL is calculated using its price in ETH
     */
    uint256 public minWethRplRatio;

    bool public depositsEnabled;

    // can the recipient of a deposit be different than the caller? False by default for extra security
    bool public differingSenderRecipientEnabled;
    
    /**
     * @notice Initializes the vault with necessary parameters and settings.
     * @dev This function sets up the vault's token references, fee structures, and various configurations. It's intended to be called once after deployment.
     * @param directoryAddress Address of the directory contract to reference other platform contracts.
     * @param rplToken Address of the RPL token contract to be used in this vault.
     */
    function initializeVault(address directoryAddress, address rplToken) public virtual initializer {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(rplToken));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        liquidityReservePercent = 0.02e18;
        minWethRplRatio = 0; // 0% by default
        treasuryFee = 0.01e18;
        depositsEnabled = true;
    }

    /**
     * @notice Handles deposits into the vault, ensuring compliance with WETH coverage ratio.
     * @dev This function first checks if the WETH coverage ratio after deposit will still be above the threshold, 
     * and then continues with the deposit process. The deposited amount is transferred to the OperatorDistributor for utilization.
     * This function overrides the `_deposit` function in the parent contract to ensure custom business logic is applied.
     * Processes a minipool after depositing, then rebalances the RPL liquidity.
     * @param caller The address initiating the deposit.
     * @param receiver The address designated to receive the issued shares for the deposit.
     * @param assets The amount of assets being deposited.
     * @param shares The number of shares to be exchanged for the deposit.
     */
    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual override {
        require(depositsEnabled, "deposits are disabled"); // emergency switch for deposits
        require(differingSenderRecipientEnabled || caller == receiver, 'caller must be receiver');
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }
        WETHVault vweth = WETHVault(_directory.getWETHVaultAddress());

        require(vweth.tvlRatioEthRpl(assets, false) >= minWethRplRatio, 'insufficient weth coverage ratio');

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());

        super._deposit(caller, receiver, assets, shares);

        SafeERC20.safeTransfer(IERC20(asset()), address(od), IERC20(asset()).balanceOf(address(this)));

        od.processNextMinipool();
        od.rebalanceRplVault();  // just in case there are no minipools to process, rebalance anyway
    }

    /**
     * @notice Handles withdrawals from the vault.
     * @dev This function overrides the `_withdraw` function in the parent contract to
     * ensure custom business logic is applied. May revert if the liquidity reserves are too low.
     * Processes a minipool before withdrawing, then rebalances the RPL liquidity.
     * @param caller The address initiating the withdrawal.
     * @param receiver The address designated to receive the withdrawn assets.
     * @param owner The address that owns the shares being redeemed.
     * @param assets The amount of assets being withdrawn.
     * @param shares The number of shares to be burned in exchange for the withdrawal.
     */ function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        require(caller == receiver, 'caller must be receiver');
        
        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        // first process a minipool to give the best chance at actually withdrawing
        od.processNextMinipool();

        require(IERC20(asset()).balanceOf(address(this)) >= assets, 'Not enough liquidity to withdraw');

        super._withdraw(caller, receiver, owner, assets, shares);
        
        od.rebalanceRplVault(); // just in case there are no minipools to process, rebalance anyway
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 shares
    ) internal virtual override {
        if (_directory.isSanctioned(sender, recipient)) {
            return;
        }
        super._transfer(sender, recipient, shares);
    }

    /**
     * @notice Returns the total assets managed by this vault. That is, all the RPL backing xRPL.
     * @return The aggregated total assets managed by this vault.
     */
    function totalAssets() public view override returns (uint256) {
        return (IERC20(asset()).balanceOf(address(this)) +
            OperatorDistributor(_directory.getOperatorDistributorAddress()).getTvlRpl()) +
            MerkleClaimStreamer(getDirectory().getMerkleClaimStreamerAddress()).getStreamedTvlRpl();
    }

    /**
     * @notice Calculates the missing liquidity needed to meet the liquidity reserve after a specified deposit.
     * @dev Compares the current balance with the required liquidity based on the total assets including the deposit and mint fee.
     * @param deposit The amount of the new deposit to consider in the liquidity calculation.
     * @return The amount of liquidity required after the specified deposit.
     */
    function getMissingLiquidityAfterDeposit(uint256 deposit) public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = totalAssets() + deposit;
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
        return getMissingLiquidityAfterDeposit(0);
    }

    /// Calculates the treasury portion of a specific RPL reward amount.
    /// @param _amount The RPL reward expected
    function getTreasuryPortion(uint256 _amount) external view returns (uint256) {
        return _amount.mulDiv(treasuryFee, 1e18);
    }

    /**
     * @notice Convenience function for determining if a particular deposit amount will be allowed or rejected
     */
    function getIsDepositAllowed(uint256 amount) public view returns (bool) {
        return WETHVault(_directory.getWETHVaultAddress()).tvlRatioEthRpl(amount, false) >= minWethRplRatio;
    }

    /**
     * @notice Convenience function for determining if a particular withdraw amount will be allowed or rejected
     */
    function getIsWithdrawAllowed(uint256 amount) public view returns (bool) {
        return IERC20(asset()).balanceOf(address(this)) >= amount;
    }

    /**
     * @notice Convenience function for viewing the maximum withdrawal allowed
     */
    function getMaximumWithdrawAmount() public view returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }

    /**
     * @notice Convenience function for viewing the maximum depoosit allowed
     */
    function getMaximumDeposit() public view returns (uint256) {
        if(minWethRplRatio == 0) return type(uint256).max;
        
        uint256 tvlRpl = totalAssets();
        uint256 tvlEth = WETHVault(getDirectory().getWETHVaultAddress()).totalAssets();
        uint256 rplPerEth = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        return ((tvlEth * rplPerEth) / minWethRplRatio) - tvlRpl;
    }

    /**ADMIN FUNCTIONS */


    /**
     * @notice Sets whether the recipient of a deposit is allowed to be different than the caller of the deposit function.
     * @param _newValue The new value for the differingSenderRecipientEnabled variable
     */
    function setDifferingSenderRecipientEnabled(bool _newValue) external onlyAdmin {
        require(_newValue != differingSenderRecipientEnabled, 'RPLVault: new differingSenderRecipientEnabled value must be different than existing value');
        emit DifferingSenderRecipientEnabledChanged(differingSenderRecipientEnabled, _newValue);
        differingSenderRecipientEnabled = _newValue;
    }

    /**
     * @notice Sets the treasury fee basis points.
     * @dev This function allows the admin to update the fee basis points that the treasury will receive from the rewards.
     * The treasury fee must be less than or equal to 100% (1e18 basis points).
     * @param _treasuryFee The new treasury fee in basis points.
     * @custom:requires This function can only be called by an address with the Medium Timelock role.
     */
    function setTreasuryFee(uint256 _treasuryFee) external onlyMediumTimelock {
        require(_treasuryFee <= 1e18, 'Fee too high');
        require(_treasuryFee != treasuryFee, 'RPLVault: new treasury fee value must be different than existing value');
        emit TreasuryFeeChanged(treasuryFee, _treasuryFee);
        treasuryFee = _treasuryFee;
    }

    /**
     * @notice Update the WETH coverage ratio.
     * @dev This function allows the admin to adjust the WETH coverage ratio.
     * The ratio determines the minimum coverage required to ensure the contract's health and stability.
     * It's expressed in base points, where 1e18 represents 100%.
     * @param _minWethRplRatio The new WETH coverage ratio to be set (in base points).
     */
    function setMinWethRplRatio(uint256 _minWethRplRatio) external onlyShortTimelock {
        require(_minWethRplRatio != minWethRplRatio, 'RPLVault: new minWethRplRatio value must be different than existing value');
        emit MinWethRplRatioChanged(minWethRplRatio, _minWethRplRatio);
        minWethRplRatio = _minWethRplRatio;
    }

    /**
     * @notice Sets the liquidity reserve as a percentage of TVL. E.g. if set to 2% (0.02e18), then 2% of the 
     * RPL backing xRPL will be reserved for withdrawals. If the reserve is below maximum, it will be refilled before assets are
     * put to work with the OperatorDistributor.
     * @dev This function allows the admin to update the liquidity reserve which determines the amount available for withdrawals.
     * The liquidity rserve must be a reasonable percentage between 0 and 100%. 1e18 = 100%
     * @param _liquidityReservePercent The new collateralization ratio in basis points.
     * @custom:requires This function can only be called by an address with the Medium Timelock role.
     */
    function setLiquidityReservePercent(uint256 _liquidityReservePercent) external onlyShortTimelock {
        require(_liquidityReservePercent <= 1e18, 'RPLVault: liquidity reserve percentage must be less than or equal to 100%');
        require(_liquidityReservePercent != liquidityReservePercent, 'RPLVault: new liquidityReservePercent value must be different than existing value');

        emit RPLLiquidityReservePercentChanged(liquidityReservePercent, _liquidityReservePercent);

        liquidityReservePercent = _liquidityReservePercent;

        // rebalance entire balance of the contract to ensure the new liquidity reserve is respected
        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        SafeERC20.safeTransfer(IERC20(asset()), address(od), IERC20(asset()).balanceOf(address(this)));
        od.rebalanceRplVault();
        od.rebalanceRplStake(SuperNodeAccount(getDirectory().getSuperNodeAddress()).getEthStaked());
    }

    function setDepositsEnabled(bool _newValue) external onlyAdmin {
        depositsEnabled = _newValue;
    }
}
