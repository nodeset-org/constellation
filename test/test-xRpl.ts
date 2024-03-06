import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("xRPL", function () {

  it("success - test initial values", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const name = await protocol.vCRPL.name()
    const symbol = await protocol.vCRPL.symbol();

    expect(name).equals("Constellation RPL");
    expect(symbol).equals("xRPL");
    expect(await protocol.vCRPL.collateralizationRatioBasePoint()).equals(ethers.utils.parseUnits("0.02", 5))
    expect(await protocol.vCRPL.wethCoverageRatio()).equals(ethers.utils.parseUnits("1.75", 5))
    expect(await protocol.vCRPL.enforceWethCoverageRatio()).equals(true)

  })

  it("fail - tries to deposit as 'bad actor' involved in AML or other flavors of bad", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await protocol.sanctions.addBlacklist(signers.random.address);
    await protocol.directory.connect(signers.admin).enableSanctions();
    expect(await protocol.sanctions.isSanctioned(signers.random.address)).equals(true);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, ethers.utils.parseEther("100"));
    await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address);

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));
    await expect(protocol.vCRPL.connect(signers.random).deposit(ethers.utils.parseEther("100"), signers.random.address)).to.be.revertedWith("");
    
    const expectedRplInDP = ethers.utils.parseEther("0");
    const actualRplInDP = await rocketPool.rplContract.balanceOf(protocol.depositPool.address);
    expect(expectedRplInDP).equals(actualRplInDP)

  })

  it("success - tries to deposit as 'good actor' not involved in AML or bad activities", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, ethers.utils.parseEther("100"));
    await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address);

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));
    await protocol.vCRPL.connect(signers.random).deposit(ethers.utils.parseEther("100"), signers.random.address);
    
    const expectedRplInDP = ethers.utils.parseEther("100");
    const actualRplInDP = await rocketPool.rplContract.balanceOf(protocol.depositPool.address);
    expect(expectedRplInDP).equals(actualRplInDP)

  })
});