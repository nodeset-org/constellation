// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.9;

import "./Base.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @custom:security-contact info@nodeoperator.org
/// @notice Immutable deposit pool which holds deposits and provides a minimum source of liquidity for depositors.
/// ETH + RPL intakes from token mints and validator yields are stored here, but only up to a maximum percentage of protocol TVL.
contract DepositPool is Base {

    /// @notice Keeps track of the previous _maxBalancePortion for easy reversion (e.g. unpausing)
    uint16 private _prevEthMaxBalancePortion = 100;
    uint16 private _maxEthBalancePortion = 100;

    uint16 private _prevRplMaxBalancePortion = 100;
    uint16 private _maxRplBalancePortion = 100;
    event NewMaxEthBalancePortion(uint16 oldValue, uint16 newValue);
    event NewMaxRplBalancePortion(uint16 oldValue, uint16 newValue);

    uint16 constant public MAX_BALANCE_PORTION_DECIMALS = 4;
    uint16 constant public MAX_BALANCE_PORTION_MAX = uint16(10) ** MAX_BALANCE_PORTION_DECIMALS;

    string constant public SEND_ETH_TO_OPERATOR_DISTRIBUTOR_ERROR = "DepositPool: Send ETH to OperatorDistributor failed";
    string constant public SEND_RPL_TO_OPERATOR_DISTRIBUTOR_ERROR = "DepositPool: Send RPL to OperatorDistributor failed";
    string constant public PROTOCOL_PAUSED_ERROR = "DepositPool: Protocol is paused and cannot accept deposits";
    string constant public ONLY_ETH_TOKEN_ERROR = "DepositPool: This function may only be called by the xrETH token contract";
    string constant public ONLY_RPL_TOKEN_ERROR = "DepositPool: This function may only be called by the xRPL token contract";
    string constant public MAX_BALANCE_PORTION_OUT_OF_RANGE_ERROR = "DepositPool: Supplied maxBalancePortion is out of range. Must be >= 0 or <= MAX_BALANCE_PORTION_MAX.";
    string constant public NOT_ENOUGH_ETH_ERROR = "Deposit Pool: Not enough ETH";
    string constant public NOT_ENOUGH_RPL_ERROR = "Deposit Pool: Not enough RPL";

    uint private _tvlEth;
    uint private _tvlRpl;

    /// @notice Emitted whenever this contract sends or receives ETH outside of the protocol.
    event TotalValueUpdated(uint oldValue, uint newValue);

    constructor(address directoryAddress) Base(directoryAddress) {} 

    ///--------
    /// GETTERS
    ///--------

    /// @notice Gets the total ETH value locked inside the protocol, including inside of validators, the OperatorDistributor, 
    // and this contract.
    function getTvlEth() public view returns(uint) { return _tvlEth; }
    
    /// @notice Gets the total RPL value locked inside the protocol, including inside of validators, the OperatorDistributor, 
    // and this contract.
    function getTvlRpl() public view returns(uint) { return _tvlRpl; }

    function getMaxEthBalancePortion() public view returns(uint16) { return _maxEthBalancePortion; }
    function getMaxRplBalancePortion() public view returns(uint16) { return _maxRplBalancePortion; }

    function getMaxEthBalance() public view returns(uint) { return (getTvlEth()*_maxEthBalancePortion) / MAX_BALANCE_PORTION_MAX; }
    function getMaxRplBalance() public view returns(uint) { return (getTvlRpl()*_maxRplBalancePortion / MAX_BALANCE_PORTION_MAX); }

    ///--------
    /// TOKEN
    ///--------

    /// @notice only the token contract can spend DP funds
    function sendEth(address payable to, uint amount) public onlyEthToken {
        require(amount <= getMaxEthBalance(), NOT_ENOUGH_ETH_ERROR);

        uint old = getTvlEth();

        (bool success, ) = to.call{value : amount}("");
        assert(success);
        
        _tvlEth -= amount;
        emit TotalValueUpdated(old, getTvlEth());
    }
    
    /// @notice only the token contract can spend DP funds
    function sendRpl(address payable to, uint amount) public onlyRplToken {
        require(amount <= getMaxRplBalance(), NOT_ENOUGH_RPL_ERROR);
        
        uint old = _tvlRpl;
        require(sendRPLTo(to, amount));
        _tvlRpl -= amount;

        emit TotalValueUpdated(old, _tvlRpl);
    }

    ///------
    /// ADMIN
    ///------

    /// @notice Sets the maximum percentage of TVL which is allowed to be in the Deposit Pool. 
    /// On deposit, if the DP would grow beyond this, it instead forwards the payment to the OperatorDistributor.
    /// Allows any value between 0 and MAX_BALANCE_PORTION_MAX.
    /// 0 would prevent withdrawals since all ETH sent to this contract is forwarded to the OperatorDistributor.
    /// Setting to MAX_BALANCE_PORTION_MAX effectively freezes new operator activity by keeping 100% in the DepositPool.
    function setMaxEthBalancePortion(uint16 newMaxBalancePortion) public onlyAdmin {
        require(newMaxBalancePortion >= 0 && newMaxBalancePortion <= MAX_BALANCE_PORTION_MAX);
        
        uint16 oldValue = _maxEthBalancePortion;
        _maxEthBalancePortion = newMaxBalancePortion;
        sendExcessEthToOperatorDistributor();

        emit NewMaxEthBalancePortion(oldValue, _maxEthBalancePortion);
    }

    /// @notice Sets the maximum percentage of TVL which is allowed to be in the Deposit Pool. 
    /// On deposit, if the DP would grow beyond this, it instead forwards the payment to the OperatorDistributor.
    /// Allows any value between 0 an MAX_BALANCE_PORTION_MAX. 
    /// 0 would prevent withdrawals since all ETH sent to this contract is forwarded to the OperatorDistributor.
    /// Setting to MAX_BALANCE_PORTION_MAX effectively freezes new operator activity by keeping 100% in the DepositPool.
    function setMaxRplBalancePortion(uint16 newMaxBalancePortion) public onlyAdmin {
        require(newMaxBalancePortion >= 0 && newMaxBalancePortion <= MAX_BALANCE_PORTION_MAX);
        
        uint16 oldValue = _maxRplBalancePortion;
        _maxRplBalancePortion = newMaxBalancePortion;
        sendExcessRplToOperatorDistributor();

        emit NewMaxRplBalancePortion(oldValue, _maxEthBalancePortion);
    }

    ///------
    /// RECEIVE
    ///------

    
    receive() external payable {
        // do not accept deposits if new operator activity is disabled
        require(_maxEthBalancePortion < MAX_BALANCE_PORTION_MAX, PROTOCOL_PAUSED_ERROR);

        uint old = getTvlEth();

        _tvlEth += msg.value; 
        emit TotalValueUpdated(old, _tvlEth);

        sendExcessEthToOperatorDistributor();
    } 

    function receiveRpl(uint amount) external onlyRplToken {
        // do not accept deposits if new operator activity is disabled
        require(_maxRplBalancePortion < MAX_BALANCE_PORTION_MAX, PROTOCOL_PAUSED_ERROR);

        uint old = getTvlRpl();

        _tvlRpl += amount; 
        emit TotalValueUpdated(old, _tvlRpl);

        sendExcessRplToOperatorDistributor();
    } 

    /// @notice If the DP would grow above `_maxEthBalancePortion`, it instead forwards the payment to the OperatorDistributor.
    function sendExcessEthToOperatorDistributor() private {
        uint leftover = address(this).balance - getMaxEthBalance();
        if(leftover > 0) {    
            (bool success, ) = getDirectory().getOperatorDistributorAddress().call{value : leftover}("");
            require (success, "DepositPool: Send ETH to OperatorDistributor failed");
        }
    }

    /// @notice If the DP would grow above `_maxRplBalancePortion`, it instead forwards the payment to the OperatorDistributor.
    function sendExcessRplToOperatorDistributor() private {
        uint leftover = getRplBalanceOf(address(this)) - getMaxRplBalance();
        if(leftover > 0) {    
            bool success = sendRPLTo(getDirectory().getOperatorDistributorAddress(), leftover);
            require (success, "DepositPool: Send RPL to OperatorDistributor failed");
        }
    }

    function getRplBalanceOf(address a) private view returns (uint) {
        return RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS()).balanceOf(address(a));
    }

    function sendRPLTo(address to, uint amount) private returns (bool) {
        return RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS()).transfer(to, amount);
    }

    modifier onlyEthToken {
        require(msg.sender == getDirectory().getETHTokenAddress(), ONLY_ETH_TOKEN_ERROR);
        _;
    }
    
    modifier onlyRplToken {
        require(msg.sender == getDirectory().getRPLTokenAddress(), ONLY_RPL_TOKEN_ERROR);
        _;
    }
}