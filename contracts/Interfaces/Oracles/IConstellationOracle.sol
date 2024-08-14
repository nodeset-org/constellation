// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

interface IConstellationOracle {
    /// @dev Oracle data for yield accrued on the beacon chain.
    /// @return The sum of total beacon rewards/penalties earned, in wei, for each minipool in the protocol.
    function getTotalYieldAccrued() external view returns (int256);

    function getLastUpdatedTotalYieldAccrued() external view returns (uint256);

}
