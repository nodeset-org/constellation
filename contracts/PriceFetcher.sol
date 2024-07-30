//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
//import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";

import './UpgradeableBase.sol';
import './Utils/Constants.sol';

import 'hardhat/console.sol';

contract PriceFetcher is UpgradeableBase {
    /**
     * @notice Initializes the PriceFetcher contract.
     * @param _directory The address of the directory contract.
     */
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);
    }

    /**
     * @notice Returns the price of RPL ODAO
     * @return The price of RPL/ETH (number of RPL you'd receive for 1 ETH).
     */
    function getPrice() public view returns (uint256) {
        console.log('getPriceFromODAO');
        console.logAddress(address(_directory.getRocketNetworkPrices()));
        // do we use rocketNetworkSnapshots instead and pass priceKey, ..., 14?
        uint256 rplPrice = _directory.getRocketNetworkPrices().getRPLPrice();

        uint256 invertedPrice = (1 ether * 10 ** 18) / rplPrice;

        return invertedPrice;
    }
}
