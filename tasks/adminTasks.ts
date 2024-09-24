import { task } from "hardhat/config";
//import { retryOperation } from "../scripts/utils/deployment";
import findConfig from "find-config";
import dotenv from "dotenv";
import { deployTimelockFromEnv } from "../scripts/environments/timelock";

task("encodeProposal", "Encodes a proposal for execution")
  .addParam("sigs", "Array of function signatures as a JSON string")
  .addParam("params", "Array of parameters corresponding to each function signature as a JSON string")
  .setAction(async ({ sigs, params }, hre) => {
    let sigsArray;
    let paramsArray;

    try {
      sigsArray = JSON.parse(sigs);
      paramsArray = JSON.parse(params);
    } catch (error) {
      console.error("Error parsing JSON inputs:", error);
      return;
    }

    if (!Array.isArray(sigsArray) || !Array.isArray(paramsArray)) {
      console.error("Both sigs and params must be JSON arrays.");
      return;
    }

    if (sigsArray.length !== paramsArray.length) {
      console.error("The number of signatures and parameter sets must match.");
      console.error(`sigs length: ${sigsArray.length}, params length: ${paramsArray.length}`);
      return;
    }

    const calldata = [];

    for (let i = 0; i < sigsArray.length; i++) {
      const sig = sigsArray[i];
      const param = paramsArray[i];

      // Extract function name and parameter types
      const functionNameMatch = sig.match(/^(\w+)\((.*)\)$/);
      if (!functionNameMatch) {
        console.error(`Invalid function signature format: ${sig}`);
        return;
      }

      const functionName = functionNameMatch[1];
      const functionParams = functionNameMatch[2].split(',').map((param: string) => param.trim());

      const iface = new hre.ethers.utils.Interface([`function ${sig}`]);

      try {
        const encodedData = iface.encodeFunctionData(functionName, param);
        calldata.push(encodedData);
      } catch (error) {
        console.error(`Error encoding function ${sig} with params ${JSON.stringify(param)}:`, error);
        return;
      }
    }

    console.log("Encoded proposal data:");
    calldata.forEach((data, index) => {
      console.log(`Function ${index + 1}: ${data}`);
    });
  });



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

task("deployTimelocks", "deploys a timelock")
  .addParam("env", "prod, dev, or whatever is defined in .env.<NAME>")
  .setAction(async ({ env }, hre) => {
    const dotenvPath = findConfig(`.env.${env}.timelock`);
    if (dotenvPath !== null) {
      dotenv.config({ path: dotenvPath });
    } else {
      console.error("File ", `.env.${env}.timelock could not be found`)
    }


    await deployTimelockFromEnv(hre, env, true, process.env.SHORT_TIMELOCK_MIN_DELAY_SECONDS, [process.env.SHORT_TIMELOCK_PROPOSER as string], [process.env.SHORT_TIMELOCK_EXECUTOR as string]);
    await deployTimelockFromEnv(hre, env, true, process.env.MED_TIMELOCK_MIN_DELAY_SECONDS, [process.env.MED_TIMELOCK_PROPOSER as string], [process.env.MED_TIMELOCK_EXECUTOR as string]);
    await deployTimelockFromEnv(hre, env, true, process.env.LONG_TIMELOCK_MIN_DELAY_SECONDS, [process.env.LONG_TIMELOCK_PROPOSER as string], [process.env.LONG_TIMELOCK_EXECUTOR as string]);

  });

task("deployProtocol", "deploys either staging for prod version of protocol")
  .addParam("mode", "mode 0 is staging, mode 1 is prod")
  .setAction(async ({ mode }, hre) => {

    //const directory = await deployStagingUsingEnv(mode);

    //console.log("Deploy protocol, directory: ",directory?.address);
  });

task("prepareDependencies", "deploys weth and sanctions")
  .setAction(async (hre) => {

    const [deployer, admin] = await hre.ethers.getSigners();

    // deploy weth
    const WETH = await hre.ethers.getContractFactory("WETH");
    let contract = await WETH.deploy();
    await contract.deployed();
    console.log("weth address", contract.address)

    const Sanctions = await hre.ethers.getContractFactory("MockSanctions");
    contract = await Sanctions.deploy();
    await contract.deployed();
    console.log("sanctions address", contract.address);
  });

task("setMinimumNodeFee", "Sets minimum node fee")
  .addParam("address", "The address of the SuperNodeAccount")
  .addParam("nodeFee", "The amount of fee to set minipool in ether")
  .setAction(async ({ address, nodeFee }, hre) => {

    const [deployer, admin] = await hre.ethers.getSigners();
    const sna = await hre.ethers.getContractAt("SuperNodeAccount", address, admin);

    const tx = await sna.setMinimumNodeFee(hre.ethers.utils.parseEther(nodeFee));
    console.log("Setting Node Fee to ", hre.ethers.utils.parseEther(nodeFee));
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
      value: hre.ethers.utils.parseEther(amount),
      to: address
    });

    const tx = await result.wait();

    const balance = await hre.ethers.provider.getBalance(address);

    console.log(`sent ${amount} to ${address}. New balance is ${balance.toString()}`);


  });