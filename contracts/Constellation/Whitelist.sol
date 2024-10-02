// SPDX-License-Identifier: GPL v3

/**
  *    /***        /***          /******                                  /**               /** /**             /**     /**                    
  *   /**_/       |_  **        /**__  **                                | **              | **| **            | **    |__/                    
  *  | **   /** /** | **       | **  \__/  /******  /*******   /******* /******    /****** | **| **  /******  /******   /**  /******  /******* 
  *  /***  |__/|__/ | ***      | **       /**__  **| **__  ** /**_____/|_  **_/   /**__  **| **| ** |____  **|_  **_/  | ** /**__  **| **__  **
  * |  **           | **       | **      | **  \ **| **  \ **|  ******   | **    | ********| **| **  /*******  | **    | **| **  \ **| **  \ **
  *  \ **   /** /** | **       | **    **| **  | **| **  | ** \____  **  | ** /* | **_____/| **| ** /**__  **  | ** /* | **| **  | **| **  | **
  *  |  ***|__/|__/***         |  ******||  ****** | **  | ** /*******   | ****  |  *******| **| **| ********  | ****  | **|  ****** | **  | **
  *   \___/       |___/         \______/  \______/ |__/  |__/|_______/    \___/   \_______/|__/|__/ \_______/   \___/  |__/ \______/ |__/  |__/
  *
  *  A liquid staking protocol extending Rocket Pool.
  *  Made w/ <3 by {::}
  *
  *  For more information, visit https://nodeset.io
  *
  *  @author Mike Leach (Wander), Nick Steinhilber (NickS), Theodore Clapp (mryamz), Joe Clapis (jcrtp), Huy Nguyen, Andy Rose (Barbalute)
  *  @custom:security-info https://docs.nodeset.io/nodeset/security-notice
  **/

pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import './Utils/UpgradeableBase.sol';
import './SuperNodeAccount.sol';
import './Utils/Constants.sol';

/// @notice An operator which provides services to the network.
struct Operator {
    uint256 activeValidatorCount;
    bool allowed;
    uint256 nonce;
}

/**
 * @title Whitelist
 * @author Mike Leach, Theodore Clapp
 * @notice Controls operator access to the protocol. Only modifiable by permission of the admin.
 */ 
