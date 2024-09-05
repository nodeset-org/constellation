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

export async function deployDev(rocketStorageAddress: string, wETHAddress: string, sanctionsAddress: string, deployer: Wallet | SignerWithAddress, admin: Wallet | SignerWithAddress) {

    const { directory, superNode } = await fastDeployProtocol(deployer, deployer, admin, admin, admin, rocketStorageAddress, wETHAddress, sanctionsAddress, admin.address, true, 1);

    upgrades.silenceWarnings()

    await devParameterization(directory, deployer, deployer);
    await fastParameterization(directory, superNode, admin, deployer, deployer, deployer.address, deployer.address, deployer.address);

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
        let deployerPrivateKey = readFileSync(deployerPath, 'utf8').trim();
        let directoryDeployerPrivateKey = readFileSync(directoryDeployerPath, 'utf8').trim();

        function validatePrivateKey(key: string) {
            // Add '0x' if not present
            if (!key.startsWith('0x')) {
                key = `0x${key}`;
            }

            // Validate key length (should be 66 characters: 0x + 64 hex chars)
            if (key.length !== 66) {
                throw new Error(`Private key must be 64 hex characters long. Got: ${key.length - 2}`);
            }

            // Validate key format (should only contain hex characters after '0x')
            if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
                throw new Error('Invalid characters in private key. Expected a 64-character hex string.');
            }

            return key;
        }

        // Validate the private keys
        deployerPrivateKey = validatePrivateKey(deployerPrivateKey);
        directoryDeployerPrivateKey = validatePrivateKey(directoryDeployerPrivateKey);

        const deployerWallet = new Wallet(deployerPrivateKey, ethers.provider);
        const directoryDeployerWallet = new Wallet(directoryDeployerPrivateKey, ethers.provider);

        await deployDev(
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

async function main() {
    await deployDevUsingEnv();
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });