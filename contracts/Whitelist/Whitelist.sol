// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;


import "../UpgradeableBase.sol";
import "../Operator/Operator.sol";

/// @custom:security-contact info@nodeoperator.org
/// @notice Controls operator access to the protocol.
/// Only modifiable by admin. Upgradeable and intended to be replaced by a ZK-ID check when possible.
contract Whitelist is UpgradeableBase {

    mapping(address => bool) private _permissions;
    Operator[] private _operators;
    event OperatorAdded(Operator newOperator);
    event OperatorRemoved(address a);

    uint _numOperators;

    uint24 private _trustBuildPeriod;
    event TrustBuildPeriodUpdated(uint24 oldValue, uint24 newValue);

    string constant public OPERATOR_NOT_FOUND_ERROR  = "Whitelist: Provided address is not an allowed operator!";
    string constant public OPERATOR_DUPLICATE_ERROR  = "Whitelist: Provided address is already an allowed operator!";

    function initializeWhitelist(address directoryAddress, uint24 trustBuildPeriod) initializer public {
        super.initialize(directoryAddress);
        _trustBuildPeriod = trustBuildPeriod;
    }

    //----
    // GETTERS
    //----

    function getOperatorList() public view returns(Operator[] memory) {
        return _operators;
    }

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
        require(_permissions[a], OPERATOR_NOT_FOUND_ERROR);
        Operator memory operator = _operators[getOperatorIndex(a)];
        return operator;
    }

    //----
    // INTERNAL
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

    // TODO: Determine what happens if the operator already exists but isn't permissioned.
    // Currently, operators who leave the system are reset upon rejoining.
    function addOperator(address a) public onlyAdmin {
        require(!_permissions[a], OPERATOR_DUPLICATE_ERROR);
        
        _permissions[a] = true;

        Operator memory operator = Operator(_numOperators, a, block.timestamp, 0, 10000);
        
        _operators.push(operator); // totally new operator

        _numOperators++;
        emit OperatorAdded(operator);
    }

    function removeOperator(address a) public onlyAdmin {
        _permissions[a] = false;
        
        // move last operator to occupy removed operator's index,
        // then pop the last operator
        uint index = getOperatorIndex(a);
        Operator memory o = _operators[_operators.length - 1];
        o.index = index;
        _operators[index] = o;
        _operators.pop();

        _numOperators--;
        emit OperatorRemoved(a);
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}
    
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

    modifier onlyOperatorDistributor {
        require(msg.sender == getDirectory().getOperatorDistributorAddress(), "Whitelist: only the OperatorDistributor may call this function!");
        _;
    }

}