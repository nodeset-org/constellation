import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture } from "../../test/test";
import { setDefaultParameters } from "../../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../../test/utils/utils";
import { expect } from "chai";
import readline from 'readline';
import { fastDeployProtocol, generateBytes32Identifier, retryOperation } from "../utils/deployment";
import { wEth } from "../../typechain-types/contracts/Testing";
import findConfig from "find-config";
import dotenv from "dotenv";

const dotenvPath = findConfig('.env.dev');

if (dotenvPath !== null) {
    dotenv.config({ path: dotenvPath });
  } else {
    // Handle the case where no .env file is found
    console.error('No .env.dev file found');
  }

async function main() {
    const [deployer, admin] = await ethers.getSigners();

    const rocketStorage = await ethers.getContractAt('RocketStorage', process.env.RP_STORAGE_CONTRACT_ADDRESS as string);
    const wETH =  await ethers.getContractAt('WETH', process.env.WETH_ADDRESS as string);
    const sanctions =  await ethers.getContractAt('MockSanctions', process.env.SANCTIONS_LIST_ADDRESS as string);

    upgrades.silenceWarnings()

    const { directory, superNode } = await fastDeployProtocol(deployer, deployer, admin, admin, admin, rocketStorage.address, wETH.address, sanctions.address, admin.address, true, 0);

    // set adminServer to be ADMIN_SERVER_ROLE
    const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_SERVER_ROLE"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(adminRole), deployer.address);
    });

    // set adminServer to be ADMIN_ORACLE_ROLE
    const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(adminOracleRole), deployer.address);
    });

    // set timelock to be TIMELOCK_ROLE
    const timelockShortRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_SHORT"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(timelockShortRole), deployer.address);
    });
    console.log("timelock short role set");

    // set timelock to be TIMELOCK_ROLE
    const timelockMedRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_MED"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(timelockMedRole), deployer.address);
    });
    console.log("timelock med role set");

    // set timelock to be TIMELOCK_ROLE
    const timelockLongRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_LONG"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(timelockLongRole), deployer.address);
    });
    console.log("timelock long role set");

    // set protocolSigner to be PROTOCOL_ROLE
    const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(protocolRole), deployer.address);
    });
    console.log("protocol role set");

    await retryOperation(async () => {
        await superNode.connect(admin).setMinimumNodeFee("69420000000000000")
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });