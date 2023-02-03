pragma solidity 0.8.9;

// SPDX-License-Identifier: GPL-3.0-only

import "./RocketSupernodeStorageLayout.sol";

contract RocketSupernode is RocketSupernodeStorageLayout {
    // Baked in delegate address
    bytes32 immutable delegateKey;

    constructor(address _rocketStorage, address _ownerAddress) {
        rocketStorage = RocketStorageInterface(_rocketStorage);
        ownerAddress = _ownerAddress;
        delegateKey = keccak256(abi.encodePacked("contract.address", "rocketSupernodeDelegate"));
    }

    // Allow contract to receive ETH without making a delegated call
    receive() external payable {}

    // Delegates all transactions to the target supplied during creation
    fallback() external payable {
        address _target = rocketStorage.getAddress(delegateKey);
        assembly {
            calldatacopy(0x0, 0x0, calldatasize())
            let result := delegatecall(gas(), _target, 0x0, calldatasize(), 0x0, 0)
            returndatacopy(0x0, 0x0, returndatasize())
            switch result case 0 {revert(0, returndatasize())} default {return (0, returndatasize())}
        }
    }
}