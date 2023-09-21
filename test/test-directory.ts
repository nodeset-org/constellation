import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData, Protocol, RocketPool } from "./test";

describe("Directory", function () {

  it("Returns correct default treasury address", async function () {
    const { protocol, signers } = await protocolFixture();
    expect(await protocol.directory.getTreasuryAddress()).equal(signers.admin.address);
  });

});