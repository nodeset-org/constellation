// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../../Interfaces/Oracles/IRETHOracle.sol";

contract MockRETHOracle is IRETHOracle {
    uint private _tvl = 410.59 ether;

    function setTVL(uint tvl) public override {
        _tvl = tvl;
    }

    function getTVL() public view override returns (uint) {
        return _tvl;
    }
}
