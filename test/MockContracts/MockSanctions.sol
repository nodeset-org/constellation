// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockSanctions {
    mapping(address => bool) blacklist;

    function isSanctioned(address addr) external view returns (bool) {
        return blacklist[addr];
    }

    function addBlacklist(address _account) public {
        blacklist[_account] = true;
    }
}