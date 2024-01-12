// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

import './Interfaces/RocketTokenRPLInterface.sol';
import './Interfaces/Oracles/IXRETHOracle.sol';
import './Interfaces/RocketPool/IRocketStorage.sol';
import './Interfaces/ISanctions.sol';
import './UpgradeableBase.sol';
import './Utils/Constants.sol';

struct Protocol {
    address whitelist;
    address payable wethVault;
    address payable rplVault;
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
    address uniswapV3Pool;
    address sanctions;
}

/// @custom:security-contact info@nodeoperator.org
/// @notice The Directory contract holds references to all protocol contracts and role mechanisms.
/// @dev The Directory contract is a central component of the protocol, managing contract addresses and access control roles.
///      It provides the ability to set contract addresses during initialization, manage treasury, and update the Oracle contract.
contract Directory is UUPSUpgradeable, AccessControlUpgradeable {
    event SanctionViolation(address account, address eoa_origin);
    event SanctionViolation(address eoa_origin);
    event SanctionsDisabled();

    Protocol private _protocol;
    address private _treasury;
    bool private _enabledSanctions;

    constructor() initializer {}

    /// @notice Retrieves the address of the current implementation of the contract.
    /// @return The address of the current implementation contract.
    /// @dev This function allows users to query the current implementation contract address.
    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    /// @notice Internal function to authorize contract upgrades.
    /// @dev This function is used internally to ensure that only administrators can authorize contract upgrades.
    ///      It checks whether the sender has the required ADMIN_ROLE before allowing the upgrade.
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

    function getOperatorDistributorAddress() public view returns (address payable) {
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

    function getUniswapV3PoolAddress() public view returns (address) {
        return _protocol.uniswapV3Pool;
    }

    function initialize(Protocol memory newProtocol, address treasury, address admin) public initializer {
        require(msg.sender != admin, Constants.INITIALIZATION_ERROR);
        require(
            _protocol.whitelist == address(0) && newProtocol.whitelist != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.wethVault == address(0) && newProtocol.wethVault != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(_protocol.rplVault == address(0) && newProtocol.rplVault != address(0), Constants.INITIALIZATION_ERROR);
        require(
            _protocol.depositPool == address(0) && newProtocol.depositPool != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.operatorDistributor == address(0) && newProtocol.operatorDistributor != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.yieldDistributor == address(0) && newProtocol.yieldDistributor != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(_protocol.oracle == address(0) && newProtocol.oracle != address(0), Constants.INITIALIZATION_ERROR);
        require(
            _protocol.priceFetcher == address(0) && newProtocol.priceFetcher != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.rocketStorage == address(0) && newProtocol.rocketStorage != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.rocketNodeManager == address(0) && newProtocol.rocketNodeManager != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(
            _protocol.rocketNodeStaking == address(0) && newProtocol.rocketNodeStaking != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(_protocol.rplToken == address(0) && newProtocol.rplToken != address(0), Constants.INITIALIZATION_ERROR);
        require(_protocol.weth == address(0) && newProtocol.weth != address(0), Constants.INITIALIZATION_ERROR);
        require(
            _protocol.uniswapV3Pool == address(0) && newProtocol.uniswapV3Pool != address(0),
            Constants.INITIALIZATION_ERROR
        );
        require(_treasury == address(0) && treasury != address(0), Constants.INITIALIZATION_ERROR);
        require(
            _protocol.sanctions == address(0) && newProtocol.sanctions != address(0),
            Constants.INITIALIZATION_ERROR
        );

        AccessControlUpgradeable.__AccessControl_init();
        _setRoleAdmin(Constants.ADMIN_SERVER_ROLE, Constants.ADMIN_ROLE);
        _setRoleAdmin(Constants.CORE_PROTOCOL_ROLE, Constants.ADMIN_ROLE);
        _setRoleAdmin(Constants.TIMELOCK_24_HOUR, Constants.ADMIN_ROLE);

        _grantRole(Constants.ADMIN_ROLE, admin);

        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.whitelist);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.wethVault);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.rplVault);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.depositPool);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.operatorDistributor);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.yieldDistributor);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.oracle);
        _grantRole(Constants.CORE_PROTOCOL_ROLE, newProtocol.priceFetcher);

        _revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _treasury = treasury;
        _protocol = newProtocol;

        _enabledSanctions = true;
    }

    function setTreasury(address newTreasury) public {
        require(hasRole(Constants.ADMIN_ROLE, msg.sender), Constants.ADMIN_ONLY_ERROR);
        _treasury = newTreasury;
    }

    function disableSanctions() public {
        require(hasRole(Constants.ADMIN_ROLE, msg.sender), Constants.ADMIN_ONLY_ERROR);
        _enabledSanctions = false;
    }

    function enableSanctions() public {
        require(hasRole(Constants.ADMIN_ROLE, msg.sender), Constants.ADMIN_ONLY_ERROR);
        _enabledSanctions = true;
    }

    function setOracle(address newOracle) public {
        require(hasRole(Constants.ADMIN_ROLE, msg.sender), Constants.ADMIN_ONLY_ERROR);
        _protocol.oracle = newOracle;
    }

    /// @notice Updates all protocol contract addresses in a single call.
    /// @param newProtocol A Protocol struct containing updated addresses of protocol contracts.
    /// @dev This function allows an administrator to update all protocol contract addresses simultaneously.
    function setAll(Protocol memory newProtocol) public {
        require(hasRole(Constants.TIMELOCK_24_HOUR, msg.sender), Constants.ADMIN_ONLY_ERROR);
        _protocol = newProtocol;
    }

    function isSanctioned(address _account) public returns (bool) {
        address[] memory accounts = new address[](1);
        accounts[0] = _account;
        return _checkSanctions(accounts);
    }

    function isSanctioned(address _account1, address _account2) public returns (bool) {
        address[] memory accounts = new address[](2);
        accounts[0] = _account1;
        accounts[1] = _account2;
        return _checkSanctions(accounts);
    }

    function isSanctioned(address[] memory _accounts) public returns (bool) {
        return _checkSanctions(_accounts);
    }

    function _checkSanctions(address[] memory _accounts) internal returns (bool) {
        if (!_enabledSanctions) {
            emit SanctionsDisabled();
            return false;
        }
        bool sanctioned = false;
        for (uint i = 0; i < _accounts.length; i++) {
            if (_accounts[i] != address(0) && ISanctions(_protocol.sanctions).isSanctioned(_accounts[i])) {
                emit SanctionViolation(_accounts[i], tx.origin);
                sanctioned = true;
            }
        }
        if (sanctioned || ISanctions(_protocol.sanctions).isSanctioned(tx.origin)) {
            emit SanctionViolation(tx.origin);
            return true;
        }
        return false;
    }
}
