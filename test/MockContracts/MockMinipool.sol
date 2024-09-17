// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '../../contracts/Interfaces/RocketPool/IMinipool.sol';


contract MockMinipool {
    MinipoolStatus public status;
    bool public finalised;
    uint256 public nodeDepositBalance;
    uint256 public nodeRefundBalance;

    receive() payable external {}

    function setInitialised() public {
        status = MinipoolStatus.Initialised;
    }

    function setPrelaunch() public {
        status = MinipoolStatus.Prelaunch;
    }

    function setStaking() public {
        status = MinipoolStatus.Staking;
    }

    function setWithdrawable() public {
        status = MinipoolStatus.Withdrawable;
    }

    function setDissolved() public {
        status = MinipoolStatus.Dissolved;
    }

    function getStatus() public view returns (MinipoolStatus) {
        return status;
    }

    function setFinalised(bool _finalised) public {
        finalised = _finalised;
    }

    function getFinalised() public view returns (bool) {
        return finalised;
    }

    function setNodeDepositBalance(uint256 _nodeDepositBalance) public {
        nodeDepositBalance = _nodeDepositBalance;
    }

    function getNodeDepositBalance() public view returns (uint256) {
        return nodeDepositBalance;
    }

    function getNodeRefundBalance() public view returns (uint256) {
        return nodeRefundBalance;
    }
}