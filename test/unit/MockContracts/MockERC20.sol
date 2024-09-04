// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockErc20Constellation {
    mapping(address => uint256) public balances;

    function balanceOf(address _addr) public view returns (uint256) {
        return balances[_addr];
    }
}