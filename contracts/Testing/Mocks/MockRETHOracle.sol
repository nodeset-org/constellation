// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../../Interfaces/Oracles/IXRETHOracle.sol';

contract MockRETHOracle is IXRETHOracle {
    
    uint private _yield = 0 ether;

    function setTotalYieldAccrued(uint yield) public {
        _yield = yield;
    }

    function getTotalYieldAccrued() public view override returns (uint) {
        return _yield;
    }
}
