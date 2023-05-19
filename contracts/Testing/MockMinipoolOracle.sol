// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "./MockRocketMinipoolManager.sol";

/// @notice This contract is an oracle which reads and parses all the minipool data from the RocketMinipoolManager contract that belongs to the current protocol
contract MockMinipoolOracle {

    MockRocketMinipoolManager public minipoolManager;

    constructor(address minipoolManagerAddress) {
        minipoolManager = MockRocketMinipoolManager(minipoolManagerAddress);
    }

    function getNodesetBackedMinipools() public view returns(address[] memory) {
        return minipoolManager.getMinipools();
    }

}