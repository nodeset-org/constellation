// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/utils/Strings.sol';

import './UpgradeableBase.sol';
import './Operator/OperatorDistributor.sol';
import './Operator/NodeSetOperatorRewardDistributor.sol';
import './Interfaces/RocketPool/IRocketNodeStaking.sol';
import './Tokens/WETHVault.sol';
import './Tokens/RPLVault.sol';

import './Interfaces/RocketPool/IRocketMerkleDistributorMainnet.sol';
import './Interfaces/IWETH.sol';
import './Interfaces/Oracles/IBeaconOracle.sol';
import './Utils/Constants.sol';

/// @notice Router to keep the protocol asset distributions balanced. Ensures a minimum source of liquidity for depositors.
/// Acts as a withdrawal address for the SuperNodeAccount. Takes in ETH & RPL from token mints and minipool yields, 
/// then sends to respective ERC4246 vaults or OperatorDistributor.
/// ANY WETH OR RPL SENT TO THIS CONTRACT FROM OUTSIDE THIS PROTOCOL WILL NOT BE ACCOUNTED FOR AND WILL BE LOST PERMANENTLY!
contract AssetRouter is UpgradeableBase {
    uint256 public balanceEthAndWeth;
    uint256 public balanceRpl;

    /// @dev This contract's receive and fallback functions must exist to receive minipool rewards, but they are locked
    /// to prevent anyone from losing their ETH by sending it to this contract. When rewards are coming in, this gate
    /// is opened temporarily and should be closed immediately after.
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
    function sendEthToDistributors() public onlyProtocol nonReentrant {
        IWETH weth = IWETH(_directory.getWETHAddress());

        // Initialize the vault and operator distributor addresses
        WETHVault vweth = WETHVault(getDirectory().getWETHVaultAddress());
        OperatorDistributor operatorDistributor = OperatorDistributor(getDirectory().getOperatorDistributorAddress());

        uint256 requiredCapital = vweth.getRequiredCollateral();
        if (balanceEthAndWeth >= requiredCapital) {
            balanceEthAndWeth -= requiredCapital;
            vweth.onWethBalanceIncrease(requiredCapital);
            SafeERC20.safeTransfer(weth, address(vweth), requiredCapital);

            uint256 surplus = balanceEthAndWeth;

            balanceEthAndWeth = 0;
            _gateOpen = true;
            weth.withdraw(surplus);
            _gateOpen = false;
            operatorDistributor.onEthBalanceIncrease{value: surplus}(surplus);
        } else {
            uint256 shortfall = balanceEthAndWeth;
            balanceEthAndWeth = 0;
            vweth.onWethBalanceIncrease(shortfall);
            SafeERC20.safeTransfer(IERC20(address(weth)), address(vweth), shortfall);
        }
    }

    /// @notice Distributes RPL to the vault and operator distributor.
    /// @dev This function transfers the required RPL capital to the vault and any surplus RPL to the operator distributor.
    function sendRplToDistributors() public onlyProtocol nonReentrant {

        // Initialize the RPLVault and the Operator Distributor addresses
        RPLVault vrpl = RPLVault(getDirectory().getRPLVaultAddress());
        OperatorDistributor operatorDistributor = OperatorDistributor(getDirectory().getOperatorDistributorAddress());
        IERC20 rpl = IERC20(_directory.getRPLAddress());

        // Fetch the required capital in RPL and the total RPL balance of the contract
        uint256 requiredCapital = vrpl.getRequiredCollateral();

        // Transfer RPL to the RPLVault
        if (balanceRpl >= requiredCapital) {

            balanceRpl -= requiredCapital;
            SafeERC20.safeTransfer(IERC20(address(rpl)), address(vrpl), requiredCapital);
            vrpl.onRplBalanceIncrease(requiredCapital);

            uint256 surplus = balanceRpl;

            balanceRpl = 0;
            SafeERC20.safeTransfer(IERC20(address(rpl)), address(operatorDistributor), surplus);
            operatorDistributor.onRplBalanceIncrease(surplus);
        } else {
            uint256 shortfall = balanceRpl;
            balanceRpl = 0;
            SafeERC20.safeTransfer(IERC20(address(rpl)), address(vrpl), shortfall);
            vrpl.onRplBalanceIncrease(shortfall);
        }
    }

    function onWethBalanceIncrease(uint256 _amount) external onlyProtocol {
        balanceEthAndWeth += _amount;
    }

    function onWethBalanceDecrease(uint256 _amount) external onlyProtocol {
        balanceEthAndWeth -= _amount;
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

    function onExitedMinipool(IMinipool _minipool) external onlyProtocol {
        console.log("AssetRouter balance before distribute", address(this).balance);
        _minipool.distributeBalance(false);
        console.log("AssetRouter balance after distribute", address(this).balance);
    }

    /// @notice Called by the protocol when a minipool is distributed to this contract, which acts as the SuperNode 
    /// withdrawal address for both ETH and RPL from Rocket Pool.
    /// Splits incoming assets up among the Treasury, NodeSetOperatorRewardDistributor, and the WETHVault/OperatorDistributor based on the 
    /// rewardsAmount expected.
    /// @param rewardAmount amount of ETH rewards expected
    /// @param avgTreasuryFee Average treasury fee for the rewards received across all the minipools the rewards came from
    /// @param avgOperatorsFee Average operator fee for the rewards received across all the minipools the rewards came from
    /// @param updateOracleError Should the oracle error be updated? Should be true if the ETH is coming from a minipool distribution,
    /// otherwise (for merkle claims) it should be false
    function onEthRewardsReceived(uint256 rewardAmount, uint256 avgTreasuryFee, uint256 avgOperatorsFee, bool updateOracleError) public onlyProtocol {
        if(rewardAmount == 0)
            return;

        uint256 treasuryPortion = rewardAmount.mulDiv(avgTreasuryFee, 1e18);
        uint256 nodeOperatorPortion = rewardAmount.mulDiv(avgOperatorsFee, 1e18);

        (bool success, ) = getDirectory().getTreasuryAddress().call{value: treasuryPortion}('');
        require(success, 'Transfer to treasury failed');

        (bool success2, ) = getDirectory().getNodeSetOperatorRewardDistributorAddress().call{value: nodeOperatorPortion}('');
        require(success2, 'Transfer to yield distributor failed');

        uint256 communityPortion = rewardAmount - treasuryPortion - nodeOperatorPortion;

        IWETH(getDirectory().getWETHAddress()).deposit{value: communityPortion}();

        balanceEthAndWeth += communityPortion;

        if(updateOracleError){
            OperatorDistributor(getDirectory().getOperatorDistributorAddress()).onIncreaseOracleError(communityPortion);
        }
    }

    /// @notice Called by the protocol when a minipool is distributed to this contract, which acts as the SuperNode 
    /// withdrawal address for both ETH and RPL from Rocket Pool.
    /// Only takes in ETH and sends to WETHVault/OperatorDistributor depending on liquidity conditions based on the 
    /// bondAmount expected. Does NOT take fees.
    function onEthBondReceived(uint256 bondAmount) public onlyProtocol {
        if(bondAmount == 0)
            return;

        console.log("AR is trying to send", bondAmount);
        IWETH(getDirectory().getWETHAddress()).deposit{value: bondAmount}();
        balanceEthAndWeth += bondAmount;
    }

    /// @notice Called by the protocol when a minipool is distributed to this contract, which acts as the SuperNode 
    /// withdrawal address for both ETH and RPL from Rocket Pool.
    /// Splits incoming assets up among the Treasury, NodeSetOperatorRewardDistributor, and the WETHVault/OperatorDistributor based on
    /// the rewardsAmount and bondAmount specified.
    /// @param rewardAmount amount of ETH rewards expected
    /// @param bondAmount amount of ETH bond expected
    /// @param avgTreasuryFee Average treasury fee for the rewards received across all the minipools the rewards came from
    /// @param avgOperatorsFee Average operator fee for the rewards received across all the minipools the rewards came from
    function onEthRewardsAndBondReceived(uint256 rewardAmount, uint256 bondAmount, uint256 avgTreasuryFee, uint256 avgOperatorsFee, bool updateOracleError) external onlyProtocol {
        onEthBondReceived(bondAmount);
        onEthRewardsReceived(rewardAmount, avgTreasuryFee, avgOperatorsFee, updateOracleError);
    }


    /// @notice Called by the protocol when RPL rewards are distributed to this contract, which acts as the SuperNode 
    /// withdrawal address for both ETH and RPL rewards from Rocket Pool.
    /// Splits incoming assets up among the Treasury, NodeSetOperatorRewardDistributor, and the WETHVault/OperatorDistributor.
    /// @param _amount amount of RPL rewards expected
    /// @param avgTreasuryFee Average treasury fee for the rewards received across all the minipools the rewards came from
    function onRplRewardsRecieved(uint256 _amount, uint256 avgTreasuryFee) external onlyProtocol {
        uint256 treasuryPortion = _amount.mulDiv(avgTreasuryFee, 1e18);

        IERC20 rpl = IERC20(_directory.getRPLAddress());
        SafeERC20.safeTransfer(rpl, _directory.getTreasuryAddress(), treasuryPortion);

        uint256 communityPortion = _amount - treasuryPortion;

        balanceRpl += communityPortion;
    }

    function openGate() external onlyProtocol {
        _gateOpen = true;
    }

    function closeGate() external onlyProtocol {
        _gateOpen = false;
    }

    /// @dev We can't use a named or address-locked payable function because Rocket Pool needs to send ETH to this contract
    receive() external payable {
        require(_gateOpen);
    }

    fallback() external payable {
        require(_gateOpen);
    }
}
