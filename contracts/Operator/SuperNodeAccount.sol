// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import './OperatorDistributor.sol';

import '../Whitelist/Whitelist.sol';
import '../UpgradeableBase.sol';
import '../AssetRouter.sol';

import '../Interfaces/RocketPool/RocketTypes.sol';
import '../Interfaces/RocketPool/IRocketNodeDeposit.sol';
import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/RocketPool/IRocketNodeManager.sol';
import '../Interfaces/RocketPool/IRocketMinipoolManager.sol';
import '../Interfaces/RocketPool/IRocketNetworkVoting.sol';
import '../Interfaces/RocketPool/IRocketDAOProtocolProposal.sol';
import '../Interfaces/RocketPool/IRocketMerkleDistributorMainnet.sol';
import '../Interfaces/RocketPool/IRocketDAOProtocolSettingsMinipool.sol';
import '../Interfaces/RocketPool/IRocketStorage.sol';
import '../Interfaces/RocketPool/IMinipool.sol';
import '../Interfaces/Oracles/IBeaconOracle.sol';
import '../Interfaces/IWETH.sol';

import '../Tokens/WETHVault.sol';

import '../Utils/ProtocolMath.sol';
import '../Utils/Constants.sol';
import '../Utils/Errors.sol';

import 'hardhat/console.sol';

struct MerkleRewardsConfig {
    bytes sig;
    uint256 sigGenesisTime;
    uint256 avgEthTreasuryFee;
    uint256 avgEthOperatorFee;
    uint256 avgRplTreasuryFee;
}

/**
 * @title SuperNodeAccount
 * @author Theodore Clapp, Mike Leach
 * @dev Abstracts all created minipools under a single node
 */
