// SPDX License Identifier: GPL v3
pragma solidity 0.8.17;

contract MockTreasury {
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
