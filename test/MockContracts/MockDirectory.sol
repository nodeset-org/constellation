// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockDirectory {
    address rocketMinipoolManager;
    address whitelist;
    address operatorDistributor;
    address rocketNodeStaking;
    address rocketDaoProtocolSettingsMinipool;
    address rplAddress;
    address wethVaultAddress;
    address rocketNodeDepositAddress;
    address priceFetcherAddress;
    address superNodeAddress;
    address wethAddress;
    address rocketDaoProtocolSettingsRewardsAddress;
    address rplVaultAddress;
    address rocketDaoProtocolSettingsMinipoolAddress;
    address treasuryAddress;
    address operatorReward;
    address rocketDepositPoolAddress;
    address merkleClaimStreamerAddress;
    address oracleAddress;

    mapping(bytes32 => mapping(address => bool)) private roles;
    bool public isSanctionedBool;

    function getRocketMinipoolManagerAddress() public view returns (address) {
        return rocketMinipoolManager;
    }

    function setRocketMinipoolManagerAddress(address _rocketMinipoolManager) public {
        rocketMinipoolManager = _rocketMinipoolManager;
    }

    function getWhitelistAddress() public view returns (address) {
        return whitelist;
    }

    function setWhitelistAddress(address _whitelist) public {
        whitelist = _whitelist;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return roles[role][account];
    }

    function setRole(bytes32 role, address account, bool value) public {
        roles[role][account] = value;
    }

    function getOperatorDistributorAddress() public view returns (address) {
        return operatorDistributor;
    }

    function setOperatorDistributorAddress(address _operatorDistributor) public {
        operatorDistributor = _operatorDistributor;
    }

    function getRocketNodeStakingAddress() public view returns (address) {
        return rocketNodeStaking;
    }

    function setRocketNodeStakingAddress(address _rocketNodeStaking) public {
        rocketNodeStaking = _rocketNodeStaking;
    }

    function getRocketDAOProtocolSettingsMinipool() public view returns (address) {
        return rocketDaoProtocolSettingsMinipool;
    }

    function setRocketDAOProtocolSettingsMinipoolAddress(address _rocketDaoProtocolSettingsMinipool) public {
        rocketDaoProtocolSettingsMinipool = _rocketDaoProtocolSettingsMinipool;
    }

    function getRPLAddress() public view returns (address) {
        return rplAddress;
    }

    function setRPLAddress(address _rplAddress) public {
        rplAddress = _rplAddress;
    }

    function setRPLVaultAddress(address _rplVaultAddress) public {
        rplVaultAddress = _rplVaultAddress;
    }

    function getRPLVaultAddress() public view returns (address) {
        return rplVaultAddress;
    }

    function getWETHVaultAddress() public view returns (address) {
        return wethVaultAddress;
    }

    function setWETHVaultAddress(address _wethVaultAddress) public {
        wethVaultAddress = _wethVaultAddress;
    }


    function getRocketNodeDepositAddress() public view returns (address) {
        return rocketNodeDepositAddress;
    }

    function setRocketNodeDepositAddress(address _rocketNodeDepositAddress) public {
        rocketNodeDepositAddress = _rocketNodeDepositAddress;
    }

    function getPriceFetcherAddress() public view returns (address) {
        return priceFetcherAddress;
    }

    function setPriceFetcherAddress(address _priceFetcherAddress) public {
        priceFetcherAddress = _priceFetcherAddress;
    }

    function getSuperNodeAddress() public view returns (address) {
        return superNodeAddress;
    }

    function setSuperNodeAddress(address _superNodeAddress) public {
        superNodeAddress = _superNodeAddress;
    }

    function getRocketDAOProtocolSettingsRewardsAddress() public view returns (address) {
        return rocketDaoProtocolSettingsRewardsAddress;
    }

    function setRocketDAOProtocolSettingRewardsAddress(address _rocketDaoProtocolSettingsRewardsAddress) public {
        rocketDaoProtocolSettingsRewardsAddress = _rocketDaoProtocolSettingsRewardsAddress;
    }

    function getWETHAddress() public view returns (address) {
        return wethAddress;
    }

    function setWETHAddress(address _wethAddress) public {
        wethAddress = _wethAddress;
    }

    function setTreasuryAddress(address _treasuryAddress) public {
        treasuryAddress = _treasuryAddress;
    }

    function getTreasuryAddress() public view returns (address) {
        return treasuryAddress;
    }

    function setOperatorRewardAddress(address _operatorReward) public {
        operatorReward = _operatorReward;
    }

    function getOperatorRewardAddress() public view returns (address) {
        return operatorReward;
    }

    function setRocketDepositPoolAddress(address _rocketDepositPoolAddress) public {
        rocketDepositPoolAddress = _rocketDepositPoolAddress;
    }

    function getRocketDepositPoolAddress() public view returns (address) {
        return rocketDepositPoolAddress;
    }

    function isSanctioned(address, address) public view returns (bool) {
        return isSanctionedBool;
    }

    function setIsSanctioned(bool _isSanctionedBool) public {
        isSanctionedBool = _isSanctionedBool;
    }

    function setMerkleClaimStreamerAddress(address _merkleClaimStreamerAddress) public {
        merkleClaimStreamerAddress = _merkleClaimStreamerAddress;
    }

    function getMerkleClaimStreamerAddress() public view returns (address) {
        return merkleClaimStreamerAddress;
    }

    function setOracleAddress(address _oracleAddress) public {
        oracleAddress = _oracleAddress;
    }

    function getOracleAddress() public view returns (address) {
        return oracleAddress;
    }
}