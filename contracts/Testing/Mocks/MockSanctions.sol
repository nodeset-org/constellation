// SPDX-License-Identifier: GPL v3

pragma solidity 0.8.17;

import "../../Interfaces/ISanctions.sol";

contract MockSanctions is ISanctions {

    mapping(address => bool) blacklist;

    function isSanctioned(address addr) external view returns (bool) {
        return blacklist[addr];
    }

    function addBlacklist(address _account) public {
        blacklist[_account] = true;
    }
}
