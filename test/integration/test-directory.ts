import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData, Protocol, RocketPool } from "./integration";

describe("Directory", function () {

  it("Treasurer is not admin, deployer, or treasury", async function () {
    const { protocol, signers } = await loadFixture(protocolFixture);
    expect(signers.treasurer.address).does.not.equal(signers.deployer.address);
    expect(signers.treasurer.address).does.not.equal(signers.admin.address);
    expect(signers.treasurer.address).does.not.equal(protocol.directory.getTreasuryAddress());
  });

});