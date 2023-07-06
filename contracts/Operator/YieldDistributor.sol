// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "./Operator.sol";
import "./OperatorDistributor.sol";
import "../Whitelist/Whitelist.sol";
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
/// @notice distributes rewards in weth to node operators
contract YieldDistributor is Base {

    uint256 public totalYieldAccrued;
    uint256 public yieldAccruedInInterval;
    uint256 public dustAccrued;

    mapping(uint256 => Claim) public claims; // claimable yield per interval (in wei)
    mapping(address => mapping(uint256 => bool)) public hasClaimed; // whether an operator has claimed for a given interval

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
    event WarningAlreadyClaimed(address operator, uint256 interval);

    constructor(address directory) Base(directory) {}

    function initialize() public onlyAdmin {
        require(!_isInitialized, INITIALIZATION_ERROR);
        require(
            getDirectory().getIsInitialized(),
            DIRECTORY_NOT_INITIALIZED_ERROR
        );
        // approve infinite RPL spends for this address from xRPL
        RocketTokenRPLInterface(getDirectory().getRPLAddress()).approve(
            _directory.getRPLVaultAddress(),
            type(uint).max
        );
        _isInitialized = true;
    }

    function wethReceived(uint256 weth) external onlyWETHVault {
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

    function getIsInitialized() public view returns (bool) {
        return _isInitialized;
    }


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
    /// @param startInterval The interval to start distributing rewards from
    /// @param endInterval The interval to stop distributing rewards at
    function harvest(
        address _rewardee,
        uint256 startInterval,
        uint256 endInterval
    ) public nonReentrant {
        require(getIsInitialized(), NOT_INITIALIZED_ERROR);
        require(
            startInterval <= endInterval,
            "Start interval must be less than or equal to end interval"
        );
        require(
            endInterval < currentInterval,
            "End interval must be less than current interval"
        );
        require(_rewardee != address(0), "rewardee cannot be zero address");
        Whitelist whitelist = getWhitelist();
        Operator memory operator = getWhitelist().getOperatorAtAddress(
            _rewardee
        );
        require(
            operator.intervalStart <= startInterval,
            "Rewardee has not been an operator since startInterval"
        );

        bool isWhitelisted = whitelist.getIsAddressInWhitelist(_rewardee);

        uint256 totalReward = 0;
        for (uint256 i = startInterval; i <= endInterval; i++) {
            if (hasClaimed[_rewardee][i]) {
                emit WarningAlreadyClaimed(_rewardee, i);
                continue;
            }
            Claim memory claim = claims[i];
            uint256 fullEthReward = ((claim.amount * 1e18) /
                claim.numOperators) / 1e18;
            totalReward += fullEthReward;
            hasClaimed[_rewardee][i] = true;
        }

        // send eth to rewardee

        if (isWhitelisted) {
            (bool success, ) = _rewardee.call{value: totalReward}("");
            require(success, "Failed to send ETH to rewardee");
        } else {
            dustAccrued += totalReward;
        }

        getOperatorDistributor().harvestNextMinipool();

        emit RewardDistributed(Reward(_rewardee, totalReward));
    }

    /// @notice Ends the current interval and starts a new one
    /// @dev Only called when numOperators changes or maxIntervalLengthSeconds has passed
    function finalizeInterval() public onlyWhitelistOrAdmin {
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

        getOperatorDistributor().harvestNextMinipool();
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
}
