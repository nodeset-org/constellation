// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Directory.sol";

abstract contract Base is ReentrancyGuard {

    Directory internal _directory;

    string constant public ADMIN_ONLY_ERROR = "Can only be called by admin address!";

    constructor (address directory) {
        _directory = Directory(directory);
    }

    modifier onlyAdmin {
        require(msg.sender == _directory.getAdminAddress(), ADMIN_ONLY_ERROR);
        _;
    }

    modifier whenNotPaused {
        require(!_directory.paused());
        _;
    }

    function getDirectory() internal view returns (Directory) {
        return _directory;
    }
}