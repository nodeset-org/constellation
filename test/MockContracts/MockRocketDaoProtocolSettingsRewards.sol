// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockRocketDaoProtocolSettingsRewards {
    uint256 claimTimeInterval;

    function getRewardsClaimIntervalTime() public view returns (uint256) {
        return claimTimeInterval;
    }

    function setRewardsClaimIntervalTime(uint256 _claimTimeInterval) public {
        claimTimeInterval = _claimTimeInterval;
    }
}