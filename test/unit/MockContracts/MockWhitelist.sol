// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;


contract MockWhitelist {
    mapping(address => bool) private whitelist;
    mapping(address => uint256) private validatorCounts;

    // Setter function to change the whitelist status
    function setIsAddressInWhitelist(address _address, bool _status) external {
        whitelist[_address] = _status;
    }

    // Setter function to change the active validator count
    function setActiveValidatorCountForOperator(address _address, uint256 _count) external {
        validatorCounts[_address] = _count;
    }

    // This function has the same signature as in the original Whitelist contract
    function getIsAddressInWhitelist(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    // This function has the same signature as in the original Whitelist contract
    function getActiveValidatorCountForOperator(address _address) public view returns (uint256) {
        return validatorCounts[_address];
    }
}