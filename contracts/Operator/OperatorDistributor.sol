// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../Base.sol";
import "../Whitelist/Whitelist.sol";
import "../DepositPool.sol";
import "../Interfaces/RocketPool/IRocketStorage.sol";
import "../Interfaces/RocketPool/IMinipool.sol";
import "../Interfaces/RocketPool/IRocketNodeManager.sol";
import "../Interfaces/RocketPool/IRocketNodeStaking.sol";

import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

import "hardhat/console.sol";

contract OperatorDistributor is Base {
    uint public _queuedEth;

    address[] public minipoolAddresses;
    mapping(address => uint256) public minipoolIndexMap;
    uint256 public nextMinipoolHavestIndex;

    constructor(address directory) Base(directory) {}

    event WarningNoMiniPoolsToHarvest();

    receive() external payable {
        _queuedEth += msg.value;
    }

    function removeMinipoolAddress(
        address _address
    ) external onlyYieldDistrubutor {
        uint index = minipoolIndexMap[_address] - 1;
        require(index < minipoolAddresses.length, "Address not found.");

        // Move the last address into the spot located by index
        address lastAddress = minipoolAddresses[minipoolAddresses.length - 1];
        minipoolAddresses[index] = lastAddress;
        minipoolIndexMap[lastAddress] = index;
        // Remove the last address
        minipoolAddresses.pop();
        delete minipoolIndexMap[_address];
    }

    function reimburseNodeForMinipool(
        bytes memory sig,
        address newMinipoolAdress
    ) public {
        IMinipool minipool = IMinipool(newMinipoolAdress);
        address nodeAddress = minipool.getNodeAddress();
        Whitelist whitelist = Whitelist(getDirectory().getWhitelistAddress());
        require(
            whitelist.getIsAddressInWhitelist(nodeAddress),
            "OperatorDistributor: minipool node operator not in whitelist"
        );

        // validate that the newMinipoolAdress was signed by the admin address
        bytes32 messageHash = keccak256(abi.encode(newMinipoolAdress));
        bytes32 ethSignedMessageHash = ECDSAUpgradeable.toEthSignedMessageHash(
            messageHash
        );
        address signer = ECDSAUpgradeable.recover(ethSignedMessageHash, sig);
        require(
            signer == getDirectory().getAdminAddress(),
            "OperatorDistributor: invalid signature"
        );

        IRocketStorage rocketStorage = IRocketStorage(
            getDirectory().getRocketStorageAddress()
        );

        address withdrawalAddress = rocketStorage.getNodeWithdrawalAddress(
            nodeAddress
        );

        address depositPoolAddr = getDirectory().getDepositPoolAddress();

        require(
            withdrawalAddress == depositPoolAddr,
            "OperatorDistributor: minipool must delegate control to deposit pool"
        );

        IRocketNodeManager nodeManager = IRocketNodeManager(
            getDirectory().getRocketNodeManagerAddress()
        );

        require(
            nodeManager.getSmoothingPoolRegistrationState(nodeAddress),
            "OperatorDistributor: minipool must be registered in smoothing pool"
        );

        uint256 bond = minipool.getNodeDepositBalance();

        require(
            _queuedEth >= bond,
            "OperatorDistributor: insufficient ETH in queue"
        );

        DepositPool depositPool = DepositPool(payable(depositPoolAddr));
        depositPool.stakeRPLFor(nodeAddress);

        // add minipool to minipoolAddresses
        minipoolAddresses.push(newMinipoolAdress);
        minipoolIndexMap[newMinipoolAdress] = minipoolAddresses.length;

        // transfer out eth
        _queuedEth -= bond;
        payable(nodeAddress).transfer(bond);
    }

    function harvestNextMinipool() external onlyYieldDistrubutor {
        if (minipoolAddresses.length == 0) {
            emit WarningNoMiniPoolsToHarvest();
            return;
        }

        uint256 index = nextMinipoolHavestIndex % minipoolAddresses.length;

        IMinipool minipool = IMinipool(minipoolAddresses[index]);

        if (minipool.userDistributeAllowed()) {
            minipool.distributeBalance(true);
        } else {
            minipool.beginUserDistribute();
        }

        nextMinipoolHavestIndex = index + 1;
    }
}
