// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

library Constants {
    // ROLES
    bytes32 internal constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 internal constant ADMIN_SERVER_ROLE =
        keccak256("ADMIN_SERVER_ROLE");
    bytes32 internal constant CORE_PROTOCOL_ROLE =
        keccak256("CORE_PROTOCOL_ROLE");
    bytes32 internal constant TIMELOCK_24_HOUR = keccak256("TIMELOCK_24_HOUR");

    // DIRECTORY
    string public constant CONTRACT_NOT_FOUND_ERROR =
        "Directory: contract not found!";
    string public constant ADMIN_ONLY_ERROR =
        "Directory: may only be called by admin address!";
    string public constant INITIALIZATION_ERROR =
        "Directory: bad initialization!";

    // WHITELIST
    string public constant OPERATOR_NOT_FOUND_ERROR =
        "Whitelist: Provided address is not an allowed operator!";
    string public constant OPERATOR_DUPLICATE_ERROR =
        "Whitelist: Provided address is already an allowed operator!";
    string public constant OPERATOR_CONTROLLER_SET_FORBIDDEN_ERROR =
        "Whitelist: Operator controller may only be set by the operator controller!";

    // TREASURY
    string public constant BAD_TREASURY_EXECUTION_ERROR =
        "Treasury: execution reverted.";
    string public constant BAD_TREASURY_BATCH_CALL =
        "Treasury: array length mismatch.";

    // OPERATOR_DISTRIBUTOR
    string public constant MINIPOOL_NODE_NOT_WHITELISTED_ERROR =
        "OperatorDistributor: minipool node operator not in whitelist";
    string public constant MINIPOOL_NOT_LEB8_ERROR =
        "OperatorDistributor: minipool must be LEB8";
    string public constant MINIPOOL_INVALID_BOND_ERROR =
        "OperatorDistributor: minipool must have a valid bond";
    string public constant BAD_ADMIN_SERVER_SIGNATURE_ERROR =
        "OperatorDistributor: invalid signature";
    string public constant MINIPOOL_NOT_REGISTERED_ERROR =
        "OperatorDistributor: minipool must be registered in smoothing pool";
    string public constant INSUFFICIENT_ETH_IN_QUEUE_ERROR =
        "OperatorDistributor: insufficient ETH in queue";
}
