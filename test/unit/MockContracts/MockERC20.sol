// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import 'hardhat/console.sol';
contract MockErc20Constellation is ERC20{
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor() ERC20("MockRPL", "RPL") {}

    function setBalance(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
}