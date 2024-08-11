// SPDX-License-Identifier: GPL-3.0-or-later

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '../Interfaces/Oracles/IConstellationOracle.sol';
import '../UpgradeableBase.sol';
import '../Operator/SuperNodeAccount.sol';
import '../Tokens/WETHVault.sol';

pragma solidity 0.8.17;

/**
 * @title PoAConstellationOracle
 * @notice Protocol interface for a proof-of-authority oracle that provides total yield accrued by xrETH and xRPL from the beacon chain
 * and current reward intervals for Rocket Pool.
 * The reported yield is the sum of...
 * - The rewards or penalties for all validators and minipool contract balances (i.e. it does NOT include bonds)
 * - The rewards accrued for RPL during the current rewards period for RP
 * - The rewards accrued for ETH during the current rewards period for RP
 * ...with the treasury and NO fees already subtracted. 
 * @dev When the protocol receives rewards, it will remove these fees and keep track of an 
 * the amount received so that it is not double counted against the last reported oracle value. See also: OperatorDistributor.onEthRewardsReceived()
 */
contract PoAConstellationOracle is IConstellationOracle, UpgradeableBase {
    struct PoAOracleSignatureData {
        int256 newOutstandingEthYield; // The new total ETH yield accrued
        int256 newOutstandingRplYield; // The new total RPL yield accrued
        uint256 expectedEthOracleError; // The expected current ETH oracle error of the protocol
        uint256 expectedRplOracleError; // The expected current RPL oracle error of the protocol
        uint256 timeStamp; //The timestamp of the signature.
    }

    event OutstandingYieldUpdated(int256 ethAmount, int256 rplAmount);

    /// @dev This takes into account the validator and minipool contract balances and outstanding merkle rewards AFTER fees and WITHOUT bonds
    // This is all the ETH outside the view of the protocol contracts which is attributable to xrETH
    int256 public outstandingEthYield;
    /// @dev This takes into account the outstanding merkle rewards AFTER fees
    // This is all the RPL outside the view of the protocol contracts which is attributable to xRPL
    int256 public outstandingRplYield;
    uint256 public lastUpdateTime;

    function getOutstandingEthYield() external view override returns (int256) { return outstandingEthYield; }
    function getOutstandingRplYield() external view override returns (int256) { return outstandingRplYield; }

    constructor() initializer {}

    /**
     * @notice Initializes the oracle with the specified directory address.
     * @param _directoryAddress The address of the directory contract.
     */
    function initializeOracle(address _directoryAddress) public virtual initializer {
        super.initialize(_directoryAddress);
    }

    /**
     * @notice Internal function to set the outstanding yield accrued, which takes into account the validator and minipool contract balances 
     * as well as an estimate of what the next merkle claim will return.
     * @dev The reported yield should be the sum of the rewards or penalties for all validators and minipool contract balances 
     * (i.e. it should NOT include bonds).
     * @param _sig The signature
     * @param sigData The signed data
     */
    function setOutstandingYield(bytes calldata _sig, PoAOracleSignatureData calldata sigData) external {
        address recoveredAddress = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(
                keccak256(abi.encodePacked(
                    sigData.newOutstandingEthYield, 
                    sigData.newOutstandingRplYield, 
                    sigData.expectedEthOracleError, 
                    sigData.expectedRplOracleError, 
                    sigData.timeStamp, 
                    address(this), 
                    block.chainid))
            ),
            _sig
        );
        require(
            _directory.hasRole(Constants.ADMIN_ORACLE_ROLE, recoveredAddress),
            'signer must have permission from admin oracle role'
        );
        require(sigData.timeStamp > lastUpdateTime, 'cannot update oracle using old data');

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());

        outstandingEthYield = getActualYieldAccrued(sigData.newOutstandingEthYield, sigData.expectedEthOracleError, od.oracleEthError());
        outstandingRplYield = getActualYieldAccrued(sigData.newOutstandingRplYield, sigData.expectedRplOracleError, od.oracleRplError());
        
        lastUpdateTime = block.timestamp;
        emit OutstandingYieldUpdated(outstandingEthYield, outstandingRplYield);

        od.resetOracleError();
    }

    /// @notice Utility function to determine actual yield accrued from an oracle update. 
    /// This prevents a front-running attack/accident where a valid sig is generated, then a minipool or merkle claim is processed before 
    /// an oracle update is called, causing a double-count of rewards. 
    /// @param reportedYield The yield reported by the oracle
    /// @param expectedError The expected error accrued
    /// @param actualError The actual error accrued
    /// @return Actual yield accrued
    /// @dev Actual oracle error should only ever increase or be reset to 0, so the expected error must be greater or this will revert.
    function getActualYieldAccrued(int256 reportedYield, uint256 expectedError, uint256 actualError) public pure returns (int256){
        require(expectedError <= actualError, "actual error was less than expected error");
        
        int256 actualYieldAccrued = 0;
        if(expectedError < actualError) { 
            if(reportedYield > 0) {
                actualYieldAccrued = reportedYield - int(actualError - expectedError);
            }
            else if(reportedYield < 0) {
                actualYieldAccrued = reportedYield + int(actualError - expectedError);
            }
        } else if(expectedError == actualError) {
            actualYieldAccrued = reportedYield;
        }
        return actualYieldAccrued;
    }
}