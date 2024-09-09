import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./integration";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { wEth } from "../../typechain-types/factories/contracts/Testing";

describe("xrETH", function () {

  it("success - test initial xrETH values", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const name = await protocol.vCWETH.name()
    const symbol = await protocol.vCWETH.symbol();

    expect(name).equals("Constellation ETH");
    expect(symbol).equals("xrETH");
    expect(await protocol.vCWETH.liquidityReservePercent()).equals(ethers.utils.parseUnits("0.1", 18))
    expect(await protocol.vCWETH.maxWethRplRatio()).equals(ethers.utils.parseUnits("4", 18))
    expect(await protocol.vCWETH.treasuryFee()).equals(ethers.utils.parseUnits("0.14788", 18))
    expect(await protocol.vCWETH.nodeOperatorFee()).equals(ethers.utils.parseUnits("0.14788", 18))
  })

  it("fail - tries to deposit weth as 'bad actor' involved in AML or other flavors of bad", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await protocol.sanctions.addBlacklist(signers.ethWhale.address);
    expect(await protocol.directory.getSanctionsEnabled()).equals(true);
    expect(await protocol.sanctions.isSanctioned(signers.ethWhale.address)).equals(true);

    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
    const tx = await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);
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

    const expectedxrETHInSystem = ethers.utils.parseEther("0");
    const actualxrETHInSystem = await protocol.vCWETH.totalAssets();
    expect(expectedxrETHInSystem).equals(actualxrETHInSystem)
  })

  it("success - tries to deposit weth as 'good actor' not involved in AML or other flavors of bad", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const {sig} = await whitelistUserServerSig(setupData, signers.ethWhale);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, ethers.utils.parseEther("100"));
    await protocol.whitelist.connect(signers.admin).addOperator(signers.ethWhale.address, sig);

    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
    console.log('total assets before deposit', await protocol.vCWETH.totalAssets());
    await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);
    console.log('total assets after deposit', await protocol.vCWETH.totalAssets());
    const expectedxrETHInSystem = ethers.utils.parseEther("100").sub(await protocol.vCWETH.getMintFeePortion(ethers.utils.parseEther("100")));
    const actualxrETHInSystem = await protocol.vCWETH.totalAssets();
    console.log('actualxrETHInSystem', actualxrETHInSystem.toString());
    expect(expectedxrETHInSystem).equals(actualxrETHInSystem)
  })

  it("success - tries to deposit once, then redeem from weth vault multiple times", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const depositAmount = await protocol.vCWETH.previewMint(ethers.utils.parseEther("100"));
    const depositAfterFee = depositAmount.sub(await protocol.vCWETH.getMintFeePortion(depositAmount));
    const expectedReserveInVault = (await protocol.vCWETH.getMissingLiquidityAfterDeposit(depositAmount));
    const surplusSentToOD = depositAfterFee.sub(expectedReserveInVault);

    await protocol.wETH.connect(signers.random).deposit({ value: depositAmount });
    await protocol.wETH.connect(signers.random).approve(protocol.vCWETH.address, depositAmount);
    await protocol.vCWETH.connect(signers.random).deposit(depositAmount, signers.random.address);

    expect(await protocol.vCWETH.totalAssets()).equals(depositAfterFee)

    expect(await protocol.wETH.balanceOf(protocol.vCWETH.address)).equals(expectedReserveInVault);
    expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(surplusSentToOD);

    const shareValue = await protocol.vCWETH.convertToAssets(ethers.utils.parseEther("1"))
    const expectedRedeemValue = await protocol.vCWETH.previewRedeem(shareValue);

    let preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    let postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    let expectedTotalAssets = depositAfterFee.sub(expectedRedeemValue);
    expect(await protocol.vCWETH.totalAssets()).equals(expectedTotalAssets);
    expect(await protocol.wETH.balanceOf(protocol.vCWETH.address)).equals(
      ((await protocol.vCWETH.totalAssets())
      .mul(await protocol.vCWETH.liquidityReservePercent())
      .div(ethers.utils.parseEther("1"))
    ));

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expectedTotalAssets = expectedTotalAssets.sub(expectedRedeemValue);
    expect(await protocol.vCWETH.totalAssets()).equals(expectedTotalAssets);
    expect(await protocol.wETH.balanceOf(protocol.vCWETH.address)).equals(
      (await protocol.vCWETH.totalAssets())
      .mul(await protocol.vCWETH.liquidityReservePercent())
      .div(ethers.utils.parseEther("1"))
    );

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expectedTotalAssets = expectedTotalAssets.sub(expectedRedeemValue);
    expect(await protocol.vCWETH.totalAssets()).equals(expectedTotalAssets);
    expect(await protocol.wETH.balanceOf(protocol.vCWETH.address)).equals(
      (await protocol.vCWETH.totalAssets())
      .mul(await protocol.vCWETH.liquidityReservePercent())
      .div(ethers.utils.parseEther("1"))
    );

  })

  it("success - tries to deposit and redeem from weth vault multiple times with minipool reward claims", async () => {

    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    // set the max weth rpl ratio to 10000% to allow for large ETH deposits
    await protocol.vCWETH.connect(signers.admin).setMaxWethRplRatio(ethers.utils.parseEther("100"));

    const initialDeposit = await prepareOperatorDistributionContract(setupData, 1);
		const minipools = await registerNewValidator(setupData, [signers.random]);

    const depositAmount = await protocol.vCWETH.previewMint(ethers.utils.parseEther("100"));
    const totalDeposit = initialDeposit.add(depositAmount);
    const depositAfterFee = totalDeposit
      .sub(await protocol.vCWETH.getMintFeePortion(initialDeposit))
      .sub(await protocol.vCWETH.getMintFeePortion(depositAmount));

    await protocol.wETH.connect(signers.random).deposit({ value: depositAmount });
    await protocol.wETH.connect(signers.random).approve(protocol.vCWETH.address, depositAmount);
    await protocol.vCWETH.connect(signers.random).deposit(depositAmount, signers.random.address);

    // error due to rounding is subtracted here
    expect(await protocol.vCWETH.totalAssets()).equals(depositAfterFee)

    const shareValue = await protocol.vCWETH.convertToAssets(ethers.utils.parseEther("1"))

    // simulate 1 ether of rewards put into minipool contract
    const executionLayerReward = ethers.utils.parseEther("1");
    await signers.ethWhale.sendTransaction({
      to: minipools[0],
      value: executionLayerReward
    })

    console.log('minipool balance', await ethers.provider.getBalance(minipools[0]));

    const minipoolData = await protocol.superNode.minipoolData(minipools[0]);

    // assume a 15% rETH fee and LEB8 (36.25% of all rewards), which is default settings
    const nodeRewards = executionLayerReward.mul(ethers.utils.parseEther(".3625")).div(ethers.utils.parseEther("1"));
    const expectedTreasuryPortion = nodeRewards.mul(minipoolData.ethTreasuryFee).div(ethers.utils.parseEther("1"));
    const expectedNodeOperatorPortion = nodeRewards.mul(minipoolData.noFee).div(ethers.utils.parseEther("1"));
    const expectedCommunityPortion = nodeRewards.sub(expectedTreasuryPortion).sub(expectedNodeOperatorPortion);
    const initalTreasuryBalance = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress());
    await protocol.operatorDistributor.connect(signers.random).processNextMinipool();
    const finalTreasuryBalance = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress());
    const expectedRedeemValue = await protocol.vCWETH.previewRedeem(shareValue);

    expect(await protocol.vCWETH.totalAssets()).equals(depositAfterFee.add(expectedCommunityPortion));

    let preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    let postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expectNumberE18ToBeApproximately(expectedRedeemValue, postBalance.sub(preBalance), 0.0000000001)

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expectNumberE18ToBeApproximately(expectedRedeemValue, postBalance.sub(preBalance), 0.0000000001)
    // preview of redeeming all shares
    const fullPreviewRedeem = (await protocol.vCWETH.previewRedeem((await protocol.vCWETH.balanceOf(signers.random.address)).add(initialDeposit).sub(await protocol.vCWETH.getMintFeePortion(initialDeposit))));
    expectNumberE18ToBeApproximately(fullPreviewRedeem, (await protocol.vCWETH.totalAssets()), .00000001);

    expect(await ethers.provider.getBalance(protocol.directory.getOperatorRewardAddress())).equals(expectedNodeOperatorPortion);
    expect(finalTreasuryBalance.sub(initalTreasuryBalance)).equals(expectedTreasuryPortion);
  })

  it("success - tries to deposit and redeem from weth vault multiple times with a minipool reward claim, simulating a penalized exit", async () => {

    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    // set the max weth rpl ratio to 10000% to allow for large ETH deposits
    await protocol.vCWETH.connect(signers.admin).setMaxWethRplRatio(ethers.utils.parseEther("100"));

    expect(await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress())).equals(0);
    const initialDeposit = await prepareOperatorDistributionContract(setupData, 1);
    expect(await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress())).equals(await protocol.vCWETH.getMintFeePortion(initialDeposit));
		const minipools = await registerNewValidator(setupData, [signers.random]);

    const depositAmount = await protocol.vCWETH.previewMint(ethers.utils.parseEther("100"));
    const totalDeposit = initialDeposit.add(depositAmount);
    const totalDepositAfterMintFee = totalDeposit
      .sub(await protocol.vCWETH.getMintFeePortion(initialDeposit))
      .sub(await protocol.vCWETH.getMintFeePortion(depositAmount));

    await protocol.wETH.connect(signers.random).deposit({ value: depositAmount });
    await protocol.wETH.connect(signers.random).approve(protocol.vCWETH.address, depositAmount);

    await protocol.vCWETH.connect(signers.random).deposit(depositAmount, signers.random.address);
    // sub 1 for rounding error
    expect((await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress()))).equals(await protocol.vCWETH.getMintFeePortion(totalDeposit));

    expect(await protocol.vCWETH.totalAssets()).equals(totalDepositAfterMintFee)

    const shareValue = await protocol.vCWETH.convertToAssets(ethers.utils.parseEther("1"))

    // simulate 31 ether (whole bond - 1 ETH penalty) put into minipool contract from beacon
    const penalty = ethers.utils.parseEther("1");
    const finalMinipoolBalance = ethers.utils.parseEther("32").sub(penalty);
    await signers.ethWhale.sendTransaction({
      to: minipools[0],
      value: finalMinipoolBalance
    })

    await protocol.operatorDistributor.connect(signers.random).processNextMinipool();
    expect((await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress()))).equals(await protocol.vCWETH.getMintFeePortion(totalDeposit));
    await protocol.operatorDistributor.connect(signers.admin).distributeExitedMinipool(minipools[0])
    expect((await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress()))).equals(await protocol.vCWETH.getMintFeePortion(totalDeposit));
    const expectedRedeemValue = await protocol.vCWETH.previewRedeem(shareValue);

    expect(await protocol.vCWETH.totalAssets()).equals(totalDepositAfterMintFee.sub(penalty));

    let preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    let postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expectNumberE18ToBeApproximately(expectedRedeemValue, postBalance.sub(preBalance), 0.0000000001)

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expectNumberE18ToBeApproximately(expectedRedeemValue, postBalance.sub(preBalance), 0.0000000001)

    // preview of redeeming all shares
    const fullPreviewRedeem = (await protocol.vCWETH.previewRedeem((await protocol.vCWETH.balanceOf(signers.random.address)).add(initialDeposit).sub(await protocol.vCWETH.getMintFeePortion(initialDeposit))));
    expectNumberE18ToBeApproximately(fullPreviewRedeem, (await protocol.vCWETH.totalAssets()), .00000001);

    expect(await ethers.provider.getBalance(protocol.directory.getOperatorRewardAddress())).equals(0);
    expect((await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress()))).equals(await protocol.vCWETH.getMintFeePortion(totalDeposit));
  })

  it("success - tries to deposit and redeem from weth vault multiple times with a minipool reward claim, simulating an exit with rewards", async () => {

    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    // set the max weth rpl ratio to 10000% to allow for large ETH deposits
    await protocol.vCWETH.connect(signers.admin).setMaxWethRplRatio(ethers.utils.parseEther("100"));

    const initialDeposit = await prepareOperatorDistributionContract(setupData, 1);
    expect(await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress())).equals(await protocol.vCWETH.getMintFeePortion(initialDeposit));
		const minipools = await registerNewValidator(setupData, [signers.random]);

    const depositAmount = await protocol.vCWETH.previewMint(ethers.utils.parseEther("100"));
    const totalDeposit = initialDeposit.add(depositAmount);
    const totalDepositAfterMintFee = totalDeposit
      .sub(await protocol.vCWETH.getMintFeePortion(initialDeposit))
      .sub(await protocol.vCWETH.getMintFeePortion(depositAmount));

    await protocol.wETH.connect(signers.random).deposit({ value: depositAmount });
    await protocol.wETH.connect(signers.random).approve(protocol.vCWETH.address, depositAmount);
    await protocol.vCWETH.connect(signers.random).deposit(depositAmount, signers.random.address);
    expect(await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress())).equals(await protocol.vCWETH.getMintFeePortion(totalDeposit))

    expect(await protocol.vCWETH.totalAssets()).equals(totalDepositAfterMintFee);

    const shareValue = await protocol.vCWETH.convertToAssets(ethers.utils.parseEther("1"))

    // simulate 33 ether (full validator + 1 ETH reward) put into minipool contract from beacon
    const rewards = ethers.utils.parseEther("1");
    const finalMinipoolBalance = ethers.utils.parseEther("32").add(rewards);
    await signers.ethWhale.sendTransaction({
      to: minipools[0],
      value: finalMinipoolBalance
    })

    const minipoolData = await protocol.superNode.minipoolData(minipools[0]);
    // assume a 15% rETH fee and LEB8 (36.25% of all rewards), which is default settings
    const nodeRewards = rewards.mul(ethers.utils.parseEther(".3625")).div(ethers.utils.parseEther("1"));
    const expectedTreasuryPortion = nodeRewards.mul(minipoolData.ethTreasuryFee).div(ethers.utils.parseEther("1"));
    const expectedNodeOperatorPortion = nodeRewards.mul(minipoolData.noFee).div(ethers.utils.parseEther("1"));
    const expectedCommunityPortion = nodeRewards.sub(expectedTreasuryPortion).sub(expectedNodeOperatorPortion);

    //expect(await protocol.superNode.minipoolIndex(minipools[0])).to.not.equal(0);
    expect((await protocol.superNode.minipoolData(minipools[0])).subNodeOperator).to.not.equal(0);

    await protocol.operatorDistributor.connect(signers.random).processNextMinipool();
    const treasuryFee = (await protocol.vCWETH.getMintFeePortion(totalDeposit));
    expect(await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress())).equals(await protocol.vCWETH.getMintFeePortion(totalDeposit))
    expect(await ethers.provider.getBalance(protocol.directory.getTreasuryAddress())).equals(expectedTreasuryPortion)

    // expect the minipool to be removed from the SNA accounting
    expect((await protocol.superNode.minipoolData(minipools[0])).subNodeOperator).to.equal(ethers.constants.AddressZero);
    const expectedRedeemValue = await protocol.vCWETH.previewRedeem(shareValue);

    expect(await protocol.vCWETH.totalAssets()).equals(totalDepositAfterMintFee.add(expectedCommunityPortion));

    let preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    let postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expectNumberE18ToBeApproximately(expectedRedeemValue, postBalance.sub(preBalance), 0.0000000001)

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expectNumberE18ToBeApproximately(expectedRedeemValue, postBalance.sub(preBalance), 0.0000000001)

    // preview of redeeming all shares
    const fullPreviewRedeem = (await protocol.vCWETH.previewRedeem((await protocol.vCWETH.balanceOf(signers.random.address)).add(initialDeposit).sub(await protocol.vCWETH.getMintFeePortion(initialDeposit))));
    expectNumberE18ToBeApproximately(fullPreviewRedeem, (await protocol.vCWETH.totalAssets()), .00000001);

    expect(await ethers.provider.getBalance(protocol.directory.getOperatorRewardAddress())).equals(expectedNodeOperatorPortion);
    expect(await protocol.wETH.balanceOf(protocol.directory.getTreasuryAddress())).equals(await protocol.vCWETH.getMintFeePortion(totalDeposit))
    expect(await ethers.provider.getBalance(protocol.directory.getTreasuryAddress())).equals(expectedTreasuryPortion)
  })

  it("fail - cannot deposit 1 eth at 50 rpl and 500 rpl, tvl ratio returns ~15%", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;
  })

  it("success - can deposit 5 eth at 50 rpl and 500 rpl, tvl ratio returns ~15%", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;
  });

  describe("admin functions", () => {
    it("success - admin can set tvlCoverageRatio", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      const tvlCoverageRatio = ethers.utils.parseEther("0.1542069");
      await protocol.vCWETH.connect(signers.admin).setMaxWethRplRatio(tvlCoverageRatio);

      const tvlCoverageRatioFromContract = await protocol.vCWETH.maxWethRplRatio();
      expect(tvlCoverageRatioFromContract).equals(tvlCoverageRatio);
    });

    it("fail - non-admin cannot set tvlCoverageRatio", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      const tvlCoverageRatio = ethers.utils.parseEther("0.1542069");
      await expect(protocol.vCWETH.connect(signers.ethWhale).setMaxWethRplRatio(tvlCoverageRatio)).to.be.revertedWith("Can only be called by short timelock!");
    });

    it("success - admin can enable or disable deposits", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      expect(await protocol.vCWETH.depositsEnabled()).equals(true);

      await expect(protocol.vCWETH.connect(signers.admin).setDepositsEnabled(true)).to.not.be.reverted;
      let depositAmount =  ethers.utils.parseEther("1");
      await protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmount });
      await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmount);
      await expect(protocol.vCWETH.connect(signers.ethWhale).deposit(depositAmount, signers.ethWhale.address)).to.not.be.reverted;

      await protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmount });
      await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmount);
      await expect(protocol.vCWETH.connect(signers.admin).setDepositsEnabled(false)).to.not.be.reverted;
      await expect(protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1"), signers.ethWhale.address)).to.be.revertedWith("deposits are disabled");

      await expect(protocol.vCWETH.connect(signers.admin).setDepositsEnabled(true)).to.not.be.reverted;
      await expect(protocol.vCWETH.connect(signers.admin).setDepositsEnabled(true)).to.not.be.reverted;
      await expect(protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1"), signers.ethWhale.address)).to.not.be.reverted;

      await protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmount });
      await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmount);
      await expect(protocol.vCWETH.connect(signers.admin).setDepositsEnabled(false)).to.not.be.reverted;
      await expect(protocol.vCWETH.connect(signers.admin).setDepositsEnabled(false)).to.not.be.reverted;
      await expect(protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1"), signers.ethWhale.address)).to.be.revertedWith("deposits are disabled");
    });

    it("fail - non-admin cannot set deposits enabled", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      expect(await protocol.vCWETH.depositsEnabled()).equals(true);

      let depositAmount =  ethers.utils.parseEther("1");
      await protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmount });
      await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmount);
      await expect(protocol.vCWETH.connect(signers.random).setDepositsEnabled(false)).to.be.revertedWith("Can only be called by admin address!");
      await expect(protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1"), signers.ethWhale.address)).to.not.be.reverted;
    });
  });

  describe("sanctions checks", () => {

    it("success - allows deposits from non-sanctioned senders and origins", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      const depositAmountEth = ethers.utils.parseEther("5");

      await protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmountEth });
      await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmountEth);
      const tx = await protocol.vCWETH.connect(signers.ethWhale).deposit(depositAmountEth, signers.ethWhale.address);
      const events = await getEventNames(tx, protocol.directory);
      expect(events.includes("SanctionViolation")).equals(false);
    })

    it("fail - should fail siliently with event logging", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      const depositAmountEth = ethers.utils.parseEther("5");

      await protocol.sanctions.addBlacklist(signers.ethWhale.address);

      await protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmountEth });
      await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmountEth);
      const tx = await protocol.vCWETH.connect(signers.ethWhale).deposit(depositAmountEth, signers.ethWhale.address);
      const events = await getEventNames(tx, protocol.directory);
      expect(events.includes("SanctionViolation")).equals(true);
    })
  })

});