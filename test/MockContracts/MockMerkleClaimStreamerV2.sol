// SPDX-License-Identifier: GPL v3

import 'contracts/Constellation/MerkleClaimStreamer.sol';
import 'test/MockContracts/MockV2Logic.sol';

pragma solidity 0.8.17;

contract MockMerkleClaimStreamerV2 is MerkleClaimStreamer, MockV2Logic {
}
