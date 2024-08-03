// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './WETHVault.sol';

import '../UpgradeableBase.sol';
import '../AssetRouter.sol';
import '../Operator/OperatorDistributor.sol';

import 'hardhat/console.sol';

/**
 * @title RPLVault
 * @author Theodore Clapp, Mike Leach
 * @dev Distributes earned rewards to a decentralized operator set using an interval system.
 */
contract RPLVault is UpgradeableBase, ERC4626Upgradeable {
    using Math for uint256;
    event TreasuryFeeClaimed(uint256 amount);

    string constant NAME = 'Constellation RPL';
    string constant SYMBOL = 'xRPL'; // Vaulted Constellation RPL

    uint256 public treasuryFee;

    uint256 public liquidityReserveRatio; // collateralization ratio

    uint256 public minWethRplRatio; // weth coverage ratio

    uint256 public balanceRpl;

    constructor() initializer {}

    /**
     * @notice Initializes the vault with necessary parameters and settings.
     * @dev This function sets up the vault's token references, fee structures, and various configurations. It's intended to be called once after deployment.
     * @param directoryAddress Address of the directory contract to reference other platform contracts.
     * @param rplToken Address of the RPL token contract to be used in this vault.
     */
    function initializeVault(address directoryAddress, address rplToken) public virtual initializer {
        super.initialize(directoryAddress);
        ERC4626Upgradeable.__ERC4626_init(IERC20Upgradeable(rplToken));
        ERC20Upgradeable.__ERC20_init(NAME, SYMBOL);

        liquidityReserveRatio = 0.02e18;
        minWethRplRatio = 0; // 0% by default
        treasuryFee = 0.01e18;
    }

    /**
     * @notice Handles deposits into the vault, ensuring compliance with WETH coverage ratio and distribution of fees.
     * @dev This function first checks if the WETH coverage ratio is above the threshold, and then continues with the deposit process.
     * It takes a fee based on the deposit amount and distributes the fee to the treasury.
     * The rest of the deposited amount is transferred to the OperatorDistributor for utilization.
     * This function overrides the `_deposit` function in the parent contract to ensure custom business logic is applied.
     * @param caller The address initiating the deposit.
     * @param receiver The address designated to receive the issued shares for the deposit.
     * @param assets The amount of assets being deposited.
     * @param shares The number of shares to be exchanged for the deposit.
     */
    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual override {
        require(caller == receiver, 'caller must be receiver');
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }
        WETHVault vweth = WETHVault(_directory.getWETHVaultAddress());

        require(vweth.tvlRatioEthRpl(assets, false) >= minWethRplRatio, 'insufficient weth coverage ratio');

        AssetRouter ar = AssetRouter(_directory.getAssetRouterAddress());

        super._deposit(caller, receiver, assets, shares);

        ar.onRplBalanceIncrease(assets);
        SafeERC20.safeTransfer(IERC20(asset()), address(ar), assets);

        OperatorDistributor(_directory.getOperatorDistributorAddress()).processNextMinipool();
        ar.sendRplToDistributors();
    }

    /**
     * @notice Handles withdrawals from the vault, distributing fees to the treasury.
     * @dev This function first calculates the taker fee based on the withdrawal amount and then
     * proceeds with the withdrawal process. After the withdrawal, the calculated fee is transferred
     * to the treasury. This function overrides the `_withdraw` function in the parent contract to
     * ensure custom business logic is applied. May revert if the liquidity reserves are too low.
     * @param caller The address initiating the withdrawal.
     * @param receiver The address designated to receive the withdrawn assets.
     * @param owner The address that owns the shares being redeemed.
     * @param assets The amount of assets being withdrawn.
     * @param shares The number of shares to be burned in exchange for the withdrawal.
     */ function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        require(caller == receiver, 'caller must be receiver');
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }
        require(balanceRpl >= assets, 'Not enough liquidity to withdraw');
        // required violation of CHECKS/EFFECTS/INTERACTIONS

        balanceRpl -= assets;

        super._withdraw(caller, receiver, owner, assets, shares);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).processNextMinipool();
        AssetRouter(_directory.getAssetRouterAddress()).sendRplToDistributors();
    }

    /**
     * @notice Returns the total assets managed by this vault.
     * @return The aggregated total assets managed by this vault.
     */
    function totalAssets() public view override returns (uint256) {
        return (balanceRpl +
            AssetRouter(_directory.getAssetRouterAddress()).getTvlRpl() +
            OperatorDistributor(_directory.getOperatorDistributorAddress()).getTvlRpl());
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
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = totalAssets() + deposit;
        uint256 requiredBalance = liquidityReserveRatio.mulDiv(fullBalance, 1e18, Math.Rounding.Up);
        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    /**
     * @notice Calculates the required collateral to ensure the contract remains sufficiently collateralized.
     * @dev This function compares the current balance of assets in the contract with the desired collateralization ratio.
     * If the required collateral based on the desired ratio is greater than the current balance, the function returns
     * the amount of collateral needed to achieve the desired ratio. Otherwise, it returns 0, indicating no additional collateral
     * is needed. The desired collateralization ratio is defined by `liquidityReserveRatio`.
     * @return The amount of asset required to maintain the desired collateralization ratio, or 0 if no additional collateral is needed.
     */
    function getRequiredCollateral() public view returns (uint256) {
        return getRequiredCollateralAfterDeposit(0);
    }

    /**ADMIN FUNCTIONS */

    /**
     * @notice Sets the treasurer fee basis points.
     * @dev This function allows the admin to update the fee basis points that the treasury will receive from the rewards.
     * The treasury fee must be less than or equal to 100% (1e18 basis points).
     * @param _treasuryFee The new treasury fee in basis points.
     * @custom:requires This function can only be called by an address with the Medium Timelock role.
     */
    function setTreasuryFee(uint256 _treasuryFee) external onlyMediumTimelock {
        require(_treasuryFee <= 1e18, 'Fee too high');
        treasuryFee = _treasuryFee;
    }

    /**
     * @notice Update the WETH coverage ratio.
     * @dev This function allows the admin to adjust the WETH coverage ratio.
     * The ratio determines the minimum coverage required to ensure the contract's health and stability.
     * It's expressed in base points, where 1e18 represents 100%.
     * @param _minWethRplRatio The new WETH coverage ratio to be set (in base points).
     */
    function setMinWethRplRatio(uint256 _minWethRplRatio) external onlyShortTimelock {
        minWethRplRatio = _minWethRplRatio;
    }

    /**
     * @notice Sets the collateralization ratio basis points.
     * @dev This function allows the admin to update the collateralization ratio which determines the level of collateral required for sufficent liquidity.
     * The collateralization ratio must be a reasonable percentage, typically expressed in basis points (1e18 basis points = 100%).
     * @param _liquidityReserveRatio The new collateralization ratio in basis points.
     * @custom:requires This function can only be called by an address with the Medium Timelock role.
     */
    function setLiquidityReserveRatio(uint256 _liquidityReserveRatio) external onlyShortTimelock {
        require(_liquidityReserveRatio >= 0, 'RPLVault: Collateralization ratio must be positive');
        require(_liquidityReserveRatio <= 1e18, 'RPLVault: Collateralization ratio must be less than or equal to 100%');
        liquidityReserveRatio = _liquidityReserveRatio;
    }

    function onRplBalanceIncrease(uint256 _amount) external onlyProtocol {
        balanceRpl += _amount;
        console.log("rplVault.onRplBalanceIncrease.balanceRpl", balanceRpl);
        console.log("rplVault.onRplBalanceIncrease.balacneOf.rpl", IERC20(asset()).balanceOf(address(this)));
    }

    function onRplBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceRpl -= _amount;
        console.log("rplVault.onRplBalanceDecrease.", balanceRpl);
    }

    function getTreasuryPortion(uint256 _amount) external view returns (uint256) {
        return _amount.mulDiv(treasuryFee, 1e18);
    }
}
