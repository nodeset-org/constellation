// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '../../contracts/Interfaces/RocketPool/IMinipool.sol';


contract MockMinipool {
    MinipoolStatus public status;
    bool public finalised;

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
}