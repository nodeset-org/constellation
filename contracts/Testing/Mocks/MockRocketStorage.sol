// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import '../../Interfaces/RocketPool/IRocketStorage.sol';

// Mocks the Rocket Pool Deposit Pool contract regarding setWithdrawalAddress() and getWithdrawalAddress() functions
contract MockRocketStorage is IRocketStorage {
    mapping(address => address) private withdrawalAddresses;

    function setWithdrawalAddress(address _nodeAddress, address _newWithdrawalAddress, bool _confirm) public override {
        if (_confirm) {
            withdrawalAddresses[_nodeAddress] = _newWithdrawalAddress;
        }
    }

    function getNodeWithdrawalAddress(address _nodeAddress) public view override returns (address) {
        return withdrawalAddresses[_nodeAddress];
    }
}
