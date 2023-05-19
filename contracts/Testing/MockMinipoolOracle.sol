// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

contract MockMinipoolOracle {

    address[] public nodesetBackedMinipools;

    function addMinipool(address minipool) public {
        nodesetBackedMinipools.push(minipool);
    }

    function removeMinipool(address minipool) public {
        for (uint i = 0; i < nodesetBackedMinipools.length; i++) {
            if (nodesetBackedMinipools[i] == minipool) {
                nodesetBackedMinipools[i] = nodesetBackedMinipools[nodesetBackedMinipools.length - 1];
                nodesetBackedMinipools.pop();
                break;
            }
        }
    }

    function getMinipools() public view returns (address[] memory) {
        return nodesetBackedMinipools;
    }
}