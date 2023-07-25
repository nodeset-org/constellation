// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./Base.sol";
import "./Operator/OperatorDistributor.sol";
import "./Operator/YieldDistributor.sol";
import "./Interfaces/RocketPool/IRocketNodeStaking.sol";
import "./Tokens/WETHVault.sol";
import "./Tokens/RPLVault.sol";

import "./Interfaces/IWETH.sol";

/// @custom:security-contact info@nodeoperator.org
/// @notice Immutable deposit pool which holds deposits and provides a minimum source of liquidity for depositors.
/// ETH + RPL intakes from token mints and validator yields and sends to respective ERC4246 vaults.
contract DepositPool is Base {

    uint256 public splitRatioEth = 0.30e5; // sends 30% to operator distributor and 70% to eth vault
    uint256 public splitRatioRpl = 0.30e5; // sends 30% to operator distributor and 70% to rpl vault

    /// @notice Emitted whenever this contract sends or receives ETH outside of the protocol.
    event TotalValueUpdated(uint oldValue, uint newValue);

    constructor(address directoryAddress) Base(directoryAddress) {}

    ///--------
    /// GETTERS
    ///--------

    /// @notice Gets the total ETH value locked inside the this pool
    function getTvlEth() public view returns (uint) {
        return address(this).balance;
    }

    /// @notice Gets the total RPL value locked inside the this pool
    function getTvlRpl() public view returns (uint) {
        return RocketTokenRPLInterface(_directory.RPL_CONTRACT_ADDRESS()).balanceOf(address(this));
    }

    ///--------
    /// SETTERS
    ///--------

    /// @notice Sets the split ratio for ETH. This percentage of ETH will be sent to the OperatorDistributor and 1 - splitRatioEth will be sent to the WETHVault.
    /// @param newSplitRatio The new split ratio.
    function setSplitRatioEth(uint256 newSplitRatio) external onlyAdmin {
        require(newSplitRatio <= 1e5, "split ratio must be lte to 1e5");
        splitRatioEth = newSplitRatio;
    }

    /// @notice Sets the split ratio for RPL. This percentage of RPL will be sent to the OperatorDistributor and 1 - splitRatioRpl will be sent to the RPLVault.
    /// @param newSplitRatio The new split ratio.
    function setSplitRatioRpl(uint256 newSplitRatio) external onlyAdmin {
        require(newSplitRatio <= 1e5, "split ratio must be lte to 1e5");
        splitRatioRpl = newSplitRatio;
    }

    ///--------
    /// ACTIONS
    ///--------

    /// @notice Sends 30% of the ETH balance to the OperatorDistributor and the rest to the WETHVault.
    /// @dev Splits the total ETH balance into WETH tokens and distributes them between the WETHVault and OperatorDistributor based on the splitRatioEth. However, when the requiredCapital from WETHVault is zero, all balance is sent to the OperatorDistributor.
    function sendEthToDistributors() public {
        // convert entire weth balance of this contract to eth
        IWETH WETH = IWETH(_directory.WETH_CONTRACT_ADDRESS()); // WETH token contract
        WETH.withdraw(WETH.balanceOf(address(this)));

        WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());
        address operatorDistributor = getDirectory()
            .getOperatorDistributorAddress();
        uint256 requiredCapital = vweth.getRequiredCollateral();
        uint256 totalBalance = address(this).balance;

        // Always split total balance according to the ratio
        uint256 toOperatorDistributor = (totalBalance * splitRatioEth) / 1e5;
        uint256 toWETHVault = totalBalance - toOperatorDistributor;

        // When required capital is zero, send everything to OperatorDistributor
        if (requiredCapital == 0) {
            toOperatorDistributor = totalBalance;
            toWETHVault = 0;
        }

        // Wrap ETH to WETH and send to WETHVault
        if (toWETHVault > 0) {
            WETH.deposit{value: toWETHVault}();
            SafeERC20.safeTransfer(
                IERC20(address(WETH)),
                address(vweth),
                toWETHVault
            );
        }

        // Wrap ETH to WETH and send to Operator Distributor
        if (toOperatorDistributor > 0) {
            WETH.deposit{value: toOperatorDistributor}();
            SafeERC20.safeTransfer(
                IERC20(address(WETH)),
                operatorDistributor,
                toOperatorDistributor
            );
        }
    }

    /// @notice Sends 30% of the ETH balance to the OperatorDistributor and the rest to the WETHVault.
    /// @dev Splits the total ETH balance into WETH tokens and distributes them between the WETHVault and OperatorDistributor based on the splitRatioEth. However, when the requiredCapital from WETHVault is zero, all balance is sent to the OperatorDistributor.
    function sendRplToDistributors() public {
        RPLVault vrpl = RPLVault(getDirectory().getRPLVaultAddress());
        address operatorDistributor = getDirectory()
            .getOperatorDistributorAddress();
        uint256 requiredCapital = vrpl.getRequiredCollateral();
        RocketTokenRPLInterface RPL = RocketTokenRPLInterface(
            _directory.RPL_CONTRACT_ADDRESS()
        ); // RPL token contract
        uint256 totalBalance = RPL.balanceOf(address(this));

        // Always split total balance according to the ratio
        uint256 toOperatorDistributor = (totalBalance * splitRatioRpl) / 1e5;
        uint256 toRplVault = totalBalance - toOperatorDistributor;

        // When required capital is zero, send everything to OperatorDistributor
        if (requiredCapital == 0) {
            toOperatorDistributor = totalBalance;
            toRplVault = 0;
        }

        // Wrap ETH to WETH and send to WETHVault
        if (toRplVault > 0) {
            SafeERC20.safeTransfer(
                IERC20(address(RPL)),
                address(vrpl),
                toRplVault
            );
        }

        // Wrap ETH to WETH and send to Operator Distributor
        if (toOperatorDistributor > 0) {
            SafeERC20.safeTransfer(
                IERC20(address(RPL)),
                operatorDistributor,
                toOperatorDistributor
            );
        }
    }

    /// @notice Receive hook for ETH deposits
    receive() external payable {
    }
}
