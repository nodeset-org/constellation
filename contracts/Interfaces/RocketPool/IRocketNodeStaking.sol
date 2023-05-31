// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRocketNodeStaking {

    function getNodeMinimumRPLStake(address _nodeAddress) external view returns (uint256);

}