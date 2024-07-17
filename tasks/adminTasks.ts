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

task("reset", "Resets the node to the initial state")
  .setAction(async (_, hre) => {
    await hre.network.provider.send("hardhat_reset");
    console.log('reset to initial state');
});

task("sendEth", "Send Eth to account")
  .addParam('to', 'address to send eth to')
  .addParam('amount', 'amount to send in eth')
  .setAction(async ( { address, amount }, hre) => {
    
    const [ethWhale] = await hre.ethers.getSigners();

    const result = await ethWhale.sendTransaction({
      value: ethers.utils.parseEther(amount),
      to: address
    });

    const tx = await result.wait();

    const balance = await ethers.provider.getBalance(address);

    console.log(`sent ${amount} to ${address}. New balance is ${balance.toString()}`);


  });