// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import 'hardhat/console.sol';

contract MockOperatorDistributor {
    receive() external payable {}

    uint256 private rplStakeShortfall;

    function setCalculateRplStakeShortfall(uint256 _rplStakeShortfall) external {
        rplStakeShortfall = _rplStakeShortfall;
    }

    function calculateRplStakeShortfall(uint256, uint256) public view returns (uint256) {
        console.log("YEET!!");
        return rplStakeShortfall;
    }

    function provisionLiquiditiesForMinipoolCreation(uint256) public pure {
    }
}