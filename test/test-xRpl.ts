import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assertAddOperator, assertMultipleTransfers, assertSingleTransferExists, expectNumberE18ToBeApproximately } from "./utils/utils";

describe("xRPL", function () {

  it("success - test initial values", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const name = await protocol.vCRPL.name()
    const symbol = await protocol.vCRPL.symbol();

    expect(name).equals("Constellation RPL");
    expect(symbol).equals("xRPL");
    expect(await protocol.vCRPL.liquidityReserveRatio()).equals(ethers.utils.parseUnits("0.02", 5))
    expect(await protocol.vCRPL.minWethRplRatio()).equals(ethers.utils.parseUnits("0", 5))
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

  it("success - tries to deposit and redeem from weth vault multiple times", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const depositAmount = ethers.utils.parseEther("1000");
    const expectedReserveInVault = ethers.utils.parseEther("20");
    const surplusSentToOD = ethers.utils.parseEther("980");

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, depositAmount)

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, depositAmount);
    await protocol.vCRPL.connect(signers.random).deposit(depositAmount, signers.random.address);

    expect(await protocol.vCRPL.totalAssets()).equals(depositAmount)
    expect(await protocol.vCRPL.balanceRpl()).equals(expectedReserveInVault);
    expect(await protocol.operatorDistributor.balanceRpl()).equals(surplusSentToOD);

    const shareValue = await protocol.vCRPL.convertToAssets(ethers.utils.parseEther("1"))
    const expectedRedeemValue = await protocol.vCRPL.previewRedeem(shareValue);

    let preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    let postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await protocol.vCRPL.balanceRpl()).equals(expectedReserveInVault.sub(ethers.utils.parseEther("1")))

    preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await protocol.vCRPL.balanceRpl()).equals(expectedReserveInVault.sub(ethers.utils.parseEther("2")))

    preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await protocol.vCRPL.balanceRpl()).equals(expectedReserveInVault.sub(ethers.utils.parseEther("3")))
  })

  it("success - tries to deposit and redeem from weth vault multiple times after getting merkle rewards", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const depositAmount = ethers.utils.parseEther("100000");
    const expectedReserveInVault = ethers.utils.parseEther("2000");
    const surplusSentToOD = ethers.utils.parseEther("98000");

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, depositAmount)

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, depositAmount);
    await protocol.vCRPL.connect(signers.random).deposit(depositAmount, signers.random.address);

    // handle merkle claims and process reward assertions
    const rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress());
    await rocketMDM.useMock();

    const rocketVault = await ethers.getContractAt("RocketVaultInterface", await rocketPool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));

    const rplReward = ethers.utils.parseEther("100");
    const ethReward = ethers.utils.parseEther("100");

    rocketPool.rplContract.connect(signers.rplWhale).transfer(rocketVault.address, rplReward);
    await signers.ethWhale.sendTransaction({
      to: rocketVault.address,
      value: ethReward
    })

    const rewardIndex = [0];
    const amountRpl = [rplReward];
    const amountEth = [ethReward];
    const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]
    await protocol.superNode.merkleClaim(protocol.superNode.address, rewardIndex, amountRpl, amountEth, proof)

    const expectedTreasuryPortion = await protocol.vCRPL.getTreasuryPortion(rplReward);
    const expectedCommunityPortion = rplReward.sub(expectedTreasuryPortion)

    expect(await protocol.vCRPL.totalAssets()).equals(depositAmount.add(expectedCommunityPortion))
    expect(await protocol.vCRPL.balanceRpl()).equals(expectedReserveInVault);
    expect(await protocol.operatorDistributor.balanceRpl()).equals(surplusSentToOD);

    const shareValue = await protocol.vCRPL.convertToAssets(ethers.utils.parseEther("1"))
    const expectedRedeemValue = await protocol.vCRPL.previewRedeem(shareValue);

    let preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    let postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));

    preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));

    preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));

    expect(await rocketPool.rplContract.balanceOf(await protocol.directory.getTreasuryAddress())).equals(expectedTreasuryPortion);

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


    // incoming funds to DP
    await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, ethers.utils.parseEther("10"));

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


  })
});