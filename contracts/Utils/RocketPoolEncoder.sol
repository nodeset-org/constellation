// SPDX-License-Identifier: GPL v3

pragma solidity ^0.8.0;

library RocketpoolEncoder {
    function generateBytes32Identifier(string memory contractName) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked('contract.address', contractName));
    }
}