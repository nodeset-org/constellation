import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData, Protocol, deployOnlyFixture, ExternalDependencies } from "./test";

export async function initializeDirectory(protocol: Protocol, externDeps: ExternalDependencies, addressToUse: SignerWithAddress): Promise<any> {
  return await protocol.directory.connect(addressToUse).initialize(
    {
      whitelist: protocol.whitelist.address,
      wethVault: protocol.vCWETH.address,
      rplVault: protocol.vCRPL.address,
      depositPool: protocol.depositPool.address,
      operatorDistributor: protocol.operatorDistributor.address,
      yieldDistributor: protocol.yieldDistributor.address,
      rethOracle: protocol.rETHOracle.address,
    },
    {
      rocketStorage: externDeps.rocketStorage.address,
      rocketNodeManager: externDeps.rocketNodeManager.address,
      rocketNodeStaking: externDeps.rocketNodeStaking.address,
      rplToken: externDeps.rplToken.address,
      wethToken: externDeps.wethToken.address,
    });
}

describe("Directory", function () {

  it("Can be initialized by admin", async function () {
    const { protocol, signers, externDeps } = await loadFixture(deployOnlyFixture);
    await expect(initializeDirectory(protocol, externDeps, signers.admin)).to.not.be.reverted;
    expect(await protocol.directory.getIsInitialized()).equals(true);
  });

  it("Cannot be initialized by random address", async function () {
    const { protocol, signers, externDeps } = await loadFixture(deployOnlyFixture);
    await expect(initializeDirectory(protocol, externDeps, signers.random))
      .to.be.revertedWith("");
  });

  it("Can only be initialized once by admin", async function () {
    const { protocol, signers, externDeps } = await loadFixture(protocolFixture);

    await expect(initializeDirectory(protocol, externDeps, signers.admin)).to.be.revertedWith("");
  });

  it("Returns correct admin address", async function () {
    const { protocol, signers } = await loadFixture(protocolFixture);
    expect(await protocol.directory.getAdminAddress()).equal(signers.admin.address);
  });

});