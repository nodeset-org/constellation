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

    uint256 public nextMinipoolHavestIndex;

    mapping(address => uint256) public minipoolIndexMap;
    mapping(address => uint256) public minipoolAmountFundedEth;
    mapping(address => uint256) public minipoolAmountFundedRpl;

    mapping(address => address[]) nodeOperatorOwnedMinipools;

    constructor(address directory) Base(directory) {}

    event WarningNoMiniPoolsToHarvest();

    receive() external payable {
        _queuedEth += msg.value;
    }

    function getAmountFundedEth() public view returns (uint256) {
        uint256 amountFunded;
        for(uint i = 0; i < minipoolAddresses.length; i++) {
            amountFunded += minipoolAmountFundedEth[minipoolAddresses[i]];
        }
        return amountFunded;
    }

    function getAmountFundedRpl() public view returns (uint256) {
        uint256 amountFunded;
        for(uint i = 0; i < minipoolAddresses.length; i++) {
            amountFunded += minipoolAmountFundedRpl[minipoolAddresses[i]];
        }
        return amountFunded;
    }

    /// @notice Gets the total ETH value locked inside the protocol, including inside of validators, the OperatorDistributor,
    // and this contract.
    function getTvlEth() public view returns (uint) {
        return address(this).balance + getAmountFundedEth();
    }

    /// @notice Gets the total RPL value locked inside the protocol, including inside of validators, the OperatorDistributor,
    // and this contract.
    function getTvlRpl() public view returns (uint) {
        return
            RocketTokenRPLInterface(_directory.RPL_CONTRACT_ADDRESS())
                .balanceOf(address(this)) + getAmountFundedRpl();
    }

    /// @notice Should be called by admin server when a node operator exists a minipool
    function removeMinipoolAddress(
        address _address
    ) public onlyWhitelistOrAdmin {
        uint index = minipoolIndexMap[_address] - 1;
        require(index < minipoolAddresses.length, "Address not found.");

        // Move the last address into the spot located by index
        address lastAddress = minipoolAddresses[minipoolAddresses.length - 1];
        minipoolAddresses[index] = lastAddress;
        minipoolIndexMap[lastAddress] = index;
        // Remove the last address
        minipoolAddresses.pop();
        delete minipoolIndexMap[_address];

        // Set amount funded to 0 since it's being returned to DP
        minipoolAmountFundedEth[_address] = 0;
        minipoolAmountFundedRpl[_address] = 0;
    }

    function removeNodeOperator(
        address _address
    ) external onlyWhitelistOrAdmin {
        // remove all minipools owned by node operator
        address[] memory minipools = nodeOperatorOwnedMinipools[_address];
        for(uint i = 0; i < minipools.length; i++) {
            removeMinipoolAddress(minipools[i]);
        }
        delete nodeOperatorOwnedMinipools[_address];
    }

    function _stakeRPLFor(address _nodeAddress) internal {
        IRocketNodeStaking nodeStaking = IRocketNodeStaking(
            getDirectory().getRocketNodeStakingAddress()
        );
        uint256 minimumRplStake = IRocketNodeStaking(
            getDirectory().getRocketNodeStakingAddress()
        ).getNodeMinimumRPLStake(_nodeAddress);

        // approve the node staking contract to spend the RPL
        RocketTokenRPLInterface rpl = RocketTokenRPLInterface(
            getDirectory().RPL_CONTRACT_ADDRESS()
        );
        require(
            rpl.approve(
                getDirectory().getRocketNodeStakingAddress(),
                minimumRplStake
            )
        );

        // update amount funded rpl
        minipoolAmountFundedRpl[_nodeAddress] = minimumRplStake;

        nodeStaking.stakeRPLFor(_nodeAddress, minimumRplStake);
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

        _stakeRPLFor(nodeAddress);

        // new minipool owned by node operator
        nodeOperatorOwnedMinipools[nodeAddress].push(newMinipoolAdress);

        // add minipool to minipoolAddresses
        minipoolAddresses.push(newMinipoolAdress);
        minipoolIndexMap[newMinipoolAdress] = minipoolAddresses.length;

        // updated amount funded eth
        minipoolAmountFundedEth[newMinipoolAdress] = bond;

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
