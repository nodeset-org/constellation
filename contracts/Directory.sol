// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./Interfaces/RocketTokenRPLInterface.sol";
import "./Interfaces/Oracles/IXRETHOracle.sol";
import "./Interfaces/RocketPool/IRocketStorage.sol";
import "./UpgradeableBase.sol";
import "./Utils/Constants.sol";

struct Protocol {
    address whitelist;
    address payable wethVault; // raspETH
    address payable rplVault; // xRPL
    address payable depositPool;
    address payable operatorDistributor;
    address payable yieldDistributor;
    address oracle;
    address priceFetcher;
    address rocketStorage;
    address rocketNodeManager;
    address rocketNodeStaking;
    address rplToken;
    address payable weth;
}

/// @custom:security-contact info@nodeoperator.org
/// @notice Holds references to all protocol contracts and role mechanisms
contract Directory is UUPSUpgradeable, AccessControlUpgradeable {

    Protocol private _protocol;
    address private _treasury;

    constructor() initializer {
    }

    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    function _authorizeUpgrade(address) internal view override {
        require(hasRole(Constants.ADMIN_ROLE, msg.sender), Constants.ADMIN_ONLY_ERROR);
    }

    //----
    // GETTERS
    //----

    function getWhitelistAddress() public view returns (address) {
        return _protocol.whitelist;
    }

    function getWETHVaultAddress() public view returns (address payable) {
        return _protocol.wethVault;
    }

    function getRPLVaultAddress() public view returns (address payable) {
        return _protocol.rplVault;
    }

    function getDepositPoolAddress() public view returns (address payable) {
        return _protocol.depositPool;
    }

    function getRETHOracleAddress() public view returns (address) {
        return _protocol.oracle;
    }

    function getRocketStorageAddress() public view returns (address) {
        return _protocol.rocketStorage;
    }

    function getOperatorDistributorAddress()
        public
        view
        returns (address payable)
    {
        return _protocol.operatorDistributor;
    }

    function getYieldDistributorAddress() public view returns (address payable) {
        return _protocol.yieldDistributor;
    }

    function getRocketNodeManagerAddress() public view returns (address) {
        return _protocol.rocketNodeManager;
    }

    function getRocketNodeStakingAddress() public view returns (address) {
        return _protocol.rocketNodeStaking;
    }

    function getPriceFetcherAddress() public view returns (address) {
        return _protocol.priceFetcher;
    }

    function getWETHAddress() public view returns (address payable) {
        return _protocol.weth;
    }

    function getRPLAddress() public view returns (address) {
        return _protocol.rplToken;
    }

    function getTreasuryAddress() public view returns (address) {
        return _treasury;
    }

    function initialize(Protocol memory newProtocol) public initializer {
        require(_protocol.whitelist == address(0) && newProtocol.whitelist != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.wethVault == address(0) && newProtocol.wethVault != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.rplVault == address(0) && newProtocol.rplVault != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.depositPool == address(0) && newProtocol.depositPool != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.operatorDistributor == address(0) && newProtocol.operatorDistributor != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.yieldDistributor == address(0) && newProtocol.yieldDistributor != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.oracle == address(0) && newProtocol.oracle != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.priceFetcher == address(0) && newProtocol.priceFetcher != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.rocketStorage == address(0) && newProtocol.rocketStorage != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.rocketNodeManager == address(0) && newProtocol.rocketNodeManager != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.rocketNodeStaking == address(0) && newProtocol.rocketNodeStaking != address(0), Constants.INITIALIZATION_ERROR);

        AccessControlUpgradeable.__AccessControl_init();
        _setRoleAdmin(Constants.ADMIN_SERVER_ROLE, Constants.ADMIN_ROLE);
        _setRoleAdmin(Constants.CORE_PROTOCOL_ROLE, Constants.ADMIN_ROLE);
        _setRoleAdmin(Constants.TIMELOCK_24_HOUR, Constants.ADMIN_ROLE);

        _grantRole(Constants.ADMIN_ROLE, msg.sender);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.whitelist);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.wethVault);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.rplVault);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.depositPool);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.operatorDistributor);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.yieldDistributor);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.oracle);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.priceFetcher);

        _treasury = msg.sender;

        _protocol = newProtocol;
    }

    function setTreasurer(address newTreasurer) public {
        require(hasRole(Constants.ADMIN_ROLE, msg.sender), Constants.ADMIN_ONLY_ERROR);
        _treasury = newTreasurer;
    }
}
