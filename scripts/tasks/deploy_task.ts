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
            throw e;
        }
    }
}

// create retry function for verification
async function retryVerify(hre: any, address: string, network: string, retries: number, constructorArgs?: any): Promise<void> {
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
            return await retryVerify(hre, address, network, retries - 1, constructorArgs);
        } else {
            throw e;
        }
    }
}

task("deploy", "Deploy contracts")
    .setAction(async (args, hre) => {
        // create file to log deployments if it doesn't exist
        if (!fs.existsSync("./deployments")) {
            fs.mkdirSync("./deployments");
        }
        const logStream = fs.createWriteStream(`./deployments/${hre.network.name}.log`, { flags: 'a' });
        const today = new Date();
        logStream.write(`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}\n`);

        const { ethers } = hre;

        const directoryContract = await retryDeploy(ethers, "Directory", [], 5);
        console.log("directory successfully deployed at address: ", directoryContract.address);
        logStream.write(`directory: ${directoryContract.address}\n`);
        await retryVerify(hre, directoryContract.address, hre.network.name, 5, []);
        console.log("directory successfully verified");

        // [DevOps] ideally we have some automated way for Frontend/Backend to get the current addresses for each network as well as a staging/production environment/dev ID for each network
        // [DevOps] for now we can just pass the log around on discord

    });