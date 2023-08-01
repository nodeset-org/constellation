//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "./UpgradeableBase.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "./TickMath.sol";

contract PriceFetcher is UpgradeableBase {
    function getPrice() public view returns (uint256) {
        IUniswapV3Pool pool = IUniswapV3Pool(
            getDirectory().UNISWAP_RPL_ETH_POOL_ADDRESS()
        );
        (, int24 currentTick, , , , , ) = pool.slot0();

        // Calculate the prices
        uint160 sqrtPriceX96 = TickMath.getSqrtRatioAtTick(currentTick);
        uint256 priceNow = uint256(sqrtPriceX96) / (1 << 48); // Here is the fix
        return priceNow;
    }
}
