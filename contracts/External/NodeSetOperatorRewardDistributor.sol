// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

library RewardDistributorConstants {
    bytes32 internal constant NODESET_ADMIN_SERVER_ROLE = keccak256('NODESET_ADMIN_SERVER_ROLE');
    bytes32 internal constant NODESET_ADMIN_ROLE = keccak256('NODESET_ADMIN_ROLE');
}

contract NodeSetOperatorRewardDistributorV1Storage {
    event RewardDistributed(bytes32 indexed _did, address indexed _rewardee);

    mapping(bytes32 => uint256) public nonces;

    uint256 public nonce;
}

/**
 * @title NodeSetOperatorRewardDistributor
 * @author Mike Leach, Theodore Clapp
 * @dev Distributes earned rewards to a decentralized operator set using a proof-of-authority model.
 * This is the first step for a rewards system. It allows for all use-cases and is cheap to use, yet centralized.
 * Potential future upgrades:
 * - categorized income streams
 * - ZK-proven earnings
 * - utilize an on-chain operator database
 */
contract NodeSetOperatorRewardDistributor is
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuard,
    NodeSetOperatorRewardDistributorV1Storage
{
    constructor() initializer {}

    function initialize(address _admin, address _adminServer) public initializer {
        _grantRole(RewardDistributorConstants.NODESET_ADMIN_ROLE, _admin);
        _grantRole(RewardDistributorConstants.NODESET_ADMIN_SERVER_ROLE, _adminServer);
        _setRoleAdmin(
            RewardDistributorConstants.NODESET_ADMIN_SERVER_ROLE,
            RewardDistributorConstants.NODESET_ADMIN_ROLE
        );
        _revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Internal function to authorize contract upgrades.
    /// @dev This function is used internally to ensure that only administrators can authorize contract upgrades.
    ///      It checks whether the sender has the required ADMIN_ROLE before allowing the upgrade.
    function _authorizeUpgrade(address) internal view override {
        require(hasRole(RewardDistributorConstants.NODESET_ADMIN_ROLE, msg.sender), 'Upgrading only allowed by admin!');
    }

    /**
     * @notice Distributes rewards accrued for a specific rewardee.
     * @param _sig The claim data, including amount and the authoritative signature
     * @param _did The unique, unchanging id of the operator making the claim.
     */
    function claimRewards(
        bytes calldata _sig,
        address _token,
        bytes32 _did,
        address _rewardee,
        uint256 _amount
    ) public nonReentrant {
        require(_rewardee != address(0), 'rewardee cannot be zero address');

        address recoveredAddress = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(
                keccak256(
                    abi.encodePacked(
                        _token,
                        _did,
                        _rewardee,
                        _amount,
                        nonces[_did],
                        nonce,
                        address(this),
                        block.chainid
                    )
                )
            ),
            _sig
        );

        require(
            this.hasRole(RewardDistributorConstants.NODESET_ADMIN_SERVER_ROLE, recoveredAddress),
            'bad signer role, params, or encoding'
        );

        // send eth to rewardee
        if (_token == address(0)) {
            (bool success, ) = _rewardee.call{value: _amount}('');
            require(success, '_rewardee failed to claim');
        } else {
            SafeERC20.safeTransfer(IERC20(_token), _rewardee, _amount);
        }

        nonces[_did]++;

        emit RewardDistributed(_did, _rewardee);
    }

    function invalidateAllOutstandingSigs() external {
        require(
            this.hasRole(RewardDistributorConstants.NODESET_ADMIN_ROLE, msg.sender),
            'caller must be nodeset admin'
        );
        nonce++;
    }

    function invalidateSingleOustandingSig(bytes32 _did) external {
        require(
            this.hasRole(RewardDistributorConstants.NODESET_ADMIN_ROLE, msg.sender),
            'caller must be nodeset admin'
        );
        nonces[_did]++;
    }

    receive() external payable {}
}
