// SPDX-License-Identifier: GPL v3

/**
  *    /***        /***          /******                                  /**               /** /**             /**     /**                    
  *   /**_/       |_  **        /**__  **                                | **              | **| **            | **    |__/                    
  *  | **   /** /** | **       | **  \__/  /******  /*******   /******* /******    /****** | **| **  /******  /******   /**  /******  /******* 
  *  /***  |__/|__/ | ***      | **       /**__  **| **__  ** /**_____/|_  **_/   /**__  **| **| ** |____  **|_  **_/  | ** /**__  **| **__  **
  * |  **           | **       | **      | **  \ **| **  \ **|  ******   | **    | ********| **| **  /*******  | **    | **| **  \ **| **  \ **
  *  \ **   /** /** | **       | **    **| **  | **| **  | ** \____  **  | ** /* | **_____/| **| ** /**__  **  | ** /* | **| **  | **| **  | **
  *  |  ***|__/|__/***         |  ******||  ****** | **  | ** /*******   | ****  |  *******| **| **| ********  | ****  | **|  ****** | **  | **
  *   \___/       |___/         \______/  \______/ |__/  |__/|_______/    \___/   \_______/|__/|__/ \_______/   \___/  |__/ \______/ |__/  |__/
  *
  *  A liquid staking protocol extending Rocket Pool.
  *  Made w/ <3 by {::}
  *
  *  For more information, visit https://nodeset.io
  *
  *  @author Mike Leach (Wander), Nick Steinhilber (NickS), Theodore Clapp (mryamz), Joe Clapis (jcrtp), Huy Nguyen, Andy Rose (Barbalute)
  *  @custom:security-info https://docs.nodeset.io/nodeset/security-notice
  **/

pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

import './Directory.sol';
import './Constants.sol';

abstract contract UpgradeableBase is UUPSUpgradeable, ReentrancyGuard {
    Directory internal _directory;

    function initialize(address directoryAddress) public virtual onlyInitializing {
        require(directoryAddress != address(0), 'UpgradeableBase: invalid directory address');
        _directory = Directory(directoryAddress);
        __UUPSUpgradeable_init();
    }

    constructor() {
        _disableInitializers();
    }

    modifier onlyAdmin() {
        require(_directory.hasRole(Constants.ADMIN_ROLE, msg.sender), 'Can only be called by admin address!');
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
