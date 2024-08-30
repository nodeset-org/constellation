// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >0.5.0 <0.9.0;
pragma abicoder v2;

interface RocketRewardsRelayInterface {
    function relayRewards(uint256 _intervalIndex, bytes32 _merkleRoot, uint256 _rewardsRPL, uint256 _rewardsETH) external;
    function claim(address _nodeAddress, uint256[] calldata _intervalIndex, uint256[] calldata _amountRPL, uint256[] calldata _amountETH, bytes32[][] calldata _merkleProof) external;
    function claimAndStake(address _nodeAddress, uint256[] calldata _intervalIndex, uint256[] calldata _amountRPL, uint256[] calldata _amountETH, bytes32[][] calldata _merkleProof, uint256 _stakeAmount) external;
    function isClaimed(uint256 _intervalIndex, address _claimer) external view returns (bool);
}
