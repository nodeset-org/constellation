pragma solidity 0.7.6;

// SPDX-License-Identifier: GPL-3.0-only

import '../../../../../contract/dao/protocol/settings/RocketDAOProtocolSettings.sol';
import '../../../../interface/dao/protocol/settings/RocketDAOProtocolSettingsNetworkInterfaceOld.sol';

// Network auction settings

contract RocketDAOProtocolSettingsNetworkOld is
    RocketDAOProtocolSettings,
    RocketDAOProtocolSettingsNetworkInterfaceOld
{
    // Construct
    constructor(
        RocketStorageInterface _rocketStorageAddress
    ) RocketDAOProtocolSettings(_rocketStorageAddress, 'network') {
        // Set version
        version = 2;
        // Initialize settings on deployment
        if (!getBool(keccak256(abi.encodePacked(settingNameSpace, 'deployed')))) {
            // Apply settings
            setSettingUint('network.consensus.threshold', 0.51 ether); // 51%
            setSettingBool('network.submit.balances.enabled', true);
            setSettingUint('network.submit.balances.frequency', 5760); // ~24 hours
            setSettingBool('network.submit.prices.enabled', true);
            setSettingUint('network.submit.prices.frequency', 5760); // ~24 hours
            setSettingUint('network.node.fee.minimum', 0.15 ether); // 15%
            setSettingUint('network.node.fee.target', 0.15 ether); // 15%
            setSettingUint('network.node.fee.maximum', 0.15 ether); // 15%
            setSettingUint('network.node.fee.demand.range', 160 ether);
            setSettingUint('network.reth.collateral.target', 0.1 ether);
            setSettingUint('network.penalty.threshold', 0.51 ether); // Consensus for penalties requires 51% vote
            setSettingUint('network.penalty.per.rate', 0.1 ether); // 10% per penalty
            setSettingBool('network.submit.rewards.enabled', true); // Enable reward submission
            // Settings initialised
            setBool(keccak256(abi.encodePacked(settingNameSpace, 'deployed')), true);
        }
    }

    // Update a setting, overrides inherited setting method with extra checks for this contract
    function setSettingUint(string memory _settingPath, uint256 _value) public override onlyDAOProtocolProposal {
        // Some safety guards for certain settings
        // Prevent DAO from setting the withdraw delay greater than ~24 hours
        if (keccak256(bytes(_settingPath)) == keccak256(bytes('network.reth.deposit.delay'))) {
            // Must be a future timestamp
            require(_value <= 5760, 'rETH deposit delay cannot exceed 5760 blocks');
        }
        // Update setting now
        setUint(keccak256(abi.encodePacked(settingNameSpace, _settingPath)), _value);
    }

    // The threshold of trusted nodes that must reach consensus on oracle data to commit it
    function getNodeConsensusThreshold() external view override returns (uint256) {
        return getSettingUint('network.consensus.threshold');
    }

    // The threshold of trusted nodes that must reach consensus on a penalty
    function getNodePenaltyThreshold() external view override returns (uint256) {
        return getSettingUint('network.penalty.threshold');
    }

    // The amount to penalise a minipool for each feeDistributor infraction
    function getPerPenaltyRate() external view override returns (uint256) {
        return getSettingUint('network.penalty.per.rate');
    }

    // Submit balances currently enabled (trusted nodes only)
    function getSubmitBalancesEnabled() external view override returns (bool) {
        return getSettingBool('network.submit.balances.enabled');
    }

    // The frequency in blocks at which network balances should be submitted by trusted nodes
    function getSubmitBalancesFrequency() external view override returns (uint256) {
        return getSettingUint('network.submit.balances.frequency');
    }

    // Submit prices currently enabled (trusted nodes only)
    function getSubmitPricesEnabled() external view override returns (bool) {
        return getSettingBool('network.submit.prices.enabled');
    }

    // The frequency in blocks at which network prices should be submitted by trusted nodes
    function getSubmitPricesFrequency() external view override returns (uint256) {
        return getSettingUint('network.submit.prices.frequency');
    }

    // The minimum node commission rate as a fraction of 1 ether
    function getMinimumNodeFee() external view override returns (uint256) {
        return getSettingUint('network.node.fee.minimum');
    }

    // The target node commission rate as a fraction of 1 ether
    function getTargetNodeFee() external view override returns (uint256) {
        return getSettingUint('network.node.fee.target');
    }

    // The maximum node commission rate as a fraction of 1 ether
    function getMaximumNodeFee() external view override returns (uint256) {
        return getSettingUint('network.node.fee.maximum');
    }

    // The range of node demand values to base fee calculations on (from negative to positive value)
    function getNodeFeeDemandRange() external view override returns (uint256) {
        return getSettingUint('network.node.fee.demand.range');
    }

    // Target rETH collateralization rate as a fraction of 1 ether
    function getTargetRethCollateralRate() external view override returns (uint256) {
        return getSettingUint('network.reth.collateral.target');
    }

    // rETH withdraw delay in blocks
    function getRethDepositDelay() external view override returns (uint256) {
        return getSettingUint('network.reth.deposit.delay');
    }

    // Submit reward snapshots currently enabled (trusted nodes only)
    function getSubmitRewardsEnabled() external view override returns (bool) {
        return getSettingBool('network.submit.rewards.enabled');
    }
}
