import { task } from "hardhat/config";

task("viewOperatorDistributor", "Displays public variables and view functions of the OperatorDistributor contract")
  .addParam("address", "The address of the OperatorDistributor contract")
  .setAction(async ({ address }, hre) => {
    const [deployer, admin] = await hre.ethers.getSigners();
    const od = await hre.ethers.getContractAt("OperatorDistributor", address, admin);

    console.log("Operator Distributor");

    // Public variables
    const fundedEth = await od.fundedEth();
    console.log("fundedEth:", fundedEth.toString());

    const fundedRpl = await od.fundedRpl();
    console.log("fundedRpl:", fundedRpl.toString());

    const targetStakeRatio = await od.targetStakeRatio();
    console.log("targetStakeRatio:", targetStakeRatio.toString());

    const requiredLEBStaked = await od.requiredLEBStaked();
    console.log("requiredLEBStaked:", requiredLEBStaked.toString());

    const oracleError = await od.oracleError();
    console.log("oracleError:", oracleError.toString());

    const tvlEth = await od.getTvlEth();
    console.log("getTvlEth:", tvlEth.toString());

    const tvlRpl = await od.getTvlRpl();
    console.log("getTvlRpl:", tvlRpl.toString());
  });

  task("getDeployedRpl", "Displays the total value locked (ETH) in the OperatorDistributor contract")
  .addParam("address", "The address of the OperatorDistributor contract")
  .setAction(async ({ address }, hre) => {
    const od = await hre.ethers.getContractAt("OperatorDistributor", address);
    const fundedRpl = await od.fundedRpl();
    console.log("fundedRpl:", fundedRpl.toString());

    const directoryAddr = await od.getDirectory();
    const directory = await hre.ethers.getContractAt("Directory", directoryAddr);

    const rocketNodeStaking = await hre.ethers.getContractAt("RocketNodeStaking", await directory.getRocketNodeStakingAddress());
    const totalStaked = await rocketNodeStaking.getNodeRPLStake(await directory.getSuperNodeAddress());
    console.log("Total Staked by Super Node", totalStaked);
  });

task("getTvlEth", "Displays the total value locked (ETH) in the OperatorDistributor contract")
  .addParam("address", "The address of the OperatorDistributor contract")
  .setAction(async ({ address }, hre) => {
    const od = await hre.ethers.getContractAt("OperatorDistributor", address);
    const tvlEth = await od.getTvlEth();
    console.log("Total ETH Locked (getTvlEth):", tvlEth.toString());
  });

task("getTvlRpl", "Displays the total value locked (RPL) in the OperatorDistributor contract")
  .addParam("address", "The address of the OperatorDistributor contract")
  .setAction(async ({ address }, hre) => {
    const od = await hre.ethers.getContractAt("OperatorDistributor", address);
    const tvlRpl = await od.getTvlRpl();
    console.log("Total RPL Locked (getTvlRpl):", tvlRpl.toString());
  });

task("calculateRplStakeShortfall", "Calculates the RPL stake shortfall")
  .addParam("address", "The address of the OperatorDistributor contract")
  .addParam("existingRplStake", "The existing RPL stake amount")
  .addParam("ethStaked", "The amount of ETH staked")
  .setAction(async ({ address, existingRplStake, ethStaked }, hre) => {
    const od = await hre.ethers.getContractAt("OperatorDistributor", address);
    const shortfall = await od.calculateRplStakeShortfall(existingRplStake, ethStaked);
    console.log("RPL Stake Shortfall (calculateRplStakeShortfall):", shortfall.toString());
  });

task("calculateRequiredRplTopDown", "Calculates the maximum RPL that can be withdrawn while maintaining the target staking ratio")
  .addParam("address", "The address of the OperatorDistributor contract")
  .addParam("existingRplStake", "The existing RPL stake amount")
  .addParam("ethStaked", "The amount of ETH staked")
  .setAction(async ({ address, existingRplStake, ethStaked }, hre) => {
    const od = await hre.ethers.getContractAt("OperatorDistributor", address);
    const withdrawableRpl = await od.calculateRequiredRplTopDown(existingRplStake, ethStaked);
    console.log("Withdrawable RPL (calculateRequiredRplTopDown):", withdrawableRpl.toString());
  });
