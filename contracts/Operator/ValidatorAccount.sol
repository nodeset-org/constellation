// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './ValidatorAccountFactory.sol';

import './OperatorDistributor.sol';
import '../Whitelist/Whitelist.sol';
import '../Utils/ProtocolMath.sol';
import '../UpgradeableBase.sol';

import '../Interfaces/RocketPool/IRocketNodeDeposit.sol';
import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../Interfaces/IWETH.sol';
import '../Utils/Constants.sol';
import '../Utils/Errors.sol';

/// @custom:security-contact info@nodeset.io
/// @notice distributes rewards in weth to node operators
contract ValidatorAccount is UpgradeableBase, Errors {
    struct ValidatorConfig {
        string timezoneLocation;
        uint256 bondAmount;
        uint256 minimumNodeFee;
        bytes validatorPubkey;
        bytes validatorSignature;
        bytes32 depositDataRoot;
        uint256 salt;
        address expectedMinipoolAddress;
    }

    ValidatorAccountFactory public vaf;

    IMinipool public minipool;
    uint256 public targetBond;
    address nodeOperator;

    uint256 lockUpTime;
    uint256 lockedEth;
    uint256 lockStarted;

    /**
     * @notice Initializes the contract with the specified directory address and sets the initial configurations.
     * validator settings.
     * @param _config The address of the directory contract or service that this contract will reference.
     */
    function initialize(address _directory, address _nodeOperator, ValidatorConfig calldata _config) public payable initializer {
        super.initialize(_directory);
        targetBond = 8e18; // initially set for LEB8
        lockUpTime = 28 days;
        nodeOperator = _nodeOperator;

        lockedEth = msg.value;


        _registerNode(_config.timezoneLocation);
        // todo:
        // tranfer that eth in
        _createMinipool(
            _config.bondAmount,
            _config.minimumNodeFee,
            _config.validatorPubkey,
            _config.validatorSignature,
            _config.depositDataRoot,
            _config.salt,
            _config.expectedMinipoolAddress
        );
    }

    function _registerNode(string calldata _timezoneLocation) internal {
        if (nodeOperator == address(0)) {
            revert ZeroAddressError();
        }
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).registerNode(_timezoneLocation);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).prepareOperatorForDeposit(
            nodeOperator,
            address(this)
        );
    }

    function _createMinipool(
        uint256 _bondAmount,
        uint256 _minimumNodeFee,
        bytes calldata _validatorPubkey,
        bytes calldata _validatorSignature,
        bytes32 _depositDataRoot,
        uint256 _salt,
        address _expectedMinipoolAddress
    ) internal {
        if (targetBond != _bondAmount) {
            revert BadBondAmount(targetBond, _bondAmount);
        }
        if (targetBond > address(this).balance - lockedEth) {
            revert InsufficientBalance(targetBond, address(this).balance - lockedEth);
        }

        lockStarted = block.timestamp;

        IRocketNodeDeposit(_directory.getRocketNodeDepositAddress()).deposit{value: targetBond}(
            _bondAmount,
            _minimumNodeFee,
            _validatorPubkey,
            _validatorSignature,
            _depositDataRoot,
            _salt,
            _expectedMinipoolAddress
        );

        OperatorDistributor(_directory.getOperatorDistributorAddress()).OnMinipoolCreated(
            _expectedMinipoolAddress,
            nodeOperator,
            _bondAmount
        );
        minipool = IMinipool(_expectedMinipoolAddress);
    }

    function close() external {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }

        minipool.close();
    }

    function unlock() external {
        require(
            block.timestamp - lockStarted > lockUpTime,
            'ValidatorAccount: locked eth can be redeemed after lockUpTime has eleapsed'
        );
        require(msg.sender == nodeOperator, 'ValidatorAccount: Only node operator can redeem lock');
        require(lockedEth != 0, 'ValidatorAccount: funds already unlocked');

        lockedEth = 0;
        (bool success, bytes memory data) = nodeOperator.call{value: vaf.lockThreshhold()}('');
        if (!success) {
            revert LowLevelEthTransfer(success, data);
        }
    }

    function withdraw(uint256 _amount, address _to) external {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }

        (bool success, bytes memory data) = _to.call{value: _amount}('');
        if (!success) {
            revert LowLevelEthTransfer(success, data);
        }
    }
}
