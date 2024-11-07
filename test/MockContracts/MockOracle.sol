// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;


contract MockOracle {
    uint256 public totalYieldAccrued;
    uint256 public lastUpdatedTotalYieldAccrued;

    function getTotalYieldAccrued() public view returns (uint256) {
        return totalYieldAccrued;
    }

    function setLastUpdatedTotalYieldAccrued(uint256 _lastUpdatedTotalYieldAccrued) public {
        lastUpdatedTotalYieldAccrued = _lastUpdatedTotalYieldAccrued;
    }

    function getLastUpdatedTotalYieldAccrued() public view returns (uint256) {
        return lastUpdatedTotalYieldAccrued;
    }
}