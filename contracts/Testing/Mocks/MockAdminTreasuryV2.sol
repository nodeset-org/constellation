// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import '../../External/Treasury.sol';

contract MockTreasuryV2 is Treasury {

    function test() public pure returns(uint256) {
        return 69;
    }

}