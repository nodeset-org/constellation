pragma solidity 0.7.6;
pragma abicoder v2;

// SPDX-License-Identifier: GPL-3.0-only

import '../../../../contract/RocketBase.sol';
import '../../../interface/dao/protocol/RocketDAOProtocolInterfaceOld.sol';
import '../../../interface/dao/protocol/RocketDAOProtocolProposalsInterfaceOld.sol';
import '../../../../interface/dao/protocol/settings/RocketDAOProtocolSettingsInterface.sol';
import '../../../interface/dao/protocol/settings/RocketDAOProtocolSettingsRewardsInterfaceOld.sol';
import '../../../../interface/rewards/claims/RocketClaimDAOInterface.sol';
import '../../../../types/SettingType.sol';

import 'oz-contracts-3-4-0/math/SafeMath.sol';

// The protocol DAO Proposals - Placeholder contracts until DAO is implemented
contract RocketDAOProtocolProposalsOld is RocketBase, RocketDAOProtocolProposalsInterfaceOld {
    using SafeMath for uint;

    // The namespace for any data stored in the trusted node DAO (do not change)
    string constant daoNameSpace = 'dao.protocol.';

    // Only allow certain contracts to execute methods
    modifier onlyExecutingContracts() {
        // Methods are either executed by bootstrapping methods in rocketDAONodeTrusted or by people executing passed proposals in rocketDAOProposal
        require(
            msg.sender == getContractAddress('rocketDAOProtocol') ||
                msg.sender == getContractAddress('rocketDAOProposal'),
            'Sender is not permitted to access executing methods'
        );
        _;
    }

    // Construct
    constructor(RocketStorageInterface _rocketStorageAddress) RocketBase(_rocketStorageAddress) {
        // Version
        version = 1;
    }

    /*** Proposals **********************/

    // Set multiple settings in one proposal
    function proposalSettingMulti(
        string[] memory _settingContractNames,
        string[] memory _settingPaths,
        SettingType[] memory _types,
        bytes[] memory _data
    ) external override onlyExecutingContracts {
        // Check lengths of all arguments are the same
        require(
            _settingContractNames.length == _settingPaths.length &&
                _settingPaths.length == _types.length &&
                _types.length == _data.length,
            'Invalid parameters supplied'
        );
        // Loop through settings
        for (uint256 i = 0; i < _settingContractNames.length; i++) {
            if (_types[i] == SettingType.UINT256) {
                uint256 value = abi.decode(_data[i], (uint256));
                proposalSettingUint(_settingContractNames[i], _settingPaths[i], value);
            } else if (_types[i] == SettingType.BOOL) {
                bool value = abi.decode(_data[i], (bool));
                proposalSettingBool(_settingContractNames[i], _settingPaths[i], value);
            } else if (_types[i] == SettingType.ADDRESS) {
                address value = abi.decode(_data[i], (address));
                proposalSettingAddress(_settingContractNames[i], _settingPaths[i], value);
            } else {
                revert('Invalid setting type');
            }
        }
    }

    // Change one of the current uint256 settings of the protocol DAO
    function proposalSettingUint(
        string memory _settingContractName,
        string memory _settingPath,
        uint256 _value
    ) public override onlyExecutingContracts {
        // Load contracts
        RocketDAOProtocolSettingsInterface rocketDAOProtocolSettings = RocketDAOProtocolSettingsInterface(
            getContractAddress(_settingContractName)
        );
        // Lets update
        rocketDAOProtocolSettings.setSettingUint(_settingPath, _value);
    }

    // Change one of the current bool settings of the protocol DAO
    function proposalSettingBool(
        string memory _settingContractName,
        string memory _settingPath,
        bool _value
    ) public override onlyExecutingContracts {
        // Load contracts
        RocketDAOProtocolSettingsInterface rocketDAOProtocolSettings = RocketDAOProtocolSettingsInterface(
            getContractAddress(_settingContractName)
        );
        // Lets update
        rocketDAOProtocolSettings.setSettingBool(_settingPath, _value);
    }

    // Change one of the current address settings of the protocol DAO
    function proposalSettingAddress(
        string memory _settingContractName,
        string memory _settingPath,
        address _value
    ) public override onlyExecutingContracts {
        // Load contracts
        RocketDAOProtocolSettingsInterface rocketDAOProtocolSettings = RocketDAOProtocolSettingsInterface(
            getContractAddress(_settingContractName)
        );
        // Lets update
        rocketDAOProtocolSettings.setSettingAddress(_settingPath, _value);
    }

    // Update a claimer for the rpl rewards, must specify a unique contract name that will be claiming from and a percentage of the rewards
    function proposalSettingRewardsClaimer(
        string memory _contractName,
        uint256 _perc
    ) external override onlyExecutingContracts {
        // Load contracts
        RocketDAOProtocolSettingsRewardsInterfaceOld rocketDAOProtocolSettingsRewards = RocketDAOProtocolSettingsRewardsInterfaceOld(
                getContractAddress('rocketDAOProtocolSettingsRewards')
            );
        // Update now
        rocketDAOProtocolSettingsRewards.setSettingRewardsClaimer(_contractName, _perc);
    }

    // Spend RPL from the DAO's treasury
    function proposalSpendTreasury(
        string memory _invoiceID,
        address _recipientAddress,
        uint256 _amount
    ) external override onlyExecutingContracts {
        // Load contracts
        RocketClaimDAOInterface rocketDAOTreasury = RocketClaimDAOInterface(getContractAddress('rocketClaimDAO'));
        // Update now
        rocketDAOTreasury.spend(_invoiceID, _recipientAddress, _amount);
    }
}