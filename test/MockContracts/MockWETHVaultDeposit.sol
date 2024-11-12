// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '../../contracts/Constellation/WETHVault.sol';

contract MockWETHVaultDeposit is WETHVault {
    function proxyDeposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) external payable {
        // Call the internal deposit function for testing purposes
        _deposit(caller, receiver, assets, shares);
    }
}