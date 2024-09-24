// SPDX-License-Identifier: GPL v3

/**
  *    /***        /***          /******                                  /**               /** /**             /**     /**                    
  *   /**_/       |_  **        /**__  **                                | **              | **| **            | **    |__/                    
  *  | **   /** /** | **       | **  \__/  /******  /*******   /******* /******    /****** | **| **  /******  /******   /**  /******  /******* 
  *  /***  |__/|__/ | ***      | **       /**__  **| **__  ** /**_____/|_  **_/   /**__  **| **| ** |____  **|_  **_/  | ** /**__  **| **__  **
  * |  **           | **       | **      | **  \ **| **  \ **|  ******   | **    | ********| **| **  /*******  | **    | **| **  \ **| **  \ **
  *  \ **   /** /** | **       | **    **| **  | **| **  | ** \____  **  | ** /* | **_____/| **| ** /**__  **  | ** /* | **| **  | **| **  | **
  *  |  ***|__/|__/***         |  ******||  ****** | **  | ** /*******   | ****  |  *******| **| **| ********  | ****  | **|  ****** | **  | **
  *   \___/       |___/         \______/  \______/ |__/  |__/|_______/    \___/   \_______/|__/|__/ \_______/   \___/  |__/ \______/ |__/  |__/
  *
  *  A liquid staking protocol extending Rocket Pool.
  *  Made w/ <3 by {::}
  *
  *  For more information, visit https://nodeset.io
  *
  *  @author Mike Leach (Wander), Nick Steinhilber (NickS), Theodore Clapp (mryamz), Joe Clapis (jcrtp), Huy Nguyen, Andy Rose (Barbalute)
  *  @custom:security-info https://docs.nodeset.io/nodeset/security-notice
  **/

pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/math/Math.sol';

import '../Interfaces/RocketPool/IRocketMerkleDistributorMainnet.sol';

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import './Utils/UpgradeableBase.sol';
import './Utils/Constants.sol';
import './OperatorDistributor.sol';
import './WETHVault.sol';
import './RPLVault.sol';

