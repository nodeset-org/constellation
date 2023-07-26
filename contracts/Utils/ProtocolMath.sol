// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "./ABDKMath64x64.sol";

pragma solidity ^0.8.0;

library ProtocolMath {
    using ABDKMath64x64 for int128;

    uint256 public constant PRECISION = 1e18;

    // f(x) = maxValue * (e^(k*(x-1)) - e^-k) / (1 - e^-k)
    function exponentialFunction(
        uint256 x,
        uint256 k,
        uint256 maxValue
    ) internal pure returns (uint256) {
        require(x <= PRECISION, "x must be less than or equal to 1e18");
        require(maxValue > 0, "maxValue must be greater than 0");
        require(k > 0, "k must be greater than 0");

        int128 _x = ABDKMath64x64.fromUInt(x);
        int128 _k = ABDKMath64x64.fromUInt(k);
        int128 _maxValue = ABDKMath64x64.fromUInt(maxValue);

        int128 one = ABDKMath64x64.fromUInt(PRECISION);
        int128 exp_minus_k = ABDKMath64x64.exp(-_k);
        int128 exp_kx_minus_one = ABDKMath64x64.exp(_k * (_x - one));

        int128 numerator = _maxValue.mul(exp_kx_minus_one.sub(exp_minus_k));
        int128 denominator = one.sub(exp_minus_k);
        return SafeCast.toUint256(numerator.div(denominator));
    }
}
