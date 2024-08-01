import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "./utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";

describe("xrETH", function () {

  it("success - test initial xrETH values", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const name = await protocol.vCWETH.name()
    const symbol = await protocol.vCWETH.symbol();

    expect(name).equals("Constellation ETH");
    expect(symbol).equals("xrETH");
    expect(await protocol.vCWETH.liquidityReserveRatio()).equals(ethers.utils.parseUnits("0.1", 5))
    expect(await protocol.vCWETH.rplCoverageRatio()).equals(ethers.utils.parseUnits(".15", 18))
    expect(await protocol.vCWETH.enforceRplCoverageRatio()).equals(false)
    expect(await protocol.vCWETH.treasuryFee()).equals(ethers.utils.parseUnits("0.01", 5))
    expect(await protocol.vCWETH.nodeOperatorFee()).equals(ethers.utils.parseUnits("0.01", 5))
  })

  it("fail - tries to deposit weth as 'bad actor' involved in AML or other flavors of bad", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    await protocol.sanctions.addBlacklist(signers.ethWhale.address);
    await protocol.directory.connect(signers.admin).enableSanctions();
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

    const {sig, timestamp} = await whitelistUserServerSig(setupData, signers.ethWhale);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, ethers.utils.parseEther("100"));
    await protocol.whitelist.connect(signers.admin).addOperator(signers.ethWhale.address, timestamp, sig);

    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
    await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);

    const expectedxrETHInSystem = ethers.utils.parseEther("100");
    const actualxrETHInSystem = await protocol.vCWETH.totalAssets();
    expect(expectedxrETHInSystem).equals(actualxrETHInSystem)
  })

  it.only("success - tries to deposit and redeem from weth vault multiple times", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const depositAmount = ethers.utils.parseEther("100");
    const expectedReserveInVault = ethers.utils.parseEther("10");
    const surplusSentToOD = ethers.utils.parseEther("90");

    await protocol.wETH.connect(signers.random).deposit({ value: depositAmount });
    await protocol.wETH.connect(signers.random).approve(protocol.vCWETH.address, depositAmount);
    await protocol.vCWETH.connect(signers.random).deposit(depositAmount, signers.random.address);

    expect(await protocol.vCWETH.totalAssets()).equals(depositAmount)
    expect(await protocol.vCWETH.balanceWeth()).equals(expectedReserveInVault);
    expect(await protocol.operatorDistributor.balanceEth()).equals(surplusSentToOD);
    
    const shareValue = await protocol.vCWETH.convertToAssets(ethers.utils.parseEther("1"))
    const expectedRedeemValue = await protocol.vCWETH.previewRedeem(shareValue);

    let preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    let postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await protocol.vCWETH.balanceWeth()).equals(expectedReserveInVault.sub(ethers.utils.parseEther("1")))

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await protocol.vCWETH.balanceWeth()).equals(expectedReserveInVault.sub(ethers.utils.parseEther("2")))

    preBalance = await protocol.wETH.balanceOf(signers.random.address);
    await protocol.vCWETH.connect(signers.random).redeem(shareValue, signers.random.address, signers.random.address);
    postBalance = await protocol.wETH.balanceOf(signers.random.address);
    expect(expectedRedeemValue).equals(postBalance.sub(preBalance));
    expect(await protocol.vCWETH.balanceWeth()).equals(expectedReserveInVault.sub(ethers.utils.parseEther("3")))

  })

  it.only("success - tries to deposit and redeem from weth vault multiple times with minipool reward claims", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;
    
    const initialDeposit = await prepareOperatorDistributionContract(setupData, 1);
		const minipools = await registerNewValidator(setupData, [signers.random]);

    const depositAmount = ethers.utils.parseEther("100");
    const totalDeposit = initialDeposit.add(depositAmount);
    
    await protocol.wETH.connect(signers.random).deposit({ value: depositAmount });
    await protocol.wETH.connect(signers.random).approve(protocol.vCWETH.address, depositAmount);
    await protocol.vCWETH.connect(signers.random).deposit(depositAmount, signers.random.address);
    
    expect(await protocol.vCWETH.totalAssets()).equals(totalDeposit);
    
    const shareValue = await protocol.vCWETH.convertToAssets(ethers.utils.parseEther("1"))
    const initialRedeemValue = await protocol.vCWETH.previewRedeem(shareValue);
    expect(initialRedeemValue).equals(ethers.utils.parseEther("1"));

    const executionLayerReward = ethers.utils.parseEther("1");
    signers.ethWhale.sendTransaction({
      to: minipools[0],
      value: executionLayerReward
    })
    const expectedShareOfReward = ethers.BigNumber.from("362500000000000000");

    const expectedTreasuryPortion = await protocol.vCWETH.getTreasuryPortion(expectedShareOfReward);
    const expectedNodeOperatorPortion = await protocol.vCWETH.getNodeOperatorPortion(expectedShareOfReward);
    const expectedCommunityPortion = expectedShareOfReward.sub(expectedTreasuryPortion.add(expectedNodeOperatorPortion))
    console.log("expectedCommunityPortion", expectedCommunityPortion);
    
    const initalTreasuryBalance = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress());
    await protocol.operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
    const finalTreasuryBalance = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress());

    const expectedRedeemValue = await protocol.vCWETH.previewRedeem(shareValue);

    expect(await protocol.vCWETH.totalAssets()).equals(totalDeposit.add(expectedCommunityPortion))

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
    expectNumberE18ToBeApproximately(await protocol.vCWETH.previewRedeem(totalDeposit), expectedCommunityPortion.add(totalDeposit), 0.00000001)

    expect(await protocol.wETH.balanceOf(protocol.yieldDistributor.address)).equals(expectedNodeOperatorPortion);
    expect(finalTreasuryBalance.sub(initalTreasuryBalance)).equals(expectedTreasuryPortion);
    

  })


  // add tests for deposit and withdraw

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
      await protocol.vCWETH.connect(signers.admin).setRplCoverageRatio(tvlCoverageRatio);

      const tvlCoverageRatioFromContract = await protocol.vCWETH.rplCoverageRatio();
      expect(tvlCoverageRatioFromContract).equals(tvlCoverageRatio);
    });

    it("fail - non-admin cannot set tvlCoverageRatio", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      const tvlCoverageRatio = ethers.utils.parseEther("0.1542069");
      await expect(protocol.vCWETH.connect(signers.ethWhale).setRplCoverageRatio(tvlCoverageRatio)).to.be.revertedWith("Can only be called by short timelock!");
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