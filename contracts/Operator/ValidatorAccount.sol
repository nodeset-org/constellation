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
import '../Interfaces/RocketPool/IRocketNodeManager.sol';
import '../Interfaces/RocketPool/IRocketNetworkVoting.sol';
import '../Interfaces/RocketPool/IRocketDAOProtocolProposal.sol';
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
    ValidatorConfig public config;

    IMinipool public minipool;
    address public nodeOperator;

    uint256 public lockStarted;
    uint256 public lockedEth;

    uint256 public bond;

    modifier onlyNodeOperatorOrProtocol() {
        require(
            _directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender) || msg.sender == nodeOperator,
            'Can only be called by Protocol or NodeOperator!'
        );
        _;
    }

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
        config = _config;

        super.initialize(_directory);

        Directory directory = Directory(_directory);

        lockedEth = msg.value;
        bond = _config.bondAmount;

        bool isWhitelisted = Whitelist(directory.getWhitelistAddress()).getIsAddressInWhitelist(_nodeOperator);
        require(isWhitelisted, Constants.OPERATOR_NOT_FOUND_ERROR);

        nodeOperator = _nodeOperator;

        _registerNode(_config.timezoneLocation, _config.bondAmount, _nodeOperator);
        address dp = directory.getDepositPoolAddress();
        IRocketNodeManager(directory.getRocketNodeManagerAddress()).setRPLWithdrawalAddress(address(this), dp, true);
        IRocketStorage(directory.getRocketStorageAddress()).setWithdrawalAddress(address(this), dp, true);

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

    function createMinipool(ValidatorConfig calldata _config) public {
        require(msg.sender == nodeOperator, 'only nodeOperator');

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

        address _nodeOperator = nodeOperator;
        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        od.OnMinipoolCreated(_expectedMinipoolAddress, nodeOperator, _bondAmount);
        od.rebalanceRplStake(address(this), od.nodeOperatorEthStaked(_nodeOperator));

        lockStarted = block.timestamp;
        console.log('_createMinipool()');
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
        console.log('_createMinipool.status', uint256(minipool.getStatus()));
    }

    function stake() external onlyNodeOperatorOrProtocol {
        minipool.stake(config.validatorSignature, config.depositDataRoot);
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

    function distributeBalance(bool _rewardsOnly) external onlyNodeOperatorOrProtocol {
        minipool.distributeBalance(_rewardsOnly);
    }

    function setDelegate(address _newDelegate) external onlyNodeOperatorOrProtocol {
        IRocketNetworkVoting(_directory.getRocketNetworkVotingAddress()).setDelegate(_newDelegate);
    }

    function initialiseVoting() external onlyNodeOperatorOrProtocol {
        IRocketNetworkVoting(_directory.getRocketNetworkVotingAddress()).initialiseVoting();
    }

    function propose(
        string memory _proposalMessage,
        bytes calldata _payload,
        uint32 _blockNumber,
        IRocketDAOProtocolProposal.Node[] calldata _treeNodes
    ) external onlyNodeOperatorOrProtocol {
        IRocketDAOProtocolProposal(_directory.getRocketDAOProtocolProposalAddress()).propose(
            _proposalMessage,
            _payload,
            _blockNumber,
            _treeNodes
        );
    }

    function vote(
        uint256 _proposalID,
        IRocketDAOProtocolProposal.VoteDirection _voteDirection,
        uint256 _votingPower,
        uint256 _nodeIndex,
        IRocketDAOProtocolProposal.Node[] calldata _witness
    ) external onlyNodeOperatorOrProtocol {
        IRocketDAOProtocolProposal(_directory.getRocketDAOProtocolProposalAddress()).vote(
            _proposalID,
            _voteDirection,
            _votingPower,
            _nodeIndex,
            _witness
        );
    }
    function overrideVote(
        uint256 _proposalID,
        IRocketDAOProtocolProposal.VoteDirection _voteDirection
    ) external onlyNodeOperatorOrProtocol {
        IRocketDAOProtocolProposal(_directory.getRocketDAOProtocolProposalAddress()).overrideVote(
            _proposalID,
            _voteDirection
        );
    }
}
