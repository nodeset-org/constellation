// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IConstellationMinipoolsOracle {

    /// @notice do not on-chain for-loop over this array as it will be too expensive
    /// @return array of minipool addresses
    function getNodesetBackedMinipools()
        external
        view
        returns (address[] memory);

    /// @notice admin server should call this function when a minipool reaches the required conditions
    /// @param miniPool The minipool address to add
    function addMiniPool(address miniPool) external;

    /// @notice admin server should call this function when a minipool no longer meets the required conditions
    /// @param miniPool The minipool address to remove
    function removeMiniPool(address miniPool) external;

    /// @notice oracle data does not do smoothing pool registration check
    /// @param miniPool The minipool address to check
    /// @return isRegistered returns true if the minipool has withdrawal address set to our DP, is not slashed, past scrubbing period (aka is reimbersable).
    function hasMinipool(address miniPool) external view returns (bool);
}
