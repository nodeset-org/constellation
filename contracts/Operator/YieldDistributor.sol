// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './OperatorDistributor.sol';
import '../Whitelist/Whitelist.sol';
import '../Utils/ProtocolMath.sol';
import '../UpgradeableBase.sol';

import '../Tokens/WETHVault.sol';

import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/Oracles/IXRETHOracle.sol';
import '../Interfaces/IWETH.sol';
import '../Utils/Constants.sol';

import "hardhat/console.sol";

struct Reward {
    address recipient;
    uint eth;
}

/// @notice Claims get filed by the protcol and distributed upon request
struct Claim {
    uint256 amount; // amount wei of protocol yield accrued since last interval
    uint256 numOperators; // length of node operators active in the interval
}

/// @custom:security-contact info@nodeset.io
/// @notice distributes rewards in weth to node operators
contract YieldDistributor is UpgradeableBase {
    event RewardDistributed(Reward);
    event WarningAlreadyClaimed(address operator, uint256 interval);

    uint256 public totalYieldAccrued;
    uint256 public yieldAccruedInInterval;
    uint256 public dustAccrued;

    mapping(uint256 => Claim) public claims; // claimable yield per interval (in wei)
    mapping(address => mapping(uint256 => bool)) public hasClaimed; // whether an operator has claimed for a given interval

    uint256 public currentInterval;
    uint256 public currentIntervalGenesisTime;
    uint256 public maxIntervalLengthSeconds; // NOs will have to wait at most this long for their payday

    uint256 k; // steepness of the curve
    uint256 maxValidators; // max number of validators used to normalize x axis

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
        maxIntervalLengthSeconds = 30 days;

        k = 7;
        maxValidators = 5;
    }

    /**
     * @notice Handles the event when WETH (Wrapped Ether) is received by the contract.
     * @dev This function should only be callable by the protocol (or a designated service). It forwards the
     * WETH amount received to an internal handler function for further processing.
     * @param weth The amount of WETH received by the contract.
     */
    function wethReceived(uint256 weth) external onlyProtocol {
        _wethReceived(weth, false);
    }

    function wethReceivedVoidClaim(uint256 weth) external onlyProtocol {
        _wethReceived(weth, true);
    }

    /**
     * @dev Handles the internal logic when WETH (Wrapped Ether) is received by the contract.
     * It updates the total yield accrued and checks if the current interval should be finalized.
     *
     * @param weth The amount of WETH received by the contract.
     */
    function _wethReceived(uint256 weth, bool voidClaim) internal {
        totalYieldAccrued += weth;
        yieldAccruedInInterval += weth;

        // if elapsed time since last interval is greater than maxIntervalLengthSeconds, start a new interval
        if (block.timestamp - currentIntervalGenesisTime > maxIntervalLengthSeconds) {
            if(voidClaim) {
                _finalizeIntervalVoidClaim();
            } else {
                finalizeInterval();
            }
        }
    }

    /****
     * GETTERS
     */

    /**
     * @notice Retrieves all claims from the beginning up to and including the current interval.
     *
     * @return _claims An array containing all claims up to the current interval.
     */
    function getClaims() public view returns (Claim[] memory) {
        Claim[] memory _claims = new Claim[](currentInterval + 1);
        for (uint256 i = 0; i <= currentInterval; i++) {
            _claims[i] = claims[i];
        }
        return _claims;
    }

    /****
     * EXTERNAL
     */

    /**
     * @notice Distributes rewards accrued between two intervals to a specific rewardee.
     * @dev The function calculates the reward based on the number of validators managed by the rewardee and uses an exponential function to determine the portion of the reward. Any rewards not claimed due to conditions or errors are considered "dust" and are accumulated in the `dustAccrued` variable. The caller should ensure that the function is called in a gas-efficient manner.
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

            Claim memory claim = claims[i];

            uint256 fullEthReward = ((claim.amount * 1e18) / claim.numOperators) / 1e18;

            console.log("full reward", i);
            console.log(fullEthReward);
            console.log(claim.amount);

            uint256 operatorsPortion = ProtocolMath.exponentialFunction(
                operator.currentValidatorCount,
                maxValidators,
                k,
                1,
                claim.amount,
                1e18
            );

            totalReward += operatorsPortion;
            dustAccrued += fullEthReward - operatorsPortion;
            hasClaimed[_rewardee][i] = true;
        }

        // send weth to rewardee

        if (isWhitelisted) {
            SafeERC20.safeTransfer(IWETH(_directory.getWETHAddress()), _rewardee, totalReward);
        } else {
            dustAccrued += totalReward;
        }

        getOperatorDistributor().processNextMinipool();

        emit RewardDistributed(Reward(_rewardee, totalReward));
    }

    /**
     * @notice Ends the current rewards interval and starts a new one.
     * @dev This function records the rewards for the current interval and increments the interval counter. It's primarily triggered when there's a change in the number of operators or when the duration of the current interval exceeds the `maxIntervalLengthSeconds`. Also, it triggers the process of distributing rewards to the minipools via the `OperatorDistributor`. Intervals without yield are skipped, except for the first interval.
     */
    function finalizeInterval() public onlyProtocolOrAdmin {
        console.log("calling claim node operator fee");
        WETHVault(_directory.getWETHVaultAddress()).claimFees();
        _finalizeIntervalVoidClaim();
    }

    function _finalizeIntervalVoidClaim() internal {
        if (yieldAccruedInInterval == 0 && currentInterval > 0) {
            return;
        }
        Whitelist whitelist = getWhitelist();

        claims[currentInterval] = Claim(yieldAccruedInInterval, whitelist.numOperators());

        currentInterval++;
        currentIntervalGenesisTime = block.timestamp;
        yieldAccruedInInterval = 0;

        getOperatorDistributor().processNextMinipool();
    }

    /****
     * ADMIN
     */

    /**
     * @notice Updates the maximum duration for each rewards interval.
     * @param _maxIntervalLengthSeconds The new maximum duration (in seconds) for each interval.
     * @dev This function allows the admin to adjust the length of time between rewards intervals. Adjustments may be necessary based on changing network conditions or governance decisions.
     */ function setMaxIntervalTime(uint256 _maxIntervalLengthSeconds) public onlyAdmin {
        maxIntervalLengthSeconds = _maxIntervalLengthSeconds;
    }

    /**
     * @notice Transfers the accumulated dust (residual ETH) to the specified treasury address.
     * @param treasury The address of the treasury to which the dust will be sent.
     * @dev This function can only be called by the contract's admin. It allows for the collection of small residual ETH balances (dust) that may have accumulated due to rounding errors or other minor discrepancies.
     */
    function adminSweep(address treasury) public onlyAdmin {
        uint256 amount = dustAccrued;
        dustAccrued = 0;
        (bool success, ) = treasury.call{value: amount}('');
        require(success, 'Failed to send ETH to treasury');
    }

    /**
     * @notice Sets the parameters for the reward incentive model used in reward distribution.
     * @param _k The curvature parameter for the exponential function used in reward calculation.
     * @param _maxValidators The maximum number of validators to be considered in the reward calculation.
     * @dev This function can only be called by the contract's admin. Adjusting these parameters can change the reward distribution dynamics for validators.
     */
    function setRewardIncentiveModel(uint256 _k, uint256 _maxValidators) public onlyAdmin {
        k = _k;
        maxValidators = _maxValidators;
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

    /****
     * RECEIVE
     */

    /**
     * @notice Fallback function to receive ETH and convert it to WETH (Wrapped ETH).
     * @dev When ETH is sent to this contract, it is automatically wrapped into WETH and the corresponding amount is processed.
     */
    receive() external payable {
        // mint weth
        IWETH(_directory.getWETHAddress()).deposit{value: msg.value}();
        _wethReceived(msg.value, false);
    }
}
