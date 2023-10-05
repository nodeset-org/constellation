// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../UpgradeableBase.sol";
import "../Operator/YieldDistributor.sol";
import "../Utils/Constants.sol";

/// @notice An operator which provides services to the network.
struct Operator {
    uint256 operationStartTime;
    uint256 currentValidatorCount;
    uint256 intervalStart;
    address operatorController; // designated address to control the node operator's settings and collect rewards
}

/// @custom:security-contact info@nodeoperator.org
/// @notice Controls operator access to the protocol.
/// Only modifiable by admin. Upgradeable and intended to be replaced by a ZK-ID check when possible.
contract Whitelist is UpgradeableBase {

    event OperatorAdded(Operator);
    event OperatorRemoved(address);
    event OperatorControllerUpdated(address indexed oldController, address indexed newController);

    mapping(address => bool) internal _permissions;

    mapping(address => address) public operatorControllerToNodeMap;
    mapping(address => Operator) public nodeMap;
    mapping(uint256 => address) public nodeIndexMap;
    mapping(address => uint256) public reverseNodeIndexMap;

    uint256 public numOperators;

    function initializeWhitelist(
        address directoryAddress
    ) public initializer {
        super.initialize(directoryAddress);
    }

    //----
    // GETTERS
    //----

    function getIsAddressInWhitelist(address a) public view returns (bool) {
        return _permissions[a];
    }

    function getOperatorAtAddress(
        address a
    ) public view returns (Operator memory) {
        require(reverseNodeIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return nodeMap[a];
    }

    function getNumberOfValidators(
        address a
    ) public view returns (uint) {
        require(reverseNodeIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return nodeMap[a].currentValidatorCount;
    }

    //----
    // INTERNAL
    //----

    function registerNewValidator(
        address nodeOperator
    ) public onlyProtocol {
        nodeMap[nodeOperator].currentValidatorCount++;
    }

    function getOperatorAddress(uint index) public view returns (address) {
        return nodeIndexMap[index];
    }

    //----
    // ADMIN
    //----

    function addOperator(address a) public only24HourTimelock {
        require(!_permissions[a], Constants.OPERATOR_DUPLICATE_ERROR);

        _permissions[a] = true;

        YieldDistributor distributor = YieldDistributor(
            payable(getDirectory().getYieldDistributorAddress())
        );

        numOperators++;

        distributor.finalizeInterval(); // operator controller will be entitled to rewards in the next interval

        uint256 nextInterval = distributor.currentInterval();
        Operator memory operator = Operator(block.timestamp, 0, nextInterval, a);

        nodeMap[a] = operator;
        nodeIndexMap[numOperators] = a;
        reverseNodeIndexMap[a] = numOperators + 1;

        emit OperatorAdded(operator);
    }

    function removeOperator(address nodeOperator) public only24HourTimelock {
        _permissions[nodeOperator] = false;

        delete nodeMap[nodeOperator];
        uint index = reverseNodeIndexMap[nodeOperator] - 1;
        delete nodeIndexMap[index];
        delete reverseNodeIndexMap[nodeOperator];


        OperatorDistributor odistributor = OperatorDistributor(
            payable(getDirectory().getOperatorDistributorAddress())
        );

        odistributor.removeNodeOperator(nodeOperator);

        YieldDistributor ydistributor = YieldDistributor(
            payable(getDirectory().getYieldDistributorAddress())
        );


        ydistributor.finalizeInterval();

        numOperators--;

        emit OperatorRemoved(nodeOperator);
    }

    function setOperatorController(address controller) public {
        address node = operatorControllerToNodeMap[msg.sender];
        if(node == address(0)) {
            node = msg.sender;
        }
        require(msg.sender == nodeMap[node].operatorController, Constants.OPERATOR_CONTROLLER_SET_FORBIDDEN_ERROR);
        nodeMap[node].operatorController = controller;
        operatorControllerToNodeMap[controller] = node;
        operatorControllerToNodeMap[msg.sender] = address(0);
        emit OperatorControllerUpdated(msg.sender, controller);
    }

    //----
    // INTERNAL
    //----

    function getOperatorIndex(address a) private view returns (uint) {
        require(reverseNodeIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return reverseNodeIndexMap[a];
    }
}
