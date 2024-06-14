// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import './OperatorDistributor.sol';

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
import '../Interfaces/RocketPool/IMinipool.sol';
import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../Interfaces/IWETH.sol';

import '../Utils/ProtocolMath.sol';
import '../Utils/Constants.sol';
import '../Utils/Errors.sol';

import 'hardhat/console.sol';

/// @custom:security-contact info@nodeset.io
/// @notice distributes rewards in weth to node operators
contract SuperNodeAccount is UpgradeableBase, Errors {
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

    mapping(address => ValidatorConfig) public configs;
    mapping(address => uint256) public lockedEth;
    mapping(address => uint256) public lockStarted;

    // keccak256(abi.encodePacked(subNodeOperator, _config.expectedMinipoolAddress))
    mapping(bytes32 => bool) public subNodeOperatorHasMinipool;

    uint256 public totalEthLocked;
    uint256 public totalEthStaking;

    // ex-vaf vars
    bool public preSignedExitMessageCheck;
    mapping(bytes => bool) public sigsUsed;

    uint256 public lockThreshhold;
    uint256 public lockUpTime;

    bool lazyInit;

    address[] public minipools;
    mapping(address => uint256) public minipoolIndex;
    mapping(address => address[]) public subNodeOperatorMinipools;
    uint256 public currentMinipool;

    modifier lazyInitializer() {
        require(!lazyInit, 'already lazily initialized');
        _;
        lazyInit = true;
    }

    modifier onlySubNodeOperator(address _minipool) {
        require(
            subNodeOperatorHasMinipool[keccak256(abi.encodePacked(msg.sender, _minipool))],
            'Can only be called by SubNodeOperator!'
        );
        _;
    }

    modifier onlySubNodeOperatorOrProtocol(address _minipool) {
        require(
            _directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender) ||
                subNodeOperatorHasMinipool[keccak256(abi.encodePacked(msg.sender, _minipool))],
            'Can only be called by Protocol or SubNodeOperator!'
        );
        _;
    }

    modifier onlyNodeOperatorOrAdmin(address _minipool) {
        require(
            _directory.hasRole(Constants.ADMIN_ROLE, msg.sender) ||
                subNodeOperatorHasMinipool[keccak256(abi.encodePacked(msg.sender, _minipool))],
            'Can only be called by Admin or NodeOperator!'
        );
        _;
    }

    modifier hasConfig(address _minipool) {
        require(lockStarted[_minipool] != 0, 'nodeAccount not initialized');
        _;
    }

    function initialize(address _directory) public override initializer {
        super.initialize(_directory);

        lockThreshhold = 1 ether;
        lockUpTime = 28 days;
        preSignedExitMessageCheck = true;
    }

    function lazyInitialize() external lazyInitializer {
        Directory directory = Directory(_directory);
        _registerNode('Australia/Brisbane');
        address dp = directory.getDepositPoolAddress();
        IRocketNodeManager(directory.getRocketNodeManagerAddress()).setRPLWithdrawalAddress(address(this), dp, true);
        IRocketStorage(directory.getRocketStorageAddress()).setWithdrawalAddress(address(this), dp, true);
    }

    function createMinipool(ValidatorConfig calldata _config, bytes memory _sig) public payable {
        require(msg.value == lockThreshhold, 'SuperNode: must lock 1 ether');
        require(hasSufficentLiquidity(_config.bondAmount), 'NodeAccount: protocol must have enough rpl and eth');
        require(
            Whitelist(_directory.getWhitelistAddress()).getIsAddressInWhitelist(msg.sender),
            'sub node operator must be whitelisted'
        );
        _createMinipool(_config, _sig, msg.sender);
    }

    function _registerNode(string memory _timezoneLocation) internal {
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).registerNode(_timezoneLocation);
    }

    function _createMinipool(ValidatorConfig calldata _config, bytes memory _sig, address subNodeOperator) internal {
        _validateSigUsed(_sig);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).provisionLiquiditiesForMinipoolCreation(
            subNodeOperator,
            _config.bondAmount
        );
        if (preSignedExitMessageCheck) {
            console.log('_createMinipool: message hash');
            console.logBytes32(
                keccak256(abi.encodePacked(_config.expectedMinipoolAddress, _config.salt, address(this)))
            );
            address recoveredAddress = ECDSA.recover(
                ECDSA.toEthSignedMessageHash(
                    keccak256(abi.encodePacked(_config.expectedMinipoolAddress, _config.salt, address(this)))
                ),
                _sig
            );
            require(
                _directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress),
                'signer must have permission from admin server role'
            );
        }

        subNodeOperatorHasMinipool[
            keccak256(abi.encodePacked(subNodeOperator, _config.expectedMinipoolAddress))
        ] = true;

        require(lockedEth[_config.expectedMinipoolAddress] == 0, 'minipool already initialized');

        lockedEth[_config.expectedMinipoolAddress] = msg.value;
        totalEthLocked += msg.value;
        lockStarted[_config.expectedMinipoolAddress] = block.timestamp;

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        od.OnMinipoolCreated(_config.expectedMinipoolAddress, subNodeOperator, _config.bondAmount);
        od.rebalanceRplStake(totalEthStaking + (32 ether - _config.bondAmount));

        minipoolIndex[_config.expectedMinipoolAddress] = minipools.length;
        minipools.push(_config.expectedMinipoolAddress);

        subNodeOperatorMinipools[subNodeOperator].push(_config.expectedMinipoolAddress);

        console.log('_createMinipool()');
        IRocketNodeDeposit(_directory.getRocketNodeDepositAddress()).deposit{value: _config.bondAmount}(
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

    function _removeMinipool(address _minipool) internal {
        uint256 index = minipoolIndex[_minipool];
        uint256 lastIndex = minipools.length - 1;
        address lastMinipool = minipools[lastIndex];

        minipools[index] = lastMinipool;
        minipoolIndex[lastMinipool] = index;

        minipools.pop();
        delete minipoolIndex[_minipool];
    }

    function removeAllMinipools(address _subNodeOperator) external onlyProtocol {
        address[] storage minipoolList = subNodeOperatorMinipools[_subNodeOperator];
        for (uint256 i = minipoolList.length; i > 0; i--) {
            address minipool = minipoolList[i - 1];
            _removeMinipool(minipool);
            minipoolList.pop();
            delete subNodeOperatorHasMinipool[keccak256(abi.encodePacked(_subNodeOperator, minipool))];
        }
        delete subNodeOperatorMinipools[_subNodeOperator];
    }

    function stake(address _minipool) external onlyNodeOperatorOrAdmin(_minipool) hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.stake(configs[_minipool].validatorSignature, configs[_minipool].depositDataRoot);
        // RP close call will revert unless you're in the right state, so this may waste your gas if you call at the wrong time!
        totalEthStaking += (32 ether - configs[_minipool].bondAmount);
    }

    function close(address _subNodeOperator, address _minipool) external hasConfig(_minipool) {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }

        IMinipool minipool = IMinipool(_minipool);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).onNodeMinipoolDestroy(
            _subNodeOperator,
            configs[_minipool].bondAmount
        );
        _removeMinipool(_minipool);

        totalEthStaking -= configs[_minipool].bondAmount;

        minipool.close();
    }

    function unlockEth(address _minipool) external onlySubNodeOperator(_minipool) hasConfig(_minipool) {
        require(lockedEth[_minipool] >= 1 ether, 'Insufficient locked ETH');
        require(
            block.timestamp - lockStarted[_minipool] > lockUpTime ||
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

    function _authorizeUpgrade(address _implementationAddress) internal view override only24HourTimelock {}

    /**
     * @dev Restricting this function to admin is the only way we can technologically enforce
     * a node operator to not slash the capital they get from constellation depositors. If we
     * open this function to node operators, they could inappropriately finalize and fully
     * withdraw a minipool, creating slashings on depositor capital.
     */
    function distributeBalance(
        bool _rewardsOnly,
        address _subNodeOperator,
        address _minipool
    ) external onlyAdmin hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.distributeBalance(_rewardsOnly);
        if (minipool.getFinalised()) {
            OperatorDistributor(_directory.getOperatorDistributorAddress()).onNodeMinipoolDestroy(
                _subNodeOperator,
                configs[_minipool].bondAmount
            );
            _removeMinipool(_minipool);
        }
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

    function delegateUpgrade(address _minipool) external onlySubNodeOperator(_minipool) hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateUpgrade();
    }

    function delegateRollback(
        address _minipool
    ) external onlySubNodeOperator(_minipool) hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateRollback();
    }

    function setUseLatestDelegate(
        bool _setting,
        address _minipool
    ) external onlySubNodeOperator(_minipool) hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.setUseLatestDelegate(_setting);
    }

    function _validateSigUsed(bytes memory _sig) internal {
        require(!sigsUsed[_sig], 'sig already used');
        sigsUsed[_sig] = true;
    }

    function usePreSignedExitMessageCheck() external onlyAdmin {
        preSignedExitMessageCheck = true;
    }

    function disablePreSignedExitMessageCheck() external onlyAdmin {
        preSignedExitMessageCheck = false;
    }

    /**
     * @notice Sets a new lock threshold.
     * @dev Only callable by the contract owner or authorized admin.
     * @param _newLockThreshold The new lock threshold value in wei.
     */
    function setLockThreshold(uint256 _newLockThreshold) external onlyAdmin {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        lockThreshhold = _newLockThreshold;
    }

    /**
     * @notice Sets a new lock-up time.
     * @dev Only callable by the contract owner or authorized admin.
     * @param _newLockUpTime The new lock-up time in seconds.
     */
    function setLockUpTime(uint256 _newLockUpTime) external onlyAdmin {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        lockUpTime = _newLockUpTime;
    }

    function hasSufficentLiquidity(uint256 _bond) public view returns (bool) {
        address payable od = _directory.getOperatorDistributorAddress();
        uint256 rplRequried = OperatorDistributor(od).calculateRequiredRplTopUp(0, _bond);
        return IERC20(_directory.getRPLAddress()).balanceOf(od) >= rplRequried && od.balance >= _bond;
    }

    receive() external payable {}

    function getNextMinipool() external onlyProtocol returns (IMinipool) {
        if (minipools.length == 0) {
            return IMinipool(address(0));
        }
        return IMinipool(minipools[currentMinipool++ % minipools.length]);
    }
}
