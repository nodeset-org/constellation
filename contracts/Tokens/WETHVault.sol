// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';

import './RPLVault.sol';
import '../PriceFetcher.sol';
import '../UpgradeableBase.sol';
import '../DepositPool.sol';
import '../Operator/YieldDistributor.sol';
import '../Utils/Constants.sol';
import '../Interfaces/RocketPool/IMinipool.sol';

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

        collateralizationRatioBasePoint = 0.02e5;
        rplCoverageRatio = 0.15e18;
        adminFeeBasePoint = 0.01e5;
        nodeOperatorFeeBasePoint = 0.01e5;

        ethPerSlashReward = 0.001 ether;

        enforceRplCoverageRatio = true;
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual override {
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

        DepositPool(pool).sendEthToDistributors();

        _claimFees();

        SafeERC20.safeTransfer(IERC20(asset()), pool, assets);

        // TODO: 2) Pull funds from OperatorDistributor

        console.log('sc vault B');
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

        DepositPool(_directory.getDepositPoolAddress()).sendEthToDistributors();

        _claimFees();

        principal -= assets;

        console.log("post claim fees");
        console.log(assets);
        console.log(shares);

        // for teddy to work on later
        // why tf is 1 share worth 11 eth????
        // todo patch bug

        super._withdraw(caller, receiver, owner, assets, shares);
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
            DepositPool dp = DepositPool(getDirectory().getDepositPoolAddress());
            OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
            uint256 tvl = super.totalAssets() + getDistributableYield() + dp.getTvlEth() + od.getTvlEth();

            if (tvl < principal) {
                return 0;
            }
            //uint256 currentAdminIncome = (tvl - principal).mulDiv(adminFeeBasisPoint, 1e5);
            return tvl - principal;
        }
    }

    function totalAssets() public view override returns (uint256) {
        DepositPool dp = DepositPool(getDirectory().getDepositPoolAddress());
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        uint256 currentIncome = currentIncomeFromRewards();
        uint256 currentAdminIncome = currentIncome.mulDiv(adminFeeBasePoint, 1e5);
        uint256 currentNodeOperatorIncome = currentIncome.mulDiv(nodeOperatorFeeBasePoint, 1e5);
        return
            (super.totalAssets() + getDistributableYield() + dp.getTvlEth() + od.getTvlEth()) -
            (currentAdminIncome + currentNodeOperatorIncome);
    }

    function tvlRatioEthRpl() public view returns (uint256) {
        uint256 tvlEth = totalAssets();
        uint256 tvlRpl = RPLVault(getDirectory().getRPLVaultAddress()).totalAssets();

        if (tvlRpl == 0) return 1e18;

        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        return (tvlEth * ethPriceInRpl) / tvlRpl;
    }

    function _decimalsOffset() internal pure override returns (uint8) {
        return 18;
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

    function setNodeOperatorFee(uint256 _nodeOperatorFeeBasePoint) external onlyAdmin {
        require(_nodeOperatorFeeBasePoint <= 1e5, 'Fee too high');
        nodeOperatorFeeBasePoint = _nodeOperatorFeeBasePoint;
    }

    function claimFees() external onlyProtocolOrAdmin {
        _claimFees();
    }

    function _claimFees() internal {
        uint256 currentIncome = currentIncomeFromRewards();
        uint256 currentAdminIncome = currentIncome.mulDiv(adminFeeBasePoint, 1e5);
        uint256 currentNodeOperatorIncome = currentIncome.mulDiv(nodeOperatorFeeBasePoint, 1e5);

        uint256 feeAmountNodeOperator = currentNodeOperatorIncome - lastNodeOperatorIncomeClaimed;
        uint256 feeAmountAdmin = currentAdminIncome - lastAdminIncomeClaimed;

        YieldDistributor yd = YieldDistributor(_directory.getYieldDistributorAddress());

        // Transfer the fee to the NodeOperator and admin treasury

        console.log("no fee", feeAmountNodeOperator);
        console.log("no fee", feeAmountAdmin);
        yd.wethReceived(_doFeeTransferOut(address(yd), feeAmountNodeOperator));
        console.log("transfered to nodep po");
        _doFeeTransferOut( _directory.getTreasuryAddress(), feeAmountAdmin);
        console.log("Claimed admin and node operator fee");


        lastNodeOperatorIncomeClaimed = currentIncomeFromRewards().mulDiv(adminFeeBasePoint, 1e5);
        lastAdminIncomeClaimed = currentIncomeFromRewards().mulDiv(nodeOperatorFeeBasePoint, 1e5);

        emit NodeOperatorFeeClaimed(feeAmountNodeOperator);
        emit AdminFeeClaimed(feeAmountAdmin);
    }

    function _doFeeTransferOut(address _to, uint256 _amount) internal returns(uint256) {
        IERC20 asset = IERC20(asset());
        uint256 balance = asset.balanceOf(address(this));
        uint256 shortfall = _amount > balance ? _amount - balance : 0;
        if(shortfall > 0) {
            SafeERC20.safeTransfer(asset, _to, balance);
            OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
            uint256 transferedIn = od.transferWEthToVault(shortfall);
            SafeERC20.safeTransfer(asset, _to, transferedIn);
            return transferedIn + balance;
        } else {
            SafeERC20.safeTransfer(asset, _to, _amount);
            return _amount;
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
