// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRocketNodeManager {
    /// @dev Allows a node to register or deregister from the smoothing pool
    /// @param _state The state to set
    /// @return isRegistered The new registration state of the smoothing pool
    function setSmoothingPoolRegistrationState(
        bool _state
    ) external returns (bool);

    /// @dev Returns the registration state of the smoothing pool
    /// @param _nodeAddress The node address to check
    /// @return isRegistered The registration state of the smoothing pool
    function getSmoothingPoolRegistrationState(
        address _nodeAddress
    ) external view returns (bool);
}
