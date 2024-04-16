// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import './NodeAccount.sol';
import './OperatorDistributor.sol';
import '../Utils/Errors.sol';
import '../UpgradeableBase.sol';

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import 'hardhat/console.sol';

contract NodeAccountFactory is UpgradeableBase, Errors {
    event ProxyCreated(address indexed proxyAddress);

    using Address for address;

    address public implementationAddress;

    uint256 public lockThreshhold;
    uint256 public targetBond;
    uint256 public lockUpTime;

    mapping(address => address) public minipoolNodeAccountMap;

    /**
     * @notice Initializes the factory with the logic contract address.
     * @param _implementation The address of the logic contract (OperatorAccount).
     */
    function initializeWithImplementation(address _directory, address _implementation) public initializer {
        super.initialize(_directory);
        implementationAddress = _implementation;
        lockThreshhold = 1 ether;
        lockUpTime = 28 days;
        targetBond = 8e18; // initially set for LEB8
    }

    function hasSufficentLiquidity(uint256 _bond) public view returns (bool) {
        address payable od = _directory.getOperatorDistributorAddress();
        uint256 rplRequried = OperatorDistributor(od).calculateRequiredRplTopUp(0, _bond);
        return IERC20(_directory.getRPLAddress()).balanceOf(od) >= rplRequried && od.balance >= _bond;
    }

    function createNewNodeAccount(
        NodeAccount.ValidatorConfig calldata _config,
        address _predictedAddress
    ) public payable returns (address) {
        require(hasSufficentLiquidity(_config.bondAmount), 'NodeAccount: protocol must have enough rpl and eth');
        require(msg.value == lockThreshhold, 'NodeAccount: must lock 1 ether');

        minipoolNodeAccountMap[_config.expectedMinipoolAddress] = _predictedAddress;

        Directory(_directory).grantRole(Constants.CORE_PROTOCOL_ROLE, _predictedAddress);

        // Deploy the proxy contract using create op
        ERC1967Proxy proxy = new ERC1967Proxy(
            implementationAddress,
            abi.encodeWithSelector(
                NodeAccount.initialize.selector,
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

    /**
     * @notice Sets a new lock threshold.
     * @dev Only callable by the contract owner or authorized admin.
     * @param _newLockThreshold The new lock threshold value in wei.
     */
    function setLockThreshold(uint256 _newLockThreshold) external {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        lockThreshhold = _newLockThreshold;
    }

    /**
     * @notice Sets a new target bond.
     * @dev Only callable by the contract owner or authorized admin.
     * @param _newTargetBond The new target bond value in wei.
     */
    function setTargetBond(uint256 _newTargetBond) external {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        targetBond = _newTargetBond;
    }

    /**
     * @notice Sets a new lock-up time.
     * @dev Only callable by the contract owner or authorized admin.
     * @param _newLockUpTime The new lock-up time in seconds.
     */
    function setLockUpTime(uint256 _newLockUpTime) external {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        lockUpTime = _newLockUpTime;
    }

    function setImplementation(address _implementationAddress) external {
        if (!_directory.hasRole(Constants.ADMIN_ROLE, msg.sender)) {
            revert BadRole(Constants.ADMIN_ROLE, msg.sender);
        }
        implementationAddress = _implementationAddress;
    }
}
