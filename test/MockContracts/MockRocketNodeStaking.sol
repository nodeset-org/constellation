// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockRocketNodeStaking {
    mapping(address => uint256) nodeRplStake;
    mapping(address => uint256) ethMatched;
    mapping(address => uint256) ethProvided;
    mapping(address => uint256) nodeRplLocked;
    mapping(address => uint256) stakedTime;
    mapping(address => uint256) maximumRplStake;

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

    function withdrawRPL(address _nodeAddress, uint256 _amount) public {
        nodeRplStake[_nodeAddress] -= _amount;
    }

    function getNodeRPLStakedTime(address _nodeAddress) public view returns (uint256) {
        return stakedTime[_nodeAddress];
    }

    function setNodeRPLStakedTime(address _nodeAddress, uint256 _stakedTime) public {
        stakedTime[_nodeAddress] = _stakedTime;
    }

    function getNodeMaximumRPLStake(address _nodeAddress) public view returns (uint256) {
        return maximumRplStake[_nodeAddress];
    }
    function setNodeMaximumRPLStake(address _nodeAddress, uint256 _maximumStake) public{
        maximumRplStake[_nodeAddress] = _maximumStake;
    }
}