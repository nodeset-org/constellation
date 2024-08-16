// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './WETHVault.sol';
import '../Operator/SuperNodeAccount.sol';

import '../UpgradeableBase.sol';
import '../Operator/OperatorDistributor.sol';

import 'hardhat/console.sol';

/**
 * @title RPLVault
 * @author Theodore Clapp, Mike Leach
 * @dev An ERC-4626 vault for staking RPL with a single node run by a decentralized operator set.
 * @notice These vault shares will increase or decrease in value according to the rewards or penalties applied to the SuperNodeAccount by Rocket Pool.
 */
contract RPLVault is UpgradeableBase, ERC4626Upgradeable {
    using Math for uint256;
    event TreasuryFeeClaimed(uint256 amount);

    string constant NAME = 'Constellation RPL';
    string constant SYMBOL = 'xRPL';

    uint256 public treasuryFee;

    /**
     * @notice Sets the liquidity reserve as a percentage of TVL. E.g. if set to 2% (0.02e18), then 2% of the 
     * RPL backing xRPL will be reserved for withdrawals. If the reserve is below maximum, it will be refilled before assets are
     * put to work with the OperatorDistributor.
     */
    uint256 public liquidityReservePercent;

    /**
     * @notice the minimum percentage of ETH/RPL TVL allowed 
     * @dev this is a simple percentage, because the RPL TVL is calculated using its price in ETH
     */
    uint256 public minWethRplRatio;

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

        liquidityReservePercent = 0.02e18;
        minWethRplRatio = 0; // 0% by default
        treasuryFee = 0.01e18;
    }

    /**
     * @notice Handles deposits into the vault, ensuring compliance with WETH coverage ratio and distribution of fees.
     * @dev This function first checks if the WETH coverage ratio after deposit will still be above the threshold, and then continues with the deposit process.
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

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());

        super._deposit(caller, receiver, assets, shares);

        SafeERC20.safeTransfer(IERC20(asset()), address(od), IERC20(asset()).balanceOf(address(this)));

        od.processNextMinipool();
        od.rebalanceRplVault();
    }

    /**
     * @notice Handles withdrawals from the vault, distributing fees to the treasury.
     * @dev This function overrides the `_withdraw` function in the parent contract to
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
        require(IERC20(asset()).balanceOf(address(this)) >= assets, 'Not enough liquidity to withdraw');
        
        
        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        // first process a minipool to give the best chance at actually withdrawing
        od.processNextMinipool();

        // required violation of CHECKS/EFFECTS/INTERACTIONS: need to change RPL balance here before rebalancing the rest of the protocol
        super._withdraw(caller, receiver, owner, assets, shares);
        
        od.rebalanceRplVault();
    }

    /**
     * @notice Returns the total assets managed by this vault. That is, all the RPL backing xRPL.
     * @return The aggregated total assets managed by this vault.
     */
    function totalAssets() public view override returns (uint256) {
        return (IERC20(asset()).balanceOf(address(this)) +
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
        uint256 requiredBalance = liquidityReservePercent.mulDiv(fullBalance, 1e18, Math.Rounding.Up);
        console.log("RPL requiredCollateralAfterDeposit(",deposit,")");
        console.log("requiredBalance:", requiredBalance, "currentBalance:", currentBalance);
        return requiredBalance > currentBalance ? requiredBalance - currentBalance: 0;
    }

    /**
     * @notice Calculates the required collateral to ensure the contract remains sufficiently collateralized.
     * @dev This function compares the current balance of assets in the contract with the desired collateralization ratio.
     * If the required collateral based on the desired ratio is greater than the current balance, the function returns
     * the amount of collateral needed to achieve the desired ratio. Otherwise, it returns 0, indicating no additional collateral
     * is needed. The desired collateralization ratio is defined by `liquidityReservePercent`.
     * @return The amount of asset required to maintain the desired collateralization ratio, or 0 if no additional collateral is needed.
     */
    function getRequiredCollateral() public view returns (uint256) {
        return getRequiredCollateralAfterDeposit(0);
    }

    /**ADMIN FUNCTIONS */

    /**
     * @notice Sets the treasury fee basis points.
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
     * @notice Sets the liquidity reserve as a percentage of TVL. E.g. if set to 2% (0.02e18), then 2% of the 
     * RPL backing xRPL will be reserved for withdrawals. If the reserve is below maximum, it will be refilled before assets are
     * put to work with the OperatorDistributor.
     * @dev This function allows the admin to update the liquidity reserve which determines the amount available for withdrawals.
     * The liquidity rserve must be a reasonable percentage between 0 and 100%. 1e18 = 100%
     * @param _liquidityReservePercent The new collateralization ratio in basis points.
     * @custom:requires This function can only be called by an address with the Medium Timelock role.
     */
    function setLiquidityReservePercent(uint256 _liquidityReservePercent) external onlyShortTimelock {
        require(_liquidityReservePercent >= 0, 'RPLVault: liquidity reserve percentage must be positive');
        require(_liquidityReservePercent <= 1e18, 'RPLVault: liquidity reserve percentage must be less than or equal to 100%');
       
        liquidityReservePercent = _liquidityReservePercent;

        // rebalance entire balance of the contract to ensure the new liquidity reserve is respected
        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        SafeERC20.safeTransfer(IERC20(asset()), address(od), IERC20(asset()).balanceOf(address(this)));
        od.rebalanceRplVault();
        od.rebalanceRplStake(SuperNodeAccount(getDirectory().getSuperNodeAddress()).getTotalEthStaked());
    }

    /// Calculates the treasury portion of a specific RPL reward amount.
    /// @param _amount The RPL reward expected
    function getTreasuryPortion(uint256 _amount) external view returns (uint256) {
        return _amount.mulDiv(treasuryFee, 1e18);
    }
}
