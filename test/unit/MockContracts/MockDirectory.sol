// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import 'hardhat/console.sol';

contract MockDirectory {
    address rocketMinipoolManager;
    mapping(bytes32 => mapping(address => bool)) private roles;

    function getRocketMinipoolManagerAddress() public view returns (address) {
        return rocketMinipoolManager;
    }

    function setRocketMinipoolManagerAddress(address _rocketMinipoolManager) public {
        rocketMinipoolManager = _rocketMinipoolManager;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return roles[role][account];
    }

    function setRole(bytes32 role, address account, bool value) public {
        roles[role][account] = value;
    }
}