// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';

import './RPLVault.sol';
import '../PriceFetcher.sol';
import '../UpgradeableBase.sol';
import '../AssetRouter.sol';
import '../Operator/YieldDistributor.sol';
import '../Utils/Constants.sol';
import '../Interfaces/RocketPool/IMinipool.sol';
import '../Interfaces/Oracles/IBeaconOracle.sol';
import '../Interfaces/IWETH.sol';

import 'hardhat/console.sol';

/// @custom:security-contact info@nodeoperator.org
contract WETHVault is UpgradeableBase, ERC4626Upgradeable {
    using Math for uint256;

    string constant NAME = 'Constellation ETH';
    string constant SYMBOL = 'xrETH';

    /**
     * @notice Sets the liquidity reserve as a percentage of TVL. E.g. if set to 2% (0.02e18), then 2% of the 
     * ETH backing xrETH will be reserved for withdrawals. If the reserve is below maximum, it will be refilled before assets are
     * put to work with the OperatorDistributor.
     */
    uint256 public liquidityReservePercent;
    uint256 public maxWethRplRatio;

    uint256 public treasuryFee; // Treasury fee in basis points
    uint256 public nodeOperatorFee; // NO fee in basis points

    uint256 public totalCounts;
    uint256 public totalPenaltyBond;
    uint256 public penaltyBondCount;

    constructor() initializer {}

    /**
     * @notice Initializes the vault with necessary parameters and settings.
     * @dev This function sets up the vault's token references, fee structures, and various configurations. 
     * It's intended to be called once after deployment.
     * @param directoryAddress Address of the directory contract to reference other platform contracts.
     * @param weth Address of the WETH token contract to be used in this vault.
     */
    function initializeVault(address directoryAddress, address weth) public virtual initializer {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(weth));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        liquidityReservePercent = 0.1e18; // 10% of TVL
        maxWethRplRatio = 40e18; // 400% at start (4 ETH of xrETH for 1 ETH of xRPL)

        // default fees with 14% rETH commission mean WETHVault share returns are equal to base ETH staking rewards
        treasuryFee = 0.14788e18; 
        nodeOperatorFee = 0.14788e18;
    }

    /**
     * @notice Handles deposits into the vault, ensuring compliance with RPL coverage ratio and distribution of fees.
     * @dev This function first checks if the RPL coverage ratio is below the maximum threshold, and then continues with the deposit process. 
     * It updates the depositor's position, and distributes the assets to the OperatorDistributor for utilization.
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
        OperatorDistributor(_directory.getOperatorDistributorAddress()).processNextMinipool();
        require(tvlRatioEthRpl(assets, true) <= maxWethRplRatio, 'insufficient RPL coverage');
        super._deposit(caller, receiver, assets, shares);

        AssetRouter ar = AssetRouter(_directory.getAssetRouterAddress());

        ar.onWethBalanceIncrease(assets);
        SafeERC20.safeTransfer(IERC20(asset()), address(ar), assets);

        ar.sendEthToDistributors();
    }

    /**
     * @notice Handles withdrawals from the vault, updating the position and distributing fees to operators and the treasury.
     * @dev This function distributes the assets to the receiver and also transfers the assets from the AssetRouter as necessary.
     * May revert if the liquidity reserves are too low.
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
        require(IERC20(asset()).balanceOf(address(this)) >= assets, 'Not enough liquidity to withdraw');
        OperatorDistributor(_directory.getOperatorDistributorAddress()).processNextMinipool();

        AssetRouter(_directory.getAssetRouterAddress()).sendEthToDistributors();

        super._withdraw(caller, receiver, owner, assets, shares);
    }

    /**
     * @notice Retrieves the total yield available for distribution.
     * @dev This function calculates the yield that can be distributed by subtracting the total yield already distributed 
     * from the total yield accrued as reported by the Oracle.
     * @return distributableYield The total yield available for distribution.
     */
    function getDistributableYield() public view returns (uint256 distributableYield, bool signed) {
        uint256 lastUpdate = getOracle().getLastUpdatedTotalYieldAccrued();
        int256 oracleError = int256(OperatorDistributor(_directory.getOperatorDistributorAddress()).oracleError());
        int256 totalUnrealizedAccrual = getOracle().getTotalYieldAccrued() - (lastUpdate == 0 ? int256(0) : oracleError);

        int256 diff = totalUnrealizedAccrual;
        if (diff >= 0) {
            signed = false;
            distributableYield = uint256(diff);
        } else {
            signed = true;
            distributableYield = uint256(-diff);
        }
    }

    /**
     * @notice Retrieves the address of the Oracle contract.
     * @dev This function gets the address of the Oracle contract from the Directory contract.
     * @return The address of the Oracle contract.
     */
    function getOracle() public view returns (IBeaconOracle) {
        return IBeaconOracle(getDirectory().getOracleAddress());
    }

    /**
     * @notice Returns the total assets managed by this vault. That is, all the ETH backing xrETH.
     * @dev This function calculates the total assets by summing the vault's own assets, the distributable yield,
     * and the assets held in the AssetRouter and OperatorDistributor. 
     * @return The aggregated total assets managed by this vault.
     */
    function totalAssets() public view override returns (uint256) {
        AssetRouter ar = AssetRouter(getDirectory().getAssetRouterAddress());
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        (uint256 distributableYield, bool signed) = getDistributableYield();
        return (
            uint256(
                int(IERC20(asset()).balanceOf(address(this)) + ar.getTvlEth() + od.getTvlEth()) +
                    (signed ? -int(distributableYield) : int(distributableYield))
            )
        );
    }

    /**
     * @notice Calculates the Total Value Locked (TVL) ratio between ETH and RPL within the contract.
     * @dev This function computes the ratio of the total value locked in ETH to the total value locked in RPL.
     * It first retrieves the TVLs in ETH and RPL, then calculates the price of ETH in RPL units using a PriceFetcher.
     * The ratio is given by (TVL in ETH * ETH price in RPL) / TVL in RPL. If TVL in RPL is 0, it returns a predefined
     * ratio of 1e18 to handle division by zero errors.
     * @return uint256 The ratio of TVL in ETH to TVL in RPL, scaled by 1e18.
     */
    function tvlRatioEthRpl(uint256 newDeposit, bool isWeth) public view returns (uint256) {
        uint256 tvlEth = totalAssets();
        uint256 tvlRpl = RPLVault(getDirectory().getRPLVaultAddress()).totalAssets();

        if (tvlRpl == 0) return 1e18;

        uint256 rplPerEth = PriceFetcher(getDirectory().getPriceFetcherAddress()).getPrice();

        return isWeth ? ((tvlEth + newDeposit) * rplPerEth) / tvlRpl : (tvlEth * rplPerEth) / (tvlRpl + newDeposit);
    }

    /**
     * @notice Calculates the required collateral after a specified deposit.
     * @dev This function calculates the required collateral to ensure the contract remains sufficiently collateralized
     * after a specified deposit amount. It compares the current balance with the required collateral based on
     * the total assets, including the deposit.
     * @param deposit The amount of the deposit to consider in the collateral calculation.
     * @return The amount of collateral required after the specified deposit.
     */
    function getRequiredCollateralAfterDeposit(uint256 deposit) public view returns (uint256) {
        uint256 fullBalance = totalAssets() + deposit;
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 requiredBalance = liquidityReservePercent.mulDiv(fullBalance, 1e18, Math.Rounding.Up);
        return requiredBalance > currentBalance ? requiredBalance - currentBalance: 0;
    }

    /**
     * @notice Calculates the required collateral to ensure the contract remains sufficiently collateralized.
     * @dev This function calculates the required collateral based on the current total assets of the vault.
     * @return The amount of collateral required.
     */
    function getRequiredCollateral() public view returns (uint256) {
        return getRequiredCollateralAfterDeposit(0);
    }

    /**ADMIN FUNCTIONS */

    /**
     * @notice Sets the minimum ETH/RPL coverage ratio for the vault.
     * @dev This function allows the admin to update the RPL coverage ratio, which determines the 
     * minimum ETH/RPL coverage required for the vault's health.
     * @param _maxWethRplRatio The new ETH/RPL coverage ratio to be set.
     */
    function setMaxWethRplRatio(uint256 _maxWethRplRatio) external onlyShortTimelock {
        maxWethRplRatio = _maxWethRplRatio;
    }

    /**
     * @notice Sets the treasury fee.
     * @dev This function allows the admin to update the treasury fee.
     * This fee and the total fee must not exceed 100%.
     * @param _treasuryFee The new treasury fee (1e18 = 100%).
     */
    function setTreasuryFee(uint256 _treasuryFee) external onlyMediumTimelock {
        require(_treasuryFee <= 1e18, 'Fee too high');
        require(_treasuryFee + nodeOperatorFee <= 1e18, 'Total fees cannot exceed 100%');
        treasuryFee = _treasuryFee;
    }

    /**
     * @notice Sets the node operator fee.
     * @dev This function allows the admin to update the node operator fee.
     * This fee and the total fee must not exceed 100%.
     * @param _nodeOperatorFee The new node operator fee (1e18 = 100%).
     */
    function setNodeOperatorFee(uint256 _nodeOperatorFee) external onlyMediumTimelock {
        require(_nodeOperatorFee <= 1e18, 'Fee too high');
        require(treasuryFee + _nodeOperatorFee <= 1e18, 'Total fees cannot exceed 100%');
        nodeOperatorFee = _nodeOperatorFee;
    }

    /**
     * @notice Sets protocol fees.
     * @dev This function allows the admin to update the node operator fee.
     * The total fee must not exceed 100%. (1e18 = 100%)
     * @param _nodeOperatorFee The new node operator fee.
     * @param _treasuryFee The new treasury fee.
     */
    function setProtocolFees(uint256 _nodeOperatorFee, uint256 _treasuryFee) external onlyMediumTimelock {
        require(_treasuryFee <= 1e18, 'Fee too high');
        require(_nodeOperatorFee <= 1e18, 'Fee too high');
        require(_treasuryFee + _nodeOperatorFee <= 1e18, 'Total fees cannot exceed 100%');
        nodeOperatorFee = _nodeOperatorFee;
        treasuryFee = _treasuryFee;
    }

    /**
     * @notice Sets the liquidity reserve as a percentage of TVL. E.g. if set to 2% (0.02e18), then 2% of the 
     * ETH backing xrETH will be reserved for withdrawals. If the reserve is below maximum, it will be refilled before assets are
     * put to work with the OperatorDistributor.
     * @dev This function allows the admin to update the liquidity reserve which determines the amount available for withdrawals.
     * The liquidity rserve must be a reasonable percentage between 0 and 100%. 1e18 = 100%
     * @param _liquidityReservePercent The new liquidity reserve percentage.
     * @custom:requires This function can only be called by an address with the Medium Timelock role.
     */
    function setLiquidityReservePercent(uint256 _liquidityReservePercent) external onlyShortTimelock {
        require(_liquidityReservePercent >= 0, 'WETHVault: liquidity reserve percentage must be positive');
        require(_liquidityReservePercent <= 1e18, 'WETHVault: liquidity reserve percentage must be less than or equal to 100%');

        liquidityReservePercent = _liquidityReservePercent;

        // rebalance entire balance of the contract to ensure the new liquidity reserve is respected
        AssetRouter ar = AssetRouter(_directory.getAssetRouterAddress());
        ar.onWethBalanceIncrease(IERC20(asset()).balanceOf(address(this)));
        SafeERC20.safeTransfer(IERC20(asset()), address(ar), IERC20(asset()).balanceOf(address(this)));
        ar.sendEthToDistributors();
    }
}
