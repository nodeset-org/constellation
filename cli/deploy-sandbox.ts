import { deployProtocolLocalDev } from '../scripts/utils/deployment';
import { setDefaultParameters } from '../test/rocketpool/_helpers/defaults';
import { deployRocketPool } from '../test/rocketpool/_helpers/deployment';
import { createSigners, getRocketPool } from '../test/integration/integration';

(async () => {
  await deployRocketPool();
  await setDefaultParameters();

  const signers = await createSigners();

  const deployedProtocol = await deployProtocolLocalDev(signers, true);
  const rocketPool = await getRocketPool(deployedProtocol.directory);
})();
