// SPDX-License-Identifier: GPL-3.0-or-later

import '../Interfaces/Oracles/IConstellationOracle.sol';
import '../UpgradeableBase.sol';

pragma solidity 0.8.17;

contract ZKConstellationOracle is IConstellationOracle, UpgradeableBase {
    address public oracleService;
    constructor() initializer {}

    /**
     * @notice Initializes the Oracle service with the specified directory address.
     * @param _directoryAddress The address of the directory contract.
     * @param _oracleService The address of the oracle service.
     */
    function initializeOracleService(address _directoryAddress, address _oracleService) public virtual initializer {
        super.initialize(_directoryAddress);
        oracleService = _oracleService;
    }

    /**
     * @notice Retrieves the total yield accrued from the oracle service.
     * @return The total yield accrued.
     */
    function getTotalYieldAccrued() external view override returns (int256) {
        // TODO: zk-oracle impl here
    }

    function getLastUpdatedTotalYieldAccrued() external view override returns (uint256) {}
}
