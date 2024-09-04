// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;


contract MockOperatorDistributor {
    uint256 private rplStakeShortfall;

    // Setter function to change the RPL stake shortfall
    function setCalculateRplStakeShortfall(uint256 _shortfall) external {
        rplStakeShortfall = _shortfall;
    }

    function calculateRplStakeShortfall(uint256, uint256) public view returns (uint256) {
        return rplStakeShortfall;
    }
}