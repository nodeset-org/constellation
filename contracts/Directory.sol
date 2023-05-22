// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/Pausable.sol";

import "./Interfaces/RocketTokenRPLInterface.sol";
import "./Interfaces/Oracles/IRETHOracle.sol";
import "./Interfaces/Oracles/IConstellationMinipoolsOracle.sol";


struct Protocol {
    address whitelist;
    address payable ethToken; // raspETH
    address payable rplToken; // xRPL
    address payable depositPool;
    address payable operatorDistributor;
    address yieldDistributor;
    address rethOracle;
    address constellationMinipoolsOracle;
}

/// @custom:security-contact info@nodeoperator.org
/// @notice Holds references to all protocol contracts
contract Directory is Pausable {
    Protocol private _protocol;

    address payable _adminAddress;
    address _pauserAddress;

    string public constant CONTRACT_NOT_FOUND_ERROR =
        "Directory: contract not found!";
    string public constant ADMIN_ONLY_ERROR =
        "Directory: may only be called by admin address!";
    string public constant PAUSER_ONLY_ERROR =
        "Directory: may only be called by pauser address!";
    string public constant INITIALIZATION_ERROR =
        "Directory: may only initialized once!";

    address payable public constant RPL_CONTRACT_ADDRESS =
        payable(0xD33526068D116cE69F19A9ee46F0bd304F21A51f);
    address public constant RP_NETWORK_FEES_ADDRESS =
        payable(0x320f3aAB9405e38b955178BBe75c477dECBA0C27);

    bool private _isInitialized = false;

    constructor(address pauserAddress) {
        _adminAddress = payable(msg.sender);
        _pauserAddress = pauserAddress;
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

    function getRETHOracleAddress() public view returns (address) {
        return _protocol.rethOracle;
    }

    function getConstellationMinipoolsOracleAddress()
        public
        view
        returns (address)
    {
        return _protocol.constellationMinipoolsOracle;
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

    //----
    // ADMIN
    //----

    modifier onlyAdmin() {
        require(msg.sender == getAdminAddress(), ADMIN_ONLY_ERROR);
        _;
    }

    function emergencyPause() public onlyAdmin {
        _pause();
    }

    function resumeOperations() public onlyAdmin {
        _unpause();
    }
}
