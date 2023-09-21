// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import "../UpgradeableBase.sol";
import "../Whitelist/Whitelist.sol";
import "../DepositPool.sol";
import "../PriceFetcher.sol";

import "../Interfaces/RocketPool/IRocketStorage.sol";
import "../Interfaces/RocketPool/IMinipool.sol";
import "../Interfaces/RocketPool/IRocketNodeManager.sol";
import "../Interfaces/RocketPool/IRocketNodeStaking.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract OperatorDistributor is UpgradeableBase {

    event MinipoolCreated(address indexed _minipoolAddress, address indexed _nodeAddress);
    event MinipoolDestroyed(address indexed _minipoolAddress, address indexed _nodeAddress);
    event WarningNoMiniPoolsToHarvest();

    uint public _queuedEth;

    address[] public minipoolAddresses;

    uint256 public nextMinipoolHavestIndex;
    uint256 public targetStakeRatio; // 150%

    uint256 public numMinipoolsProcessedPerInterval;


    mapping(address => uint256) public minipoolIndexMap;
    mapping(address => uint256) public minipoolAmountFundedEth;
    mapping(address => uint256) public minipoolAmountFundedRpl;

    mapping(address => address[]) nodeOperatorOwnedMinipools;

    constructor() initializer {}

    function initialize(address _rocketStorageAddress)
        public
        initializer
        override
    {
        super.initialize(_rocketStorageAddress);
        targetStakeRatio = 1.5e18;
        numMinipoolsProcessedPerInterval = 1;
    }

    receive() external payable {
        _queuedEth += msg.value;
    }

    function getAmountFundedEth() public view returns (uint256) {
        uint256 amountFunded;
        for (uint i = 0; i < minipoolAddresses.length; i++) {
            amountFunded += minipoolAmountFundedEth[minipoolAddresses[i]];
        }
        return amountFunded;
    }

    function getAmountFundedRpl() public view returns (uint256) {
        uint256 amountFunded;
        for (uint i = 0; i < minipoolAddresses.length; i++) {
            amountFunded += minipoolAmountFundedRpl[minipoolAddresses[i]];
        }
        return amountFunded;
    }

    /// @notice Gets the total ETH value locked inside the protocol, including inside of validators, the OperatorDistributor,
    // and this contract.
    function getTvlEth() public view returns (uint) {
        return address(this).balance + getAmountFundedEth();
    }

    /// @notice Gets the total RPL value locked inside the protocol, including inside of validators, the OperatorDistributor,
    // and this contract.
    function getTvlRpl() public view returns (uint) {
        return
            RocketTokenRPLInterface(Constants.RPL_CONTRACT_ADDRESS)
                .balanceOf(address(this)) + getAmountFundedRpl();
    }

    /// @notice Should be called by admin server when a node operator exists a minipool
    function removeMinipoolAddress(
        address _address
    ) public onlyProtocolOrAdmin {
        uint index = minipoolIndexMap[_address] - 1;
        require(index < minipoolAddresses.length, "Address not found.");

        // Move the last address into the spot located by index
        address lastAddress = minipoolAddresses[minipoolAddresses.length - 1];
        minipoolAddresses[index] = lastAddress;
        minipoolIndexMap[lastAddress] = index;
        // Remove the last address
        minipoolAddresses.pop();
        delete minipoolIndexMap[_address];

        // Set amount funded to 0 since it's being returned to DP
        minipoolAmountFundedEth[_address] = 0;
        minipoolAmountFundedRpl[_address] = 0;

        emit MinipoolDestroyed(_address, IMinipool(_address).getNodeAddress());
    }

    function removeNodeOperator(
        address _address
    ) external onlyProtocolOrAdmin {
        // remove all minipools owned by node operator
        address[] memory minipools = nodeOperatorOwnedMinipools[_address];
        for (uint i = 0; i < minipools.length; i++) {
            removeMinipoolAddress(minipools[i]);
        }
        delete nodeOperatorOwnedMinipools[_address];
    }

    function _stakeRPLFor(address _nodeAddress) internal {
        IRocketNodeStaking nodeStaking = IRocketNodeStaking(
            getDirectory().getRocketNodeStakingAddress()
        );
        uint256 minimumRplStake = IRocketNodeStaking(
            getDirectory().getRocketNodeStakingAddress()
        ).getNodeMinimumRPLStake(_nodeAddress);

        // approve the node staking contract to spend the RPL
        RocketTokenRPLInterface rpl = RocketTokenRPLInterface(
            Constants.RPL_CONTRACT_ADDRESS
        );
        require(
            rpl.approve(
                getDirectory().getRocketNodeStakingAddress(),
                minimumRplStake
            )
        );

        // update amount funded rpl
        minipoolAmountFundedRpl[_nodeAddress] = minimumRplStake;

        nodeStaking.stakeRPLFor(_nodeAddress, minimumRplStake);
    }

    function _validateWithdrawalAddress(address _nodeAddress) internal view {
        IRocketStorage rocketStorage = IRocketStorage(
            getDirectory().getRocketStorageAddress()
        );

        address withdrawalAddress = rocketStorage.getNodeWithdrawalAddress(
            _nodeAddress
        );

        address depositPoolAddr = getDirectory().getDepositPoolAddress();

        require(
            withdrawalAddress == depositPoolAddr,
            "OperatorDistributor: minipool must delegate control to deposit pool"
        );
    }

    /// @notice Should be called by admin to prepare a node for minipool creation
    /// @dev This function will stake the minimum amount of RPL for the node
    /// @param _nodeAddress The address of the node operator whose withdrawal address will be set to the deposit pool
    function prepareNodeForReimbursement(
        address _nodeAddress
    ) external onlyProtocolOrAdmin {
        // stakes (2.4 + 100% padding) eth worth of rpl for the node
        _validateWithdrawalAddress(_nodeAddress);
        uint256 numValidators = Whitelist(_directory.getWhitelistAddress()).getNumberOfValidators(_nodeAddress);
        performTopUp(_nodeAddress, 2.4 ether * numValidators);
    }

    function reimburseNodeForMinipool(
        bytes memory sig, // sig from admin server
        address newMinipoolAdress
    ) public {
        IMinipool minipool = IMinipool(newMinipoolAdress);
        address nodeAddress = minipool.getNodeAddress();
        Whitelist whitelist = Whitelist(getDirectory().getWhitelistAddress());
        require(
            whitelist.getIsAddressInWhitelist(nodeAddress),
            "OperatorDistributor: minipool node operator not in whitelist"
        );

        // validate that the newMinipoolAdress was signed by the admin address
        bytes32 messageHash = keccak256(abi.encode(newMinipoolAdress));
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(
            messageHash
        );
        address signer = ECDSA.recover(ethSignedMessageHash, sig);
        require(
            _directory.hasRole(Constants.ADMIN_SERVER_ROLE, signer),
            "OperatorDistributor: invalid signature"
        );

        _validateWithdrawalAddress(nodeAddress);

        IRocketNodeManager nodeManager = IRocketNodeManager(
            getDirectory().getRocketNodeManagerAddress()
        );

        require(
            nodeManager.getSmoothingPoolRegistrationState(nodeAddress),
            "OperatorDistributor: minipool must be registered in smoothing pool"
        );

        uint256 bond = minipool.getNodeDepositBalance();

        require(
            _queuedEth >= bond,
            "OperatorDistributor: insufficient ETH in queue"
        );

        uint256 numValidators = Whitelist(_directory.getWhitelistAddress()).getNumberOfValidators(nodeAddress);
        performTopUp(nodeAddress, bond * numValidators);

        // register minipool with node operator
        whitelist.registerNewValidator(nodeAddress);

        // new minipool owned by node operator
        nodeOperatorOwnedMinipools[nodeAddress].push(newMinipoolAdress);

        // add minipool to minipoolAddresses
        minipoolAddresses.push(newMinipoolAdress);
        minipoolIndexMap[newMinipoolAdress] = minipoolAddresses.length;

        emit MinipoolCreated(newMinipoolAdress, nodeAddress);

        // updated amount funded eth
        minipoolAmountFundedEth[newMinipoolAdress] = bond;

        // transfer out eth
        _queuedEth -= bond;
        payable(nodeAddress).transfer(bond);
    }

    /// @notice This will top up the node operator's RPL stake if it is below the target stake ratio
    /// @param _nodeAddress The node operator's address
    /// @param _ethStaked The amount of ETH staked by the node operator
    function performTopUp(
        address _nodeAddress,
        uint256 _ethStaked
    ) public onlyProtocolOrAdmin {
        uint256 rplStaked = IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).getNodeRPLStake(_nodeAddress);
        uint256 ethPriceInRpl = PriceFetcher(
            getDirectory().getPriceFetcherAddress()
        ).getPrice();

        uint256 stakeRatio = rplStaked == 0 ? 1e18 : _ethStaked * ethPriceInRpl * 1e18 / rplStaked;
        if (stakeRatio < targetStakeRatio) {
            uint256 requiredStakeRpl = (_ethStaked * ethPriceInRpl / targetStakeRatio) - rplStaked;
            // Make sure the contract has enough RPL to stake
            uint256 currentRplBalance = RocketTokenRPLInterface(Constants.RPL_CONTRACT_ADDRESS).balanceOf(address(this));
            if(currentRplBalance >= requiredStakeRpl) {
                // stakeRPLOnBehalfOf
                SafeERC20.safeApprove(RocketTokenRPLInterface(Constants.RPL_CONTRACT_ADDRESS), _directory.getRocketNodeStakingAddress(), requiredStakeRpl);
                IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).stakeRPLFor(_nodeAddress, requiredStakeRpl);
            } else {
                // stake what we have
                SafeERC20.safeApprove(RocketTokenRPLInterface(Constants.RPL_CONTRACT_ADDRESS), _directory.getRocketNodeStakingAddress(), currentRplBalance);
                IRocketNodeStaking(_directory.getRocketNodeStakingAddress()).stakeRPLFor(_nodeAddress, currentRplBalance);
            }
        }
    }

    /// @notice called during the creation of new intervals to withdraw rewards from minipools and top up rpl stake
    function processNextMinipool() external onlyProtocol {
        if (minipoolAddresses.length == 0) {
            emit WarningNoMiniPoolsToHarvest();
            return;
        }

        for(uint i = 0; i < numMinipoolsProcessedPerInterval; i++) {
            _processNextMinipool();
        }
    }

    function _processNextMinipool() internal {
        uint256 index = nextMinipoolHavestIndex % minipoolAddresses.length;

        IMinipool minipool = IMinipool(minipoolAddresses[index]);

        // process top up
        address nodeAddress = minipool.getNodeAddress();

        uint256 numberOfValidators = Whitelist(_directory.getWhitelistAddress()).getNumberOfValidators(nodeAddress);
        performTopUp(nodeAddress, 8 * numberOfValidators);

        nextMinipoolHavestIndex = index + 1;

        uint256 balance = minipool.getNodeDepositBalance();

        minipool.distributeBalance(balance > 8 ether);
    }

    function setNumMinipoolsProcessedPerInterval(uint256 _numMinipoolsProcessedPerInterval) external onlyAdmin {
        numMinipoolsProcessedPerInterval = _numMinipoolsProcessedPerInterval;
    }

    function getMinipoolAddresses() external view returns (address[] memory) {
        return minipoolAddresses;
    }
}
