pragma solidity 0.8.9;

import "../RocketBase.sol";
import "./RocketSupernode.sol";
import "./RocketSupernodeDelegate.sol";
import "../../interface/node/RocketNodeDepositInterface.sol";
import "../../interface/util/AddressSetStorageInterface.sol";

// SPDX-License-Identifier: GPL-3.0-only

contract RocketSupernodeManager is RocketBase {
    // Events
    event SupernodeCreated(address supernodeAddress, uint256 time);

    // Construct
    constructor(RocketStorageInterface _rocketStorageAddress) RocketBase(_rocketStorageAddress) {
        // Version
        version = 1;
    }

    // Creates a new supernode
    function createSupernode(string memory _timezoneLocation) external onlyLatestContract("rocketSupernodeManager", address(this)) {
        // Deploy supernode contract
        RocketSupernodeDelegate supernode = RocketSupernodeDelegate(address(new RocketSupernode(address(rocketStorage), msg.sender)));
        // Register the supernode with Rocket Pool
        supernode.register(_timezoneLocation);
        // Add the supernode to the super node operator's set
        AddressSetStorageInterface addressSetStorage = AddressSetStorageInterface(getContractAddress("addressSetStorage"));
        addressSetStorage.addItem(keccak256(abi.encodePacked("supernode.index", msg.sender)), address(supernode));
        // Emit event
        emit SupernodeCreated(address(supernode), block.timestamp);
    }

    // Called by node operator to create a new minipool on behalf of the given supernode
    function deposit(address _supernodeAddress, bytes calldata _validatorPubkey, bytes calldata _validatorSignature, bytes32 _depositDataRoot, uint256 _salt, address _expectedMinipoolAddress) external payable onlyLatestContract("rocketSupernodeManager", address(this)) {
        // Perform the deposit through the supernode
        RocketSupernodeDelegate supernode = RocketSupernodeDelegate(_supernodeAddress);
        // Construct final salt
        uint256 finalSalt = uint256(keccak256(abi.encodePacked(addmod(uint160(msg.sender), _salt, uint256(-1)))));
        supernode.deposit(msg.sender, _validatorPubkey, _validatorSignature, _depositDataRoot, finalSalt, _expectedMinipoolAddress);
        // Add the new minipool to the node operator's set
        AddressSetStorageInterface addressSetStorage = AddressSetStorageInterface(getContractAddress("addressSetStorage"));
        addressSetStorage.addItem(keccak256(abi.encodePacked("supernode.operator.minipool.index", msg.sender)), _expectedMinipoolAddress);
    }

    // Retrieves the nth supernode owned by the given supernode operator
    function getSupernodeAt(address _supernodeOperator, uint256 _index) external view returns (address) {
        AddressSetStorageInterface addressSetStorage = AddressSetStorageInterface(getContractAddress("addressSetStorage"));
        return addressSetStorage.getItem(keccak256(abi.encodePacked("supernode.index", _supernodeOperator)), _index);
    }

    // Retrieves the count of supernodes owned by given supernode operator
    function getSupernodeCount(address _supernodeOperator, uint256 _index) external view returns (uint256) {
        AddressSetStorageInterface addressSetStorage = AddressSetStorageInterface(getContractAddress("addressSetStorage"));
        return addressSetStorage.getCount(keccak256(abi.encodePacked("supernode.index", _supernodeOperator)));
    }

    // Retrieves the nth minipool address for a given node operator
    function getMinipoolAt(address _nodeOperator, uint256 _index) external view returns (address) {
        AddressSetStorageInterface addressSetStorage = AddressSetStorageInterface(getContractAddress("addressSetStorage"));
        return addressSetStorage.getItem(keccak256(abi.encodePacked("supernode.operator.minipool.index", _nodeOperator)), _index);
    }

    // Retrieves the count of minipools owned by given node operator
    function getMinipoolCount(address _nodeOperator, uint256 _index) external view returns (uint256) {
        AddressSetStorageInterface addressSetStorage = AddressSetStorageInterface(getContractAddress("addressSetStorage"));
        return addressSetStorage.getCount(keccak256(abi.encodePacked("supernode.operator.minipool.index", _nodeOperator)));
    }
}