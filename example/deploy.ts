import { ethers } from "hardhat";

async function main() {


  const lockedAmount = ethers.utils.parseEther("1");

  const Base = await ethers.getContractFactory("Base");
  const Depositor = await ethers.getContractFactory("Base");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();

  console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
