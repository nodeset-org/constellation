// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "./Interfaces/RocketTokenRPLInterface.sol";

struct Protocol {
    address whitelist;
    address payable ethToken; // raspETH
    address payable rplToken; // xRPL
    address payable depositPool;
    address payable operatorDistributor;
    address yieldDistributor;
    address rocketDAOProtocolSettingsNetwork;
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

    function getETHTokenAddress() public view returns (address payable) {
        return _protocol.ethToken;
    }

    function getRPLTokenAddress() public view returns (address payable) {
        return _protocol.rplToken;
    }

    function getDepositPoolAddress() public view returns (address payable) {
        return _protocol.depositPool;
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

    function getRocketDAOProtocolSettingsNetwork() public view returns(address) {
        return _protocol.rocketDAOProtocolSettingsNetwork;
    }

    //----
    // ADMIN
    //----

    modifier onlyAdmin() {
        require(msg.sender == getAdminAddress(), ADMIN_ONLY_ERROR);
        _;
    }
}
