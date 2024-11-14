// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;


contract MockMerkleClaimStreamer {
    uint256 public streamedTvlEth;
    uint256 public streamedTvlRpl;

    function getStreamedTvlEth() public view returns (uint256) {
        return streamedTvlEth;
    }

    function getStreamedTvlRpl() public view returns (uint256) {
        return streamedTvlRpl;
    }
}