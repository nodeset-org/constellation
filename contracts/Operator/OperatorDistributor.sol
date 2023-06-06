// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../Base.sol";
import "../Whitelist/Whitelist.sol";
import "../Interfaces/RocketPool/IRocketStorage.sol";
import "../Interfaces/RocketPool/IMinipool.sol";
import "../Interfaces/RocketPool/IRocketNodeManager.sol";
import "../Interfaces/RocketPool/IRocketNodeStaking.sol";

import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

contract OperatorDistributor is Base {
    uint public _queuedEth;
    uint public _queuedRpl;

    constructor(address directory) Base(directory) {}

    receive() external payable {
        _queuedEth += msg.value;
    }

    /// @notice requires that the caller approve the contract to transfer RPL
    /// @param amount The amount of RPL to queue
    function queueRpl(uint amount) public {
        IERC20 rpl = IERC20(getDirectory().getRPLTokenAddress());
        require(
            rpl.allowance(msg.sender, address(this)) >= amount,
            "OperatorDistributor: must approve RPL transfer"
        );
        rpl.transferFrom(msg.sender, address(this), amount);
        _queuedRpl += amount;
    }

    /// @notice only callable from the deposit pool
    /// @param amount The amount of RPL received from the deposit pool
    function queueRplProtocolOnly(uint amount) external onlyDepositPool {
        _queuedRpl += amount;
    }

    function reimburseNodeForMinipool(bytes memory sig, address newMinipoolAdress) public {

        // validate that the newMinipoolAdress was signed by the admin address
        bytes32 signedMessageHash = keccak256(abi.encode(newMinipoolAdress, "address"));
        address signer = ECDSAUpgradeable.recover(signedMessageHash, sig);
        require(signer == getDirectory().getAdminAddress(), "OperatorDistributor: invalid signature");


        IMinipool minipool = IMinipool(newMinipoolAdress);
        address nodeAddress = minipool.getNodeAddress();
        Whitelist whitelist = Whitelist(getDirectory().getWhitelistAddress());
        require(
            whitelist.getIsAddressInWhitelist(nodeAddress),
            "OperatorDistributor: minipool node operator not in whitelist"
        );


        IRocketStorage rocketStorage = IRocketStorage(
            getDirectory().getRocketStorageAddress()
        );
        // check that the node operator has been added to the whitelist

        // register the operator in the whitelist if they are not already


        address withdrawlAddress = rocketStorage.getNodeWithdrawalAddress(
            nodeAddress
        );

        require(
            withdrawlAddress == getDirectory().getDepositPoolAddress(),
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

        require(
            _queuedRpl >= minimumRplStake,
            "OperatorDistributor: insufficient RPL in queue"
        );

        // transfer out eth and rpl

        _queuedEth -= bond;
        _queuedRpl -= minimumRplStake;

        payable(nodeAddress).transfer(bond);
        RocketTokenRPLInterface rpl = RocketTokenRPLInterface(
            getDirectory().RPL_CONTRACT_ADDRESS()
        );
        rpl.transfer(nodeAddress, minimumRplStake);
    }
}
