// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./Interfaces/RocketTokenRPLInterface.sol";
import "./Interfaces/Oracles/IXRETHOracle.sol";
import "./Interfaces/RocketPool/IRocketStorage.sol";
import "./UpgradeableBase.sol";

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

    address payable public constant RPL_CONTRACT_ADDRESS =
        payable(0xD33526068D116cE69F19A9ee46F0bd304F21A51f);

    address payable public constant WETH_CONTRACT_ADDRESS =
        payable(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    address payable public constant UNISWAP_RPL_ETH_POOL_ADDRESS =
        payable(0xe42318eA3b998e8355a3Da364EB9D48eC725Eb45);

    address public constant RP_NETWORK_FEES_ADDRESS =
        payable(0x320f3aAB9405e38b955178BBe75c477dECBA0C27);

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

    function getWETHAddress() public pure returns (address payable) {
        return WETH_CONTRACT_ADDRESS;
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
}
