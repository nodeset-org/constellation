// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRocketDepositPool {
    function getBalance() external view returns (uint256);
}
