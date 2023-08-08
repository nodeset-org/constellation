// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";

import "./RPLVault.sol";

import "../PriceFetcher.sol";
import "../UpgradeableBase.sol";
import "../DepositPool.sol";
import "../Operator/YieldDistributor.sol";
import "../Utils/Constants.sol";

/// @custom:security-contact info@nodeoperator.org
contract WETHVault is UpgradeableBase, ERC4626Upgradeable {
    string constant NAME = "Constellation ETH";
    string constant SYMBOL = "xrETH"; // Vaulted Constellation Wrapped ETH

    struct Position {
        uint256 shares;
        uint256 pricePaidPerShare;
    }

    struct WeightedAverageCalculation {
        uint256 totalPriceOfShares;
        uint256 lastPricePaidPerShare;
        uint256 originalValueTimesShares;
        uint256 newValueTimesShares;
        uint256 totalShares;
        uint256 weightedPriceSum;
    }


    using Math for uint256;

    uint256 public makerFee1BasePoint; // admin maker fee
    uint256 public makerFee2BasePoint; // node operator maker fee

    uint256 public takerFee1BasePoint; // admin taker fee
    uint256 public takerFee2BasePoint; // node operator taker fee

    uint256 public collateralizationRatioBasePoint; // collateralization ratio
    uint256 public rplCoverageRatio; // rpl coverage ratio

    uint256 public totalYieldDistributed;

    mapping(address => Position) public positions;

    event NewCapitalGain(uint256 amount, address indexed winner); // shares can only appreciate in value

    constructor() initializer {}

    function initialize(address directoryAddress) public virtual initializer override {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(Constants.WETH_CONTRACT_ADDRESS));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        makerFee1BasePoint = 0.01e5;
        makerFee2BasePoint = 0.02e5;

        takerFee1BasePoint = 0.03e5;
        takerFee2BasePoint = 0.04e5;

        collateralizationRatioBasePoint = 0.02e5;
        rplCoverageRatio = 0.15e18;
    }

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
    ) internal virtual override {
        require(tvlRatioEthRpl() >= rplCoverageRatio, "insufficient RPL coverage");

        uint256 fee1 = _feeOnTotal(assets, makerFee1BasePoint);
        uint256 fee2 = _feeOnTotal(assets, makerFee2BasePoint);

        address recipient1 = _directory.getTreasuryAddress();
        address payable recipient2 = _directory.getYieldDistributorAddress();

        address payable pool = _directory.getDepositPoolAddress();
        DepositPool(pool).sendEthToDistributors();

        WeightedAverageCalculation memory vars;
        vars.totalPriceOfShares = super.convertToAssets(shares);
        vars.lastPricePaidPerShare = positions[receiver].pricePaidPerShare;
        vars.originalValueTimesShares =
            vars.lastPricePaidPerShare *
            positions[receiver].shares *
            1e18;

        vars.newValueTimesShares = vars.totalPriceOfShares * 1e18;
        vars.totalShares = positions[receiver].shares + shares;
        vars.weightedPriceSum = vars.originalValueTimesShares + vars.newValueTimesShares;

        positions[receiver].pricePaidPerShare =
            vars.weightedPriceSum /
            vars.totalShares /
            1e18;
        positions[receiver].shares += shares;

        super._deposit(caller, receiver, assets, shares);

        if (fee1 > 0 && recipient1 != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient1, fee1);
        }
        if (fee2 > 0 && recipient2 != address(this)) {
            YieldDistributor(recipient2).wethReceived(fee2);
            SafeERC20.safeTransfer(IERC20(asset()), recipient2, fee2);
        }
        // transfer the rest of the deposit to the pool for utilization
        SafeERC20.safeTransfer(IERC20(asset()), pool, assets - fee1 - fee2);

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
        address recipient1 = _directory.getTreasuryAddress();
        address payable recipient2 = _directory.getYieldDistributorAddress();

        DepositPool(_directory.getDepositPoolAddress()).sendEthToDistributors();

        uint256 currentPriceOfShares = super.convertToAssets(shares);
        uint256 lastPriceOfShares = positions[owner].pricePaidPerShare * shares;
        uint256 capitalGain = currentPriceOfShares - lastPriceOfShares; // will always be positive
        totalYieldDistributed += capitalGain;
        emit NewCapitalGain(capitalGain, receiver);

        positions[owner].shares -= shares;
        if (positions[owner].shares == 0) {
            positions[owner].pricePaidPerShare = 0;
        }

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
        return totalUnrealizedAccrual - totalYieldDistributed;
    }

    function getOracle() public view returns (IXRETHOracle) {
        return IXRETHOracle(getDirectory().getRETHOracleAddress());
    }

    function totalAssets() public view override returns (uint256) {
        DepositPool dp = DepositPool(getDirectory().getDepositPoolAddress());
        OperatorDistributor od = OperatorDistributor(
            getDirectory().getOperatorDistributorAddress()
        );
        return
            super.totalAssets() +
            getDistributableYield() +
            dp.getTvlEth() +
            od.getTvlEth();
    }

    function tvlRatioEthRpl() public view returns (uint256) {
        uint256 tvlEth = totalAssets();
        uint256 tvlRpl = RPLVault(getDirectory().getRPLVaultAddress())
            .totalAssets();

        if(tvlRpl == 0) return 1e18; // if there is no RPL in the vault, return 100% (1e18)

        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        return tvlEth * ethPriceInRpl * 1e18 / tvlRpl / 1e18;
    }

    /// @notice Returns the minimal amount of asset this contract must contain to be sufficiently collateralized for operations
    function getRequiredCollateral() public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = totalAssets();

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

    function setRplCoverageRatio(uint256 _rplCoverageRatio) external onlyAdmin {
        require(_rplCoverageRatio <= 1e18, "rpl coverage ratio must be lte 100%");
        rplCoverageRatio = _rplCoverageRatio;
    }
}
