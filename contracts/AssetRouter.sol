// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/Strings.sol';

import './UpgradeableBase.sol';
import './Operator/OperatorDistributor.sol';
import './Operator/YieldDistributor.sol';
import './Interfaces/RocketPool/IRocketNodeStaking.sol';
import './Tokens/WETHVault.sol';
import './Tokens/RPLVault.sol';

import './Interfaces/RocketPool/IRocketMerkleDistributorMainnet.sol';
import './Interfaces/IWETH.sol';
import './Interfaces/Oracles/IXRETHOracle.sol';
import './Utils/Constants.sol';

/// @custom:security-contact info@nodeoperator.org
/// @notice Immutable deposit pool which holds deposits and provides a minimum source of liquidity for depositors.
/// ETH + RPL intakes from token mints and validator yields and sends to respective ERC4246 vaults.
contract AssetRouter is UpgradeableBase {
    uint256 public balanceWeth;
    uint256 public balanceRpl;

    bool internal _gateOpen;

    using Math for uint256;

    constructor() initializer {}

    /// @dev Initializes the AssetRouter contract with the specified directory address.
    /// @param directoryAddress The address of the directory contract.
    function initialize(address directoryAddress) public virtual override initializer {
        super.initialize(directoryAddress);
    }

    ///--------
    /// GETTERS
    ///--------

    /// @notice Retrieves the total ETH and WETH value locked inside this deposit pool.
    /// @dev This function calculates and returns the combined value of ETH and WETH held by the deposit pool.
    ///      It sums the ETH balance of this contract and the WETH balance from the WETH contract.
    /// @return The total value in ETH and WETH locked in the deposit pool.
    function getTvlEth() public view returns (uint) {
        return balanceWeth;
    }

    /// @notice Retrieves the total RPL value locked inside this deposit pool.
    /// @dev This function calculates and returns the total amount of RPL tokens held by the deposit pool.
    /// @return The total value in RPL locked in the deposit pool.
    function getTvlRpl() public view returns (uint) {
        return balanceRpl;
    }

    ///--------
    /// ACTIONS
    ///--------

    /// @notice Unstakes a specified amount of RPL tokens.
    /// @dev This function allows an administrator to unstake a specified amount of RPL tokens from the Rocket Node Staking contract.
    /// @param _amount The amount of RPL tokens to unstake.
    /// @dev The tokens will be withdrawn from the Rocket Node Staking contract.
    function unstakeRpl(address _nodeAddress, uint256 _amount) external onlyProtocolOrAdmin {
        //   balanceRpl -= _amount;
        IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).withdrawRPL(_nodeAddress, _amount);
    }

    /// @notice Stakes a specified amount of RPL tokens on behalf of a node operator.
    /// @dev This function allows the protocol or an administrator to stake a specified amount of RPL tokens on behalf of a node operator
    ///      using the Rocket Node Staking contract.
    /// @param _nodeAddress The address of the node operator on whose behalf the RPL tokens are being staked.
    /// @param _amount The amount of RPL tokens to stake.
    /// @dev This function ensures that the specified amount of RPL tokens is approved and then staked for the given node operator.
    function stakeRPLFor(address _nodeAddress, uint256 _amount) external onlyProtocolOrAdmin {
        SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), _directory.getRocketNodeStakingAddress(), 0);
        SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), _directory.getRocketNodeStakingAddress(), _amount);
        // balanceRpl -= _amount;
        IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).stakeRPLFor(_nodeAddress, _amount);
    }

    /// @notice Distributes ETH to the vault and operator distributor.
    /// @dev This function converts the WETH balance to ETH, sends the required capital to the vault, and the surplus ETH to the operator distributor.
    function sendEthToDistributors() public onlyProtocolOrAdmin nonReentrant {
        IWETH weth = IWETH(_directory.getWETHAddress());

        // Initialize the vault and operator distributor addresses
        WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());
        OperatorDistributor operatorDistributor = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        console.log('sendEthToDistributors.C');

        // Calculate required capital and total balance
        uint256 requiredCapital = vweth.getRequiredCollateral();
        console.log('sendEthToDistributors.D');
        console.log(requiredCapital);

        if (balanceWeth >= requiredCapital) {
            console.log('sendEthToDistributors.E');

            // Send required capital in WETH to vault and surplus ETH to operator distributor

            balanceWeth -= requiredCapital;
            vweth.onWethBalanceIncrease(requiredCapital);
            SafeERC20.safeTransfer(weth, address(vweth), requiredCapital);

            console.log('sendEthToDistributors.E2');

            uint256 surplus = balanceWeth;
            console.log('sendEthToDistributors.E3');

            balanceWeth = 0;
            _gateOpen = true;
            weth.withdraw(surplus);
            _gateOpen = false;
            operatorDistributor.onEthBalanceIncrease{value: surplus}(surplus);
            console.log('sendEthToDistributors.F');
        } else {
            console.log('sendEthToDistributors.G');

            // If not enough ETH balance, convert the shortfall in WETH back to ETH and send it
            uint256 shortfall = balanceWeth;
            balanceWeth = 0;
            vweth.onWethBalanceIncrease(shortfall);
            SafeERC20.safeTransfer(IERC20(address(weth)), address(vweth), shortfall);
            console.log('sendEthToDistributors.H');
        }
        console.log('sendEthToDistributors.I');
    }

    /// @notice Distributes RPL to the vault and operator distributor.
    /// @dev This function transfers the required RPL capital to the vault and any surplus RPL to the operator distributor.
    function sendRplToDistributors() public onlyProtocolOrAdmin nonReentrant {
        console.log('sendRplToDistributors.A');

        // Initialize the RPLVault and the Operator Distributor addresses
        RPLVault vrpl = RPLVault(getDirectory().getRPLVaultAddress());
        address operatorDistributor = getDirectory().getOperatorDistributorAddress();
        IERC20 RPL = IERC20(_directory.getRPLAddress());
        console.log('sendRplToDistributors.B');

        // Fetch the required capital in RPL and the total RPL balance of the contract
        uint256 requiredCapital = vrpl.getRequiredCollateral();
        uint256 totalBalance = RPL.balanceOf(address(this));
        console.log('sendRplToDistributors.C');

        // Determine the amount to send to the RPLVault
        uint256 toRplVault = (totalBalance >= requiredCapital) ? requiredCapital : totalBalance;
        console.log('sendRplToDistributors.D');

        // Transfer RPL to the RPLVault
        if (toRplVault > 0) {
            console.log('sendRplToDistributors.E');

            SafeERC20.safeTransfer(IERC20(address(RPL)), address(vrpl), toRplVault);
        }

        // Transfer any surplus RPL to the Operator Distributor
        if (totalBalance > toRplVault) {
            console.log('sendRplToDistributors.F');

            SafeERC20.safeTransfer(IERC20(address(RPL)), operatorDistributor, totalBalance - toRplVault);
        }
        console.log('sendRplToDistributors.G');
    }

    function onWethBalanceIncrease(uint256 _amount) external onlyProtocol {
        balanceWeth += _amount;
    }

    function onWethBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceWeth -= _amount;
    }

    function onRplBalanceIncrease(uint256 _amount) external onlyProtocol {
        balanceRpl += _amount;
    }

    function onRplBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceRpl -= _amount;
    }

    function onClaimSkimmedRewards(IMinipool _minipool) external onlyProtocol {
        _minipool.distributeBalance(true);
    }

    function onRewardsRecieved(uint256 _amount) external onlyProtocol {
        IWETH weth = IWETH(_directory.getWETHAddress());
        WETHVault vweth = WETHVault(_directory.getWETHVaultAddress());

        uint256 treasuryPortion = vweth.getTreasuryPortion(_amount);
        uint256 nodeOperatorPortion = vweth.getNodeOperatorPortion(_amount);

        console.log("treasuryPortion", treasuryPortion);
        console.log("nodeOperatorPortion", nodeOperatorPortion);
        console.log("_amount", _amount);

        (bool success, ) = _directory.getTreasuryAddress().call{value: treasuryPortion}('');
        require(success, 'Transfer to treasury failed');

        (bool success2, ) = _directory.getYieldDistributorAddress().call{value: nodeOperatorPortion}('');
        require(success2, 'Transfer to yield distributor failed');

        uint256 communityPortion = _amount - treasuryPortion - nodeOperatorPortion;

        weth.deposit{value: communityPortion}();
        console.log('onRewardsRecieved.communityPortion', communityPortion);
        console.log('onRewardsRecieved.treasuryPortion', treasuryPortion);
        console.log('onRewardsRecieved.nodeOperatorFee', nodeOperatorPortion);
        balanceWeth += communityPortion;
    }

    function openGate() external onlyProtocol {
        _gateOpen = true;
    }

    function closeGate() external onlyProtocol {
        _gateOpen = false;
    }

    receive() external payable {
        require(_gateOpen);
    }
}
