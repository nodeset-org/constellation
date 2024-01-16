// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import './ValidatorAccount.sol'; // Import your logic contract
import "../Utils/Errors.sol";

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';

contract ValidatorAccountFactory is UpgradeableBase, Errors {
    using Address for address;

    address public implementationAddress;

    event ProxyCreated(address indexed proxyAddress);


    /**
     * @notice Initializes the factory with the logic contract address.
     * @param _implementation The address of the logic contract (OperatorAccount).
     */
    function initialize(address _implementation) public override initializer {
        super.initialize(_implementation);
        implementationAddress = _implementation;
    }

    /**
     * @notice Deploys a new UUPS Proxy linked to the logic contract.
     * @return address The address of the newly deployed proxy.
     */
    function createNewValidatorAccount(address _nodeOperator) public returns (address) {
        if(msg.sender != _nodeOperator) {
            revert BadSender(_nodeOperator);
        }

        ERC1967Proxy proxy = new ERC1967Proxy(
            implementationAddress,
            abi.encodeWithSelector(ValidatorAccount.initialize.selector, address(_directory), _nodeOperator)
        );
        emit ProxyCreated(address(proxy));
        return address(proxy);
    }

    /**
     * @notice Upgrades an existing proxy to a new implementation.
     * @param proxyAddress The address of the proxy to be upgraded.
     * @param newImplementation The address of the new logic contract.
     */
    function upgradeValidatorAccountProxy(address proxyAddress, address newImplementation) public {
        if (!Address.isContract(proxyAddress)) {
            revert NotAContract(proxyAddress);
        }
        
        // Perform a low-level call to the 'upgradeTo' function of the ERC1967Proxy
        (bool success, bytes memory data) = proxyAddress.call(abi.encodeWithSignature('upgradeTo(address)', newImplementation));

        if(!success) {
            revert LowLevelCall(success, data);
        }
    }
}
