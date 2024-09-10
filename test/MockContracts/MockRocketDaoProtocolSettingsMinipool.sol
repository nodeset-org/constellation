// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockRocketDaoProtocolSettingsMinipool {
    uint256 launchBalance;

    function getLaunchBalance() public view returns (uint256) {
        return launchBalance;
    }

    function setLaunchBalance(uint256 _launchBalance) public {
        launchBalance = _launchBalance;
    }
}