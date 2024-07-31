import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, upgradePriceFetcherToMock, whitelistUserServerSig } from "./utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { wEth } from "../typechain-types/contracts/Testing";

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

    const { sig, timestamp } = await whitelistUserServerSig(setupData, signers.ethWhale);

    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, ethers.utils.parseEther("100"));
    await protocol.whitelist.connect(signers.admin).addOperator(signers.ethWhale.address, timestamp, sig);

    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
    await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);

    const expectedxrETHInSystem = ethers.utils.parseEther("100");
    const actualxrETHInSystem = await protocol.vCWETH.totalAssets();
    expect(expectedxrETHInSystem).equals(actualxrETHInSystem)
  })

  it.only("success - makes deposit, positive oracle yield updates, withdraws for more than deposit", async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    const { admin } = signers;
    const { sig, timestamp } = await whitelistUserServerSig(setupData, signers.ethWhale);

    console.log("STEP 0 - initializing protocol with funds")
    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, ethers.utils.parseEther("100"));
    await protocol.whitelist.connect(signers.admin).addOperator(signers.ethWhale.address, timestamp, sig);

    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
    await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);

    const expectedxrETHInSystem = ethers.utils.parseEther("100");
    const actualxrETHInSystem = await protocol.vCWETH.totalAssets();
    expect(expectedxrETHInSystem).equals(actualxrETHInSystem)
    expect(await protocol.vCWETH.principal()).equals(expectedxrETHInSystem);
    expect(await protocol.vCWETH.redeemableRewards()).equals(0);

    console.log("STEP 1 - trying to redeem 10% of shares for 10 eth which is 10% of 100 eth")
    // attempt to redeem 10% of shares for 10 eth which is 10% of 100 eth
    let shares = (await protocol.vCWETH.balanceOf(signers.ethWhale.address)).div(10)
    await protocol.vCWETH.connect(signers.ethWhale).redeem(shares, signers.ethWhale.address, signers.ethWhale.address);
    expect(await protocol.vCWETH.principal()).equals(ethers.utils.parseEther("90"));
    expect(await protocol.vCWETH.redeemableRewards()).equals(0);
    expect(await protocol.vCWETH.totalAssets()).equals(ethers.utils.parseEther("90"))

    console.log("STEP 2 - trying to deposit 10 more eth so we are working with an even 100 eth in the system")
    // deposit 10 more eth so we are working with an even 100 eth in the system
    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("10") });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("10"));
    await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("10"), signers.ethWhale.address);
    expect(await protocol.vCWETH.principal()).equals(ethers.utils.parseEther("100"));
    expect(await protocol.vCWETH.totalAssets()).equals(ethers.utils.parseEther("100"))

    console.log("STEP 3 - trying to increase oracle value")
    // increase oracle value
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    const newTotalYield = ethers.utils.parseEther("100");
    const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "address", "uint256"], [newTotalYield, timestamp, protocol.oracle.address, chainId]);
    const signature = await admin.signMessage(ethers.utils.arrayify(messageHash));

    expect(await protocol.oracle.getTotalYieldAccrued()).to.equal(0);
    await protocol.oracle.connect(admin).setTotalYieldAccrued(signature, newTotalYield, timestamp);
    expect(await protocol.oracle.getTotalYieldAccrued()).to.equal(newTotalYield);

    console.log("STEP 4 - trying to expect 100 eth in income reported per oracle")
    // expect 100 eth in income reported per oracle
    const oracleValue = ethers.utils.parseEther("100");
    expect(await protocol.vCWETH.redeemableRewards()).equals(oracleValue);
    expect(await protocol.vCWETH.principal()).equals(ethers.utils.parseEther("100"));
    const currentAdminIncome0 = oracleValue.mul(await protocol.vCWETH.treasuryFee()).div(ethers.utils.parseUnits("1", 5));
    const currentNodeOperatorIncome0 = oracleValue.mul(await protocol.vCWETH.nodeOperatorFee()).div(ethers.utils.parseUnits("1", 5));
    const expectedTotalAssets0 = oracleValue.add(oracleValue).sub(currentAdminIncome0.add(currentNodeOperatorIncome0));
   // expect(await protocol.vCWETH.totalAssets()).equals(expectedTotalAssets0)
    console.log("ActualTotalAssets", await protocol.vCWETH.totalAssets());

    console.log("STEP 5 - trying to redeem 1% of shares for eth but we should expect a ~98% gain from the additional 100 eth reported from oracle")
    // redeem 1% of shares for eth but we should expect a ~98% gain from the additional 100 eth reported from oracle
    shares = ethers.utils.parseEther("1")
    console.log("redeemableRewards test")
    const singleShareValue = await protocol.vCWETH.previewRedeem(shares); // this should remain constant through subsequent redeems
    let balanceBefore = await protocol.wETH.balanceOf(signers.ethWhale.address);
    await protocol.vCWETH.connect(signers.ethWhale).redeem(shares, signers.ethWhale.address, signers.ethWhale.address);
    let balanceAfter = await protocol.wETH.balanceOf(signers.ethWhale.address);
    expect(balanceAfter.sub(balanceBefore)).equals(singleShareValue);

    // check treasury and yieldDistributor
    const treasuryAddress = await protocol.directory.getTreasuryAddress();
    expect(await protocol.wETH.balanceOf(treasuryAddress)).equals(currentAdminIncome0);
    expect(await protocol.wETH.balanceOf(protocol.yieldDistributor.address)).equals(currentNodeOperatorIncome0);


    const expectedPrincipal = ethers.BigNumber.from("99000000000000000001"); // because we claim before
    //expect(await protocol.vCWETH.principal()).equals(expectedPrincipal);
    console.log("expectedPrincipal", expectedPrincipal)
    console.log("actualPrincipal", await protocol.vCWETH.principal())

    const redeemableRewards = await protocol.vCWETH.redeemableRewards();
    const currentAdminIncome = redeemableRewards.mul(await protocol.vCWETH.treasuryFee()).div(ethers.utils.parseUnits("1", 5));
    const currentNodeOperatorIncome = redeemableRewards.mul(await protocol.vCWETH.nodeOperatorFee()).div(ethers.utils.parseUnits("1", 5));

    const expectedTotalAssets = expectedPrincipal.add(oracleValue).sub(currentAdminIncome.add(currentNodeOperatorIncome));
    console.log("preview redeem 5", await protocol.vCWETH.previewRedeem(shares));
    console.log("expectedTotalAssets", expectedTotalAssets);
    console.log("ActualTotalAssets", await protocol.vCWETH.totalAssets());
    console.log("currentIncome", redeemableRewards);
    console.log("distributableYield", await protocol.vCWETH.getDistributableYield());
    console.log("OD TVL", await protocol.operatorDistributor.getTvlEth());
    console.log("DP TVL", await protocol.depositPool.getTvlEth());

    //expect(await protocol.vCWETH.totalAssets()).equals(expectedTotalAssets);

    console.log("STEP 6 - trying to redeem 1% of shares for eth but we should expect a ~98% gain from the additional 100 eth reported from oracle")
    balanceBefore = await protocol.wETH.balanceOf(signers.ethWhale.address);
    await protocol.vCWETH.connect(signers.ethWhale).redeem(shares, signers.ethWhale.address, signers.ethWhale.address);
    balanceAfter = await protocol.wETH.balanceOf(signers.ethWhale.address);
    expectNumberE18ToBeApproximately(balanceAfter.sub(balanceBefore), singleShareValue, 0.5)

    console.log("preview redeem 6", await protocol.vCWETH.previewRedeem(shares));
    console.log("expectedTotalAssets", expectedTotalAssets);
    console.log("ActualTotalAssets", await protocol.vCWETH.totalAssets());
    console.log("currentIncome", redeemableRewards);
    console.log("distributableYield", await protocol.vCWETH.getDistributableYield());
    console.log("OD TVL", await protocol.operatorDistributor.getTvlEth());
    console.log("DP TVL", await protocol.depositPool.getTvlEth());

    console.log("STEP 7 - trying to redeem 1% of shares for eth but we should expect a ~98% gain from the additional 100 eth reported from oracle")
    balanceBefore = await protocol.wETH.balanceOf(signers.ethWhale.address);
    await protocol.vCWETH.connect(signers.ethWhale).redeem(shares, signers.ethWhale.address, signers.ethWhale.address);
    balanceAfter = await protocol.wETH.balanceOf(signers.ethWhale.address);
    //expectNumberE18ToBeApproximately(balanceAfter.sub(balanceBefore), singleShareValue, 0.001)

    console.log("preview redeem 7", await protocol.vCWETH.previewRedeem(shares));
    console.log("expectedTotalAssets", expectedTotalAssets);
    console.log("ActualTotalAssets", await protocol.vCWETH.totalAssets());
    console.log("currentIncome", redeemableRewards);
    console.log("distributableYield", await protocol.vCWETH.getDistributableYield());
    console.log("OD TVL", await protocol.operatorDistributor.getTvlEth());
    console.log("DP TVL", await protocol.depositPool.getTvlEth());

    // deposit 100 more eth
    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
    await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);

    console.log("STEP 8 - trying to redeem 1% of shares for eth but we should expect a ~98% gain from the additional 100 eth reported from oracle")
    balanceBefore = await protocol.wETH.balanceOf(signers.ethWhale.address);
    await protocol.vCWETH.connect(signers.ethWhale).redeem(shares, signers.ethWhale.address, signers.ethWhale.address);
    balanceAfter = await protocol.wETH.balanceOf(signers.ethWhale.address);
    //expect(balanceAfter.sub(balanceBefore)).equals(singleShareValue);

    console.log("preview redeem 8", await protocol.vCWETH.previewRedeem(shares));
    console.log("expectedTotalAssets", expectedTotalAssets);
    console.log("ActualTotalAssets", await protocol.vCWETH.totalAssets());
    console.log("currentIncome", redeemableRewards);
    console.log("distributableYield", await protocol.vCWETH.getDistributableYield());
    console.log("OD TVL", await protocol.operatorDistributor.getTvlEth());
    console.log("DP TVL", await protocol.depositPool.getTvlEth());

    console.log("STEP 9 - trying to redeem 1% of shares for eth but we should expect a ~98% gain from the additional 100 eth reported from oracle")
    balanceBefore = await protocol.wETH.balanceOf(signers.ethWhale.address);
    await protocol.vCWETH.connect(signers.ethWhale).redeem(shares, signers.ethWhale.address, signers.ethWhale.address);
    balanceAfter = await protocol.wETH.balanceOf(signers.ethWhale.address);
    //expect(balanceAfter.sub(balanceBefore)).equals(singleShareValue);

    console.log("preview redeem 9", await protocol.vCWETH.previewRedeem(shares));
    console.log("expectedTotalAssets", expectedTotalAssets);
    console.log("ActualTotalAssets", await protocol.vCWETH.totalAssets());
    console.log("currentIncome", redeemableRewards);
    console.log("distributableYield", await protocol.vCWETH.getDistributableYield());
    console.log("OD TVL", await protocol.operatorDistributor.getTvlEth());
    console.log("DP TVL", await protocol.depositPool.getTvlEth());
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