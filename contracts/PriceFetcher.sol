//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";

import "./UpgradeableBase.sol";
import "hardhat/console.sol";

contract PriceFetcher is UpgradeableBase {

    using ABDKMath64x64 for int128;

    function getPrice() public view returns (uint256) {
        IUniswapV3Pool pool = IUniswapV3Pool(
            getDirectory().UNISWAP_RPL_ETH_POOL_ADDRESS()
        );
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();

        uint256 price = (uint256(sqrtPriceX96)**2) * 1e10 / (2 ** 192);
        return price * 1e8;

    }
}
