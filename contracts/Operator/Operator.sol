// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.9;

import "../Base.sol";

/// @notice An operator which provides services to the network. 
struct Operator {
    uint index; // INTERNAL USE ONLY! Do not depend on this value to remain consistent.
    address nodeAddress;
    uint operationStartTime;
    uint8 currentValidatorCount;

    /// @notice The portion of an operator's total allotted fee which they actually receive.
    /// This rises from 0% (0) to 100% (YieldDistributor.YIELD_PORTION_MAX) over
    /// time as they 
    uint16 feePortion; 
}