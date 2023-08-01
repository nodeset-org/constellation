//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./UpgradeableBase.sol";

contract PriceFetcher is UpgradeableBase {
    constructor() initializer {}

    function getSqrtPriceX96() public view returns (uint160) {
        IUniswapV3Pool pool = IUniswapV3Pool(
            getDirectory().UNISWAP_RPL_ETH_POOL_ADDRESS()
        );
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
        return sqrtPriceX96;
    }

    function getPrice() public view returns (uint256 price) {
        uint160 sqrtPriceX96 = getSqrtPriceX96();
        uint256 sqrtPriceX128 = uint256(sqrtPriceX96) << 64;

        // Split sqrtPriceX128 into high bits and low bits
        uint256 high = sqrtPriceX128 >> 128;
        uint256 low = sqrtPriceX128 & ((1 << 128) - 1);

        // Multiply high bits by high bits, low bits by low bits, and 2 * high bits by low bits
        uint256 high2 = high * high;
        uint256 low2 = low * low;
        uint256 mix = high * low * 2;

        // Add high2, mix, and low2 shifted appropriately
        price = (high2 << 128) + mix + (low2 >> 128);

        return price;
    }
}
