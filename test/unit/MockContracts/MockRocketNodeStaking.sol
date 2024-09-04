// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import 'hardhat/console.sol';

contract MockRocketNodeStaking {
    mapping(address => uint256) nodeRplStake;

    function getNodeRPLStake(address _nodeAddress) public view returns (uint256) {
        return nodeRplStake[_nodeAddress];
    }

    function setNodeRplStake(address _nodeAddress, uint256 _nodeRplStake) public {
        nodeRplStake[_nodeAddress] = _nodeRplStake;
    }
}