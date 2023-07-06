// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "./Interfaces/RocketTokenRPLInterface.sol";
import "./Interfaces/Oracles/IXRETHOracle.sol";
import "./Interfaces/RocketPool/IRocketStorage.sol";

struct Protocol {
    address whitelist;
    address payable wethVault; // raspETH
    address payable rplVault; // xRPL
    address payable depositPool;
    address payable operatorDistributor;
    address yieldDistributor;
    address rethOracle;
}

struct ExternalDependencies {
    address rocketStorage;
    address rocketNodeManager;
    address rocketNodeStaking;
    address rplToken;
    address payable wethToken;
}

/// @custom:security-contact info@nodeoperator.org
/// @notice Holds references to all protocol contracts
contract Directory {

    Protocol private _protocol;
    ExternalDependencies private _externalDependencies;
    address payable _adminAddress;

    bool private _isInitialized = false;

    constructor() {
        _adminAddress = payable(msg.sender);
    }

    /// @notice Called once to initialize the protocol after all the contracts have been deployed
    function initialize(Protocol calldata protocol, ExternalDependencies calldata dependencies) public onlyAdmin {
        require(!_isInitialized, "Directory: may only initialized once!");
        _protocol = protocol;
        _externalDependencies = dependencies;
        _isInitialized = true;
    }

    //----
    // GETTERS
    //----

    function getIsInitialized() public view returns (bool) {
        return _isInitialized;
    }

    function getAdminAddress() public view returns (address payable) {
        return _adminAddress;
    }

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
        return _protocol.rethOracle;
    }

    function getRocketStorageAddress() public view returns (address) {
        return _externalDependencies.rocketStorage;
    }

    function getWETHAddress() public view returns (address payable) {
        return _externalDependencies.wethToken;
    }


    function getRPLAddress() public view returns (address) {
        return _externalDependencies.rplToken;
    }

    function getOperatorDistributorAddress()
        public
        view
        returns (address payable)
    {
        return _protocol.operatorDistributor;
    }

    function getYieldDistributorAddress() public view returns (address) {
        return _protocol.yieldDistributor;
    }

    function getRocketNodeManagerAddress() public view returns (address) {
        return _externalDependencies.rocketNodeManager;
    }

    function getRocketNodeStakingAddress() public view returns (address) {
        return _externalDependencies.rocketNodeStaking;
    }

    //----
    // ADMIN
    //----

    modifier onlyAdmin() {
        require(msg.sender == getAdminAddress(), "Directory: may only be called by admin address!");
        _;
    }
}
