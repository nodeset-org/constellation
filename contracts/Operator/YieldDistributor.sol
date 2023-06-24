// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "./Operator.sol";
import "./OperatorDistributor.sol";
import "../Whitelist/Whitelist.sol";
import "../Tokens/xrETH.sol";
import "../Tokens/xRPL.sol";
import "../Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol";
import "../Interfaces/RocketTokenRPLInterface.sol";
import "../Interfaces/Oracles/IXRETHOracle.sol";

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
/// @notice distributes rewards
contract YieldDistributor is Base {
    uint8 public constant YIELD_PORTION_DECIMALS = 4;
    uint16 public constant YIELD_PORTION_MAX =
        uint16(10) ** YIELD_PORTION_DECIMALS;

    int private _ethCommissionModifier = 0; // total extra fee added to (or removed from) RP network commission
    int public constant MAX_ETH_COMMISSION_MODIFIER = 1 ether;
    uint16 public _ethRewardAdminPortion = 5000;

    uint256 public totalYieldAccruedInInterval;
    uint256 public totalYieldAccrued;

    mapping(uint256 => Claim) public claims; // claimable yield per interval (in wei)
    mapping(address => mapping (uint256 => bool)) public hasClaimed; // whether an operator has claimed for a given interval
    uint256 public currentInterval = 0;
    uint256 public currentIntervalGenesisTime = block.timestamp;
    uint256 public maxIntervalLengthSeconds = 30 days; // NOs will have to wait at most this long for their payday

    bool private _isInitialized = false;
    string public constant INITIALIZATION_ERROR =
        "YieldDistributor: may only initialized once";
    string public constant DIRECTORY_NOT_INITIALIZED_ERROR =
        "YieldDistributor: Directory must be initialized first";
    string public constant NOT_INITIALIZED_ERROR =
        "YieldDistributor: Must be initialized first";
    string public constant ETH_COMMISSION_MODIFIER_OUT_OF_BOUNDS_ERROR =
        "YieldDistributor: ETH fee modifier must be <= MAX_ETH_COMMISSION_MODIFIER and >= -MAX_ETH_COMMISSION_MODIFIER ";
    string public constant ETH_REWARD_ADMIN_PORTION_OUT_OF_BOUNDS_ERROR =
        "YieldDistributor: ETH fee portion must be between 0 and YIELD_PORTION_MAX";
    string public constant ALREADY_DISTRIBUTING_ERROR =
        "YieldDistributor: Already distributing rewards";

    event RewardDistributed(Reward);

    constructor(address directory) Base(directory) {}

    function initialize() public onlyAdmin {
        require(!_isInitialized, INITIALIZATION_ERROR);
        require(
            getDirectory().getIsInitialized(),
            DIRECTORY_NOT_INITIALIZED_ERROR
        );
        // approve infinite RPL spends for this address from xRPL
        RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS()).approve(
            getDirectory().getRPLTokenAddress(),
            type(uint).max
        );
        _isInitialized = true;
    }

    // ETH deposits are done via gasless balance increases to DP, DP then sends ETH to this contract
    receive() external payable {
        uint256 yieldRecieved =  msg.value * (1 ether - getEthCommissionRate()) / 1 ether;

        totalYieldAccruedInInterval += yieldRecieved;
        totalYieldAccrued += yieldRecieved;

        // if elapsed time since last interval is greater than maxIntervalLengthSeconds, start a new interval
        if (block.timestamp - currentIntervalGenesisTime > maxIntervalLengthSeconds) {
            finalizeInterval();
        }

    }

    /****
     * GETTERS
     */

    function getIsInitialized() public view returns (bool) {
        return _isInitialized;
    }

    /// @notice Gets the total protocol ETH commission rate as a fraction of one ether
    /// This is further split into operator and admin rewards in distributeRewards()
    function getEthCommissionRate() public view returns (uint) {
        int commission = int(getRocketPoolFee()) + _ethCommissionModifier;
        // constrain to 0->1 ether
        int maxCommission = 1 ether;
        commission = commission >= 0 ? commission : int(0);
        commission = commission > maxCommission ? maxCommission : commission;

        return uint(commission);
    }


    /// @notice Gets the ETH commission portion which goes to the admin.
    /// Scales from 0 (0%) to YIELD_PORTION_MAX (100%)
    function getEthRewardAdminPortion() public view returns (uint16) {
        return _ethRewardAdminPortion;
    }

    /// @notice Gets the total tvl of non-distributed yield
    function getDistributableYield() public view returns (uint256) {
        // get yield accrued from oracle
        IXRETHOracle oracle = IXRETHOracle(getDirectory().getRETHOracleAddress());
        uint ethYieldOwed = oracle.getTotalYieldAccrued();
        return
            ethYieldOwed > totalYieldAccrued
                ? ethYieldOwed - totalYieldAccrued
                : 0;
    }

    /// @notice Gets the amount of ETH that the contract needs to receive before it can distribute full rewards again
    function getShortfall() public view returns (uint256) {
        uint256 distributableYield = getDistributableYield();
        uint256 totalEth = address(this).balance;
        return
            totalEth > distributableYield ? 0 : distributableYield - totalEth;
    }

    /****
     * EXTERNAL
     */

    /// @notice Distributes rewards accrued between two intervals to a single rewardee
    /// @dev The caller should check for the most gas-efficient way to distribute rewards
    /// @param _rewardee The address of the rewardee to distribute rewards to
    /// @param startInterval The interval to start distributing rewards from
    /// @param endInterval The interval to stop distributing rewards at
    function harvest(address _rewardee, uint256 startInterval, uint256 endInterval) public nonReentrant {
        require(getIsInitialized(), NOT_INITIALIZED_ERROR);
        require(startInterval <= endInterval, "Start interval must be less than or equal to end interval");
        require(endInterval < currentInterval, "End interval must be less than current interval");
        require(_rewardee != address(0), "rewardee cannot be zero address");
        Whitelist whitelist = getWhitelist();
        require(whitelist.getIsAddressInWhitelist(_rewardee), "Rewardee is not whitelisted");
        require(whitelist.getOperatorAtAddress(_rewardee).intervalStart >= startInterval, "Rewardee has not been an operator since startInterval");

        uint256 totalReward = 0;
        Operator memory operator = getWhitelist().getOperatorAtAddress(_rewardee);
        for(uint256 i = startInterval; i <= endInterval; i++) {
            if(hasClaimed[_rewardee][i]) {
                continue;
            }
            Claim memory claim = claims[i];
            uint256 fullEthReward = ((claim.amount * 1e18) / claim.numOperators) / 1e18;
            uint256 operatorRewardEth = (fullEthReward * operator.feePortion) / YIELD_PORTION_MAX;
            // TODO: until the operator's feePortion is 100%, we will be collecting dust that'll need sweeping back to DP.
            totalReward += operatorRewardEth;
            hasClaimed[_rewardee][i] = true;
        }

        xrETH(getDirectory().getETHTokenAddress()).internalMint(
            _rewardee,
            totalReward
        );

        getOperatorDistributor().harvestNextMinipool();

        emit RewardDistributed(Reward(_rewardee, totalReward));
    }

    /// @notice Ends the current interval and starts a new one
    /// @dev Only called when numOperators changes or maxIntervalLengthSeconds has passed
    function finalizeInterval() public onlyWhitelistOrAdmin {
        if(totalYieldAccruedInInterval == 0) {
            return;
        }
        Whitelist whitelist = getWhitelist();

        claims[currentInterval] = Claim(
            totalYieldAccruedInInterval,
            whitelist.numOperators()
        );

        currentInterval++;
        currentIntervalGenesisTime = block.timestamp;
        totalYieldAccruedInInterval = 0;

        getOperatorDistributor().harvestNextMinipool();
    }

    /****
     * ADMIN
     */

    /// @notice Sets max interval time in seconds
    function setMaxIntervalTime(uint256 _maxIntervalLengthSeconds)
        public
        onlyAdmin
    {
        maxIntervalLengthSeconds = _maxIntervalLengthSeconds;
    }

    /// @notice Sets an extra fee on top of RP network comission, as a portion of 1 ether.
    /// Can be negative to reduce RP commission by this amount instead.
    function setEthCommissionModifier(
        int ethCommissionModifier
    ) public onlyAdmin {
        require(
            ethCommissionModifier <= MAX_ETH_COMMISSION_MODIFIER &&
                ethCommissionModifier >= -MAX_ETH_COMMISSION_MODIFIER,
            ETH_COMMISSION_MODIFIER_OUT_OF_BOUNDS_ERROR
        );
        _ethCommissionModifier = ethCommissionModifier;
    }

    function setEthRewardAdminPortion(uint16 newPortion) public onlyAdmin {
        require(
            newPortion <= YIELD_PORTION_MAX,
            ETH_REWARD_ADMIN_PORTION_OUT_OF_BOUNDS_ERROR
        );
        _ethRewardAdminPortion = newPortion;
    }

    /****
     * PRIVATE
     */

    function getRocketPoolFee() private view returns (uint) {
        return
            RocketDAOProtocolSettingsNetworkInterface(
                getDirectory().RP_NETWORK_FEES_ADDRESS()
            ).getMaximumNodeFee();
    }

    function getWhitelist() private view returns (Whitelist) {
        return Whitelist(_directory.getWhitelistAddress());
    }

    function getOperatorDistributor() private view returns (OperatorDistributor) {
        return OperatorDistributor(_directory.getOperatorDistributorAddress());
    }

    modifier onlyOperator() {
        require(getWhitelist().getIsAddressInWhitelist(msg.sender));
        _;
    }
}
