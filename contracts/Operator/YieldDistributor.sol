// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./OperatorDistributor.sol";
import "../Whitelist/Whitelist.sol";
import "../Utils/ProtocolMath.sol";
import "../UpgradeableBase.sol";

import "../Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol";
import "../Interfaces/RocketTokenRPLInterface.sol";
import "../Interfaces/RocketPool/IRocketNodeStaking.sol";
import "../Interfaces/Oracles/IXRETHOracle.sol";
import "../Interfaces/IWETH.sol";
import "../Utils/Constants.sol";

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

    function initialize(address _directory) public initializer override {
        super.initialize(_directory);

        currentIntervalGenesisTime = block.timestamp;
        maxIntervalLengthSeconds = 30 days;

        k = 7;
        maxValidators = 5;
    }

    function wethReceived(uint256 weth) external onlyProtocol {
        _wethReceived(weth);
    }

    function _wethReceived(uint256 weth) internal {
        totalYieldAccrued += weth;
        yieldAccruedInInterval += weth;

        // if elapsed time since last interval is greater than maxIntervalLengthSeconds, start a new interval
        if (
            block.timestamp - currentIntervalGenesisTime >
            maxIntervalLengthSeconds
        ) {
            finalizeInterval();
        }
    }

    /****
     * GETTERS
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

    /// @notice Distributes rewards accrued between two intervals to a single rewardee
    /// @dev The caller should check for the most gas-efficient way to distribute rewards
    /// @param _rewardee The address of the rewardee to distribute rewards to
    /// @param _startInterval The interval to start distributing rewards from
    /// @param _endInterval The interval to stop distributing rewards at
    function harvest(
        address _rewardee,
        uint256 _startInterval,
        uint256 _endInterval
    ) public nonReentrant {
        require(
            _startInterval <= _endInterval,
            "Start interval must be less than or equal to end interval"
        );
        require(
            _endInterval < currentInterval,
            "End interval must be less than current interval"
        );
        require(_rewardee != address(0), "rewardee cannot be zero address");
        Whitelist whitelist = getWhitelist();
        Operator memory operator = getWhitelist().getOperatorAtAddress(
            _rewardee
        );
        require(
            operator.intervalStart <= _startInterval,
            "Rewardee has not been an operator since _startInterval"
        );

        bool isWhitelisted = whitelist.getIsAddressInWhitelist(_rewardee);

        _rewardee = operator.operatorController;

        uint256 totalReward = 0;
        for (uint256 i = _startInterval; i <= _endInterval; i++) {
            if (hasClaimed[_rewardee][i]) {
                emit WarningAlreadyClaimed(_rewardee, i);
                continue;
            }

            Claim memory claim = claims[i];

            uint256 fullEthReward = ((claim.amount * 1e18) /
                claim.numOperators) / 1e18;

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
            SafeERC20.safeTransfer(
                IWETH(_directory.getWETHAddress()),
                _rewardee,
                totalReward
            );
        } else {
            dustAccrued += totalReward;
        }

        getOperatorDistributor().processNextMinipool();

        emit RewardDistributed(Reward(_rewardee, totalReward));
    }

    /// @notice Ends the current interval and starts a new one
    /// @dev Only called when numOperators changes or maxIntervalLengthSeconds has passed
    function finalizeInterval() public onlyProtocolOrAdmin {
        if (yieldAccruedInInterval == 0 && currentInterval > 0) {
            return;
        }
        Whitelist whitelist = getWhitelist();

        claims[currentInterval] = Claim(
            yieldAccruedInInterval,
            whitelist.numOperators()
        );

        currentInterval++;
        currentIntervalGenesisTime = block.timestamp;
        yieldAccruedInInterval = 0;

        getOperatorDistributor().processNextMinipool();
    }

    /****
     * ADMIN
     */

    /// @notice Sets max interval time in seconds
    function setMaxIntervalTime(
        uint256 _maxIntervalLengthSeconds
    ) public onlyAdmin {
        maxIntervalLengthSeconds = _maxIntervalLengthSeconds;
    }

    function adminSweep(address treasury) public onlyAdmin {
        uint256 amount = dustAccrued;
        dustAccrued = 0;
        (bool success, ) = treasury.call{value: amount}("");
        require(success, "Failed to send ETH to treasury");
    }

    function setRewardIncentiveModel(
        uint256 _k,
        uint256 _maxValidators
    ) public onlyAdmin {
        k = _k;
        maxValidators = _maxValidators;
    }

    /****
     * PRIVATE
     */

    function getWhitelist() private view returns (Whitelist) {
        return Whitelist(_directory.getWhitelistAddress());
    }

    function getOperatorDistributor()
        private
        view
        returns (OperatorDistributor)
    {
        return OperatorDistributor(_directory.getOperatorDistributorAddress());
    }

    modifier onlyOperator() {
        require(getWhitelist().getIsAddressInWhitelist(msg.sender));
        _;
    }


    /****
     * RECEIVE
     */

    receive() external payable {
        // mint weth
        IWETH(_directory.getWETHAddress()).deposit{value: msg.value}();
        _wethReceived(msg.value);
    }
}
