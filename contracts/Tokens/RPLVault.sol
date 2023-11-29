// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";

import "./WETHVault.sol";

import "../UpgradeableBase.sol";
import "../DepositPool.sol";
import "../Operator/OperatorDistributor.sol";

/// @custom:security-contact info@nodeoperator.org
contract RPLVault is UpgradeableBase, ERC4626Upgradeable {
    using Math for uint256;

    string constant NAME = "Constellation RPL";
    string constant SYMBOL = "xRPL"; // Vaulted Constellation RPL

    bool enforceWethCoverageRatio;

    uint256 public makerFeeBasePoint; // admin maker fee
    uint256 public takerFeeBasePoint; // admin taker fee

    uint256 public collateralizationRatioBasePoint; // collateralization ratio

    uint256 public wethCoverageRatio; // weth coverage ratio

    constructor() initializer {}

    /**
     * @notice Initializes the vault with necessary parameters and settings.
     * @dev This function sets up the vault's token references, fee structures, and various configurations. It's intended to be called once after deployment.
     * @param directoryAddress Address of the directory contract to reference other platform contracts.
     * @param rplToken Address of the RPL token contract to be used in this vault.
     */
    function initializeVault(
        address directoryAddress,
        address rplToken
    ) public virtual initializer {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(rplToken));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        makerFeeBasePoint = 0.05e5;
        takerFeeBasePoint = 0.05e5;
        collateralizationRatioBasePoint = 0.02e5;
        wethCoverageRatio = 1.75e5;
        enforceWethCoverageRatio = true;
    }

    /**
     * @notice Calculates the amount that will be deposited after accounting for the maker fee.
     * @dev This function subtracts the maker fee from the total assets to provide an accurate preview of the deposit amount.
     * It overrides the previewDeposit function in the parent contract to include the deduction of the maker fee.
     * @param assets The total assets that the user intends to deposit.
     * @return The amount that will be deposited after accounting for the maker fee.
     */ function previewDeposit(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee = _feeOnTotal(assets, makerFeeBasePoint);
        return super.previewDeposit(assets - fee);
    }

    /**
     * @notice Calculates the total assets associated with a specified number of shares, inclusive of the maker fee.
     * @dev This function first determines the raw assets for the given shares from the parent contract and then adds the maker fee.
     * It overrides the previewMint function in the parent contract to include the addition of the maker fee.
     * @param shares The number of shares for which the total assets are being determined.
     * @return The total assets corresponding to the provided shares, inclusive of the maker fee.
     */ function previewMint(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewMint(shares);
        return assets + _feeOnRaw(assets, makerFeeBasePoint);
    }

    /**
     * @notice Calculates the number of shares required to withdraw a specified amount of assets, taking into account the taker fee.
     * @dev This function first adjusts the assets by adding the taker fee and then determines the corresponding shares using the parent contract's function.
     * It overrides the previewWithdraw function in the parent contract to include the consideration of the taker fee.
     * @param assets The amount of assets for which the corresponding shares are being determined.
     * @return The number of shares required to withdraw the specified amount of assets, considering the taker fee.
     */ function previewWithdraw(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee = _feeOnRaw(assets, takerFeeBasePoint);
        return super.previewWithdraw(assets + fee);
    }

    /**
     * @notice Calculates the amount of assets obtainable for a specified number of shares upon redemption, after deducting the taker fee.
     * @dev This function first calculates the assets corresponding to the given shares using the parent contract's function.
     * It then adjusts the resulting assets by deducting the taker fee.
     * It overrides the previewRedeem function in the parent contract to account for the taker fee deduction.
     * @param shares The number of shares to be redeemed for assets.
     * @return The amount of assets obtainable for the specified shares after considering the taker fee deduction.
     */ function previewRedeem(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewRedeem(shares);
        return assets - _feeOnTotal(assets, takerFeeBasePoint);
    }

    /**
     * @notice Handles deposits into the vault, ensuring compliance with WETH coverage ratio and distribution of fees.
     * @dev This function first checks if the WETH coverage ratio is above the threshold, and then continues with the deposit process.
     * It takes a fee based on the deposit amount and distributes the fee to the treasury.
     * The rest of the deposited amount is transferred to a deposit pool for utilization.
     * This function overrides the `_deposit` function in the parent contract to ensure custom business logic is applied.
     * @param caller The address initiating the deposit.
     * @param receiver The address designated to receive the issued shares for the deposit.
     * @param assets The amount of assets being deposited.
     * @param shares The number of shares to be minted in exchange for the deposit.
     */ function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        if(_directory.isSanctioned(caller, receiver)) {
            return;
        }

        WETHVault vweth = WETHVault(_directory.getWETHVaultAddress());
        require(
            enforceWethCoverageRatio &&
                vweth.tvlRatioEthRpl() >= wethCoverageRatio,
            "insufficient weth coverage ratio"
        );

        uint256 fee = _feeOnTotal(assets, makerFeeBasePoint);

        address recipient1 = _directory.getTreasuryAddress();

        address payable pool = _directory.getDepositPoolAddress();
        DepositPool(pool).sendRplToDistributors();

        super._deposit(caller, receiver, assets, shares);

        if (fee > 0 && recipient1 != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient1, fee);
        }
        // transfer the rest of the deposit to the pool for utilization
        SafeERC20.safeTransfer(IERC20(asset()), pool, assets - fee);
    }

    /**
     * @notice Handles withdrawals from the vault, distributing the taker fees to the treasury.
     * @dev This function first calculates the taker fee based on the withdrawal amount and then
     * proceeds with the withdrawal process. After the withdrawal, the calculated fee is transferred
     * to the treasury. This function overrides the `_withdraw` function in the parent contract to
     * ensure custom business logic is applied.
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
        if(_directory.isSanctioned(caller, receiver)) {
            return;
        }
        uint256 fee = _feeOnRaw(assets, takerFeeBasePoint);
        address recipient1 = _directory.getTreasuryAddress();

        DepositPool(_directory.getDepositPoolAddress()).sendRplToDistributors();

        super._withdraw(caller, receiver, owner, assets, shares);

        if (fee > 0 && recipient1 != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient1, fee);
        }
    }

    /**
     * @notice Computes the fee to be applied on a given asset amount.
     * @dev This function uses the provided fee base point to determine the fee applicable on
     * the raw assets. It multiplies the asset amount with the fee base point and divides by 1e5
     * (to represent percentages up to two decimal places) to get the fee value. Rounding is done
     * upwards for accuracy.
     * @param assets The raw amount of assets for which the fee needs to be calculated.
     * @param feeBasePoint The fee rate as a base point (e.g., 0.05e5 represents a 0.05% fee rate).
     * @return The calculated fee amount to be applied on the assets.
     */
    function _feeOnRaw(
        uint256 assets,
        uint256 feeBasePoint
    ) private pure returns (uint256) {
        return assets.mulDiv(feeBasePoint, 1e5, Math.Rounding.Up);
    }

    /**
     * @notice Computes the fee to be deducted from the total asset amount.
     * @dev This function uses the provided fee base point to determine the fee applicable on
     * the total assets. The calculation method used here is different from _feeOnRaw. This
     * method is applied when the total assets include the fee itself. The fee is derived by
     * multiplying the asset amount with the fee base point and dividing it by the sum of the
     * fee base point and 1e5 (to represent percentages up to two decimal places). Rounding
     * is done upwards for accuracy.
     * @param assets The total amount of assets (inclusive of fee) for which the fee needs to be calculated.
     * @param feeBasePoint The fee rate as a base point (e.g., 0.05e5 represents a 0.05% fee rate).
     * @return The calculated fee amount to be deducted from the total assets.
     */
    function _feeOnTotal(
        uint256 assets,
        uint256 feeBasePoint
    ) private pure returns (uint256) {
        return
            assets.mulDiv(feeBasePoint, feeBasePoint + 1e5, Math.Rounding.Up);
    }

    /**
     * @notice Returns the total assets managed by this vault.
     * @dev This function aggregates the total assets from three sources:
     * 1. Assets directly held in this vault.
     * 2. Assets held in the associated DepositPool.
     * 3. Assets held in the associated OperatorDistributor.
     * The sum of these gives the overall total assets managed by the vault.
     * @return The aggregated total assets managed by this vault.
     */
    function totalAssets() public view override returns (uint256) {
        return
            super.totalAssets() +
            DepositPool(_directory.getDepositPoolAddress()).getTvlRpl() +
            OperatorDistributor(_directory.getOperatorDistributorAddress())
                .getTvlRpl();
    }

    /**
     * @notice Calculates the required collateral to ensure the contract remains sufficiently collateralized.
     * @dev This function compares the current balance of assets in the contract with the desired collateralization ratio.
     * If the required collateral based on the desired ratio is greater than the current balance, the function returns
     * the amount of collateral needed to achieve the desired ratio. Otherwise, it returns 0, indicating no additional collateral
     * is needed. The desired collateralization ratio is defined by `collateralizationRatioBasePoint`.
     * @return The amount of asset required to maintain the desired collateralization ratio, or 0 if no additional collateral is needed.
     */ function getRequiredCollateral() public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = DepositPool(_directory.getDepositPoolAddress())
            .getTvlRpl();

        uint256 requiredBalance = collateralizationRatioBasePoint.mulDiv(
            fullBalance,
            1e5,
            Math.Rounding.Up
        );

        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    /**ADMIN FUNCTIONS */

    /**
     * @notice Sets the fee rates for both makers and takers.
     * @dev This function allows the admin to adjust the fee rates for both makers and takers.
     * The sum of both fee rates must not exceed 100%.
     * @param _makerFeeBasePoint The fee rate (expressed in base points, where 1e5 represents 100%) to be set for makers.
     * @param _takerFeeBasePoint The fee rate (expressed in base points, where 1e5 represents 100%) to be set for takers.
     */
    function setFees(
        uint256 _makerFeeBasePoint,
        uint256 _takerFeeBasePoint
    ) external onlyAdmin {
        require(
            _makerFeeBasePoint + _takerFeeBasePoint <= 1e5,
            "fees must be lte 100%"
        );
        makerFeeBasePoint = _makerFeeBasePoint;
        takerFeeBasePoint = _takerFeeBasePoint;
    }

    /**
     * @notice Update the WETH coverage ratio.
     * @dev This function allows the admin to adjust the WETH coverage ratio.
     * The ratio determines the minimum coverage required to ensure the contract's health and stability.
     * It's expressed in base points, where 1e5 represents 100%.
     * @param _wethCoverageRatio The new WETH coverage ratio to be set (in base points).
     */
    function setWETHCoverageRatio(
        uint256 _wethCoverageRatio
    ) external onlyAdmin {
        wethCoverageRatio = _wethCoverageRatio;
    }

    /**
     * @notice Set the enforcement status of the WETH coverage ratio.
     * @dev Allows the admin to toggle whether or not the contract should enforce the WETH coverage ratio.
     * When enforced, certain operations will require that the WETH coverage ratio is met.
     * This could be useful to ensure the contract's health and stability.
     * @param _enforceWethCoverageRatio True if the WETH coverage ratio should be enforced, otherwise false.
     */
    function setEnforceWethCoverageRatio(
        bool _enforceWethCoverageRatio
    ) external onlyAdmin {
        enforceWethCoverageRatio = _enforceWethCoverageRatio;
    }
}
