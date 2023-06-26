// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../UpgradeableBase.sol";
import "../Operator/Operator.sol";
import "../Operator/YieldDistributor.sol";

import "hardhat/console.sol";

/// @custom:security-contact info@nodeoperator.org
/// @notice Controls operator access to the protocol.
/// Only modifiable by admin. Upgradeable and intended to be replaced by a ZK-ID check when possible.
contract Whitelist is UpgradeableBase {
    mapping(address => bool) private _permissions;
    mapping(address => Operator) public operatorMap;
    mapping(uint => address) public operatorIndexMap;
    mapping(address => uint) public reverseOperatorIndexMap;

    event OperatorAdded(Operator newOperator);
    event OperatorRemoved(address a);

    uint public numOperators;

    uint24 private _trustBuildPeriod;
    event TrustBuildPeriodUpdated(uint24 oldValue, uint24 newValue);

    string public constant OPERATOR_NOT_FOUND_ERROR =
        "Whitelist: Provided address is not an allowed operator!";
    string public constant OPERATOR_DUPLICATE_ERROR =
        "Whitelist: Provided address is already an allowed operator!";

    function initializeWhitelist(
        address directoryAddress,
        uint24 trustBuildPeriod
    ) public initializer {
        super.initialize(directoryAddress);
        _trustBuildPeriod = trustBuildPeriod;
    }

    //----
    // GETTERS
    //----

    function getIsAddressInWhitelist(address a) public view returns (bool) {
        return _permissions[a];
    }

    function getTrustBuildPeriod() public view returns (uint) {
        return _trustBuildPeriod;
    }

    function getRewardShare(
        Operator calldata operator
    ) public view returns (uint) {
        uint timeSinceStart = (block.timestamp - operator.operationStartTime);
        uint portion = timeSinceStart / getTrustBuildPeriod();
        if (portion < 1) return portion;
        else return 100; // max percentage of rewards is 100%
    }

    function getOperatorAtAddress(
        address a
    ) public view returns (Operator memory) {
        require(reverseOperatorIndexMap[a] != 0, OPERATOR_NOT_FOUND_ERROR);
        return operatorMap[a];
    }

    //----
    // INTERNAL
    //----

    function registerNewValidator(
        address nodeOperator
    ) public onlyOperatorDistributor {
        operatorMap[nodeOperator].currentValidatorCount++;
    }

    function getOperatorAddress(uint index) public view returns (address) {
        return operatorIndexMap[index];
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

        YieldDistributor distributor = YieldDistributor(
            payable(getDirectory().getYieldDistributorAddress())
        );

        // Fee should not start at 100% because the operator has not yet built trust.

        uint256 nextInterval = distributor.currentInterval();
        console.log(nextInterval);
        Operator memory operator = Operator(block.timestamp, 0, 10000, nextInterval);
        // operator will be entitled to rewards in the next interval

        operatorMap[a] = operator;
        operatorIndexMap[numOperators] = a;
        reverseOperatorIndexMap[a] = numOperators + 1;

        distributor.finalizeInterval();

        numOperators++;

        emit OperatorAdded(operator);
    }

    function removeOperator(address a) public onlyAdmin {
        _permissions[a] = false;

        delete operatorMap[a];
        uint index = reverseOperatorIndexMap[a] - 1;
        delete operatorIndexMap[index];
        delete reverseOperatorIndexMap[a];

        YieldDistributor distributor = YieldDistributor(
            payable(getDirectory().getYieldDistributorAddress())
        );


        distributor.finalizeInterval();

        numOperators--;

        emit OperatorRemoved(a);
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

    //----
    // INTERNAL
    //----

    function getOperatorIndex(address a) private view returns (uint) {
        require(reverseOperatorIndexMap[a] != 0, OPERATOR_NOT_FOUND_ERROR);
        return reverseOperatorIndexMap[a];
    }

    modifier onlyOperatorDistributor() {
        require(
            msg.sender == getDirectory().getOperatorDistributorAddress(),
            "Whitelist: only the OperatorDistributor may call this function!"
        );
        _;
    }


}
