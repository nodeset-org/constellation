// SPDX License Identifier: GPL v3

import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../UpgradeableBase.sol';

pragma solidity 0.8.17;

// interface def here

contract XRETHOracle is IXRETHOracle, UpgradeableBase {

    address public oracleService; // is gonna be rated

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
    function getTotalYieldAccrued() external view override returns (uint) {
        // rated oracle itegration here
    }
}
