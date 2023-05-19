// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

contract MockRETHOracle {

    uint private _price = 1.0719 ether;

    function setPrice(uint price) public {
        _price = price;
    }

    function getPrice() public view returns (uint) {
        return _price;
    }
}