// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

contract MockTargetAlpha {

    uint256 public called;

    function doCall(uint256 number) external payable {
        called = number;
    }
}