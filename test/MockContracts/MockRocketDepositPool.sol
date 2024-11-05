// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockRocketDepositPool {
    uint256 public balance;

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function setBalance(uint256 _balance) public {
        balance = _balance;
    }
}