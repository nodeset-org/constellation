// SPDX-License-Identifier: GPL v3

pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

import './Interfaces/Oracles/IConstellationOracle.sol';
import './Interfaces/RocketPool/IRocketNetworkPrices.sol';
import './Interfaces/RocketPool/IRocketNetworkPenalties.sol';

import './Interfaces/RocketPool/IRocketMerkleDistributorMainnet.sol';

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import './UpgradeableBase.sol';
import './Utils/Constants.sol';
import './Operator/OperatorDistributor.sol';

import 'hardhat/console.sol';

/// @title MerkleClaimStreamer
/// @author Mike Leach
/// @notice Allows claiming of merkle rewards and streams them over a specified time period to the rest of the 
/// protocol. This prevents the TVL from updating with a significant step which would allow for sandwich attacks.abi
/// See this issue with Rocket Pool for a deeper description: https://consensys.io/diligence/audits/2021/04/rocketpool/#rockettokenreth---sandwiching-opportunity-on-price-updates
contract MerkleClaimStreamer is UpgradeableBase {

    struct MerkleRewardsData {
        bytes sig;
        uint256 sigGenesisTime;

        // fees to apply to the merkle rewards
        uint256 ethTreasuryFee;
        uint256 ethOperatorFee;
        uint256 rplTreasuryFee;

        // the expected values to stream out
        uint256 priorEthStreamAmount; 
        uint256 priorRplStreamAmount;
    }

    // Merkle claim signature data
    uint256 public merkleClaimNonce;
    mapping(bytes32 => bool) public merkleClaimSigUsed;
    uint256 public merkleClaimSigExpiry;

    uint256 public streamingPeriod;

    constructor() initializer {}
    
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);

        merkleClaimSigExpiry = 1 days;

        streamingPeriod = 28 days; // default RP rewards period
    }

    /**
     * @notice Claims rewards for a node based on a Merkle proof, distributing specified amounts of RPL and ETH.
     * @dev This function interfaces with the RocketMerkleDistributorMainnet to allow nodes to claim their rewards.
     *      The rewards are determined by a Merkle proof which validates the amounts to be claimed.
     * @param rewardIndex Array of indices in the Merkle tree corresponding to reward entries.
     * @param amountRPL Array of amounts of RPL tokens to claim.
     * @param amountETH Array of amounts of ETH to claim.
     * @param merkleProof Array of Merkle proofs for each reward entry.
     */
    function merkleClaim(
        uint256[] calldata rewardIndex,
        uint256[] calldata amountRPL,
        uint256[] calldata amountETH,
        bytes32[][] calldata merkleProof,
        MerkleRewardsData calldata data
    ) public {
        address odAddress = _directory.getOperatorDistributorAddress();
        IERC20 rpl = IERC20(_directory.getRPLAddress());

        uint256 initialEthBalance = odAddress.balance;
        uint256 initialRplBalance = rpl.balanceOf(odAddress);

        IRocketMerkleDistributorMainnet(_directory.getRocketMerkleDistributorMainnetAddress()).claim(
            address(getDirectory().getSuperNodeAddress()),
            rewardIndex,
            amountRPL,
            amountETH,
            merkleProof
        );

        uint256 finalEthBalance = odAddress.balance;
        uint256 finalRplBalance = rpl.balanceOf(odAddress);

        uint256 ethReward = finalEthBalance - initialEthBalance;
        uint256 rplReward = finalRplBalance - initialRplBalance;

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                data.priorEthStreamAmount,
                data.priorRplStreamAmount,
                data.ethTreasuryFee,
                data.ethOperatorFee,
                data.rplTreasuryFee,
                data.sigGenesisTime,
                address(this),
                merkleClaimNonce,
                block.chainid
            )
        );
        require(!merkleClaimSigUsed[messageHash], 'merkle sig already used');
        merkleClaimSigUsed[messageHash] = true;
        address recoveredAddress = ECDSA.recover(ECDSA.toEthSignedMessageHash(messageHash), data.sig);
        require(
            _directory.hasRole(Constants.ADMIN_ORACLE_ROLE, recoveredAddress),
            'merkleClaim: signer must have permission from admin oracle role'
        );
        require(block.timestamp - data.sigGenesisTime < merkleClaimSigExpiry, 'merkle sig expired');
        merkleClaimNonce++;
        

        // TODO
        //
        // here:
        // call into OperatorDistributor (withdrawal address) to immediately lock up any 
        //      claimed rewards into this contract
        // move any remaining balance from last rewards period over to protocol immediately
        // set ETH and RPL storage values for amount of rewards to stream
        // 
        // elsewhere:
        // create view functions to get TVL:
        //      (rewards/28 * percentageOfPeriodComplete) OR deposit fee, whichever lower
        // add sweep to tick before rebalance which reduces storage values


        OperatorDistributor od = OperatorDistributor(payable(odAddress));
        od.onEthRewardsReceived(ethReward, data.ethTreasuryFee, data.ethOperatorFee, false);
        od.onRplRewardsRecieved(rplReward, data.rplTreasuryFee);
        od.rebalanceRplVault();
        od.rebalanceWethVault();
    }
}