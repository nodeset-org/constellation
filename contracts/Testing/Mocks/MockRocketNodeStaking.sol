// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "../../Interfaces/RocketPool/IRocketNodeStaking.sol";
import "../../Interfaces/RocketTokenRPLInterface.sol";

contract MockRocketNodeStaking is IRocketNodeStaking {

    uint256 public rplStaked;

    function getNodeMinimumRPLStake(
        address
    ) external view override returns (uint256) {
        return 3.1415 ether;
    }

    function stakeRPLFor(
        address _nodeAddress,
        uint256 _amount
    ) external override {
        // Transfer RPL from msg.sender to this contract
        RocketTokenRPLInterface rplToken = RocketTokenRPLInterface(0xD33526068D116cE69F19A9ee46F0bd304F21A51f);
        rplToken.transferFrom(msg.sender, address(this), _amount);
    }

    function getNodeRPLStake(
        address _nodeAddress
    ) external view override returns (uint256) {
        return rplStaked;
    }

    function setRPLStaked(
        uint256 _rplStaked
    ) external {
        rplStaked = _rplStaked;
    }
}
