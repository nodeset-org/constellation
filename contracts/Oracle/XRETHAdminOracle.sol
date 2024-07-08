// SPDX License Identifier: GPL v3

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../UpgradeableBase.sol';

pragma solidity 0.8.17;

// interface def here

contract XRETHAdminOracle is IXRETHOracle, UpgradeableBase {
    uint256 internal _totalYieldAccrued;

    constructor() initializer {}

    /// @dev Initializes the FundRouter contract with the specified directory address.
    /// @param _directoryAddress The address of the directory contract.
    function initializeAdminOracle(address _directoryAddress) public virtual initializer {
        super.initialize(_directoryAddress);
    }

    function getTotalYieldAccrued() external view override returns (uint) {
        return _totalYieldAccrued;
    }

    function setTotalYieldAccrued(bytes calldata _sig, uint256 _newTotalYieldAccrued) external {
        address recoveredAddress = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(
                keccak256(abi.encodePacked(_newTotalYieldAccrued, address(this)))
            ),
            _sig
        );
        require(
            _directory.hasRole(Constants.ADMIN_ORACLE_ROLE, recoveredAddress),
            'signer must have permission from admin oracle role'
        );
        _totalYieldAccrued = _newTotalYieldAccrued;
    }
}
