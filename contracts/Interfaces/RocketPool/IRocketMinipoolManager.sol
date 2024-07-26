// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRocketMinipoolManager {
    function getMinipoolExists(address _minipoolAddress) external view returns (bool);
}
