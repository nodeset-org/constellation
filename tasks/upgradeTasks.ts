import { task, types } from 'hardhat/config';
import findConfig from 'find-config';
import dotenv from 'dotenv';
import { getWalletFromPath } from '../scripts/utils/keyReader';
import { Bytes32 } from '@chainsafe/lodestar-types';
const { Defender } = require('@openzeppelin/defender-sdk');


// WILL NOT WORK ON DEPLOYMENTS WITH A TIMELOCK
task("upgradeProxy", "Upgrades a proxy contract to a new implementation using upgrades.upgradeProxy")
    .addParam("proxy", "The address of the proxy contract", undefined, types.string)
    .addParam("implementation", "The name of the new implementation contract factory", undefined, types.string)
    .setAction(async ({ proxy, implementation }, hre) => {
        try {
            console.log(`Upgrading proxy at address: ${proxy} to new implementation: ${implementation}`);

            const ImplFactory: any = await hre.ethers.getContractFactory(implementation);
            const upgradedContract = await hre.upgrades.upgradeProxy(proxy, ImplFactory, { 'kind': 'uups', 'unsafeAllow': ['constructor'] });

            console.log(`Proxy upgraded. Implementation is now at: ${upgradedContract.address}`);
            return upgradedContract.address;
        } catch (error) {
            console.error("An error occurred during the upgrade:", error);
            throw error;
        }
    });

task("deployContract", "Deploys a contract using the provided Factory address")
    .addParam("factory", "The name of the Factory contract", undefined, types.string)
    .setAction(async ({ factory }, hre) => {
        console.log(`Deploying contract using Factory: ${factory}`);

        const FactoryContract: any = await hre.ethers.getContractFactory(factory);

        const deployedContract = await FactoryContract.deploy();
        await deployedContract.deployed();

        console.log(`Contract deployed at address: ${deployedContract.address}`);
        return deployedContract.address;
    });

task("deployAndUpgrade", "Deploys a new contract and then upgrades a proxy to the new implementation")
    .addParam("proxy", "The address of the proxy contract", undefined, types.string)
    .addParam("factory", "The name of the new implementation contract factory", undefined, types.string)
    .setAction(async ({ proxy, factory }, hre) => {
        // Deploy the new implementation contract using deployContract task
        console.log(`Deploying a new implementation contract using Factory: ${factory}`);
        const deployedContractAddress = await hre.run("deployContract", { factory });

        console.log(`New implementation contract deployed at address: ${deployedContractAddress}`);

        // Upgrade the proxy to the new implementation using upgradeProxy task
        console.log(`Upgrading proxy at address: ${proxy} to new implementation at: ${deployedContractAddress}`);
        await hre.run("upgradeProxy", { proxy, implementation: factory });

        console.log(`Proxy successfully upgraded.`);
    });

task(
  'deployAndEncodeUpgrade',
  'Deploys a new implementation contract and encodes the upgradeTo(address) function call for an upgradable contract'
)
  .addParam('contractName', 'The name of the contract', undefined, types.string)
  .addOptionalParam('environmentName', 'The name of the env file to use (.environmentName.env).', undefined, types.string)
  .addOptionalParam('calldataAfter', 'The encoded data of the function to call after the upgrade', undefined, types.string)
  .setAction(async ({ contractName, environmentName, callAfter }, hre) => {
    const dotenvPath = findConfig(`.${environmentName}.env`);

    let contract;
    if (dotenvPath !== null) {
      dotenv.config({ path: dotenvPath });
      const deployerWallet = await getWalletFromPath(ethers, process.env.DEPLOYER_PRIVATE_KEY_PATH as string);
      contract = await (await hre.ethers.deployContract(contractName, [], deployerWallet)).deployed();
    } else {
      contract = await (await hre.ethers.deployContract(contractName)).deployed();
    }

    const address = contract.address;
    console.log(`Deployed new implementation contract for ${contractName}: ${address}`);

    let encoding;
    if (callAfter && callAfter !== null) {
      console.log(`Encoding upgradeToAndCall for ${contractName} at ${address} and function data: ${callAfter}`);
      encoding = await hre.run('upgradeToAndCall', { newImplementation: address, data: callAfter });
    }
    else {
      console.log(`Encoding upgradeTo for ${contractName} at ${address}`);
      encoding = await hre.run('upgradeTo', { newImplementation: address });
    }

    return { address, encoding };
  });

