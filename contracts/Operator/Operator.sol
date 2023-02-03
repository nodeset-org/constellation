// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.9;

import "../Base.sol";

/// @notice An operator which provides services to the network. 
struct Operator {
    uint index; // INTERNAL USE ONLY! Do not depend on this value to remain consistent!
    address nodeAddress;
    uint operationStartTime;
    uint8 currentValidatorCount;
    uint16 feePortion;
}