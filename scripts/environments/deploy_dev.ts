import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture } from "../../test/test";
import { setDefaultParameters } from "../../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../../test/utils/utils";
import { expect } from "chai";
import readline from 'readline';
import { devParameterization, fastDeployProtocol, fastParameterization, generateBytes32Identifier, retryOperation } from "../utils/deployment";
import { wEth } from "../../typechain-types/contracts/Testing";
import findConfig from "find-config";
import dotenv from "dotenv";
import { Directory, SuperNodeAccount } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet } from 'ethers';
import { readFileSync } from 'fs';
import {  getWalletFromPath } from "./keyReader";

export async function deployDev(rocketStorageAddress: string, wETHAddress: string, sanctionsAddress: string, deployer: Wallet | SignerWithAddress, admin: Wallet | SignerWithAddress) {
    const { directory, superNode } = await fastDeployProtocol(deployer.address, deployer, admin.address, admin.address, admin, rocketStorageAddress, wETHAddress, sanctionsAddress, admin.address, true, 1);
    upgrades.silenceWarnings()
    await devParameterization(directory, admin, deployer);
    await fastParameterization(directory, superNode, admin, deployer, deployer, deployer.address, deployer.address, deployer.address);
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
        const deployerWallet = await getWalletFromPath(deployerPath);
        const directoryDeployerWallet = await getWalletFromPath(directoryDeployerPath)

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