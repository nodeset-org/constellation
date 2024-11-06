// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;


contract MockOracle {
    uint256 public totalYieldAccrued;

    function getTotalYieldAccrued() public view returns (uint256) {
        return totalYieldAccrued;
    }
}