// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockOperatorReward {
    bool public rejectCall;

    function setRejectCall(bool _rejectCall) public {
        rejectCall = _rejectCall;
    }

    receive() external payable {
        if (rejectCall) {
            revert("call rejected");
        }
    }
}

