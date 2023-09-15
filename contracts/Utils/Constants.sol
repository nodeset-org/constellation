// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

library Constants {

    address payable internal constant UNISWAP_RPL_ETH_POOL_ADDRESS =
        payable(0xe42318eA3b998e8355a3Da364EB9D48eC725Eb45);

    // ROLES
    bytes32 internal constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 internal constant ADMIN_SERVER_ROLE = keccak256("ADMIN_SERVER_ROLE");
    bytes32 internal constant CORE_PROTOCOL_ROLE = keccak256("CORE_PROTOCOL_ROLE");
    bytes32 internal constant TIMELOCK_24_HOUR = keccak256("TIMELOCK_24_HOUR");

    // ERRORS
    string public constant CONTRACT_NOT_FOUND_ERROR =
        "Directory: contract not found!";
    string public constant ADMIN_ONLY_ERROR =
        "Directory: may only be called by admin address!";
    string public constant INITIALIZATION_ERROR =
        "Directory: may only initialized once!";
}
