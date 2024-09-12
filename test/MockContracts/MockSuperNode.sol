// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract MockSuperNode {
    uint256 public numMinipools;
    function setNumMinipools(uint256 _numMinipools) public {
        numMinipools = _numMinipools;
    }
    function getNumMinipools() public view returns (uint256) {
        return numMinipools;
    }
}