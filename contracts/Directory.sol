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
    address payable weth;
    address yieldDistributor;
    address rethOracle;
    address rocketStorage;
    address rocketNodeManager;
    address rocketNodeStaking;
}

/// @custom:security-contact info@nodeoperator.org
/// @notice Holds references to all protocol contracts
contract Directory {
    Protocol private _protocol;

    address payable _adminAddress;

    string public constant CONTRACT_NOT_FOUND_ERROR =
        "Directory: contract not found!";
    string public constant ADMIN_ONLY_ERROR =
        "Directory: may only be called by admin address!";
    string public constant INITIALIZATION_ERROR =
        "Directory: may only initialized once!";

    address payable public constant RPL_CONTRACT_ADDRESS =
        payable(0xD33526068D116cE69F19A9ee46F0bd304F21A51f);

    address public constant RP_NETWORK_FEES_ADDRESS =
        payable(0x320f3aAB9405e38b955178BBe75c477dECBA0C27);

    bool private _isInitialized = false;

    constructor() {
        _adminAddress = payable(msg.sender);
    }

    /// @notice Called once to initialize the protocol after all the contracts have been deployed
    function initialize(Protocol calldata protocol) public onlyAdmin {
        require(!_isInitialized, INITIALIZATION_ERROR);
        _protocol = protocol;
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
        return _protocol.rocketStorage;
    }

    function getWETHAddress() public view returns (address payable) {
        return _protocol.weth;
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
        return _protocol.rocketNodeManager;
    }

    function getRocketNodeStakingAddress() public view returns (address) {
        return _protocol.rocketNodeStaking;
    }

    //----
    // ADMIN
    //----

    modifier onlyAdmin() {
        require(msg.sender == getAdminAddress(), ADMIN_ONLY_ERROR);
        _;
    }
}
