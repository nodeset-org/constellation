// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockRocketDepositPool {
    uint256 public excessBalance;

    function getExcessBalance() public view returns (uint256) {
        return excessBalance;
    }

    function setExcessBalance(uint256 _excessBalance) public {
        excessBalance = _excessBalance;
    }
}