import { ethers, upgrades } from 'hardhat';
import { getNextContractAddress } from '../../test/utils/utils';
import readline from 'readline';
import {
  Treasury,
  Directory,
  OperatorDistributor,
  PriceFetcher,
  RPLVault,
  SuperNodeAccount,
  WETHVault,
  Whitelist,
  NodeSetOperatorRewardDistributor,
  PoAConstellationOracle,
  MerkleClaimStreamer,
} from '../../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Wallet } from 'ethers';
import { getWalletFromPath } from './keyReader';
import findConfig from 'find-config';
import dotenv from 'dotenv';

// Function to prompt user for input
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

// Updated retry operation function
export async function retryOperation(operation: () => Promise<any>, retries: number = 3, extendedRetries: number = 3) {
  try {
    return await operation();
  } catch (error) {
    console.log(error);

    if (retries > 0) {
      console.log(`Retrying operation, attempts remaining: ${retries}...`);
      return await retryOperation(operation, retries - 1, extendedRetries);
    } else if (extendedRetries > 0) {
      const answer = await askQuestion('Operation failed. Do you want to retry? (y/n): ');
      if (answer.toLowerCase() === 'y') {
        console.log(`Extended retry, attempts remaining: ${extendedRetries}...`);
        return await retryOperation(operation, 0, extendedRetries - 1);
      } else {
        throw new Error('Operation aborted by the user.');
      }
    } else {
      throw error;
    }
  }
}

export async function deployWithDirectory(
  treasurerAddress: string,
  deployer: Wallet | SignerWithAddress,
  nodesetAdmin: string,
  nodesetServerAdmin: string,
  directoryDeployer: Wallet | SignerWithAddress,
  rocketStorage: string,
  weth: string,
  sanctions: string,
  multiSigAdmin: string,
  adminServer: string,
  adminOracle: string
) {
  const { directory, superNode } = await fastDeployProtocol(
    treasurerAddress,
    deployer,
    nodesetAdmin,
    nodesetServerAdmin,
    adminServer,
    directoryDeployer,
    adminOracle,
    rocketStorage,
    weth,
    sanctions,
    multiSigAdmin,
    true
  );
  upgrades.silenceWarnings();
  return directory;
}

export async function deployUsingEnv(environment: string) {
  const dotenvPath = findConfig(`.${environment}.env`);

  if (dotenvPath !== null) {
    dotenv.config({ path: dotenvPath });
  } else {
    // Handle the case where no .env file is found
    console.error('No .env.' + environment + 'file found');
    return;
  }

  if (!process.env.DEPLOYER_PRIVATE_KEY_PATH || !process.env.DIRECTORY_DEPLOYER_PRIVATE_KEY_PATH) {
    console.error('Private key paths are missing in the environment variables.');
    return;
  }

  try {
    const deployerWallet = await getWalletFromPath(ethers, process.env.DEPLOYER_PRIVATE_KEY_PATH as string);
    const directoryDeployerWallet = await getWalletFromPath(
      ethers,
      process.env.DIRECTORY_DEPLOYER_PRIVATE_KEY_PATH as string
    );

    console.log('deployer wallet balance:', ethers.utils.formatEther(await deployerWallet.getBalance()));
    console.log('directory deployer wallet balance:', ethers.utils.formatEther(await directoryDeployerWallet.getBalance()));

    return await deployWithDirectory(
      process.env.TREASURER_ADDRESS as string,
      deployerWallet,
      process.env.NODESET_ADMIN as string,
      process.env.NODESET_SERVER_ADMIN as string,
      directoryDeployerWallet,
      process.env.RP_STORAGE_CONTRACT_ADDRESS as string,
      process.env.WETH_ADDRESS as string,
      process.env.SANCTIONS_LIST_ADDRESS as string,
      process.env.ADMIN_MULTISIG as string,
      process.env.ADMIN_SERVER as string,
      process.env.ADMIN_ORACLE as string
    );
  } catch (err) {
    console.error('Error reading private keys or deploying:', err);
  }
}

// Function to generate bytes32 representation for contract identifiers
export const generateBytes32Identifier = (identifier: string) => {
  // Correctly concatenate 'contract.address' with the identifier before hashing
  return ethers.utils.solidityKeccak256(['string'], [`contract.address${identifier}`]);
};

