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
import './Tokens/WETHVault.sol';
import './Tokens/RPLVault.sol';

import 'hardhat/console.sol';

/// @title MerkleClaimStreamer
/// @author Mike Leach
/// @notice Allows claiming of merkle rewards and reports a "streamed" TVL value them over a specified time interval to the rest of the 
/// protocol. This prevents the TVL from updating with a significant step which would allow for sandwich attacks.
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

    // the prior interval's rewards which are "streamed" to the TVL 
    uint256 public priorEthStreamAmount;
    uint256 public priorRplStreamAmount;

    uint256 public lastClaimTime;

    uint256 public streamingInterval;

    function setStreamingInterval(uint256 newStreamingInterval) external onlyAdmin {
        require(newStreamingInterval > 0 seconds && newStreamingInterval <= 365 days, "New streaming interval must be >= 0 seconds and <= 365 days");
        require(newStreamingInterval != streamingInterval, "New streaming interval must be different");
        
        streamingInterval = newStreamingInterval;
    }

    // The admin needs to be able to disable merkle claims in case the RP rewards interval is reduced. That way, they can disable claims, then wait for
    // the current streamingInterval to be completely finished, lower the streamingInterval, and re-enable claims.
    bool public merkleClaimsEnabled;

    function setMerkleClaimsEnabled(uint256 isEnabled) external onlyAdmin {
        merkleClaimsEnabled = isEnabled;
    }
    
    constructor() initializer {}
    
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);

        merkleClaimSigExpiry = 1 days;

        streamingInterval = 28 days; // default RP rewards interval
    }

    /// @return The current amount of currently-locked TVL which is applicable to xrETH right now
    function getStreamedTvlEth() public view returns (uint256){
        uint256 timeSinceLastClaim = block.timestamp - lastClaimTime;
        return timeSinceLastClaim < streamingInterval ? priorEthStreamAmount * timeSinceLastClaim / streamingInterval : priorEthStreamAmount;
    }

    /// @return The current amount of currently-locked TVL which is applicable to xRPL right now
    function getStreamedTvlRpl() public view returns (uint256){
        uint256 timeSinceLastClaim = block.timestamp - lastClaimTime;
        return timeSinceLastClaim < streamingInterval ? priorRplStreamAmount * timeSinceLastClaim / streamingInterval : priorRplStreamAmount;
    }

    /// @notice Sweeps the full amount of streamed TVL into the rest of the protocol. Only callable if the full streaming interval has passed.
    /// @dev Typically not necessary to call, as it's automatically called during each successive merkle claim.
    /// The only reason to call this otherwise is:
    /// - if there's something wrong with the RP rewards intervals and they are not completed as expected
    /// - if RP rewards interval length changes, this can be called to sweep rewards from prior intervals before changing streamingInterval
    function sweepLockedTVL() public {
        require(block.timestamp - lastClaimTime > streamingInterval, "Current streaming interval is not finished");
        
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        
        if(priorEthStreamAmount > 0){
            (bool success, ) = od.call{value: priorEthStreamAmount};
            require(success, "Failed to transfer ETH from MerkleClaimStreamer to OperatorDistributor");
            od.rebalanceWethVault();
        }
        
        if(priorRplStreamAmount > 0){
            SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), getDirectory.getMerkleClaimStreamerAddress(), priorRplStreamAmount);
            SafeERC20.safeTransfer(IERC20(_directory.getRPLAddress()), getDirectory.getMerkleClaimStreamerAddress(), priorRplStreamAmount);
            od.rebalanceRPLVault();
        }
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
        require(merkleClaimsEnabled, "Merkle claims are disabled");

        address odAddress = getDirectory().getOperatorDistributorAddress();
        OperatorDistributor od = OperatorDistributor(odAddress);
        IERC20 rpl = IERC20(getDirectory().getRPLAddress());

        uint256 initialEthBalance = odAddress.balance;
        uint256 initialRplBalance = rpl.balanceOf(odAddress);
        
        // check signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                data.priorEthStreamAmount,
                data.priorRplStreamAmount,
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
            _directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress),
            'merkleClaim: signer must have permission from admin server role'
        );
        require(block.timestamp - data.sigGenesisTime < merkleClaimSigExpiry, 'merkle sig expired');
        merkleClaimNonce++;
        
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

        require(ethReward != 0 || rplReward != 0, "ETH and RPL rewards were both zero");

        // lock all rewards in this contract to be streamed
        od.transferMerkleClaimToStreamer(ethReward, rplReward);

        if(ethReward > 0) {
            uint256 treasuryPortion = ethReward.mulDiv(WETHVault(getDirectory().getWETHVaultAddress()).treasuryFee(), 1e18);
            uint256 nodeOperatorPortion = ethReward.mulDiv(RPLVault(getDirectory().getRPLVaultAddress()).treasuryFee(), 1e18);

            // send treasury and NO fees out immediately
            (bool success, ) = getDirectory().getTreasuryAddress().call{value: treasuryPortion}('');
            require(success, 'Transfer to treasury failed');

            (success, ) = getDirectory().getYieldDistributorAddress().call{value: nodeOperatorPortion}('');
            require(success, 'Transfer to operator fee distributor failed');

            ethReward -= treasuryPortion - nodeOperatorPortion;
        }
        this.sweepLockedTVL();
        // anything remaining at this point is just rewards for the next streaming interval 
        priorEthStreamAmount = address(this).balance;


        if(rplReward != 0) {
            uint256 treasuryPortion = rplReward.mulDiv(RPLVault(getDirectory().getRPLVaultAddress()).treasuryFee(), 1e18);

            // send treasury fee immediately
            SafeERC20.safeApprove(IERC20(getDirectory().getTreasuryAddress()), odAddress, treasuryPortion);
            SafeERC20.safeTransfer(IERC20(getDirectory().getTreasuryAddress()), odAddress, treasuryPortion);
        }
        if(priorRplStreamAmount > 0){
            // transfer the prior locked amount to the OD and rebalance liquidity
            SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), odAddress, priorRplStreamAmount);
            SafeERC20.safeTransfer(IERC20(_directory.getRPLAddress()), odAddress, priorRplStreamAmount);
            od.rebalanceRPLVault();
        }
        // anything remaining at this point is just rewards for the next streaming interval 
        priorRplStreamAmount = IERC20(_directory.getRPLAddress()).balanceOf(address(this));

        // TODO
        //
        // here:
        // 
        // elsewhere:
        // - create view functions to get TVL:
        //      rewards/28 * percentageOfIntervalComplete
        // - add sweep to tick before rebalance which reduces storage values
        
        od.rebalanceRplVault();
        
    }
}