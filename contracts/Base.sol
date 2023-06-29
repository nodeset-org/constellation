// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Directory.sol";

abstract contract Base is ReentrancyGuard {
    Directory internal _directory;

    string public constant ADMIN_ONLY_ERROR =
        "Can only be called by admin address!";
    string public constant MAX_BALANCE_PORTION_ERROR =
        "Protocol is at max balance and cannot accept deposits";
    string public constant DP_ONLY_ERROR =
        "Can only be called by Deposit Pool!";

    constructor(address directory) {
        _directory = Directory(directory);
    }

    modifier onlyAdmin() {
        require(msg.sender == _directory.getAdminAddress(), ADMIN_ONLY_ERROR);
        _;
    }

    modifier onlyDepositPool() {
        require(
            msg.sender == _directory.getDepositPoolAddress(),
            DP_ONLY_ERROR
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

    function onlyWETHVault() internal view {
        require(
            msg.sender == _directory.getWETHVaultAddress(),
            "Can only be called by WETH Vault!"
        );
    }

    function getDirectory() internal view returns (Directory) {
        return _directory;
    }
}
