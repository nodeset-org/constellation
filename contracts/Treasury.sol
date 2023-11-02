//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./UpgradeableBase.sol";

contract Treasury is UpgradeableBase {
    constructor() initializer {}

    function initialize(address directoryAddress) public virtual initializer override {
        super.initialize(directoryAddress);
    }

    function claimToken(address tokenAddress, address to) external onlyAdmin {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(to, balance);
    }

    function claimToken(address tokenAddress, address to, uint256 amount) external onlyAdmin {
        IERC20(tokenAddress).transfer(to, amount);
    }

    function claimEth(address payable to) external onlyAdmin {
        uint256 balance = address(this).balance;
        to.transfer(balance);
    }

    function claimEth(address payable to, uint256 amount) external onlyAdmin {
        to.transfer(amount);
    }

    function execute(address _target, bytes calldata _functionData) external payable onlyAdmin {
        (bool success, ) = _target.call{value: msg.value}(_functionData);
        require(success, "Treasury: execution reverted.");
    }

    function executeAll(address payable[] calldata _targets, bytes[] calldata _functionData) external payable onlyAdmin {
        require(_targets.length == _functionData.length, "Treasury: array length mismatch.");
        for (uint256 i = 0; i < _targets.length; i++) {
            (bool success, ) = _targets[i].call{value: msg.value}(_functionData[i]);
            require(success, "Treasury: execution reverted.");
        }
    }
}
