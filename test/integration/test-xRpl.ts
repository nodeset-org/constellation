import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./integration";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assertAddOperator, assertMultipleTransfers } from "../utils/utils";
import { deposit } from "../rocketpool/deposit/scenario-deposit";

describe("xRPL", function () {

  it("success - test initial values", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const name = await protocol.vCRPL.name()
    const symbol = await protocol.vCRPL.symbol();

    expect(name).equals("Constellation RPL");
    expect(symbol).equals("xRPL");
    expect(await protocol.vCRPL.liquidityReservePercent()).equals(ethers.utils.parseUnits("0.02", 18))
    expect(await protocol.vCRPL.minWethRplRatio()).equals(ethers.utils.parseUnits("0", 18))
    expect(await protocol.vCRPL.treasuryFee()).equals(ethers.utils.parseUnits("0.01", 18))
    expect(await protocol.vCRPL.depositsEnabled()).equals(true);
  })

  it("success - admin can enable or disable deposits", async () => {
    const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

    expect(await protocol.vCRPL.depositsEnabled()).equals(true);

    await expect(protocol.vCRPL.connect(signers.admin).setDepositsEnabled(true)).to.not.be.reverted;
    let depositAmount =  ethers.utils.parseEther("1");
    await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, depositAmount);
    await expect(protocol.vCRPL.connect(signers.rplWhale).deposit(depositAmount, signers.rplWhale.address)).to.not.be.reverted;

    await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, depositAmount);
    await expect(protocol.vCRPL.connect(signers.admin).setDepositsEnabled(false)).to.not.be.reverted;
    await expect(protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("1"), signers.rplWhale.address)).to.be.revertedWith("deposits are disabled");

    await expect(protocol.vCRPL.connect(signers.admin).setDepositsEnabled(true)).to.not.be.reverted;
    await expect(protocol.vCRPL.connect(signers.admin).setDepositsEnabled(true)).to.not.be.reverted;
    await expect(protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("1"), signers.rplWhale.address)).to.not.be.reverted;

    await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, depositAmount);
    await expect(protocol.vCRPL.connect(signers.admin).setDepositsEnabled(false)).to.not.be.reverted;
    await expect(protocol.vCRPL.connect(signers.admin).setDepositsEnabled(false)).to.not.be.reverted;
    await expect(protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("1"), signers.rplWhale.address)).to.be.revertedWith("deposits are disabled");
  });

  it("fail - non-admin cannot set deposits enabled", async () => {
    const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

    expect(await protocol.vCWETH.depositsEnabled()).equals(true);

    let depositAmount =  ethers.utils.parseEther("1");
    await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, depositAmount);
    await expect(protocol.vCRPL.connect(signers.random).setDepositsEnabled(false)).to.be.revertedWith("Can only be called by admin address!");
    await expect(protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("1"), signers.rplWhale.address)).to.not.be.reverted;
  });

  it("deposits and gets appropriate xRPL in return", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, ethers.utils.parseEther("1"));

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("1"));
    await protocol.vCRPL.connect(signers.random).deposit(ethers.utils.parseEther("1"), signers.random.address);
    expect(await protocol.vCRPL.balanceOf(signers.random.address)).equals(ethers.utils.parseEther("1"));
  })

  it("fail - tries to deposit as 'bad actor' involved in AML or other flavors of bad", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await protocol.sanctions.addBlacklist(signers.random.address);
    expect(await protocol.directory.getSanctionsEnabled()).equals(true);
    expect(await protocol.sanctions.isSanctioned(signers.random.address)).equals(true);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, ethers.utils.parseEther("100"));
    await assertAddOperator(setupData, signers.random);

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));

    await expect(protocol.vCRPL.connect(signers.random).deposit(ethers.utils.parseEther("100"), signers.random.address)).to.be.revertedWith("RPLVault: cannot deposit from or to a sanctioned address");
    const expectedRplInDP = ethers.utils.parseEther("0");
    const actualRplInDP = await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address);
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

  it("success - tries to deposit 100, then 1000000 rpl, then withdraws 100 rpl immediately", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const deposit = ethers.utils.parseEther("1000000");

    expect(await protocol.vCRPL.minWethRplRatio()).equals(BigNumber.from(0));
    await protocol.vCWETH.connect(signers.admin).setMaxWethRplRatio(ethers.constants.MaxUint256);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, deposit);
    await assertAddOperator(setupData, signers.random);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random2.address, ethers.utils.parseEther("100"));
    await assertAddOperator(setupData, signers.random2);

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, deposit);
    await protocol.vCRPL.connect(signers.random).deposit(deposit, signers.random.address);

    const expectedRplInSystem = deposit;
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

  it("success - tries to deposit and redeem from rpl vault multiple times", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const depositAmount = ethers.utils.parseEther("1000");
    const expectedReserveInVault = ethers.utils.parseEther("20");
    const surplusSentToOD = ethers.utils.parseEther("980");

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, depositAmount)

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, depositAmount);
    await protocol.vCRPL.connect(signers.random).deposit(depositAmount, signers.random.address);

    expect(await protocol.vCRPL.totalAssets()).equals(depositAmount)
    expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).equals(expectedReserveInVault);
    expect(await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)).equals(surplusSentToOD);

    const shareValue = await protocol.vCRPL.convertToAssets(ethers.utils.parseEther("1"))
    const expectedRedeemValue = await protocol.vCRPL.previewRedeem(shareValue);

    let preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    let postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).equals(
      (await protocol.vCRPL.totalAssets())
      .mul(await protocol.vCRPL.liquidityReservePercent())
      .div(ethers.utils.parseEther("1"))
    );

    preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).equals(
      (await protocol.vCRPL.totalAssets())
      .mul(await protocol.vCRPL.liquidityReservePercent())
      .div(ethers.utils.parseEther("1"))
    );

    preBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    await protocol.vCRPL.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await rocketPool.rplContract.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).equals(
      (await protocol.vCRPL.totalAssets())
      .mul(await protocol.vCRPL.liquidityReservePercent())
      .div(ethers.utils.parseEther("1"))
    );
  })

  it("success - tries to deposit and redeem from rpl vault multiple times after getting merkle rewards", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const depositAmount = ethers.utils.parseEther("100000");

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, depositAmount)

    await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, depositAmount);
    await protocol.vCRPL.connect(signers.random).deposit(depositAmount, signers.random.address);

    // handle merkle claims and process reward assertions
    const rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress());
    await rocketMDM.useMock();

    const rocketVault = await ethers.getContractAt("RocketVault", await rocketPool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));
    rocketVault.useMock();

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

    const rplTreasuryFee = await setupData.protocol.vCRPL.treasuryFee();
    const expectedTreasuryPortion = rplReward.mul(rplTreasuryFee).div(ethers.utils.parseEther("1"));
    const expectedCommunityPortion = rplReward.sub(expectedTreasuryPortion)

    expect(await protocol.vCRPL.totalAssets()).equals(depositAmount);
    //disable auto-mine of new blocks
    await ethers.provider.send("evm_setAutomine", [false]);

    await protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, amountRpl, amountEth, proof);
    expect(await protocol.vCRPL.totalAssets()).equals(depositAmount); // no time has passed, so no tvl has been streamed

    const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval()

    // mine a block with above transactions
    let timestamp = (await ethers.provider.getBlock("latest")).timestamp;
    await ethers.provider.send("evm_mine", [timestamp+1]);
    timestamp = timestamp+1;

    expect(streamingInterval).equals(2419200); // 28 days in seconds
    const expectedReserveInVault = depositAmount.mul(await setupData.protocol.vCRPL.liquidityReservePercent()).div(ethers.utils.parseEther("1"));
    const surplusSentToOD = depositAmount.sub(expectedReserveInVault);

    expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).equals(expectedReserveInVault);
    expect(await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)).equals(surplusSentToOD);

    // increase time by 1 day since claim
    await ethers.provider.send("evm_mine", [timestamp+86400]); // 1 day in seconds
    let lastClaimTime = await protocol.merkleClaimStreamer.lastClaimTime();
    console.log("lastClaimTime", lastClaimTime);
    expect(lastClaimTime).equals((await ethers.provider.getBlock('latest')).timestamp - 86400);
    let expectedStreamedTVL = expectedCommunityPortion.div(28);
    let expectedTotalAssets = depositAmount.add(expectedStreamedTVL);
    expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(expectedCommunityPortion);
    expect(await protocol.merkleClaimStreamer.getStreamedTvlRpl()).equals(expectedStreamedTVL);
    expect(await protocol.vCRPL.totalAssets()).equals(expectedTotalAssets);

    // increase time to 3 days since claim
    await ethers.provider.send("evm_mine", [timestamp+259200]); // 3 days in seconds
    expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals((await ethers.provider.getBlock('latest')).timestamp - 259200);
    expectedStreamedTVL = expectedCommunityPortion.mul(3).div(28); // we should be 3/28ths streamed at this point
    expectedTotalAssets = depositAmount.add(expectedStreamedTVL);
    expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(expectedCommunityPortion);
    expect(await protocol.merkleClaimStreamer.getStreamedTvlRpl()).equals(expectedStreamedTVL);
    expect(await protocol.vCRPL.totalAssets()).equals(expectedTotalAssets);


    // increase time by 25 days, total is 28 days since claim
    await ethers.provider.send("evm_mine", [timestamp+2419200]); // 28 days in seconds
    expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals((await ethers.provider.getBlock('latest')).timestamp - 2419200);
    expectedStreamedTVL = expectedCommunityPortion; // we should be fully streamed at this point
    expectedTotalAssets = depositAmount.add(expectedStreamedTVL);
    expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(expectedCommunityPortion);
    expect(await protocol.merkleClaimStreamer.getStreamedTvlRpl()).equals(expectedStreamedTVL);
    expect(await protocol.vCRPL.totalAssets()).equals(expectedTotalAssets);

    // re-enable automine
    await ethers.provider.send("evm_setAutomine", [true]);

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
});