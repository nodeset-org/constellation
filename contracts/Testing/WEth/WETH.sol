// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import 'hardhat/console.sol';

contract WETH is ERC20 {
    constructor() ERC20('Wrapped Ether', 'WETH') {}

    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        console.log("WITHDRAW!!");
        require(balanceOf(msg.sender) >= amount, 'Insufficient balance');
        _burn(msg.sender, amount);
        console.log("WETH: withdraw amount: %s", amount);
        console.log("Balance: %s", address(this).balance);
        console.log("Sender: %s", msg.sender);
        // console.log("Balance: %s", address(msg.sender).balance);
        if (amount > 0) {
            console.log("SEND!!");
            payable(msg.sender).transfer(amount);
        }
        console.log("YES!");
        // payable(msg.sender).transfer(amount);
    }
}
