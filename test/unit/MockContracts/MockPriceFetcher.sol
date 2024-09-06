// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockPriceFetcherConstellation {
    uint256 price;
    function setPrice(uint256 _price) public {
        price = _price;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }
}