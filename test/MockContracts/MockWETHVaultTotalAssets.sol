// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../../contracts/Constellation/WETHVault.sol';
import './IWETHVaultTotalAssets.sol';

contract MockWETHVaultTotalAssets is WETHVault, IWETHVaultTotalAssets {
    uint256 private _mockTotalAssets;

    function setMockTotalAssets(uint256 _totalAssets) external {
        _mockTotalAssets = _totalAssets;
    }

    // Override the totalAssets function to return the mocked value (Constellation ETH TVL)
    function totalAssets() public view override(IWETHVaultTotalAssets, WETHVault) returns (uint256) {
        return _mockTotalAssets;
    }
}
