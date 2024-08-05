// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface IRocketDAOProtocolSettingsMinipool {
    function getLaunchBalance() external view returns (uint256);
    function getPreLaunchValue() external pure returns (uint256);
}