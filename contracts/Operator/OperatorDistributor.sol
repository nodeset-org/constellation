// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../Base.sol";
import "../Whitelist/Whitelist.sol";
import "../Interfaces/RocketPool/IRocketStorage.sol";
import "../Interfaces/RocketPool/IMinipool.sol";

contract OperatorDistributor is Base {
    uint private _queuedEth;

    constructor(address directory) Base(directory) {}

    receive() external payable {
        addToQueue(msg.value);
    }

    //function addToQueue(uint value) private {
    function addToQueue(uint value) public {
        _queuedEth += value;
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
