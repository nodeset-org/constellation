import { task } from "hardhat/config";
import { ethers } from "hardhat";

task("useAdminServerCheck", "Sets preSignedExitMessageCheck to true")
  .addParam("address", "The address of the NodeAccountFactory contract")
  .setAction(async ({ address }, hre) => {
    const [deployer, admin] = await hre.ethers.getSigners();
    const factoryContract = await hre.ethers.getContractAt("NodeAccountFactory", address, admin);

    console.log("Command is deprecated");
    //console.log("Setting preSignedExitMessageCheck to true...");
    //const tx = await factoryContract.connect(admin).useAdminServerCheck();
    //await tx.wait();

    //console.log(`preSignedExitMessageCheck set to true successfully. Transaction Hash: ${tx.hash}`);
});
