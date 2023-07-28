// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../Utils/ProtocolMath.sol";

contract ProtocolMathTest {
    function test(uint256 x, uint256 k, uint256 maxValue) public view returns (uint256) {
        return ProtocolMath.exponentialFunction(x, k, maxValue);
    }
}