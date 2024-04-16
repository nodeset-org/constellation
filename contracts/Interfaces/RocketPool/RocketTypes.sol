// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

struct Node {
    uint256 sum;
    bytes32 hash;
}

enum VoteDirection {
    NoVote,
    Abstain,
    For,
    Against,
    AgainstWithVeto
}
