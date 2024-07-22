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

    /**
     * @notice Initializes the vault with necessary parameters and settings.
     * @dev This function sets up the vault's token references, fee structures, and various configurations. It's intended to be called once after deployment.
     * @param directoryAddress Address of the directory contract to reference other platform contracts.
     * @param weth Address of the WETH token contract to be used in this vault.
     */
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

    /**
     * @notice Handles deposits into the vault, ensuring compliance with RPL coverage ratio and distribution of fees.
     * @dev This function first checks if the RPL coverage ratio is above the threshold, and then continues with the deposit process. It updates the depositor's position, and distributes the assets to the deposit pool.
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


        SafeERC20.safeTransfer(IERC20(asset()), pool, assets);
        
        FundRouter(pool).sendEthToDistributors();

        _claimFees();
        OperatorDistributor(_directory.getOperatorDistributorAddress()).processNextMinipool();
    }

    /**
     * @notice Handles withdrawals from the vault, updating the position and distributing fees.
     * @dev This function calculates and records any capital gains or losses, updates the owner's position, and distributes the assets to the receiver. It also transfers the assets from the deposit pool.
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
        OperatorDistributor(_directory.getOperatorDistributorAddress()).processNextMinipool();

    }

    /**
     * @notice Retrieves the total yield available for distribution.
     * @dev This function calculates the yield that can be distributed by subtracting the total yield already distributed from the total yield accrued as reported by the Oracle.
     * @return The total yield available for distribution.
     */
    function getDistributableYield() public view returns (uint256) {
        uint256 totalUnrealizedAccrual = getOracle().getTotalYieldAccrued() -
            OperatorDistributor(_directory.getOperatorDistributorAddress()).oracleError();
        return totalUnrealizedAccrual - totalYieldDistributed;
    }

    /**
     * @notice Retrieves the address of the Oracle contract.
     * @dev This function gets the address of the Oracle contract from the Directory contract.
     * @return The address of the Oracle contract.
     */
    function getOracle() public view returns (IXRETHOracle) {
        return IXRETHOracle(getDirectory().getRETHOracleAddress());
    }

    /**
     * @notice Calculates the current income from rewards.
     * @dev This function calculates the total value locked (TVL), subtracts the principal, and returns the difference as the current income from rewards.
     * @return The current income from rewards.
     */
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

    /**
     * @notice Returns the total assets managed by this vault.
     * @dev This function calculates the total assets by summing the vault's own assets, the distributable yield, and the assets held in the deposit pool and Operator Distributor. It then subtracts the admin and node operator incomes to get the net total assets.
     * @return The aggregated total assets managed by this vault.
     */
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

    /**
     * @notice Calculates the required collateral after a specified deposit.
     * @dev This function calculates the required collateral to ensure the contract remains sufficiently collateralized after a specified deposit amount. It compares the current balance with the required collateral based on the total assets including the deposit.
     * @param deposit The amount of the deposit to consider in the collateral calculation.
     * @return The amount of collateral required after the specified deposit.
     */
    function getRequiredCollateralAfterDeposit(uint256 deposit) public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = totalAssets() + deposit;
        uint256 requiredBalance = collateralizationRatioBasePoint.mulDiv(fullBalance, 1e5, Math.Rounding.Up);
        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    /**
     * @notice Calculates the required collateral to ensure the contract remains sufficiently collateralized.
     * @dev This function calculates the required collateral based on the current total assets of the vault.
     * @return The amount of collateral required.
     */
    function getRequiredCollateral() public view returns (uint256) {
        return getRequiredCollateralAfterDeposit(0);
    }

    /**
     * @notice Enhances precision in share quantities during the minting process.
     * @dev This function returns the number of decimal places to offset for share calculations.
     * @return The number of decimal places for share calculations.
     */
    function _decimalsOffset() internal pure override returns (uint8) {
        return 18;
    }

    /**ADMIN FUNCTIONS */

    /**
     * @notice Sets the RPL coverage ratio for the vault.
     * @dev This function allows the admin to update the RPL coverage ratio, which determines the minimum RPL coverage required for the vault's health.
     * @param _rplCoverageRatio The new RPL coverage ratio to be set.
     */
    function setRplCoverageRatio(uint256 _rplCoverageRatio) external onlyShortTimelock {
        rplCoverageRatio = _rplCoverageRatio;
    }

    /**
     * @notice Sets the enforcement status of the RPL coverage ratio.
     * @dev This function allows the admin to enable or disable the enforcement of the RPL coverage ratio.
     * @param _enforceRplCoverage True to enforce the RPL coverage ratio, false to disable enforcement.
     */
    function setEnforceRplCoverageRatio(bool _enforceRplCoverage) external onlyShortTimelock {
        enforceRplCoverageRatio = _enforceRplCoverage;
    }

    /**
     * @notice Sets the admin fee in basis points.
     * @dev This function allows the admin to update the admin fee, which is calculated in basis points. The fee must not exceed 100%.
     * @param _adminFeeBasePoint The new admin fee in basis points.
     */
    function setAdminFee(uint256 _adminFeeBasePoint) external onlyMediumTimelock {
        require(_adminFeeBasePoint <= 1e5, 'Fee too high');
        adminFeeBasePoint = _adminFeeBasePoint;
    }

    /**
     * @notice Sets the node operator fee in basis points.
     * @dev This function allows the admin to update the node operator fee, which is calculated in basis points. The fee must not exceed 100%.
     * @param _nodeOperatorFeeBasePoint The new node operator fee in basis points.
     */
    function setNodeOperatorFee(uint256 _nodeOperatorFeeBasePoint) external onlyShortTimelock {
        require(_nodeOperatorFeeBasePoint <= 1e5, 'Fee too high');
        nodeOperatorFeeBasePoint = _nodeOperatorFeeBasePoint;
    }

    /**
     * @notice Claims the accumulated admin and node operator fees.
     * @dev This function allows the protocol or admin to claim the fees accumulated from rewards. It transfers the fees to the respective addresses.
     */
    function claimFees() external onlyProtocolOrAdmin {
        _claimFees();
    }

    /**
     * @notice Internal function to claim the admin and node operator fees.
     * @dev This function calculates the current admin and node operator income from rewards, determines the fee amount based on the income that hasn't been claimed yet, and transfers these fees to the respective addresses. It then updates the `lastAdminIncomeClaimed` and `lastNodeOperatorIncomeClaimed` to the latest claimed amounts.
     * @return wethTransferOut The amount of WETH transferred out as fees.
     */
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

    /**
     * @notice Transfers out a specified amount of assets to a given address.
     * @dev This function is callable only by protocol contracts and handles the transfer of assets from the vault to a specified address. If the vault's balance is insufficient, it requests additional assets from the Operator Distributor.
     * @param _to The address to which the assets will be transferred.
     * @param _amount The amount of assets to be transferred.
     * @return A tuple containing a boolean indicating if there was a shortfall, the actual amount transferred, and the remaining balance after the transfer.
     */
    function doTransferOut(address _to, uint256 _amount) external onlyProtocol returns (bool, uint256, uint256) {
        return _doTransferOut(_to, _amount);
    }

    /**
     * @notice Internal function to transfer out a specified amount of assets to a given address.
     * @dev This function handles the internal logic for transferring assets from the vault to a specified address. If the vault's balance is insufficient, it requests additional assets from the Operator Distributor.
     * @param _to The address to which the assets will be transferred.
     * @param _amount The amount of assets to be transferred.
     * @return A tuple containing a boolean indicating if there was a shortfall, the actual amount transferred, and the remaining balance after the transfer.
     */
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

    /**
     * @notice Updates the slashing amounts for the specified bad minipools.
     * @dev This function iterates through the list of bad minipools, checks for any penalties incurred since the last update, and updates the total counts and penalty bonds accordingly. It also rewards the caller with a predefined ETH amount for each slashing report.
     * @param badMinipools An array of addresses representing the bad minipools to be checked for slashing updates.
     */
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

    /**
     * @notice Calculates the average penalty bond across all slashing events.
     * @dev This function computes the average penalty bond by dividing the total penalty bond by the number of penalty bond counts.
     * @return The average penalty bond value.
     */
    function averagePenaltyBond() public view returns (uint256) {
        return totalPenaltyBond / penaltyBondCount;
    }

    /**
     * @notice Calculates the total ETH lost due to slashing events.
     * @dev This function computes the total ETH lost by multiplying the total counts of slashing events by the value of 1 ETH divided by the average penalty bond.
     * @return The total amount of ETH lost.
     */
    function totalEthLost() public view returns (uint256) {
        return totalCounts * (1 ether / averagePenaltyBond());
    }
}
