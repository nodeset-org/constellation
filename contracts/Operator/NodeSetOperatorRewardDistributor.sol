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

import 'hardhat/console.sol';

/**
 * @title NodeSetOperatorRewardDistributor
 * @author Mike Leach, Theodore Clapp
 * @dev Distributes earned rewards to a decentralized operator set using a proof-of-authority model.
 * This is the first step for a rewards system, and future versions may be entirely on-chain using ZK-proofs of
 * beacon state information to check perforance data, validator status, etc. Currently, Rocket Pool fully trusts the oDAO
 * to handle rewards, however, so there is no point in this work until this is resolved at the base layer..
 */
contract NodeSetOperatorRewardDistributor is UpgradeableBase {
    event RewardDistributed(address _rewardee);
    event EthReceived(uint256);

    mapping(address => uint256) public nonces;
    mapping(bytes => bool) public claimSigsUsed;

    /**
     * @notice Initializes the contract with the specified directory address and sets the initial configurations.
     * @dev This function is an override and should be called only once. It sets up the initial values
     * for the contract.
     * @param _directory The address of the directory contract or servu yesterday just got a lot more complicated so I could really use a lu
    }

    /****
     * EXTERNAL
     */

    /**
     * @notice Distributes rewards accrued for a specific rewardee.
     * @param _sig The claim data, including amount and the authoritative signature
     */
    function claimRewards(bytes calldata _sig, address _token, address _rewardee, uint256 _amount) public nonReentrant {
        require(_rewardee != address(0), 'rewardee cannot be zero address');
        require(!claimSigsUsed[_sig], 'sig already used');
        claimSigsUsed[_sig] = true;

        address recoveredAddress = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(
                keccak256(abi.encodePacked(_token, _rewardee, _amount, nonces[_rewardee], address(this), block.chainid))
            ),
            _sig
        );
        require(
            _directory.hasRole(Constants.ADMIN_SERVER_ROLE, recoveredAddress),
            'signer must have permission from admin server role'
        );

        // send eth to rewardee
        if (_token == address(0)) {
            (bool success, ) = _rewardee.call{value: _amount}('');
            require(success, '_rewardee failed to claim');
        } else {

        }

        nonces[_rewardee]++;

        OperatorDistributor(getDirectory().getOperatorDistributorAddress()).processNextMinipool();

        emit RewardDistributed(_rewardee);
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

    receive() external payable {
        emit EthReceived(msg.value);
    }
}
