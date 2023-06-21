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

    function distributeBalance() external;
}
