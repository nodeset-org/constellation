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
    uint256 public splitRatioEth; // sends 30% to operator distributor and 70% to eth vault
    uint256 public splitRatioRpl; // sends 30% to operator distributor and 70% to rpl vault

    /// @notice Emitted whenever this contract sends or receives ETH outside of the protocol.
    event TotalValueUpdated(uint oldValue, uint newValue);
    event SplitRatioEthUpdated(uint oldValue, uint newValue);
    event SplitRatioRplUpdated(uint oldValue, uint newValue);

    constructor() initializer {}

    /// @dev Initializes the DepositPool contract with the specified directory address.
    /// @param directoryAddress The address of the directory contract.
    function initialize(address directoryAddress) public virtual override initializer {
        super.initialize(directoryAddress);

        splitRatioEth = 0.30e5;
        splitRatioRpl = 0.30e5;
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
    /// SETTERS
    ///--------

    /// @notice Sets the split ratio for ETH deposits.
    /// @dev This function allows an administrator to update the split ratio for ETH deposits in the deposit pool.
    ///      The split ratio determines how ETH deposits are distributed between the OperatorDistributor and the WETHVault.
    /// @param newSplitRatio The new split ratio for ETH deposits, expressed as a percentage (e.g., 30000 for 30%).
    /// @dev Throws an error if the new split ratio is greater than 100% (100000) to ensure it stays within a valid range.

    function setSplitRatioEth(uint256 newSplitRatio) external onlyAdmin {
        require(newSplitRatio <= 1e5, 'split ratio must be lte to 1e5');
        emit SplitRatioEthUpdated(splitRatioEth, newSplitRatio);
        splitRatioEth = newSplitRatio;
    }

    /// @notice Sets the split ratio for RPL deposits.
    /// @dev This function allows an administrator to update the split ratio for RPL deposits in the deposit pool.
    ///      The split ratio determines how RPL deposits are distributed between the OperatorDistributor and the RPLVault.
    /// @param newSplitRatio The new split ratio for RPL deposits, expressed as a percentage (e.g., 30000 for 30%).
    /// @dev Throws an error if the new split ratio is greater than 100% (100000) to ensure it stays within a valid range.
    function setSplitRatioRpl(uint256 newSplitRatio) external onlyAdmin {
        require(newSplitRatio <= 1e5, 'split ratio must be lte to 1e5');
        emit SplitRatioRplUpdated(splitRatioRpl, newSplitRatio);
        splitRatioRpl = newSplitRatio;
    }

    ///--------
    /// ACTIONS
    ///--------

    /// @notice Unstakes a specified amount of RPL tokens.
    /// @dev This function allows an administrator to unstake a specified amount of RPL tokens from the Rocket Node Staking contract.
    /// @param amount The amount of RPL tokens to unstake.
    /// @dev The tokens will be withdrawn from the Rocket Node Staking contract.
    function unstakeRpl(uint256 amount) external onlyAdmin {
        IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).withdrawRPL(amount);
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

    /// @notice Sends ETH to the OperatorDistributor and WETHVault based on specified ratios.
    /// @dev This function splits the total ETH balance of the contract into WETH tokens and distributes them between the WETHVault and OperatorDistributor
    ///      based on the `splitRatioEth`. If the `requiredCapital` from WETHVault is zero, all the ETH balance is sent to the OperatorDistributor.
    function sendEthToDistributors() public {
        // convert entire weth balance of this contract to eth
        IWETH WETH = IWETH(_directory.getWETHAddress()); // WETH token contract
        WETH.withdraw(WETH.balanceOf(address(this)));

        WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());
        address operatorDistributor = getDirectory().getOperatorDistributorAddress();
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
            SafeERC20.safeTransfer(IERC20(address(WETH)), address(vweth), toWETHVault);
        }

        // Don't wrap ETH to WETH and send to Operator Distributor
        if (toOperatorDistributor > 0) {
            (bool success, ) = operatorDistributor.call{value: toOperatorDistributor}('');
            require(success, 'Transfer failed.');
        }
    }

    /// @notice Sends RPL tokens to the OperatorDistributor and RPLVault based on specified ratios.
    /// @dev This function distributes RPL tokens held by the contract between the RPLVault and OperatorDistributor
    ///      based on the `splitRatioRpl`. If the `requiredCapital` from RPLVault is zero, all RPL tokens are sent to the OperatorDistributor.
    function sendRplToDistributors() public {
        RPLVault vrpl = RPLVault(getDirectory().getRPLVaultAddress());
        address operatorDistributor = getDirectory().getOperatorDistributorAddress();
        uint256 requiredCapital = vrpl.getRequiredCollateral();
        RocketTokenRPLInterface RPL = RocketTokenRPLInterface(_directory.getRPLAddress()); // RPL token contract
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
            SafeERC20.safeTransfer(IERC20(address(RPL)), address(vrpl), toRplVault);
        }

        // Wrap ETH to WETH and send to Operator Distributor
        if (toOperatorDistributor > 0) {
            SafeERC20.safeTransfer(IERC20(address(RPL)), operatorDistributor, toOperatorDistributor);
        }
    }

    /// @notice Receive hook for ETH deposits.
    /// @dev This function allows the contract to receive ETH deposits sent to its address.
    ///      It is used as a fallback function to accept incoming ETH transfers.
    receive() external payable {}
}
