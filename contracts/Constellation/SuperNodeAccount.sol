// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import './OperatorDistributor.sol';

import './Whitelist.sol';
import './Utils/UpgradeableBase.sol';

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
import '../Interfaces/IConstellationOracle.sol';
import '../Interfaces/IWETH.sol';

import './WETHVault.sol';
import './RPLVault.sol';

import './Utils/Constants.sol';
import './Utils/Errors.sol';

import 'hardhat/console.sol';

/**
 * @title SuperNodeAccount
 * @author Theodore Clapp, Mike Leach
 * @dev Abstracts all created minipools under a single node
 */
contract SuperNodeAccount is UpgradeableBase, Errors {
    event MinipoolCreated(address indexed minipoolAddress, address indexed operatorAddress);
    event MinipoolDestroyed(address indexed minipoolAddress, address indexed operatorAddress);
    
    // Mapping of minipool address to the amount of ETH locked
    mapping(address => uint256) public lockedEth;

    // Total amount of ETH locked in for all minipools
    uint256 public totalEthLocked;

    // Lock threshold amount in wei
    uint256 public lockThreshold;

    // Variables for admin server message checks (if enabled for minipool creation)
    bool public adminServerCheck;
    mapping(address => uint256) public nonces;
    uint256 public nonce;

    bool lazyInit;

    // List of all minipools
    address[] public minipools;

    // FOR OFFCHAIN USE ONLY - DO NOT USE IN CONTRACTS
    mapping(address => address[]) public __subNodeOperatorMinipools__;

    struct Minipool {
        address subNodeOperator;
        uint256 ethTreasuryFee;
        uint256 noFee;
        uint256 index; // index in the minipool list
    }

    struct CreateMinipoolConfig {
        bytes validatorPubkey;
        bytes validatorSignature;
        bytes32 depositDataRoot;
        uint256 salt;
        address expectedMinipoolAddress;
        bytes sig;
    }

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
        address od = directory.getOperatorDistributorAddress();
        IRocketStorage(directory.getRocketStorageAddress()).setWithdrawalAddress(address(this), od, true);
        lazyInit = true;
        
        lockThreshold = IRocketDAOProtocolSettingsMinipool(getDirectory().getRocketDAOProtocolSettingsMinipool()).getPreLaunchValue();
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).setSmoothingPoolRegistrationState(true);
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

            address recoveredAddress = ECDSA.recover(
                ECDSA.toEthSignedMessageHash(
                    keccak256(
                        abi.encodePacked(
                            _config.expectedMinipoolAddress,
                            salt,
                            address(this),
                            nonces[subNodeOperator]++,
                            nonce,
                            block.chainid
                        )
                    )
                ),
                _config.sig
            );
            require(
                _directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress),
                'bad signer role, params, or encoding'
            );
        }

        lockedEth[_config.expectedMinipoolAddress] = msg.value;
        totalEthLocked += msg.value;

        minipools.push(_config.expectedMinipoolAddress);

        WETHVault wethVault = WETHVault(getDirectory().getWETHVaultAddress());
        minipoolData[_config.expectedMinipoolAddress] = Minipool(
            subNodeOperator,
            wethVault.treasuryFee(),
            wethVault.nodeOperatorFee(),
            minipools.length-1
        );

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        // register minipool with node operator
        Whitelist(getDirectory().getWhitelistAddress()).registerNewValidator(subNodeOperator);

        // stake additional RPL to cover the new minipool
        od.rebalanceRplStake(this.getEthStaked() + bond);

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

        __subNodeOperatorMinipools__[subNodeOperator].push(_config.expectedMinipoolAddress);

        emit MinipoolCreated(_config.expectedMinipoolAddress, subNodeOperator);
    }

    /**
     * @notice Stops tracking a specified minipool by removing it from the active list.
     * @dev Removes a minipool from the active tracking array and updates mappings to reflect this change.
     *      This is used when a minipool is destroyed or decommissioned.
     * @param minipool The address of the minipool to be removed from tracking.
     */
    function removeMinipool(address minipool) external onlyProtocol() onlyRecognizedMinipool(address(minipool)) {
        uint256 index = minipoolData[minipool].index;
        address operatorAddress = minipoolData[minipool].subNodeOperator;
        uint256 lastIndex = minipools.length - 1;
        address lastMinipool = minipools[lastIndex];
        minipools[index] = lastMinipool;
        minipoolData[lastMinipool].index = index;
        minipools.pop();
        delete minipoolData[minipool];

        emit MinipoolDestroyed(minipool, operatorAddress);
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
     * @dev This is one of the two ways that minipools can be removed from the system (the other being exits or scrubs, which are handled
     * by processMinipool). Calling this is necessary to ensure that the associated minipool records are updated and ETH is pulled back
     * into the system.
     * In future versions, it may be brought into minipool processing to automate the process, but there are a lot of base layer
     * implications to consider before closing, and it would increase gas for the tick.
     * @param subNodeOperatorAddress Address of the sub-node operator associated with the minipool.
     * @param minipoolAddress Address of the minipool to close.
     */
    function closeDissolvedMinipool(address subNodeOperatorAddress, address minipoolAddress) external onlyRecognizedMinipool(minipoolAddress) {
        require(minipoolData[minipoolAddress].subNodeOperator == subNodeOperatorAddress, "operator does not own the specified minipool");
        IMinipool minipool = IMinipool(minipoolAddress);
        Whitelist(getDirectory().getWhitelistAddress()).removeValidator(minipoolData[minipoolAddress].subNodeOperator);
        this.removeMinipool(minipoolAddress);
        minipool.close();
    }   

    /**
     * @notice Allows dmins to delegate an upgrade to the minipool's contract.
     * @dev This function provides a mechanism for delegated upgrades of minipools, enhancing flexibility in maintenance and upgrades.
     * @param _minipool Address of the minipool which is to be upgraded.
     */
    function minipoolDelegateUpgrade(address _minipool) external onlyAdminOrAllowedSNO(_minipool) onlyRecognizedMinipool(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateUpgrade();
    }

    /**
     * @notice Allows sub-node operators or admins to rollback a delegated upgrade.
     * @dev Provides a rollback mechanism for previously delegated upgrades, ensuring that upgrades can be reversed if necessary.
     * @param _minipool Address of the minipool whose upgrade is to be rolled back.
     */
    function minipoolDelegateRollback(address _minipool) external onlyAdminOrAllowedSNO(_minipool) onlyRecognizedMinipool(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateRollback();
    }

    /**
     * @notice Sets the delegation setting for a minipool to either use the latest delegate or not.
     * @dev Allows node operators or admins to configure whether a minipool should follow the latest delegate or not.
     * @param _setting Boolean indicating whether to use the latest delegate.
     * @param _minipool Address of the minipool whose delegation setting is to be configured.
     */
    function setUseLatestMinipoolDelegate(
        bool _setting,
        address _minipool
    ) external onlyAdminOrAllowedSNO(_minipool) onlyRecognizedMinipool(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.setUseLatestDelegate(_setting);
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

    /**
     * @return uint256 The amount of ETH bonded with this node from WETHVault deposits.
     */
    function getEthStaked() public view returns (uint256) {
        return IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).getNodeETHProvided(address(this));
    }

    /**
     * @return uint256 The amount of ETH matched with this node from the rETH deposit pool
     */
    function getEthMatched() public view returns (uint256) {
        return IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).getNodeETHMatched(address(this));
    }

    /**
     * @return uint256 The amount of RPL staked on this node
     */
    function getRplStaked() public view returns (uint256) {
        return IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).getNodeRPLStake(address(this));
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
        uint256 rplRequired = OperatorDistributor(od).calculateRplStakeShortfall(
            rplStaking,
            this.getEthMatched() + newEthBorrowed
        );
        return IERC20(_directory.getRPLAddress()).balanceOf(od) >= rplRequired && od.balance >= _bond;
    }

    // Must receive ETH from OD for staking during the createMinipool process (pre-staking minipools)
    receive() external payable onlyProtocol {}

    function getNumMinipools() external view returns (uint256) {
        return minipools.length;
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

    function invalidateAllOutstandingSigs() external onlyAdmin {
        nonce++;
    }

    function invalidateSingleOustandingSig(address _nodeOperator) external onlyAdmin {
        nonces[_nodeOperator]++;
    }

    // FOR OFFCHAIN USE ONLY - DO NOT USE IN CONTRACTS
    /// @notice Get the complete minipool count for a sub-node operator, including removed minipools
    /// @param _subNodeOperator The address of the sub-node operator
    function getMinipoolCount(address _subNodeOperator) external view returns (uint256) {
        return __subNodeOperatorMinipools__[_subNodeOperator].length;
    }

    // FOR OFFCHAIN USE ONLY - DO NOT USE IN CONTRACTS
    /// @notice Get the complete minipool list for a sub-node operator, including removed minipools
    /// @param _subNodeOperator The address of the sub-node operator
    function getMinipools(address _subNodeOperator) external view returns (address[] memory) {
        return __subNodeOperatorMinipools__[_subNodeOperator];
    }
}
