import { task } from "hardhat/config";
import fs from "fs";

// create retry function to attempt redeployment if there is some network error
async function retryDeploy(ethers: any, factory: string, args: any, retries: number): Promise<any> {
    try {
        console.log(`Attempting to deploy ${factory}...`);
        const ContractFactory = await ethers.getContractFactory(factory);
        const contractFactory = await ContractFactory.deploy(...args);
        await contractFactory.deployed();
        return contractFactory;
    } catch (e) {
        if (retries > 0) {
            console.log(`Error deploying ${factory}. Retrying...`);
            return await retryDeploy(ethers, factory, args, retries - 1);
        } else {
            console.log(`Error deploying ${factory}. Exiting to Main...`);
            return false;
        }
    }
}

// create retry function for verification
async function retryVerify(hre: any, address: string, network: string, retries: number, constructorArgs?: any): Promise<any> {
    try {
        console.log(`Attempting to verify ${address} on ${network}...`);
        await hre.run("verify:verify", {
            address: address,
            network: network,
            constructorArguments: constructorArgs,
        });
    } catch (e) {
        if (retries > 0) {
            console.log(`Error verifying ${address} on ${network}. Retrying...`);
            await new Promise(r => setTimeout(r, 10000));
            return await retryVerify(hre, address, network, retries - 1, constructorArgs);
        } else {
            console.log(`Error verifying ${address} on ${network}. Exiting to Main...`);
            return false;
        }
    }
}

task("deployMocks", "Deploy mock contracts for external dependencies")
    .setAction(async (args, hre) => {

        // create file to log deployments if it doesn't exist
        if (!fs.existsSync("./deployments")) {
            fs.mkdirSync("./deployments");
        }

        const logStream = fs.createWriteStream(`./deployments/mocks-${hre.network.name}.log`, { flags: 'a' });
        const today = new Date();
        logStream.write(`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}\n`);

        // write the command used to deploy
        const firstLine = `npx hardhat deployMocks --network ${hre.network.name}\n`;
        logStream.write(firstLine);

        const { ethers } = hre;

        const mockOracle = await retryDeploy(ethers, "MockRETHOracle", [], 5);
        console.log("mockOracle successfully deployed at address: ", mockOracle.address);
        logStream.write(`mockOracle: ${mockOracle.address}\n`);
        let hasVerified = await retryVerify(hre, mockOracle.address, hre.network.name, 5, []);
        logStream.write(`mockOracle ${hasVerified ? "" : "not "} verified\n`);

        const mockRocketStorage = await retryDeploy(ethers, "MockRocketStorage", [], 5);
        console.log("mockRocketStorage successfully deployed at address: ", mockRocketStorage.address);
        logStream.write(`mockRocketStorage: ${mockRocketStorage.address}\n`);
        hasVerified = await retryVerify(hre, mockRocketStorage.address, hre.network.name, 5, []);
        logStream.write(`mockRocketStorage ${hasVerified ? "" : "not "} verified\n`);

        const mockRocketNodeManager = await retryDeploy(ethers, "MockRocketNodeManager", [], 5);
        console.log("mockRocketNodeManager successfully deployed at address: ", mockRocketNodeManager.address);
        logStream.write(`mockRocketNodeManager: ${mockRocketNodeManager.address}\n`);
        hasVerified = await retryVerify(hre, mockRocketNodeManager.address, hre.network.name, 5, []);
        logStream.write(`mockRocketNodeManager ${hasVerified ? "" : "not "} verified\n`);

        const mockRocketNodeStaking = await retryDeploy(ethers, "MockRocketNodeStaking", [], 5);
        console.log("mockRocketNodeStaking successfully deployed at address: ", mockRocketNodeStaking.address);
        logStream.write(`mockRocketNodeStaking: ${mockRocketNodeStaking.address}\n`);
        hasVerified = await retryVerify(hre, mockRocketNodeStaking.address, hre.network.name, 5, []);
        logStream.write(`mockRocketNodeStaking ${hasVerified ? "" : "not "} verified\n`);
    });

