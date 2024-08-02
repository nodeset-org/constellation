// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

interface IXRETHOracle {
    /// @dev Oracle data verified using cryptographic fraud proofs.
    /// @return The total value locked in the protocol, in wei, for each minipool + rewards earned.
    function getTotalYieldAccrued() external view returns (int256);

}