type UpgradeTxData = {
  targets: string[];
  values: number[];
  payloads: Bytes32[];
  predecessor: Bytes32;
  salt: Bytes32;
};

task('getProxyAddress', 'Gets the address of the proxy address for a given contract name and directory address')
  .addParam('contractName', 'The name of the contract to retrieve the proxy address for', undefined, types.string)
  .addParam('directoryAddress', 'The directory address for the deployment to check', undefined, types.string)
  .setAction(async ({ contractName, directoryAddress }, hre) => {
    if (contractName === 'Directory') {
      console.log('Directory proxy address: ' + directoryAddress);
      return directoryAddress;
    }

    const directory = await hre.ethers.getContractAt('Directory', directoryAddress);
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

    console.log(contractName + ' proxy address: ' + address);
    return address;
  });

task(
  'prepare101Upgrade',
  'Deploys new implementations for contracts changed in v1.0.1, encodes them, and returns the addresses and encodings'
)
  .addParam('directoryAddress', 'The directory address for the deployment to be upgraded', undefined, types.string)
  .addOptionalParam('environmentName', 'The name of the env file to use (.environmentName.env)', undefined, types.string)
  .addOptionalParam('timelockAddress', 'Optional: the address of the timelock to log', undefined, types.string)
  .setAction(async ({ directoryAddress, environmentName, timelockAddress }, hre) => {
    const contractNames = [
      'SuperNodeAccount',
      'OperatorDistributor',
      'RPLVault'
    ];

    // todo: this could be done in parallel, but we'd have to increment the tx nonce manually
    // (this functionality would need to be added to deployAndEncodeUpgrade)
    let targets: string[] = [];
    let encodings: Bytes32[] = [];
    for (const contract of contractNames) {
      targets.push(
        await hre.run('getProxyAddress', {
          contractName: contract,
          directoryAddress: directoryAddress,
        })
      );

      encodings.push(
        (
          await hre.run('deployAndEncodeUpgrade', {
            contractName: contract,
            environmentName
          })
        ).encoding[0] // encodings come in as an array with 1 element due to the way encodeProposal works
      );
    }

    // do WETHVault separately because it requires reinitialization
    const wethVaultReinitEncoding: string =
      await hre.run("encodeProposal", { sigs: JSON.stringify(["reinitialize101()"]), params: JSON.stringify([[]]) });
    encodings.push(
      (
        await hre.run('deployAndEncodeUpgrade', {
          contractName: 'WETHVault',
          environmentName,
          callAfter: wethVaultReinitEncoding.toString()
        })
      ).encoding[0] // encodings come in as an array with 1 element due to the way encodeProposal works
    );

    const values: number[] = Array(targets.length).fill(0);
    const predecessor = ethers.utils.hexZeroPad('0x0', 32);
    const salt = ethers.utils.hexZeroPad('0x0', 32);
    const txData: UpgradeTxData = { targets, values, payloads: encodings, predecessor, salt };

    console.log('\n==== TRANSACTION DATA ====');
    let output =
      'Timelock:\n' +
      timelockAddress +
      '\nTargets:\n[' +
      targets +
      ']\nValues\n[' +
      values +
      ']\nPayloads:\n[' +
      encodings +
      ']\nPredecessor:\n' +
      predecessor +
      '\nSalt:\n' +
      salt;
    console.log(output);

    const fs = require('fs');
    const dir = __dirname + '/../.upgrades';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + '/' + Date.now() + '.log', output);

    return txData;

  });

