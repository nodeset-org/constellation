// SPDX-License-Identifier: GPL v3


pragma solidity 0.8.17;

contract MockV2Logic {
    event Foo();

    function testUpgrade() public pure returns (uint) {
        return 0;
    }

    function testPublicFunction() public {
        emit Foo();
    }
}
