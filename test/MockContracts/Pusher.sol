// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './MockERC20.sol';

contract Pusher {
    address public rplToken;

    function setRplToken(address _rplToken) public {
        rplToken = _rplToken;
    }

    function sendEther(address payable recipient) public {
        (bool success, ) = recipient.call{value: address(this).balance}("");
        require(success, "Ether transfer failed");
    }

    function sendRpl(address payable recipient) public {
        bool success =  MockErc20(rplToken).transfer(recipient, MockErc20(rplToken).balanceOf(address(this)));
        require(success, "RPL transfer failed");
    }

    receive() external payable {}
}