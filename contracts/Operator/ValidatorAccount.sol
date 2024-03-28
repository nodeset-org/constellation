// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './ValidatorAccountFactory.sol';

import '../Whitelist/Whitelist.sol';
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
    address public nodeOperator;

    uint256 public lockStarted;
    uint256 public lockedEth;

    uint256 public bond;

    function initialize(
        address _directory,
        address _nodeOperator,
        address _predictedAddress,
        ValidatorConfig calldata _config
    ) public payable initializer {
        if (_predictedAddress != address(this)) {
            revert BadPredictedCreation(_predictedAddress, address(this));
        }

        vaf = ValidatorAccountFactory(msg.sender);

        super.initialize(_directory);

        Directory directory = Directory(_directory);

        lockedEth = msg.value;
        bond = _config.bondAmount;

        bool isWhitelisted = Whitelist(directory.getWhitelistAddress()).getIsAddressInWhitelist(_nodeOperator);
        require(isWhitelisted, Constants.OPERATOR_NOT_FOUND_ERROR);

        nodeOperator = _nodeOperator;

        OperatorDistributor od = OperatorDistributor(directory.getOperatorDistributorAddress());

        od.OnMinipoolCreated(_config.expectedMinipoolAddress, nodeOperator, _config.bondAmount);

        _registerNode(_config.timezoneLocation, _config.bondAmount, _nodeOperator);

        address dp = directory.getDepositPoolAddress();
        IRocketNodeManager(directory.getRocketNodeManagerAddress()).setRPLWithdrawalAddress(address(this), dp, true);
        IRocketStorage(directory.getRocketStorageAddress()).setWithdrawalAddress(address(this), dp, true);
        od.performTopUp(address(this), od.nodeOperatorEthStaked(_nodeOperator));

        _createMinipool(
            _config.bondAmount,
            _config.minimumNodeFee,
            _config.validatorPubkey,
            _config.validatorSignature,
            _config.depositDataRoot,
            _config.salt,
            _config.expectedMinipoolAddress
        );

        // IRocketNodeStaking(directory.getRocketNodeStakingAddress()).setStakeRPLForAllowed(address(this), dp, true);
    }

    function _registerNode(string calldata _timezoneLocation, uint256 _bond, address _nodeOperator) internal {
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).registerNode(_timezoneLocation);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).provisionLiquiditiesForMinipoolCreation(
            _nodeOperator,
            address(this),
            _bond
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
        uint256 targetBond = vaf.targetBond();
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
        minipool = IMinipool(_expectedMinipoolAddress);
    }

    function close() external {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }

        OperatorDistributor(_directory.getOperatorDistributorAddress()).onNodeOperatorDissolved(nodeOperator, bond);

        minipool.close();
    }

    function unlock() external {
        require(
            block.timestamp - lockStarted > vaf.lockUpTime() || minipool.getStatus() == MinipoolStatus.Staking,
            'ValidatorAccount: locked eth can be redeemed after lockUpTime has elapsed or minipool is staking'
        );
        require(msg.sender == nodeOperator, 'ValidatorAccount: Only node operator can redeem lock');
        require(lockedEth != 0, 'ValidatorAccount: funds already unlocked');

        lockedEth = 0;
        (bool success, bytes memory data) = nodeOperator.call{value: vaf.lockThreshhold()}('');
        if (!success) {
            console.log('LowLevelEthTransfer 2');
            revert LowLevelEthTransfer(success, data);
        }
    }

    function withdraw(uint256 _amount) external {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        require(minipool.getStatus() == MinipoolStatus.Dissolved, 'minipool must be dissolved');

        (bool success, bytes memory data) = _directory.getDepositPoolAddress().call{value: _amount}('');
        if (!success) {
            console.log('LowLevelEthTransfer 3');
            revert LowLevelEthTransfer(success, data);
        }
    }

    function _authorizeUpgrade(address) internal override onlyProtocol {}
}
