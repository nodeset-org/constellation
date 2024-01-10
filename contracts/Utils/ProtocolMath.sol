// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import 'abdk-libraries-solidity/ABDKMath64x64.sol';

pragma solidity ^0.8.0;

/**
 * @title ProtocolMath
 * @notice A library for performing precise mathematical operations using 64x64 fixed-point arithmetic.
 * @dev This library provides functions for handling fixed-point numbers, allowing precise calculations
 *      with fractional values.
 */
library ProtocolMath {
    using ABDKMath64x64 for int128;

    /**
     * @dev 64x64 fixed-point representation of 1.
     */
    int128 public constant ONE = 18446744073709551616;

    /**
     * @notice Convert a ratio of two unsigned integers into a fixed-point 64x64 number.
     * @param numerator The numerator of the ratio.
     * @param denominator The denominator of the ratio.
     * @return A fixed-point 64x64 number representing the ratio.
     * @dev The resulting fixed-point number is equivalent to (numerator / denominator).
     *      Using 64x64 fixed-point arithmetic allows for precise calculations with fractional values,
     *      ensuring accuracy in financial and mathematical operations.
     */
    function fromRatio(uint256 numerator, uint256 denominator) internal pure returns (int128) {
        int128 _numerator = ABDKMath64x64.fromUInt(numerator);
        int128 _denominator = ABDKMath64x64.fromUInt(denominator);
        return ABDKMath64x64.div(_numerator, _denominator);
    }

    /**
     * @notice Calculate the value of an exponential function with parameters.
     * @param x0 The numerator part of x (input variable).
     * @param x1 The denominator part of x (input variable).
     * @param k0 The numerator part of k (exponent constant).
     * @param k1 The denominator part of k (exponent constant).
     * @param maxValue0 The numerator part of maxValue (maximum value of the function).
     * @param maxValue1 The denominator part of maxValue (maximum value of the function).
     * @return The result of the exponential function as a uint256.
     * @dev This function calculates the value of the exponential function:
     *      f(x) = maxValue * (e^(k*(x-1)) - e^-k) / (1 - e^-k)
     *      where:
     *      - x is the input variable represented as a 64x64 fixed-point number.
     *      - k is the exponent constant represented as a 64x64 fixed-point number.
     *      - maxValue is the maximum value of the function represented as a 64x64 fixed-point number.
     *      - e is Euler's number (approximately 2.71828).
     *      - The result is converted from binary fixed-point to uint256.
     *  Requirements:
     *      - x must be less than or equal to ONE (1.0 in fixed-point).
     *      - k must be greater than 0.
     */ function exponentialFunction(
        uint256 x0,
        uint256 x1,
        uint256 k0,
        uint256 k1,
        uint256 maxValue0,
        uint256 maxValue1
    ) internal pure returns (uint256) {
        int128 _x = fromRatio(x0, x1); // must be bin64 fixed point
        int128 _k = fromRatio(k0, k1); // must be bin64 fixed point
        int128 _maxValue = fromRatio(maxValue0, maxValue1); // must be bin64 fixed point

        require(_x <= ONE, 'ProtocolMath: x must be <= ONE');
        require(_k > 0, 'ProtocolMath: k must be > 0');

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
