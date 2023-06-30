// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

import "../Base.sol";
import "../DepositPool.sol";
import "../Operator/YieldDistributor.sol";

/// @custom:security-contact info@nodeoperator.org
contract WETHVault is Base, ERC4626 {
    string constant NAME = "Constellation ETH";
    string constant SYMBOL = "vCWETH"; // Vaulted Constellation Wrapped ETH

    constructor(
        address directoryAddress
    )
        Base(directoryAddress)
        ERC20(NAME, SYMBOL)
        ERC4626(IERC20(Directory(directoryAddress).WETH_CONTRACT_ADDRESS()))
    {}

    using Math for uint256;

    uint256 public makerFee1BasePoint = 0.01e5; // admin maker fee
    uint256 public makerFee2BasePoint = 0.02e5; // node operator maker fee

    uint256 public takerFee1BasePoint = 0.03e5; // admin taker fee
    uint256 public takerFee2BasePoint = 0.04e5; // node operator taker fee

    uint256 public collateralizationRatioBasePoint = 0.02e5; // collateralization ratio

    uint256 public totalAssetsRealized; // total deposited assets

    /** @dev See {IERC4626-previewDeposit}. */
    function previewDeposit(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee1 = _feeOnTotal(assets, makerFee1BasePoint);
        uint256 fee2 = _feeOnTotal(assets, makerFee2BasePoint);
        return super.previewDeposit(assets - fee1 - fee2);
    }

    /** @dev See {IERC4626-previewMint}. */
    function previewMint(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewMint(shares);
        return
            assets +
            _feeOnRaw(assets, makerFee1BasePoint) +
            _feeOnRaw(assets, makerFee2BasePoint);
    }

    /** @dev See {IERC4626-previewWithdraw}. */
    function previewWithdraw(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee1 = _feeOnRaw(assets, takerFee1BasePoint);
        uint256 fee2 = _feeOnRaw(assets, takerFee2BasePoint);
        return super.previewWithdraw(assets + fee1 + fee2);
    }

    /** @dev See {IERC4626-previewRedeem}. */
    function previewRedeem(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewRedeem(shares);
        return
            assets -
            _feeOnTotal(assets, takerFee1BasePoint) -
            _feeOnTotal(assets, takerFee2BasePoint);
    }

    /** @dev See {IERC4626-_deposit}. */
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual override onlyDepositPool {
        uint256 fee1 = _feeOnTotal(assets, makerFee1BasePoint);
        uint256 fee2 = _feeOnTotal(assets, makerFee2BasePoint);

        address recipient1 = _directory.getAdminAddress();
        address recipient2 = _directory.getYieldDistributorAddress();

        totalAssetsRealized += assets;
        super._deposit(caller, receiver, assets, shares);

        if (fee1 > 0 && recipient1 != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient1, fee1);
        }
        if (fee2 > 0 && recipient2 != address(this)) {
            YieldDistributor(recipient2).wethReceived(fee2);
            SafeERC20.safeTransfer(IERC20(asset()), recipient2, fee2);
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
        uint256 fee1 = _feeOnRaw(assets, takerFee1BasePoint);
        uint256 fee2 = _feeOnRaw(assets, takerFee2BasePoint);
        address recipient1 = _directory.getAdminAddress();
        address recipient2 = _directory.getYieldDistributorAddress();

        // transfer assets in from the DepositPool
        DepositPool(_directory.getDepositPoolAddress()).sendEthToDistributors();

        super._withdraw(caller, receiver, owner, assets, shares);

        if (fee1 > 0 && recipient1 != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient1, fee1);
        }
        if (fee2 > 0 && recipient2 != address(this)) {
            YieldDistributor(recipient2).wethReceived(fee2);
            SafeERC20.safeTransfer(IERC20(asset()), recipient2, fee2);
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

    /// @notice Gets the total value of non-distributed yield
    function getDistributableYield() public view returns (uint256) {
        uint256 totalUnrealizedAccrual = getOracle().getTotalYieldAccrued();
        return
            totalUnrealizedAccrual > totalAssetsRealized
                ? totalUnrealizedAccrual - totalAssetsRealized
                : 0;
    }

    function getOracle() public view returns (IXRETHOracle) {
        return IXRETHOracle(getDirectory().getRETHOracleAddress());
    }

    function totalAssets() public view override returns (uint256) {
        DepositPool dp = DepositPool(getDirectory().getDepositPoolAddress());
        return super.totalAssets() + getDistributableYield() + dp.getTvlEth();
    }

    /// @notice Returns the minimal amount of asset this contract must contain to be sufficiently collateralized for operations
    function getRequiredCollateral() public view returns (uint256) {
        uint256 currentBalance = ERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = getDistributableYield();

        uint256 requiredBalance = collateralizationRatioBasePoint.mulDiv(
            fullBalance,
            1e5,
            Math.Rounding.Up
        );

        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    /**ADMIN FUNCTIONS */

    function setFees(
        uint256 _makerFee1BasePoint,
        uint256 _makerFee2BasePoint,
        uint256 _takerFee1BasePoint,
        uint256 _takerFee2BasePoint
    ) external onlyAdmin {
        require(
            _makerFee1BasePoint +
                _makerFee2BasePoint +
                _takerFee1BasePoint +
                _takerFee2BasePoint <=
                1e5,
            "fees must be lte 100%"
        );
        makerFee1BasePoint = _makerFee1BasePoint;
        makerFee2BasePoint = _makerFee2BasePoint;
        takerFee1BasePoint = _takerFee1BasePoint;
        takerFee2BasePoint = _takerFee2BasePoint;
    }

}
