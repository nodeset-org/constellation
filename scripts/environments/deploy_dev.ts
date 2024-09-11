import { ethers, upgrades } from "hardhat";
import { setDefaultParameters } from "../../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../../test/utils/utils";
import { expect } from "chai";
import readline from 'readline';
import { fastDeployProtocol, generateBytes32Identifier, retryOperation } from "../utils/deployment";
import { wEth } from "../../typechain-types/contracts/Testing";
import findConfig from "find-config";
import dotenv from "dotenv";
import { Directory, SuperNodeAccount } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet } from 'ethers';
import { readFileSync } from 'fs';
import {  getWalletFromPath } from "./keyReader";

export async function deployDev(rocketStorageAddress: string, wETHAddress: string, sanctionsAddress: string, deployer: Wallet | SignerWithAddress, admin: Wallet | SignerWithAddress) {
    const { directory, superNode } = await fastDeployProtocol(
        deployer.address, 
        deployer,
        admin.address, 
        admin.address, 
        admin.address,
        admin, 
        admin.address,
        rocketStorageAddress, 
        wETHAddress, 
        sanctionsAddress, 
        admin.address, 
        true, 
        1
    );
    upgrades.silenceWarnings()
    console.log('trying to set protocol role...');

    // set protocolSigner to be PROTOCOL_ROLE
    const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('CORE_PROTOCOL_ROLE'));
    await retryOperation(async () => {
      await directory.connect(admin).grantRole(ethers.utils.arrayify(protocolRole), deployer.address);
    });
    console.log('protocol role set');

    return directory
}

export async function deployDevUsingEnv() {
    const dotenvPath = findConfig('.env.dev');

    if (dotenvPath !== null) {
        dotenv.config({ path: dotenvPath });
    } else {
        // Handle the case where no .env file is found
        console.error('No .env.dev file found');
        return;
    }

    const deployerPath = process.env.DEPLOYER_PRIVATE_KEY_PATH;
    const directoryDeployerPath = process.env.DIRECTORY_DEPLOYER_PRIVATE_KEY_PATH;

    if (!deployerPath || !directoryDeployerPath) {
        console.error('Private key paths are missing in the environment variables.');
        return;
    }

    try {
        const deployerWallet = await getWalletFromPath(ethers, deployerPath);
        const directoryDeployerWallet = await getWalletFromPath(ethers, directoryDeployerPath)

        return await deployDev(
            process.env.RP_STORAGE_CONTRACT_ADDRESS as string,
            process.env.WETH_ADDRESS as string,
            process.env.SANCTIONS_LIST_ADDRESS as string,
            directoryDeployerWallet,
            deployerWallet,
        );
    } catch (err) {
        console.error('Error reading private keys or deploying:', err);
    }
}

// async function main() {
//     await deployDevUsingEnv();
// }
// 
// 
// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });