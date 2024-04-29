import { ethers, upgrades } from "hardhat";
import fs from 'fs';
import path from 'path';
import { FunctionFragment } from 'ethers/lib/utils';
import { getNextContractAddress } from "../../test/utils/utils";
import { getInitializerData } from "@openzeppelin/hardhat-upgrades/dist/utils";
import readline from 'readline';
import { AdminTreasury, Directory, FundRouter, NodeAccountFactory, OperatorDistributor, PriceFetcher, RPLVault, WETHVault, Whitelist, YieldDistributor } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

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

export async function fastDeployProtocol(deployer: SignerWithAddress, directoryDeployer: SignerWithAddress, rocketStorage: string, weth: string, sanctions: string, uniswapV3: string, oracle: string, admin: string, log: boolean) {

    const directoryAddress = await getNextContractAddress(directoryDeployer, 1)

    const whitelistProxy = await retryOperation(async () => {
        const whitelist = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist", deployer), [directoryAddress], { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        if (log) console.log("whitelist deployed to", whitelist.address)
        return whitelist;
    });

    const vCWETHProxy = await retryOperation(async () => {
        const vCWETH = await upgrades.deployProxy(await ethers.getContractFactory("WETHVault", deployer), [directoryAddress, weth], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("vaulted constellation eth deployed to", vCWETH.address)
        return vCWETH;
    });

    const addressRplContract = await retryOperation(async () => {
        const bytes32IdentifierRplContract = generateBytes32Identifier('rocketTokenRPL');
        const rocketStorageDeployment = await ethers.getContractAt("RocketStorage", rocketStorage);
        const addressRplContract = await rocketStorageDeployment.getAddress(bytes32IdentifierRplContract);
        return addressRplContract
    })

    const rplContract = await retryOperation(async function () {
        return await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20", addressRplContract);
    });

    const vCRPLProxy = await retryOperation(async function () {
        const vCRPL = await upgrades.deployProxy(await ethers.getContractFactory("RPLVault", deployer), [directoryAddress, rplContract.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("vaulted constellation rpl deployed to", vCRPL.address)
        return vCRPL
    })

    const depositPoolProxy = await retryOperation(async function () {
        const dp = await upgrades.deployProxy(await ethers.getContractFactory("FundRouter", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("Fund Router (Deposit Pool) deployed to", dp.address)
        return dp
    })

    const operatorDistributorProxy = await retryOperation(async function () {
        const od = await upgrades.deployProxy(await ethers.getContractFactory("OperatorDistributor", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("operator distributor deployed to", od.address)
        return od
    })

    const yieldDistributorProxy = await retryOperation(async function () {
        const yd = await upgrades.deployProxy(await ethers.getContractFactory("YieldDistributor", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("yield distributor deployed to", yd.address)
        return yd
    })

    const priceFetcherProxy = await retryOperation(async function () {
        const pf = await upgrades.deployProxy(await ethers.getContractFactory("PriceFetcher", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        if (log) console.log("price fetcher deployed to", pf.address)
        return pf
    })

    const adminTreasuryProxy = await retryOperation(async function () {
        const at = await upgrades.deployProxy(await ethers.getContractFactory("AdminTreasury", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        if (log) console.log("admin treasury deployed to", at.address)
        return at
    })

    const nodeAccountLogic = await retryOperation(async function () {
        const NodeAccountLogic = await ethers.getContractFactory("NodeAccount", deployer);
        const nodeAccountLogic = await NodeAccountLogic.deploy();
        await nodeAccountLogic.deployed();
        if (log) console.log("node account impl for cloning deployed to", nodeAccountLogic.address)
        return nodeAccountLogic;
    })

    const nodeAccountFactoryProxy = await retryOperation(async () => {
        const naf = await upgrades.deployProxy(await ethers.getContractFactory("NodeAccountFactory", deployer), [directoryAddress, nodeAccountLogic.address], { 'initializer': 'initializeWithImplementation', 'kind': 'uups', 'unsafeAllow': ['constructor'] })
        if (log) console.log("node account factory deployed to", naf.address)
        return naf
    });

    if(log) {
        console.log("verify directory input");
        console.log("whitelistProxy.address", whitelistProxy.address)
        console.log("vCWETHProxy.address", vCWETHProxy.address)
        console.log("vCRPLProxy.address", vCRPLProxy.address)
        console.log("depositPoolProxy.address", depositPoolProxy.address)
        console.log("operatorDistributorProxy.address", operatorDistributorProxy.address)
        console.log("nodeAccountFactoryProxy.address", nodeAccountFactoryProxy.address)
        console.log("yieldDistributorProxy.address", yieldDistributorProxy.address)
        console.log("oracle", oracle)
        console.log("priceFetcherProxy.address", priceFetcherProxy.address)
        console.log("rocketStorage", rocketStorage)
        console.log("weth", weth)
        console.log("uniswapV3", uniswapV3)
        console.log("sanctions", sanctions)
    }

    const directoryProxy = await retryOperation(async () => {
        const dir = await upgrades.deployProxy(await ethers.getContractFactory("Directory", directoryDeployer),
            [
                [
                    whitelistProxy.address,
                    vCWETHProxy.address,
                    vCRPLProxy.address,
                    depositPoolProxy.address,
                    operatorDistributorProxy.address,
                    nodeAccountFactoryProxy.address,
                    yieldDistributorProxy.address,
                    oracle,
                    priceFetcherProxy.address,
                    rocketStorage,
                    weth,
                    uniswapV3,
                    sanctions,
                ],
                adminTreasuryProxy.address,
                admin,
            ], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });

        if (log) console.log("directory deployed to", dir.address)

        return dir
    })

    if(log) {
        if(directoryAddress.toLocaleLowerCase() === directoryProxy.address.toLocaleLowerCase()) {
            console.log("directory matches predicted address", directoryAddress)
        } else {
            console.error("failed to deploy directory address to predicted address", directoryAddress, directoryProxy.address)
            throw new Error("Bad predicted directory")
        }
    }


    return {
        whitelist: whitelistProxy as Whitelist,
        vCWETH: vCWETHProxy as WETHVault,
        vCRPL: vCRPLProxy as RPLVault,
        depositPool: depositPoolProxy as FundRouter,
        operatorDistributor: operatorDistributorProxy as OperatorDistributor,
        yieldDistributor: yieldDistributorProxy as YieldDistributor,
        priceFetcher: priceFetcherProxy as PriceFetcher,
        adminTreasury: adminTreasuryProxy as AdminTreasury,
        nodeAccountFactory: nodeAccountFactoryProxy as NodeAccountFactory,
        directory: directoryProxy as Directory
    }
}