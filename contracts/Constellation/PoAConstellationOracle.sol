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

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '../Interfaces/IConstellationOracle.sol';
import './Utils/UpgradeableBase.sol';
import './SuperNodeAccount.sol';
import './WETHVault.sol';

/**
 * @title PoAConstellationOracle
 * @notice Protocol interface for a proof-of-authority oracle that provides total yield accrued by xrETH from the beacon chain
 * and current reward intervals for Rocket Pool.
 * The reported yield is the sum of the rewards or penalties for all validators and minipool contract balances
 * with the treasury and NO fees already subtracted. It does NOT include bonds, which are already tracked upon minipool creation.
 * @dev When the protocol receives rewards, it will remove these fees and keep track of an 
 * the amount received so that it is not double counted against the last reported oracle value. See also: OperatorDistributor.onEthBeaconRewardsReceived()
 */
contract PoAConstellationOracle is IConstellationOracle, UpgradeableBase {
    struct PoAOracleSignatureData {
        int256 newTotalYieldAccrued; // The new total yield accrued.
        uint256 expectedOracleError; // The expected current oracle error of the protocol
        uint256 timeStamp; //The timestamp of the signature.
    }

    event TotalYieldAccruedUpdated(int256 _amount);

    /// @dev This takes into account the validator and minipool contract balances
    int256 internal _totalYieldAccrued;
    uint256 internal _lastUpdatedTotalYieldAccrued;

    /**
     * @notice Initializes the oracle with the specified directory address.
     * @param _directoryAddress The address of the directory contract.
     */
    function initializeOracle(address _directoryAddress) public virtual initializer {
        super.initialize(_directoryAddress);
        _lastUpdatedTotalYieldAccrued = block.timestamp;
    }

    /**
     * @notice Retrieves the total yield accrued.
     * @dev The reported yield is the sum of the rewards or penalties for all validators and minipool contract balances 
     * (i.e. it does NOT include bonds).
     * @return The total yield accrued.
     */
    function getTotalYieldAccrued() external view override returns (int256) {
        return _totalYieldAccrued;
    }

    /**
     * @notice Internal function to set the total yield accrued, which takes into account the validator and minipool contract balances.
     * @dev The reported yield should be the sum of the rewards or penalties for all validators and minipool contract balances 
     * (i.e. it should NOT include bonds).
     * @param _sig The signature
     * @param sigData The signed data
     */
    function setTotalYieldAccrued(bytes calldata _sig, PoAOracleSignatureData calldata sigData) external {
        address recoveredAddress = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(
                keccak256(abi.encodePacked(
                    sigData.newTotalYieldAccrued, 
                    sigData.expectedOracleError, 
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
        require(sigData.timeStamp > _lastUpdatedTotalYieldAccrued, 'cannot update oracle using old data');
        require(sigData.timeStamp <= block.timestamp, 'cannot update oracle using future data');

        OperatorDistributor od = OperatorDistributor(_directory.getOperatorDistributorAddress());

        // Prevent a front-running attack/accident where a valid sig is generated, then a minipool is processed before 
        // this function is called, causing a double-count of rewards. 
        if(sigData.expectedOracleError < od.oracleError()) { 
            if(sigData.newTotalYieldAccrued > 0) {
                _totalYieldAccrued = sigData.newTotalYieldAccrued - int(od.oracleError() - sigData.expectedOracleError);
            }
            else if(sigData.newTotalYieldAccrued < 0) {
                _totalYieldAccrued = sigData.newTotalYieldAccrued + int(od.oracleError() - sigData.expectedOracleError);
            }
            else {
                _totalYieldAccrued = 0;
            }
        } else if(sigData.expectedOracleError == od.oracleError()) {
            _totalYieldAccrued = sigData.newTotalYieldAccrued;
        } else {
            // Note that actual oracle error will only ever increase or be reset to 0,
            // so if expectedOracleError is not <= actual oracleError, there is something wrong with the oracle.
            revert("actual oracleError was less than expectedOracleError");
        }
        
        _lastUpdatedTotalYieldAccrued = block.timestamp;
        emit TotalYieldAccruedUpdated(_totalYieldAccrued);

        od.resetOracleError();
    }

    function getLastUpdatedTotalYieldAccrued() external view override returns (uint256) {
        return _lastUpdatedTotalYieldAccrued;
    }
}
