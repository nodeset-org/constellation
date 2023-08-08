// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

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
}

/// @custom:security-contact info@nodeoperator.org
/// @notice Holds references to all protocol contracts
contract Directory is UUPSUpgradeable {
    Protocol private _protocol;

    address payable _adminAddress;

    string public constant CONTRACT_NOT_FOUND_ERROR =
        "Directory: contract not found!";
    string public constant ADMIN_ONLY_ERROR =
        "Directory: may only be called by admin address!";
    string public constant INITIALIZATION_ERROR =
        "Directory: may only initialized once!";


    constructor() initializer {
        _adminAddress = payable(msg.sender);
    }

    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    function _authorizeUpgrade(address) internal view override {
        require(msg.sender == _adminAddress, ADMIN_ONLY_ERROR);
    }

    //----
    // GETTERS
    //----

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

    function getWETHAddress() public pure returns (address payable) {
        return Constants.WETH_CONTRACT_ADDRESS;
    }

    function getRPLAddress() public pure returns (address) {
        return Constants.RPL_CONTRACT_ADDRESS;
    }

    function initialize(Protocol memory newProtocol) public initializer {
        require(_protocol.whitelist == address(0), INITIALIZATION_ERROR);
        require(_protocol.wethVault == address(0), INITIALIZATION_ERROR);
        require(_protocol.rplVault == address(0), INITIALIZATION_ERROR);
        require(_protocol.depositPool == address(0), INITIALIZATION_ERROR);
        require(_protocol.operatorDistributor == address(0), INITIALIZATION_ERROR);
        require(_protocol.yieldDistributor == address(0), INITIALIZATION_ERROR);
        require(_protocol.oracle == address(0), INITIALIZATION_ERROR);
        require(_protocol.priceFetcher == address(0), INITIALIZATION_ERROR);
        require(_protocol.rocketStorage == address(0), INITIALIZATION_ERROR);
        require(_protocol.rocketNodeManager == address(0), INITIALIZATION_ERROR);
        require(_protocol.rocketNodeStaking == address(0), INITIALIZATION_ERROR);

        _adminAddress = payable(msg.sender);
        _protocol = newProtocol;
    }

}
