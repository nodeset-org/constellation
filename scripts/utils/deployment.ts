import { ethers, upgrades } from "hardhat";
import fs from 'fs';
import path from 'path';
import { FunctionFragment } from 'ethers/lib/utils';
import { getNextContractAddress } from "../../test/utils/utils";
import { getInitializerData } from "@openzeppelin/hardhat-upgrades/dist/utils";
import readline from 'readline';
import { RPLVault, WETHVault, Whitelist } from "../../typechain-types";

// Function to prompt user for input
function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise<string>(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
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

// Function to generate bytes32 representation for contract identifiers
export const generateBytes32Identifier = (identifier: string) => {
    // Correctly concatenate 'contract.address' with the identifier before hashing
    return ethers.utils.solidityKeccak256(["string"], [`contract.address${identifier}`]);
};

export async function deployProtocol(rocketStorage: string, weth: string, sanctions: string, uniswapV3: string, log: boolean) {

    const [deployer, directoryDeployer] = await ethers.getSigners();

    const directoryAddress = await getNextContractAddress(directoryDeployer, 1)

    const whitelistProxy = await retryOperation(async function () {
        return await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist"), [directoryAddress], { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
    });

    const vCWETHProxy = await retryOperation(async function () {
        return await upgrades.deployProxy(await ethers.getContractFactory("WETHVault"), [directoryAddress, weth], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    });

    const bytes32IdentifierRplContract = generateBytes32Identifier('rocketTokenRPL');
    const rplContract = await retryOperation(async function () {
        return await ethers.getContractAt("contracts/Interfaces/RocketTokenRPLInterface.sol:RocketTokenRPLInterface", bytes32IdentifierRplContract);
    });

    const vCRPLProxy = await retryOperation(async function () {
        return await upgrades.deployProxy(await ethers.getContractFactory("RPLVault"), [directoryAddress, rplContract.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    })

    return {
        whitelist: whitelistProxy as Whitelist,
        vCWETH: vCWETHProxy as WETHVault,
        vCRPL: vCRPLProxy as RPLVault
    }
}