export async function fastDeployProtocol(
  treasurer: string,
  deployer: SignerWithAddress | Wallet,
  nodesetAdmin: string,
  nodesetAdminServer: string,
  adminServer: string,
  directoryDeployer: SignerWithAddress | Wallet,
  oracleAdmin: string,
  rocketStorage: string,
  weth: string,
  sanctions: string,
  admin: string,
  log: boolean,
  localDev: boolean = false
) {
  const directoryAddress = await getNextContractAddress(directoryDeployer, localDev ? 1 : 0); // for some reason HH signers start with a nonce of 1 instead of 0

  const whitelistProxy = await retryOperation(async () => {
    const whitelist = await upgrades.deployProxy(
      await ethers.getContractFactory('contracts/Constellation/Whitelist.sol:Whitelist', deployer),
      [directoryAddress],
      { initializer: 'initializeWhitelist', kind: 'uups', unsafeAllow: ['constructor'] }
    );
    if (log) console.log('whitelist deployed to', whitelist.address);
    return whitelist;
  });

  const vCWETHProxy = await retryOperation(async () => {
    const vCWETH = await upgrades.deployProxy(
      await ethers.getContractFactory('WETHVault', deployer),
      [directoryAddress, weth],
      { initializer: 'initializeVault', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
    );
    await vCWETH.reinitialize101();
    if (log) console.log('vaulted constellation eth deployed to', vCWETH.address);
    return vCWETH;
  });

  const oracleProxy = await retryOperation(async () => {
    const oracle = await upgrades.deployProxy(
      await ethers.getContractFactory('PoAConstellationOracle', deployer),
      [directoryAddress],
      { initializer: 'initializeOracle', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
    );
    if (log) console.log('admin oracle deployed to', oracle.address);
    return oracle;
  });

  const addressRplContract = await retryOperation(async () => {
    const bytes32IdentifierRplContract = generateBytes32Identifier('rocketTokenRPL');
    const rocketStorageDeployment = await ethers.getContractAt('RocketStorage', rocketStorage);
    const addressRplContract = await rocketStorageDeployment.getAddress(bytes32IdentifierRplContract);
    return addressRplContract;
  });

  const rplContract = await retryOperation(async function () {
    return await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20', addressRplContract);
  });

  const timelockShort = await retryOperation(async function () {
    const timelockShort = await (
      await ethers.getContractFactory('ConstellationTimelock', deployer)
    ).deploy(1, [admin], [admin], admin);
    await timelockShort.deployed();
    if (log) console.log('timelock short deployed to', timelockShort.address);
    return timelockShort;
  });

  const timelockMed = await retryOperation(async function () {
    const timelockMed = await (
      await ethers.getContractFactory('ConstellationTimelock', deployer)
    ).deploy(2, [admin], [admin], admin);
    await timelockMed.deployed();
    if (log) console.log('timelock med deployed to', timelockMed.address);
    return timelockMed;
  });

  const timelockLong = await retryOperation(async function () {
    const timelockLong = await (
      await ethers.getContractFactory('ConstellationTimelock', deployer)
    ).deploy(3, [admin], [admin], admin);
    await timelockLong.deployed();
    if (log) console.log('timelock long deployed to', timelockLong.address);
    return timelockLong;
  });

  const vCRPLProxy = await retryOperation(async function () {
    const vCRPL = await upgrades.deployProxy(
      await ethers.getContractFactory('RPLVault', deployer),
      [directoryAddress, rplContract.address],
      { initializer: 'initializeVault', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
    );
    if (log) console.log('vaulted constellation rpl deployed to', vCRPL.address);
    return vCRPL;
  });

  const operatorDistributorProxy = await retryOperation(async function () {
    const od = await upgrades.deployProxy(
      await ethers.getContractFactory('OperatorDistributor', deployer),
      [directoryAddress],
      { initializer: 'initialize', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
    );
    if (log) console.log('operator distributor deployed to', od.address);
    return od;
  });

  const merkleClaimStreamerProxy = await retryOperation(async function () {
    const od = await upgrades.deployProxy(
      await ethers.getContractFactory('MerkleClaimStreamer', deployer),
      [directoryAddress],
      { initializer: 'initialize', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
    );
    if (log) console.log('merkle claim streamer deployed to', od.address);
    return od;
  });

  const yieldDistributorProxy = await retryOperation(async function () {
    const yd = await upgrades.deployProxy(
      await ethers.getContractFactory('NodeSetOperatorRewardDistributor', deployer),
      [nodesetAdmin, nodesetAdminServer],
      { initializer: 'initialize', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
    );
    if (log) console.log('yield distributor deployed to', yd.address);
    return yd;
  });

  const priceFetcherProxy = await retryOperation(async function () {
    const pf = await upgrades.deployProxy(
      await ethers.getContractFactory('PriceFetcher', deployer),
      [directoryAddress],
      { initializer: 'initialize', kind: 'uups', unsafeAllow: ['constructor'] }
    );
    if (log) console.log('price fetcher deployed to', pf.address);
    return pf;
  });

  const treasuryProxy = await retryOperation(async function () {
    const at = await upgrades.deployProxy(await ethers.getContractFactory('Treasury', deployer), [treasurer], {
      initializer: 'initialize',
      kind: 'uups',
      unsafeAllow: ['constructor'],
    });
    if (log) console.log('admin treasury deployed to', at.address);
    return at;
  });

  const superNodeProxy = await retryOperation(async function () {
    const snap = await upgrades.deployProxy(
      await ethers.getContractFactory('SuperNodeAccount', deployer),
      [directoryAddress],
      { initializer: 'initialize', kind: 'uups', unsafeAllow: ['constructor'] }
    );
    if (log) console.log('super node deployed to', snap.address);
    return snap;
  });

  if (log) {
    console.log('verify directory input');
    console.log('whitelistProxy.address', whitelistProxy.address);
    console.log('vCWETHProxy.address', vCWETHProxy.address);
    console.log('vCRPLProxy.address', vCRPLProxy.address);
    console.log('operatorDistributorProxy.address', operatorDistributorProxy.address);
    console.log('merkleClaimStreamerProxy.address', merkleClaimStreamerProxy.address);
    console.log('yieldDistributorProxy.address', yieldDistributorProxy.address);
    console.log('oracle', oracleProxy.address);
    console.log('priceFetcherProxy.address', priceFetcherProxy.address);
    console.log('snap.address', superNodeProxy.address);
    console.log('rocketStorage', rocketStorage);
    console.log('weth', weth);
    console.log('sanctions', sanctions);
  }

  let timeLockShortAddress = localDev ? admin : timelockShort.address;
  let timeLockMedAddress = localDev ? admin : timelockMed.address;
  let timeLockLongAddress = localDev ? admin : timelockLong.address;
  const directoryProxy = await retryOperation(async () => {
    const dir = await upgrades.deployProxy(
      await ethers.getContractFactory('Directory', directoryDeployer),
      [
        [
          whitelistProxy.address,
          vCWETHProxy.address,
          vCRPLProxy.address,
          operatorDistributorProxy.address,
          merkleClaimStreamerProxy.address,
          oracleProxy.address,
          priceFetcherProxy.address,
          superNodeProxy.address,
          rocketStorage,
          weth,
          sanctions,
        ],
        yieldDistributorProxy.address,
        [
          admin,
          treasurer,
          treasuryProxy.address,
          timeLockShortAddress,
          timeLockMedAddress,
          timeLockLongAddress,
          adminServer,
          oracleAdmin,
        ],
      ],
      { initializer: 'initialize', kind: 'uups', unsafeAllow: ['constructor'], salt: directoryAddress }
    );

    if (log) console.log('directory deployed to', dir.address);

    await dir.deployed();

    return dir;
  });

  if (log) {
    if (directoryAddress.toLocaleLowerCase() === directoryProxy.address.toLocaleLowerCase()) {
      console.log('directory matches predicted address', directoryAddress);
    } else {
      console.error(
        'failed to deploy directory address to predicted address',
        directoryAddress,
        directoryProxy.address
      );
      throw new Error('Bad predicted directory');
    }
  }

  await retryOperation(async () => {
    console.log('trying to lazyInitialize superNodeProxy...');
    await superNodeProxy.lazyInitialize();
  });

  return {
    whitelist: whitelistProxy as Whitelist,
    vCWETH: vCWETHProxy as WETHVault,
    vCRPL: vCRPLProxy as RPLVault,
    operatorDistributor: operatorDistributorProxy as OperatorDistributor,
    merkleClaimStreamer: merkleClaimStreamerProxy as MerkleClaimStreamer,
    yieldDistributor: yieldDistributorProxy as NodeSetOperatorRewardDistributor,
    priceFetcher: priceFetcherProxy as PriceFetcher,
    oracle: oracleProxy as PoAConstellationOracle,
    superNode: superNodeProxy as SuperNodeAccount,
    treasury: treasuryProxy as Treasury,
    directory: directoryProxy as Directory,
  };
}
