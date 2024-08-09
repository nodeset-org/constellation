// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

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

    mapping(address => uint256) public nonces;
    mapping(bytes => bool) public claimSigsUsed;

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
            SafeERC20.safeTransfer(IERC20(_token), _rewardee, _amount);
        }

        nonces[_rewardee]++;

        OperatorDistributor(getDirectory().getOperatorDistributorAddress()).processNextMinipool();

        emit RewardDistributed(_rewardee);
    }

    receive() external payable {
    }
}
