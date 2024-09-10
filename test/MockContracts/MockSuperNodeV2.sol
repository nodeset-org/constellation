// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import '../../contracts/Constellation/Utils/UpgradeableBase.sol';
import '../../contracts/Constellation/SuperNodeAccount.sol';

/// @custom:security-contact info@nodeoperator.org
/// @notice Controls operator access to the protocol.
/// Only modifiable by admin. Upgradeable and intended to be replaced by a ZK-ID check when possible.
contract MockSuperNodeV2 is SuperNodeAccount {
    function testUpgrade() public pure returns (uint) {
        return 0;
    }
}