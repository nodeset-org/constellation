// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockRocketNodeStakingConstellation {
    mapping(address => uint256) nodeRplStake;
    mapping(address => uint256) ethMatched;
    mapping(address => uint256) ethProvided;
    mapping(address => uint256) nodeRplLocked;

    function getNodeRPLStake(address _nodeAddress) public view returns (uint256) {
        return nodeRplStake[_nodeAddress];
    }

    function setNodeRplStake(address _nodeAddress, uint256 _nodeRplStake) public {
        nodeRplStake[_nodeAddress] = _nodeRplStake;
    }

    function getNodeRPLLocked(address _nodeAddress) public view returns (uint256) {
        return nodeRplLocked[_nodeAddress];
    }

    function setNodeRPLLocked(address _nodeAddress, uint256 _nodeRplLocked) public {
        nodeRplLocked[_nodeAddress] = _nodeRplLocked;
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

    function stakeRPLFor(address _nodeAddress, uint256 _amount) public {
        nodeRplStake[_nodeAddress] += _amount;
    }
}