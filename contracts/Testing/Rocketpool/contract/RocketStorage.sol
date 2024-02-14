pragma solidity 0.7.6;

// SPDX-License-Identifier: GPL-3.0-only

import '../interface/RocketStorageInterface.sol';
import './util/SafeMath.sol';

/// @title The primary persistent storage for Rocket Pool
/// @author David Rugendyke

contract RocketStorage is RocketStorageInterface {
    // Events
    event NodeWithdrawalAddressSet(address indexed node, address indexed withdrawalAddress, uint256 time);
    event GuardianChanged(address oldGuardian, address newGuardian);

    // Libraries
    using SafeMath for uint256;

    // Storage maps
    mapping(bytes32 => string) private stringStorage;
    mapping(bytes32 => bytes) private bytesStorage;
    mapping(bytes32 => uint256) private uintStorage;
    mapping(bytes32 => int256) private intStorage;
    mapping(bytes32 => address) private addressStorage;
    mapping(bytes32 => bool) private booleanStorage;
    mapping(bytes32 => bytes32) private bytes32Storage;

    // Protected storage (not accessible by network contracts)
    mapping(address => address) private withdrawalAddresses;
    mapping(address => address) private pendingWithdrawalAddresses;

    // Guardian address
    address guardian;
    address newGuardian;

    // Flag storage has been initialised
    bool storageInit = false;

    /// @dev Only allow access from the latest version of a contract in the Rocket Pool network after deployment
    modifier onlyLatestRocketNetworkContract() {
        if (storageInit == true) {
           
        } else {
            // Only Dapp and the guardian account are allowed access during initialisation.
            // tx.origin is only safe to use in this case for deployment since no external contracts are interacted with
            require(
                (booleanStorage[keccak256(abi.encodePacked('contract.exists', msg.sender))] || tx.origin == guardian),
                'Invalid or outdated network contract attempting access during deployment'
            );
        }
        _;
    }

    /// @dev Construct RocketStorage
    constructor() {
        // Set the guardian upon deployment
        guardian = msg.sender;
    }

    // Get guardian address
    function getGuardian() external view override returns (address) {
        return guardian;
    }

    // Transfers guardianship to a new address
    function setGuardian(address _newAddress) external override {
        // Check tx comes from current guardian
        require(msg.sender == guardian, 'Is not guardian account');
        // Store new address awaiting confirmation
        newGuardian = _newAddress;
    }

    // Confirms change of guardian
    function confirmGuardian() external override {
        // Check tx came from new guardian address
        require(msg.sender == newGuardian, 'Confirmation must come from new guardian address');
        // Store old guardian for event
        address oldGuardian = guardian;
        // Update guardian and clear storage
        guardian = newGuardian;
        delete newGuardian;
        // Emit event
        emit GuardianChanged(oldGuardian, guardian);
    }

    // Set this as being deployed now
    function getDeployedStatus() external view override returns (bool) {
        return storageInit;
    }

    // Set this as being deployed now
    function setDeployedStatus() external {
        // Only guardian can lock this down
        require(msg.sender == guardian, 'Is not guardian account');
        // Set it now
        storageInit = true;
    }

    // Protected storage

    // Get a node's withdrawal address
    function getNodeWithdrawalAddress(address _nodeAddress) public view override returns (address) {
        // If no withdrawal address has been set, return the nodes address
        address withdrawalAddress = withdrawalAddresses[_nodeAddress];
        if (withdrawalAddress == address(0)) {
            return _nodeAddress;
        }
        return withdrawalAddress;
    }

    // Get a node's pending withdrawal address
    function getNodePendingWithdrawalAddress(address _nodeAddress) external view override returns (address) {
        return pendingWithdrawalAddresses[_nodeAddress];
    }

    // Set a node's withdrawal address
    function setWithdrawalAddress(
        address _nodeAddress,
        address _newWithdrawalAddress,
        bool _confirm
    ) external override {
        // Check new withdrawal address
        require(_newWithdrawalAddress != address(0x0), 'Invalid withdrawal address');
        // Confirm the transaction is from the node's current withdrawal address
        address withdrawalAddress = getNodeWithdrawalAddress(_nodeAddress);
        require(withdrawalAddress == msg.sender, "Only a tx from a node's withdrawal address can update it");
        // Update immediately if confirmed
        if (_confirm) {
            updateWithdrawalAddress(_nodeAddress, _newWithdrawalAddress);
        }
        // Set pending withdrawal address if not confirmed
        else {
            pendingWithdrawalAddresses[_nodeAddress] = _newWithdrawalAddress;
        }
    }

    // Confirm a node's new withdrawal address
    function confirmWithdrawalAddress(address _nodeAddress) external override {
        // Get node by pending withdrawal address
        require(
            pendingWithdrawalAddresses[_nodeAddress] == msg.sender,
            'Confirmation must come from the pending withdrawal address'
        );
        delete pendingWithdrawalAddresses[_nodeAddress];
        // Update withdrawal address
        updateWithdrawalAddress(_nodeAddress, msg.sender);
    }

    // Update a node's withdrawal address
    function updateWithdrawalAddress(address _nodeAddress, address _newWithdrawalAddress) private {
        // Set new withdrawal address
        withdrawalAddresses[_nodeAddress] = _newWithdrawalAddress;
        // Emit withdrawal address set event
        emit NodeWithdrawalAddressSet(_nodeAddress, _newWithdrawalAddress, block.timestamp);
    }

    /// @param _key The key for the record
    function getAddress(bytes32 _key) external view override returns (address r) {
        return addressStorage[_key];
    }

    /// @param _key The key for the record
    function getUint(bytes32 _key) external view override returns (uint256 r) {
        return uintStorage[_key];
    }

    /// @param _key The key for the record
    function getString(bytes32 _key) external view override returns (string memory) {
        return stringStorage[_key];
    }

    /// @param _key The key for the record
    function getBytes(bytes32 _key) external view override returns (bytes memory) {
        return bytesStorage[_key];
    }

    /// @param _key The key for the record
    function getBool(bytes32 _key) external view override returns (bool r) {
        return booleanStorage[_key];
    }

    /// @param _key The key for the record
    function getInt(bytes32 _key) external view override returns (int r) {
        return intStorage[_key];
    }

    /// @param _key The key for the record
    function getBytes32(bytes32 _key) external view override returns (bytes32 r) {
        return bytes32Storage[_key];
    }

    /// @param _key The key for the record
    function setAddress(bytes32 _key, address _value) external override onlyLatestRocketNetworkContract {
        addressStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setUint(bytes32 _key, uint _value) external override onlyLatestRocketNetworkContract {
        uintStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setString(bytes32 _key, string calldata _value) external override onlyLatestRocketNetworkContract {
        stringStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setBytes(bytes32 _key, bytes calldata _value) external override onlyLatestRocketNetworkContract {
        bytesStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setBool(bytes32 _key, bool _value) external override onlyLatestRocketNetworkContract {
        booleanStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setInt(bytes32 _key, int _value) external override onlyLatestRocketNetworkContract {
        intStorage[_key] = _value;
    }

    /// @param _key The key for the record
    function setBytes32(bytes32 _key, bytes32 _value) external override onlyLatestRocketNetworkContract {
        bytes32Storage[_key] = _value;
    }

    /// @param _key The key for the record
    function deleteAddress(bytes32 _key) external override onlyLatestRocketNetworkContract {
        delete addressStorage[_key];
    }

    /// @param _key The key for the record
    function deleteUint(bytes32 _key) external override onlyLatestRocketNetworkContract {
        delete uintStorage[_key];
    }

    /// @param _key The key for the record
    function deleteString(bytes32 _key) external override onlyLatestRocketNetworkContract {
        delete stringStorage[_key];
    }

    /// @param _key The key for the record
    function deleteBytes(bytes32 _key) external override onlyLatestRocketNetworkContract {
        delete bytesStorage[_key];
    }

    /// @param _key The key for the record
    function deleteBool(bytes32 _key) external override onlyLatestRocketNetworkContract {
        delete booleanStorage[_key];
    }

    /// @param _key The key for the record
    function deleteInt(bytes32 _key) external override onlyLatestRocketNetworkContract {
        delete intStorage[_key];
    }

    /// @param _key The key for the record
    function deleteBytes32(bytes32 _key) external override onlyLatestRocketNetworkContract {
        delete bytes32Storage[_key];
    }

    /// @param _key The key for the record
    /// @param _amount An amount to add to the record's value
    function addUint(bytes32 _key, uint256 _amount) external override onlyLatestRocketNetworkContract {
        uintStorage[_key] = uintStorage[_key].add(_amount);
    }

    /// @param _key The key for the record
    /// @param _amount An amount to subtract from the record's value
    function subUint(bytes32 _key, uint256 _amount) external override onlyLatestRocketNetworkContract {
        uintStorage[_key] = uintStorage[_key].sub(_amount);
    }
}
