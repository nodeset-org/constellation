// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.17;

import "../Operator/Operator.sol";

/// @custom:security-contact info@nodeset.io
interface INodeSetModule {

    function setParameter(bytes32 parameter, bytes calldata value) external; // onlyAdmin

    function getParameter(bytes32 parameter) external returns(bytes memory);

    function distributeRewards() external;

    function getOperators() external returns(Operator[] memory);

    function getAdmin() external returns(address);

    function setProviders() external; // onlyAdmin

    
    //specify, verify
}