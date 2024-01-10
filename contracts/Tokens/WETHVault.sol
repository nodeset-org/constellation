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
    event NewCapitalGain(uint256 amount, address indexed winner); // shares can only appreciate in value

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
    string constant SYMBOL = 'xrETH'; // Vaulted Constellation Wrapped ETH

    bool public enforceRplCoverageRatio;

    uint256 public makerFee1BasePoint; // admin maker fee
    uint256 public makerFee2BasePoint; // node operator maker fee

    uint256 public takerFee1BasePoint; // admin taker fee
    uint256 public takerFee2BasePoint; // node operator taker fee

    uint256 public collateralizationRatioBasePoint; // collateralization ratio
    uint256 public rplCoverageRatio; // rpl coverage ratio

    uint256 public totalYieldDistributed;

    mapping(address => Position) public positions;

    constructor() initializer {}

    /**
     * @notice Initializes the vault contract with essential parameters.
     * @dev This function sets initial parameters for the ETH vault including fees, collateralization ratios, and WETH token address.
     *      It is intended to be called only once, upon the vault's deployment, utilizing the OpenZeppelin's `initializer` modifier.
     *      This ensures that the function's logic can only be executed a single time.
     * @param directoryAddress Address of the directory contract to fetch system-wide configurations or addresses.
     * @param weth Address of the Wrapped Ether (WETH) token contract. WETH is used to represent ETH in ERC-20 compliant way.
     */
    function initializeVault(address directoryAddress, address weth) public virtual initializer {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(weth));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        makerFee1BasePoint = 0.01e5;
        makerFee2BasePoint = 0.02e5;

        takerFee1BasePoint = 0.03e5;
        takerFee2BasePoint = 0.04e5;

        collateralizationRatioBasePoint = 0.02e5;
        rplCoverageRatio = 0.15e18;

        enforceRplCoverageRatio = true;
    }

    /**
     * @notice Calculates the net assets after applying both maker fees during a deposit preview.
     * @dev This function estimates the final depositable amount post the application of two maker fees.
     *      It relies on the `_feeOnTotal` internal function to compute fees and then deducts these from the initial assets.
     *      This function provides an override for the `previewDeposit` function defined in the {IERC4626} interface.
     * @param assets The initial amount of assets for which the deposit is being previewed.
     * @return The final depositable amount after deducting both maker fees.
     */ function previewDeposit(uint256 assets) public view virtual override returns (uint256) {
        uint256 fee1 = _feeOnTotal(assets, makerFee1BasePoint);
        uint256 fee2 = _feeOnTotal(assets, makerFee2BasePoint);
        return super.previewDeposit(assets - fee1 - fee2);
    }

    /**
     * @notice Estimates the total assets obtainable after applying both maker fees during a mint preview.
     * @dev This function computes the final assets amount post the addition of two maker fees.
     *      It makes use of the `_feeOnRaw` internal function to estimate fees and then adds these to the initial assets.
     *      It provides an override for the `previewMint` function detailed in the {IERC4626} interface.
     * @param shares The number of shares for which the mint is being previewed.
     * @return The estimated total assets after the addition of both maker fees.
     */ function previewMint(uint256 shares) public view virtual override returns (uint256) {
        uint256 assets = super.previewMint(shares);
        return assets + _feeOnRaw(assets, makerFee1BasePoint) + _feeOnRaw(assets, makerFee2BasePoint);
    }

    /**
     * @notice Estimates the total assets obtainable after applying both taker fees during a withdrawal preview.
     * @dev This function computes the final assets amount post the addition of two taker fees.
     *      It makes use of the `_feeOnRaw` internal function to estimate fees and then adjusts the assets accordingly.
     *      It provides an override for the `previewWithdraw` function detailed in the {IERC4626} interface.
     * @param assets The initial assets amount for which the withdrawal is being previewed.
     * @return The estimated total assets after the addition of both taker fees.
     */ function previewWithdraw(uint256 assets) public view virtual override returns (uint256) {
        uint256 fee1 = _feeOnRaw(assets, takerFee1BasePoint);
        uint256 fee2 = _feeOnRaw(assets, takerFee2BasePoint);
        return super.previewWithdraw(assets + fee1 + fee2);
    }

    /**
     * @notice Estimates the total assets obtainable after deducting both taker fees during a redemption preview.
     * @dev This function calculates the final assets amount by subtracting two taker fees from the initial assets.
     *      It uses the `_feeOnTotal` internal function to compute fees and then subtracts these from the initial assets.
     *      It provides an override for the `previewRedeem` function as defined in the {IERC4626} interface.
     * @param shares The number of shares for which the redemption is being previewed.
     * @return The estimated total assets after deducting both taker fees.
     */ function previewRedeem(uint256 shares) public view virtual override returns (uint256) {
        uint256 assets = super.previewRedeem(shares);
        return assets - _feeOnTotal(assets, takerFee1BasePoint) - _feeOnTotal(assets, takerFee2BasePoint);
    }

    /**
     * @dev Internal function for depositing assets and shares into the protocol.
     *
     * This function is called internally to deposit assets and shares into the protocol.
     * It ensures that there is sufficient RPL coverage by checking the RPL coverage ratio.
     *
     * Requirements:
     * - The `enforceRplCoverageRatio` must be enabled, and the TVL ratio to ETH RPL must be greater than or equal to `rplCoverageRatio`.
     * - `caller` is the address initiating the deposit.
     * - `receiver` is the address that will receive the deposited shares.
     * - `assets` is the amount of assets being deposited.
     * - `shares` is the number of shares being deposited.
     *
     * @param caller The address of the caller initiating the deposit.
     * @param receiver The address of the receiver who will receive the deposited shares.
     * @param assets The amount of assets being deposited.
     * @param shares The number of shares being deposited.
     */ function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual override {
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }

        require(enforceRplCoverageRatio && tvlRatioEthRpl() >= rplCoverageRatio, 'insufficient RPL coverage');

        uint256 fee1 = _feeOnTotal(assets, makerFee1BasePoint);
        uint256 fee2 = _feeOnTotal(assets, makerFee2BasePoint);

        address recipient1 = _directory.getTreasuryAddress();
        address payable recipient2 = _directory.getYieldDistributorAddress();

        address payable pool = _directory.getDepositPoolAddress();
        DepositPool(pool).sendEthToDistributors();

        WeightedAverageCalculation memory vars;
        vars.totalPriceOfShares = super.convertToAssets(shares);
        vars.lastPricePaidPerShare = positions[receiver].pricePaidPerShare;
        vars.originalValueTimesShares = vars.lastPricePaidPerShare * positions[receiver].shares * 1e18;

        vars.newValueTimesShares = vars.totalPriceOfShares * 1e18;
        vars.totalShares = positions[receiver].shares + shares;
        vars.weightedPriceSum = vars.originalValueTimesShares + vars.newValueTimesShares;

        positions[receiver].pricePaidPerShare = vars.weightedPriceSum / vars.totalShares / 1e18;
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

    /**
     * @dev Internal function for withdrawing assets and shares from the protocol.
     *
     * This function is called internally to withdraw assets and shares from the protocol.
     * It calculates taker fees, sends ETH to distributors from the deposit pool, and updates position information.
     * Additionally, it calculates and distributes capital gains and transfers fees to designated recipients.
     *
     * @param caller The address of the caller initiating the withdrawal.
     * @param receiver The address that will receive the withdrawn assets and shares.
     * @param owner The address of the owner of the shares being withdrawn.
     * @param assets The amount of assets being withdrawn.
     * @param shares The number of shares being withdrawn.
     */
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

    /**
     * @dev Calculate the fee on raw assets based on a fee rate in basis points.
     *
     * This function computes the fee to be deducted from a given amount of assets
     * based on a fee rate expressed in basis points (1 basis point = 0.01%).
     *
     * @param assets The amount of assets to calculate the fee on.
     * @param feeBasePoint The fee rate in basis points (1 basis point = 0.01%).
     * @return The calculated fee amount.
     */
    function _feeOnRaw(uint256 assets, uint256 feeBasePoint) private pure returns (uint256) {
        return assets.mulDiv(feeBasePoint, 1e5, Math.Rounding.Up);
    }

    /**
     * @dev Calculate the fee on a total amount of assets based on a fee rate in basis points.
     *
     * This function computes the fee to be deducted from a total amount of assets
     * based on a fee rate expressed in basis points (1 basis point = 0.01%).
     * The fee is calculated as a proportion of the total assets, taking into account the fee rate.
     *
     * @param assets The total amount of assets to calculate the fee on.
     * @param feeBasePoint The fee rate in basis points (1 basis point = 0.01%).
     * @return The calculated fee amount.
     */
    function _feeOnTotal(uint256 assets, uint256 feeBasePoint) private pure returns (uint256) {
        return assets.mulDiv(feeBasePoint, feeBasePoint + 1e5, Math.Rounding.Up);
    }

    /**
     * @notice Get the total value of non-distributed yield.
     *
     * This function calculates the total value of non-distributed yield by subtracting
     * the `totalYieldDistributed` amount from the total unrealized yield accrual obtained
     * from the oracle.
     *
     * @return The total value of non-distributed yield.
     */ function getDistributableYield() public view returns (uint256) {
        uint256 totalUnrealizedAccrual = getOracle().getTotalYieldAccrued();
        return totalUnrealizedAccrual - totalYieldDistributed;
    }

    /**
     * @notice Get the Oracle contract interface.
     *
     * This function retrieves the address of the RETH Oracle contract from the directory
     * and returns it as an interface of type `IXRETHOracle`. The Oracle contract is used
     * for fetching important data and calculations related to RETH.
     *
     * @return An instance of the `IXRETHOracle` interface representing the RETH Oracle contract.
     */
    function getOracle() public view returns (IXRETHOracle) {
        return IXRETHOracle(getDirectory().getRETHOracleAddress());
    }

    /**
     * @notice Get the total value of assets held by the protocol.
     *
     * This function calculates the total value of assets held by the protocol, which includes:
     * - The total assets held by the parent contract (inherited from the superclass).
     * - The value of non-distributed yield (obtained from `getDistributableYield`).
     * - The total value locked (TVL) in the Deposit Pool (obtained from `dp.getTvlEth`).
     * - The TVL of the Operator Distributor (obtained from `od.getTvlEth`).
     *
     * @return The total value of assets held by the protocol.
     */
    function totalAssets() public view override returns (uint256) {
        DepositPool dp = DepositPool(getDirectory().getDepositPoolAddress());
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        return super.totalAssets() + getDistributableYield() + dp.getTvlEth() + od.getTvlEth();
    }

    /**
     * @notice Get the ratio of ETH to RPL in the vault.
     *
     * This function calculates the ratio of ETH to RPL in the vault by considering:
     * - The total value of assets in ETH (obtained from `totalAssets`).
     * - The total value of assets in RPL held in the RPL Vault contract.
     * - The current price of ETH in RPL (obtained from `PriceFetcher`).
     *
     * If there are no RPL assets in the vault, the function returns 100% (1e18).
     *
     * @return The ratio of ETH to RPL in the vault, expressed as a fixed-point number (1e18 represents 100%).
     */ function tvlRatioEthRpl() public view returns (uint256) {
        uint256 tvlEth = totalAssets();
        uint256 tvlRpl = RPLVault(getDirectory().getRPLVaultAddress()).totalAssets();

        if (tvlRpl == 0) return 1e18; // if there is no RPL in the vault, return 100% (1e18)

        uint256 ethPriceInRpl = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        return (tvlEth * ethPriceInRpl) / tvlRpl;
    }

    /**
     * @notice Get the minimal amount of assets this contract must contain to be sufficiently collateralized for operations.
     *
     * This function calculates the minimal amount of assets that this contract must hold to maintain a sufficient
     * collateralization ratio for operations. It considers:
     * - The current balance of the asset held by this contract.
     * - The total value of assets held by the protocol (obtained from `totalAssets`).
     * - The collateralization ratio expressed in basis points (1 basis point = 0.01%).
     *
     * If the current balance is less than the required collateral, it returns the required collateral; otherwise, it returns 0.
     *
     * @return The minimal amount of assets required for sufficient collateralization.
     */ function getRequiredCollateral() public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = totalAssets();

        uint256 requiredBalance = collateralizationRatioBasePoint.mulDiv(fullBalance, 1e5, Math.Rounding.Up);

        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    /**ADMIN FUNCTIONS */

    /**
     * @notice Set the fee rates for makers and takers.
     *
     * This function allows the admin to set the fee rates for makers and takers, represented
     * in basis points (1 basis point = 0.01%). The sum of all fee rates must not exceed 100% (1e5 basis points).
     *
     * @param _makerFee1BasePoint The fee rate in basis points for maker fee type 1.
     * @param _makerFee2BasePoint The fee rate in basis points for maker fee type 2.
     * @param _takerFee1BasePoint The fee rate in basis points for taker fee type 1.
     * @param _takerFee2BasePoint The fee rate in basis points for taker fee type 2.
     */
    function setFees(
        uint256 _makerFee1BasePoint,
        uint256 _makerFee2BasePoint,
        uint256 _takerFee1BasePoint,
        uint256 _takerFee2BasePoint
    ) external onlyAdmin {
        require(
            _makerFee1BasePoint + _makerFee2BasePoint + _takerFee1BasePoint + _takerFee2BasePoint <= 1e5,
            'fees must be lte 100%'
        );
        makerFee1BasePoint = _makerFee1BasePoint;
        makerFee2BasePoint = _makerFee2BasePoint;
        takerFee1BasePoint = _takerFee1BasePoint;
        takerFee2BasePoint = _takerFee2BasePoint;
    }

    /**
     * @notice Set the required RPL coverage ratio.
     *
     * This function allows the admin to set the required RPL coverage ratio, which determines
     * the minimum ratio of RPL coverage required for operations. The RPL coverage ratio is expressed
     * as a fixed-point number (1e18 represents 100% coverage).
     *
     * @param _rplCoverageRatio The new required RPL coverage ratio to be set.
     */
    function setRplCoverageRatio(uint256 _rplCoverageRatio) external onlyAdmin {
        rplCoverageRatio = _rplCoverageRatio;
    }

    /**
     * @notice Set the enforcement of the RPL coverage ratio requirement.
     *
     * This function allows the admin to enable or disable the enforcement of the RPL coverage ratio requirement.
     * When enforcement is enabled, certain operations will check if the RPL coverage ratio is met.
     *
     * @param _enforceRplCoverage A boolean flag indicating whether to enable or disable the enforcement of the RPL coverage ratio requirement.
     */
    function setEnforceRplCoverageRatio(bool _enforceRplCoverage) external onlyAdmin {
        enforceRplCoverageRatio = _enforceRplCoverage;
    }
}
