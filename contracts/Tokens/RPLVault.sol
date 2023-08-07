// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";

import "../UpgradeableBase.sol";
import "../DepositPool.sol";
import "../Operator/OperatorDistributor.sol";

/// @custom:security-contact info@nodeoperator.org
contract RPLVault is UpgradeableBase, ERC4626Upgradeable {
    string constant NAME = "Constellation RPL";
    string constant SYMBOL = "xRPL"; // Vaulted Constellation RPL


    using Math for uint256;

    uint256 public makerFeeBasePoint = 0.05e5; // admin maker fee
    uint256 public takerFeeBasePoint = 0.05e5; // admin taker fee

    uint256 public collateralizationRatioBasePoint = 0.02e5; // collateralization ratio

    constructor() initializer {}

    function initialize(address directoryAddress) public virtual initializer override {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(Directory(directoryAddress).RPL_CONTRACT_ADDRESS()));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);
    }

    /** @dev See {IERC4626-previewDeposit}. */
    function previewDeposit(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee = _feeOnTotal(assets, makerFeeBasePoint);
        return super.previewDeposit(assets - fee);
    }

    /** @dev See {IERC4626-previewMint}. */
    function previewMint(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewMint(shares);
        return assets + _feeOnRaw(assets, makerFeeBasePoint);
    }

    /** @dev See {IERC4626-previewWithdraw}. */
    function previewWithdraw(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee = _feeOnRaw(assets, takerFeeBasePoint);
        return super.previewWithdraw(assets + fee);
    }

    /** @dev See {IERC4626-previewRedeem}. */
    function previewRedeem(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewRedeem(shares);
        return assets - _feeOnTotal(assets, takerFeeBasePoint);
    }

    /** @dev See {IERC4626-_deposit}. */
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual override  {
        uint256 fee = _feeOnTotal(assets, makerFeeBasePoint);

        address recipient1 = _directory.getAdminAddress();

        address payable pool = _directory.getDepositPoolAddress();
        DepositPool(pool).sendRplToDistributors();

        super._deposit(caller, receiver, assets, shares);

        if (fee > 0 && recipient1 != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient1, fee);
        }
        // transfer the rest of the deposit to the pool for utilization
        SafeERC20.safeTransfer(IERC20(asset()), pool, assets - fee);
    }

    /** @dev See {IERC4626-_deposit}. */
    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        uint256 fee = _feeOnRaw(assets, takerFeeBasePoint);
        address recipient1 = _directory.getAdminAddress();

        DepositPool(_directory.getDepositPoolAddress()).sendRplToDistributors();

        super._withdraw(caller, receiver, owner, assets, shares);

        if (fee > 0 && recipient1 != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient1, fee);
        }
    }

    function _feeOnRaw(
        uint256 assets,
        uint256 feeBasePoint
    ) private pure returns (uint256) {
        return assets.mulDiv(feeBasePoint, 1e5, Math.Rounding.Up);
    }

    function _feeOnTotal(
        uint256 assets,
        uint256 feeBasePoint
    ) private pure returns (uint256) {
        return
            assets.mulDiv(feeBasePoint, feeBasePoint + 1e5, Math.Rounding.Up);
    }

    function totalAssets() public view override returns (uint256) {
        return super.totalAssets() + DepositPool(_directory.getDepositPoolAddress()).getTvlRpl() + OperatorDistributor(_directory.getOperatorDistributorAddress()).getTvlRpl();
    }

    /// @notice Returns the amount of asset this contract must contain to be sufficiently collateralized
    function getRequiredCollateral() public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = DepositPool(_directory.getDepositPoolAddress()).getTvlRpl();

        uint256 requiredBalance = collateralizationRatioBasePoint.mulDiv(
            fullBalance,
            1e5,
            Math.Rounding.Up
        );

        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    /**ADMIN FUNCTIONS */

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
}
