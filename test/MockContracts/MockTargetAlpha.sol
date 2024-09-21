// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.17;

contract MockTargetAlpha {

    uint256 public called;

    function doCall(uint256 number) external payable {
        called = number;
    }
}