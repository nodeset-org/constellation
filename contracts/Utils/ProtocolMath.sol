// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

pragma solidity ^8.0.0;

library ProtocolMath {
    using SafeMath for uint256;

    uint256 private constant PRECISION = 1e18;

     function exponentialFunction(uint256 x, uint256 maxValue, uint256 k) external pure returns (uint256) {
        require(x <= PRECISION, "x must be less than or equal to 1e18");
        require(maxValue > 0, "maxValue must be greater than 0");
        require(k > 0, "k must be greater than 0");

        uint256 _x = x.mul(k).div(PRECISION).sub(k);
        uint256 _numerator = PRECISION.exp(_x).sub(PRECISION.exp(0).neg());
        uint256 _denominator = PRECISION.sub(PRECISION.exp(0).neg());

        return maxValue.mul(_numerator).div(_denominator);
    }
    
}