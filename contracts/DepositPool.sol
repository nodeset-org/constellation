// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/Strings.sol';

import './UpgradeableBase.sol';
import './Operator/OperatorDistributor.sol';
import './Operator/YieldDistributor.sol';
import './Interfaces/RocketPool/IRocketNodeStaking.sol';
import './Tokens/WETHVault.sol';
import './Tokens/RPLVault.sol';

import './Interfaces/IWETH.sol';
import './Utils/Constants.sol';

/// @custom:security-contact info@nodeoperator.org
/// @notice Immutable deposit pool which holds deposits and provides a minimum source of liquidity for depositors.
/// ETH + RPL intakes from token mints and validator yields and sends to respective ERC4246 vaults.
contract DepositPool is UpgradeableBase {

    constructor() initializer {}

    /// @dev Initializes the DepositPool contract with the specified directory address.
    /// @param directoryAddress The address of the directory contract.
    function initialize(address directoryAddress) public virtual override initializer {
        super.initialize(directoryAddress);
    }

    ///--------
    /// GETTERS
    ///--------

    /// @notice Retrieves the total ETH and WETH value locked inside this deposit pool.
    /// @dev This function calculates and returns the combined value of ETH and WETH held by the deposit pool.
    ///      It sums the ETH balance of this contract and the WETH balance from the WETH contract.
    /// @return The total value in ETH and WETH locked in the deposit pool.
    function getTvlEth() public view returns (uint) {
        return address(this).balance + IWETH(_directory.getWETHAddress()).balanceOf(address(this));
    }

    /// @notice Retrieves the total RPL value locked inside this deposit pool.
    /// @dev This function calculates and returns the total amount of RPL tokens held by the deposit pool.
    /// @return The total value in RPL locked in the deposit pool.
    function getTvlRpl() public view returns (uint) {
        return RocketTokenRPLInterface(_directory.getRPLAddress()).balanceOf(address(this));
    }

    ///--------
    /// ACTIONS
    ///--------

    /// @notice Unstakes a specified amount of RPL tokens.
    /// @dev This function allows an administrator to unstake a specified amount of RPL tokens from the Rocket Node Staking contract.
    /// @param _excessRpl The amount of RPL tokens to unstake.
    /// @dev The tokens will be withdrawn from the Rocket Node Staking contract.
    function unstakeRpl(address _nodeAddress, uint256 _excessRpl) external onlyAdmin {
        IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).withdrawRPL(_nodeAddress, _excessRpl);
    }

    /// @notice Stakes a specified amount of RPL tokens on behalf of a node operator.
    /// @dev This function allows the protocol or an administrator to stake a specified amount of RPL tokens on behalf of a node operator
    ///      using the Rocket Node Staking contract.
    /// @param _nodeAddress The address of the node operator on whose behalf the RPL tokens are being staked.
    /// @param _amount The amount of RPL tokens to stake.
    /// @dev This function ensures that the specified amount of RPL tokens is approved and then staked for the given node operator.
    function stakeRPLFor(address _nodeAddress, uint256 _amount) external onlyProtocolOrAdmin {
        SafeERC20.safeApprove(
            RocketTokenRPLInterface(_directory.getRPLAddress()),
            _directory.getRocketNodeStakingAddress(),
            0
        );
        SafeERC20.safeApprove(
            RocketTokenRPLInterface(_directory.getRPLAddress()),
            _directory.getRocketNodeStakingAddress(),
            _amount
        );
        IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).stakeRPLFor(_nodeAddress, _amount);
    }

    function sendEthToDistributors() public {
        // Convert entire WETH balance of this contract to ETH
        IWETH WETH = IWETH(_directory.getWETHAddress());
        uint256 wethBalance = WETH.balanceOf(address(this));
        WETH.withdraw(wethBalance);

        // Initialize the vault and operator distributor addresses
        WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());
        address payable operatorDistributor = payable(getDirectory().getOperatorDistributorAddress());

        // Calculate required capital and total balance
        uint256 requiredCapital = vweth.getRequiredCollateral();
        uint256 ethBalance = address(this).balance;

        if (ethBalance >= requiredCapital) {
            // Send required capital in WETH to vault and surplus ETH to operator distributor
            SafeERC20.safeTransfer(IERC20(address(WETH)), address(vweth), requiredCapital);
            uint256 surplus = ethBalance - requiredCapital;
            operatorDistributor.transfer(surplus);
        } else {
            // If not enough ETH balance, convert the shortfall in WETH back to ETH and send it
            uint256 shortfall = requiredCapital - ethBalance;
            WETH.deposit{value: shortfall}();
            SafeERC20.safeTransfer(IERC20(address(WETH)), address(vweth), requiredCapital);
        }
    }

    function sendRplToDistributors() public {
        // Initialize the RPLVault and the Operator Distributor addresses
        RPLVault vrpl = RPLVault(getDirectory().getRPLVaultAddress());
        address operatorDistributor = getDirectory().getOperatorDistributorAddress();
        RocketTokenRPLInterface RPL = RocketTokenRPLInterface(_directory.getRPLAddress());

        // Fetch the required capital in RPL and the total RPL balance of the contract
        uint256 requiredCapital = vrpl.getRequiredCollateral();
        uint256 totalBalance = RPL.balanceOf(address(this));

        // Determine the amount to send to the RPLVault
        uint256 toRplVault = (totalBalance >= requiredCapital) ? requiredCapital : totalBalance;

        // Transfer RPL to the RPLVault
        if (toRplVault > 0) {
            SafeERC20.safeTransfer(IERC20(address(RPL)), address(vrpl), toRplVault);
        }

        // Transfer any surplus RPL to the Operator Distributor
        if (totalBalance > toRplVault) {
            SafeERC20.safeTransfer(IERC20(address(RPL)), operatorDistributor, totalBalance - toRplVault);
        }
    }

    /// @notice Receive hook for ETH deposits.
    /// @dev This function allows the contract to receive ETH deposits sent to its address.
    ///      It is used as a fallback function to accept incoming ETH transfers.
    receive() external payable {}
}
