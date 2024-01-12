// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './OperatorDistributor.sol';
import '../Whitelist/Whitelist.sol';
import '../Utils/ProtocolMath.sol';
import '../UpgradeableBase.sol';

import '../Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol';
import '../Interfaces/RocketTokenRPLInterface.sol';
import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../Interfaces/IWETH.sol';
import '../Utils/Constants.sol';

/// @custom:security-contact info@nodeset.io
/// @notice distributes rewards in weth to node operators
contract OperatorAccount is UpgradeableBase {

    /**
     * @notice Initializes the contract with the specified directory address and sets the initial configurations.
     * validator settings.
     * @param _directory The address of the directory contract or service that this contract will reference.
     */
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);
    }


    function deposit() external {

    }

    function close() external {
        
    }

}