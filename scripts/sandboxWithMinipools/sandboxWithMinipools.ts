import { setupSandbox } from '../utils/setup_sandbox';
import { fillDepositPoolAndAssignDeposits } from './helpers/fillRocketPoolDepositPool';
import { launchMinipools } from './helpers/launchMinipools';
import { prepareForMinipoolCreation } from './helpers/prepareForMinipoolCreation';
import { prepareNewOperators } from './helpers/prepareNewOperators';
import { setupEachOperator } from './helpers/setupEachOperator';

setupSandbox()
  .then(prepareForMinipoolCreation)
  .then(prepareNewOperators)
  .then(setupEachOperator)
  .then(fillDepositPoolAndAssignDeposits)
  .then(launchMinipools)
  .then(() => {
    console.log('success!');
    process.exit(0)
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

