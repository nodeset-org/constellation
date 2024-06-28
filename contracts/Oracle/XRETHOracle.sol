// SPDX License Identifier: GPL v3

import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../UpgradeableBase.sol';

pragma solidity 0.8.17;

contract XRETHOracle is IXRETHOracle, UpgradeableBase {

    address public oracleService; // is gonna be rated

    constructor() initializer {}

    /// @dev Initializes the FundRouter contract with the specified directory address.
    /// @param _directoryAddress The address of the directory contract.
    function initializeOracleService(address _directoryAddress, address _oracleService) public virtual initializer {
        super.initialize(_directoryAddress);
        oracleService = _oracleService;
    }

    function getTotalYieldAccrued() external view override returns (uint) {}
}
