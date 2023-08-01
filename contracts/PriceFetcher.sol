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

        uint32[] memory secondsAgos = new uint32[](1);
        secondsAgos[0] = 0;

        int56[] memory tickCumulatives;
        uint160[] memory secondsPerLiquidityCumulativeX128s;

        (tickCumulatives, secondsPerLiquidityCumulativeX128s) = pool.observe(
            secondsAgos
        );

        // Calculate the prices
        uint256 priceNow = TickMath.getSqrtRatioAtTick(currentTick);

        return priceNow;
    }
}
