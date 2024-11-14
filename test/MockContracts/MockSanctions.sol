// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockSanctions {
    mapping(address => bool) blacklist;

    function isSanctioned(address addr) external view returns (bool) {
        return blacklist[addr];
    }

    function setSanctioned(address _account, bool _sanctioned) public {
        blacklist[_account] = _sanctioned;
    }
}