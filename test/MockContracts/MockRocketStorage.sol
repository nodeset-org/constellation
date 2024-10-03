// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockRocketStorage {
    mapping (bytes32 => address) private addressMapping;

    function getAddress(bytes32 key) external view returns (address) {
        return addressMapping[key];
    }

    function setAddress(bytes32 key, address value) external {
        addressMapping[key] = value;
    }
}