// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../../Interfaces/Oracles/IXRETHOracle.sol';
import '../../UpgradeableBase.sol';

contract MockRETHOracle is IXRETHOracle,  UpgradeableBase{
    
    int256 private _yield = 0 ether;

    function setTotalYieldAccrued(int256 yield) public {
        _yield = yield;
    }

    function getTotalYieldAccrued() public view override returns (int256) {
        return _yield;
    }
}
