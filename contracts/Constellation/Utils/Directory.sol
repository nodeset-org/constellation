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

import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

import '../../Interfaces/IConstellationOracle.sol';
import '../../Interfaces/RocketPool/IRocketStorage.sol';
import '../../Interfaces/ISanctions.sol';
import '../../Interfaces/RocketPool/IRocketNetworkPrices.sol';
import '../../Interfaces/RocketPool/IRocketNetworkPenalties.sol';

import './UpgradeableBase.sol';
import '../Utils/RocketPoolEncoder.sol';
import '../Utils/Constants.sol';

struct Protocol {
    address whitelist;
    address payable wethVault;
    address rplVault;
    address payable operatorDistributor;
    address payable merkleClaimStreamer;
    address oracle;
    address priceFetcher;
    address payable superNode;
    // external dependencies
    address rocketStorage;
    address payable weth;
    address sanctions;
}

struct Governance {
    address admin;
    address treasurer;
    address payable treasury;
    address timelockShort;
    address timelockMed;
    address timelockLong;
    address adminServer;
    address adminOracle;
}

/// @author Mike Leach, Theodore Clapp
/// @notice The Directory contract holds references to all protocol contracts and role mechanisms.
/// @dev The Directory contract is a central component of the protocol, managing contract addresses and access control roles.
///      It provides the ability to set contract addresses during initialization, manage treasury, and update the Oracle contract.
contract Directory is UUPSUpgradeable, AccessControlUpgradeable {
    // These events should never actually be emitted because the calling code should should revert if the result is true
    event SanctionViolation(address account, address eoa_origin);
    event SanctionViolationSingleOrigin(address eoa_origin);

    event SanctionsEnabledChanged(bool oldValue, bool newValue);
    event TreasuryAddressChanged(address oldAddress, address newAddress);
    event OperatorRewardAddressChanged(address oldAddress, address newAddress);
    event OracleAddressChanged(address oldAddress, address newAddress);
    event AllContractAddressesChanged(Protocol oldProtocol, Protocol newProtocol);

    Protocol private _protocol;
    address payable private _treasury;
    address payable private _operatorReward;
    bool private _enabledSanctions;

    constructor() {
        _disableInitializers();
    }

    /// @notice Retrieves the address of the current implementation of the contract.
    /// @return The address of the current implementation contract.
    /// @dev This function allows users to query the current implementation contract address.
    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    /// @notice Internal function to authorize contract upgrades.
    /// @dev This function is used internally to ensure that only administrators can authorize contract upgrades.
    ///      It checks whether the sender has the required ADMIN_ROLE before allowing the upgrade.
    function _authorizeUpgrade(address) internal view override {
        require(hasRole(Constants.ADMIN_ROLE, msg.sender), Constants.ADMIN_ONLY_ERROR);
    }

    //----
    // GETTERS
    //----

    function getSanctionsEnabled() public view returns (bool) {
        return _enabledSanctions;
    }

    function getWhitelistAddress() public view returns (address) {
        return _protocol.whitelist;
    }

    function getWETHVaultAddress() public view returns (address payable) {
        return _protocol.wethVault;
    }

    function getRPLVaultAddress() public view returns (address) {
        return _protocol.rplVault;
    }

    function getOracleAddress() public view returns (address) {
        return _protocol.oracle;
    }

    function getRocketStorageAddress() public view returns (address) {
        return _protocol.rocketStorage;
    }

    function getOperatorDistributorAddress() public view returns (address payable) {
        return _protocol.operatorDistributor;
    }

    function getMerkleClaimStreamerAddress() public view returns (address payable) {
        return _protocol.merkleClaimStreamer;
    }

    function getOperatorRewardAddress() public view returns (address payable) {
        return _operatorReward;
    }

    function getRocketNodeManagerAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketNodeManager')
            );
    }

    function getRocketNodeDepositAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketNodeDeposit')
            );
    }

    function getRocketNodeStakingAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketNodeStaking')
            );
    }

    function getRocketMinipoolManagerAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketMinipoolManager')
            );
    }

    function getPriceFetcherAddress() public view returns (address) {
        return _protocol.priceFetcher;
    }

    function getWETHAddress() public view returns (address payable) {
        return _protocol.weth;
    }

    function getSuperNodeAddress() public view returns (address payable) {
        return _protocol.superNode;
    }

    function getProtocol() public view returns (Protocol memory) {
        return _protocol;
    }

    function getRocketDAOProtocolSettingsRewardsAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketDAOProtocolSettingsRewards')
            );
    }

    function getRocketDAOProtocolSettingsMinipool() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketDAOProtocolSettingsMinipool')
            );
    }

    function getRPLAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketTokenRPL')
            );
    }

    function getTreasuryAddress() public view returns (address payable) {
        return _treasury;
    }

    function getSanctionsAddress() public view returns (address) {
        return _protocol.sanctions;
    }

    function getRocketNetworkPenalties() public view returns (IRocketNetworkPenalties) {
        return
            IRocketNetworkPenalties(
                IRocketStorage(_protocol.rocketStorage).getAddress(
                    RocketpoolEncoder.generateBytes32Identifier('rocketNetworkPenalties')
                )
            );
    }

    function getRocketDepositPoolAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketDepositPool')
            );
    }

    function getRocketNetworkPrices() public view returns (IRocketNetworkPrices) {
        return
            IRocketNetworkPrices(
                IRocketStorage(_protocol.rocketStorage).getAddress(
                    RocketpoolEncoder.generateBytes32Identifier('rocketNetworkPrices')
                )
            );
    }

    function getRocketDAOProtocolProposalAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketDAOProtocolProposal')
            );
    }

    function getRocketMerkleDistributorMainnetAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketMerkleDistributorMainnet')
            );
    }

    function getRocketNetworkVotingAddress() public view returns (address) {
        return
            IRocketStorage(_protocol.rocketStorage).getAddress(
                RocketpoolEncoder.generateBytes32Identifier('rocketNetworkVoting')
            );
    }

    function getRocketPoolAddressByTag(string calldata _tag) public view returns (address) {
        return IRocketStorage(_protocol.rocketStorage).getAddress(RocketpoolEncoder.generateBytes32Identifier(_tag));
    }

    /// @notice Initializes the Directory contract with the given protocol addresses, treasury, treasurer, and admin.
    /// @param newProtocol A Protocol struct containing updated addresses of protocol contracts.
    /// @param operatorReward The address of the operator rewards contract.
    /// @param governance A Governance struct containing the addresses of the treasury contract, treasurer role, and admin roles.
    /// @dev This function sets up the initial protocol contract addresses and grants roles to the admin and treasurer.
    function initialize(
        Protocol memory newProtocol,
        address payable operatorReward,
        Governance memory governance
    ) public initializer {
        require(
            _protocol.whitelist == address(0) && newProtocol.whitelist != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.wethVault == address(0) && newProtocol.wethVault != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(_protocol.rplVault == address(0) && newProtocol.rplVault != address(0), Constants.INITIALIZATION_ERROR);
        require(
            _protocol.merkleClaimStreamer == address(0) && newProtocol.merkleClaimStreamer != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.superNode == address(0) && newProtocol.superNode != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(_protocol.oracle == address(0) && newProtocol.oracle != address(0), Constants.INITIALIZATION_ERROR);
        require(
            _protocol.operatorDistributor == address(0) && newProtocol.operatorDistributor != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(_operatorReward == address(0) && operatorReward != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.oracle == address(0) && newProtocol.oracle != address(0), Constants.INITIALIZATION_ERROR);
        require(
            _protocol.priceFetcher == address(0) && newProtocol.priceFetcher != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.rocketStorage == address(0) && newProtocol.rocketStorage != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.sanctions == address(0) && newProtocol.sanctions != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(_protocol.weth == address(0) && newProtocol.weth != address(0), Constants.INITIALIZATION_ERROR);
        require(_treasury == address(0) && governance.treasury != address(0), Constants.INITIALIZATION_ERROR);
        require(governance.treasurer != address(0), Constants.INITIALIZATION_ERROR);
        require(
            governance.timelockShort != address(0) &&
                governance.timelockMed != address(0) &&
                governance.timelockLong != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(governance.admin != address(0), Constants.INITIALIZATION_ERROR);

        // set up role admins
        AccessControlUpgradeable.__AccessControl_init();
        _setRoleAdmin(Constants.ADMIN_ROLE, Constants.ADMIN_ROLE);
        _setRoleAdmin(Constants.ADMIN_SERVER_ROLE, Constants.ADMIN_ROLE);
        _setRoleAdmin(Constants.ADMIN_ORACLE_ROLE, Constants.ADMIN_ROLE);
        _setRoleAdmin(Constants.TREASURER_ROLE, Constants.TREASURER_ROLE);
        _setRoleAdmin(Constants.CORE_PROTOCOL_ROLE, Constants.TIMELOCK_LONG);
        _setRoleAdmin(Constants.TIMELOCK_SHORT, Constants.TIMELOCK_SHORT);
        _setRoleAdmin(Constants.TIMELOCK_MED, Constants.TIMELOCK_MED);
        _setRoleAdmin(Constants.TIMELOCK_LONG, Constants.TIMELOCK_LONG);

        // set role addresses
        _grantRole(Constants.ADMIN_ROLE, governance.admin);
        _grantRole(Constants.TREASURER_ROLE, governance.treasurer);
        _grantRole(Constants.TIMELOCK_SHORT, governance.timelockShort);
        _grantRole(Constants.TIMELOCK_MED, governance.timelockMed);
        _grantRole(Constants.TIMELOCK_LONG, governance.timelockLong);
        _grantRole(Constants.ADMIN_SERVER_ROLE, governance.adminServer);
        _grantRole(Constants.ADMIN_ORACLE_ROLE, governance.adminOracle);

        // Note that the protocol role should ONLY be given to protocol contracts
        // This is a dangerous role that MUST be kept internal
        // It should never be given to a non-core-protocol contract (e.g. don't give it to the treasury or operator rewards address)
        // and it should also never be given to an EOA (e.g. don't give this to the ADMIN or TREASURER)
        // This is the only list of contracts which should ever have this role:
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.whitelist);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.wethVault);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.rplVault);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.operatorDistributor);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.merkleClaimStreamer);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.oracle);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.priceFetcher);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.superNode);

        _treasury = governance.treasury;
        _operatorReward = operatorReward;
        _protocol = newProtocol;

        _enabledSanctions = true;
    }

    /// @notice Sets the treasury address. DO NOT CALL THIS TO UPGRADE THE IMPLEMENTATION CONTRACT!
    /// @param newTreasury The new treasury address.
    /// @dev Note that this does NOT upgrade the existing implementation contract.
    /// Instead it changes the contract completely, including storage!
    function setTreasury(address payable newTreasury) public {
        require(hasRole(Constants.TREASURER_ROLE, msg.sender), Constants.TREASURER_ONLY_ERROR);
        emit TreasuryAddressChanged(_treasury, newTreasury);
        _treasury = newTreasury;
    }

    /// @notice Sets the operator rewards proxy contract address. DO NOT CALL THIS TO UPGRADE THE IMPLEMENTATION CONTRACT!
    /// @param newOperatorRewards The new operator rewards contract address.
    /// @dev Note that this does NOT upgrade the existing implementation contract.
    /// Instead it changes the contract completely, including storage!
    function setOperatorRewards(address payable newOperatorRewards) public {
        require(hasRole(Constants.TIMELOCK_LONG, msg.sender), Constants.TIMELOCK_LONG_ONLY_ERROR);
        emit OperatorRewardAddressChanged(_operatorReward, newOperatorRewards);
        _operatorReward = newOperatorRewards;
    }

    /// @notice Convenience function to set the oracle proxy contract address specifically. DO NOT CALL THIS TO UPGRADE THE IMPLEMENTATION CONTRACT!
    /// @dev Will enforce that the new address implements the IConstellationOracle interface
    /// Note that this does NOT upgrade the existing implementation contract.
    /// Instead it changes the contract completely, including storage!
    /// @param newOracle The new oracle contract address.
    function setOracle(IConstellationOracle newOracle) public {
        require(hasRole(Constants.TIMELOCK_LONG, msg.sender), Constants.TIMELOCK_LONG_ONLY_ERROR);
        address newAddress = address(newOracle);
        emit OracleAddressChanged(_protocol.oracle, newAddress);
        _protocol.oracle = newAddress;
    }

    /// @notice Updates all protocol contract proxy addresses in a single call. DO NOT CALL THIS TO UPGRADE THE IMPLEMENTATION CONTRACTS!
    /// @param newProtocol A Protocol struct containing updated addresses of protocol contracts.
    /// @dev This function allows an administrator to change all protocol contract proxy addresses simultaneously.
    /// * Note that this function does NOT validate that the addresses provided differ from the current addresses at all.
    /// You will waste gas if you call this with the same addresses already used!
    /// * Note that this does NOT upgrade the existing implementation contracts.
    /// Instead it changes the contract completely, including storage!
    function setAll(Protocol memory newProtocol) public {
        require(hasRole(Constants.TIMELOCK_LONG, msg.sender), Constants.TIMELOCK_LONG_ONLY_ERROR);
        emit AllContractAddressesChanged(_protocol, newProtocol);
        _protocol = newProtocol;
    }

    /// @notice Enables or disables sanctions enforcement.
    function setSanctionsEnabled(bool newValue) public {
        require(newValue != _enabledSanctions, '_enabledSanctions already set to this value');
        require(hasRole(Constants.ADMIN_ROLE, msg.sender), Constants.ADMIN_ONLY_ERROR);
        emit SanctionsEnabledChanged(_enabledSanctions, newValue);
        _enabledSanctions = newValue;
    }

    /// @notice Checks if a single account is sanctioned.
    /// @param _account The account to check.
    /// @return bool indicating if the account is sanctioned.
    function isSanctioned(address _account) public returns (bool) {
        address[] memory accounts = new address[](1);
        accounts[0] = _account;
        return _checkSanctions(accounts);
    }

    /// @notice Checks if two accounts are sanctioned.
    /// @param _account1 The first account to check.
    /// @param _account2 The second account to check.
    /// @return bool indicating if the accounts are sanctioned.
    function isSanctioned(address _account1, address _account2) public returns (bool) {
        address[] memory accounts = new address[](2);
        accounts[0] = _account1;
        accounts[1] = _account2;
        return _checkSanctions(accounts);
    }

    /// @notice Checks if multiple accounts are sanctioned.
    /// @param _accounts The array of accounts to check.
    /// @return bool indicating if any of the accounts are sanctioned.
    function isSanctioned(address[] memory _accounts) public returns (bool) {
        return _checkSanctions(_accounts);
    }

    /// @notice Internal function to check if any accounts are sanctioned.
    /// @param _accounts The array of accounts to check.
    /// @return bool indicating if any of the accounts are sanctioned.
    function _checkSanctions(address[] memory _accounts) internal returns (bool) {
        if (!_enabledSanctions) {
            return false;
        }
        bool sanctioned = false;
        for (uint i = 0; i < _accounts.length; i++) {
            if (_accounts[i] != address(0) && ISanctions(_protocol.sanctions).isSanctioned(_accounts[i])) {
                emit SanctionViolation(_accounts[i], tx.origin);
                sanctioned = true;
                break;
            }
        }
        if (sanctioned || ISanctions(_protocol.sanctions).isSanctioned(tx.origin)) {
            emit SanctionViolationSingleOrigin(tx.origin);
            return true;
        }
        return false;
    }
}
