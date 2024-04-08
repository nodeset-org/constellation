pragma solidity >0.5.0 <0.9.0;

// SPDX-License-Identifier: GPL-3.0-only

interface IRocketDAOProtocolProposal {
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

    function propose(
        string memory _proposalMessage,
        bytes calldata _payload,
        uint32 _blockNumber,
        Node[] calldata _treeNodes
    ) external;

    function vote(
        uint256 _proposalID,
        VoteDirection _voteDirection,
        uint256 _votingPower,
        uint256 _nodeIndex,
        Node[] calldata _witness
    ) external;

    function overrideVote(
        uint256 _proposalID,
        VoteDirection _voteDirection
    ) external;
}
