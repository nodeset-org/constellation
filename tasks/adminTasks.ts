import { task } from "hardhat/config";
import { ethers } from "hardhat";

task("usePreSignedExitMessageCheck", "Sets preSignedExitMessageCheck to true")
  .addParam("address", "The address of the NodeAccountFactory contract")
  .setAction(async ({ address }, hre) => {
    const [deployer, admin] = await hre.ethers.getSigners();
    const factoryContract = await hre.ethers.getContractAt("NodeAccountFactory", address, admin);

    console.log("Setting preSignedExitMessageCheck to true...");
    const tx = await factoryContract.connect(admin).usePreSignedExitMessageCheck();
    await tx.wait();

    console.log(`preSignedExitMessageCheck set to true successfully. Transaction Hash: ${tx.hash}`);
});
