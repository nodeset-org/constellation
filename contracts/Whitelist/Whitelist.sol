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
}


/// @custom:security-contact info@nodeoperator.org
/// @notice Controls operator access to the protocol.
/// Only modifiable by admin. Upgradeable and intended to be replaced by a ZK-ID check when possible.
contract Whitelist is UpgradeableBase {

    event OperatorAdded(Operator newOperator);
    event OperatorRemoved(address a);

    mapping(address => bool) internal _permissions;

    mapping(address => Operator) public operatorMap;
    mapping(uint => address) public operatorIndexMap;
    mapping(address => uint) public reverseOperatorIndexMap;

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
        require(reverseOperatorIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return operatorMap[a];
    }

    function getNumberOfValidators(
        address a
    ) public view returns (uint) {
        require(reverseOperatorIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return operatorMap[a].currentValidatorCount;
    }

    //----
    // INTERNAL
    //----

    function registerNewValidator(
        address nodeOperator
    ) public onlyProtocol {
        operatorMap[nodeOperator].currentValidatorCount++;
    }

    function getOperatorAddress(uint index) public view returns (address) {
        return operatorIndexMap[index];
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

        distributor.finalizeInterval();

        uint256 nextInterval = distributor.currentInterval();
        Operator memory operator = Operator(block.timestamp, 0, nextInterval);
        // operator will be entitled to rewards in the next interval

        operatorMap[a] = operator;
        operatorIndexMap[numOperators] = a;
        reverseOperatorIndexMap[a] = numOperators + 1;

        emit OperatorAdded(operator);
    }

    function removeOperator(address nodeOperator) public only24HourTimelock {
        _permissions[nodeOperator] = false;

        delete operatorMap[nodeOperator];
        uint index = reverseOperatorIndexMap[nodeOperator] - 1;
        delete operatorIndexMap[index];
        delete reverseOperatorIndexMap[nodeOperator];


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


    //----
    // INTERNAL
    //----

    function getOperatorIndex(address a) private view returns (uint) {
        require(reverseOperatorIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return reverseOperatorIndexMap[a];
    }
}
