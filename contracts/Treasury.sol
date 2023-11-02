//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./UpgradeableBase.sol";

contract Treasury is UpgradeableBase {
    constructor() initializer {}

    function initialize(
        address _directoryAddress
    ) public virtual override initializer {
        super.initialize(_directoryAddress);
    }

    function claimToken(address _tokenAddress, address _to) external onlyAdmin {
        uint256 _balance = IERC20(_tokenAddress).balanceOf(address(this));
        IERC20(_tokenAddress).transfer(_to, _balance);
    }

    function claimToken(
        address _tokenAddress,
        address _to,
        uint256 _amount
    ) external onlyAdmin {
        IERC20(_tokenAddress).transfer(_to, _amount);
    }

    function claimEth(address payable _to) external onlyAdmin {
        uint256 _balance = address(this).balance;
        _to.transfer(_balance);
    }

    function claimEth(address payable _to, uint256 _amount) external onlyAdmin {
        _to.transfer(_amount);
    }

    function execute(
        address _target,
        bytes calldata _functionData
    ) external payable onlyAdmin {
        (bool _success, ) = _target.call{value: msg.value}(_functionData);
        require(_success, "Treasury: execution reverted.");
    }

    function executeAll(
        address payable[] calldata _targets,
        bytes[] calldata _functionData
    ) external payable onlyAdmin {
        require(
            _targets.length == _functionData.length,
            "Treasury: array length mismatch."
        );
        for (uint256 i = 0; i < _targets.length; i++) {
            (bool _success, ) = _targets[i].call{value: msg.value}(
                _functionData[i]
            );
            require(_success, "Treasury: execution reverted.");
        }
    }
}
