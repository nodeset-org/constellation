// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import './OperatorAccount.sol'; // Import your logic contract

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';

contract OperatorFactory is UpgradeableBase {
    using Address for address;

    address public implementationAddress;

    event ProxyCreated(address indexed proxyAddress);

    error NotAContract(address addr);

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
    function deployNewProxy() public returns (address) {
        ERC1967Proxy proxy = new ERC1967Proxy(
            implementationAddress,
            abi.encodeWithSelector(OperatorAccount(address(0)).initialize.selector, msg.sender)
        );
        emit ProxyCreated(address(proxy));
        return address(proxy);
    }

    /**
     * @notice Upgrades an existing proxy to a new implementation.
     * @param proxyAddress The address of the proxy to be upgraded.
     * @param newImplementation The address of the new logic contract.
     */
    function upgradeProxy(address proxyAddress, address newImplementation) public {
        if (!Address.isContract(proxyAddress)) {
            revert NotAContract(proxyAddress);
        }
        
        // Perform a low-level call to the 'upgradeTo' function of the ERC1967Proxy
        (bool success, ) = proxyAddress.call(abi.encodeWithSignature('upgradeTo(address)', newImplementation));

        require(success, 'OperatorFactory: Upgrade failed');
    }
}
