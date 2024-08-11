// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

interface IConstellationOracle {

    /// @dev This takes into account the validator and minipool contract balances and outstanding merkle rewards AFTER fees and WITHOUT bonds
    /// @return All the ETH outside the view of the protocol contracts which is attributable to xrETH
    function getOutstandingEthYield() external view returns (int256);

    /// @dev This takes into account the outstanding merkle rewards AFTER fees. Unlike the corresponding ETH value,
    /// it can't be negative because there's no way for outstanding RPL rewards to be negative; all RPL penalties
    /// are immediately applied to the node.
    /// @return All the RPL outside the view of the protocol contracts which is attributable to xRPL
    function getOutstandingRplYield() external view returns (uint256);
}
