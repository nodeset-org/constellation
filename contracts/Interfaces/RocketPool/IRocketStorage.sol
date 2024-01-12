// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

interface IRocketStorage {
    function getNodeWithdrawalAddress(address _nodeAddress) external view returns (address);

    function setWithdrawalAddress(address _nodeAddress, address _newWithdrawalAddress, bool _confirm) external;
}
