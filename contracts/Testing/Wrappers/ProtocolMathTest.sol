// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../Utils/ProtocolMath.sol";

contract ProtocolMathTest {

    function testRatio(uint256 value) public pure returns (int128) {
        return ProtocolMath.fromRatio(value);
    }

    function test(uint256 x, uint256 k, uint256 maxValue) public view returns (uint256) {
        return ProtocolMath.exponentialFunction(x, k, maxValue);
    }
}