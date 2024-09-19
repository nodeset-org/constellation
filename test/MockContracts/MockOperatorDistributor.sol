// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockOperatorDistributor {
    uint256 private rplStakeShortfall;

    receive() external payable {}

    function setCalculateRplStakeShortfall(uint256 _rplStakeShortfall) external {
        rplStakeShortfall = _rplStakeShortfall;
    }

    function calculateRplStakeShortfall(uint256, uint256) public view returns (uint256) {
        return rplStakeShortfall;
    }

    function sendEthForMinipool() public pure {}

    function rebalanceRplStake(uint256) public pure {}

    function rebalanceWethVault() public pure {}

    function rebalanceRplVault() public pure {}

    function onIncreaseOracleError() public pure {}
}
