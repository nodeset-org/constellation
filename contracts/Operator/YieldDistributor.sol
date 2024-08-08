// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './OperatorDistributor.sol';
import '../Whitelist/Whitelist.sol';
import '../Utils/ProtocolMath.sol';
import '../UpgradeableBase.sol';

import '../Interfaces/RocketPool/IRocketNodeStaking.sol';
import '../Interfaces/Oracles/IBeaconOracle.sol';
import '../Utils/Constants.sol';

import './SuperNodeAccount.sol';

import "hardhat/console.sol";

struct Reward {
    address recipient;
    uint eth;
}

struct Claim {
    bytes sig;
    uint256 sigGenesisTime;
    uint256 amount;
}

/**
 * @title YieldDistributor
 * @author Mike Leach
 * @dev Distributes earned rewards to a decentralized operator set using a proof-of-authority model.
 * This is the first step for a rewards system, and future versions may be entirely on-chain using ZK-proofs of
 * beacon state information to check perforance data, validator status, etc. Currently, Rocket Pool fully trusts the oDAO
 * to handle rewards, however, so there is no point in this work until this is resolved at the base layer.
 */
contract YieldDistributor is UpgradeableBase {
    event RewardDistributed(Reward);

    uint256 public claimSigNonce;
    mapping(bytes => bool) public claimSigsUsed;
    uint256 public claimSigExpiry;

    /**
     * @notice Initializes the contract with the specified directory address and sets the initial configurations.
     * @dev This function is an override and should be called only once. It sets up the initial values
     * for the contract.
     * @param _directory The address of the directory contract or service that this contract will reference.
     */
    function initialize(address _directory) public override initializer {
        super.initialize(_directory);
        claimSigExpiry = 1 days;
    }

    /****
     * EXTERNAL
     */

    /**
     * @notice Distributes rewards accrued for a specific rewardee.
     * @param _rewardee The address of the operator to distribute rewards to.
     * @param claim The claim data, including amount and the authoritative signature
     */
    function claimRewards(address _rewardee, Claim calldata claim) public nonReentrant {
        require(_rewardee != address(0), 'rewardee cannot be zero address');
        Whitelist whitelist = getWhitelist();
        Operator memory operator = getWhitelist().getOperatorAtAddress(_rewardee);

        require(whitelist.getIsAddressInWhitelist(_rewardee));

        require(!claimSigsUsed[claim.sig], 'sig already used');
        claimSigsUsed[claim.sig] = true;

        require(block.timestamp - claim.sigGenesisTime < claimSigExpiry, 'as sig expired');

        address recoveredAddress = ECDSA.recover(
                ECDSA.toEthSignedMessageHash(
                    keccak256(
                        abi.encodePacked(
                            claim.amount,
                            claim.sigGenesisTime,
                            address(this),
                            block.chainid
                        )
                    )
                ),
                claim.sig
            );
        require(
                _directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress),
                'signer must have permission from admin server role'
            );

        // send eth to rewardee
        (bool success, ) = operator.operatorController.call{value: claim.amount}("");
        require(success, "_rewardee failed to claim");

        OperatorDistributor(getDirectory().getOperatorDistributorAddress()).processNextMinipool();

        emit RewardDistributed(Reward(_rewardee, claim.amount));
    }

    /**
     * @notice Transfers ETH to the Treasurer directly. In case of problems with rewards claiming, the Treasurer can manually rectify the situation.
     * @dev This function can only be called by the treasurer.
     */
    function treasurySweep(uint256 amount) public onlyTreasurer {
        require(amount < address(this).balance, 'amount must be less than contract balance');
        (bool success, ) = getDirectory().getTreasuryAddress().call{value: amount}('');
        require(success, 'Failed to send ETH to treasury');
    }

    /**
     * @notice Retrieves the current Whitelist contract instance.
     * @return Whitelist The current Whitelist contract instance.
     * @dev This is a private helper function used internally to obtain the Whitelist contract instance from the directory.
     */
    function getWhitelist() private view returns (Whitelist) {
        return Whitelist(_directory.getWhitelistAddress());
    }

    /**
     * @notice Modifier to ensure the calling account is a whitelisted operator.
     * @dev Throws if the calling account is not in the operator whitelist.
     */
    modifier onlyOperator() {
        require(getWhitelist().getIsAddressInWhitelist(msg.sender));
        _;
    }

    receive() external payable {}
}