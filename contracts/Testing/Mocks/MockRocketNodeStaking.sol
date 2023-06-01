// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "../../Interfaces/RocketPool/IRocketNodeStaking.sol";

contract MockRocketNodeStaking is IRocketNodeStaking {
    function getNodeMinimumRPLStake(
        address
    ) external view override returns (uint256) {
        return 3.1415 ether;
    }
}
