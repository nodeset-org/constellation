// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "../../Interfaces/Oracles/IConstellationMinipoolsOracle.sol";

/// @notice This contract is an oracle which reads and parses all the minipool data from the RocketMinipoolManager contract that belongs to the current protocol
contract MockConstellationMinipoolsOracle is IConstellationMinipoolsOracle {

    address[] private _nodesetBackedMinipools;

    function getNodesetBackedMinipools() public view override returns(address[] memory) {
        return _nodesetBackedMinipools;
    }

    function addMiniPool(address miniPool) public override {
        _nodesetBackedMinipools.push(miniPool);
    }

    function removeMiniPool(address miniPool) public override {
        for (uint i = 0; i < _nodesetBackedMinipools.length; i++) {
            if (_nodesetBackedMinipools[i] == miniPool) {
                _nodesetBackedMinipools[i] = _nodesetBackedMinipools[_nodesetBackedMinipools.length - 1];
                _nodesetBackedMinipools.pop();
                break;
            }
        }
    }

}