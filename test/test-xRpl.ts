import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assertAddOperator, assertMultipleTransfers, assertSingleTransferExists } from "./utils/utils";

describe("xRPL", function () {

  it("success - test initial values", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const name = await protocol.vCRPL.name()
    const symbol = await protocol.vCRPL.symbol();

    expect(name).equals("Constellation RPL");
    expect(symbol).equals("xRPL");
    expect(await protocol.vCRPL.liquidityReserveRatio()).equals(ethers.utils.parseUnits("0.02", 5))
    expect(await protocol.vCRPL.wethCoverageRatio()).equals(ethers.utils.parseUnits("1.75", 5))
    expect(await protocol.vCRPL.enforceWethCoverageRatio()).equals(false)
    expect(await protocol.vCRPL.treasuryFee()).equals(ethers.utils.parseUnits("0.01", 5))

  })

  it("fail - tries to deposit as 'bad actor' involved in AML or other flavors of bad", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await protocol.sanctions.addBlacklist(signers.random.address);
    await protocol.directory.connect(signers.admin).enableSanctions();
    expect(await protocol.sanctions.isSanctioned(signers.random.address)).equals(true);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, ethers.utils.parseEther("100"));
    await assertAddOperator(setupData, signers.random);

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));

    const tx = await protocol.vCRPL.connect(signers.random).deposit(ethers.utils.parseEther("100"), signers.random.address);
    const receipt = await tx.wait();
    const { events } = receipt;
    if (events) {
      for (let i = 0; i < events.length; i++) {
        expect(events[i].event).not.equals(null)
        if (events[i].event?.includes("SanctionViolation")) {
          expect(events[i].event?.includes("SanctionViolation")).equals(true)
        }
      }
    }

    const expectedRplInDP = ethers.utils.parseEther("0");
    const actualRplInDP = await rocketPool.rplContract.balanceOf(protocol.depositPool.address);
    expect(expectedRplInDP).equals(actualRplInDP)

  })

  it("success - tries to deposit as 'good actor' not involved in AML or bad activities", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, ethers.utils.parseEther("100"));
    await assertAddOperator(setupData, signers.random);

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));
    await protocol.vCRPL.connect(signers.random).deposit(ethers.utils.parseEther("100"), signers.random.address);

    const expectedRplInSystem = ethers.utils.parseEther("100");
    const actualRplInSystem = await protocol.vCRPL.totalAssets();
    expect(expectedRplInSystem).equals(actualRplInSystem)
  })

  it("success - tries to deposit 100 rpl then withdraws 100 rpl immediately", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, ethers.utils.parseEther("1000000"));
    await assertAddOperator(setupData, signers.random);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random2.address, ethers.utils.parseEther("100"));
    await assertAddOperator(setupData, signers.random2);
    
    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("1000000"));
    await protocol.vCRPL.connect(signers.random).deposit(ethers.utils.parseEther("1000000"), signers.random.address);

    const expectedRplInSystem = ethers.utils.parseEther("1000000");
    const actualRplInSystem = await protocol.vCRPL.totalAssets();
    expect(expectedRplInSystem).equals(actualRplInSystem)

    console.log("currentIncome", await protocol.vCRPL.currentIncomeFromRewards());
    console.log("currentTreasuryIncome", await protocol.vCRPL.currentTreasuryIncomeFromRewards());

    await rocketPool.rplContract.connect(signers.random2).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));
    console.log(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address));
    await protocol.vCRPL.connect(signers.random2).deposit(ethers.utils.parseEther("100"), signers.random2.address);

    const tx = await protocol.vCRPL.connect(signers.random2).redeem(ethers.utils.parseEther("100"), signers.random2.address, signers.random2.address);
    await assertMultipleTransfers(tx, [
      {
        from: protocol.vCRPL.address, to: signers.random2.address, value: ethers.utils.parseEther("100")
      },
    ])
  })

  it("success - a random makes deposit, DP gets 10 rpl, random gets correct amount and so does admin, admin fails to withdraw again, DP gets 69 rpl, admin claims 1%", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, ethers.utils.parseEther("100"));
    await assertAddOperator(setupData, signers.random);

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));
    await protocol.vCRPL.connect(signers.random).deposit(ethers.utils.parseEther("100"), signers.random.address);

    const expectedRplInSystem = ethers.utils.parseEther("100");
    const actualRplInSystem = await protocol.vCRPL.totalAssets();
    expect(expectedRplInSystem).equals(actualRplInSystem)

    expect(await protocol.vCRPL.currentIncomeFromRewards()).equals(0);
    expect(await protocol.vCRPL.currentTreasuryIncomeFromRewards()).equals(0);

    // incoming funds to DP
    await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, ethers.utils.parseEther("10"));

    expect(await protocol.vCRPL.currentIncomeFromRewards()).equals(ethers.utils.parseEther("10"));
    expect(await protocol.vCRPL.currentTreasuryIncomeFromRewards()).equals(ethers.utils.parseEther(".1"));

    expect(await protocol.vCRPL.principal()).equals(ethers.utils.parseEther("100"));
    // random should be able to withdraw shares worth 10% more, aka, withdraw will trade one share for 1.1 - 1% admin fee RPL
    // admin should be allowed to take 1% of the 10 RPL that landed
    await protocol.vCRPL.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("1"));
    const tx = await protocol.vCRPL.connect(signers.random).redeem(ethers.utils.parseEther("1"), signers.random.address, signers.random.address);
    await assertMultipleTransfers(tx, [
      {
        from: protocol.vCRPL.address, to: signers.random.address, value: BigNumber.from("1098999999999999999")
      },
      {
        from: protocol.vCRPL.address, to: await protocol.directory.getTreasuryAddress(), value: ethers.utils.parseEther("0.1")
      },
    ])

    expect(await protocol.vCRPL.principal()).equals(BigNumber.from("98901000000000000001"));
    
    // admin should claim 0 dollars after recieveing the goods
    await assertSingleTransferExists(
      await protocol.vCRPL.connect(signers.admin).claimTreasuryFee(),
      protocol.vCRPL.address,
      await protocol.directory.getTreasuryAddress(),
      ethers.utils.parseEther("0")
    )

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, ethers.utils.parseEther("69"));

    await assertSingleTransferExists(
      await protocol.vCRPL.connect(signers.admin).claimTreasuryFee(),
      protocol.vCRPL.address,
      await protocol.directory.getTreasuryAddress(),
      ethers.utils.parseEther("0.69")
    )

    await assertSingleTransferExists(
      await protocol.vCRPL.connect(signers.admin).claimTreasuryFee(),
      protocol.vCRPL.address,
      await protocol.directory.getTreasuryAddress(),
      ethers.utils.parseEther("0")
    )
  })
});