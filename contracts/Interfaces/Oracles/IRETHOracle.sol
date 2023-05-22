// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRETHOracle {
    function getPrice() external view returns (uint);
}
