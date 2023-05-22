// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "../../Interfaces/Oracles/IConstellationMinipoolsOracle.sol";

/// @notice This contract is an oracle which reads and parses all the minipool data from the RocketMinipoolManager contract that belongs to the current protocol
contract MockConstellationMinipoolsOracle is IConstellationMinipoolsOracle {
    address[] private _nodesetBackedMinipools;
    mapping(address => uint) private _minipoolIndex;

    function getNodesetBackedMinipools()
        public
        view
        override
        returns (address[] memory)
    {
        return _nodesetBackedMinipools;
    }

    function addMiniPool(address miniPool) public override {
        _nodesetBackedMinipools.push(miniPool);
        _minipoolIndex[miniPool] = _nodesetBackedMinipools.length;
    }

    function removeMiniPool(address miniPool) public override {
        uint index = _minipoolIndex[miniPool];
        require(
            index != 0,
            "MockConstellationMinipoolsOracle: MiniPool not found"
        );
        uint lastIndex = _nodesetBackedMinipools.length - 1;
        address lastMiniPool = _nodesetBackedMinipools[lastIndex];
        _nodesetBackedMinipools[index - 1] = lastMiniPool;
        _minipoolIndex[lastMiniPool] = index;
        _nodesetBackedMinipools.pop();
        delete _minipoolIndex[miniPool];
    }

    function hasMinipool(address miniPool) public view override returns (bool) {
        return _minipoolIndex[miniPool] != 0;
    }
}
