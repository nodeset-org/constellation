// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IConstellationMinipoolsOracle {
    function getNodesetBackedMinipools() external view returns(address[] memory);
}