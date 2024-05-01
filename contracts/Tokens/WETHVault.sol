// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';

import './RPLVault.sol';
import '../PriceFetcher.sol';
import '../UpgradeableBase.sol';
import '../FundRouter.sol';
import '../Operator/YieldDistributor.sol';
import '../Utils/Constants.sol';
import '../Interfaces/RocketPool/IMinipool.sol';
import '../Interfaces/Oracles/IXRETHOracle.sol';

import 'hardhat/console.sol';

/// @custom:security-contact info@nodeoperator.org
contract WETHVault is UpgradeableBase, ERC4626Upgradeable {
    event NewCapitalGain(uint256 amount, address indexed winner);
    event NewCapitalLoss(uint256 amount, address indexed loser);

    event AdminFeeClaimed(uint256 amount);
    event NodeOperatorFeeClaimed(uint256 amount);

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
    uint256 public nodeOperatorFeeBasePoint;

    uint256 public principal; // Total principal amount (sum of all deposits)
    uint256 public lastAdminIncomeClaimed; // Tracks the amount of income already claimed by the admin
    uint256 public lastNodeOperatorIncomeClaimed; // Tracks the amount of income already claimed by the Node Operator
    uint256 public ethPerSlashReward; // Tracks how much a user gets for reporting a slasher

    uint256 public totalCounts;
    uint256 public totalPenaltyBond;
    uint256 public penaltyBondCount;

    mapping(address => uint256) slashTracker;

    mapping(address => Position) public positions;

    constructor() initializer {}

    function initializeVault(address directoryAddress, address weth) public virtual initializer {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(weth));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        collateralizationRatioBasePoint = 0.1e5; // 10% of TVL
        rplCoverageRatio = 0.15e18;
        adminFeeBasePoint = 0.01e5;
        nodeOperatorFeeBasePoint = 0.01e5;

        ethPerSlashReward = 0.001 ether;

        enforceRplCoverageRatio = true;
    }

    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual override nonReentrant {
        require(caller == receiver, 'caller must be receiver');
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }

        require(enforceRplCoverageRatio || tvlRatioEthRpl() >= rplCoverageRatio, 'insufficient RPL coverage');
        super._deposit(caller, receiver, assets, shares);

        address payable pool = _directory.getDepositPoolAddress();

        WeightedAverageCalculation memory vars;
        vars.totalPriceOfShares = assets;
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

        FundRouter(pool).sendEthToDistributors();

        SafeERC20.safeTransfer(IERC20(asset()), pool, assets);

        _claimFees();
    }

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

        uint256 lastPriceOfShares = positions[owner].pricePaidPerShare * shares;

        if (assets > lastPriceOfShares) {
            uint256 capitalGain = assets - lastPriceOfShares;
            totalYieldDistributed += capitalGain;
            emit NewCapitalGain(capitalGain, receiver);
        } else {
            emit NewCapitalLoss(lastPriceOfShares - assets, receiver);
        }

        positions[owner].shares -= shares;
        if (positions[owner].shares == 0) {
            positions[owner].pricePaidPerShare = 0;
        }

        console.log('ABC1');

        FundRouter(_directory.getDepositPoolAddress()).sendEthToDistributors();

        console.log('ABC2');

        principal -= assets;

        console.log('ABC3');
        console.log('ABC3.', IERC20(asset()).balanceOf(address(this)));
        console.log('ABC3.', address(this).balance);
        super._withdraw(caller, receiver, owner, assets, shares);

        console.log('ABC4');

        _claimFees();

        console.log('ABC5');
    }

    function getDistributableYield() public view returns (uint256) {
        uint256 totalUnrealizedAccrual = getOracle().getTotalYieldAccrued();
        return totalUnrealizedAccrual - totalYieldDistributed;
    }

    function getOracle() public view returns (IXRETHOracle) {
        return IXRETHOracle(getDirectory().getRETHOracleAddress());
    }

    function currentIncomeFromRewards() public view returns (uint256) {
        unchecked {
            FundRouter dp = FundRouter(getDirectory().getDepositPoolAddress());
            console.log('WETHVault.currentIncomeFromRewards()');
            console.log(gasleft());
            console.log('getDirectory()');
            console.log('getDirectory().getOperatorDistributorAddress()');
            OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
            uint256 tvl = super.totalAssets() + getDistributableYield() + dp.getTvlEth() + od.getTvlEth();

            if (tvl < principal) {
                return 0;
            }
            return tvl - principal;
        }
    }

    function totalAssets() public view override returns (uint256) {
        //console.log("WETHVault.totalAssets()");
        //console.log(getDirectory().getDepositPoolAddress());
        FundRouter dp = FundRouter(getDirectory().getDepositPoolAddress());
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        uint256 currentIncome = currentIncomeFromRewards();
        uint256 currentAdminIncome = currentIncome.mulDiv(adminFeeBasePoint, 1e5);
        uint256 currentNodeOperatorIncome = currentIncome.mulDiv(nodeOperatorFeeBasePoint, 1e5);
        return
            (super.totalAssets() + getDistributableYield() + dp.getTvlEth() + od.getTvlEth()) -
            (currentAdminIncome + currentNodeOperatorIncome);
    }

    /**
     * @notice Calculates the Total Value Locked (TVL) ratio between ETH and RPL within the contract.
     * @dev This function computes the ratio of the total value locked in ETH to the total value locked in RPL.
     * It first retrieves the TVLs in ETH and RPL, then calculates the price of ETH in RPL units using a PriceFetcher.
     * The ratio is given by (TVL in ETH * ETH price in RPL) / TVL in RPL. If TVL in RPL is 0, it returns a predefined
     * ratio of 1e18 to handle division by zero errors.
     * @return uint256 The ratio of TVL in ETH to TVL in RPL, scaled by 1e18.
     */
    function tvlRatioEthRpl() public view returns (uint256) {
        uint256 tvlEth = totalAssets();
        uint256 tvlRpl = RPLVault(getDirectory().getRPLVaultAddress()).totalAssets();

        if (tvlRpl == 0) return 1e18;

        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        return (tvlEth * ethPriceInRpl) / tvlRpl;
    }

    function getRequiredCollateralAfterDeposit(uint256 deposit) public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = totalAssets() + deposit;
        uint256 requiredBalance = collateralizationRatioBasePoint.mulDiv(fullBalance, 1e5, Math.Rounding.Up);
        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    function getRequiredCollateral() public view returns (uint256) {
        return getRequiredCollateralAfterDeposit(0);
    }

    // Enhances precision in share quantities during the minting process.
    function _decimalsOffset() internal pure override returns (uint8) {
        return 18;
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

    function setNodeOperatorFee(uint256 _nodeOperatorFeeBasePoint) external onlyAdmin {
        require(_nodeOperatorFeeBasePoint <= 1e5, 'Fee too high');
        nodeOperatorFeeBasePoint = _nodeOperatorFeeBasePoint;
    }

    function claimFees() external onlyProtocolOrAdmin {
        _claimFees();
    }

    function _claimFees() internal returns (uint256 wethTransferOut) {
        uint256 currentIncome = currentIncomeFromRewards();
        uint256 currentAdminIncome = currentIncome.mulDiv(adminFeeBasePoint, 1e5);
        uint256 currentNodeOperatorIncome = currentIncome.mulDiv(nodeOperatorFeeBasePoint, 1e5);

        uint256 feeAmountNodeOperator = currentNodeOperatorIncome - lastNodeOperatorIncomeClaimed;
        uint256 feeAmountAdmin = currentAdminIncome - lastAdminIncomeClaimed;

        YieldDistributor yd = YieldDistributor(_directory.getYieldDistributorAddress());

        // Transfer the fee to the NodeOperator and admin treasury

        console.log('no fee', feeAmountNodeOperator);
        console.log('no fee', feeAmountAdmin);
        (bool shortfallNo, uint256 noOut, uint256 remainingNo) = _doTransferOut(address(yd), feeAmountNodeOperator);
        yd.wethReceivedVoidClaim(noOut);
        console.log('transfered to nodep po');
        (bool shortfallAdmin, uint256 adminOut, uint256 remainingAdmin) = _doTransferOut(
            _directory.getTreasuryAddress(),
            feeAmountAdmin
        );
        console.log('Claimed admin and node operator fee');

        wethTransferOut = (shortfallNo ? remainingNo : noOut) + (shortfallAdmin ? remainingAdmin : adminOut);

        lastNodeOperatorIncomeClaimed = currentIncomeFromRewards().mulDiv(adminFeeBasePoint, 1e5);
        lastAdminIncomeClaimed = currentIncomeFromRewards().mulDiv(nodeOperatorFeeBasePoint, 1e5);

        emit NodeOperatorFeeClaimed(feeAmountNodeOperator);
        emit AdminFeeClaimed(feeAmountAdmin);
    }

    function doTransferOut(address _to, uint256 _amount) external onlyProtocol returns (bool, uint256, uint256) {
        return _doTransferOut(_to, _amount);
    }

    function _doTransferOut(address _to, uint256 _amount) internal returns (bool, uint256, uint256) {
        IERC20 asset = IERC20(asset());
        uint256 balance = asset.balanceOf(address(this));
        uint256 shortfall = _amount > balance ? _amount - balance : 0;
        if (shortfall > 0) {
            SafeERC20.safeTransfer(asset, _to, balance);
            OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
            uint256 transferedIn = od.transferWEthToVault(shortfall);
            SafeERC20.safeTransfer(asset, _to, transferedIn);
            return (true, transferedIn + balance, balance);
        } else {
            SafeERC20.safeTransfer(asset, _to, _amount);
            return (false, _amount, _amount);
        }
    }

    function updateSlashingAmounts(address[] memory badMinipools) external {
        for (uint256 i = 0; i < badMinipools.length; i++) {
            address badMinipool = badMinipools[i];
            uint256 counts = _directory.getRocketNetworkPenalties().getPenaltyCount(badMinipool);

            if (counts > slashTracker[badMinipool]) {
                uint256 diff = counts - slashTracker[badMinipool];
                totalCounts += diff;
                slashTracker[badMinipool] = counts;
                totalPenaltyBond += IMinipool(badMinipool).getUserDepositBalance() * diff;
                penaltyBondCount += diff;
                IERC20(asset()).transfer(msg.sender, ethPerSlashReward);
            }
        }
    }

    function averagePenaltyBond() public view returns (uint256) {
        return totalPenaltyBond / penaltyBondCount;
    }

    function totalEthLost() public view returns (uint256) {
        return totalCounts * (1 ether / averagePenaltyBond());
    }
}