contract SuperNodeAccount is UpgradeableBase, Errors {
    // Mapping of minipool address to the amount of ETH locked
    mapping(address => uint256) public lockedEth;

    // Total amount of ETH locked in for all minipools
    uint256 public totalEthLocked;

    // Lock threshold amount in wei
    uint256 public lockThreshold;

    // Variables for admin server message checks (if enabled for minipool creation)
    bool public adminServerCheck;
    mapping(bytes => bool) public sigsUsed;
    uint256 public adminServerSigExpiry;

    // Merkle claim signature data
    uint256 public merkleClaimNonce;
    mapping(bytes32 => bool) public merkleClaimSigUsed;
    uint256 public merkleClaimSigExpiry;

    bool lazyInit;

    // List of all minipools
    address[] public minipools;

    struct Minipool {
        address subNodeOperator;
        uint256 ethTreasuryFee;
        uint256 noFee;
        uint256 rplTreasuryFee;
    }

    struct CreateMinipoolConfig {
        bytes validatorPubkey;
        bytes validatorSignature;
        bytes32 depositDataRoot;
        uint256 salt;
        address expectedMinipoolAddress;
        uint256 sigGenesisTime;
        bytes sig;
    }

    // Mapping of minipool address to its index in the minipools array
    mapping(address => uint256) public minipoolIndex;
    // Mapping of sub-node operator address to their list of minipools
    mapping(address => address[]) public subNodeOperatorMinipools;
    // Mapping of address to minipool structs
    mapping(address => Minipool) public minipoolData;

    // admin settings
    /// @notice Bond amount for newly created minipools
    /// @dev ONLY use this for creating minipools. Do not use this for calculating rewards! 
    uint256 public bond;
    uint256 public minimumNodeFee;
    uint256 public maxValidators; // max number of validators each NO is allowed
    bool public allowSubOpDelegateChanges;

    /// @notice Modifier to ensure a function can only be called once for lazy initialization
    modifier lazyInitializer() {
        require(!lazyInit, 'already lazily initialized');
        _;
    }

    /// @notice Modifier to ensure a function can only be called by a sub-node operator of a specific minipool
    modifier onlySubNodeOperator(address _minipool) {
        require(
            minipoolData[_minipool].subNodeOperator == msg.sender,
            'Can only be called by SubNodeOperator!'
        );
        _;
    }

    /// @notice Modifier to ensure a function can only be called by a sub-node operator or admin of a specific minipool
    modifier onlyAdminOrAllowedSNO(address _minipool) {
        if(allowSubOpDelegateChanges) { 
            require(
                _directory.hasRole(Constants.ADMIN_ROLE, msg.sender) || 
                    minipoolData[_minipool].subNodeOperator == msg.sender,
                'Can only be called by admin or sub node operator'
            );
        } else {
            require(_directory.hasRole(Constants.ADMIN_ROLE, msg.sender), 'Minipool delegate changes only allowed by admin');
        }
        _;
    }

    /// @notice Modifier to ensure a function can only be called if the minipool has been configured
    modifier onlyRecognizedMinipool(address _minipool) {
        require(getIsMinipoolRecognized(_minipool), 'minipool not recognized');
        _;
    }

    function getIsMinipoolRecognized(address minipool) public view returns (bool) {
        return minipoolData[minipool].subNodeOperator != address(0);
    }

    /**
     * @notice Initializes the contract with the provided directory address.
     * @dev This function should only be called once, during contract creation or proxy initialization.
     * @param _directory The address of the directory contract.
     */
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);
        
        adminServerCheck = true;
        adminServerSigExpiry = 1 days;
        minimumNodeFee = 14e16;
        bond = 8 ether;
        maxValidators = 1;
        allowSubOpDelegateChanges = false;
    }

    /**
     * @notice Performs lazy initialization of the contract.
     */
    function lazyInitialize() external lazyInitializer {
        Directory directory = Directory(_directory);
        _registerNode('Australia/Brisbane');
        address ar = directory.getAssetRouterAddress();
        IRocketStorage(directory.getRocketStorageAddress()).setWithdrawalAddress(address(this), ar, true);
        lazyInit = true;
        merkleClaimSigExpiry = 1 days;
        lockThreshold = IRocketDAOProtocolSettingsMinipool(getDirectory().getRocketDAOProtocolSettingsMinipool()).getPreLaunchValue();
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).setSmoothingPoolRegistrationState(true);
    }

    /**
     * @notice Returns the total number of Constellation minipools.
     * @return uint256 The total number of Constellation minipools.
     */
    function minipoolCount() external view returns (uint256) {
        return minipools.length;
    }

    /**
     * @notice This function is responsible for the creation and initialization of a minipool based on the validator's configuration.
     *         It requires that the calling node operator is whitelisted and that the signature provided for the minipool creation is valid (if signature checks are enabled).
     *         It also checks for sufficient liquidity (both RPL and ETH) before proceeding with the creation.
     * @dev The function involves multiple steps:
     *      1. Validates that the transaction contains the exact amount of ETH specified in the `lockThreshold` (to prevent depoist contract front-running).
     *      2. Checks if there is sufficient liquidity available for the required bond amount in both RPL and ETH.
     *      3. Validates that the sender (sub-node operator) is whitelisted.
     *      4. Ensures the signature provided has not been used before and marks it as used.
     *      5. If admin server message checks are enabled, it verifies that the signature recovers to an address with the admin server role.
     *      6. Ensures that the expected minipool address from the configuration has not been initialized before.
     *      7. Locks the sent ETH, updates the total locked ETH count, and sets the timestamp when the lock started.
     *      8. Adds the minipool to the tracking arrays and mappings.
     *      9. Calls the `OperatorDistributor` to handle liquidity provisioning and event logging for the minipool creation.
     *      10. Finally, it delegates the deposit to the `RocketNodeDeposit` contract with all the required parameters from the configuration.
     *
     *      It's crucial that this function is called with correct and validated parameters to ensure the integrity of the node and minipool registration process.
     *
     * @notice _config A `ValidatorConfig` struct containing:
     *        - bondAmount: The amount of ETH to be bonded.
     *        - minimumNodeFee: Minimum fee for the node operations.
     *        - validatorPubkey: Public key of the validator.
     *        - validatorSignature: Signature from the validator for verification.
     *        - depositDataRoot: Root hash of the deposit data.
     *        - salt: Random nonce used for generating the expected minipool address.
     *        - expectedMinipoolAddress: Precomputed address expected to be generated for the new minipool.
     *        - sig The signature provided for minipool creation; used for admin verification if admin server checks are enabled, ignored otherwise.
     */
    function createMinipool(CreateMinipoolConfig calldata _config) public payable {
        require(msg.value == lockThreshold, 'SuperNode: must set the message value to lockThreshold');
        require(
            IRocketMinipoolManager(_directory.getRocketMinipoolManagerAddress()).getMinipoolExists(
                _config.expectedMinipoolAddress
            ) == false,
            'minipool already initialized'
        );
        address subNodeOperator = msg.sender;
        require(
            Whitelist(_directory.getWhitelistAddress()).getIsAddressInWhitelist(subNodeOperator),
            'sub node operator must be whitelisted'
        );
        require(
            Whitelist(_directory.getWhitelistAddress()).getActiveValidatorCountForOperator(subNodeOperator) < maxValidators,
            'Sub node operator has created too many minipools already'
        );
        require(hasSufficientLiquidity(bond), 'NodeAccount: protocol must have enough rpl and eth');

        uint256 salt = uint256(keccak256(abi.encodePacked(_config.salt, subNodeOperator)));
        // move the necessary ETH to this contract for use 
        OperatorDistributor(_directory.getOperatorDistributorAddress()).provisionLiquiditiesForMinipoolCreation(bond);
        
        // verify admin server signature if required
        if (adminServerCheck) {
            require(block.timestamp - _config.sigGenesisTime < adminServerSigExpiry, 'as sig expired');
            
            _validateSigUsed(_config.sig);
            console.log('_createMinipool: message hash');
            console.logBytes32(
                keccak256(abi.encodePacked(_config.expectedMinipoolAddress, salt, address(this), block.chainid))
            );
            address recoveredAddress = ECDSA.recover(
                ECDSA.toEthSignedMessageHash(
                    keccak256(
                        abi.encodePacked(
                            _config.expectedMinipoolAddress,
                            salt,
                            _config.sigGenesisTime,
                            address(this),
                            block.chainid
                        )
                    )
                ),
                _config.sig
            );
            require(
                _directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress),
                'signer must have permission from admin server role'
            );
        }

        lockedEth[_config.expectedMinipoolAddress] = msg.value;
        totalEthLocked += msg.value;

        minipoolIndex[_config.expectedMinipoolAddress] = minipools.length;
        minipools.push(_config.expectedMinipoolAddress);

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        od.onMinipoolCreated(_config.expectedMinipoolAddress, subNodeOperator);
        
        subNodeOperatorMinipools[subNodeOperator].push(_config.expectedMinipoolAddress);
        WETHVault wethVault = WETHVault(getDirectory().getWETHVaultAddress());
        minipoolData[_config.expectedMinipoolAddress] = Minipool(
            subNodeOperator,
            wethVault.treasuryFee(),
            wethVault.nodeOperatorFee(),
            RPLVault(getDirectory().getRPLVaultAddress()).treasuryFee()
        );

        // stake additional RPL to cover the new minipool
        od.rebalanceRplStake(getTotalEthStaked() + bond);

        // do the deposit!
        IRocketNodeDeposit(_directory.getRocketNodeDepositAddress()).deposit{value: bond}(
            bond,
            minimumNodeFee,
            _config.validatorPubkey,
            _config.validatorSignature,
            _config.depositDataRoot,
            salt,
            _config.expectedMinipoolAddress
        );
    }

    /**
     * @notice Stops tracking a specified minipool by removing it from the active list.
     * @dev Removes a minipool from the active tracking array and updates mappings to reflect this change.
     *      This is used when a minipool is destroyed or decommissioned.
     * @param minipool The address of the minipool to be removed from tracking.
     */
    function onMinipoolRemoved(address minipool) external onlyProtocol() onlyRecognizedMinipool(address(minipool)) {
        uint256 index = minipoolIndex[minipool];
        uint256 lastIndex = minipools.length - 1;
        address lastMinipool = minipools[lastIndex];

        minipools[index] = lastMinipool;
        minipoolIndex[lastMinipool] = index;

        minipools.pop();
        delete minipoolIndex[minipool];
        delete minipoolData[minipool];
    }

    /**
     * @notice Registers a new node with the specified timezone location.
     * @param _timezoneLocation The timezone location of the node.
     */
    function _registerNode(string memory _timezoneLocation) internal {
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).registerNode(_timezoneLocation);
    }

    /**
     * @notice Initiates the staking process for a specified minipool. Refunds the lock for the minipool when called.
     * @dev Calls the `stake` method on the minipool contract with necessary parameters.
     *      This function can only be called by the sub-node operator of the minipool and when the minipool is properly configured.
     * @param _minipool The address of the minipool to initiate staking.
     */
    function stake(
        bytes calldata _validatorSignature,
        bytes32 _depositDataRoot,
        address _minipool
    ) external onlySubNodeOperator(_minipool) onlyRecognizedMinipool(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.stake(_validatorSignature, _depositDataRoot);

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
     * @notice Closes a dissolved minipool and updates the tracking and financial records accordingly.
     * @dev This function handles the administrative closure of a minipool, ensuring that the associated
     *      records are updated.
     * @param _subNodeOperator Address of the sub-node operator associated with the minipool.
     * @param _minipool Address of the minipool to close.
     */
    function close(address _subNodeOperator, address _minipool) external onlyRecognizedMinipool(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        OperatorDistributor(_directory.getOperatorDistributorAddress()).onNodeMinipoolDestroy(_subNodeOperator);
        this.onMinipoolRemoved(_minipool);

        minipool.close();
    }


    /**
     * @notice Claims rewards for a node based on a Merkle proof, distributing specified amounts of RPL and ETH.
     * @dev This function interfaces with the RocketMerkleDistributorMainnet to allow nodes to claim their rewards.
     *      The rewards are determined by a Merkle proof which validates the amounts to be claimed.
     * @param _rewardIndex Array of indices in the Merkle tree corresponding to reward entries.
     * @param _amountRPL Array of amounts of RPL tokens to claim.
     * @param _amountETH Array of amounts of ETH to claim.
     * @param _merkleProof Array of Merkle proofs for each reward entry.
     */
    function merkleClaim(
        uint256[] calldata _rewardIndex,
        uint256[] calldata _amountRPL,
        uint256[] calldata _amountETH,
        bytes32[][] calldata _merkleProof,
        MerkleRewardsConfig calldata _config
    ) public {
        address ar = _directory.getAssetRouterAddress();
        IERC20 rpl = IERC20(_directory.getRPLAddress());

        uint256 initialEthBalance = ar.balance;
        uint256 initialRplBalance = rpl.balanceOf(ar);

        AssetRouter(payable(ar)).openGate();
        IRocketMerkleDistributorMainnet(_directory.getRocketMerkleDistributorMainnetAddress()).claim(
            address(this),
            _rewardIndex,
            _amountRPL,
            _amountETH,
            _merkleProof
        );
        AssetRouter(payable(ar)).closeGate();

        uint256 finalEthBalance = ar.balance;
        uint256 finalRplBalance = rpl.balanceOf(ar);

        uint256 ethReward = finalEthBalance - initialEthBalance;
        uint256 rplReward = finalRplBalance - initialRplBalance;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                _config.avgEthTreasuryFee,
                _config.avgEthOperatorFee,
                _config.avgRplTreasuryFee,
                _config.sigGenesisTime,
                address(this),
                merkleClaimNonce,
                block.chainid
            )
        );
        require(!merkleClaimSigUsed[messageHash], 'merkle sig already used');
        merkleClaimSigUsed[messageHash] = true;
        address recoveredAddress = ECDSA.recover(ECDSA.toEthSignedMessageHash(messageHash), _config.sig);
        require(
            _directory.hasRole(Constants.ADMIN_ORACLE_ROLE, recoveredAddress),
            'merkleClaim: signer must have permission from admin oracle role'
        );
        require(block.timestamp - _config.sigGenesisTime < merkleClaimSigExpiry, 'merkle sig expired');
        merkleClaimNonce++;

        AssetRouter(payable(ar)).onEthRewardsReceived(ethReward, _config.avgEthTreasuryFee, _config.avgEthOperatorFee, false);
        AssetRouter(payable(ar)).onRplRewardsRecieved(rplReward, _config.avgRplTreasuryFee);
    }

    /**
     * @notice Allows dmins to delegate an upgrade to the minipool's contract.
     * @dev This function provides a mechanism for delegated upgrades of minipools, enhancing flexibility in maintenance and upgrades.
     * @param _minipool Address of the minipool which is to be upgraded.
     */
    function delegateUpgrade(address _minipool) external onlyAdminOrAllowedSNO(_minipool) onlyRecognizedMinipool(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateUpgrade();
    }

    /**
     * @notice Allows sub-node operators or admins to rollback a delegated upgrade.
     * @dev Provides a rollback mechanism for previously delegated upgrades, ensuring that upgrades can be reversed if necessary.
     * @param _minipool Address of the minipool whose upgrade is to be rolled back.
     */
    function delegateRollback(address _minipool) external onlyAdminOrAllowedSNO(_minipool) onlyRecognizedMinipool(_minipool) {
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
    ) external onlyAdminOrAllowedSNO(_minipool) onlyRecognizedMinipool(_minipool) {
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
     * @notice Enables or disables the protocol's participation in the Rocket Pool smoothing pool
     * @dev Admin-only
     */
    function setSmoothingPoolParticipation(bool _useSmoothingPool) external onlyAdmin {
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).setSmoothingPoolRegistrationState(_useSmoothingPool);
    }

    /**
     * @notice Enables or disables the ability for sub node operators to change minipool delegates
     * @dev Admin-only
     */
    function setAllowSubNodeOpDelegateChanges(bool newValue) external onlyAdmin {
        allowSubOpDelegateChanges = newValue;
    }

    /**
     * @notice Enables or disables the server-admin approved sigs for creating minipools
     * @dev This function can only be called by an admin
     */
    function setAdminServerCheck(bool newValue) external onlyAdmin {
        adminServerCheck = newValue;
    }

    /**
     * @notice Sets a new lock threshold.
     * @param _newLockThreshold The new lock threshold value in wei.
     */
    function setLockAmount(uint256 _newLockThreshold) external onlyShortTimelock {
        lockThreshold = _newLockThreshold;
    }

    function getSubNodeOpFromMinipool(address minipoolAddress) public view returns (address) {
        return minipoolData[minipoolAddress].subNodeOperator;
    }

    /**
     * @return uint256 The amount of ETH bonded with this node from WETHVault deposits.
     */
    function getTotalEthStaked() public view returns (uint256) {
        return IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).getNodeETHProvided(address(this));
    }

    /**
     * @return uint256 The amount of ETH matched with this node from the rETH deposit pool
     */
    function getTotalEthMatched() public view returns (uint256) {
        return IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).getNodeETHMatched(address(this));
    }

    /**
     * @notice Checks if there is sufficient liquidity in the protocol to cover a specified bond amount.
     * @dev This function helps ensure that there are enough resources (both RPL and ETH) available 
     * in the system to cover the bonds required for creating or operating a minipool.
     * It is crucial for maintaining financial stability and operational continuity.
     * @param _bond The bond amount in wei for which liquidity needs to be checked.
     * @return bool Returns true if there is sufficient liquidity to cover the bond; false otherwise.
     */
    function hasSufficientLiquidity(uint256 _bond) public view returns (bool) {
        address payable od = _directory.getOperatorDistributorAddress();
        IRocketNodeStaking rocketNodeStaking = IRocketNodeStaking(_directory.getRocketNodeStakingAddress());
        uint256 rplStaking = rocketNodeStaking.getNodeRPLStake(address(this));
        uint256 newEthBorrowed = IRocketDAOProtocolSettingsMinipool(_directory.getRocketDAOProtocolSettingsMinipool()).getLaunchBalance() - _bond;
        console.log('newEthBorrowed', newEthBorrowed);
        uint256 rplRequired = OperatorDistributor(od).calculateRplStakeShortfall(
            rplStaking,
            getTotalEthMatched() + newEthBorrowed
        );
        return IERC20(_directory.getRPLAddress()).balanceOf(od) >= rplRequired && od.balance >= _bond;
    }

    // Must receive ETH from OD for staking during the createMinipool process (pre-staking minipools)
    receive() external payable onlyProtocol {}

    function getNumMinipools() external view returns (uint256) {
        return minipools.length;
    }

    /**
     * @notice Sets a new admin sig expiry time.
     * @param _newExpiry The new sig expiry time in seconds.
     */
    function setAdminServerSigExpiry(uint256 _newExpiry) external onlyAdmin {
        adminServerSigExpiry = _newExpiry;
    }

    /**
     * @notice Sets the bond amount used for new minipools.
     * @param _newBond The new bond amount in wei.
     */
    function setBond(uint256 _newBond) external onlyAdmin {
        bond = _newBond;
    }

    /**
     * @notice Sets the minimum node fee used for new minipools.
     * @param _newMinimumNodeFee The new minimum node fee.
     */
    function setMinimumNodeFee(uint256 _newMinimumNodeFee) external onlyAdmin {
        minimumNodeFee = _newMinimumNodeFee;
    }

    /**
     * @notice Sets the maximum numbder of allowed validators for each operator.
     * @param _maxValidators The maximum number of validators to be considered in the reward calculation.
     * @dev This function can only be called by the protocol admin.
     * Adjusting this parameter will change the reward distribution dynamics for validators.
     */
    function setMaxValidators(uint256 _maxValidators) public onlyMediumTimelock {
        maxValidators = _maxValidators;
    }
}
