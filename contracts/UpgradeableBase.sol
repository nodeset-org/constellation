// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;


import "./Directory.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

abstract contract UpgradeableBase is UUPSUpgradeable {

    Directory internal _directory;

    string constant public ADMIN_ONLY_ERROR = "Can only be called by admin address!";

    function initialize(address directoryAddress) initializer virtual public {
        _directory = Directory(directoryAddress);
    }

    modifier onlyAdmin {
        require(msg.sender == _directory.getAdminAddress(), ADMIN_ONLY_ERROR);
        _;
    }

    function getDirectory() internal view returns (Directory) {
        return _directory;
    }

    function getImplementation() public view returns (address) {
        return _getImplementation();
    }
}