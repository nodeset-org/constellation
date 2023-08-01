//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import "./UpgradeableBase.sol";

contract PriceFetcher is UpgradeableBase {

    constructor() initializer {}

    function getPrice() public view returns (uint256) {
        IUniswapV3Pool pool = IUniswapV3Pool(
            getDirectory().UNISWAP_RPL_ETH_POOL_ADDRESS()
        );
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
        // convert to price in terms of token0/token1 (ETH/RPL) and adjust for decimals
        uint256 price = ((uint256(sqrtPriceX96) * sqrtPriceX96) >> 96) >> 96;
        return price;
    }
}
