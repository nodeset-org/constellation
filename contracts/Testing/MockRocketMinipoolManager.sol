// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "./MockMinipool.sol";

contract MockRocketMinipoolManager {
    
    address[] public minipools;
    mapping(address => MockMinipool) public minipoolMap;

    function addMinipool(address minipool) public {
        minipools.push(minipool);
        minipoolMap[minipool] = MockMinipool(minipool);
    }

    function removeMinipool(address minipool) public {
        for (uint i = 0; i < minipools.length; i++) {
            if (minipools[i] == minipool) {
                minipools[i] = minipools[minipools.length - 1];
                minipools.pop();
                break;
            }
        }
    }

    function getMinipools() public view returns (address[] memory) {
        return minipools;
    }

}