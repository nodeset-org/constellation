// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import 'hardhat/console.sol';

contract MockRocketNodeStakingConstellation {
    mapping(address => uint256) nodeRplStake;
    mapping(address => uint256) ethMatched;

    function getNodeRPLStake(address _nodeAddress) public view returns (uint256) {
        return nodeRplStake[_nodeAddress];
    }

    function setNodeRplStake(address _nodeAddress, uint256 _nodeRplStake) public {
        nodeRplStake[_nodeAddress] = _nodeRplStake;
    }

    function getNodeETHMatched(address _nodeAddress) public view returns (uint256) {
        return ethMatched[_nodeAddress];
    }

    function setNodeETHMatched(address _nodeAddress, uint256 _nodeETHMatched) public {
        ethMatched[_nodeAddress] = _nodeETHMatched;
    }
}