/// @title MerkleClaimStreamer
/// @author Mike Leach, Theodore Clapp
/// @notice Allows claiming of merkle rewards and reports a "streamed" value for these assets over a specified time interval to the rest of the 
/// protocol. This prevents the TVL from updating with a significant step which would allow for sandwich attacks.
/// See this issue with Rocket Pool for a deeper description: https://consensys.io/diligence/audits/2021/04/rocketpool/#rockettokenreth---sandwiching-opportunity-on-price-updates
contract MerkleClaimStreamer is UpgradeableBase {

    using Math for uint256;

    event StreamingIntervalChanged(uint256 oldValue, uint256 newValue);
    event MerkleClaimsEnabledChanged(bool oldValue, bool newValue);

    event MerkleClaimSubmitted(
        uint256 indexed timestamp, 
        uint256 newEthRewards, 
        uint256 newRplRewards,
        uint256 ethTreasuryPortion, 
        uint256 ethOperatorPortion, 
        uint256 rplTreasuryPortion
        );

    // the prior interval's rewards which are "streamed" to the TVL 
    uint256 public priorEthStreamAmount; // slot 67
    uint256 public priorRplStreamAmount; // slot 68

    uint256 public lastClaimTime; // slot 69

    uint256 public streamingInterval;

    // The admin needs to be able to disable merkle claims in case the RP rewards interval is reduced. That way, they can disable claims, then wait for
    // the current streamingInterval to be completely finished, lower the streamingInterval, and re-enable claims.
    bool public merkleClaimsEnabled;
    
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);
        streamingInterval = 28 days; // default RP rewards interval
        merkleClaimsEnabled = true;
    }

    /// @notice Sets the streaming interval for the MerkleClaimStreamer, which should match the RP rewards interval
    /// @param _newStreamingInterval The new streaming interval in seconds
    /// @dev This may also need to be called if there's something wrong with the RP rewards intervals and they are not completed as expected
    /// if that's the case, the admin should simply change the streaming interval to something else and then immediately back again to trigger
    /// the sweepLockedTVL function
    function setStreamingInterval(uint256 _newStreamingInterval) external onlyAdmin {
        require(_newStreamingInterval > 0 seconds && _newStreamingInterval <= 365 days, "New streaming interval must be > 0 seconds and <= 365 days");
        require(_newStreamingInterval != streamingInterval, "MerkleClaimStreamer: new streaming interval must be different");
        
        this.sweepLockedTVL();

        emit StreamingIntervalChanged(streamingInterval, _newStreamingInterval);
        streamingInterval = _newStreamingInterval;
    }

    function setMerkleClaimsEnabled(bool _isEnabled) external onlyAdmin {
        require(_isEnabled != merkleClaimsEnabled, "MerkleClaimStreamer: new merkleClaimsEnabled value must be different");
        emit MerkleClaimsEnabledChanged(merkleClaimsEnabled, _isEnabled);
        merkleClaimsEnabled = _isEnabled;
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

    /// @notice Updates the prior streamed amounts to reflect the current balances
    /// @dev Called automatically during a merkle claim submission or if the streaming interval is changed
    function updatePriorStreamAmounts() internal {
        priorRplStreamAmount = IERC20(_directory.getRPLAddress()).balanceOf(address(this));
        priorEthStreamAmount = address(this).balance;
    }

    /// @notice Sweeps the full amount of streamed TVL into the rest of the protocol. Only callable if the full streaming interval has passed.
    /// @dev Called automatically during a merkle claim submission or if the streaming interval is changed
    function sweepLockedTVL() public onlyProtocol {
        require(block.timestamp - lastClaimTime > streamingInterval, "Current streaming interval is not finished");
        if(priorEthStreamAmount == 0 && priorRplStreamAmount == 0) {
            updatePriorStreamAmounts();
            return; // if both ethAmount and rplAmount are 0 there is nothing to do except update state
        }
        
        address payable odAddress = getDirectory().getOperatorDistributorAddress();
        OperatorDistributor od = OperatorDistributor(odAddress);

        if(priorEthStreamAmount > 0){
            (bool success, ) = odAddress.call{value: priorEthStreamAmount}("");
            require(success, "Failed to transfer ETH from MerkleClaimStreamer to OperatorDistributor");
            od.rebalanceWethVault();
        }
        
        if(priorRplStreamAmount > 0){
            SafeERC20.safeTransfer(IERC20(_directory.getRPLAddress()), odAddress, priorRplStreamAmount);
            od.rebalanceRplVault();
        }

        updatePriorStreamAmounts();
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
        
        // note: will revert if both amountRPLR and amountETH are zero
        od.submitMerkleClaim(rewardIndex, amountRPL, amountETH, merkleProof);

        uint256 ethReward = odAddress.balance - initialEthBalance;
        uint256 rplReward = IERC20(getDirectory().getRPLAddress()).balanceOf(odAddress) - initialRplBalance;

        // lock all rewards in this contract to be streamed
        od.transferMerkleClaimToStreamer(ethReward, rplReward);

        uint256 ethTreasuryPortion = 0;
        uint256 ethOperatorPortion = 0;
        uint256 rplTreasuryPortion = 0;

        // process ETH fees
        if(ethReward > 0) {
            ethTreasuryPortion = WETHVault(getDirectory().getWETHVaultAddress()).getTreasuryPortion(ethReward);
            ethOperatorPortion = WETHVault(getDirectory().getWETHVaultAddress()).getOperatorPortion(ethReward);

            // send treasury and NO fees out immediately
            (bool success, ) = getDirectory().getTreasuryAddress().call{value: ethTreasuryPortion}('');
            require(success, 'Transfer to treasury failed');

            (success, ) = getDirectory().getOperatorRewardAddress().call{value: ethOperatorPortion}('');
            require(success, 'Transfer to operator reward address failed');
        }
        
        // process RPL fees
        if(rplReward > 0) {
            rplTreasuryPortion = RPLVault(getDirectory().getRPLVaultAddress()).getTreasuryPortion(rplReward);

            // send treasury fee immediately
            SafeERC20.safeTransfer(IERC20(getDirectory().getRPLAddress()), getDirectory().getTreasuryAddress(), rplTreasuryPortion);
        }

        emit MerkleClaimSubmitted(block.timestamp, ethReward, rplReward, ethTreasuryPortion, ethOperatorPortion, rplTreasuryPortion);

        // sweep all the prior interval's TVL
        this.sweepLockedTVL();

        lastClaimTime = block.timestamp;
    }

    // must be payable so OD can send ETH here to be locked up during streaming period
    receive() external payable {}
}