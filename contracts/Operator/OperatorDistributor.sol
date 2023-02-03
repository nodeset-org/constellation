// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.9;

import "../Base.sol";
import "../Whitelist/Whitelist.sol";
import "hardhat/console.sol";


contract OperatorDistributor is Base {

    uint private _queuedEth;

    constructor(address directory) Base(directory) {}

    receive() external payable {
        addToQueue(msg.value);
    }

    //function addToQueue(uint value) private {
    function addToQueue(uint value) public {
        _queuedEth += value;
    }

    function reimburseNodeForMinipool(address newMinipoolAdress) public {
        /**
         * - must have withdrawal address set to our DP
         * - must be in smoothing pool
         * - NO is reimbursed from staging balance
         */
    }

    // function getOperatorValidatorNumTarget() public view returns (uint) {
    //     return (balanceOf(this) % Whitelist(getDirectory().getWhitelistAddress()))
    // }

}