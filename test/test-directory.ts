import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData, Protocol, deployOnlyFixture } from "./test";

export async function initializeDirectory(protocol: Protocol, addressToUse: SignerWithAddress): Promise<any> {
  return await protocol.directory.connect(addressToUse).initialize(
    {
      whitelist: protocol.whitelist.address,
      ethToken: protocol.xrETH.address,
      rplToken: protocol.xRPL.address,
      depositPool: protocol.depositPool.address,
      operatorDistributor: protocol.operatorDistributor.address,
      yieldDistributor: protocol.yieldDistributor.address
    });
}

describe("Directory", function () {

  it("Can be initialized by admin", async function () {
    const { protocol, signers } = await loadFixture(deployOnlyFixture);
    await expect(initializeDirectory(protocol, signers.admin)).to.not.be.reverted;
    expect(await protocol.directory.getIsInitialized()).equals(true);
  });

  it("Cannot be initialized by random address", async function () {
    const { protocol, signers } = await loadFixture(deployOnlyFixture);
    await expect(initializeDirectory(protocol, signers.random))
      .to.be.revertedWith(await protocol.directory.ADMIN_ONLY_ERROR());
  });

  it("Can only be initialized once by admin", async function () {
    const { protocol, signers } = await loadFixture(protocolFixture);

    await expect(initializeDirectory(protocol, signers.admin))
      .to.be.revertedWith(await protocol.directory.INITIALIZATION_ERROR());
  });

  it("Returns correct admin address", async function () {
    const { protocol, signers } = await loadFixture(protocolFixture);
    expect(await protocol.directory.getAdminAddress()).equal(signers.admin.address);
  });

  it("Can be paused by admin", async function () {
    const { protocol, signers } = await loadFixture(protocolFixture);
    await expect(protocol.directory.connect(signers.admin).emergencyPause())
      .to.not.be.reverted;
    expect(await protocol.directory.paused()).equals(true);
  });

  it("Cannot be paused by random address", async function () {
    const { protocol, signers } = await loadFixture(protocolFixture);
    await expect(protocol.directory.connect(signers.random).emergencyPause())
      .to.be.revertedWith(await protocol.directory.ADMIN_ONLY_ERROR());
  });

});