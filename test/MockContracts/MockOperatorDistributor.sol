// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import './Pusher.sol';

contract MockOperatorDistributor {
    uint256 private rplStakeShortfall;
    uint256 public ethOut;
    address payable public pusherAddress;

    function setPusherAddress(address payable _pusherAddress) external {
        pusherAddress = _pusherAddress;
    }

    receive() external payable {}

    function setEthOut(uint256 _ethOut) external {
        ethOut = _ethOut;
    }

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

    function submitMerkleClaim(uint256[] calldata, uint256[] calldata, uint256[] calldata, bytes32[][] calldata) external {
        Pusher(pusherAddress).sendEther(payable(address(this)));
        Pusher(pusherAddress).sendRpl(payable(address(this)));
    }

    function transferMerkleClaimToStreamer(uint256, uint256) public pure {}
}
