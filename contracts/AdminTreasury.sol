// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./UpgradeableBase.sol";
import "./Utils/Constants.sol";

/// @title AdminTreasury Contract
/// @notice A contract that allows an admin to manage and execute transfers of ETH and ERC20 tokens.
/// @dev Inherits from UpgradeableBase to allow for future upgrades.
contract AdminTreasury is UpgradeableBase {
    /// @notice Initializer that replaces constructor for upgradeable contracts.
    constructor() initializer {}

    /// @notice Initializes the contract by setting the directory address.
    /// @dev Overrides the initialize function of the UpgradeableBase.
    /// @param _directoryAddress The address of the directory contract to set.
    function initialize(
        address _directoryAddress
    ) public virtual override initializer {
        super.initialize(_directoryAddress);
    }

    /// @notice Allows the admin to claim all ERC20 tokens of a particular type and send them to a specified address.
    /// @param _tokenAddress The address of the ERC20 token contract.
    /// @param _to The address to which the tokens will be sent.
    function claimToken(address _tokenAddress, address _to) external onlyAdmin nonReentrant {
        this.claimToken(_tokenAddress, _to, IERC20(_tokenAddress).balanceOf(address(this)));
    }

    /// @notice Allows the admin to claim a specified amount of ERC20 tokens and send them to a given address.
    /// @param _tokenAddress The address of the ERC20 token.
    /// @param _to The recipient's address.
    /// @param _amount The amount of tokens to transfer.
    function claimToken(
        address _tokenAddress,
        address _to,
        uint256 _amount
    ) external onlyAdmin nonReentrant {
        IERC20(_tokenAddress).transfer(_to, _amount);
    }

    /// @notice Enables the admin to claim all ETH held by the contract and send it to a specified address.
    /// @param _to The payable address to which the ETH will be sent.
    function claimEth(address payable _to) external onlyAdmin nonReentrant {
        this.claimEth(_to, address(this).balance);
    }

    /// @notice Allows the admin to claim a specified amount of ETH and send it to a given address.
    /// @param _to The payable address to which the ETH will be transferred.
    /// @param _amount The amount of ETH to transfer.
    function claimEth(address payable _to, uint256 _amount) external onlyAdmin nonReentrant {
        _to.transfer(_amount);
    }

    /// @notice Executes a call to another contract with provided data, with the possibility to send ETH.
    /// @dev The `call` is a low-level interface for interacting with contracts.
    /// @param _target The contract address to execute the call on.
    /// @param _functionData The calldata to send for the call.
    function execute(
        address _target,
        bytes calldata _functionData
    ) external payable onlyAdmin nonReentrant {
        (bool _success, ) = _target.call{value: msg.value}(_functionData);
        require(_success, Constants.BAD_TREASURY_EXECUTION_ERROR);
    }

    /// @notice Batch executes multiple calls to contracts with provided data and ETH.
    /// @dev Useful for performing multiple administrative tasks in one transaction.
    /// @param _targets An array of contract addresses to execute the calls on.
    /// @param _functionData An array of calldata to send for the calls.
    function executeAll(
        address payable[] calldata _targets,
        bytes[] calldata _functionData
    ) external payable onlyAdmin nonReentrant {
        require(
            _targets.length == _functionData.length,
            Constants.BAD_TREASURY_BATCH_CALL
        );
        for (uint256 i = 0; i < _targets.length; i++) {
            this.execute(_targets[i], _functionData[i]);
        }
    }
}
