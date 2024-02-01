// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import '../../Interfaces/RocketPool/IRocketStorage.sol';

// Mocks the Rocket Pool Deposit Pool contract regarding setWithdrawalAddress() and getWithdrawalAddress() functions
contract MockRocketStorage is IRocketStorage {
    mapping(address => address) private withdrawalAddresses;

    function setWithdrawalAddress(address _nodeAddress, address _newWithdrawalAddress, bool _confirm) public override {
        if (_confirm) {
            withdrawalAddresses[_nodeAddress] = _newWithdrawalAddress;
        }
    }

    function getNodeWithdrawalAddress(address _nodeAddress) public view override returns (address) {
        return withdrawalAddresses[_nodeAddress];
    }

    function getDeployedStatus() external view override returns (bool) {}

    function getGuardian() external view override returns (address) {}

    function setGuardian(address _newAddress) external override {}

    function confirmGuardian() external override {}

    function getAddress(bytes32 _key) external view override returns (address) {}

    function getUint(bytes32 _key) external view override returns (uint) {}

    function getString(bytes32 _key) external view override returns (string memory) {}

    function getBytes(bytes32 _key) external view override returns (bytes memory) {}

    function getBool(bytes32 _key) external view override returns (bool) {}

    function getInt(bytes32 _key) external view override returns (int) {}

    function getBytes32(bytes32 _key) external view override returns (bytes32) {}

    function setAddress(bytes32 _key, address _value) external override {}

    function setUint(bytes32 _key, uint _value) external override {}

    function setString(bytes32 _key, string calldata _value) external override {}

    function setBytes(bytes32 _key, bytes calldata _value) external override {}

    function setBool(bytes32 _key, bool _value) external override {}

    function setInt(bytes32 _key, int _value) external override {}

    function setBytes32(bytes32 _key, bytes32 _value) external override {}

    function deleteAddress(bytes32 _key) external override {}

    function deleteUint(bytes32 _key) external override {}

    function deleteString(bytes32 _key) external override {}

    function deleteBytes(bytes32 _key) external override {}

    function deleteBool(bytes32 _key) external override {}

    function deleteInt(bytes32 _key) external override {}

    function deleteBytes32(bytes32 _key) external override {}

    function addUint(bytes32 _key, uint256 _amount) external override {}

    function subUint(bytes32 _key, uint256 _amount) external override {}

    function getNodePendingWithdrawalAddress(address _nodeAddress) external view override returns (address) {}

    function confirmWithdrawalAddress(address _nodeAddress) external override {}
}
