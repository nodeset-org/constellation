// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRocketNodeManager {
    /// @dev Allows a node to register or deregister from the smoothing pool
    /// @param _state The state to set
    function setSmoothingPoolRegistrationState(bool _state) external;

    /// @dev Returns the registration state of the smoothing pool
    /// @param _nodeAddress The node address to check
    /// @return isRegistered The registration state of the smoothing pool
    function getSmoothingPoolRegistrationState(address _nodeAddress) external view returns (bool);

    /// @notice Register a new node with Rocket Pool
    function registerNode(
        string calldata _timezoneLocation
    ) external;

    function setRPLWithdrawalAddress(
        address _nodeAddress,
        address _newRPLWithdrawalAddress,
        bool _confirm
    ) external;
}
