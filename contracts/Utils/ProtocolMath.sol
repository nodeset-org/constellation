// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "./ABDKMath64x64.sol";

import "hardhat/console.sol";

pragma solidity ^0.8.0;

library ProtocolMath {
    using ABDKMath64x64 for int128;

    uint256 public constant PRECISION = 1e18;

    // f(x) = maxValue * (e^(k*(x-1)) - e^-k) / (1 - e^-k)
    function exponentialFunction(
        uint256 x,
        uint256 k,
        uint256 maxValue
    ) internal view returns (uint256) {
        require(x <= PRECISION, "x must be less than or equal to 1e18");
        require(maxValue > 0, "maxValue must be greater than 0");
        require(k > 0, "k must be greater than 0");

        int128 _x = ABDKMath64x64.fromUInt(x);
        console.log("x");
        console.logInt(int(_x));
        console.log("--------------------");
        int128 _k = ABDKMath64x64.fromUInt(k);
        console.log("k");
        console.logInt(int(_k));
        console.log("--------------------");
        int128 _maxValue = ABDKMath64x64.fromUInt(maxValue);
        console.log("maxValue");
        console.logInt(int(_maxValue));
        console.log("--------------------");

        int128 one = ABDKMath64x64.fromUInt(PRECISION);
        console.log("one");
        console.logInt(int(one));
        console.log("--------------------");

        int128 exp_minus_k = ABDKMath64x64.exp(-_k);
        console.log("exp_minus_k");
        console.logInt(int(exp_minus_k));
        console.log("--------------------");

        int128 exp_kx_minus_one = ABDKMath64x64.exp(_k * (_x - one));
        console.log("exp_kx_minus_one");
        console.logInt(int(exp_kx_minus_one));
        console.log("--------------------");

        int128 numerator = _maxValue.mul(exp_kx_minus_one.sub(exp_minus_k));
        console.log("numerator");
        console.logInt(int(numerator));
        console.log("--------------------");

        int128 denominator = one.sub(exp_minus_k);
        console.log("denominator");
        console.logInt(int(denominator));
        console.log("--------------------");

        int128 result = numerator.div(denominator);
        console.log("result");
        console.logInt(int(result));
        console.log("--------------------");

        uint256 resultUint = SafeCast.toUint256(result);
        console.log("resultUint");
        console.logUint(resultUint);
        console.log("--------------------");

        return resultUint;
    }
}
