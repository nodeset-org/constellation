pragma solidity 0.8.9;

import "../../interface/RocketStorageInterface.sol";

// SPDX-License-Identifier: GPL-3.0-only

struct ProviderData {
    uint128 limit;          // In gwei
    uint128 share;          // In gwei
    uint256 paid;           // Total owing to provider = (unclaimedPerShare * share) - paid
}

struct OperatorData {
    uint128 limit;          // Max number of minipools for this operator
    uint128 count;          // Current number of minipools for this operator
    uint256 paidRpl;        // Total owing to operator = (nodeOperatorUnclaimedRplPerMinipool * minipoolCount) - paidRpl
    uint256 paidEth;        // Total owing to operator = (nodeOperatorUnclaimedEthPerMinipool * minipoolCount) - paidEth
}

abstract contract RocketSupernodeStorageLayout {
    RocketStorageInterface rocketStorage;
    address ownerAddress;

    // Minimum node fee
    uint256 minimumNodeFee;

    // Capital provider balance mapping
    mapping(address => ProviderData) ethProviders;
    mapping(address => ProviderData) rplProviders;

    // Operator mapping
    mapping(address => OperatorData) operators;

    // Total shares
    uint128 totalEthShares;
    uint128 totalRplShares;

    // Total active minipools
    uint256 totalMinipoolCount;

    // Unallocated
    uint256 unallocatedEth;

    // Unclaimed rewards
    uint256 unclaimedEthPerShare;
    uint256 unclaimedRplPerShare;
    uint256 unclaimedEth;
    uint256 unclaimedRpl;
    uint256 supernodeUnclaimedEth;
    uint256 supernodeUnclaimedRpl;
    uint256 nodeOperatorUnclaimedEthPerMinipool;
    uint256 nodeOperatorUnclaimedRplPerMinipool;

    // Actor set
    address[] actors;
    mapping(address => bool) actorExists;

    // Fees
    uint64 nodeOperatorRplFee;
    uint64 nodeOperatorEthFee;
    uint64 supernodeRplFee;
    uint64 supernodeEthFee;
}