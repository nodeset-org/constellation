// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import './ValidatorAccount.sol'; // Import your logic contract
import '../Utils/Errors.sol';
import '../UpgradeableBase.sol';

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';

contract ValidatorAccountFactory is UpgradeableBase, Errors {
    using Address for address;

    address public implementationAddress;

    event ProxyCreated(address indexed proxyAddress);

    uint256 public lockThreshhold;

    /**
     * @notice Initializes the factory with the logic contract address.
     * @param _implementation The address of the logic contract (OperatorAccount).
     */
    function initialize(address _implementation) public override initializer {
        super.initialize(_implementation);
        implementationAddress = _implementation;
        lockThreshhold = 1 ether;
    }

    /**
     * @notice Deploys a new UUPS Proxy linked to the logic contract.
     * @return address The address of the newly deployed proxy.
     */
    function createNewValidatorAccount(
        ValidatorAccount.ValidatorConfig calldata _config
    ) public payable returns (address) {
        // TODO: check TVL conditions and revert on top of function stack
        require(msg.value == lockThreshhold, 'ValidatorAccount: must lock 1 ether');

        ERC1967Proxy proxy = new ERC1967Proxy{value: 1 ether}(
            implementationAddress,
            abi.encodeWithSelector(
                ValidatorAccount.initialize.selector,
                address(_directory),
                msg.sender,
                _config
            )
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
        (bool success, bytes memory data) = proxyAddress.call(
            abi.encodeWithSignature('upgradeTo(address)', newImplementation)
        );

        if (!success) {
            revert LowLevelCall(success, data);
        }
    }
}
