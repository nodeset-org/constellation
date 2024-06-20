pragma solidity >0.5.0 <0.9.0;

import './RocketTypes.sol';

// SPDX-License-Identifier: GPL-3.0-only

interface IRocketDAOProtocolSettingsRewards {
    function getRewardsClaimIntervalTime() external view returns (uint256);
}
