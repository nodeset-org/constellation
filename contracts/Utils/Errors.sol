// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

/**
 * @title Errors
 * @notice Defines custom error types for various conditions.
 */
contract Errors {
    error NotAContract(address addr);
    error BadBondAmount(uint256 expectedBondAmount, uint256 actualBondAmount);
    error InsufficientBalance(uint expectedBalance, uint256 actualBalance);
    error BadRole(bytes32 role, address user);
    error BadSender(address expectedSender);
    error LowLevelEthTransfer(bool success, bytes data);
    error LowLevelCall(bool success, bytes data);
    error ZeroAddressError();
    error BadPredictedCreation(address expected, address actual);
}