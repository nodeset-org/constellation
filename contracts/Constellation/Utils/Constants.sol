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

/**
 * @title Constants
 * @notice Defines various constants used throughout the protocol.
 */
library Constants {
    // ROLES
    bytes32 internal constant ADMIN_ROLE = keccak256('ADMIN_ROLE');
    bytes32 internal constant TREASURER_ROLE = keccak256('TREASURER_ROLE');
    bytes32 internal constant ADMIN_ORACLE_ROLE = keccak256('ADMIN_ORACLE_ROLE');
    bytes32 internal constant ADMIN_SERVER_ROLE = keccak256('ADMIN_SERVER_ROLE');

    // Note that the protocol role should ONLY be given to protocol contracts
    // This is a dangerous role that MUST be kept internal
    // It should never be given to a non-core-protocol contract (e.g. don't give it to the treasurer or operator rewards address)
    // and it should also never be given to an EOA (e.g. don't give this to the ADMIN or TREASURER)
    // See Directory.sol for a list of contracts which are allowed to have this role
    bytes32 internal constant CORE_PROTOCOL_ROLE = keccak256('CORE_PROTOCOL_ROLE');
    bytes32 internal constant TIMELOCK_SHORT = keccak256('TIMELOCK_SHORT');
    bytes32 internal constant TIMELOCK_MED = keccak256('TIMELOCK_MED');
    bytes32 internal constant TIMELOCK_LONG = keccak256('TIMELOCK_LONG');

    // DIRECTORY
    string public constant CONTRACT_NOT_FOUND_ERROR = 'Directory: contract not found!';
    string public constant ADMIN_ONLY_ERROR = 'Directory: may only be called by admin address!';
    string public constant TIMELOCK_SHORT_ONLY_ERROR = 'Directory: may only be called by short timelock address!';
    string public constant TIMELOCK_MED_ONLY_ERROR = 'Directory: may only be called by medium timelock address!';
    string public constant TIMELOCK_LONG_ONLY_ERROR = 'Directory: may only be called by long timelock address!';
    string public constant TREASURER_ONLY_ERROR = 'Directory: may only be called by treasurer address!';
    string public constant INITIALIZATION_ERROR = 'Directory: bad initialization!';

    // WHITELIST
    string public constant OPERATOR_NOT_FOUND_ERROR = 'Whitelist: Provided address is not an allowed operator!';
    string public constant OPERATOR_DUPLICATE_ERROR = 'Whitelist: Provided address is already an allowed operator!';
}
