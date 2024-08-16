// SPDX-License-Identifier: GPL v3

pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/math/Math.sol';

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

    using Math for uint256;

    event MerkleClaimSubmitted(
        uint256 indexed timestamp, 
        uint256 newEthRewards, 
        uint256 newRplRewards,
        uint256 ethTreasuryPortion, 
        uint256 ethOperatorPortion, 
        uint256 rplTreasuryPortion
        );

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

    function setMerkleClaimsEnabled(bool isEnabled) external onlyAdmin {
        merkleClaimsEnabled = isEnabled;
    }
    
    constructor() initializer {}
    
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);
        streamingInterval = 28 days; // default RP rewards interval
        merkleClaimsEnabled = true;
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
    function sweepLockedTVL() public onlyProtocolOrAdmin {
        require(block.timestamp - lastClaimTime > streamingInterval, "Current streaming interval is not finished");
        require(priorEthStreamAmount > 0 || priorRplStreamAmount > 0, "both ethAmount and rplAmount are 0 -- nothing to do");
        
        address payable odAddress = getDirectory().getOperatorDistributorAddress();
        OperatorDistributor od = OperatorDistributor(odAddress);

        if(priorEthStreamAmount > 0){
            (bool success, ) = odAddress.call{value: priorEthStreamAmount}("");
            require(success, "Failed to transfer ETH from MerkleClaimStreamer to OperatorDistributor");
            od.rebalanceWethVault();
        }
        
        if(priorRplStreamAmount > 0){
            SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), getDirectory().getMerkleClaimStreamerAddress(), priorRplStreamAmount);
            SafeERC20.safeTransfer(IERC20(_directory.getRPLAddress()), getDirectory().getMerkleClaimStreamerAddress(), priorRplStreamAmount);
            od.rebalanceRplVault();
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
    function submitMerkleClaim(
        uint256[] calldata rewardIndex,
        uint256[] calldata amountRPL,
        uint256[] calldata amountETH,
        bytes32[][] calldata merkleProof
    ) public {
        require(merkleClaimsEnabled, "Merkle claims are disabled");

        address payable odAddress = getDirectory().getOperatorDistributorAddress();
        OperatorDistributor od = OperatorDistributor(odAddress);

        uint256 initialEthBalance = odAddress.balance;
        uint256 initialRplBalance = IERC20(getDirectory().getRPLAddress()).balanceOf(odAddress);
        
        od.submitMerkleClaim(rewardIndex, amountRPL, amountETH, merkleProof);

        uint256 ethReward = odAddress.balance - initialEthBalance;
        uint256 rplReward = IERC20(getDirectory().getRPLAddress()).balanceOf(odAddress) - initialRplBalance;

        require(ethReward != 0 || rplReward != 0, "ETH and RPL rewards were both zero");

        // lock all rewards in this contract to be streamed
        od.transferMerkleClaimToStreamer(ethReward, rplReward);

        uint256 ethTreasuryPortion = 0;
        uint256 ethOperatorPortion = 0;
        uint256 rplTreasuryPortion = 0;

        // process ETH fees
        if(ethReward > 0) {
            ethTreasuryPortion = ethReward.mulDiv(WETHVault(getDirectory().getWETHVaultAddress()).treasuryFee(), 1e18, Math.Rounding.Up);
            ethOperatorPortion = ethReward.mulDiv(RPLVault(getDirectory().getRPLVaultAddress()).treasuryFee(), 1e18, Math.Rounding.Up);

            // send treasury and NO fees out immediately
            (bool success, ) = getDirectory().getTreasuryAddress().call{value: ethTreasuryPortion}('');
            require(success, 'Transfer to treasury failed');

            (success, ) = getDirectory().getOperatorRewardAddress().call{value: ethOperatorPortion}('');
            require(success, 'Transfer to operator fee distributor failed');
        }
        
        // process RPL fees
        if(rplReward > 0) {
            rplTreasuryPortion = 0;//rplReward.mulDiv(RPLVault(getDirectory().getRPLVaultAddress()).treasuryFee(), 1e18);

            // send treasury fee immediately
            SafeERC20.safeApprove(IERC20(getDirectory().getRPLAddress()), getDirectory().getTreasuryAddress(), rplTreasuryPortion);
            SafeERC20.safeTransfer(IERC20(getDirectory().getRPLAddress()), getDirectory().getTreasuryAddress(), rplTreasuryPortion);
        }

        emit MerkleClaimSubmitted(block.timestamp, ethReward, rplReward, ethTreasuryPortion, ethOperatorPortion, rplTreasuryPortion);

        // sweep all the prior interval's TVL
        this.sweepLockedTVL();

        // anything remaining at this point is counted as rewards for the next streaming interval 
        priorRplStreamAmount = IERC20(_directory.getRPLAddress()).balanceOf(address(this));
        priorEthStreamAmount = address(this).balance;
    }
}