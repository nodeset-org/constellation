// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../UpgradeableBase.sol";
import "../Operator/Operator.sol";
import "../Operator/YieldDistributor.sol";

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

        numOperators++;

        distributor.finalizeInterval();

        uint256 nextInterval = distributor.currentInterval();
        Operator memory operator = Operator(block.timestamp, 0, nextInterval);
        // operator will be entitled to rewards in the next interval

        operatorMap[a] = operator;
        operatorIndexMap[numOperators] = a;
        reverseOperatorIndexMap[a] = numOperators + 1;

        emit OperatorAdded(operator);
    }

    function removeOperator(address nodeOperator) public onlyAdmin {
        _permissions[nodeOperator] = false;

        delete operatorMap[nodeOperator];
        uint index = reverseOperatorIndexMap[nodeOperator] - 1;
        delete operatorIndexMap[index];
        delete reverseOperatorIndexMap[nodeOperator];


        OperatorDistributor odistributor = OperatorDistributor(
            payable(getDirectory().getOperatorDistributorAddress())
        );

        odistributor.removeNodeOperator(nodeOperator);

        YieldDistributor ydistributor = YieldDistributor(
            payable(getDirectory().getYieldDistributorAddress())
        );


        ydistributor.finalizeInterval();

        numOperators--;

        emit OperatorRemoved(nodeOperator);
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
