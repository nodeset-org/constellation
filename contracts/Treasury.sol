// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './UpgradeableBase.sol';
import './Utils/Constants.sol';

/// @title Treasury Contract
/// @notice A contract that allows the treasuerer to manage and execute transfers of ETH and ERC20 tokens.
/// @dev Inherits from UpgradeableBase to allow for future upgrades.
contract Treasury is UpgradeableBase {
    event ClaimedToken(address indexed _token, address indexed _to, uint256 indexed _amount);
    event ClaimedEth(address indexed _to, uint256 indexed _amount);
    event Executed(address indexed _target, bytes indexed _functionData);

    /// @notice Initializer that replaces constructor for upgradeable contracts.
    constructor() initializer {}

    /// @notice Initializes the contract by setting the directory address.
    /// @dev Overrides the initialize function of the UpgradeableBase.
    /// @param _directoryAddress The address of the directory contract to set.
    function initialize(address _directoryAddress) public virtual override initializer {
        super.initialize(_directoryAddress);
    }

    function _claimTokenInternal(address _tokenAddress, address _to, uint256 _amount) internal {
        IERC20(_tokenAddress).transfer(_to, _amount);
        emit ClaimedToken(_tokenAddress, _to, _amount);
    }

    function _claimEthInternal(address payable _to, uint256 _amount) internal {
        _to.transfer(_amount);
        emit ClaimedEth(_to, _amount);
    }

    function _executeInternal(address payable _target, bytes memory _functionData, uint256 _value) internal {
        (bool _success, bytes memory _returnData) = _target.call{value: _value}(_functionData);
        if (!_success) {
            assembly {
                let _returnData_size := mload(_returnData)
                revert(add(32, _returnData), _returnData_size)
            }
        }
        emit Executed(_target, _functionData);
    }

    /// @notice Allows the treasuerer to claim all ERC20 tokens of a particular type and send them to a specified address.
    /// @param _tokenAddress The address of the ERC20 token contract.
    /// @param _to The address to which the tokens will be sent.
    function claimToken(address _tokenAddress, address _to) external onlyTreasurer nonReentrant {
        _claimTokenInternal(_tokenAddress, _to, IERC20(_tokenAddress).balanceOf(address(this)));
    }

    /// @notice Allows the treasuerer to claim a specified amount of ERC20 tokens and send them to a given address.
    /// @param _tokenAddress The address of the ERC20 token.
    /// @param _to The recipient's address.
    /// @param _amount The amount of tokens to transfer.
    function claimToken(address _tokenAddress, address _to, uint256 _amount) external onlyTreasurer nonReentrant {
        _claimTokenInternal(_tokenAddress, _to, _amount);
    }

    /// @notice Enables the treasuerer to claim all ETH held by the contract and send it to a specified address.
    /// @param _to The payable address to which the ETH will be sent.
    function claimEth(address payable _to) external onlyTreasurer nonReentrant {
        _claimEthInternal(_to, address(this).balance);
    }

    /// @notice Allows the treasuerer to claim a specified amount of ETH and send it to a given address.
    /// @param _to The payable address to which the ETH will be transferred.
    /// @param _amount The amount of ETH to transfer.
    function claimEth(address payable _to, uint256 _amount) external onlyTreasurer nonReentrant {
        _claimEthInternal(_to, _amount);
    }

    /// @notice Executes a call to another contract with provided data, with the possibility to send ETH.
    /// @dev The `call` is a low-level interface for interacting with contracts.
    /// @param _target The contract address to execute the call on.
    /// @param _functionData The calldata to send for the call.
    function execute(address payable _target, bytes calldata _functionData) external payable onlyTreasurer nonReentrant {
        _executeInternal(_target, _functionData, msg.value);
    }

    /// @notice Batch executes multiple calls to contracts with provided data and ETH.
    /// @dev Useful for performing multiple treasuerer tasks in one transaction.
    /// @param _targets An array of contract addresses to execute the calls on.
    /// @param _functionData An array of calldata to send for the calls.
    /// @param _values msg.value per target
    function executeAll(
        address payable[] calldata _targets,
        bytes[] calldata _functionData,
        uint256[] calldata _values
    ) external payable onlyTreasurer nonReentrant {
        require(_targets.length == _functionData.length, Constants.BAD_TREASURY_BATCH_CALL);
        require(_values.length == _functionData.length, Constants.BAD_TREASURY_BATCH_CALL);
        for (uint256 i = 0; i < _targets.length; i++) {
            _executeInternal(_targets[i], _functionData[i], _values[i]);
        }
    }

    // we accept donations
    receive() external payable {}
}
