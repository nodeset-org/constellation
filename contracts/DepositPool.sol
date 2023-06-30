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
    // TODO: remove these notes,
    // _maxRplBalancePortion is staked at the node level, and needs to be a percentage of the TVL. This is to service large inflows and outflows of new minipool contracts.
    // likewise, _maxrETHBalancePortion needs to optimize yield for eth. eth in this contract is only reserved for creating stakers for minipool contracts
    // the oracle is simple a TVL calculation of all the ETH in the system
    // Total RPL is already on-chain and does not need to be an oracle

    string public constant SEND_ETH_TO_OPERATOR_DISTRIBUTOR_ERROR =
        "DepositPool: Send ETH to OperatorDistributor failed";
    string public constant SEND_RPL_TO_OPERATOR_DISTRIBUTOR_ERROR =
        "DepositPool: Send RPL to OperatorDistributor failed";
    string public constant ONLY_ETH_TOKEN_ERROR =
        "DepositPool: This function may only be called by the xrETH token contract";
    string public constant MAX_BALANCE_PORTION_OUT_OF_RANGE_ERROR =
        "DepositPool: Supplied maxBalancePortion is out of range. Must be >= 0 or <= MAX_BALANCE_PORTION.";
    string public constant NOT_ENOUGH_ETH_ERROR =
        "Deposit Pool: Not enough ETH";
    string public constant NOT_ENOUGH_RPL_ERROR =
        "Deposit Pool: Not enough RPL";

    uint private _dpOwnedEth;
    uint private _dpOwnedRpl;

    uint256 public splitRatioEth = 0.30e5; // sends 30% to operator distributor and 70% to eth vault
    uint256 public splitRatioRpl = 0.30e5; // sends 30% to operator distributor and 70% to rpl vault

    /// @notice Emitted whenever this contract sends or receives ETH outside of the protocol.
    event TotalValueUpdated(uint oldValue, uint newValue);

    constructor(address directoryAddress) Base(directoryAddress) {}

    ///--------
    /// GETTERS
    ///--------

    /// @notice Gets the total ETH value locked inside the protocol, including inside of validators, the OperatorDistributor,
    // and this contract.
    function getTvlEth() public view returns (uint) {
        return _dpOwnedEth;
    }

    /// @notice Gets the total RPL value locked inside the protocol, including inside of validators, the OperatorDistributor,
    // and this contract.
    function getTvlRpl() public view returns (uint) {
        return _dpOwnedRpl;
    }

    ///--------
    /// TOKEN
    ///--------

    ///------
    /// RECEIVE
    ///------

    receive() external payable {
        uint old = getTvlEth();

        _dpOwnedEth += msg.value;
        emit TotalValueUpdated(old, _dpOwnedEth);

        sendEthToDistributors();
    }

    function receiveRpl(uint amount) external onlyRplVault {
        uint old = getTvlRpl();

        _dpOwnedRpl += amount;
        emit TotalValueUpdated(old, _dpOwnedRpl);
    }

    /// @notice Sends 30% of the ETH balance to the OperatorDistributor and the rest to the WETHVault.
    /// @dev Splits the total ETH balance into WETH tokens and distributes them between the WETHVault and OperatorDistributor based on the splitRatioEth. However, when the requiredCapital from WETHVault is zero, all balance is sent to the OperatorDistributor.
    function sendEthToDistributors() public {
        WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());
        address operatorDistributor = getDirectory()
            .getOperatorDistributorAddress();
        uint256 requiredCapital = vweth.getRequiredCollateral();
        uint256 totalBalance = address(this).balance;
        IWETH WETH = IWETH(_directory.WETH_CONTRACT_ADDRESS()); // WETH token contract

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

    function getRplBalanceOf(address a) private view returns (uint) {
        return
            RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS())
                .balanceOf(address(a));
    }

    function sendRPLTo(address to, uint amount) private returns (bool) {
        return
            RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS())
                .transfer(to, amount);
    }
}
