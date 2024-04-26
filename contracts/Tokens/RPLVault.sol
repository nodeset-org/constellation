// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './WETHVault.sol';

import '../UpgradeableBase.sol';
import '../FundRouter.sol';
import '../Operator/OperatorDistributor.sol';

import 'hardhat/console.sol';

/// @custom:security-contact info@nodeoperator.org
contract RPLVault is UpgradeableBase, ERC4626Upgradeable {
    using Math for uint256;
    event AdminFeeClaimed(uint256 amount);

    string constant NAME = 'Constellation RPL';
    string constant SYMBOL = 'xRPL'; // Vaulted Constellation RPL

    bool public enforceWethCoverageRatio;

    address public admin;
    uint256 public adminFeeBasisPoint;

    uint256 public principal; // Total principal amount (sum of all deposits)
    uint256 public lastIncomeClaimed; // Tracks the amount of income already claimed by the admin

    uint256 public collateralizationRatioBasePoint; // collateralization ratio

    uint256 public wethCoverageRatio; // weth coverage ratio

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

        collateralizationRatioBasePoint = 0.02e5;
        wethCoverageRatio = 1.75e5;
        enforceWethCoverageRatio = true;
        adminFeeBasisPoint = 0.01e5;
    }

    /**
     * @notice Handles deposits into the vault, ensuring compliance with WETH coverage ratio and distribution of fees.
     * @dev This function first checks if the WETH coverage ratio is above the threshold, and then continues with the deposit process.
     * It takes a fee based on the deposit amount and distributes the fee to the treasury.
     * The rest of the deposited amount is transferred to a deposit pool for utilization.
     * This function overrides the `_deposit` function in the parent contract to ensure custom business logic is applied.
     * @param caller The address initiating the deposit.
     * @param receiver The address designated to receive the issued shares for the deposit.
     * @param assets The amount of assets being deposited.
     * @param shares The number of shares to be  ed in exchange for the deposit.
     */ function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual override {
        require(caller == receiver, "caller must be receiver");
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }

        WETHVault vweth = WETHVault(_directory.getWETHVaultAddress());
        require(
            enforceWethCoverageRatio || vweth.tvlRatioEthRpl() >= wethCoverageRatio,
            'insufficient weth coverage ratio'
        );

        principal += assets;

        address payable pool = _directory.getDepositPoolAddress();
        _claimAdminFee();
        super._deposit(caller, receiver, assets, shares);
        SafeERC20.safeTransfer(IERC20(asset()), pool, assets);
        FundRouter(pool).sendRplToDistributors();
    }

    /**
     * @notice Handles withdrawals from the vault, distributing the taker fees to the treasury.
     * @dev This function first calculates the taker fee based on the withdrawal amount and then
     * proceeds with the withdrawal process. After the withdrawal, the calculated fee is transferred
     * to the treasury. This function overrides the `_withdraw` function in the parent contract to
     * ensure custom business logic is applied.
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
        if (_directory.isSanctioned(caller, receiver)) {
            return;
        }

        _claimAdminFee();

        // required violation of CHECKS/EFFECTS/INTERACTIONS
        principal -= assets;

        super._withdraw(caller, receiver, owner, assets, shares);
        FundRouter(_directory.getDepositPoolAddress()).sendRplToDistributors();
    }

    function currentIncomeFromRewards() public view returns (uint256) {
        unchecked {
            uint256 tvl = super.totalAssets() +
                FundRouter(_directory.getDepositPoolAddress()).getTvlRpl() +
                OperatorDistributor(_directory.getOperatorDistributorAddress()).getTvlRpl();

            if (tvl < principal) {
                return 0;
            }
            return tvl - principal;
        }
    }

    function currentAdminIncomeFromRewards() public view returns (uint256) {
        return currentIncomeFromRewards().mulDiv(adminFeeBasisPoint, 1e5);
    }

    /**
     * @notice Returns the total assets managed by this vault.
     * @return The aggregated total assets managed by this vault.
     */
    function totalAssets() public view override returns (uint256) {
        return
            (super.totalAssets() +
                FundRouter(_directory.getDepositPoolAddress()).getTvlRpl() +
                OperatorDistributor(_directory.getOperatorDistributorAddress()).getTvlRpl()) -
            currentAdminIncomeFromRewards();
    }

    /**
     * @notice Calculates the required collateral to ensure the contract remains sufficiently collateralized.
     * @dev This function compares the current balance of assets in the contract with the desired collateralization ratio.
     * If the required collateral based on the desired ratio is greater than the current balance, the function returns
     * the amount of collateral needed to achieve the desired ratio. Otherwise, it returns 0, indicating no additional collateral
     * is needed. The desired collateralization ratio is defined by `collateralizationRatioBasePoint`.
     * @return The amount of asset required to maintain the desired collateralization ratio, or 0 if no additional collateral is needed.
     */
    function getRequiredCollateral() public view returns (uint256) {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 fullBalance = totalAssets();

        uint256 requiredBalance = collateralizationRatioBasePoint.mulDiv(fullBalance, 1e5, Math.Rounding.Up);

        return requiredBalance > currentBalance ? requiredBalance : 0;
    }

    /**ADMIN FUNCTIONS */

    function setAdminFee(uint256 _adminFeeBasePoint) external onlyAdmin {
        require(_adminFeeBasePoint <= 1e5, 'Fee too high');
        adminFeeBasisPoint = _adminFeeBasePoint;
    }

    /**
     * @notice Update the WETH coverage ratio.
     * @dev This function allows the admin to adjust the WETH coverage ratio.
     * The ratio determines the minimum coverage required to ensure the contract's health and stability.
     * It's expressed in base points, where 1e5 represents 100%.
     * @param _wethCoverageRatio The new WETH coverage ratio to be set (in base points).
     */
    function setWETHCoverageRatio(uint256 _wethCoverageRatio) external onlyAdmin {
        wethCoverageRatio = _wethCoverageRatio;
    }

    /**
     * @notice Set the enforcement status of the WETH coverage ratio.
     * @dev Allows the admin to toggle whether or not the contract should enforce the WETH coverage ratio.
     * When enforced, certain operations will require that the WETH coverage ratio is met.
     * This could be useful to ensure the contract's health and stability.
     * @param _enforceWethCoverageRatio True if the WETH coverage ratio should be enforced, otherwise false.
     */
    function setEnforceWethCoverageRatio(bool _enforceWethCoverageRatio) external onlyAdmin {
        enforceWethCoverageRatio = _enforceWethCoverageRatio;
    }

    /**
     * @dev Internal function to claim the admin fees.
     * This function calculates the current admin income from rewards, determines the fee amount based on the income
     * that hasn't been claimed yet, and transfers this fee out to the treasury. It then updates the `lastIncomeClaimed`
     * to the latest claimed amount. It is used within deposit and withdrawal operations to periodically claim the admin fee.
     *
     * Emits an `AdminFeeClaimed` event with the amount of the fee claimed.
     */
    function _claimAdminFee() internal {
        uint256 currentAdminIncome = currentAdminIncomeFromRewards();
        uint256 feeAmount = currentAdminIncome - lastIncomeClaimed;

        _doTransferOut(_directory.getTreasuryAddress(), feeAmount);

        // Update lastIncomeClaimed to reflect the new total income claimed
        lastIncomeClaimed = currentAdminIncomeFromRewards();

        emit AdminFeeClaimed(feeAmount);
    }

    function doTransferOut(address _to, uint256 _amount) external onlyProtocol {
        _doTransferOut(_to, _amount);
    }

    function _doTransferOut(address _to, uint256 _amount) internal {
        IERC20 asset = IERC20(asset());
        uint256 balance = asset.balanceOf(address(this));
        uint256 shortfall = _amount > balance ? _amount - balance : 0;
        if (shortfall > 0) {
            SafeERC20.safeTransfer(asset, _to, balance);
            OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
            uint256 transferedIn = od.transferRplToVault(shortfall);
            console.log("transfering out rpl to vault");
            SafeERC20.safeTransfer(asset, _to, transferedIn);
        } else {
            SafeERC20.safeTransfer(asset, _to, _amount);
        }
    }

    /// Claims entire admin fee
    function claimAdminFee() public onlyAdmin {
        _claimAdminFee();
    }
}
