import { task } from "hardhat/config";

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

task("setMinimumNodeFee", "Sets minimum node fee")
  .addParam("address", "The address of the SuperNodeAccount")
  .addParam("nodeFee", "The amount of fee to set minipool in ether")
  .setAction(async ({ address, nodeFee }, hre) => {

    const [deployer, admin] = await hre.ethers.getSigners();
    const sna = await hre.ethers.getContractAt("SuperNodeAccount", address, admin);

    const tx = await sna.setMinimumNodeFee(ethers.utils.parseEther(nodeFee));
    console.log("Setting Node Fee to ", ethers.utils.parseEther(nodeFee));
    console.log(tx)
  });

task("setMaxValidators", "Sets max number of validators a user can make")
  .addParam("address", "The address of the SuperNodeAccount")
  .addParam("maxValidators", "Sets the _maxValidators")
  .setAction(async ({ address, maxValidators }, hre) => {

    const [deployer, admin] = await hre.ethers.getSigners();
    const sna = await hre.ethers.getContractAt("SuperNodeAccount", address, admin);

    console.log("Trying to set...");
    const tx = await sna.connect(deployer).setMaxValidators(ethers.utils.parseEther(maxValidators));
    console.log("Setting Max Validators Fee to ", ethers.utils.parseEther(maxValidators));
    console.log(tx)
  });

task("reset", "Resets the node to the initial state")
  .setAction(async (_, hre) => {
    await hre.network.provider.send("hardhat_reset");
    console.log('reset to initial state');
  });

task("sendEth", "Send Eth to account")
  .addParam('to', 'address to send eth to')
  .addParam('amount', 'amount to send in eth')
  .setAction(async ({ address, amount }, hre) => {

    const [ethWhale] = await hre.ethers.getSigners();

    const result = await ethWhale.sendTransaction({
      value: ethers.utils.parseEther(amount),
      to: address
    });

    const tx = await result.wait();

    const balance = await ethers.provider.getBalance(address);

    console.log(`sent ${amount} to ${address}. New balance is ${balance.toString()}`);


  });