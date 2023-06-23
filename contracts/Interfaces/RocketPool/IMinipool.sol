// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

enum MinipoolStatus {
    Initialised, // The minipool has been initialised and is awaiting a deposit of user ETH
    Prelaunch, // The minipool has enough ETH to begin staking and is awaiting launch by the node operator
    Staking, // The minipool is currently staking
    Withdrawable, // NO LONGER USED
    Dissolved // The minipool has been dissolved and its user deposited ETH has been returned to the deposit pool
}

interface IMinipool {
    function getNodeAddress() external view returns (address);

    function getStatus() external view returns (MinipoolStatus);

    function getPreLaunchValue() external view returns (uint256);

    function getNodeDepositBalance() external view returns (uint256);

    function getUserDepositBalance() external view returns (uint256);

    /// @notice Distributes the contract's balance.
    ///         If balance is greater or equal to 8 ETH, the NO can call to distribute capital and finalise the minipool.
    ///         If balance is greater or equal to 8 ETH, users who have called `beginUserDistribute` and waited the required
    ///         amount of time can call to distribute capital.
    ///         If balance is lower than 8 ETH, can be called by anyone and is considered a partial withdrawal and funds are
    ///         split as rewards.
    /// @param _rewardsOnly If set to true, will revert if balance is not being treated as rewards
    function distributeBalance(bool _rewardsOnly) external;

    /// @notice Returns true if enough time has passed for a user to distribute
    function userDistributeAllowed() external view returns (bool);

    /// @notice Allows a user (other than the owner of this minipool) to signal they want to call distribute.
    ///         After waiting the required period, anyone may then call `distributeBalance()`.
    function beginUserDistribute() external;
}
