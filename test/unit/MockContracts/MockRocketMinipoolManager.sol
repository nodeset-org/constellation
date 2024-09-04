// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockRocketMinipoolManager {
    bool private minipoolExists;

    // Setter function to change the return value of `getMinipoolExists`
    function setMinipoolExists(bool _exists) external {
        minipoolExists = _exists;
    }

    function getMinipoolExists(address) external view returns (bool) {
        return minipoolExists;
    }
}