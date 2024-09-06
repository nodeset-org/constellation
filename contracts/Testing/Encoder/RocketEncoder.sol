// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "contracts/Constellation/Utils/RocketPoolEncoder.sol";

contract RocketEncoder {
    function getAddressEncoding(string memory contractName) public pure returns (bytes32) {
        return RocketpoolEncoder.generateBytes32Identifier(contractName);
    }
}
