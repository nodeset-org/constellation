import { printGasUsage, startGasUsage, endGasUsage } from './_utils/gasusage';
import { endSnapShot, injectGlobalSnapShot, startSnapShot } from './_utils/snapshotting';
import { deployRocketPool } from './_helpers/deployment';
import { setDefaultParameters } from './_helpers/defaults';
import { suppressLog } from './_helpers/console';
// Import tests

import { injectBNHelpers } from './_helpers/bn';
import { checkInvariants } from './_helpers/invariants';

// Header
console.log('\n');
console.log('______           _        _    ______           _ ');
console.log('| ___ \\         | |      | |   | ___ \\         | |');
console.log('| |_/ /___   ___| | _____| |_  | |_/ /__   ___ | |');
console.log('|    // _ \\ / __| |/ / _ \\ __| |  __/ _ \\ / _ \\| |');
console.log('| |\\ \\ (_) | (__|   <  __/ |_  | | | (_) | (_) | |');
console.log('\\_| \\_\\___/ \\___|_|\\_\\___|\\__| \\_|  \\___/ \\___/|_|');

// BN helpers
// injectBNHelpers();

// State snapshotting and gas usage tracking
// beforeEach(startSnapShot);
// beforeEach(startGasUsage);
// afterEach(checkInvariants);
// afterEach(endGasUsage);
// afterEach(endSnapShot);
// after(printGasUsage);

// before(async function() {
  // Deploy Rocket Pool
  // await suppressLog(deployRocketPool);
  // Set starting parameters for all tests
  // await setDefaultParameters();
  // Inject a global snapshot before every suite
  // injectGlobalSnapShot(this.test.parent)
// });

// Run tests
// daoProtocolTests();
// daoProtocolTreasuryTests();
// daoNodeTrustedTests();
// daoSecurityTests();
// minipoolScrubTests();
// minipoolTests();
// minipoolVacantTests();
// minipoolStatusTests();
// minipoolWithdrawalTests();
// networkBalancesTests();
// networkPenaltiesTests();
// networkFeesTests();
// networkPricesTests();
// networkSnapshotsTests();
// networkVotingTests();
// nodeDepositTests();
// nodeManagerTests();
// nodeStakingTests();
// nodeDistributorTests();
// rethTests();
// rplTests();
// rewardsPoolTests();
