// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import 'hardhat/console.sol';

contract MockSuperNode {
    struct Minipool {
        address subNodeOperator;
        uint256 ethTreasuryFee;
        uint256 noFee;
        uint256 index; // index in the minipool list
    }
    uint256 public bond;
    uint256 public numMinipools;
    address[] public minipools;
    mapping(address => bool) public isMinipoolRecognized;
    mapping(address => Minipool) public minipoolData;


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

    function setMinipoolData(
        address _minipool,
        address _subNodeOperator,
        uint256 _ethTreasuryFee,
        uint256 _noFee,
        uint256 _index
    ) public {
        minipoolData[_minipool] = Minipool(_subNodeOperator, _ethTreasuryFee, _noFee, _index);
    }

    function removeMinipool(address _minipool) public pure {
    }

    function getEthStaked() public pure returns (uint256) {
        return 0;
    }

    function setBond(uint256 _bond) public {
        bond = _bond;
    }
}