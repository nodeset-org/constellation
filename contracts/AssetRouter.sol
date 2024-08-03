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
/// @notice Router to keep the protocol asset distributions balanced. Ensures a minimum source of liquidity for depositors.
/// Acts as a withdrawal address for the SuperNodeAccount. Takes in ETH & RPL from token mints and minipool yields, 
/// then sends to respective ERC4246 vaults or OperatorDistributor.
/// ANY WETH OR RPL SENT TO THIS CONTRACT FROM OUTSIDE THIS PROTOCOL WILL NOT BE ACCOUNTED FOR AND WILL BE LOST PERMANENTLY!
contract AssetRouter is UpgradeableBase {
    uint256 public balanceEthAndWeth;
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

    /// @notice Retrieves the total ETH and WETH value in the AssetRouter.
    /// @dev This function calculates and returns the combined value of ETH and WETH held by this contract.
    ///      It sums the ETH balance of this contract with known WETH deposits.
    /// @return The total value in ETH and WETH locked in the AssetRouter.
    function getTvlEth() public view returns (uint) {
        return balanceEthAndWeth;
    }

    /// @notice Retrieves the total RPL value locked inside the AssetRouter.
    /// @dev This function calculates and returns the total amount of RPL tokens held by the AssetRouter.
    /// @return The total value in RPL locked in the AssetRouter.
    function getTvlRpl() public view returns (uint) {
        return balanceRpl;
    }

    ///--------
    /// ACTIONS
    ///--------

    /// @notice Unstakes a specified amount of RPL tokens.
    /// @dev This function unstakes a specified amount of RPL tokens from the Rocket Node Staking contract.
    /// @param _amount The amount of RPL tokens to unstake.
    /// @dev The tokens will be withdrawn from the Rocket Node Staking contract into this contract. 
    /// Outside callers MUST call onRplBalanceIncrease or onRplBalanceDecrease to appropriately account for this.
    function unstakeRpl(uint256 _amount) external onlyProtocol {
        IRocketNodeStaking(getDirectory().getRocketNodeStakingAddress()).withdrawRPL(getDirectory().getSuperNodeAddress(), _amount);
    }

    /// @notice Stakes a specified amount of RPL tokens on behalf of the SuperNode.
    /// @dev This function allows the protocol to stake a specified amount of RPL tokens on the SuperNode
    ///      using the Rocket Node Staking contract.
    /// @param _amount The amount of RPL tokens to stake.
    /// @dev This function ensures that the specified amount of RPL tokens is approved and then staked 
    /// for the SuperNode.
    function stakeRpl(uint256 _amount) external onlyProtocol {
        SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), _directory.getRocketNodeStakingAddress(), 0);
        SafeERC20.safeApprove(IERC20(_directory.getRPLAddress()), _directory.getRocketNodeStakingAddress(), _amount);
        IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).stakeRPLFor(getDirectory().getSuperNodeAddress(), _amount);
    }

    /// @notice Distributes ETH to the vault and operator distributor.
    /// @dev This function converts the WETH balance to ETH, sends the required capital to the vault, 
    /// and the surplus ETH to the OperatorDistributor.
    function sendEthToDistributors() public onlyProtocolOrAdmin nonReentrant {
        IWETH weth = IWETH(_directory.getWETHAddress());

        // Initialize the vault and operator distributor addresses
        WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());
        OperatorDistributor operatorDistributor = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        console.log('sendEthToDistributors.C');

        uint256 requiredCapital = vweth.getRequiredCollateral();
        console.log('sendEthToDistributors.D');
        console.log(requiredCapital);

        if (balanceEthAndWeth >= requiredCapital) {
            console.log('sendEthToDistributors.E');

            balanceEthAndWeth -= requiredCapital;
            vweth.onWethBalanceIncrease(requiredCapital);
            SafeERC20.safeTransfer(weth, address(vweth), requiredCapital);

            console.log('sendEthToDistributors.E2');

            uint256 surplus = balanceEthAndWeth;
            console.log('sendEthToDistributors.E3');

            balanceEthAndWeth = 0;
            _gateOpen = true;
            weth.withdraw(surplus);
            _gateOpen = false;
            operatorDistributor.onEthBalanceIncrease{value: surplus}(surplus);
            console.log('sendEthToDistributors.F');
        } else {
            console.log('sendEthToDistributors.G');

            uint256 shortfall = balanceEthAndWeth;
            balanceEthAndWeth = 0;
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
        OperatorDistributor operatorDistributor = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        IERC20 rpl = IERC20(_directory.getRPLAddress());
        console.log('sendRplToDistributors.B');

        // Fetch the required capital in RPL and the total RPL balance of the contract
        uint256 requiredCapital = vrpl.getRequiredCollateral();
        console.log('sendRplToDistributors.C');

        // Transfer RPL to the RPLVault
        if (balanceRpl >= requiredCapital) {
            console.log('sendRplToDistributors.E');

            balanceRpl -= requiredCapital;
            SafeERC20.safeTransfer(IERC20(address(rpl)), address(vrpl), requiredCapital);
            vrpl.onRplBalanceIncrease(requiredCapital);

            console.log('sendRplToDistributors.E2');

            uint256 surplus = balanceRpl;
            console.log('sendRplToDistributors.E3');

            balanceRpl = 0;
            SafeERC20.safeTransfer(IERC20(address(rpl)), address(operatorDistributor), surplus);
            operatorDistributor.onRplBalanceIncrease(surplus);

            console.log('sendRplToDistributors.F');
        } else {
            uint256 shortfall = balanceRpl;
            balanceRpl = 0;
            SafeERC20.safeTransfer(IERC20(address(rpl)), address(vrpl), shortfall);
            vrpl.onRplBalanceIncrease(shortfall);
        }

        console.log('sendRplToDistributors.G');
    }

    function onWethBalanceIncrease(uint256 _amount) external onlyProtocol {
        balanceEthAndWeth += _amount;
    }

    function onWethBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceEthAndWeth -= _amount;
    }

    function onRplBalanceIncrease(uint256 _amount) external onlyProtocol {
        balanceRpl += _amount;
        console.log(
            'ar.onRplBalanceIncrease.balanceOf.rpl',
            IERC20(_directory.getRPLAddress()).balanceOf(address(this))
        );
        console.log('ar.onRplBalanceIncrease.balanceRpl', balanceRpl);
    }

    function onRplBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceRpl -= _amount;
    }

    function onClaimSkimmedRewards(IMinipool _minipool) external onlyProtocol {
        _minipool.distributeBalance(true);
    }

    function onExitedMinipool(IMinipool _minipool) external onlyProtocol {
        _minipool.distributeBalance(false);
    }

    function onEthRewardsReceived(uint256 _amount, uint256 treasuryFee, uint256 noFee) external onlyProtocol {
        IWETH weth = IWETH(_directory.getWETHAddress());
        OperatorDistributor od = OperatorDistributor(getDirectory().getOperatorDistributorAddress());

        uint256 treasuryPortion = _amount.mulDiv(treasuryFee, 1e18);
        uint256 nodeOperatorPortion = _amount.mulDiv(noFee, 1e18);

        console.log('treasuryPortion', treasuryPortion);
        console.log('nodeOperatorPortion', nodeOperatorPortion);
        console.log('_amount', _amount);
        console.log('ethBalance', address(this).balance);

        (bool success, ) = _directory.getTreasuryAddress().call{value: treasuryPortion}('');
        require(success, 'Transfer to treasury failed');

        (bool success2, ) = _directory.getYieldDistributorAddress().call{value: nodeOperatorPortion}('');
        require(success2, 'Transfer to yield distributor failed');

        uint256 communityPortion = _amount - treasuryPortion - nodeOperatorPortion;

        weth.deposit{value: communityPortion}();
        console.log('onEthRewardsReceived.communityPortion', communityPortion);
        console.log('onEthRewardsReceived.treasuryPortion', treasuryPortion);
        console.log('onEthRewardsReceived.nodeOperatorFee', nodeOperatorPortion);
        balanceEthAndWeth += communityPortion;
        od.onIncreaseOracleError(communityPortion);
    }

    function onRplRewardsRecieved(uint256 _amount, uint256 avgTreasuryFee) external onlyProtocol {
        uint256 treasuryPortion = _amount.mulDiv(avgTreasuryFee, 1e18);

        console.log('treasuryPortion', treasuryPortion);
        console.log('_amount', _amount);

        IERC20 rpl = IERC20(_directory.getRPLAddress());
        SafeERC20.safeTransfer(rpl, _directory.getTreasuryAddress(), treasuryPortion);

        uint256 communityPortion = _amount - treasuryPortion;

        console.log('onRplRewardsRecieved.communityPortion', communityPortion);
        console.log('onRplRewardsRecieved.treasuryPortion', treasuryPortion);
        balanceRpl += communityPortion;
    }

    function openGate() external onlyProtocol {
        _gateOpen = true;
    }

    function closeGate() external onlyProtocol {
        _gateOpen = false;
    }

    /// @dev We can't use a named payable function because Rocket Pool needs to send ETH to this contract
    receive() external payable {
        require(_gateOpen);
    }

    fallback() external payable {
        require(_gateOpen);
    }
}
