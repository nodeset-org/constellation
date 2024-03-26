// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import '../../Interfaces/RocketPool/IRocketNodeManager.sol';

// Mocks the Rocket Pool Node Manager contract regarding setSmoothingPoolRegistrationState() and getSmoothingPoolRegistrationState() functions
contract MockRocketNodeManager is IRocketNodeManager {
    mapping(address => bool) public smoothingPoolRegistrationStates;
    mapping(address => address) public nodeOperatorsToMinipools;

    function setSmoothingPoolRegistrationState(bool _state) public override returns (bool) {
        smoothingPoolRegistrationStates[nodeOperatorsToMinipools[msg.sender]] = _state;
        return _state;
    }

    function getSmoothingPoolRegistrationState(address _nodeAddress) public view override returns (bool) {
        return smoothingPoolRegistrationStates[nodeOperatorsToMinipools[_nodeAddress]];
    }

    function mockSetNodeOperatorToMinipool(address _nodeOperator, address _minipool) public {
        nodeOperatorsToMinipools[_nodeOperator] = _minipool;
    }

    function registerNode(string calldata _timezoneLocation) external {}

    function setRPLWithdrawalAddress(
        address _nodeAddress,
        address _newRPLWithdrawalAddress,
        bool _confirm
    ) external override {}
}
