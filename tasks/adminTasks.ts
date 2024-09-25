import { task, types } from "hardhat/config";
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

// MerkleClaimStreamer tasks
task("setStreamingInterval", "Encodes the setStreamingInterval(uint256) function call")
  .addParam("newStreamingInterval", "The new streaming interval (uint256)", undefined, types.string)
  .setAction(async ({ newStreamingInterval }, hre) => {
    const sigs = ["setStreamingInterval(uint256)"];
    const params = [[newStreamingInterval]];

    console.log(`Encoding setStreamingInterval with newStreamingInterval: ${newStreamingInterval}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setMerkleClaimsEnabled", "Encodes the setMerkleClaimsEnabled(bool) function call")
  .addParam("isEnabled", "Enable or disable Merkle claims (bool)", undefined, types.boolean)
  .setAction(async ({ isEnabled }, hre) => {
    const sigs = ["setMerkleClaimsEnabled(bool)"];
    const params = [[isEnabled]];

    console.log(`Encoding setMerkleClaimsEnabled with isEnabled: ${isEnabled}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

// OperatorDistributor tasks
task("setRplStakeRebalanceEnabled", "Encodes the setRplStakeRebalanceEnabled(bool) function call")
  .addParam("newValue", "Enable or disable RPL stake rebalance (bool)", undefined, types.boolean)
  .setAction(async ({ newValue }, hre) => {
    const sigs = ["setRplStakeRebalanceEnabled(bool)"];
    const params = [[newValue]];

    console.log(`Encoding setRplStakeRebalanceEnabled with newValue: ${newValue}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setMinipoolProcessingEnabled", "Encodes the setMinipoolProcessingEnabled(bool) function call")
  .addParam("newValue", "Enable or disable minipool processing (bool)", undefined, types.boolean)
  .setAction(async ({ newValue }, hre) => {
    const sigs = ["setMinipoolProcessingEnabled(bool)"];
    const params = [[newValue]];

    console.log(`Encoding setMinipoolProcessingEnabled with newValue: ${newValue}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setTargetStakeRatio", "Encodes the setTargetStakeRatio(uint256) function call")
  .addParam("targetStakeRatio", "The new target stake ratio (uint256)", undefined, types.string)
  .setAction(async ({ targetStakeRatio }, hre) => {
    const sigs = ["setTargetStakeRatio(uint256)"];
    const params = [[targetStakeRatio]];

    console.log(`Encoding setTargetStakeRatio with targetStakeRatio: ${targetStakeRatio}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setMinimumStakeRatio", "Encodes the setMinimumStakeRatio(uint256) function call")
  .addParam("minimumStakeRatio", "The new minimum stake ratio (uint256)", undefined, types.string)
  .setAction(async ({ minimumStakeRatio }, hre) => {
    const sigs = ["setMinimumStakeRatio(uint256)"];
    const params = [[minimumStakeRatio]];

    console.log(`Encoding setMinimumStakeRatio with minimumStakeRatio: ${minimumStakeRatio}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

// SuperNodeAccount tasks
task("setDepositsEnabledSuperNodeAccount", "Encodes the setDepositsEnabled(bool) function call")
  .addParam("newValue", "Enable or disable deposits (bool)", undefined, types.boolean)
  .setAction(async ({ newValue }, hre) => {
    const sigs = ["setDepositsEnabled(bool)"];
    const params = [[newValue]];

    console.log(`Encoding setDepositsEnabled with newValue: ${newValue}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setMaxValidators", "Encodes the setMaxValidators(uint256) function call")
  .addParam("maxValidators", "The new maximum number of validators (uint256)", undefined, types.string)
  .setAction(async ({ maxValidators }, hre) => {
    const sigs = ["setMaxValidators(uint256)"];
    const params = [[maxValidators]];

    console.log(`Encoding setMaxValidators with maxValidators: ${maxValidators}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setSmoothingPoolParticipation", "Encodes the setSmoothingPoolParticipation(bool) function call")
  .addParam("useSmoothingPool", "Enable or disable smoothing pool participation (bool)", undefined, types.boolean)
  .setAction(async ({ useSmoothingPool }, hre) => {
    const sigs = ["setSmoothingPoolParticipation(bool)"];
    const params = [[useSmoothingPool]];

    console.log(`Encoding setSmoothingPoolParticipation with useSmoothingPool: ${useSmoothingPool}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setAllowSubNodeOpDelegateChanges", "Encodes the setAllowSubNodeOpDelegateChanges(bool) function call")
  .addParam("newValue", "Allow or disallow sub-node operator delegate changes (bool)", undefined, types.boolean)
  .setAction(async ({ newValue }, hre) => {
    const sigs = ["setAllowSubNodeOpDelegateChanges(bool)"];
    const params = [[newValue]];

    console.log(`Encoding setAllowSubNodeOpDelegateChanges with newValue: ${newValue}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setAdminServerCheck", "Encodes the setAdminServerCheck(bool) function call")
  .addParam("newValue", "Enable or disable admin server check (bool)", undefined, types.boolean)
  .setAction(async ({ newValue }, hre) => {
    const sigs = ["setAdminServerCheck(bool)"];
    const params = [[newValue]];

    console.log(`Encoding setAdminServerCheck with newValue: ${newValue}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setBond", "Encodes the setBond(uint256) function call")
  .addParam("newBond", "The new bond amount (uint256)", undefined, types.string)
  .setAction(async ({ newBond }, hre) => {
    const sigs = ["setBond(uint256)"];
    const params = [[newBond]];

    console.log(`Encoding setBond with newBond: ${newBond}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("setMinimumNodeFee", "Encodes the setMinimumNodeFee(uint256) function call")
  .addParam("newMinimumNodeFee", "The new minimum node fee (uint256)", undefined, types.string)
  .setAction(async ({ newMinimumNodeFee }, hre) => {
    const sigs = ["setMinimumNodeFee(uint256)"];
    const params = [[newMinimumNodeFee]];

    console.log(`Encoding setMinimumNodeFee with newMinimumNodeFee: ${newMinimumNodeFee}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

// WETHVault tasks
task("setDepositsEnabledWETHVault", "Encodes the setDepositsEnabled(bool) function call")
  .addParam("newValue", "Enable or disable deposits (bool)", undefined, types.boolean)
  .setAction(async ({ newValue }, hre) => {
    const sigs = ["setDepositsEnabled(bool)"];
    const params = [[newValue]];

    console.log(`Encoding setDepositsEnabled with newValue: ${newValue}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

// Whitelist tasks
task("invalidateAllOutstandingSigs", "Encodes the invalidateAllOutstandingSigs() function call")
  .setAction(async (_, hre) => {
    const sigs = ["invalidateAllOutstandingSigs()"];
    const params = [[]];

    console.log(`Encoding invalidateAllOutstandingSigs()`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task("invalidateSingleOutstandingSig", "Encodes the invalidateSingleOutstandingSig(address) function call")
  .addParam("nodeOperator", "The address of the node operator (address)", undefined, types.string)
  .setAction(async ({ nodeOperator }, hre) => {
    const sigs = ["invalidateSingleOutstandingSig(address)"];
    const params = [[nodeOperator]];

    console.log(`Encoding invalidateSingleOutstandingSig with nodeOperator: ${nodeOperator}`);
    await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });
