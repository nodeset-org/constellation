import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture } from "../../test/test";
import { setDefaultParameters } from "../../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../../test/utils/utils";
import { expect } from "chai";
import readline from 'readline';
import { devParameterization, fastDeployProtocol, fastParameterization, generateBytes32Identifier, retryOperation, revokeTemporalAdmin } from "../utils/deployment";
import { wEth } from "../../typechain-types/contracts/Testing";
import findConfig from "find-config";
import dotenv from "dotenv";
import { Directory, SuperNodeAccount } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet } from 'ethers';
import { readFileSync } from 'fs';
import { getWalletFromPath } from "./keyReader";

export async function deployStaging(treasurerAddress: string, deployer: Wallet | SignerWithAddress, nodesetAdmin: string, nodesetServerAdmin: string, directoryDeployer: Wallet | SignerWithAddress, rocketStorage: string, weth: string, sanctions: string, temporalAdmin: Wallet | SignerWithAddress, multiSigAdmin: string, adminServer: string, adminOracle: string, timelockShort: string, timelockMed: string, timelockLong: string) {
    const { directory, superNode } = await fastDeployProtocol(treasurerAddress, deployer, nodesetAdmin, nodesetServerAdmin, directoryDeployer, rocketStorage, weth, sanctions, temporalAdmin.address, true, 1);
    upgrades.silenceWarnings()
    await fastParameterization(directory, superNode, temporalAdmin, adminServer, adminOracle, timelockShort, timelockMed, timelockLong);
    await revokeTemporalAdmin(directory, temporalAdmin, multiSigAdmin)
    return directory
}

export async function deployStagingUsingEnv(mode=0) {
    const dotenvPath = findConfig(`.env.${mode === 0 ? 'staging' : 'prod'}`);

    if (dotenvPath !== null) {
        dotenv.config({ path: dotenvPath });
    } else {
        // Handle the case where no .env file is found
        console.error('No .env.staging file found');
        return;
    }

    if (!process.env.DEPLOYER_PRIVATE_KEY_PATH || !process.env.DIRECTORY_DEPLOYER_PRIVATE_KEY_PATH || !process.env.TEMPORAL_ADMIN_KEY_PATH) {
        console.error('Private key paths are missing in the environment variables.');
        return;
    }

    try {
        const deployerWallet = await getWalletFromPath(ethers, process.env.DEPLOYER_PRIVATE_KEY_PATH as string);
        const directoryDeployerWallet = await getWalletFromPath(ethers, process.env.DIRECTORY_DEPLOYER_PRIVATE_KEY_PATH as string)
        const temporalAdminWallet = await getWalletFromPath(ethers, process.env.TEMPORAL_ADMIN_KEY_PATH as string)

        return await deployStaging(
            process.env.TREASURER_ADDRESS as string,
            deployerWallet,
            process.env.NODESET_ADMIN as string,
            process.env.NODESET_SERVER_ADMIN as string,
            directoryDeployerWallet,
            process.env.RP_STORAGE_CONTRACT_ADDRESS as string,
            process.env.WETH_ADDRESS as string,
            process.env.SANCTIONS_LIST_ADDRESS as string,
            temporalAdminWallet,
            process.env.ADMIN_MULTISIG as string,
            process.env.ADMIN_SERVER as string,
            process.env.ADMIN_ORACLE as string,
            process.env.TIMELOCK_SHORT as string,
            process.env.TIMELOCK_MEDIUM as string,
            process.env.TIMELOCK_LONG as string,
            
        );
    } catch (err) {
        console.error('Error reading private keys or deploying:', err);
    }
}