// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import '../../Operator/NodeAccount.sol';

contract MockNodeAccountV2 is SuperNodeAccount {

    function test() public pure returns(uint256) {
        return 69;
    }

}