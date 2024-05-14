// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import './NodeAccount.sol';
import './OperatorDistributor.sol';
import '../Utils/Errors.sol';
import '../UpgradeableBase.sol';

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import 'hardhat/console.sol';


// can probz delete fully
contract NodeAccountFactory is UpgradeableBase, Errors {
    event ProxyCreated(address indexed proxyAddress);

    using Address for address;

    mapping(address => address) public minipoolNodeAccountMap;

    /**
     * @notice Initializes the factory with the logic contract address.
     * @param _implementation The address of the logic contract (OperatorAccount).
     */
    function initializeWithImplementation(address _directory, address _implementation) public initializer {
        super.initialize(_directory);
    }

    function hasSufficentLiquidity(uint256 _bond) public view returns (bool) {
        address payable od = _directory.getOperatorDistributorAddress();
        uint256 rplRequried = OperatorDistributor(od).calculateRequiredRplTopUp(0, _bond);
        return IERC20(_directory.getRPLAddress()).balanceOf(od) >= rplRequried && od.balance >= _bond;
    }

    function createNewNodeAccount(
        NodeAccount.ValidatorConfig calldata _config,
        address _predictedAddress,
        bytes memory _sig
    ) public payable returns (address) {
        require(hasSufficentLiquidity(_config.bondAmount), 'NodeAccount: protocol must have enough rpl and eth');

        minipoolNodeAccountMap[_config.expectedMinipoolAddress] = _predictedAddress;

        Directory(_directory).grantRole(Constants.CORE_PROTOCOL_ROLE, _predictedAddress);

    }

    /**
     * @notice Upgrades an existing proxy to a new implementation.
     * @param proxyAddress The address of the proxy to be upgraded.
     * @param newImplementation The address of the new logic contract.
     */
    function upgradeNodeAccountProxy(address proxyAddress, address newImplementation) public {
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
