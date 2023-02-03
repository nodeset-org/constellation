// SPDX-License-Identifier: GPL v3
pragma solidity ^0.8.9;

import "./Directory.sol";
import "./Base.sol";

abstract contract ProxyBase is Base {    
    
    address private _currentDelegateAddress;
    
    event DelegateAddressUpdated(address oldAddress, address newAddress);

    constructor(address directoryAddress, address delegateAddress) Base(directoryAddress) { 
        setDelegate(delegateAddress);
    }

    function getDelegate() public view returns (address){
        return _currentDelegateAddress;
    }

    function setDelegate(address newDelegateAddress) public onlyAdmin {
        address old = _currentDelegateAddress;
        _currentDelegateAddress = newDelegateAddress;
        emit DelegateAddressUpdated(old, _currentDelegateAddress);
    }

    fallback() external {
        (bool success, bytes memory data) = _currentDelegateAddress.call(msg.data); // this ain't working!
        require(success);
    }

}