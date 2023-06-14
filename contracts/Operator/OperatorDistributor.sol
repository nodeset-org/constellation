// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../Base.sol";
import "../Whitelist/Whitelist.sol";
import "../Interfaces/RocketPool/IRocketStorage.sol";
import "../Interfaces/RocketPool/IMinipool.sol";
import "../Interfaces/RocketPool/IRocketNodeManager.sol";
import "../Interfaces/RocketPool/IRocketNodeStaking.sol";

import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

import "hardhat/console.sol";

contract OperatorDistributor is Base {

    uint public _queuedEth;

    constructor(address directory) Base(directory) {}

    receive() external payable {
        _queuedEth += msg.value;
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
        // check that the node operator has been added to the whitelist

        // register the operator in the whitelist if they are not already

        address withdrawalAddress = rocketStorage.getNodeWithdrawalAddress(
            nodeAddress
        );

        require(
            withdrawalAddress == getDirectory().getDepositPoolAddress(),
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

        uint256 minimumRplStake = IRocketNodeStaking(
            getDirectory().getRocketNodeStakingAddress()
        ).getNodeMinimumRPLStake(nodeAddress);

        // transfer out eth

        _queuedEth -= bond;

        payable(nodeAddress).transfer(bond);
        RocketTokenRPLInterface rpl = RocketTokenRPLInterface(
            getDirectory().RPL_CONTRACT_ADDRESS()
        );
        rpl.transfer(nodeAddress, minimumRplStake);
    }
}
