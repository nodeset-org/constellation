// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

import './Directory.sol';
import './Utils/Constants.sol';

abstract contract UpgradeableBase is UUPSUpgradeable, ReentrancyGuard {
    Directory internal _directory;

    function initialize(address directoryAddress) public virtual initializer {
        _directory = Directory(directoryAddress);
        __UUPSUpgradeable_init();
    }

    constructor() initializer {}

    modifier onlyAdmin() {
        require(_directory.hasRole(Constants.ADMIN_ROLE, msg.sender), 'Can only be called by admin address!');
        _;
    }

    modifier onlyTreasurer() {
        require(_directory.hasRole(Constants.TREASURY_ROLE, msg.sender), 'Can only be called by treasurer address!');
        _;
    }

    modifier onlyProtocolOrAdmin() {
        require(
            _directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender) ||
                _directory.hasRole(Constants.ADMIN_ROLE, msg.sender),
            'Can only be called by Protocol or Admin!'
        );
        _;
    }

    modifier onlyProtocol() {
        require(_directory.hasRole(Constants.CORE_PROTOCOL_ROLE, msg.sender), 'Can only be called by Protocol!');
        _;
    }

    modifier onlyShortTimelock() {
        require(_directory.hasRole(Constants.TIMELOCK_SHORT, msg.sender), 'Can only be called by short timelock!');
        _;
    }

    modifier onlyMediumTimelock() {
        require(_directory.hasRole(Constants.TIMELOCK_MED, msg.sender), 'Can only be called by medium timelock!');
        _;
    }

    modifier onlyLongTimelock() {
        require(_directory.hasRole(Constants.TIMELOCK_LONG, msg.sender), 'Can only be called by long timelock!');
        _;
    }

    function getDirectory() public view returns (Directory) {
        return _directory;
    }

    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    function _authorizeUpgrade(address) internal virtual override onlyLongTimelock {}
}
