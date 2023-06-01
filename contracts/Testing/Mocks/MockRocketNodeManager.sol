// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "../../Interfaces/RocketPool/IRocketNodeManager.sol";

// Mocks the Rocket Pool Node Manager contract regarding setSmoothingPoolRegistrationState() and getSmoothingPoolRegistrationState() functions
contract MockRocketNodeManager is IRocketNodeManager {
    mapping(address => bool) private smoothingPoolRegistrationStates;

    function setSmoothingPoolRegistrationState(
        bool _state
    ) public override returns (bool) {
        smoothingPoolRegistrationStates[msg.sender] = _state;
        return _state;
    }

    function getSmoothingPoolRegistrationState(
        address _nodeAddress
    ) public view override returns (bool) {
        return smoothingPoolRegistrationStates[_nodeAddress];
    }
}
