// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "./MockRocketMinipoolManager.sol";
import "../Interfaces/Oracles/IConstellationMinipoolsOracle.sol";

/// @notice This contract is an oracle which reads and parses all the minipool data from the RocketMinipoolManager contract that belongs to the current protocol
contract MockConstellationMinipoolsOracle is IConstellationMinipoolsOracle {

    MockRocketMinipoolManager public minipoolManager;

    function setMinipoolManager(address _minipoolManager) external {
        minipoolManager = MockRocketMinipoolManager(_minipoolManager);
    }

    function getNodesetBackedMinipools() public view override returns(address[] memory) {
        return minipoolManager.getMinipools();
    }

}