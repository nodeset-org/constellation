// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface IRocketMerkleDistributorMainnet {
    function claim(
        address _nodeAddress,
        uint256[] calldata _rewardIndex,
        uint256[] calldata _amountRPL,
        uint256[] calldata _amountETH,
        bytes32[][] calldata _merkleProof
    ) external;
}
