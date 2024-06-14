// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import '../UpgradeableBase.sol';
import '../Operator/YieldDistributor.sol';
import '../Operator/SuperNodeAccount.sol';
import '../Utils/Constants.sol';

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
    event OperatorsAdded(address[] operators);

    event OperatorRemoved(address);
    event OperatorsRemoved(address[] operators);

    event OperatorControllerUpdated(address indexed oldController, address indexed newController);

    mapping(address => bool) internal _permissions;

    mapping(address => address) public operatorControllerToNodeMap;
    mapping(address => Operator) public nodeMap;
    mapping(uint256 => address) public nodeIndexMap;
    mapping(address => uint256) public reverseNodeIndexMap;
    mapping(bytes => bool) public sigsUsed;

    uint256 public numOperators;

    /// @notice Initializes the Whitelist contract with a directory address.
    /// @param directoryAddress The address of the directory contract.
    function initializeWhitelist(address directoryAddress) public initializer {
        super.initialize(directoryAddress);
    }

    //----
    // GETTERS
    //----

    /// @notice Checks if an address is in the whitelist.
    /// @dev This function allows users to query whether a specific address is in the whitelist.
    /// @param a The address to check.
    /// @return True if the address is in the whitelist, otherwise false.
    function getIsAddressInWhitelist(address a) public view returns (bool) {
        return _permissions[a];
    }

    /// @notice Retrieves the Operator struct associated with a specific address.
    /// @dev This function allows users to retrieve detailed information about an operator
    ///      based on their address.
    /// @param a The address of the operator to retrieve information for.
    /// @return An Operator struct containing details about the operator.
    /// @dev Throws an error if the specified address is not found in the whitelist.
    function getOperatorAtAddress(address a) public view returns (Operator memory) {
        require(reverseNodeIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return nodeMap[a];
    }

    /// @notice Retrieves the number of validators associated with a specific operator address.
    /// @dev This function allows users to query the number of validators managed by an operator
    ///      based on their address.
    /// @param a The address of the operator to retrieve the number of validators for.
    /// @return The number of validators associated with the specified operator.
    /// @dev Throws an error if the specified address is not found in the whitelist.
    function getNumberOfValidators(address a) public view returns (uint) {
        require(reverseNodeIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return nodeMap[a].currentValidatorCount;
    }

    //----
    // INTERNAL
    //----

    /// @notice Registers a new validator under a specific node operator.
    /// @dev This function allows the protocol to register a new validator under a node operator's address.
    ///      Only accessible to authorized protocol administrators.
    /// @param nodeOperator The address of the node operator to register the new validator under.
    /// @dev Increases the validator count for the specified node operator.
    function registerNewValidator(address nodeOperator) public onlyProtocol {
        nodeMap[nodeOperator].currentValidatorCount++;
    }

    /// @notice Retrieves the address of an operator based on its index.
    /// @dev This function allows users to obtain the address of an operator using its index.
    /// @param index The index of the operator whose address is being retrieved.
    /// @return The address of the operator associated with the specified index.
    /// @dev If the index is invalid or does not correspond to any operator, the result will be an empty address.
    function getOperatorAddress(uint index) public view returns (address) {
        return nodeIndexMap[index];
    }

    //----
    // ADMIN
    //----

    /// @notice Internal function to add a new operator to the whitelist. Signs an address; optimized for server-side signatures with isolated scope on Ethereum.
    /// @dev This function is used internally to add a new operator to the whitelist, including updating permissions, initializing operator data,
    /// and emitting the 'OperatorAdded' event. This method signs the address directly, which is typically discouraged due to potential risks
    /// of address reuse across different protocols or chains. However, for this specific application where
    /// the signer is only the server and its operational scope is limited to this Ethereum deployment,
    /// it is considered safe and more optimal. Signatures are completely isolated to this scope.
    /// @param _operator The address of the operator to be added.
    /// @return An Operator struct containing details about the newly added operator.
    function _addOperator(address _operator, bytes memory _sig) internal returns (Operator memory) {
        require(!sigsUsed[_sig], 'sig already used');
        sigsUsed[_sig] = true;
        bytes32 messageHash = keccak256(abi.encodePacked(_operator, address(this)));
        console.log('_addOperator: message hash');
        console.logBytes32(messageHash);
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(messageHash);
        console.log('_addOperator: ethSignedMessageHash');
        console.logBytes32(ethSignedMessageHash);
        address recoveredAddress = ECDSA.recover(ethSignedMessageHash, _sig);
        require(_directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress), 'signer must be admin server role');

        _permissions[_operator] = true;

        YieldDistributor distributor = YieldDistributor(payable(getDirectory().getYieldDistributorAddress()));

        numOperators++;

        distributor.finalizeInterval(); // operator controller will be entitled to rewards in the next interval

        uint256 nextInterval = distributor.currentInterval();
        Operator memory operator = Operator(block.timestamp, 0, nextInterval - 1, _operator);

        nodeMap[_operator] = operator;
        nodeIndexMap[numOperators] = _operator;
        reverseNodeIndexMap[_operator] = numOperators + 1;

        return operator;
    }

    /// @notice Adds a new operator to the whitelist.
    /// @dev This function can only be called by a 24-hour timelock and ensures that the operator being added is not a duplicate.
    ///      It emits the 'OperatorAdded' event to notify when an operator has been successfully added.
    /// @param _operator The address of the operator to be added.
    /// @dev Throws an error if the operator being added already exists in the whitelist.
    function addOperator(address _operator, bytes calldata _sig) public {
        require(!_permissions[_operator], Constants.OPERATOR_DUPLICATE_ERROR);
        emit OperatorAdded(_addOperator(_operator, _sig));
    }

    /// @notice Internal function to remove an operator from the whitelist.
    /// @dev This function is used internally to remove an operator from the whitelist, including updating permissions, clearing operator data,
    ///      and notifying the OperatorDistributor and YieldDistributor contracts.
    /// @param nodeOperator The address of the operator to be removed.
    function _removeOperator(address nodeOperator) internal {
        _permissions[nodeOperator] = false;

        delete nodeMap[nodeOperator];
        uint index = reverseNodeIndexMap[nodeOperator] - 1;
        delete nodeIndexMap[index];
        delete reverseNodeIndexMap[nodeOperator];

        SuperNodeAccount superNode = SuperNodeAccount(_directory.getSuperNodeAddress());
        superNode.removeAllMinipools(nodeOperator);
        // todo: is this dangerous? do we lose any resouces doing this?

        YieldDistributor ydistributor = YieldDistributor(payable(getDirectory().getYieldDistributorAddress()));

        ydistributor.finalizeInterval();

        numOperators--;
    }

    /// @notice Removes an operator from the whitelist.
    /// @dev This function can only be called by a 24-hour timelock and is used to remove an operator from the whitelist.
    ///      It emits the 'OperatorRemoved' event to notify when an operator has been successfully removed.
    /// @param nodeOperator The address of the operator to be removed.
    /// @dev Throws no errors during execution.
    function removeOperator(address nodeOperator) public only24HourTimelock {
        _removeOperator(nodeOperator);
        emit OperatorRemoved(nodeOperator);
    }

    /// @notice Batch addition of operators to the whitelist.
    /// @dev This function can only be called by a 24-hour timelock and allows multiple operators to be added to the whitelist simultaneously.
    ///      It checks for duplicates among the provided addresses, adds valid operators, and emits the 'OperatorsAdded' event.
    /// @param operators An array of addresses representing the operators to be added.
    /// @dev Throws an error if any of the operators being added already exist in the whitelist.
    function addOperators(address[] memory operators, bytes[] memory _sig) public {
        for (uint i = 0; i < operators.length; i++) {
            require(!_permissions[operators[i]], Constants.OPERATOR_DUPLICATE_ERROR);
        }
        for (uint i = 0; i < operators.length; i++) {
            _addOperator(operators[i], _sig[i]);
        }
        emit OperatorsAdded(operators);
    }

    /// @notice Batch removal of operators from the whitelist.
    /// @dev This function can only be called by a 24-hour timelock and allows multiple operators to be removed from the whitelist simultaneously.
    ///      It removes valid operators and emits the 'OperatorsRemoved' event.
    /// @param operators An array of addresses representing the operators to be removed.
    /// @dev Throws no errors during execution.
    function removeOperators(address[] memory operators) public only24HourTimelock {
        for (uint i = 0; i < operators.length; i++) {
            _removeOperator(operators[i]);
        }
        emit OperatorsRemoved(operators);
    }

    /// @notice Sets the operator controller for a node operator.
    /// @dev This function allows a node operator or their authorized controller to set a new operator controller address.
    ///      The function updates the mapping of operator controllers to node addresses and emits the 'OperatorControllerUpdated' event.
    /// @param controller The address of the new operator controller.
    /// @dev Throws an error if the sender is not the current operator controller for the specified node.
    function setOperatorController(address controller) public {
        address node = operatorControllerToNodeMap[msg.sender];
        if (node == address(0)) {
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

    /// @notice Retrieves the index of an operator based on its address.
    /// @dev This private function allows the contract to obtain the index of an operator using its address.
    /// @param a The address of the operator to retrieve the index for.
    /// @return The index of the operator associated with the specified address.
    /// @dev Throws an error if the specified address is not found in the whitelist.
    function getOperatorIndex(address a) private view returns (uint) {
        require(reverseNodeIndexMap[a] != 0, Constants.OPERATOR_NOT_FOUND_ERROR);
        return reverseNodeIndexMap[a];
    }
}
