// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRocketDepositPool {
    function getExcessBalance() external view returns (uint256);
}
