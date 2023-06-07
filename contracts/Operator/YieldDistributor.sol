// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "./Operator.sol";
import "../Whitelist/Whitelist.sol";
import "../Tokens/xrETH.sol";
import "../Tokens/xRPL.sol";
import "../Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol";
import "../Interfaces/RocketTokenRPLInterface.sol";
import "../Interfaces/Oracles/IRETHOracle.sol";

import "hardhat/console.sol";

struct Reward {
    address recipient;
    uint eth;
    uint rpl;
}

/// @custom:security-contact info@nodeset.io
/// @notice distributes rewards
contract YieldDistributor is Base {
    uint8 public constant YIELD_PORTION_DECIMALS = 4;
    uint16 public constant YIELD_PORTION_MAX =
        uint16(10) ** YIELD_PORTION_DECIMALS;

    int private _ethCommissionModifier = 0; // total extra fee added to (or removed from) RP network commission
    int public constant MAX_ETH_COMMISSION_MODIFIER = 1 ether;
    uint16 private _ethRewardAdminPortion = 5000;
    uint16 private _rplRewardAdminPortion = 5000;

    uint256 public totalEthDistributed;

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

    // ETH withdrawals and rewards are done via gasless balance increases, not transactions,
    // but if anyone wants to donate ETH to the protocol, they can do so by sending to this contract
    receive() external payable {}

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

    /// @notice Gets the fee per RPL
    function getRplCommissionRate() public view returns (uint) {
        return (_rplRewardAdminPortion * 10 ** (18 - YIELD_PORTION_DECIMALS));
    }

    /// @notice Gets the ETH commission portion which goes to the admin.
    /// Scales from 0 (0%) to YIELD_PORTION_MAX (100%)
    function getEthRewardAdminPortion() public view returns (uint16) {
        return _ethRewardAdminPortion;
    }

    // @notice Gets the total tvl of non-distributed yield
    function getDistributableYield() public view returns (uint256) {
        // get yield accrued from oracle
        IRETHOracle oracle = IRETHOracle(getDirectory().getRETHOracleAddress());
        return oracle.getTotalYieldAccrued() - totalEthDistributed;
    }

    /****
     * EXTERNAL
     */

    /// @notice The main reward distribution function. Anyone can call it if they're willing to pay the gas costs.
    /// @dev TODO: reimburse msg.sender via keeper-style mechanism, e.g. 0xSplits
    ///
    function distributeRewards() public nonReentrant {
        require(getIsInitialized(), NOT_INITIALIZED_ERROR);

        // for all operators in good standing, mint xrETH
        Operator[] memory operators = getWhitelist().getOperatorsAsList();
        uint length = operators.length;

        console.log("distributing rewards to %s operators", length);

        uint totalEthFee = (address(this).balance * (getEthCommissionRate())) /
            (1 ether);

        console.log("totalEthFee: %s", totalEthFee);

        // mint xrETH for NOs
        uint adminRewardEth = (totalEthFee * _ethRewardAdminPortion) /
            YIELD_PORTION_MAX;
        for (uint i = 0; i < length; i++) {
            uint operatorRewardEth = ((totalEthFee - adminRewardEth) *
                (operators[i].feePortion / YIELD_PORTION_MAX)) / length;

            address nodeOperatorAddr = getWhitelist().getOperatorAddress(i);

            NodeSetETH(getDirectory().getETHTokenAddress()).internalMint(
                nodeOperatorAddr,
                operatorRewardEth
            );
            emit RewardDistributed(
                Reward(nodeOperatorAddr, operatorRewardEth, 0)
            );
        }

        // mint xrETH for admin
        NodeSetETH(getDirectory().getETHTokenAddress()).internalMint(
            getDirectory().getAdminAddress(),
            adminRewardEth
        );

        // mint xRPL for admin
        RocketTokenRPLInterface rpl = RocketTokenRPLInterface(
            getDirectory().RPL_CONTRACT_ADDRESS()
        );

        uint adminRewardRpl = (rpl.balanceOf(address(this)) *
            _rplRewardAdminPortion) / YIELD_PORTION_MAX;
        NodeSetRPL(getDirectory().getRPLTokenAddress()).mintYield(
            getDirectory().getAdminAddress(),
            adminRewardRpl
        );
        emit RewardDistributed(
            Reward(
                getDirectory().getAdminAddress(),
                adminRewardEth,
                adminRewardRpl
            )
        );

        totalEthDistributed += totalEthFee;

        // TODO: reimburse msg.sender

        // send remaining RPL to DP
        rpl.transfer(
            getDirectory().getDepositPoolAddress(),
            rpl.balanceOf(address(this))
        );

        // send remaining ETH to DP
        (bool success, ) = getDirectory().getDepositPoolAddress().call{
            value: address(this).balance
        }("");
        require(success, "YieldDistributor: failed to send ETH to DepositPool");
    }

    /****
     * ADMIN
     */

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

    function setRplRewardAdminPortion(uint16 newPortion) public onlyAdmin {
        _rplRewardAdminPortion = newPortion;
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

    modifier onlyOperator() {
        require(getWhitelist().getIsAddressInWhitelist(msg.sender));
        _;
    }
}
