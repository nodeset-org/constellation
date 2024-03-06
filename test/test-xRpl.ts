import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("xRPL", function () {

  it("success - test initial values", async () => {
    const setupData = await protocolFixture();
    const { protocol, signers, rocketPool } = setupData;

    const name = await protocol.vCRPL.name()
    const symbol = await protocol.vCRPL.symbol();

    expect(name).equals("Constellation RPL");
    expect(symbol).equals("xRPL");
    expect(await protocol.vCRPL.collateralizationRatioBasePoint()).equals(ethers.utils.parseUnits("0.02", 5))
    expect(await protocol.vCRPL.wethCoverageRatio()).equals(ethers.utils.parseUnits("1.75", 5))
    expect(await protocol.vCRPL.enforceWethCoverageRatio()).equals(true)

  })

  it("fail - tries to deposit as 'bad actor' involved in AML", async () => {
    
  })
});