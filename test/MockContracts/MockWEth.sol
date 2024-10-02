// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MockWEth is ERC20, Ownable {
    mapping(address => uint256) balances;

    constructor() ERC20("MockWeth", "WETH") {}

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) external {
        balances[msg.sender] -= _amount;
    }

    function transfer(address _to, uint256 _amount) public override returns (bool) {
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        return true;
    }

    function balanceOf(address _account) public view override returns (uint256) {
        return balances[_account];
    }
}