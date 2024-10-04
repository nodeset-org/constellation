import { task, types } from 'hardhat/config';
import findConfig from 'find-config';
import dotenv from 'dotenv';
import { getWalletFromPath } from '../scripts/utils/keyReader';

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

type UpgradeTxData = {
  targets: string[];
  values: string;
  payloads: string[];
  predecessor: string;
  salt: string;
};

task('getProxyAddress', 'Gets the address of the proxy address for a given contract name and directory address')
  .addParam('contractName', 'The name of the contract to retrieve the proxy address for', undefined, types.string)
  .addParam('directoryAddress', 'The directory address for the deployment to check', undefined, types.string)
  .setAction(async ({ contractName, directoryAddress }, hre) => {
    if (contractName === 'Directory') {
      console.log('Directory proxy address:' + directoryAddress);
      return directoryAddress;
    }

    const directory = await hre.ethers.getContractAt('Directory', directoryAddress, );
    let address = '';
    if (contractName === 'MerkleClaimStreamer') address = await directory.getMerkleClaimStreamerAddress();
    else if (contractName === 'SuperNodeAccount') address = await directory.getSuperNodeAddress();
    else if (contractName === 'OperatorDistributor') address = await directory.getOperatorDistributorAddress();
    else if (contractName === 'WETHVault') address = await directory.getWETHVaultAddress();
    else if (contractName === 'RPLVault') address = await directory.getRPLVaultAddress();
    else if (contractName === 'Whitelist') address = await directory.getWhitelistAddress();
    else if (contractName === 'PoAConstellationOracle') address = await directory.getOracleAddress();
    else if (contractName === 'PriceFetcher') address = await directory.getPriceFetcherAddress();
    else {
      throw new Error('Invalid contract name');
    }

    console.log(contractName + ' proxy address:' + address);
    return address;
  });

task(
  'prepareFullUpgrade',
  'Deploys new implementations for all contracts, encodes them, and returns the addresses and encodings'
)
  .addParam('directoryAddress', 'The directory address for the deployment to be upgraded', undefined, types.string)
  .addParam('environmentName', 'The name of the env file to use (.environmentName.env)', undefined, types.string)
  .setAction(async ({ directoryAddress, environmentName }, hre) => {
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
    let targets: string[] = [];
    let encodings: string[] = [];
    for (const contract of contractNames) {
      targets.push(
        (
          await hre.run('getProxyAddress', {
            contractName: contract,
            directoryAddress: directoryAddress,
          })
        )
      );

      encodings.push(
        (
          await hre.run('deployAndEncodeUpgrade', {
            contractName: contract,
            environmentName,
          })
        ).encoding[0] // encodings come in as an array with 1 element due to the way encodeProposal works
      );
    }

    const values: string = '[' + '0,'.repeat(contractNames.length - 1) + '0' + ']';
    const predecessor = '0x00000000000000000000000000000000';
    const salt = '0x00000000000000000000000000000000';
    const txData: UpgradeTxData = { targets, values, payloads: encodings, predecessor, salt };

    console.log('\n==== TRANSACTION DATA ====');
    console.log('Targets:\n', targets);
    console.log('Values\n', values);
    console.log('Payloads:\n', encodings);
    console.log('Predecessor:\n', predecessor);
    console.log('Salt:\n', salt);

    return txData;
  });

// note that this should only be used for testing. Real contract deployments will use a timelock which requires encoding the upgrade proposal, then subsequent execution
task(
  'upgradeProxy',
  'Upgrades a proxy contract to a new implementation using upgrades.upgradeProxy. WILL NOT WORK ON DEPLOYMENTS WITH A TIMELOCK.'
)
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
