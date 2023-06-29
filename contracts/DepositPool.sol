// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./Base.sol";
import "./Operator/OperatorDistributor.sol";
import "./Operator/YieldDistributor.sol";
import "./Interfaces/RocketPool/IRocketNodeStaking.sol";
import "./Tokens/WETHVault.sol";

/// @custom:security-contact info@nodeoperator.org
/// @notice Immutable deposit pool which holds deposits and provides a minimum source of liquidity for depositors.
/// ETH + RPL intakes from token mints and validator yields and sends to respective ERC4246 vaults.
contract DepositPool is Base {
    /// @notice Keeps track of the previous _maxBalancePortion for easy reversion (e.g. unpausing)
    uint16 private _prevEthMaxBalancePortion = 100;
    uint16 private _maxrETHBalancePortion = 100;

    uint16 private _prevRplMaxBalancePortion = 100;
    uint16 private _maxRplBalancePortion = 100;

    // TODO: remove these notes,
    // _maxRplBalancePortion is staked at the node level, and needs to be a percentage of the TVL. This is to service large inflows and outflows of new minipool contracts.
    // likewise, _maxrETHBalancePortion needs to optimize yield for eth. eth in this contract is only reserved for creating stakers for minipool contracts
    // the oracle is simple a TVL calculation of all the ETH in the system
    // Total RPL is already on-chain and does not need to be an oracle

    event NewMaxrETHBalancePortion(uint16 oldValue, uint16 newValue);
    event NewMaxRplBalancePortion(uint16 oldValue, uint16 newValue);

    uint16 public constant MAX_BALANCE_PORTION_DECIMALS = 4;
    uint16 public constant MAX_BALANCE_PORTION =
        uint16(10) ** MAX_BALANCE_PORTION_DECIMALS;

    string public constant SEND_ETH_TO_OPERATOR_DISTRIBUTOR_ERROR =
        "DepositPool: Send ETH to OperatorDistributor failed";
    string public constant SEND_RPL_TO_OPERATOR_DISTRIBUTOR_ERROR =
        "DepositPool: Send RPL to OperatorDistributor failed";
    string public constant ONLY_ETH_TOKEN_ERROR =
        "DepositPool: This function may only be called by the xrETH token contract";
    string public constant MAX_BALANCE_PORTION_OUT_OF_RANGE_ERROR =
        "DepositPool: Supplied maxBalancePortion is out of range. Must be >= 0 or <= MAX_BALANCE_PORTION.";
    string public constant NOT_ENOUGH_ETH_ERROR =
        "Deposit Pool: Not enough ETH";
    string public constant NOT_ENOUGH_RPL_ERROR =
        "Deposit Pool: Not enough RPL";

    uint private _dpOwnedEth;
    uint private _dpOwnedRpl;

    /// @notice Emitted whenever this contract sends or receives ETH outside of the protocol.
    event TotalValueUpdated(uint oldValue, uint newValue);

    constructor(address directoryAddress) Base(directoryAddress) {}

    ///--------
    /// GETTERS
    ///--------

    /// @notice Gets the total ETH value locked inside the protocol, including inside of validators, the OperatorDistributor,
    // and this contract.
    function getTvlEth() public view returns (uint) {
        return _dpOwnedEth;
    }

    /// @notice Gets the total RPL value locked inside the protocol, including inside of validators, the OperatorDistributor,
    // and this contract.
    function getTvlRpl() public view returns (uint) {
        return _dpOwnedRpl;
    }

    function getMaxrETHBalancePortion() public view returns (uint16) {
        return _maxrETHBalancePortion;
    }

    function getMaxRplBalancePortion() public view returns (uint16) {
        return _maxRplBalancePortion;
    }

    function getMaxrETHBalance() public view returns (uint) {
        return (getTvlEth() * _maxrETHBalancePortion) / MAX_BALANCE_PORTION;
    }

    function getMaxRplBalance() public view returns (uint) {
        return ((getTvlRpl() * _maxRplBalancePortion) /
            MAX_BALANCE_PORTION);
    }

    ///--------
    /// TOKEN
    ///--------

    /// @notice only the token contract can spend DP funds
    function sendEth(address payable to, uint amount) public onlyWETHVault {
        require(amount <= getMaxrETHBalance(), NOT_ENOUGH_ETH_ERROR);

        uint old = getTvlEth();

        (bool success, ) = to.call{value: amount}("");
        assert(success);

        _dpOwnedEth -= amount;
        emit TotalValueUpdated(old, getTvlEth());
    }

    /// @notice only the token contract can spend DP funds
    function sendRpl(address payable to, uint amount) public onlyRplVault {
        require(amount <= getMaxRplBalance(), NOT_ENOUGH_RPL_ERROR);

        uint old = _dpOwnedRpl;
        require(sendRPLTo(to, amount));
        _dpOwnedRpl -= amount;

        emit TotalValueUpdated(old, _dpOwnedRpl);
    }

    function stakeRPLFor(address _nodeAddress) external onlyOperatorDistributor nonReentrant {
        IRocketNodeStaking nodeStaking = IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress());
        uint256 minimumRplStake = IRocketNodeStaking(
            getDirectory().getRocketNodeStakingAddress()
        ).getNodeMinimumRPLStake(_nodeAddress);

        // approve the node staking contract to spend the RPL
        RocketTokenRPLInterface rpl = RocketTokenRPLInterface(
            getDirectory().RPL_CONTRACT_ADDRESS()
        );
        require(
            rpl.approve(
                getDirectory().getRocketNodeStakingAddress(),
                minimumRplStake
            )
        );

        uint leftover = getRplBalanceOf(address(this)) - getMaxRplBalance();

        require(leftover > 0, "DepositPool: Not enough RPL in pool to stake");


        nodeStaking.stakeRPLFor(_nodeAddress, minimumRplStake);
    }

    ///------
    /// ADMIN
    ///------

    /// @notice Sets the maximum percentage of TVL which is allowed to be in the Deposit Pool.
    /// On deposit, if the DP would grow beyond this, it instead forwards the payment to the OperatorDistributor.
    /// Allows any value between 0 and MAX_BALANCE_PORTION.
    /// 0 would prevent withdrawals since all ETH sent to this contract is forwarded to the OperatorDistributor.
    /// Setting to MAX_BALANCE_PORTION effectively freezes new operator activity by keeping 100% in the DepositPool.
    function setMaxrETHBalancePortion(
        uint16 newMaxBalancePortion
    ) public onlyAdmin {
        require(
            newMaxBalancePortion >= 0 &&
                newMaxBalancePortion <= MAX_BALANCE_PORTION
        );

        uint16 oldValue = _maxrETHBalancePortion;
        _maxrETHBalancePortion = newMaxBalancePortion;
        sendExcessEthToDistributors();

        emit NewMaxrETHBalancePortion(oldValue, _maxrETHBalancePortion);
    }

    /// @notice Sets the maximum percentage of TVL which is allowed to be in the Deposit Pool.
    /// On deposit, if the DP would grow beyond this, it instead forwards the payment to the OperatorDistributor.
    /// Allows any value between 0 an MAX_BALANCE_PORTION.
    /// 0 would prevent withdrawals since all ETH sent to this contract is forwarded to the OperatorDistributor.
    /// Setting to MAX_BALANCE_PORTION effectively freezes new operator activity by keeping 100% in the DepositPool.
    function setMaxRplBalancePortion(
        uint16 newMaxBalancePortion
    ) public onlyAdmin {
        require(
            newMaxBalancePortion >= 0 &&
                newMaxBalancePortion <= MAX_BALANCE_PORTION
        );

        uint16 oldValue = _maxRplBalancePortion;
        _maxRplBalancePortion = newMaxBalancePortion;

        emit NewMaxRplBalancePortion(oldValue, _maxrETHBalancePortion);
    }

    ///------
    /// RECEIVE
    ///------

    receive() external payable {
        // do not accept deposits if new operator activity is disabled
        require(
            _maxrETHBalancePortion < MAX_BALANCE_PORTION,
            MAX_BALANCE_PORTION_ERROR
        );

        uint old = getTvlEth();

        _dpOwnedEth += msg.value;
        emit TotalValueUpdated(old, _dpOwnedEth);

        sendExcessEthToDistributors();
    }

    function receiveRpl(uint amount) external onlyRplVault {
        // do not accept deposits if new operator activity is disabled
        require(
            _maxRplBalancePortion < MAX_BALANCE_PORTION,
            MAX_BALANCE_PORTION_ERROR
        );

        uint old = getTvlRpl();

        _dpOwnedRpl += amount;
        emit TotalValueUpdated(old, _dpOwnedRpl);
    }

    /// @notice If the DP would grow above `_maxrETHBalancePortion`, it instead forwards the payment to the OperatorDistributor / YieldDistributor.
    function sendExcessEthToDistributors() private {
        uint leftover = address(this).balance - getMaxrETHBalance();
        if (leftover > 0) {
            // get shortfall from yield distributor
            WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());
            uint shortfall = vweth.getShortfall();
            if (shortfall > 0) {
                if (shortfall > leftover) {
                    shortfall = leftover;
                }
                leftover -= shortfall;
                (bool successYield, ) = getDirectory()
                    .getYieldDistributorAddress()
                    .call{value: shortfall}("");
                require(
                    successYield,
                    "DepositPool: Send ETH to YieldDistributor failed"
                );
            }

            (bool successOperator, ) = getDirectory()
                .getOperatorDistributorAddress()
                .call{value: leftover}("");
            require(
                successOperator,
                "DepositPool: Send ETH to OperatorDistributor failed"
            );
        }
    }

    function getRplBalanceOf(address a) private view returns (uint) {
        return
            RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS())
                .balanceOf(address(a));
    }

    function sendRPLTo(address to, uint amount) private returns (bool) {
        return
            RocketTokenRPLInterface(getDirectory().RPL_CONTRACT_ADDRESS())
                .transfer(to, amount);
    }
}
