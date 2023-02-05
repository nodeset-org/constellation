// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.9;

import "./Operator.sol";
import "../Whitelist/Whitelist.sol";
import "../Tokens/yaspETH.sol";
import "../Tokens/yaspRPL.sol";
import "../Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol";
import "../Interfaces/RocketTokenRPLInterface.sol";
import "hardhat/console.sol";

struct Reward {
    address recipient;
    uint eth;
    uint rpl;
}

/// @custom:security-contact info@nodeset.io
/// @notice distributes rewards
contract YieldDistributor is Base {
    
    uint16 private _yieldFeePortion = 100;
    uint8 constant public YIELD_FEE_DECIMALS = 4;
    uint16 constant public YIELD_FEE_MAX = uint16(10) ** YIELD_FEE_DECIMALS;

    int private _ethFeeModifier = 0; // total extra fee added to (or removed from) RP network fees
    int constant public MAX_ETH_FEE_MODIFIER = 1 ether;
    uint16 private _ethFeeAdminPortion = 5000; // this portion goes to the admin address
    uint16 private _rplFeeAdminPortion = 1500; // this portion goes to the admin address

    bool private _isInitialized = false;
    string constant public INITIALIZATION_ERROR = 
        "YieldDistributor: may only initialized once";
    string constant public DIRECTORY_NOT_INITIALIZED_ERROR = 
        "YieldDistributor: Directory must be initialized first";
    string constant public NOT_INITIALIZED_ERROR = 
        "YieldDistributor: Must be initialized first";
    string constant public ETH_FEE_MODIFIER_OUT_OF_BOUNDS_ERROR = 
        "YieldDistributor: ETH fee modifier must be <= MAX_ADDITIONAL_ETH_FEE and >= -MAX_ADDITIONAL_ETH_FEE ";
    string constant public ETH_FEE_ADMIN_PORTION_OUT_OF_BOUNDS_ERROR = 
        "YieldDistributor: ETH fee portion must be between 0 and YIELD_FEE_MAX";
    string constant public ALREADY_DISTRIBUTING_ERROR = "YieldDistributor: Already distributing rewards";

    event RewardDistributed(Reward);

    constructor (address directory) Base(directory) {}

    function initialize() public onlyAdmin {
        require(!_isInitialized, INITIALIZATION_ERROR);
        require(getDirectory().getIsInitialized(), DIRECTORY_NOT_INITIALIZED_ERROR);       
        // approve infinite RPL spends for this address from yaspRPL
        RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS())
            .approve(getDirectory().getRPLTokenAddress(), type(uint).max);
        _isInitialized = true;
    } 

    // ETH withdrawals and rewards are done via gasless balance increases, not transactions, 
    // but if anyone wants to donate ETH to the protocol, they can do so by sending to this contract
    receive() external payable {}

    /****
     * GETTERS
     */
    
    function getIsInitialized() public view returns(bool) { return _isInitialized; }

    /// @notice Gets the total protocol ETH fee rate as a fraction of one ether
    /// This is be further split into operator and admin fees in distributeFees()
    function getEthFeeRate() public view returns(uint) {       
        int fee = int(getRocketPoolFee()) + _ethFeeModifier;
        
        // constrain to 0->1 ether
        int maxFee = 1 ether;
        fee = fee >= 0 ? fee : int(0);
        fee = fee > maxFee ? maxFee : fee;
        
        return uint(fee); 
    }

    /// @notice Gets the fee per RPL
    function getRplFeeRate() public view returns(uint) { 
        return (_rplFeeAdminPortion * 10 ** (18-YIELD_FEE_DECIMALS)); 
    }

    /// @notice Gets the ETH fee portion which goes to the admin. 
    /// Scales from 0 (0%) to YIELD_FEE_MAX (100%)
    function getEthFeeAdminPortion() public view returns(uint16) { return _ethFeeAdminPortion; }

    /****
     * EXTERNAL
     */

    bool _isDistributing; 

    /// @notice The main reward distribution function. Anyone can call it if they're willing to pay the gas costs.
    /// @dev TODO: reimburse msg.sender via keeper-style mechanism, e.g. 0xSplits 
    /// 
    function distributeRewards() public {
        require(!_isDistributing, ALREADY_DISTRIBUTING_ERROR);
        _isDistributing = true;
        require(getIsInitialized(), NOT_INITIALIZED_ERROR);
        
        // for all operators in good standing, mint yaspETH 
        Operator[] memory operators = getWhitelist().getOperatorList();
        uint length = operators.length;

        uint perEthFee = getEthFeeRate();
        uint totalFee = (address(this).balance * (perEthFee)) / (1 ether);

        console.log("total fee");
        console.log(totalFee);

        // mint yaspETH for NOs
        for(uint i = 0; i < length; i++) {
            uint operatorRewardEth = 
                totalFee * (operators[i].feePortion / YIELD_FEE_MAX) * (1 - (_ethFeeAdminPortion / YIELD_FEE_MAX)) / length;
            YaspETH(getDirectory().getETHTokenAddress()).internalMint(operators[i].nodeAddress, operatorRewardEth);
            console.log("operator eth fee");
            console.log(operatorRewardEth);
            emit RewardDistributed(Reward(operators[i].nodeAddress, operatorRewardEth, 0));
        }

        // mint yaspETH for admin
        uint adminRewardEth = totalFee * (_ethFeeAdminPortion / YIELD_FEE_MAX);
        YaspETH(getDirectory().getETHTokenAddress()).internalMint(getDirectory().getAdminAddress(), adminRewardEth);
        
        // mint yaspRPL for admin 
        RocketTokenRPLInterface rpl = RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS());

        uint adminRewardRpl = rpl.balanceOf(address(this)) * _rplFeeAdminPortion / YIELD_FEE_MAX;        
        YaspRPL(getDirectory().getRPLTokenAddress())
            .mintYield(getDirectory().getAdminAddress(), adminRewardRpl);
        emit RewardDistributed(Reward(getDirectory().getAdminAddress(), adminRewardEth, adminRewardRpl));
        console.log("admin ETH fee");
        console.log(adminRewardEth);
        console.log("admin RPL fee");
        console.log(adminRewardRpl);

        // send remaining RPL to DP
        rpl.transfer(getDirectory().getDepositPoolAddress(), rpl.balanceOf(address(this)));

        // TODO: reimburse msg.sender here 

        // send remaining ETH to DP
        (bool success, ) = getDirectory().getDepositPoolAddress().call{ value: address(this).balance }("");
        require(success, "YieldDistributor: failed to send ETH to DepositPool");

        _isDistributing = false;
    }

    /****
     * ADMIN
     */
    
    /// @notice Sets an extra fee on top of RP network fees, as a portion of 1 ether. 
    /// Can be negative to reduce standard RP fees by this amount instead.
    function setEthFeeModifier(int ethFeeModifier) public onlyAdmin {
        require(
            ethFeeModifier <= MAX_ETH_FEE_MODIFIER && 
                ethFeeModifier >= -MAX_ETH_FEE_MODIFIER,
            ETH_FEE_MODIFIER_OUT_OF_BOUNDS_ERROR
        );
        _ethFeeModifier = ethFeeModifier;
    }

    function setRplFeeAdminPortion(uint16 newRplFeePortion) public onlyAdmin {
        _rplFeeAdminPortion = newRplFeePortion;
    }

    function setEthFeeAdminPortion(uint16 newEthFeePortion) public onlyAdmin {
        require(
            newEthFeePortion <= YIELD_FEE_MAX,
            ETH_FEE_ADMIN_PORTION_OUT_OF_BOUNDS_ERROR 
        );
        _ethFeeAdminPortion = newEthFeePortion;
    }

    /****
     * PRIVATE
     */

    function getRocketPoolFee() private view returns(uint) {
        return RocketDAOProtocolSettingsNetworkInterface(getDirectory().RP_NETWORK_FEES_ADDRESS()).getMaximumNodeFee();
    }

    function getWhitelist() private view returns(Whitelist) { return  Whitelist(_directory.getWhitelistAddress()); }

    modifier onlyOperator {
        require(getWhitelist().getIsAddressInWhitelist(msg.sender));
        _;
    }
}