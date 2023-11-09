// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

interface ISanctions {

    function isSanctioned(address addr) public view returns (bool);

}
