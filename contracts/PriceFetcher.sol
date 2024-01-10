//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
//import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";

import './UpgradeableBase.sol';
import './Utils/Constants.sol';

contract PriceFetcher is UpgradeableBase {
    /// @notice Returns the average price of ETH denominated in RPL with 18 decimals from 45 to 60 minutes ago
    /// @return The price of ETH denominated in RPL with 18 decimals
    function getPrice() public view returns (uint256) {
        IUniswapV3Pool pool = IUniswapV3Pool(_directory.getUniswapV3PoolAddress());
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
        uint256 price = ((uint256(sqrtPriceX96) ** 2) * 1e7) / (2 ** 192);
        return price * 1e11;
    }
}
