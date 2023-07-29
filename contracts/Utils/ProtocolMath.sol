// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "./ABDKMath64x64.sol";

pragma solidity ^0.8.0;

library ProtocolMath {
    using ABDKMath64x64 for int128;

    int128 public constant ONE = 18446744073709551616;

    function fromRatio(uint256 numerator, uint256 denominator)
        internal
        pure
        returns (int128)
    {
        int128 _numerator = ABDKMath64x64.fromUInt(numerator);
        int128 _denominator = ABDKMath64x64.fromUInt(denominator);
        return ABDKMath64x64.div(_numerator, _denominator);
    }


    // f(x) = maxValue * (e^(k*(x-1)) - e^-k) / (1 - e^-k)
    function exponentialFunction(
        uint256 x0,
        uint256 x1,
        uint256 k0,
        uint256 k1,
        uint256 maxValue0,
        uint256 maxValue1
    ) internal view returns (uint256) {


        int128 _x = fromRatio(x0, x1); // must be bin64 fixed point
        int128 _k = fromRatio(k0, k1); // must be bin64 fixed point
        int128 _maxValue = fromRatio(maxValue0, maxValue1); // must be bin64 fixed point

        require(_x <= ONE, "ProtocolMath: x must be <= ONE");
        require(_k > 0, "ProtocolMath: k must be > 0");

        int128 exp_minus_k = ABDKMath64x64.exp(-_k);
        int128 exp_kx_minus_one = ABDKMath64x64.exp(_k.mul(_x.sub(ONE)));
        int128 numerator = _maxValue.mul(exp_kx_minus_one.sub(exp_minus_k));
        int128 denominator = ONE.sub(exp_minus_k);
        int128 result = numerator.div(denominator);
        // Convert from binary fixed point to uint256
        uint256 resultUint = ABDKMath64x64.mulu(result, 1e18);
        return resultUint;
    }
}
