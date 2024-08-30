import { task } from "hardhat/config";
import { retryOperation } from "../scripts/utils/deployment";

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

task("prepareDependencies", "deploys weth and sanctions")
  .setAction(async ({ address, nodeFee }, hre) => {

    const [deployer, admin] = await hre.ethers.getSigners();

    // deploy weth
    const wETH = await retryOperation(async () => {
      const WETH = await ethers.getContractFactory("WETH");
      const contract = await WETH.deploy();
      await contract.deployed();
      return contract;
    });
    console.log("weth address", wETH.address)

    const sanctions = await retryOperation(async () => {
      const Sanctions = await ethers.getContractFactory("MockSanctions");
      const contract = await Sanctions.deploy();
      await contract.deployed();
      return contract;
    });
    console.log("sanctions address", sanctions.address);
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

task("reset", "Resets the node to the initial state")
  .setAction(async (_, hre) => {
    const [deployer, admin] = await hre.ethers.getSigners();
    console.log("Deployer: ", deployer.address, " balance ", await hre.ethers.provider.getBalance(deployer.address));
    console.log("Admin:", admin.address, await hre.ethers.provider.getBalance(admin.address));
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