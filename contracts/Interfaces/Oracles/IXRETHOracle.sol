// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IXRETHOracle {
    /// @dev Oracle data verified using cryptographic fraud proofs.
    /// @return The total value locked in the protocol, in wei, for each minipool + rewards earned.
    function getTotalYieldAccrued() external view returns (uint);

    /// @dev Sets decentralized data provided by the Constellation network's cryptographic fraud proofs.
    /// @param yield The total value locked in the protocol, in wei, for each minipool + rewards earned.
    function setTotalYieldAccrued(uint yield) external;
}