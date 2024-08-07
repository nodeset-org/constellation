// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './OperatorDistributor.sol';
import '../Whitelist/Whitelist.sol';
import '../Utils/ProtocolMath.sol';
import '../UpgradeableBase.sol';

import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/Oracles/IBeaconOracle.sol';
import '../Utils/Constants.sol';

import './SuperNodeAccount.sol';

import "hardhat/console.sol";

struct Reward {
    address recipient;
    uint eth;
}

/// @notice Intervals are calculated by the protcol and distributed upon request
struct Interval {
    uint256 amount; // amount wei of protocol yield accrued since last interval
    uint256 numOperators; // length of node operators active in the interval
    uint256 maxValidators; // maxValidators at the time of interval closing
}

/**
 * @title YieldDistributor
 * @author Theodore Clapp, Mike Leach
 * @dev Distributes earned rewards to a decentralized operator set using an interval system.
 */
contract YieldDistributor is UpgradeableBase {
    event RewardDistributed(Reward);
    event WarningAlreadyClaimed(address operator, uint256 interval);

    uint256 public yieldAccruedInInterval;
    /// @notice dust acccrued from operators with less than the maximum number of minipols claiming rewards
    /// This is claimable by the Treasury
    uint256 public dustAccrued;

    mapping(uint256 => Interval) public intervals; // all intervals
    mapping(address => mapping(uint256 => bool)) public hasClaimed; // whether an operator has claimed for a given interval

    uint256 public currentInterval;
    uint256 public currentIntervalGenesisTime;
    /// @notice The maximum interval length
    /// @dev Intervals are closed when there is an asset state change (processMinipool()) or an operator is added or removed.
    /// This means intervals may be significantly longer than this if no one is using the protocol.
    uint256 public maxIntervalLengthSeconds;

    uint256 public k; // steepness of the exponential curve


    /**
     * @notice Initializes the contract with the specified directory address and sets the initial configurations.
     * @dev This function is an override and should be called only once. It sets up the initial values
     * for the contract including the interval genesis time, maximum interval length, and configurations for
     * validator settings.
     * @param _directory The address of the directory contract or service that this contract will reference.
     */
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);

        currentIntervalGenesisTime = block.timestamp;
        maxIntervalLengthSeconds = 7 days;

        k = 7;
    }

    /**
     * @notice Handles the event when ETH is received by the contract.
     * @dev This function should only be callable by the protocol (or a designated service). It forwards the
     * ETH amount received to an internal handler function for further processing.
     * @param eth The amount of ETH received by the contract.
     */
    function ethReceived(uint256 eth) external onlyProtocol {
        _ethReceived(eth, false);
    }

    function ethReceivedVoidClaim(uint256 eth) external onlyProtocol {
        _ethReceived(eth, true);
    }

    /**
     * @dev Handles the internal logic when ETH (Wrapped Ether) is received by the contract.
     * It updates the total yield accrued and checks if the current interval should be finalized.
     *
     * @param eth The amount of ETH received by the contract.
     */
    function _ethReceived(uint256 eth, bool voidClaim) internal {
        yieldAccruedInInterval += eth;

        // if elapsed time since last interval is greater than maxIntervalLengthSeconds, start a new interval
        if ( getIsEndOfIntervalTime()) {
            if(voidClaim) { /// @dev void claim means there is no claim
                _finalizeIntervalVoidClaim();
            } else {
                finalizeInterval();
            }
        }
    }

    /****
     * GETTERS
     */

    function getIsEndOfIntervalTime() public view returns (bool) {
        return block.timestamp - currentIntervalGenesisTime > maxIntervalLengthSeconds;
    }

    /**
     * @notice Retrieves all intervals from the beginning up to and including the current interval.
     * @return _intervals An array containing all claims up to the current interval.
     */
    function getIntervals() public view returns (Interval[] memory) {
        Interval[] memory _intervals = new Interval[](currentInterval + 1);
        for (uint256 i = 0; i <= currentInterval; i++) {
            _intervals[i] = intervals[i];
        }
        return _intervals;
    }

    /****
     * EXTERNAL
     */

    /**
     * @notice Distributes rewards accrued between two intervals to a specific rewardee.
     * @dev The function calculates the reward based on the number of validators managed by the rewardee and 
     * uses an exponential function to determine the portion of the reward. Any rewards not claimed due to conditions 
     * or errors are considered "dust" and are accumulated in the `dustAccrued` variable. The caller should ensure that 
     * the function is called in a gas-efficient manner.
     * @param _rewardee The address of the operator to distribute rewards to.
     * @param _startInterval The interval (inclusive) from which to start distributing the rewards.
     * @param _endInterval The interval (inclusive) at which to end distributing the rewards.
     */
    function harvest(address _rewardee, uint256 _startInterval, uint256 _endInterval) public nonReentrant {
        console.logAddress(_rewardee);
        console.log("start Interval", _startInterval);
        console.log("end Interval", _endInterval);
        console.log("curr Interval", currentInterval);

        require(_startInterval <= _endInterval, 'Start interval must be less than or equal to end interval');
        require(_endInterval < currentInterval, 'End interval must be less than current interval');
        require(_rewardee != address(0), 'rewardee cannot be zero address');
        Whitelist whitelist = getWhitelist();
        Operator memory operator = getWhitelist().getOperatorAtAddress(_rewardee);
        require(operator.intervalStart <= _startInterval, 'Rewardee has not been an operator since _startInterval');

        bool isWhitelisted = whitelist.getIsAddressInWhitelist(_rewardee);

        _rewardee = operator.operatorController;

        uint256 totalReward = 0;
        for (uint256 i = _startInterval; i <= _endInterval; i++) {
            if (hasClaimed[_rewardee][i]) {
                emit WarningAlreadyClaimed(_rewardee, i);
                continue;
            }

            Interval memory interval = intervals[i];

            uint256 fullEthReward = ((interval.amount * 1e18) / interval.numOperators) / 1e18;

            uint256 maxPossibleValidators = interval.maxValidators;
            if(operator.activeValidatorCount > interval.maxValidators) {
                maxPossibleValidators = interval.maxValidators;
            }

            uint256 operatorsPortion = ProtocolMath.exponentialFunction(
                operator.activeValidatorCount,
                maxPossibleValidators,
                k,
                1,
                fullEthReward,
                1e18
            );

            totalReward += operatorsPortion;
            dustAccrued += fullEthReward - operatorsPortion;
            hasClaimed[_rewardee][i] = true;
        }

        // send eth to rewardee

        if (isWhitelisted) {
            (bool success, ) = _rewardee.call{value: totalReward}("");
            require(success, "_rewardee failed to claim");
        } else {
            dustAccrued += totalReward;
        }

        getOperatorDistributor().processNextMinipool();

        emit RewardDistributed(Reward(_rewardee, totalReward));
    }

    /**
     * @notice Ends the current rewards interval and starts a new one.
     */
    function finalizeInterval() public onlyProtocolOrAdmin {
        console.log("calling claim node operator fee");
        _finalizeIntervalVoidClaim();
    }

    /**
     * @dev This function records the rewards for the current interval and increments the interval counter. 
     * It's normally triggered when:
     * 1) This contract receives rewards during OperatorDistributor.processMinipool() (if enough the max interval length has passed)
     * 2) An operator is removed or added
     * Intervals without yield are skipped, except for the first interval.
     */
    function _finalizeIntervalVoidClaim() internal {
        if (yieldAccruedInInterval == 0 && currentInterval > 0) {
            return;
        }
        Whitelist whitelist = getWhitelist();

        intervals[currentInterval] = Interval(
            yieldAccruedInInterval, 
            whitelist.numOperators(),
            SuperNodeAccount(getDirectory().getSuperNodeAddress()).maxValidators()
        );

        currentInterval++;
        currentIntervalGenesisTime = block.timestamp;
        yieldAccruedInInterval = 0;
    }

    /****
     * ADMIN
     */

    /**
     * @notice Updates the maximum duration for each rewards interval.
     * @param _maxIntervalLengthSeconds The new maximum duration (in seconds) for each interval.
     * @dev This function allows the admin to adjust the length of time between rewards intervals. 
     * Adjustments may be necessary based on changing network conditions or governance decisions.
     */ 
    function setMaxIntervalTime(uint256 _maxIntervalLengthSeconds) public onlyShortTimelock {
        maxIntervalLengthSeconds = _maxIntervalLengthSeconds;
    }

    /**
     * @notice Transfers the accumulated dust (residual ETH) to the treasury address.
     * @dev This function can only be called by the treasurer. It allows for the collection of 
     * small residual ETH balances (dust) that may have accumulated due to rounding errors or other minor discrepancies.
     */
    function treasurySweep() public onlyTreasurer {
        uint256 amount = dustAccrued;
        dustAccrued = 0;
        (bool success, ) = getDirectory().getTreasuryAddress().call{value: amount}('');
        require(success, 'Failed to send ETH to treasury');
    }

    /**
     * @notice Sets the steepness of the curve for the reward incentive model.
     * @param _k The curvature parameter for the exponential function used in reward calculation.
     * @dev This function can only be called by the protocol admin. 
     * Adjusting this parameter will change the reward distribution dynamics for operators.
     * See https://www.desmos.com/calculator/txymjzg1ad for a visualization
     */
    function setRewardIncentiveModel(uint256 _k) public {
        k = _k;
    }

    /****
     * PRIVATE
     */

    /**
     * @notice Retrieves the current Whitelist contract instance.
     * @return Whitelist The current Whitelist contract instance.
     * @dev This is a private helper function used internally to obtain the Whitelist contract instance from the directory.
     */
    function getWhitelist() private view returns (Whitelist) {
        return Whitelist(_directory.getWhitelistAddress());
    }

    /**
     * @notice Retrieves the current OperatorDistributor contract instance.
     * @return OperatorDistributor The current OperatorDistributor contract instance.
     * @dev This is a private helper function used internally to obtain the OperatorDistributor contract instance from the directory.
     */
    function getOperatorDistributor() private view returns (OperatorDistributor) {
        return OperatorDistributor(_directory.getOperatorDistributorAddress());
    }

    /**
     * @notice Modifier to ensure the calling account is a whitelisted operator.
     * @dev Throws if the calling account is not in the operator whitelist.
     */
    modifier onlyOperator() {
        require(getWhitelist().getIsAddressInWhitelist(msg.sender));
        _;
    }

    /**
     * @notice Fallback function to receive ETH and trigger new intervals after enough time has elapsed.
     * Thank you for your donation to the hard-working operators!
     */
    receive() external payable { 
        _ethReceived(msg.value, false);
    }
}
