import fs from 'fs';
import * as path from 'path';
import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture, protocolParams } from "../test/test";
import { setDefaultParameters } from "../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../test/utils/utils";
import { IXRETHOracle } from "../typechain-types";
import { expect } from "chai";

async function predictNextContractAddress(deployer, predictedNonce) {
  const directoryAddress = await getNextContractAddress(deployer, predictedNonce - 1);
  console.log("predicted directory address", directoryAddress);
  return directoryAddress;
}

async function getInitialNonce(deployer) {
  const initNonce = await deployer.getTransactionCount();
  console.log("init nonce", initNonce);
  return initNonce;
}

async function deployContract(contractName: string, contractPath: string) {
  const ContractFactory = await ethers.getContractFactory(contractPath);
  const contract = await ContractFactory.deploy();
  await contract.deployed();
  await contract.deployTransaction.wait();
  writeAddressToOutput(contractName,contract.address)
  return contract;
}

async function deployAndInitializeContract(contractName: string, contractPath: string, initializerArgs, config) {
  const initializer = config.initializer || 'initialize';
  const kind = config.kind || 'uups';
  const unsafeAllow = config.unsafeAllow || ['constructor'];
  const ContractFactory = await ethers.getContractFactory(contractPath);
  const proxyAbi = await upgrades.deployProxy(ContractFactory, initializerArgs, {initializer,kind,unsafeAllow});
  await proxyAbi.deployTransaction.wait();
  writeAddressToOutput(contractName,proxyAbi.address)
  return await ethers.getContractAt(contractPath.split(':').pop(), proxyAbi.address);
}

async function deployOracle() {
  const oracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;
  await oracle.deployTransaction.wait();
  writeAddressToOutput("oracle",oracle.address)
  return oracle
}
async function writeAddressToOutput(contractName: string, contractAddress: string) {
  const directoryPath = path.join(__dirname, '../dist')
  const file = path.join(directoryPath, 'contract_addresses.data')
  if (!fs.existsSync(directoryPath)) { fs.mkdirSync(directoryPath)}
  const recordData = `${contractName}=${contractAddress}\n`;
  fs.appendFileSync(file, recordData)
  console.log(recordData)
}

async function verifyDeployment(deployer, initNonce, predictedNonce, directory, directoryAddress) {
  const finalNonce = await deployer.getTransactionCount();
  console.log("final nonce", finalNonce);
  console.log("waiting 30 seconds for everything to deploy");
  await new Promise(resolve => setTimeout(resolve, 30000));
  expect(finalNonce - initNonce).to.equal(predictedNonce);
  expect(directory.address).to.hexEqual(directoryAddress); // Ensure directoryAddress is defined in scope
}

async function setRole(contract: ethers.Contract, roleName: string, address: string) {
  const roleBytes32 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(roleName));
  await contract.grantRole(ethers.utils.arrayify(roleBytes32), address);
  console.log(`${roleName} role set for address ${address}`);
}

async function loadRocketPoolContracts() {
  const rplContract               = await ethers.getContractAt("contracts/Interfaces/RocketTokenRPLInterface.sol:RocketTokenRPLInterface", "0x012222D4F3AE9E665761b26B67CA87B74c21E552");
  const networkFeesContract       = await ethers.getContractAt("contracts/Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol:RocketDAOProtocolSettingsNetworkInterface", "0x04c1dc9b7469466c271Ec61052e777cCbe85567a");
  const rockStorageContract       = await ethers.getContractAt("RocketStorage", "0x5467C31426F096e18e174C91dEA078bdc2e0aabD");
  const rocketNodeManagerContract = await ethers.getContractAt("RocketNodeManagerInterface", "0x4263d1Eb9bBa3335057E8093346091d92fa20C19");
  const rocketNodeStakingContract = await ethers.getContractAt("RocketNodeStaking", "0xc8b48F10b5656AD586924BC695c0ABD05dE5Aa44");
  const enriched_contracts        = { RPL: rplContract.address,
                                      NETWORK_FEES: networkFeesContract.address,
                                      ROCK_STORAGE: rockStorageContract.address,
                                      ROCKET_NODE_MANAGER: rocketNodeManagerContract.address,
                                      ROCKET_NODE_STAKING: rocketNodeStakingContract.address };
  for (const [contractName, contractAddress] of Object.entries(contracts)) { await writeAddressToOutput(contractName, contractAddress)}
  return { rplContract, networkFeesContract, rockStorageContract, rocketNodeManagerContract, rocketNodeStakingContract};
}

async function main() {
    const predictedNonce = 9;
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const { rplContract,networkFeesContract, rockStorageContract, rocketNodeManagerContract, rocketNodeStakingContract} = await loadRocketPoolContracts();    
    upgrades.silenceWarnings();
    const wETH                = await deployContract("WETH","WETH");
    const uniswapV3Pool       = await deployContract("UNISWAP_V3_POOL","MockUniswapV3Pool");  
    const directoryAddress    = await predictNextContractAddress(deployer, predictedNonce);
    const initNonce           = await getInitialNonce(deployer);
    const whitelist           = await deployAndInitializeContract("WHITLIST","contracts/Whitelist/Whitelist.sol:Whitelist", [directoryAddress], { initializer: 'initializeWhitelist', unsafeAllow: ['constructor']});
    const vCWETH              = await deployAndInitializeContract("VCWETH","WETHVault", [directoryAddress, wETH.address], { initializer: 'initializeVault', unsafeAllow: ['constructor', 'delegatecall'] });
    const vCRPL               = await deployAndInitializeContract("VCRPL","RPLVault", [directoryAddress, rplContract.address], { initializer: 'initializeVault', unsafeAllow: ['constructor', 'delegatecall']});
    const depositPool         = await deployAndInitializeContract("DEPOSIT_POOOL","DepositPool", [directoryAddress], { initializer: 'initialize', unsafeAllow: ['constructor', 'delegatecall']});
    const operatorDistributor = await deployAndInitializeContract("OPERATOR_DISTRIBUTOR","OperatorDistributor", [directoryAddress], { initializer: 'initialize', unsafeAllow: ['constructor', 'delegatecall']});
    const yieldDistributor    = await deployAndInitializeContract("YIELD_DISTRIBUTOR","YieldDistributor", [directoryAddress], { initializer: 'initialize', unsafeAllow: ['constructor', 'delegatecall']});
    const oracle              = await deployOracle()
    const priceFetcher        = await deployAndInitializeContract("PRICE_FETCH","PriceFetcher",[directoryAddress],{ initializer: 'initialize',unsafeAllow: ['constructor']});
    const directory           = await deployAndInitializeContract("DIRECTORY","Directory", [[ whitelist.address, vCWETH.address, vCRPL.address,
                                                                                              depositPool.address, operatorDistributor.address, yieldDistributor.address,
                                                                                              oracle.address, priceFetcher.address, rockStorageContract.address,
                                                                                              rocketNodeManagerContract.address, rocketNodeStakingContract.address, rplContract.address,
                                                                                              wETH.address, uniswapV3Pool.address]],
                                                                                            { initializer: 'initialize', unsafeAllow: ['constructor']});
    await verifyDeployment(deployer, initNonce, predictedNonce, directory, directoryAddress);
    await setRole(directory, "ADMIN_SERVER_ROLE", deployer.address);
    await setRole(directory, "TIMELOCK_24_HOUR", deployer.address);
    await setRole(directory, "CORE_PROTOCOL_ROLE", deployer.address); 
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
