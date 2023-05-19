// SPDX License Identifier: GPL v3

pragma solidity 0.8.17;

enum MinipoolStatus {
    Initialised,    // The minipool has been initialised and is awaiting a deposit of user ETH
    Prelaunch,      // The minipool has enough ETH to begin staking and is awaiting launch by the node operator
    Staking,        // The minipool is currently staking
    Withdrawable,   // NO LONGER USED
    Dissolved       // The minipool has been dissolved and its user deposited ETH has been returned to the deposit pool
}

contract MockMinipool {

    address public nodeAddress;

    MinipoolStatus public status;

    uint256 public preLaunchValue;

    uint256 public nodeDepositBalance;
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

    function initialise(address _nodeAddress) public {
        nodeAddress = _nodeAddress;
        status = MinipoolStatus.Initialised;
    }

    function preDeposit(uint256 _bondValue, bytes calldata _validatorPubkey, bytes calldata _validatorSignature, bytes32 _depositDataRoot) public payable {
        status = MinipoolStatus.Prelaunch;
        preLaunchValue = msg.value;
        nodeDepositBalance = _bondValue;
    }

    function deposit() public payable {
        // Set the minipool status to prelaunch (ready for node to call `stake()`)
        status = MinipoolStatus.Staking;
        userDepositBalance = msg.value + preLaunchValue - nodeDepositBalance;
    }

}