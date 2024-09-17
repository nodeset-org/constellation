// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract MockSuperNode {
    uint256 public numMinipools;
    address[] public minipools;
    mapping(address => bool) public isMinipoolRecognized;

    function setNumMinipools(uint256 _numMinipools) public {
        numMinipools = _numMinipools;
    }

    function getNumMinipools() public view returns (uint256) {
        return numMinipools;
    }

    function setMinipools(address[] memory _minipools) public {
        minipools = _minipools;
    }

    function getIsMinipoolRecognized(address _minipool) public view returns (bool) {
        return isMinipoolRecognized[_minipool];
    }

    function setIsMinipoolRecognized(address _minipool, bool _isRecognized) public {
        isMinipoolRecognized[_minipool] = _isRecognized;
    }
}