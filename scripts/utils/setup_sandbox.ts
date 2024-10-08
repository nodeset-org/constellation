import { ethers, upgrades } from 'hardhat';
import { setDefaultParameters } from '../../test/rocketpool/_helpers/defaults';
import { deployRocketPool } from '../../test/rocketpool/_helpers/deployment';
import { fastDeployProtocol, retryOperation } from '../utils/deployment';
import { createSigners, Protocol } from '../../test/integration/integration';

export type SandboxDeployments = Protocol;

export const setupSandbox = async () => {
  const [deployer, admin] = await ethers.getSigners();

  console.log('deploying RP...');
  const rocketStorage = await deployRocketPool();
  await setDefaultParameters();

  upgrades.silenceWarnings();

  // deploy weth
  const wETH = await retryOperation(async () => {
    const WETH = await ethers.getContractFactory('WETH');
    const contract = await WETH.deploy();
    await contract.deployed();
    return contract;
  });
  console.log('weth address', wETH.address);

  const sanctions = await retryOperation(async () => {
    const Sanctions = await ethers.getContractFactory('MockSanctions');
    const contract = await Sanctions.deploy();
    await contract.deployed();
    return contract;
  });
  console.log('sanctions address', sanctions.address);

  const { directory } = await fastDeployProtocol(
    admin.address, // treasurer
    deployer, // deployer
    admin.address, // nodesetAdmin
    admin.address, // nodesetServerAdmin
    admin.address, // adminServer
    admin, // directoryDeployer
    admin.address, // adminOracle
    rocketStorage.address, // rocketStorage
    wETH.address, // weth
    sanctions.address, // sanctions
    admin.address, // admin
    true, // log
    true // localDev
  );

  // set adminServer to be ADMIN_SERVER_ROLE
  const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_SERVER_ROLE'));
  await retryOperation(async () => {
    await directory.connect(admin).grantRole(ethers.utils.arrayify(adminRole), deployer.address);
  });

  // set adminServer to be ADMIN_ORACLE_ROLE
  const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_ORACLE_ROLE'));
  await retryOperation(async () => {
    await directory.connect(admin).grantRole(ethers.utils.arrayify(adminOracleRole), deployer.address);
  });

  // set timelock to be TIMELOCK_ROLE
  const timelockShortRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('TIMELOCK_SHORT'));
  await retryOperation(async () => {
    await directory.connect(admin).grantRole(ethers.utils.arrayify(timelockShortRole), deployer.address);
  });
  console.log('timelock short role set');

  // set timelock to be TIMELOCK_ROLE
  const timelockMedRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('TIMELOCK_MED'));
  await retryOperation(async () => {
    await directory.connect(admin).grantRole(ethers.utils.arrayify(timelockMedRole), deployer.address);
  });
  console.log('timelock med role set');

  // set timelock to be TIMELOCK_ROLE
  const timelockLongRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('TIMELOCK_LONG'));
  await retryOperation(async () => {
    await directory.connect(admin).grantRole(ethers.utils.arrayify(timelockLongRole), deployer.address);
  });
  console.log('timelock long role set');

  // set protocolSigner to be PROTOCOL_ROLE
  const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('CORE_PROTOCOL_ROLE'));
  await retryOperation(async () => {
    await directory.connect(admin).grantRole(ethers.utils.arrayify(protocolRole), deployer.address);
  });
  console.log('protocol role set');
};
