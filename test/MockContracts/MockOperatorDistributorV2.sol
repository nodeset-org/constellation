// SPDX-License-Identifier: GPL v3
pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import '../../contracts/Constellation/Utils/UpgradeableBase.sol';
import '../../contracts/Constellation/Whitelist.sol';

contract MockOperatorDistributorV2 is OperatorDistributor {
    function testUpgrade() public pure returns (uint) {
        return 0;
    }
}