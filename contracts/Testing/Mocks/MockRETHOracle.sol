// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../../Interfaces/Oracles/IRETHOracle.sol";

contract MockRETHOracle is IRETHOracle {
    uint private _yield = 410.59 ether;

    function setTotalYieldAccrued(uint yield) public override {
        _yield = yield;
    }

    function getTotalYieldAccrued() public view override returns (uint) {
        return _yield;
    }
}