task("deploy", "Deploy contracts")
    .addParam("oracle", "Address of oracle")
    .addParam("rocketStorage", "Address of rocketStorage")
    .addParam("rocketNodeManager", "Address of rocketNodeManager")
    .addParam("rocketNodeStaking", "Address of rocketNodeStaking")
    .addParam("rplToken", "Address of rplToken")
    .addParam("wethToken", "Address of wethToken")
    .setAction(async (args, hre) => {
        const { ethers, upgrades } = hre;

        // validate params to be addresses
        if (!ethers.utils.isAddress(args.oracle)) {
            console.log("Invalid oracle address");
            return;
        }

        if (!ethers.utils.isAddress(args.rocketStorage)) {
            console.log("Invalid rocketStorage address");
            return;
        }

        if (!ethers.utils.isAddress(args.rocketNodeManager)) {
            console.log("Invalid rocketNodeManager address");
            return;
        }

        if (!ethers.utils.isAddress(args.rocketNodeStaking)) {
            console.log("Invalid rocketNodeStaking address");
            return;
        }

        if (!ethers.utils.isAddress(args.rplToken)) {
            console.log("Invalid rplToken address");
            return;
        }

        if (!ethers.utils.isAddress(args.wethToken)) {
            console.log("Invalid wethToken address");
            return;
        }

        // create file to log deployments if it doesn't exist
        if (!fs.existsSync("./deployments")) {
            fs.mkdirSync("./deployments");
        }
        const logStream = fs.createWriteStream(`./deployments/${hre.network.name}.log`, { flags: 'a' });
        const today = new Date();
        logStream.write(`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}\n`);

        // write the command used to deploy
        const firstLine = `npx hardhat deploy --network ${hre.network.name} --oracle ${args.oracle} --rocketStorage ${args.rocketStorage} --rocketNodeManager ${args.rocketNodeManager} --rocketNodeStaking ${args.rocketNodeStaking} --rplToken ${args.rplToken} --wethToken ${args.wethToken}\n`;
        logStream.write(firstLine);


        const directory = await retryDeploy(ethers, "Directory", [], 5);
        console.log("directory successfully deployed at address: ", directory.address);
        logStream.write(`directory: ${directory.address}\n`);
        let hasVerified = await retryVerify(hre, directory.address, hre.network.name, 5, []);
        logStream.write(`directory ${hasVerified ? "" : "not "} verified\n`);
        console.log("directory successfully verified");

        // [DevOps] ideally we have some automated way for Frontend/Backend to get the current addresses for each network as well as a staging/production environment/dev ID for each network
        // [DevOps] for now we can just pass the log around on discord

        const whitelist = await upgrades.deployProxy(await retryDeploy(ethers, "contracts/Whitelist/Whitelist.sol:Whitelist", [directory.address], 5), { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        const whitelistImplentation = await whitelist.getImplementation();
        console.log("whitelist successfully deployed at address: ", whitelist.address);
        logStream.write(`whitelist: ${whitelist.address}\n`);
        hasVerified = await retryVerify(hre, whitelistImplentation.address, hre.network.name, 5, [directory.address]);
        logStream.write(`whitelistImplentation ${hasVerified ? "" : "not "} verified\n`);

        const vCWETH = await retryDeploy(ethers, "WETHVault", [directory.address], 5);
        console.log("vCWETH successfully deployed at address: ", vCWETH.address);
        logStream.write(`vCWETH: ${vCWETH.address}\n`);
        hasVerified = await retryVerify(hre, vCWETH.address, hre.network.name, 5, [directory.address]);
        logStream.write(`vCWETH ${hasVerified ? "" : "not "} verified\n`);

        const vCRPL = await retryDeploy(ethers, "RPLVault", [directory.address], 5);
        console.log("vCRPL successfully deployed at address: ", vCRPL.address);
        logStream.write(`vCRPL: ${vCRPL.address}\n`);
        hasVerified = await retryVerify(hre, vCRPL.address, hre.network.name, 5, [directory.address]);
        logStream.write(`vCRPL ${hasVerified ? "" : "not "} verified\n`);

        const depositPool = await retryDeploy(ethers, "DepositPool", [directory.address], 5);
        console.log("depositPool successfully deployed at address: ", depositPool.address);
        logStream.write(`depositPool: ${depositPool.address}\n`);
        hasVerified = await retryVerify(hre, depositPool.address, hre.network.name, 5, [directory.address]);
        logStream.write(`depositPool ${hasVerified ? "" : "not "} verified\n`);

        const operatorDistributor = await retryDeploy(ethers, "OperatorDistributor", [directory.address], 5);
        console.log("operatorDistributor successfully deployed at address: ", operatorDistributor.address);
        logStream.write(`operatorDistributor: ${operatorDistributor.address}\n`);
        hasVerified = await retryVerify(hre, operatorDistributor.address, hre.network.name, 5, [directory.address]);
        logStream.write(`operatorDistributor ${hasVerified ? "" : "not "} verified\n`);

        const yieldDistributor = await retryDeploy(ethers, "YieldDistributor", [directory.address], 5);
        console.log("yieldDistributor successfully deployed at address: ", yieldDistributor.address);
        logStream.write(`yieldDistributor: ${yieldDistributor.address}\n`);
        hasVerified = await retryVerify(hre, yieldDistributor.address, hre.network.name, 5, [directory.address]);
        logStream.write(`yieldDistributor ${hasVerified ? "" : "not "} verified\n`);

    });