//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '../../Constellation/Utils/UpgradeableBase.sol';

contract MockPriceFetcher is UpgradeableBase {
    uint256 public price;

    function getPrice() public view returns (uint256) {
        return price;
    }

    function setPrice(uint256 _price) public {
        price = _price;
    }
}
