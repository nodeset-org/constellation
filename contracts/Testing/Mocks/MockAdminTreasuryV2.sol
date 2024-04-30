// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import '../../AdminTreasury.sol';

contract MockAdminTreasuryV2 is AdminTreasury {

    function test() public pure returns(uint256) {
        return 69;
    }

}