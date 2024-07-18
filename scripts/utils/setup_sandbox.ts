import { ethers, upgrades } from 'hardhat';
import { setDefaultParameters } from '../../test/rocketpool/_helpers/defaults';
import { deployRocketPool } from '../../test/rocketpool/_helpers/deployment';
import { MockSanctions, WETH } from '../../typechain-types';
import { fastDeployProtocol, retryOperation } from '../utils/deployment';
import { createSigners, Protocol } from '../../test/test';

export type SandboxDeployments = Protocol;

export const setupSandbox = async () => {
  const { deployer, admin } = await createSigners(); 

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

  // deploy mock uniswap v3 pool
  const uniswapV3Pool = await retryOperation(async () => {
    const UniswapV3Pool = await ethers.getContractFactory('MockUniswapV3Pool');
    const contract = await UniswapV3Pool.deploy();
    await contract.deployed();
    return contract;
  });

  const sanctions = await retryOperation(async () => {
    const Sanctions = await ethers.getContractFactory('MockSanctions');
    const contract = await Sanctions.deploy();
    await contract.deployed();
    return contract;
  });
  console.log('sanctions address', sanctions.address);

  const protocol = await fastDeployProtocol(
    admin,
    deployer,
    admin,
    rocketStorage.address,
    wETH.address,
    sanctions.address,
    uniswapV3Pool.address,
    admin.address,
    true
  );

  const { directory } = protocol;

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

  return {...protocol, wETH, sanctions };

};
