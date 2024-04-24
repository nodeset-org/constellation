// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import './NodeAccountFactory.sol';
import './OperatorDistributor.sol';

import '../Whitelist/Whitelist.sol';
import '../Whitelist/Whitelist.sol';
import '../UpgradeableBase.sol';

import '../Interfaces/RocketPool/RocketTypes.sol';
import '../Interfaces/RocketPool/IRocketNodeDeposit.sol';
import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/RocketPool/IRocketNodeManager.sol';
import '../Interfaces/RocketPool/IRocketNetworkVoting.sol';
import '../Interfaces/RocketPool/IRocketDAOProtocolProposal.sol';
import '../Interfaces/RocketPool/IRocketMerkleDistributorMainnet.sol';
import '../Interfaces/RocketPool/IRocketStorage.sol';
import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../Interfaces/IWETH.sol';

import '../Utils/ProtocolMath.sol';
import '../Utils/Constants.sol';
import '../Utils/Errors.sol';

/// @custom:security-contact info@nodeset.io
/// @notice distributes rewards in weth to node operators
contract NodeAccount is UpgradeableBase, Errors {
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

    NodeAccountFactory public vaf;

    mapping(address => ValidatorConfig) public configs;
    mapping(address => uint256) public lockedEth;
    mapping(address => uint256) public lockStarted;

    address public nodeOperator;
    uint256 public totalEthLocked;

    modifier onlyNodeOperatorOrProtocol() {
        require(
            _directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender) || msg.sender == nodeOperator,
            'Can only be called by Protocol or NodeOperator!'
        );
        _;
    }

    modifier onlyNodeOperatorOrAdmin() {
        require(
            _directory.hasRole(Constants.ADMIN_ROLE, msg.sender) || msg.sender == nodeOperator,
            'Can only be called by Admin or NodeOperator!'
        );
        _;
    }

    modifier hasConfig(address _minipool) {
        require(lockStarted[_minipool] != 0, 'nodeAccount not initialized');
        _;
    }

    function initialize(
        address _directory,
        address _nodeOperator,
        address _predictedAddress,
        ValidatorConfig calldata _config,
        bytes memory _sig
    ) public payable initializer {
        super.initialize(_directory);

        if (_predictedAddress != address(this)) {
            revert BadPredictedCreation(_predictedAddress, address(this));
        }

        vaf = NodeAccountFactory(msg.sender);
        configs[_config.expectedMinipoolAddress] = _config;

        Directory directory = Directory(_directory);

        bool isWhitelisted = Whitelist(directory.getWhitelistAddress()).getIsAddressInWhitelist(_nodeOperator);
        require(isWhitelisted, Constants.OPERATOR_NOT_FOUND_ERROR);

        nodeOperator = _nodeOperator;

        _registerNode(_config.timezoneLocation, _config.bondAmount, _nodeOperator);
        address dp = directory.getDepositPoolAddress();
        IRocketNodeManager(directory.getRocketNodeManagerAddress()).setRPLWithdrawalAddress(address(this), dp, true);
        IRocketStorage(directory.getRocketStorageAddress()).setWithdrawalAddress(address(this), dp, true);

        _createMinipool(_config, _sig);
    }

    function createMinipool(ValidatorConfig calldata _config, bytes memory _sig) public payable {
        require(msg.sender == nodeOperator, 'only nodeOperator');
        require(msg.value == vaf.lockThreshhold(), 'NodeAccount: must lock 1 ether');

        _createMinipool(_config, _sig);
    }

    function _registerNode(string calldata _timezoneLocation, uint256 _bond, address _nodeOperator) internal {
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).registerNode(_timezoneLocation);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).provisionLiquiditiesForMinipoolCreation(
            _nodeOperator,
            address(this),
            _bond
        );
    }

    function _createMinipool(ValidatorConfig calldata _config, bytes memory _sig) internal {
        vaf.validateSigUsed(_sig);
        if (vaf.preSignedExitMessageCheck()) {
            console.log('_createMinipool: message hash');
            console.logBytes32(
                keccak256(abi.encodePacked(_config.expectedMinipoolAddress, _config.salt, address(vaf)))
            );
            address recoveredAddress = ECDSA.recover(
                ECDSA.toEthSignedMessageHash(
                    keccak256(abi.encodePacked(_config.expectedMinipoolAddress, _config.salt, address(vaf)))
                ),
                _sig
            );
            require(
                _directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress),
                'signer must have permission from admin server role'
            );
        }

        uint256 targetBond = vaf.targetBond();
        if (targetBond != _config.bondAmount) {
            revert BadBondAmount(targetBond, _config.bondAmount);
        }
        if (targetBond > address(this).balance - totalEthLocked) {
            revert InsufficientBalance(targetBond, address(this).balance - totalEthLocked);
        }
        require(lockedEth[_config.expectedMinipoolAddress] == 0, 'minipool already initialized');

        lockedEth[_config.expectedMinipoolAddress] = msg.value;
        totalEthLocked += msg.value;
        lockStarted[_config.expectedMinipoolAddress] = block.timestamp;

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        od.OnMinipoolCreated(_config.expectedMinipoolAddress, nodeOperator, _config.bondAmount);
        od.rebalanceRplStake(address(this), od.nodeOperatorEthStaked(nodeOperator));

        console.log('_createMinipool()');
        IRocketNodeDeposit(_directory.getRocketNodeDepositAddress()).deposit{value: targetBond}(
            _config.bondAmount,
            _config.minimumNodeFee,
            _config.validatorPubkey,
            _config.validatorSignature,
            _config.depositDataRoot,
            _config.salt,
            _config.expectedMinipoolAddress
        );
        IMinipool minipool = IMinipool(_config.expectedMinipoolAddress);
        console.log('_createMinipool.status', uint256(minipool.getStatus()));
    }

    function stake(address _minipool) external onlyNodeOperatorOrProtocol hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.stake(configs[_minipool].validatorSignature, configs[_minipool].depositDataRoot);
    }

    function close(address _minipool) external hasConfig(_minipool) {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }

        IMinipool minipool = IMinipool(_minipool);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).onNodeMinipoolDestroy(
            nodeOperator,
            configs[_minipool].bondAmount
        );

        minipool.close();
    }

    function unlockEth(address _minipool) external onlyNodeOperatorOrProtocol hasConfig(_minipool) {
        require(lockedEth[_minipool] >= 1 ether, 'Insufficient locked ETH');
        require(
            block.timestamp - lockStarted[_minipool] > vaf.lockUpTime() ||
                IMinipool(configs[_minipool].expectedMinipoolAddress).getStatus() == MinipoolStatus.Staking,
            'Lock conditions not met'
        );

        lockedEth[_minipool] -= 1 ether;
        totalEthLocked -= 1 ether;
        (bool success, ) = msg.sender.call{value: 1 ether}('');
        require(success, 'ETH transfer failed');
    }

    function withdraw(uint256 _amount, address _minipool) external hasConfig(_minipool) {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        IMinipool minipool = IMinipool(_minipool);
        require(minipool.getStatus() == MinipoolStatus.Dissolved, 'minipool must be dissolved');

        (bool success, bytes memory data) = _directory.getDepositPoolAddress().call{value: _amount}('');
        if (!success) {
            console.log('LowLevelEthTransfer 3');
            revert LowLevelEthTransfer(success, data);
        }
    }

    function _authorizeUpgrade(address _implementationAddress) internal view override onlyNodeOperatorOrAdmin {
        require(_implementationAddress == vaf.implementationAddress(), 'only upgradable to vaf.implementationAddress');
    }

    function distributeBalance(
        bool _rewardsOnly,
        address _minipool
    ) external onlyNodeOperatorOrProtocol hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.distributeBalance(_rewardsOnly);
        if (minipool.getFinalised()) {
            OperatorDistributor(_directory.getOperatorDistributorAddress()).onNodeMinipoolDestroy(
                nodeOperator,
                configs[_minipool].bondAmount
            );
        }
    }

    function setDelegate(address _newDelegate) external onlyNodeOperatorOrProtocol {
        IRocketNetworkVoting(_directory.getRocketNetworkVotingAddress()).setDelegate(_newDelegate);
    }

    function initialiseVoting() external onlyNodeOperatorOrProtocol {
        IRocketNetworkVoting(_directory.getRocketNetworkVotingAddress()).initialiseVoting();
    }

    function merkleClaim(
        address _nodeAddress,
        uint256[] calldata _rewardIndex,
        uint256[] calldata _amountRPL,
        uint256[] calldata _amountETH,
        bytes32[][] calldata _merkleProof
    ) public {
        IRocketMerkleDistributorMainnet(_directory.getRocketMerkleDistributorMainnetAddress()).claim(
            _nodeAddress,
            _rewardIndex,
            _amountRPL,
            _amountETH,
            _merkleProof
        );
    }

    function vote(
        uint256 _proposalID,
        VoteDirection _voteDirection,
        uint256 _votingPower,
        uint256 _nodeIndex,
        Node[] calldata _witness
    ) external onlyNodeOperatorOrProtocol {
        IRocketDAOProtocolProposal(_directory.getRocketDAOProtocolProposalAddress()).vote(
            _proposalID,
            _voteDirection,
            _votingPower,
            _nodeIndex,
            _witness
        );
    }

    function overrideVote(uint256 _proposalID, VoteDirection _voteDirection) external onlyNodeOperatorOrProtocol {
        IRocketDAOProtocolProposal(_directory.getRocketDAOProtocolProposalAddress()).overrideVote(
            _proposalID,
            _voteDirection
        );
    }

    function delegateUpgrade(address _minipool) external onlyNodeOperatorOrProtocol hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateUpgrade();
    }

    function delegateRollback(address _minipool) external onlyNodeOperatorOrProtocol hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateRollback();
    }

    function setUseLatestDelegate(
        bool _setting,
        address _minipool
    ) external onlyNodeOperatorOrProtocol hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.setUseLatestDelegate(_setting);
    }
}
