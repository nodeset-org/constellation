// SPDX-License-Identifier: GPL v3

/**
 *    /***        /***          /******                                  /**               /** /**             /**     /**
 *   /**_/       |_  **        /**__  **                                | **              | **| **            | **    |__/
 *  | **   /** /** | **       | **  \__/  /******  /*******   /******* /******    /****** | **| **  /******  /******   /**  /******  /*******
 *  /***  |__/|__/ | ***      | **       /**__  **| **__  ** /**_____/|_  **_/   /**__  **| **| ** |____  **|_  **_/  | ** /**__  **| **__  **
 * |  **           | **       | **      | **  \ **| **  \ **|  ******   | **    | ********| **| **  /*******  | **    | **| **  \ **| **  \ **
 *  \ **   /** /** | **       | **    **| **  | **| **  | ** \____  **  | ** /* | **_____/| **| ** /**__  **  | ** /* | **| **  | **| **  | **
 *  |  ***|__/|__/***         |  ******||  ****** | **  | ** /*******   | ****  |  *******| **| **| ********  | ****  | **|  ****** | **  | **
 *   \___/       |___/         \______/  \______/ |__/  |__/|_______/    \___/   \_______/|__/|__/ \_______/   \___/  |__/ \______/ |__/  |__/
 *
 *  A liquid staking protocol extending Rocket Pool.
 *  Made w/ <3 by {::}
 *
 *  For more information, visit https://nodeset.io
 *
 *  @author Mike Leach (Wander), Nick Steinhilber (NickS), Theodore Clapp (mryamz), Joe Clapis (jcrtp), Huy Nguyen, Andy Rose (Barbalute)
 *  @custom:security-info https://docs.nodeset.io/nodeset/security-notice
 **/

pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import './OperatorDistributor.sol';

import './Whitelist.sol';
import './Utils/UpgradeableBase.sol';

import '../Interfaces/RocketPool/IRocketNodeDeposit.sol';
import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/RocketPool/IRocketNodeManager.sol';
import '../Interfaces/RocketPool/IRocketMinipoolManager.sol';

import '../Interfaces/RocketPool/IRocketMerkleDistributorMainnet.sol';
import '../Interfaces/RocketPool/IRocketDAOProtocolSettingsMinipool.sol';
import '../Interfaces/RocketPool/IRocketStorage.sol';
import '../Interfaces/RocketPool/IMinipool.sol';

import '../Interfaces/IWETH.sol';

import './WETHVault.sol';

import './Utils/Constants.sol';

/**
 * @title SuperNodeAccount
 * @author Theodore Clapp, Mike Leach
 * @dev Abstracts all created minipools under a single node
 */
