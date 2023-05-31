// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "../../Interfaces/RocketPool/IRocketNodeStaking.sol";

contract MockRocketNodeStaking is IRocketNodeStaking {

    function getNodeMinimumRPLStake(address) override external view returns (uint256) {
        return 100e18;
    }

}