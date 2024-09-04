// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import 'hardhat/console.sol';
contract MockDirectory {
    address rocketMinipoolManager;
    address whitelist;
    address operatorDistributor;
    address rocketNodeStaking;
    mapping(bytes32 => mapping(address => bool)) private roles;

    function getRocketMinipoolManagerAddress() public view returns (address) {
        return rocketMinipoolManager;
    }

    function setRocketMinipoolManagerAddress(address _rocketMinipoolManager) public {
        rocketMinipoolManager = _rocketMinipoolManager;
    }

    function getWhitelistAddress() public view returns (address) {
        console.log("GetWHiteliSTAddress");
        return whitelist;
    }

    function setWhitelistAddress(address _whitelist) public {
        whitelist = _whitelist;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return roles[role][account];
    }

    function setRole(bytes32 role, address account, bool value) public {
        roles[role][account] = value;
    }

    function getOperatorDistributorAddress() public view returns (address) {
        return operatorDistributor;
    }

    function setOperatorDistributorAddress(address _operatorDistributor) public {
        operatorDistributor = _operatorDistributor;
    }

    function getRocketNodeStakingAddress() public view returns (address) {
        return rocketNodeStaking;
    }

    function setRocketNodeStakingAddress(address _rocketNodeStaking) public {
        rocketNodeStaking = _rocketNodeStaking;
    }
}