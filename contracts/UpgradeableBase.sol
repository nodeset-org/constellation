// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Directory.sol";

abstract contract UpgradeableBase is UUPSUpgradeable, ReentrancyGuard {
    Directory internal _directory;

    function initialize(address directoryAddress) public virtual initializer {
        _directory = Directory(directoryAddress);
        __UUPSUpgradeable_init();
    }

    constructor() initializer {
    }

    modifier onlyAdmin() {
        require(msg.sender == _directory.getAdminAddress(), "Can only be called by admin address!");
        _;
    }

    modifier onlyDepositPool() {
        require(
            msg.sender == _directory.getDepositPoolAddress(),
            "Can only be called by Deposit Pool!"
        );
        _;
    }

    modifier onlyWhitelistOrAdmin() {
        require(
            msg.sender == _directory.getWhitelistAddress() ||
                msg.sender == _directory.getAdminAddress(),
            "Can only be called by Whitelist or Admin!"
        );
        _;
    }

    modifier onlyYieldDistrubutor() {
        require(
            msg.sender == _directory.getYieldDistributorAddress(),
            "Can only be called by Yield Distributor!"
        );
        _;
    }

    modifier onlyOperatorDistributor() {
        require(
            msg.sender == _directory.getOperatorDistributorAddress(),
            "Can only be called by Operator Distributor!"
        );
        _;
    }

    modifier onlyWETHVault() {
        require(
            msg.sender == _directory.getWETHVaultAddress(),
            "Can only be called by WETH Vault!"
        );
        _;
    }

    modifier onlyRplVault() {
        require(
            msg.sender == _directory.getRPLVaultAddress(),
            "DepositPool: This function may only be called by the xRPL token contract"
        );
        _;
    }


    function getDirectory() internal view returns (Directory) {
        return _directory;
    }

    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

}
