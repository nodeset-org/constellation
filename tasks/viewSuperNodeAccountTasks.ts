import { task } from "hardhat/config";

task("viewSuperNodeAccount", "Displays all public variables of the SuperNodeAccount contract")
  .addParam("address", "The address of the SuperNodeAccount contract")
  .setAction(async ({ address }, hre) => {
    const superNode = await hre.ethers.getContractAt("SuperNodeAccount", address);

    console.log("SuperNodeAccount")

    // Retrieving and printing public variables
    // const lockedEth = await superNode.lockedEth();
    // console.log("Locked ETH:", lockedEth.toString());

    // const lockStarted = await superNode.lockStarted();
    // console.log("Lock Started:", lockStarted.toString());

    // const subNodeOperatorHasMinipool = await superNode.subNodeOperatorHasMinipool();
    // console.log("Sub-Node Operator Has Minipool:", subNodeOperatorHasMinipool);

    const totalEthLocked = await superNode.totalEthLocked();
    console.log("Total ETH Locked:", totalEthLocked.toString());

    const totalEthStaking = await superNode.totalEthStaking();
    console.log("Total ETH Staking:", totalEthStaking.toString());

    // const adminServerCheck = await superNode.adminServerCheck();
    // console.log("Admin Server Check:", adminServerCheck);

    // const sigsUsed = await superNode.sigsUsed();
    // console.log("Sigs Used:", sigsUsed);

    const adminServerSigExpiry = await superNode.adminServerSigExpiry();
    console.log("Admin Server Sig Expiry:", adminServerSigExpiry.toString());

    const lockThreshold = await superNode.lockThreshold();
    console.log("Lock Threshold:", lockThreshold.toString());

    const lockUpTime = await superNode.lockUpTime();
    console.log("Lock-Up Time:", lockUpTime.toString());

    // const lazyInit = await superNode.lazyInit();
    // console.log("Lazy Init:", lazyInit);

    // const minipools = await superNode.minipools();
    // console.log("Minipools:", minipools);

    // const minipoolIndex = await superNode.minipoolIndex();
    // console.log("Minipool Index:", minipoolIndex);

    // const subNodeOperatorMinipools = await superNode.subNodeOperatorMinipools();
    // console.log("Sub-Node Operator Minipools:", subNodeOperatorMinipools);

    const currentMinipool = await superNode.currentMinipool();
    console.log("Current Minipool:", currentMinipool.toString());

    const bond = await superNode.bond();
    console.log("Bond:", bond.toString());

    const minimumNodeFee = await superNode.minimumNodeFee();
    console.log("Minimum Node Fee:", minimumNodeFee.toString());
  });
