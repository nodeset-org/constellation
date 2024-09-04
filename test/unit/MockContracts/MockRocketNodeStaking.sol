// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockRocketNodeStakingConstellation {
    mapping(address => uint256) nodeRplStake;
    mapping(address => uint256) ethMatched;
    mapping(address => uint256) ethProvided;

    function getNodeRPLStake(address _nodeAddress) public view returns (uint256) {
        return nodeRplStake[_nodeAddress];
    }

    function setNodeRplStake(address _nodeAddress, uint256 _nodeRplStake) public {
        nodeRplStake[_nodeAddress] = _nodeRplStake;
    }

    function getNodeETHMatched(address _nodeAddress) public view returns (uint256) {
        return ethMatched[_nodeAddress];
    }

    function setNodeETHMatched(address _nodeAddress, uint256 _nodeEthMatched) public {
        ethMatched[_nodeAddress] = _nodeEthMatched;
    }

    function getNodeETHProvided(address _nodeAddress) public view returns (uint256) {
        return ethProvided[_nodeAddress];
    }

    function setNodeETHProvided(address _nodeAddress, uint256 _nodeEthProvided) public {
        ethProvided[_nodeAddress] = _nodeEthProvided;
    }
}