task(
  'prepareFullUpgrade',
  'Deploys new implementations for all contracts, encodes them, and returns the addresses and encodings'
)
  .addParam('directoryAddress', 'The directory address for the deployment to be upgraded', undefined, types.string)
  .addOptionalParam('environmentName', 'The name of the env file to use (.environmentName.env)', undefined, types.string)
  .addOptionalParam('timelockAddress', 'Optional: the address of the timelock to log', undefined, types.string)
  .setAction(async ({ directoryAddress, environmentName, timelockAddress }, hre) => {
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
    let encodings: Bytes32[] = [];
    for (const contract of contractNames) {
      targets.push(
        await hre.run('getProxyAddress', {
          contractName: contract,
          directoryAddress: directoryAddress,
        })
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

    const values: number[] = Array(targets.length).fill(0);
    const predecessor = ethers.utils.hexZeroPad('0x0', 32);
    const salt = ethers.utils.hexZeroPad('0x0', 32);
    const txData: UpgradeTxData = { targets, values, payloads: encodings, predecessor, salt };

    console.log('\n==== TRANSACTION DATA ====');
    let output =
      'Timelock:\n' +
      timelockAddress +
      '\nTargets:\n[' +
      targets +
      ']\nValues\n[' +
      values +
      ']\nPayloads:\n[' +
      encodings +
      ']\nPredecessor:\n' +
      predecessor +
      '\nSalt:\n' +
      salt;
    console.log(output);

    const fs = require('fs');
    const dir = __dirname + '/../.upgrades';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + '/' + Date.now() + '.log', output);

    return txData;
  });

// This only works if the defender relayer is set as a proposer on the timelock
task('submitNewUpgrade', 'Deploys new implementations, encodes them, and submits the scheduled proposal')
  .addParam('timelockAddress', 'The address of the TIMELOCK_LONG contract', undefined, types.string)
  .addParam('directoryAddress', 'The directory address for the deployment to be upgraded', undefined, types.string)
  .addParam('environmentName', 'The name of the env file to use (.environmentName.env)', undefined, types.string, true)
  .setAction(async ({ directoryAddress, timelockAddress, environmentName }, hre) => {
    const txData = await hre.run('prepareFullUpgrade', { directoryAddress, environmentName, timelockAddress });
    const dotenvPath = findConfig(`.${environmentName}.env`);
    if (dotenvPath === null) throw new Error('Environment file not found');

    dotenv.config({ path: dotenvPath });
    const client = new Defender({
      relayerApiKey: `${process.env.DEFENDER_RELAY_KEY}`,
      relayerApiSecret: `${process.env.DEFENDER_RELAY_SECRET}`,
    });

    const provider = client.relaySigner.getProvider();
    const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });
    const timelock = await hre.ethers.getContractAt('ConstellationTimelock', timelockAddress, signer);
    const tx = await timelock.scheduleBatch(
      txData.targets,
      txData.values,
      txData.payloads,
      txData.predecessor,
      txData.salt,
      await timelock.getMinDelay()
    );
    const networkName = hre.network.name;
    console.log(
      'Scheduled upgrade proposal with tx hash: ' +
        tx.hash +
        '\nhttps://' +
        (networkName === 'mainnet' ? '' : networkName + '.') +
        'etherscan.io/tx/' +
        tx.hash
    );
    return tx;
  });

task('testPrepareFullUpgrade', 'Tests the prepareFullUpgrade task using the default HH network (usually local)').setAction(async ({}, hre) => {
  const directory = await (await hre.ethers.deployContract('Directory')).deployed();
  await hre.run('prepareFullUpgrade', {
    directoryAddress: directory.address,
  });
});

task('test101Upgrade', 'Tests the prepare101Upgrade task using the default HH network (usually local)').setAction(async ({}, hre) => {
  const directory = await (await hre.ethers.deployContract('Directory')).deployed();
  await hre.run('prepare101Upgrade', {
    directoryAddress: directory.address,
  });
});
