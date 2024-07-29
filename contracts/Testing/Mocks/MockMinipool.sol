// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

import '../../Interfaces/RocketPool/IMinipool.sol';

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

    function distributeBalance(bool _rewardsOnly) external override {}

    function userDistributeAllowed() external view override returns (bool) {
        return true;
    }

    function beginUserDistribute() external override {}

    function setNodeDepositBalance(uint256 _newBalance) external {
        _nodeDepositBalance = _newBalance;
    }

    function version() external view override returns (uint8) {}

    function getFinalised() external view override returns (bool) {}

    function getStatusBlock() external view override returns (uint256) {}

    function getStatusTime() external view override returns (uint256) {}

    function getScrubVoted(address _member) external view override returns (bool) {}

    function getNodeFee() external view override returns (uint256) {}

    function getNodeRefundBalance() external view override returns (uint256) {}

    function getNodeDepositAssigned() external view override returns (bool) {}

    function getNodeTopUpValue() external view override returns (uint256) {}

    function getVacant() external view override returns (bool) {}

    function getPreMigrationBalance() external view override returns (uint256) {}

    function getUserDistributed() external view override returns (bool) {}

    function getUserDepositAssigned() external view override returns (bool) {}

    function getUserDepositAssignedTime() external view override returns (uint256) {}

    function getTotalScrubVotes() external view override returns (uint256) {}

    function calculateNodeShare(uint256 _balance) external view override returns (uint256) {}

    function calculateUserShare(uint256 _balance) external view override returns (uint256) {}

    function userDeposit() external payable override {}

    function refund() external override {}

    function slash() external override {}

    function finalise() external override {}

    function canStake() external view override returns (bool) {}

    function canPromote() external view override returns (bool) {}

    function stake(bytes calldata _validatorSignature, bytes32 _depositDataRoot) external override {}

    function prepareVacancy(uint256 _bondAmount, uint256 _currentBalance) external override {}

    function promote() external override {}

    function dissolve() external override {}

    function close() external override {}

    function voteScrub() external override {}

    function reduceBondAmount() external override {}

    function delegateUpgrade() external override {}

    function delegateRollback() external override {}

    function setUseLatestDelegate(bool _setting) external override {}
}
