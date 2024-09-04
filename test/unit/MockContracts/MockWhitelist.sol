// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MockWhitelist {
    mapping(address => bool) private whitelist;
    mapping(address => uint256) private validatorCounts;

    function setIsAddressInWhitelist(address _address, bool _status) external {
        whitelist[_address] = _status;
    }

    function getIsAddressInWhitelist(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    function getActiveValidatorCountForOperator(address _address) public view returns (uint256) {
        return validatorCounts[_address];
    }

    function setActiveValidatorCountForOperator(address _address, uint256 _count) external {
        validatorCounts[_address] = _count;
    }

    function registerNewValidator(address) public {
    }
}