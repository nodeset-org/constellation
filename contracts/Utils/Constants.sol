// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

library Constants {

    // ETHEREUM MAINNET
    address payable internal constant RPL_CONTRACT_ADDRESS =
        payable(0xD33526068D116cE69F19A9ee46F0bd304F21A51f);

    address payable internal constant WETH_CONTRACT_ADDRESS =
        payable(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    address payable internal constant UNISWAP_RPL_ETH_POOL_ADDRESS =
        payable(0xe42318eA3b998e8355a3Da364EB9D48eC725Eb45);

    address internal constant RP_NETWORK_FEES_ADDRESS =
        payable(0x320f3aAB9405e38b955178BBe75c477dECBA0C27);


    // ROLES
    bytes32 internal constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 internal constant ADMIN_SERVER_ROLE = keccak256("ADMIN_SERVER_ROLE");
    bytes32 internal constant CORE_PROTOCOL_ROLE = keccak256("CORE_PROTOCOL_ROLE");

    // ERRORS
    string public constant CONTRACT_NOT_FOUND_ERROR =
        "Directory: contract not found!";
    string public constant ADMIN_ONLY_ERROR =
        "Directory: may only be called by admin address!";
    string public constant INITIALIZATION_ERROR =
        "Directory: may only initialized once!";
}
