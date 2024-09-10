// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockRocketMinipoolManager {
    mapping(address => bool) private minipoolExists;

    function setMinipoolExists(address _minipool, bool _exists) external {
        minipoolExists[_minipool] = _exists;
    }

    function getMinipoolExists(address _minipool) external view returns (bool) {
        return minipoolExists[_minipool];
    }
}