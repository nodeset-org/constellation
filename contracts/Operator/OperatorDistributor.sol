// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../Base.sol";
import "../Whitelist/Whitelist.sol";
import "../Interfaces/RocketPool/IRocketStorage.sol";
import "../Interfaces/RocketPool/IMinipool.sol";
import "../Interfaces/RocketPool/IRocketNodeManager.sol";

contract OperatorDistributor is Base {

    uint public _queuedEth;
    uint public _queuedRpl;

    constructor(address directory) Base(directory) {}

    receive() external payable {
        _queuedEth += msg.value;
    }

    /// @notice requires that the caller approve the contract to transfer RPL
    /// @param amount The amount of RPL to queue
    function queueRpl(uint amount) public {
        IERC20 rpl = IERC20(getDirectory().getRPLTokenAddress());
        require(
            rpl.allowance(msg.sender, address(this)) >= amount,
            "OperatorDistributor: must approve RPL transfer"
        );
        rpl.transferFrom(msg.sender, address(this), amount);
        _queuedRpl += amount;
    }

    function reimburseNodeForMinipool(address newMinipoolAdress) public {
        IConstellationMinipoolsOracle minipoolsOracle = IConstellationMinipoolsOracle(
                getDirectory().getConstellationMinipoolsOracleAddress()
            );
        require(
            minipoolsOracle.hasMinipool(newMinipoolAdress),
            "OperatorDistributor: minipool not in constellation"
        );

        IRocketStorage rocketStorage = IRocketStorage(
            getDirectory().getRocketStorageAddress()
        );

        IMinipool minipool = IMinipool(newMinipoolAdress);

        address withdrawlAddress = rocketStorage.getNodeWithdrawalAddress(
            minipool.getNodeAddress()
        );

        require(
            withdrawlAddress == getDirectory().getDepositPoolAddress(),
            "OperatorDistributor: minipool must delegate control to deposit pool"
        );

        IRocketNodeManager nodeManager = IRocketNodeManager(
            getDirectory().getRocketNodeManagerAddress()
        );

        require(
            nodeManager.getSmoothingPoolRegistrationState(
                minipool.getNodeAddress()
            ),
            "OperatorDistributor: minipool must be registered in smoothing pool"
        );

        uint256 bond = minipool.getNodeDepositBalance();

        require(
            _queuedEth >= bond,
            "OperatorDistributor: insufficient ETH in queue"
        );


        /**
         * - must have withdrawal address set to our DP
         * - must be in smoothing pool
         * - NO is reimbursed from staging balance
         */
    }

    // function getOperatorValidatorNumTarget() public view returns (uint) {
    //     return (balanceOf(this) % Whitelist(getDirectory().getWhitelistAddress()))
    // }
}
