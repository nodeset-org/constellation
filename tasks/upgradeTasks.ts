import { task, types } from 'hardhat/config';
import findConfig from 'find-config';
import dotenv from 'dotenv';
import { getWalletFromPath } from '../scripts/utils/keyReader';

type UpgradeInfo = {
  address: string;
  encoding: string;
};

task(
  'deployAndEncodeUpgrade',
  'Deploys a new implementation contract and encodes the upgradeTo(address) function call for an upgradable contract'
)
  .addParam('contractName', 'The name of the contract', undefined, types.string)
  .addParam('environmentName', 'The name of the env file to use (.environmentName.env)', undefined, types.string)
  .setAction(async ({ contractName, environmentName }, hre) => {
    const dotenvPath = findConfig(`.${environmentName}.env`);
    if (dotenvPath !== null) {
      dotenv.config({ path: dotenvPath });
    } else {
      // Handle the case where no .env file is found
      console.error('No .env.' + environmentName + 'file found');
      return;
    }
    const deployerWallet = await getWalletFromPath(ethers, process.env.DEPLOYER_PRIVATE_KEY_PATH as string);

    const contract = await (await hre.ethers.deployContract(contractName, [], deployerWallet)).deployed();
    const address = contract.address;
    console.log(`Deployed new implementation contract for ${contractName}: ${address}`);

    const encoding = await hre.run('upgradeTo', { newImplementation: address });

    return { address, encoding };
  });

task(
  'prepareFullUpgrade',
  'Deploys new implementations for all contracts, encodes them, and returns the addresses and encodings'
)
  .addParam('environmentName', 'The name of the env file to use (.environmentName.env)', undefined, types.string)
  .setAction(async ({ environmentName }, hre) => {
    const contractNames = [
      'Directory',
      'MerkleClaimStreamer',
      'SuperNodeAccount',
      'OperatorDistributor',
      'WETHVault',
      'RPLVault',
      'Whitelist',
      'PoAConstellationOracle',
      'PriceFetcher',
    ];

      // todo: this could be done in parallel, but we'd have to increment the tx nonce manually
      // (this functionality would need to be added to deployAndEncodeUpgrade)
    let contractInfos: UpgradeInfo[] = [];
    for (const contract of contractNames) {
      contractInfos.push(
        (await hre.run('deployAndEncodeUpgrade', {
          contractName: contract,
          environmentName,
        })) as UpgradeInfo
      );
    }

    const addresses = contractInfos.map((info) => info.address);
    const encodings = contractInfos.map((info) => info.encoding);

    console.log('All addresses:\n', addresses);
    console.log('All upgradeTo encodings:\n', encodings);

    return { addresses, encodings };
  });

// note that this should only be used for testing. Real contract deployments will use a timelock which requires encoding the upgrade proposal, then subsequent execution
task('upgradeProxy', 'Upgrades a proxy contract to a new implementation using upgrades.upgradeProxy')
  .addParam('proxy', 'The address of the proxy contract', undefined, types.string)
  .addParam('implementation', 'The name of the new implementation contract factory', undefined, types.string)
  .setAction(async ({ proxy, implementation }, hre) => {
    try {
      console.log(`Upgrading proxy at address: ${proxy} to new implementation: ${implementation}`);

      const ImplFactory: any = await hre.ethers.getContractFactory(implementation);
      const upgradedContract = await hre.upgrades.upgradeProxy(proxy, ImplFactory, {
        kind: 'uups',
        unsafeAllow: ['constructor'],
      });

      console.log(`Proxy upgraded. Implementation is now at: ${upgradedContract.address}`);
      return upgradedContract.address;
    } catch (error) {
      console.error('An error occurred during the upgrade:', error);
      throw error;
    }
  });
