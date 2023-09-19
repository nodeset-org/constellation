// SPDX-License-Identifier: GPL v3

pragma solidity 0.8.17;

contract MockUniswapV3Pool {

    uint256 public sqrtPriceX96;

    constructor() {
        sqrtPriceX96 = 566508141052302349635711194631; // value from mainnet Jan-13-2023 ~51rpl/eth
    }

    function setSqrtPriceX96(uint256 _sqrtPriceX96) external {
        sqrtPriceX96 = _sqrtPriceX96;
    }

    function slot0() external view returns (uint160, int24, uint16, uint16, uint16, uint8, bool) {
        return (uint160(sqrtPriceX96), 0, 0, 0, 0, 0, false);
    }
}