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

task("verifyDirectory", "Verify Directory contract")
    .addParam("address", "Address of the contract to verify")
    .setAction(async (args, hre) => {
            await hre.run("verify:verify", {
                address: args.address,
                constructorArguments: [],
            });
    });


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

        const directoryContract = await retryDeploy(ethers, "Directory", [], 3);
        console.log("directory successfully deployed at address: ", directoryContract.address);
        await hre.run("verifyDirectory", {
            address: directoryContract.address,
        });
        logStream.write(`directory: ${directoryContract.address}\n`);
        // [DevOps] ideally we have some automated way for Frontend/Backend to get the current addresses for each network as well as a staging/production environment/dev ID for each network
        // [DevOps] for now we can just pass the log around on discord

    });