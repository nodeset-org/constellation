// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.18;

import '../../../../../contract/dao/protocol/settings/RocketDAOProtocolSettings.sol';
import '../../../../../interface/dao/protocol/settings/RocketDAOProtocolSettingsMinipoolInterface.sol';

/// @notice Network minipool settings
contract RocketDAOProtocolSettingsMinipoolOld is RocketDAOProtocolSettings, RocketDAOProtocolSettingsMinipoolInterface {
    uint256 constant minipoolUserDistributeWindowStart = 90 days;

    constructor(
        RocketStorageInterface _rocketStorageAddress
    ) RocketDAOProtocolSettings(_rocketStorageAddress, 'minipool') {
        // Set version
        version = 3;
        // Initialize settings on deployment
        if (!getBool(keccak256(abi.encodePacked(settingNameSpace, 'deployed')))) {
            // Apply settings
            setSettingBool('minipool.submit.withdrawable.enabled', false);
            setSettingBool('minipool.bond.reduction.enabled', false);
            setSettingUint('minipool.launch.timeout', 72 hours);
            setSettingUint('minipool.maximum.count', 14);
            setSettingUint('minipool.user.distribute.window.length', 2 days);
            // Settings initialised
            setBool(keccak256(abi.encodePacked(settingNameSpace, 'deployed')), true);
        }
    }

    /// @notice Update a setting, overrides inherited setting method with extra checks for this contract
    /// @param _settingPath The path of the setting within this contract's namespace
    /// @param _value The value to set it to
    function setSettingUint(string memory _settingPath, uint256 _value) public override onlyDAOProtocolProposal {
        // Some safety guards for certain settings
        if (getBool(keccak256(abi.encodePacked(settingNameSpace, 'deployed')))) {
            bytes32 settingKey = keccak256(abi.encodePacked(_settingPath));
            if (settingKey == keccak256(abi.encodePacked('minipool.launch.timeout'))) {
                // >= 12 hours (RPIP-33)
                require(_value >= 12 hours, 'Launch timeout must be greater than 12 hours');
            }
        }
        // Update setting now
        setUint(keccak256(abi.encodePacked(settingNameSpace, _settingPath)), _value);
    }

    /// @notice Returns the balance required to launch minipool
    function getLaunchBalance() public pure override returns (uint256) {
        return 32 ether;
    }

    /// @notice Returns the value required to pre-launch a minipool
    function getPreLaunchValue() public pure override returns (uint256) {
        return 1 ether;
    }

    /// @notice Returns the deposit amount for a given deposit type (only used for legacy minipool types)
    function getDepositUserAmount(MinipoolDeposit _depositType) external pure override returns (uint256) {
        if (_depositType == MinipoolDeposit.Full) {
            return getFullDepositUserAmount();
        }
        if (_depositType == MinipoolDeposit.Half) {
            return getHalfDepositUserAmount();
        }
        return 0;
    }

    /// @notice Returns the user amount for a "Full" deposit minipool
    function getFullDepositUserAmount() public pure override returns (uint256) {
        return getLaunchBalance() / 2;
    }

    /// @notice Returns the user amount for a "Half" deposit minipool
    function getHalfDepositUserAmount() public pure override returns (uint256) {
        return getLaunchBalance() / 2;
    }

    /// @notice Returns the amount a "Variable" minipool requires to move to staking status
    function getVariableDepositAmount() public pure override returns (uint256) {
        return getLaunchBalance() - getPreLaunchValue();
    }

    /// @notice Submit minipool withdrawable events currently enabled (trusted nodes only)
    function getSubmitWithdrawableEnabled() external view override returns (bool) {
        return getSettingBool('minipool.submit.withdrawable.enabled');
    }

    /// @notice Returns true if bond reductions are currentl enabled
    function getBondReductionEnabled() external view override returns (bool) {
        return getSettingBool('minipool.bond.reduction.enabled');
    }

    /// @notice Returns the timeout period in seconds for prelaunch minipools to launch
    function getLaunchTimeout() external view override returns (uint256) {
        return getSettingUint('minipool.launch.timeout');
    }

    /// @notice Returns the maximum number of minipools allowed at one time
    function getMaximumCount() external view override returns (uint256) {
        return getSettingUint('minipool.maximum.count');
    }

    /// @notice Returns true if the given time is within the user distribute window
    function isWithinUserDistributeWindow(uint256 _time) external view override returns (bool) {
        uint256 start = getUserDistributeWindowStart();
        uint256 length = getUserDistributeWindowLength();
        return (_time >= start && _time < (start + length));
    }

    /// @notice Returns true if the given time has passed the distribute window
    function hasUserDistributeWindowPassed(uint256 _time) external view override returns (bool) {
        uint256 start = getUserDistributeWindowStart();
        uint256 length = getUserDistributeWindowLength();
        return _time >= start + length;
    }

    /// @notice Returns the start of the user distribute window
    function getUserDistributeWindowStart() public pure override returns (uint256) {
        return minipoolUserDistributeWindowStart;
    }

    /// @notice Returns the length of the user distribute window
    function getUserDistributeWindowLength() public view override returns (uint256) {
        return getSettingUint('minipool.user.distribute.window.length');
    }
}