// SPDX-License-Identifier: GPL-3.0-or-later

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '../Interfaces/Oracles/IBeaconOracle.sol';
import '../UpgradeableBase.sol';
import '../Operator/SuperNodeAccount.sol';
import '../Tokens/WETHVault.sol';

pragma solidity 0.8.17;

/**
 * @title PoABeaconOracle
 * @notice A proof-of-authority oracle to manage and update the total yield accrued by xrETH on the beacon chain.
 */
contract PoABeaconOracle is IBeaconOracle, UpgradeableBase {
    event TotalYieldAccruedUpdated(int256 _amount);

    int256 internal _totalYieldAccrued;
    uint256 internal _lastUpdatedTotalYieldAccrued;

    constructor() initializer {}

    /**
     * @notice Initializes the oracle with the specified directory address.
     * @param _directoryAddress The address of the directory contract.
     */
    function initializeAdminOracle(address _directoryAddress) public virtual initializer {
        super.initialize(_directoryAddress);
    }

    /**
     * @notice Retrieves the total yield accrued.
     * @return The total yield accrued.
     */
    function getTotalYieldAccrued() external view override returns (int256) {
        return _totalYieldAccrued;
    }

    /**
     * @notice Internal function to set the total yield accrued.
     * @param _sig The signature.
     * @param _newTotalYieldAccrued The new total yield accrued.
     * @param _sigTimeStamp The timestamp of the signature.
     */
    function _setTotalYieldAccrued(bytes calldata _sig, int256 _newTotalYieldAccrued, uint256 _sigTimeStamp) internal {
        address recoveredAddress = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(
                keccak256(abi.encodePacked(_newTotalYieldAccrued, _sigTimeStamp, address(this), block.chainid))
            ),
            _sig
        );
        require(
            _directory.hasRole(Constants.ADMIN_ORACLE_ROLE, recoveredAddress),
            'signer must have permission from admin oracle role'
        );
        require(_sigTimeStamp > _lastUpdatedTotalYieldAccrued, 'cannot update tya using old data');

        _totalYieldAccrued = _newTotalYieldAccrued;
        _lastUpdatedTotalYieldAccrued = block.timestamp;
        emit TotalYieldAccruedUpdated(_totalYieldAccrued);

        OperatorDistributor(_directory.getOperatorDistributorAddress()).resetOracleError();
    }

    /**
     * @notice Sets the total yield accrued.
     * @param _sig Signature provided by the Constants.ADMIN_ORACLE_ROLE.
     * @param _newTotalYieldAccrued The new total yield accrued.
     * @param _sigTimeStamp The timestamp of the signature.
     */
    function setTotalYieldAccrued(bytes calldata _sig, int256 _newTotalYieldAccrued, uint256 _sigTimeStamp) external {
        _setTotalYieldAccrued(_sig, _newTotalYieldAccrued, _sigTimeStamp);
    }

    function getLastUpdatedTotalYieldAccrued() external view override returns (uint256) {
        return _lastUpdatedTotalYieldAccrued;
    }
}
