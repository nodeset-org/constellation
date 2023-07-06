// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../Base.sol";

/// @notice An operator which provides services to the network.
struct Operator {
    uint256 operationStartTime;
    uint256 currentValidatorCount;
    uint256 intervalStart;
}
