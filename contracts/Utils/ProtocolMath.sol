// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "./ABDKMath64x64.sol";

pragma solidity ^0.8.0;

library ProtocolMath {
    using ABDKMath64x64 for int128;

    uint256 public constant PRECISION = 1e18;

    function fromRatio(uint256 value) internal pure returns (int128) {
        int128 _value = ABDKMath64x64.fromUInt(value);
        int128 one = ABDKMath64x64.fromUInt(PRECISION);
        return ABDKMath64x64.div(_value, one);
    }

    // f(x) = maxValue * (e^(k*(x-1)) - e^-k) / (1 - e^-k)
    function exponentialFunction(
        uint256 x, // must be value between 0 and 1e18
        uint256 k,
        uint256 maxValue
    ) internal view returns (uint256) {

        require(x <= PRECISION, "ProtocolMath: x must be <= PRECISION");
        require(k > 0, "ProtocolMath: k must be > 0");

        int128 _x = fromRatio(x); // must be bin64 fixed point
        int128 _k = ABDKMath64x64.fromUInt(k);
        int128 _maxValue = ABDKMath64x64.fromUInt(maxValue);
        int128 exp_minus_k = ABDKMath64x64.exp(-_k);
        int128 one = ABDKMath64x64.fromUInt(uint256(1));
        int128 exp_kx_minus_one = ABDKMath64x64.exp(_k.mul(_x.sub(one)));
        int128 numerator = _maxValue.mul(exp_kx_minus_one.sub(exp_minus_k));
        int128 denominator = one.sub(exp_minus_k);
        int128 result = numerator.div(denominator);
        // Convert from binary fixed point to uint256
        uint256 resultUint = ABDKMath64x64.mulu(result, 1e18);
        return resultUint;
    }
}