contract SuperNodeAccount is UpgradeableBase {
    event MinipoolCreated(address indexed minipoolAddress, address indexed operatorAddress);
    event MinipoolStaked(address indexed minipoolAddress, address indexed operatorAddress);
    event MinipoolDestroyed(address indexed minipoolAddress, address indexed operatorAddress);

    // parameters
    event MaxValidatorsChanged(uint256 indexed oldValue, uint256 indexed newValue);
    event BondChanged(uint256 indexed oldValue, uint256 indexed newValue);
    event MinimumNodeFeeChanged(uint256 indexed oldValue, uint256 indexed newValue);
    event AllowSubNodeOperatorDelegateChangesChanged(bool indexed oldValue, bool indexed newValue);
    event LockThresholdChanged(uint256 indexed oldLockThreshold, uint256 indexed newLockThreshold);
    event AdminServerCheckChanged(bool indexed oldValue, bool indexed newValue);

    // Mapping of minipool address to the amount of ETH locked
    mapping(address => uint256) public lockedEth;

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
        require(minipoolData[_minipool].subNodeOperator == msg.sender, 'Can only be called by SubNodeOperator!');
        _;
    }

    /// @notice Modifier to ensure a function can only be called by a sub-node operator or admin of a specific minipool
    modifier onlyAdminOrAllowedSNO(address _minipool) {
        if (allowSubOpDelegateChanges) {
            require(
                _directory.hasRole(Constants.ADMIN_ROLE, msg.sender) ||
                    minipoolData[_minipool].subNodeOperator == msg.sender,
                'Can only be called by admin or sub node operator'
            );
        } else {
            require(
                _directory.hasRole(Constants.ADMIN_ROLE, msg.sender),
                'Minipool delegate changes only allowed by admin'
            );
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
        IRocketNodeManager rnm = IRocketNodeManager(_directory.getRocketNodeManagerAddress());
        rnm.registerNode('Australia/Brisbane');
        address od = directory.getOperatorDistributorAddress();
        IRocketStorage(directory.getRocketStorageAddress()).setWithdrawalAddress(address(this), od, true);
        lockThreshold = IRocketDAOProtocolSettingsMinipool(getDirectory().getRocketDAOProtocolSettingsMinipool())
            .getPreLaunchValue();
        rnm.setSmoothingPoolRegistrationState(true);

        lazyInit = true;
    }

    /**
     * @notice This function is responsible for the creation and initialization of a minipool based on the validator's configuration.
     *         It requires that the calling node operator is whitelisted and that the signature provided for the minipool creation is valid (if signature checks are enabled).
     *         It also checks for sufficient liquidity (both RPL and ETH) before proceeding with the creation.
     *         See the `CreateMinipoolConfig` struct for the parameters required for minipool creation.
     * @dev The function involves multiple steps:
     *      1. Validates that the transaction contains the exact amount of ETH specified in the `lockThreshold` (to prevent deposit contract front-running).
     *      2. Checks if there is sufficient liquidity available for the required bond amount in both RPL and ETH.
     *      3. Validates that the sender (sub-node operator) is whitelisted.
     *      4. Ensures the signature provided has not been used before and marks it as used.
     *      5. If admin server message checks are enabled, it verifies that the signature recovers to an address with the admin server role.
     *      6. Ensures that the expected minipool address from the configuration has not been initialized before.
     *      7. Locks the sent ETH, updates the total locked ETH count, and sets the timestamp when the lock started.
     *      8. Adds the minipool to the tracking arrays and mappings.
     *      9. Calls the `OperatorDistributor` to handle liquidity provisioning and event logging for the minipool creation.
     *      10. Finally, it delegates the deposit to the `RocketNodeDeposit` contract with all the required parameters from the configuration.
     */
    function createMinipool(CreateMinipoolConfig calldata _config) public payable {
        // this is the most common reason why minipools can't be created, so it should be checked first in this gas-sensitive function
        require(hasSufficientLiquidity(bond), 'NodeAccount: protocol must have enough rpl and eth');
        address subNodeOperator = msg.sender;
        require(
            Whitelist(_directory.getWhitelistAddress()).getIsAddressInWhitelist(subNodeOperator),
            'sub node operator must be whitelisted'
        );
        require(
            Whitelist(_directory.getWhitelistAddress()).getActiveValidatorCountForOperator(subNodeOperator) <
                maxValidators,
            'Sub node operator has created too many minipools already'
        );
        require(msg.value == lockThreshold, 'SuperNode: must set the message value to lockThreshold');
        require(
            IRocketMinipoolManager(_directory.getRocketMinipoolManagerAddress()).getMinipoolExists(
                _config.expectedMinipoolAddress
            ) == false,
            'minipool already initialized'
        );

        uint256 salt = uint256(keccak256(abi.encodePacked(_config.salt, subNodeOperator)));
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

        // move the necessary ETH to this contract for use
        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());
        od.sendEthForMinipool();

        lockedEth[_config.expectedMinipoolAddress] = msg.value;

        minipools.push(_config.expectedMinipoolAddress);

        WETHVault wethVault = WETHVault(getDirectory().getWETHVaultAddress());
        minipoolData[_config.expectedMinipoolAddress] = Minipool(
            subNodeOperator,
            wethVault.treasuryFee(),
            wethVault.nodeOperatorFee(),
            minipools.length - 1
        );

        // register minipool with node operator
        Whitelist(getDirectory().getWhitelistAddress()).registerNewValidator(subNodeOperator);

        // stake additional RPL to cover the new minipool
        od.rebalanceRplStake(getEthStaked() + bond);

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

        od.rebalanceWethVault();
        od.rebalanceRplVault();

        emit MinipoolCreated(_config.expectedMinipoolAddress, subNodeOperator);
    }

    /**
     * @notice Stops tracking a specified minipool by removing it from the active list.
     * @dev Removes a minipool from the active tracking array and updates mappings to reflect this change.
     *      This is used when a minipool is destroyed or decommissioned.
     * @param minipool The address of the minipool to be removed from tracking.
     */
    function removeMinipool(address minipool) external onlyProtocol onlyRecognizedMinipool(address(minipool)) {
        uint256 index = minipoolData[minipool].index;
        // in case a minipool was dissolved or scrubbed, unlock the ETH and move it to the OD for later use
        if (lockedEth[minipool] > 0) {
            uint256 lockupBalance = lockedEth[minipool];
            lockedEth[minipool] = 0;
            (bool success, ) = getDirectory().getOperatorDistributorAddress().call{value: lockupBalance}('');
            require(success, 'ETH transfer failed');
        }
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
        if (lockedEth[_minipool] > 0) {
            uint256 lockupBalance = lockedEth[_minipool];
            lockedEth[_minipool] = 0;
            (bool success, ) = msg.sender.call{value: lockupBalance}('');
            require(success, 'ETH transfer failed');
        }

        emit MinipoolStaked(_minipool, msg.sender);
    }

    /**
     * @notice Closes a dissolved minipool and updates the tracking and financial records accordingly.
     * @dev This is one of the two ways that minipools can be removed from the system (the other being exits or scrubs, which are handled
     * by processMinipool). Calling this is necessary to ensure that the associated minipool records are updated and ETH is pulled back
     * into the system.
     * In future versions, it may be brought into minipool processing to automate the process, but there are a lot of base layer
     * implications to consider before closing, and it would increase gas for the tick.
     * @param minipoolAddress Address of the minipool to close.
     */
    function closeDissolvedMinipool(address minipoolAddress) external onlyRecognizedMinipool(minipoolAddress) {
        IMinipool minipool = IMinipool(minipoolAddress);
        Whitelist(getDirectory().getWhitelistAddress()).removeValidator(minipoolData[minipoolAddress].subNodeOperator);
        this.removeMinipool(minipoolAddress);
        minipool.close();
    }

    /**
     * @notice Allows admins to delegate an upgrade to the minipool's contract.
     * @dev This function provides a mechanism for delegated upgrades of minipools, enhancing flexibility in maintenance and upgrades.
     * @param _minipool Address of the minipool which is to be upgraded.
     */
    function minipoolDelegateUpgrade(
        address _minipool
    ) external onlyAdminOrAllowedSNO(_minipool) onlyRecognizedMinipool(_minipool) {
        IMinipool minipool = IMinipool(_minipool);
        minipool.delegateUpgrade();
    }

    /**
     * @notice Allows sub-node operators or admins to rollback a delegated upgrade.
     * @dev Provides a rollback mechanism for previously delegated upgrades, ensuring that upgrades can be reversed if necessary.
     * @param _minipool Address of the minipool whose upgrade is to be rolled back.
     */
    function minipoolDelegateRollback(
        address _minipool
    ) external onlyAdminOrAllowedSNO(_minipool) onlyRecognizedMinipool(_minipool) {
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
        IRocketNodeManager(_directory.getRocketNodeManagerAddress()).setSmoothingPoolRegistrationState(
            _useSmoothingPool
        );
    }

    /**
     * @notice Enables or disables the ability for sub node operators to change minipool delegates
     * @dev Admin-only
     */
    function setAllowSubNodeOpDelegateChanges(bool newValue) external onlyAdmin {
        require(
            newValue != allowSubOpDelegateChanges,
            'SuperNodeAccount: new allowSubOpDelegateChanges value must be different'
        );
        emit AllowSubNodeOperatorDelegateChangesChanged(allowSubOpDelegateChanges, newValue);
        allowSubOpDelegateChanges = newValue;
    }

    /**
     * @notice Enables or disables the server-admin approved sigs for creating minipools
     * @dev This function can only be called by an admin
     */
    function setAdminServerCheck(bool newValue) external onlyAdmin {
        require(newValue != adminServerCheck, 'SuperNodeAccount: new adminServerCheck value must be different');
        emit AdminServerCheckChanged(adminServerCheck, newValue);
        adminServerCheck = newValue;
    }

    /**
     * @notice Sets a new lock threshold.
     * @param _newLockThreshold The new lock threshold value in wei.
     */
    function setLockAmount(uint256 _newLockThreshold) external onlyShortTimelock {
        require(_newLockThreshold != lockThreshold, 'SuperNodeAccount: new lock threshold value must be different');
        emit LockThresholdChanged(lockThreshold, _newLockThreshold);
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
        // check ETH
        address payable od = _directory.getOperatorDistributorAddress();
        bool hasEnoughEth = od.balance >= _bond;
        if(hasEnoughEth == false) return false;

        // check RPL
        IRocketNodeStaking rocketNodeStaking = IRocketNodeStaking(_directory.getRocketNodeStakingAddress());
        uint256 rplStaking = rocketNodeStaking.getNodeRPLStake(address(this));
        uint256 newEthBorrowed = IRocketDAOProtocolSettingsMinipool(_directory.getRocketDAOProtocolSettingsMinipool())
            .getLaunchBalance() - _bond;
        uint256 rplRequired = OperatorDistributor(od).calculateRplStakeShortfall(
            rplStaking,
            getEthMatched() + newEthBorrowed
        );
        return IERC20(_directory.getRPLAddress()).balanceOf(od) >= rplRequired;
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
        require(_newBond != bond, 'SuperNodeAccount: new bond value must be different');
        emit BondChanged(bond, _newBond);
        bond = _newBond;
    }

    /**
     * @notice Sets the minimum node fee used for new minipools.
     * @param _newMinimumNodeFee The new minimum node fee.
     */
    function setMinimumNodeFee(uint256 _newMinimumNodeFee) external onlyAdmin {
        require(_newMinimumNodeFee != minimumNodeFee, 'SuperNodeAccount: new minimumNodeFee value must be different');
        emit MinimumNodeFeeChanged(minimumNodeFee, _newMinimumNodeFee);
        minimumNodeFee = _newMinimumNodeFee;
    }

    /**
     * @notice Sets the maximum numbder of allowed validators for each operator.
     * @param _maxValidators The maximum number of validators to be considered in the reward calculation.
     * @dev This function can only be called by the protocol admin.
     * Adjusting this parameter will change the reward distribution dynamics for validators.
     */
    function setMaxValidators(uint256 _maxValidators) public onlyAdmin {
        require(_maxValidators != maxValidators, 'SuperNodeAccount: new maxValidators value must be different');
        emit MaxValidatorsChanged(maxValidators, _maxValidators);
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
