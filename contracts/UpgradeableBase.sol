// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Directory.sol";
import "./Utils/Constants.sol";

abstract contract UpgradeableBase is UUPSUpgradeable, ReentrancyGuard {

    Directory internal _directory;

    function initialize(address directoryAddress) public virtual initializer {
        _directory = Directory(directoryAddress);
        __UUPSUpgradeable_init();
    }

    constructor() initializer {
    }

    modifier onlyAdmin() {
        require(_directory.hasRole(Constants.ADMIN_ROLE, msg.sender), "Can only be called by admin address!");
        _;
    }

    modifier onlyDepositPool() {
        require(
            msg.sender == _directory.getDepositPoolAddress(),
            "Can only be called by Deposit Pool!"
        );
        _;
    }

    modifier onlyProtocolOrAdmin() {
        require(
            _directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender) || _directory.hasRole(Constants.ADMIN_ROLE, msg.sender),
            "Can only be called by Whitelist or Admin!"
        );
        _;
    }

    modifier onlyProtocol() {
        require(
            _directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender),
            "Can only be called by Protocol!"
        );
        _;
    }

    modifier only24HourTimelock() {
        require(
            _directory.hasRole(Constants.TIMELOCK_24_HOUR, msg.sender),
            "Can only be called by 24 hour timelock!"
        );
        _;
    }

    function getDirectory() public view returns (Directory) {
        return _directory;
    }

    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

}
