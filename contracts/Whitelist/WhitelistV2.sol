// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.9;

import "../UpgradeableBase.sol";
import "../Operator/Operator.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @custom:security-contact info@nodeoperator.org
/// @notice Controls operator access to the protocol. 
/// Only modifiable by admin. Upgradeable and intended to be replaced by a ZK-ID check when possible.
contract Whitelist is UpgradeableBase {

    mapping(address => bool) private _permissions;
    Operator[] private _operators;
    event OperatorAdded(address newOperator);
    event OperatorRemoved(address oldOperator);

    uint _numOperators;

    uint24 private _trustBuildPeriod;    
    event TrustBuildPeriodUpdated(uint24 oldValue, uint24 newValue);

    string constant public OPERATOR_NOT_FOUND_ERROR  = "Whitelist: provided address is not an operator!";

    function initializeWhitelist(address directoryAddress, uint24 trustBuildPeriod) initializer public {
        super.initialize(directoryAddress);
        _trustBuildPeriod = trustBuildPeriod;
    }

    //----
    // GETTERS
    //----

    function getIsAddressInWhitelist(address a) public view returns (bool){
        return _permissions[a] != false;
    }

    function getTrustBuildPeriod() public view returns(uint) {
        return _trustBuildPeriod;
    }

    function getRewardShare(Operator calldata operator) public view returns (uint) {
        uint timeSinceStart = (block.timestamp - operator.operationStartTime);
        uint portion = timeSinceStart / getTrustBuildPeriod();
        if(portion < 1)
            return portion;
        else
            return 100; // max percentage of rewards is 100%
    }

    function getOperatorAtAddress(address a) public view returns (Operator memory){
        return _operators[getOperatorIndex(a)];
    }

    //----
    // OPERTOR
    //----


    function registerNewValidator(Operator calldata operator) public onlyOperatorDistributor {
        _operators[operator.index].currentValidatorCount++;
    }

    //----
    // ADMIN
    //----        

    function setTrustBuildPeriod(uint8 trustBuildPeriod) public onlyAdmin {
        uint24 old = _trustBuildPeriod;
        _trustBuildPeriod = trustBuildPeriod;
        emit TrustBuildPeriodUpdated(old, _trustBuildPeriod);
    }

    function addOperator(address a) public onlyAdmin {
        _permissions[a] = true;

        _operators.push(Operator(_numOperators, a, block.timestamp, 0, 0));
        _numOperators++;
        emit OperatorAdded(a);
    }

    function removeOperator(address a) public onlyAdmin {
        _permissions[a] = false;
        emit OperatorRemoved(a);
    }
    //----
    // INTERNAL
    //----

    function getOperatorIndex(address a) private view returns (uint) {
        for(uint i = 0; i < _operators.length; i++) {
            if(_operators[i].nodeAddress == a)
                return i;
        }
        revert(OPERATOR_NOT_FOUND_ERROR);
    }

    modifier onlyOperator {
        require(getIsAddressInWhitelist(msg.sender));
        _;
    }

    modifier onlyOperatorDistributor {
        require(msg.sender == getDirectory().getOperatorDistributorAddress(), "Whitelist: only the OperatorDistributor may call this function!");
        _;
    }

    /////// end of previous contract

    function testUpgrade() public pure returns(uint) {
        return 0;
    }
}