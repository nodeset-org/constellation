// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import './ValidatorAccount.sol';
import './OperatorDistributor.sol';
import '../Utils/Errors.sol';
import '../UpgradeableBase.sol';

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import 'hardhat/console.sol';

contract ValidatorAccountFactory is UpgradeableBase, Errors {
    using Address for address;

    address public implementationAddress;

    event ProxyCreated(address indexed proxyAddress);

    uint256 public lockThreshhold;

    /**
     * @notice Initializes the factory with the logic contract address.
     * @param _implementation The address of the logic contract (OperatorAccount).
     */
    function initializeWithImplementation(address _directory, address _implementation) public initializer {
        super.initialize(_directory);
        implementationAddress = _implementation;
        lockThreshhold = 1 ether;
    }

    function hasSufficentLiquidity(uint256 _bond) public view returns (bool) {
        address payable od = _directory.getOperatorDistributorAddress();
        uint256 rplRequried = OperatorDistributor(od).calculateRequiredRplTopUp(0, _bond);
        return IERC20(_directory.getRPLAddress()).balanceOf(od) >= rplRequried && od.balance >= _bond;
    }

    function createNewValidatorAccount(
        ValidatorAccount.ValidatorConfig calldata _config,
        address _predictedAddress
    ) public payable returns (address) {
        require(hasSufficentLiquidity(_config.bondAmount), 'ValidatorAccount: protocol must have enough rpl and eth');
        require(msg.value == lockThreshhold, 'ValidatorAccount: must lock 1 ether');

        Directory(_directory).grantRole(Constants.CORE_PROTOCOL_ROLE, _predictedAddress);

        // Deploy the proxy contract using create
        ERC1967Proxy proxy = new ERC1967Proxy(
            implementationAddress,
            abi.encodeWithSelector(
                ValidatorAccount.initialize.selector,
                address(_directory),
                msg.sender,
                _predictedAddress,
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
