import findConfig from 'find-config';
import dotenv from 'dotenv';
import { getWalletFromPath } from '../utils/keyReader';

export async function deployTimelockFromEnv(
  hre: any,
  env: string,
  log: boolean,
  minDelaySeconds: any,
  proposers: string[],
  executors: string[]
) {
  const dotenvPath = findConfig(`.env.${env}`);
  if (dotenvPath !== null) {
    dotenv.config({ path: dotenvPath });
  } else {
    console.error('File ', `.env.${env} could not be found`);
  }

  const deployerWallet = await getWalletFromPath(hre.ethers, process.env.DEPLOYER_PRIVATE_KEY_PATH as string);

  const Timelock = await hre.ethers.getContractFactory('TimelockController', deployerWallet);
  const timelock = await Timelock.deploy(minDelaySeconds, proposers, executors);

  if (log) {
    console.log(minDelaySeconds.toString(), 'second timelock deployed to', timelock.address);
  }

  return timelock.address;
}
