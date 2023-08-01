import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData, Protocol, deployOnlyFixture, RocketPool } from "./test";

export async function initializeDirectory(protocol: Protocol, rocketPool: RocketPool, addressToUse: SignerWithAddress): Promise<any> {
  return await protocol.directory.connect(addressToUse).initialize(
    {
      whitelist: protocol.whitelist.address,
      wethVault: protocol.vCWETH.address,
      rplVault: protocol.vCRPL.address,
      depositPool: protocol.depositPool.address,
      operatorDistributor: protocol.operatorDistributor.address,
      yieldDistributor: protocol.yieldDistributor.address,
      oracle: protocol.oracle.address,
      priceFetcher: protocol.priceFetcher.address,
      rocketStorage: rocketPool.rockStorageContract.address,
      rocketNodeManager: rocketPool.rocketNodeManagerContract.address,
      rocketNodeStaking: rocketPool.rocketNodeStakingContract.address,
    });
}

describe("Directory", function () {

  it("Can be initialized by admin", async function () {
    const { protocol, signers, rocketPool } = await loadFixture(deployOnlyFixture);
    await expect(initializeDirectory(protocol, rocketPool, signers.admin)).to.not.be.reverted;
    expect(await protocol.directory.getIsInitialized()).equals(true);
  });

  it("Cannot be initialized by random address", async function () {
    const { protocol, signers, rocketPool } = await loadFixture(deployOnlyFixture);
    await expect(initializeDirectory(protocol, rocketPool, signers.random))
      .to.be.revertedWith(await protocol.directory.ADMIN_ONLY_ERROR());
  });

  it("Can only be initialized once by admin", async function () {
    const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

    await expect(initializeDirectory(protocol, rocketPool, signers.admin)).to.be.revertedWith(await protocol.directory.INITIALIZATION_ERROR());
  });

  it("Returns correct admin address", async function () {
    const { protocol, signers } = await loadFixture(protocolFixture);
    expect(await protocol.directory.getAdminAddress()).equal(signers.admin.address);
  });

});