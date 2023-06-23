// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import "../../Interfaces/RocketPool/IMinipool.sol";

contract MockMinipool is IMinipool {
    address internal _nodeAddress;

    MinipoolStatus internal _status;

    uint256 internal _preLaunchValue;

    uint256 internal _nodeDepositBalance;
    /**
     * @notice nodeDepositBalance
     * This variable represents the total amount of ETH that the node operator has committed to the minipool. If the amount committed is less than than 32 ETH, then the deposit pool will top up the difference.
     * This could be either 16 ETH or 32 ETH depending on whether the minipool is a "half" minipool or a "full" minipool, respectively.
     * This commitment is usually collateralized with RPL tokens by the node operator as per the staking rules of Rocket Pool, however nodeset will manage risk differently.
     */

    uint256 internal userDepositBalance;

    /**
     * @notice preLaunchValue
     * This variable is used in the preDeposit function and represents the initial deposit made to a minipool before it's launched on the beacon chain.
     * This deposit sets the withdrawal credentials for the minipool.
     */

    function initialise(address __nodeAddress) public {
        _nodeAddress = __nodeAddress;
        _status = MinipoolStatus.Initialised;
    }

    function preDeposit(
        uint256 _bondValue,
        bytes calldata _validatorPubkey,
        bytes calldata _validatorSignature,
        bytes32 _depositDataRoot
    ) public payable {
        _status = MinipoolStatus.Prelaunch;
        _preLaunchValue = msg.value;
        _nodeDepositBalance = _bondValue;
    }

    function deposit() public payable {
        // Set the minipool status to prelaunch (ready for node to call `stake()`)
        _status = MinipoolStatus.Staking;
        userDepositBalance = msg.value + _preLaunchValue - _nodeDepositBalance;
    }

    function getNodeAddress() external view override returns (address) {
        return _nodeAddress;
    }

    function getStatus() external view override returns (MinipoolStatus) {
        return _status;
    }

    function getPreLaunchValue() external view override returns (uint256) {
        return _preLaunchValue;
    }

    function getNodeDepositBalance() external view override returns (uint256) {
        return _nodeDepositBalance;
    }

    function getUserDepositBalance() external view override returns (uint256) {
        return userDepositBalance;
    }

    function distributeBalance(bool _rewardsOnly) external override {
    }

    function userDistributeAllowed() external view override returns (bool) {
        return true;
    }

    function beginUserDistribute() external override {
    }
}
