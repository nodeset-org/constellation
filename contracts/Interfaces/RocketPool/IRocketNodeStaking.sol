// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRocketNodeStaking {
    /// @notice Calculate and return a node's minimum RPL stake to collateralize their minipools
    /// @param _nodeAddress The address of the node operator to calculate for
    function getNodeMinimumRPLStake(
        address _nodeAddress
    ) external view returns (uint256);

    /// @notice Accept an RPL stake from any address for a specified node
    ///         Requires caller to have approved this contract to spend RPL
    ///         Requires caller to be on the node operator's allow list (see `setStakeForAllowed`)
    /// @param _nodeAddress The address of the node operator to stake on behalf of
    /// @param _amount The amount of RPL to stake
    function stakeRPLFor(address _nodeAddress, uint256 _amount) external;
}