contract Whitelist is UpgradeableBase {
    event OperatorAdded(Operator);
    event OperatorsAdded(address[] operators);

    event OperatorRemoved(address);
    event OperatorsRemoved(address[] operators);

    mapping(address => Operator) public operators;
    uint256 public nonce;

    /**
     * @notice Initializes the Whitelist contract with a directory address.
     * @param directoryAddress The address of the directory contract.
     */
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
        return operators[a].allowed;
    }

    /// @notice Retrieves the Operator struct associated with a specific address.
    /// @dev This function allows users to retrieve detailed information about an operator
    ///      based on their address.
    /// @param a The address of the operator to retrieve information for.
    /// @return An Operator struct containing details about the operator.
    /// @dev Throws an error if the specified address is not found in the whitelist.
    function getOperatorAtAddress(address a) public view returns (Operator memory) {
        return operators[a];
    }

    /// @notice Retrieves the number of validators associated with a specific operator address.
    /// @dev This function allows users to query the number of validators managed by an operator
    ///      based on their address.
    /// @param a The address of the operator to retrieve the number of validators for.
    /// @return The number of validators associated with the specified operator.
    /// @dev Throws an error if the specified address is not found in the whitelist.
    function getActiveValidatorCountForOperator(address a) public view returns (uint) {
        return operators[a].activeValidatorCount;
    }

    function getNonceForOperator(address a) public view returns (uint) {
        return operators[a].nonce;
    }

    //----
    // INTERNAL
    //----

    /// @notice Registers a new validator under a specific node operator.
    /// @dev This function allows the protocol to register a new validator under a node operator's address.
    /// @param operatorAddress The address of the node operator to register the new validator under.
    /// @dev Increases the validator count for the specified node operator.
    function registerNewValidator(address operatorAddress) public onlyProtocol {
        operators[operatorAddress].activeValidatorCount++;
    }

    /// @notice Registers a new validator under a specific node operator.
    /// @dev This function allows the protocol to register a new validator under a node operator's address.
    /// @param operatorAddress The address of the node operator the validator is being removed from.
    /// @dev Decreases the validator count for the specified node operator.
    function removeValidator(address operatorAddress) public onlyProtocol {
        // ensure this validator is associated with an operator
        // if it's not, then the operator may have been removed, so just do nothing
        if(operators[operatorAddress].activeValidatorCount == 0) {
            return;
        }
        operators[operatorAddress].activeValidatorCount--;
    }

    //----
    // PUBLIC
    //----

    /// @notice Adds a new operator to the whitelist.
    /// @dev Ensures that the operator being added is not a duplicate.
    ///      It emits the 'OperatorAdded' event to notify when an operator has been successfully added.
    /// @param operatorAddress The address of the operator to be added.
    /// @dev Throws an error if the operator being added already exists in the whitelist.
    function addOperator(address operatorAddress, bytes calldata sig) public {
        emit OperatorAdded(_addOperator(operatorAddress, sig));
    }

    //----
    // ADMIN
    //----

    /// @notice Internal function to remove an operator from the whitelist.
    /// @dev This function is used internally to remove an operator from the whitelist, including updating permissions, clearing operator data,
    ///      and notifying the OperatorDistributor and NodeSetOperatorRewardDistributor contracts.
    /// @param operatorAddress The address of the operator to be removed.
    function _removeOperator(address operatorAddress) internal {
        operators[operatorAddress].allowed = false;
    }

    /// @notice Removes an operator from the whitelist.
    /// @dev This function can only be called by a 24-hour timelock and is used to remove an operator from the whitelist.
    ///      It emits the 'OperatorRemoved' event to notify when an operator has been successfully removed.
    /// @param nodeOperator The address of the operator to be removed.
    function removeOperator(address nodeOperator) public onlyShortTimelock {
        _removeOperator(nodeOperator);
        emit OperatorRemoved(nodeOperator);
    }

    /// @notice Batch addition of operators to the whitelist.
    /// @dev This function can only be called by a 24-hour timelock and allows multiple operators to be added to the whitelist simultaneously.
    ///      It checks for duplicates among the provided addresses, adds valid operators, and emits the 'OperatorsAdded' event.
    /// @param operatorAddresses An array of addresses representing the operators to be added.
    /// @dev Throws an error if any of the operators being added already exist in the whitelist.
    function addOperators(address[] memory operatorAddresses, bytes[] memory _sig) public {
        for (uint i = 0; i < operatorAddresses.length; i++) {
            _addOperator(operatorAddresses[i], _sig[i]);
        }
        emit OperatorsAdded(operatorAddresses);
    }

    /// @notice Batch removal of operators from the whitelist.
    /// @dev This function can only be called by a 24-hour timelock and allows multiple operators to be removed from the whitelist simultaneously.
    ///      It removes valid operators and emits the 'OperatorsRemoved' event.
    /// @param operatorAddresses An array of addresses representing the operators to be removed.
    /// @dev Throws no errors during execution.
    function removeOperators(address[] memory operatorAddresses) public onlyShortTimelock {
        for (uint i = 0; i < operatorAddresses.length; i++) {
            _removeOperator(operatorAddresses[i]);
        }
        emit OperatorsRemoved(operatorAddresses);
    }

    //----
    // INTERNAL
    //----

    /// @notice Internal function to add a new operator to the whitelist. Signs an address; optimized for server-side signatures with isolated scope on Ethereum.
    /// @dev This function is used internally to add a new operator to the whitelist, including updating permissions, initializing operator data,
    /// and emitting the 'OperatorAdded' event. This method signs the address directly, which is typically discouraged due to potential risks
    /// of address reuse across different protocols or chains. However, for this specific application where
    /// the signer is only the server and its operational scope is limited to this Ethereum deployment,
    /// it is considered safe and more optimal. Signatures are completely isolated to this scope.
    /// @param _operator The address of the operator to be added.
    /// @return An Operator struct containing details about the newly added operator.
    function _addOperator(
        address _operator,
        bytes memory _sig
    ) internal returns (Operator memory) {
        require(!this.getIsAddressInWhitelist(_operator), Constants.OPERATOR_DUPLICATE_ERROR);
        
        bytes32 messageHash = keccak256(abi.encodePacked(_operator, address(this), operators[_operator].nonce++, nonce, block.chainid));
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(messageHash);
        address recoveredAddress = ECDSA.recover(ethSignedMessageHash, _sig);
        require(_directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress), 'bad signature');

        operators[_operator].allowed = true;

        return operators[_operator];
    }

    function invalidateAllOutstandingSigs() external onlyAdmin {
        nonce++;
    }

    function invalidateSingleOutstandingSig(address _nodeOperator) external onlyAdmin {
        operators[_nodeOperator].nonce++;
    }
}
