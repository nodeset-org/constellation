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
import '../Interfaces/RocketPool/IRocketMinipoolManager.sol';
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

// WE NOW ASSUME WE ONLY SUPPORT STAKING WITH LEB8s

/**
 * @title SuperNodeAccount
 * @author Theodore Clapp, Mike Leach
 * @dev Abstracts all created minipools under a single address / minipool owner
 */
contract SuperNodeAccount is UpgradeableBase, Errors {
    // Mapping of minipool address to the amount of ETH locked
    mapping(address => uint256) public lockedEth;
    // Mapping of minipool address to the timestamp when locking started
    mapping(address => uint256) public lockStarted;

    // keccak256(abi.encodePacked(subNodeOperator, _config.expectedMinipoolAddress))
    // Mapping of keccak256 hash of subNodeOperator and minipool address to bool indicating if a minipool exists
    mapping(bytes32 => bool) public subNodeOperatorHasMinipool;

    // Total amount of ETH locked in all minipools
    uint256 public totalEthLocked;
    // Total amount of ETH staked in all minipools
    uint256 public totalEthStaking;

    // Variables for pre-signed exit message checks
    bool public adminServerCheck;
    mapping(bytes => bool) public sigsUsed;
    uint256 public adminServerSigExpiry;

    // Lock threshold amount in wei
    uint256 public lockThreshold;
    // Lock-up time in seconds
    uint256 public lockUpTime;

    bool lazyInit;

    // List of all minipools
    address[] public minipools;
    // Mapping of minipool address to its index in the minipools array
    mapping(address => uint256) public minipoolIndex;
    // Mapping of sub-node operator address to their list of minipools
    mapping(address => address[]) public subNodeOperatorMinipools;
    // Index for the current minipool being processed
    uint256 public currentMinipool;

    // admin settings
    uint256 public bond;
    uint256 public minimumNodeFee;

    /// @notice Modifier to ensure a function can only be called once for lazy initialization
    modifier lazyInitializer() {
        require(!lazyInit, 'already lazily initialized');
        _;
        lazyInit = true;
    }

    /// @notice Modifier to ensure a function can only be called by a sub-node operator of a specific minipool
    modifier onlySubNodeOperator(address _minipool) {
        require(
            subNodeOperatorHasMinipool[keccak256(abi.encodePacked(msg.sender, _minipool))],
            'Can only be called by SubNodeOperator!'
        );
        _;
    }

    /// @notice Modifier to ensure a function can only be called by a sub-node operator or admin of a specific minipool
    modifier onlySubNodeOperatorOrAdmin(address _minipool) {
        require(
            _directory.hasRole(Constants.ADMIN_ROLE, msg.sender) ||
                subNodeOperatorHasMinipool[keccak256(abi.encodePacked(msg.sender, _minipool))],
            'Can only be called by SubNodeOperator!'
        );
        _;
    }

    /// @notice Modifier to ensure a function can only be called if the minipool has been configured
    modifier hasConfig(address _minipool) {
        require(lockStarted[_minipool] != 0, 'nodeAccount not initialized');
        _;
    }

    /**
     * @notice Initializes the contract with the provided directory address.
     * @dev This function should only be called once, during contract creation or proxy initialization.
     * @param _directory The address of the directory contract.
     */
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);

        lockThreshold = 1 ether;
        lockUpTime = 28 days;
        adminServerCheck = true;
        adminServerSigExpiry = 1 days;
        minimumNodeFee = 14e16;
        bond = 8 ether;
    }

    /**
     * @notice Performs lazy initialization of the contract.
     */
    function lazyInitialize() external lazyInitializer {
        Directory directory = Directory(_directory);
        _registerNode('Australia/Brisbane');
        address dp = directory.getDepositPoolAddress();
        IRocketNodeManager(directory.getRocketNodeManagerAddress()).setRPLWithdrawalAddress(address(this), dp, true);
        IRocketStorage(directory.getRocketStorageAddress()).setWithdrawalAddress(address(this), dp, true);
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).setSmoothingPoolRegistrationState(true);
    }

    /**
     * @notice This function is responsible for the creation and initialization of a minipool based on the validator's configuration.
     *         It requires that the calling node operator is whitelisted and that the signature provided for the minipool creation is valid.
     *         It also checks for sufficient liquidity (both RPL and ETH) before proceeding with the creation.
     * @dev The function involves multiple steps:
     *      1. Validates that the transaction contains the exact amount of ETH specified in the `lockThreshold`.
     *      2. Checks if there is sufficient liquidity available for the required bond amount in both RPL and ETH.
     *      3. Validates that the sender (sub-node operator) is whitelisted.
     *      4. Ensures the signature provided has not been used before and marks it as used.
     *      5. If pre-signed exit message checks are enabled, it verifies that the signature recovers to an address with the admin server role.
     *      6. Ensures that the expected minipool address from the configuration has not been initialized before.
     *      7. Locks the sent ETH, updates the total locked ETH count, and sets the timestamp when the lock started.
     *      8. Adds the minipool to the tracking arrays and mappings.
     *      9. Calls the `OperatorDistributor` to handle liquidity provisioning and event logging for the minipool creation.
     *      10. Finally, it delegates the deposit to the `RocketNodeDeposit` contract with all the required parameters from the configuration.
     *
     *      It's crucial that this function is called with correct and validated parameters to ensure the integrity of the node and minipool registration process.
     *
     * @notice _config A `ValidatorConfig` struct containing:
     *        - timezoneLocation: String representation of the validator's timezone.
     *        - bondAmount: The amount of ETH to be bonded.
     *        - minimumNodeFee: Minimum fee for the node operations.
     *        - validatorPubkey: Public key of the validator.
     *        - validatorSignature: Signature from the validator for verification.
     *        - depositDataRoot: Root hash of the deposit data.
     *        - salt: Random nonce used for generating the expected minipool address.
     *        - expectedMinipoolAddress: Precomputed address expected to be generated for the new minipool.
     * @param _sig The signature provided for minipool creation, used for admin verification if pre-signed exit message checks are enabled.
     */
    function createMinipool(
        bytes calldata _validatorPubkey,
        bytes calldata _validatorSignature,
        bytes32 _depositDataRoot,
        uint256 _salt,
        address _expectedMinipoolAddress,
        uint256 _sigGenesisTime,
        bytes memory _sig
    ) public payable {
        require(msg.value == lockThreshold, 'SuperNode: must set the message value to lockThreshold');
        require(
            IRocketMinipoolManager(_directory.getRocketMinipoolManagerAddress()).getMinipoolExists(
                _expectedMinipoolAddress
            ) == false,
            'minipool already initialized'
        );
        address subNodeOperator = msg.sender;
        require(
            Whitelist(_directory.getWhitelistAddress()).getIsAddressInWhitelist(subNodeOperator),
            'sub node operator must be whitelisted'
        );
        require(hasSufficientLiquidity(bond), 'NodeAccount: protocol must have enough rpl and eth');

        _validateSigUsed(_sig);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).provisionLiquiditiesForMinipoolCreation(bond);
        if (adminServerCheck) {
            require(block.timestamp - _sigGenesisTime < adminServerSigExpiry, 'as sig expired');
            console.log('_createMinipool: message hash');
            console.logBytes32(
                keccak256(abi.encodePacked(_expectedMinipoolAddress, _salt, address(this), block.chainid))
            );
            address recoveredAddress = ECDSA.recover(
                ECDSA.toEthSignedMessageHash(
                    keccak256(
                        abi.encodePacked(_expectedMinipoolAddress, _salt, _sigGenesisTime, address(this), block.chainid)
                    )
                ),
                _sig
            );
            require(
                _directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress),
                'signer must have permission from admin server role'
            );
        }

        subNodeOperatorHasMinipool[keccak256(abi.encodePacked(subNodeOperator, _expectedMinipoolAddress))] = true;

        lockedEth[_expectedMinipoolAddress] = msg.value;
        totalEthLocked += msg.value;
        lockStarted[_expectedMinipoolAddress] = block.timestamp;

        minipoolIndex[_expectedMinipoolAddress] = minipools.length;
        minipools.push(_expectedMinipoolAddress);

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        od.onMinipoolCreated(_expectedMinipoolAddress, subNodeOperator, bond);
        od.rebalanceRplStake(totalEthStaking + (32 ether - bond));

        subNodeOperatorMinipools[subNodeOperator].push(_expectedMinipoolAddress);

        console.log('_createMinipool()');
        IRocketNodeDeposit(_directory.getRocketNodeDepositAddress()).deposit{value: bond}(
            bond,
            minimumNodeFee,
            _validatorPubkey,
            _validatorSignature,
            _depositDataRoot,
            _salt,
            _expectedMinipoolAddress
        );
        IMinipool minipool = IMinipool(_expectedMinipoolAddress);
        console.log('_createMinipool.status', uint256(minipool.getStatus()));
        console.log('finished creating minipool without revert from deposit to casper');
    }

    /**
     * @notice Registers a new node with the specified timezone location.
     * @param _timezoneLocation The timezone location of the node.
     */
    function _registerNode(string memory _timezoneLocation) internal {
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).registerNode(_timezoneLocation);
    }

    /**
     * @notice Stops tracking a specified minipool by removing it from the active list.
     * @dev Removes a minipool from the active tracking array and updates mappings to reflect this change.
     *      This is used when a minipool is destroyed or decommissioned.
     * @param _minipool The address of the minipool to be removed from tracking.
     */
    function _stopTrackingMinipool(address _minipool) internal {
        uint256 index = minipoolIndex[_minipool];
        uint256 lastIndex = minipools.length - 1;
        address lastMinipool = minipools[lastIndex];

        minipools[index] = lastMinipool;
        minipoolIndex[lastMinipool] = index;

        minipools.pop();
        delete minipoolIndex[_minipool];
    }

    /**
     * @notice Stops tracking all minipools associated with a specific sub-node operator.
     * @dev Iteratively calls `_stopTrackingMinipool` for each minipool associated with the sub-node operator.
     *      This is typically used when a sub-node operator is decommissioned or their operation is terminated.
     * @param _subNodeOperator The address of the sub-node operator whose minipools are to be stopped from tracking.
     */
    function stopTrackingOperatorMinipools(address _subNodeOperator) external onlyProtocol {
        address[] storage minipoolList = subNodeOperatorMinipools[_subNodeOperator];
        for (uint256 i = minipoolList.length; i > 0; i--) {
            address minipool = minipoolList[i - 1];
            _stopTrackingMinipool(minipool);
            minipoolList.pop();
            delete subNodeOperatorHasMinipool[keccak256(abi.encodePacked(_subNodeOperator, minipool))];
        }
        delete subNodeOperatorMinipools[_subNodeOperator];
    }

    /**
     * @notice Initiates the staking process for a specified minipool.
     * @dev Calls the `stake` method on the minipool contract with necessary parameters.
     *      This function can only be called by the sub-node operator of the minipool and when the minipool is properly configured.
     * @param _minipool The address of the minipool to initiate staking.
     */
    function stake(
        bytes calldata _validatorSignature,
        bytes32 _depositDataRoot,
        address _minipool
    ) external onlySubNodeOperator(_minipool) hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.stake(_validatorSignature, _depositDataRoot);
        // RP close call will revert unless you're in the right state, so this may waste your gas if you call at the wrong time!
        totalEthStaking += (32 ether - bond);

        // Refund the locked ETH
        uint256 lockupBalance = lockedEth[_minipool];
        if (lockupBalance >= 0) {
            lockedEth[_minipool] = 0;
            totalEthLocked -= lockupBalance;
            (bool success, ) = msg.sender.call{value: lockupBalance}('');
            require(success, 'ETH transfer failed');
        }
    }

    /**
     * @notice Closes a minipool and updates the tracking and financial records accordingly.
     * @dev This function handles the administrative closure of a minipool, ensuring that the associated staking records
     *      and financials are updated. Only callable by an admin.
     * @param _subNodeOperator Address of the sub-node operator associated with the minipool.
     * @param _minipool Address of the minipool to close.
     */
    function close(address _subNodeOperator, address _minipool) external hasConfig(_minipool) {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }

        IMinipool minipool = IMinipool(_minipool);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).onNodeMinipoolDestroy(_subNodeOperator, bond);
        _stopTrackingMinipool(_minipool);

        totalEthStaking -= bond;

        minipool.close();
    }

    /**
     * @notice Unlocks and transfers a fixed amount of ETH back to the sub-node operator from a minipool.
     * @dev Ensures that the minipool has been locked for a sufficient period or is in the staking state before allowing ETH to be unlocked.
     *      This function is a safeguard to prevent premature withdrawal of locked funds which could affect minipool operations and rewards.
     * @param _minipool Address of the minipool from which ETH will be unlocked.
     */
    function unlockEth(address _minipool) external onlySubNodeOperator(_minipool) hasConfig(_minipool) {
        require(lockedEth[_minipool] > 0, 'Insufficient locked ETH');
        require(
            block.timestamp - lockStarted[_minipool] > lockUpTime ||
                IMinipool(_minipool).getStatus() == MinipoolStatus.Staking,
            'Lock conditions not met'
        );

        uint256 lockupBalance = lockedEth[_minipool];
        lockedEth[_minipool] = 0;
        totalEthLocked -= lockupBalance;
        (bool success, ) = msg.sender.call{value: lockupBalance}('');
        require(success, 'ETH transfer failed');
    }

    // we don't even need this anymore
    /*
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
*/

    /**
     * @notice Distributes staking rewards or allows for finalizing the minipool based on the given parameter.
     * @dev Admins can call this function to either distribute rewards only or to finalize and close a minipool.
     *      This function ensures that only admins can trigger these critical operations to maintain system integrity.
     *      Restricting this function to admin is the only way we can technologically enforce
     *      a node operator to not slash the capital they get from constellation depositors. If we
     *      open this function to node operators, they could inappropriately finalize and fully
     *      withdraw a minipool, creating slashings on depositor capital.
     * @param _rewardsOnly If true, only distributes rewards; if false, it may also finalize the minipool.
     * @param _subNodeOperator Address of the sub-node operator associated with the minipool.
     * @param _minipool Address of the minipool for which to distribute rewards or finalize.
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
                bond
            );
            _stopTrackingMinipool(_minipool);
        }
    }

    /**
     * @notice Claims rewards for a node based on a Merkle proof, distributing specified amounts of RPL and ETH.
     * @dev This function interfaces with the RocketMerkleDistributorMainnet to allow nodes to claim their rewards.
     *      The rewards are determined by a Merkle proof which validates the amounts to be claimed.
     * @param _nodeAddress Address of the node claiming the rewards.
     * @param _rewardIndex Array of indices in the Merkle tree corresponding to reward entries.
     * @param _amountRPL Array of amounts of RPL tokens to claim.
     * @param _amountETH Array of amounts of ETH to claim.
     * @param _merkleProof Array of Merkle proofs for each reward entry.
     */
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

    /**
     * @notice Allows sub-node operators or admins to delegate an upgrade to the minipool's contract.
     * @dev This function provides a mechanism for delegated upgrades of minipools, enhancing flexibility in maintenance and upgrades.
     * @param _minipool Address of the minipool which is to be upgraded.
     */
    function delegateUpgrade(address _minipool) external onlySubNodeOperatorOrAdmin(_minipool) hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateUpgrade();
    }

    /**
     * @notice Allows sub-node operators or admins to rollback a delegated upgrade.
     * @dev Provides a rollback mechanism for previously delegated upgrades, ensuring that upgrades can be reversed if necessary.
     * @param _minipool Address of the minipool whose upgrade is to be rolled back.
     */
    function delegateRollback(address _minipool) external onlySubNodeOperatorOrAdmin(_minipool) hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateRollback();
    }

    /**
     * @notice Sets the delegation setting for a minipool to either use the latest delegate or not.
     * @dev Allows node operators or admins to configure whether a minipool should follow the latest delegate or not.
     * @param _setting Boolean indicating whether to use the latest delegate.
     * @param _minipool Address of the minipool whose delegation setting is to be configured.
     */
    function setUseLatestDelegate(
        bool _setting,
        address _minipool
    ) external onlySubNodeOperatorOrAdmin(_minipool) hasConfig(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.setUseLatestDelegate(_setting);
    }

    /**
     * @notice Validates if a signature has already been used to prevent replay attacks.
     * @dev This function checks against a mapping to ensure that each signature is used only once,
     *      adding an additional layer of security by preventing the reuse of signatures in unauthorized transactions.
     * @param _sig The signature to validate.
     */
    function _validateSigUsed(bytes memory _sig) internal {
        require(!sigsUsed[_sig], 'sig already used');
        sigsUsed[_sig] = true;
    }

    /**
     * @notice Enables the server-admin approved sigs
     * @dev This function can be called by an admin to activate the needing approval for admin-server
     */
    function useAdminServerCheck() external onlyAdmin {
        adminServerCheck = true;
    }

    /**
     * @notice Disables the server-admin approved sigs
     * @dev This function can be called by an admin to deactivate the needing approval for admin-server
     */
    function disableAdminServerCheck() external onlyAdmin {
        adminServerCheck = false;
    }

    /**
     * @notice Sets a new lock threshold.
     * @dev Only callable by the contract owner or authorized admin.
     * @param _newLockThreshold The new lock threshold value in wei.
     */
    function setLockAmount(uint256 _newLockThreshold) external onlyShortTimelock {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        lockThreshold = _newLockThreshold;
    }

    /**
     * @notice Sets a new lock-up time.
     * @dev Only callable by the contract owner or authorized admin.
     * @param _newLockUpTime The new lock-up time in seconds.
     */
    function setLockUpTime(uint256 _newLockUpTime) external onlyShortTimelock {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        lockUpTime = _newLockUpTime;
    }

    /**
     * @notice Checks if there is sufficient liquidity in the protocol to cover a specified bond amount.
     * @dev This function helps ensure that there are enough resources (both RPL and ETH) available in the system to cover the bond required for creating or operating a minipool. It is crucial for maintaining financial stability and operational continuity.
     * @param _bond The bond amount in wei for which liquidity needs to be checked.
     * @return bool Returns true if there is sufficient liquidity to cover the bond; false otherwise.
     */
    function hasSufficientLiquidity(uint256 _bond) public view returns (bool) {
        address payable od = _directory.getOperatorDistributorAddress();
        IRocketNodeStaking rocketNodeStaking = IRocketNodeStaking(_directory.getRocketNodeStakingAddress());
        uint256 rplStaking = rocketNodeStaking.getNodeRPLStake(address(this));
        uint256 rplRequired = OperatorDistributor(od).calculateRplStakeShortfall(rplStaking, totalEthStaking + _bond);
        return IERC20(_directory.getRPLAddress()).balanceOf(od) >= rplRequired && od.balance >= _bond;
    }

    receive() external payable {}

    /**
     * @notice Retrieves the next minipool in the sequence to process tasks such as reward distribution or updates.
     * @dev This function helps in managing the rotation and handling of different minipools within the system. It ensures that operations are spread evenly and systematically across all active minipools.
     * @return IMinipool Returns the address of the next minipool to process. Returns the zero address if there are no minipools left to process.
     */
    function getNextMinipool() external onlyProtocol returns (IMinipool) {
        if (minipools.length == 0) {
            return IMinipool(address(0));
        }
        return IMinipool(minipools[currentMinipool++ % minipools.length]);
    }

    function setAdminServerSigExpiry(uint256 _newExpiry) external onlyAdmin {
        adminServerSigExpiry = _newExpiry;
    }

    function setBond(uint256 _newBond) external onlyAdmin {
        bond = _newBond;
    }

    function setMinimumNodeFee(uint256 _newMinimumNodeFee) external onlyAdmin {
        minimumNodeFee = _newMinimumNodeFee;
    }
}
