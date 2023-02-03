// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.9;

import "../ProxyBase.sol";

contract WhitelistProxy is ProxyBase {

    constructor (address directory, address delgateAddress) ProxyBase(directory, delgateAddress) {}

}