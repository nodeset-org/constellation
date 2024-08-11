// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../../Interfaces/Oracles/IConstellationOracle.sol';
import '../../UpgradeableBase.sol';

contract MockRETHOracle is IConstellationOracle, UpgradeableBase {
    int256 private _yield = 0 ether;

    function getOutstandingEthYield() external view override returns (int256) { return _yield; }
    function getOutstandingRplYield() external view override returns (uint256) { return uint256(_yield); }
}
