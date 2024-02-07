// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';

import './RPLVault.sol';
import '../PriceFetcher.sol';
import '../UpgradeableBase.sol';
import '../DepositPool.sol';
import '../Operator/YieldDistributor.sol';
import '../Utils/Constants.sol';

/// @custom:security-contact info@nodeoperator.org
contract WETHVault is UpgradeableBase, ERC4626Upgradeable {
    event NewCapitalGain(uint256 amount, address indexed winner);
    event AdminFeeClaimed(uint256 amount);

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

    string constant NAME = 'Constellation ETH';
    string constant SYMBOL = 'xrETH';

    bool public enforceRplCoverageRatio;
    uint256 public collateralizationRatioBasePoint;
    uint256 public rplCoverageRatio;
    uint256 public totalYieldDistributed;
    uint256 public adminFeeBasePoint; // Admin fee in basis points

    uint256 public principal; // Total principal amount (sum of all deposits)
    uint256 public lastIncomeClaimed; // Tracks the amount of income already claimed by the admin

    mapping(address => Position) public positions;

    constructor() initializer {}

    function initializeVault(address directoryAddress, address weth) public virtual initializer {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(weth));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        collateralizationRatioBasePoint = 0.02e5;
        rplCoverageRatio = 0.15e18;
        adminFeeBasePoint = 0.01e5;

        enforceRplCoverageRatio = true;
    }

    function previewDeposit(uint256 assets) public view virtual override returns (uint256) {
        return super.previewDeposit(assets);
    }

    function previewMint(uint256 shares) public view virtual override returns (uint256) {
        return super.previewMint(shares);
    }

    function previewWithdraw(uint256 assets) public view virtual override returns (uint256) {
        return super.previewWithdraw(assets);
    }

    function previewRedeem(uint256 shares) public view virtual override returns (uint256) {
        return super.previewRedeem(shares);
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual override {
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }

        require(enforceRplCoverageRatio || tvlRatioEthRpl() >= rplCoverageRatio, 'insufficient RPL coverage');

        address payable pool = _directory.getDepositPoolAddress();
        DepositPool(pool).sendEthToDistributors();

        WeightedAverageCalculation memory vars;
        vars.totalPriceOfShares = super.convertToAssets(shares);
        vars.lastPricePaidPerShare = positions[receiver].pricePaidPerShare;
        vars.originalValueTimesShares = vars.lastPricePaidPerShare * positions[receiver].shares * 1e18;

        vars.newValueTimesShares = vars.totalPriceOfShares * 1e18;
        vars.totalShares = positions[receiver].shares + shares;
        vars.weightedPriceSum = vars.originalValueTimesShares + vars.newValueTimesShares;

        positions[receiver].pricePaidPerShare =
            vars.weightedPriceSum /
            (vars.totalShares == 0 ? 1 : vars.totalShares) /
            1e18;
        positions[receiver].shares += shares;

        principal += assets;

        super._deposit(caller, receiver, assets, shares);

        // transfer the deposit to the pool for utilization
        SafeERC20.safeTransfer(IERC20(asset()), pool, assets);
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }

        DepositPool(_directory.getDepositPoolAddress()).sendEthToDistributors();

        uint256 currentPriceOfShares = super.convertToAssets(shares);
        uint256 lastPriceOfShares = positions[owner].pricePaidPerShare * shares;
        uint256 capitalGain = currentPriceOfShares - lastPriceOfShares;
        totalYieldDistributed += capitalGain;
        emit NewCapitalGain(capitalGain, receiver);

        positions[owner].shares -= shares;
        if (positions[owner].shares == 0) {
            positions[owner].pricePaidPerShare = 0;
        }

        principal -= assets;

        super._withdraw(caller, receiver, owner, assets, shares);
    }

    function getDistributableYield() public view returns (uint256) {
        uint256 totalUnrealizedAccrual = getOracle().getTotalYieldAccrued();
        return totalUnrealizedAccrual - totalYieldDistributed;
    }

    function getOracle() public view returns (IXRETHOracle) {
        return IXRETHOracle(getDirectory().getRETHOracleAddress());
    }

    function totalAssets() public view override returns (uint256) {
        DepositPool dp = DepositPool(getDirectory().getDepositPoolAddress());
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        return super.totalAssets() + getDistributableYield() + dp.getTvlEth() + od.getTvlEth();
    }

    function tvlRatioEthRpl() public view returns (uint256) {
        uint256 tvlEth = totalAssets();
        uint256 tvlRpl = RPLVault(getDirectory().getRPLVaultAddress()).totalAssets();

        if (tvlRpl == 0) return 1e18;

        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        return (tvlEth * ethPriceInRpl) / tvlRpl;
    }

    function getRequiredCollateral() public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = totalAssets();

        uint256 requiredBalance = collateralizationRatioBasePoint.mulDiv(fullBalance, 1e5, Math.Rounding.Up);

        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    /**ADMIN FUNCTIONS */

    function setRplCoverageRatio(uint256 _rplCoverageRatio) external onlyAdmin {
        rplCoverageRatio = _rplCoverageRatio;
    }

    function setEnforceRplCoverageRatio(bool _enforceRplCoverage) external onlyAdmin {
        enforceRplCoverageRatio = _enforceRplCoverage;
    }

    function setAdminFee(uint256 _adminFeeBasePoint) external onlyAdmin {
        require(_adminFeeBasePoint <= 1e5, 'Fee too high');
        adminFeeBasePoint = _adminFeeBasePoint;
    }

function claimAdminFee() external onlyAdmin {
    uint256 currentIncome = totalAssets() - principal;
    uint256 unclaimedIncome = currentIncome - lastIncomeClaimed;
    uint256 feeAmount = unclaimedIncome.mulDiv(adminFeeBasePoint, 1e5, Math.Rounding.Up);

    // Update lastIncomeClaimed to reflect the new total income claimed
    lastIncomeClaimed += unclaimedIncome;

    // Transfer the fee to the admin
    SafeERC20.safeTransfer(IERC20(asset()), _directory.getTreasuryAddress(), feeAmount);

    emit AdminFeeClaimed(feeAmount);
}
}
