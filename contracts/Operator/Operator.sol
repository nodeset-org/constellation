// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../Base.sol";

/// @notice An operator which provides services to the network.
struct Operator {
    uint operationStartTime;
    uint currentValidatorCount;
    /// @notice The portion of an operator's total allotted fee which they actually receive.
    /// This rises from 0% (0) to 100% (YieldDistributor.YIELD_PORTION_MAX) over
    /// time as they
    uint16 feePortion;
    uint256 totalRewardsAtGenesis;
}
