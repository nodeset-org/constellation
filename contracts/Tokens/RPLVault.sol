// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

import "../Base.sol";
import "../DepositPool.sol";

/// @custom:security-contact info@nodeoperator.org
contract RPLVault is Base, ERC4626 {
    string constant NAME = "Constellation RPL";
    string constant SYMBOL = "vCRPL";

    constructor(
        address directoryAddress
    )
        Base(directoryAddress)
        ERC20(NAME, SYMBOL)
        ERC4626(IERC20(_directory.RPL_CONTRACT_ADDRESS()))
    {}

    using Math for uint256;

    uint256 public makerFeeBasePoint = 0.05e5; // admin maker fee
    uint256 public takerFeeBasePoint = 0.05e5; // admin taker fee

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
    ) internal virtual override {
        uint256 fee = _feeOnTotal(assets, makerFeeBasePoint);

        address recipient1 = _directory.getAdminAddress();

        super._deposit(caller, receiver, assets, shares);

        if (fee > 0 && recipient1 != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient1, fee);
        }
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
