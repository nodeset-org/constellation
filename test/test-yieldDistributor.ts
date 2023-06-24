import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployOnlyFixture, Protocol, protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { initializeDirectory } from "./test-directory";
import { mint_xRpl } from "./test-xRpl";
import { mint_xrEth } from "./test-xrEth";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { operator } from "../typechain-types/contracts";
import { RewardStruct } from "../typechain-types/contracts/Operator/YieldDistributor";

describe("Yield Distributor", function () {

  describe("Initialization", function () {

    it("Random address cannot initialize", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;

      await expect(protocol.yieldDistributor.connect(signers.random).initialize())
        .to.be.revertedWith(await protocol.yieldDistributor.ADMIN_ONLY_ERROR());
    });

    it("Cannot initialize before directory is initialized", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;

      await expect(protocol.yieldDistributor.initialize())
        .to.be.revertedWith(await protocol.yieldDistributor.DIRECTORY_NOT_INITIALIZED_ERROR());
    });

    it("Can be initialized by admin", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers, rocketPool } = setupData;

      await expect(initializeDirectory(protocol, rocketPool, signers.admin)).to.not.be.reverted;
      await expect(protocol.yieldDistributor.initialize()).to.not.be.reverted;

      expect(await protocol.yieldDistributor.getIsInitialized()).equals(true);
    });

    it("Can only be initialized once by admin", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers, rocketPool } = setupData;

      await expect(initializeDirectory(protocol, rocketPool, signers.admin)).to.not.be.reverted;
      await expect(protocol.yieldDistributor.initialize()).to.not.be.reverted;

      await expect(protocol.yieldDistributor.initialize())
        .to.be.revertedWith(await protocol.yieldDistributor.INITIALIZATION_ERROR());
    });
  });


  describe("Setters", function () {
    it("Random address cannot set ETH fee modifier", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;

      await expect(protocol.yieldDistributor.connect(signers.random)
        .setEthCommissionModifier(BigNumber.from(999)))
        .to.be.revertedWith(await protocol.yieldDistributor.ADMIN_ONLY_ERROR());
    });

    it("Admin can set ETH fee modifier", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers, rocketPool: rp } = setupData;

      let newFee = ethers.utils.parseEther("0.01");
      await expect(protocol.yieldDistributor.setEthCommissionModifier(newFee))
        .to.not.be.reverted;

      let expectedFee = (await rp.networkFeesContract.getMaximumNodeFee()).add(newFee);
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthCommissionRate())
        .equals(expectedFee);

      newFee = ethers.utils.parseEther("-0.01");
      await expect(protocol.yieldDistributor.setEthCommissionModifier(newFee))
        .to.not.be.reverted;

      expectedFee = (await rp.networkFeesContract.getMaximumNodeFee()).add(newFee);
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthCommissionRate())
        .equals(expectedFee);
    });

    it("Revert if ETH fee modifier set too high", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers, rocketPool: rp } = setupData;

      let newFee = (await protocol.yieldDistributor.MAX_ETH_COMMISSION_MODIFIER()).add(ethers.utils.parseEther("0.1"));
      await expect(protocol.yieldDistributor.setEthCommissionModifier(newFee))
        .to.be.revertedWith(await protocol.yieldDistributor.ETH_COMMISSION_MODIFIER_OUT_OF_BOUNDS_ERROR());

      let expectedFee = (await rp.networkFeesContract.getMaximumNodeFee()).add(newFee)
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthCommissionRate())
        .to.not.equal(expectedFee);
    });

    it("Revert if ETH fee modifier set too low", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers, rocketPool: rp } = setupData;

      const newFee = ((await protocol.yieldDistributor.MAX_ETH_COMMISSION_MODIFIER()).add(ethers.utils.parseEther("0.1"))).mul(-1);
      await expect(protocol.yieldDistributor.setEthCommissionModifier(newFee))
        .to.be.revertedWith(await protocol.yieldDistributor.ETH_COMMISSION_MODIFIER_OUT_OF_BOUNDS_ERROR());

      const expectedFee = (await rp.networkFeesContract.getMaximumNodeFee()).add(newFee)
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthCommissionRate())
        .to.not.equal(expectedFee);
    });

    it("Admin can set ETH fee admin portion", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;

      const newFee = .75 * await protocol.yieldDistributor.YIELD_PORTION_MAX();
      await expect(protocol.yieldDistributor.setEthRewardAdminPortion(newFee))
        .to.not.be.reverted;

      await expect(await protocol.yieldDistributor.connect(signers.random).getEthRewardAdminPortion())
        .equals(newFee);
    });

    it("Revert if ETH fee admin portion is out of bounds", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;

      const previousFee = await protocol.yieldDistributor.connect(signers.random).getEthRewardAdminPortion();

      const newFee = await protocol.yieldDistributor.YIELD_PORTION_MAX() + 1;
      await expect(protocol.yieldDistributor.setEthRewardAdminPortion(newFee))
        .to.be.revertedWith(await protocol.yieldDistributor.ETH_REWARD_ADMIN_PORTION_OUT_OF_BOUNDS_ERROR());

      await expect(await protocol.yieldDistributor.connect(signers.random).getEthRewardAdminPortion()).to.equal(previousFee);
    });

  });

  async function simulateYield(setupData: SetupData, ether: number, rpl: number) {
    const { protocol, signers, rocketPool: rp } = setupData;
    let mintAmount = ethers.utils.parseEther("100");
    await mint_xRpl(setupData, signers.rplWhale, mintAmount);
    await mint_xrEth(setupData, signers.rplWhale, mintAmount);

    await protocol.whitelist.addOperator(signers.random.address);
    await protocol.whitelist.addOperator(signers.random2.address);
    await protocol.whitelist.addOperator(signers.random3.address);

    const yieldAmountEth = ethers.utils.parseEther(ether.toString());
    const yieldAmountRpl = ethers.utils.parseEther(rpl.toString());

    console.log("Simulating yield of " + ethers.utils.formatEther(yieldAmountEth) + " ETH and " +
      ethers.utils.formatEther(yieldAmountRpl) + " RPL")

    // simulate yield from validator
    await rp.rplContract.connect(signers.rplWhale).transfer(protocol.yieldDistributor.address, yieldAmountRpl);
    await signers.random.sendTransaction({ to: protocol.yieldDistributor.address, value: yieldAmountEth, gasLimit: 1000000 });
  }


  it("Distributes fees appropriately", async function () {
    const setupData = await loadFixture(protocolFixture)
    const { protocol, signers, rocketPool: rp } = setupData;
    const yieldDistributor = protocol.yieldDistributor;

    const totalEthYield = 1;
    const totalRplYield = 1;

    const beforeEthBalances = await Promise.all([
      signers.random.getBalance(),
      signers.random2.getBalance(),
      signers.random3.getBalance(),
      signers.admin.getBalance()
    ]);

    await simulateYield(setupData, totalEthYield, totalRplYield);

    const afterEthBalances = await Promise.all([
      signers.random.getBalance(),
      signers.random2.getBalance(),
      signers.random3.getBalance(),
      signers.admin.getBalance()
    ]);

    const totalFee = ethers.utils.parseEther("0.15"); // RP network fee is currently 15%
    const yield_portion_max = await yieldDistributor.YIELD_PORTION_MAX();
    const adminFeeEth = totalFee.mul(5000).div(yield_portion_max) // admin gets 50% by default
    // TODO: getEthCommissionRate() seems to be failing as it returns totalFee
    // TODO: do not use hardcoded 5k value

    const operatorShare = (totalFee.sub(adminFeeEth)).div(3); // 3 operators used in this test
    const rpl = await ethers.getContractAt("IERC20", await protocol.directory.RPL_CONTRACT_ADDRESS());
    const adminFeeRpl = (await rpl.balanceOf(yieldDistributor.address)).mul(5000).div(yield_portion_max);

    await protocol.yieldDistributor.connect(signers.admin).finalizeInterval();

    const tx1 = await protocol.yieldDistributor.connect(signers.random).harvest(signers.random.address, 0, 0);
    const tx2 = await protocol.yieldDistributor.connect(signers.random).harvest(signers.random2.address, 0, 0);
    const tx3 = await protocol.yieldDistributor.connect(signers.random2).harvest(signers.random3.address, 0, 0);

    // we should expect each fee reward to follow the formula:
    // uint operatorRewardEth = (totalEthFee - adminRewardEth) * (operators[i].feePortion / YIELD_PORTION_MAX) / length;

    await expect(tx1).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random.address, operatorShare]);

    await expect(tx2).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random2.address, operatorShare]);

    await expect(tx3).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random3.address, operatorShare]);


    // todo: this test is a little more tricky since we need to know the gas cost of the transaction for each signer
    // also, changeEtherBalances will not work here since each transaction is run in a separate block rather than all together
    // await expect(tx).to.changeEtherBalances(
    //     [signers.random.address, signers.random2.address, signers.random3.address, signers.admin.address],
    //     [operatorShare, operatorShare, operatorShare, adminFeeEth]
    //   );

    //await expect(tx).to.changeTokenBalance(
    //    protocol.xRPL, signers.admin.address, adminFeeRpl
    //  );
    // should also send some amount to the DP (then OD), 
    // but this functionality is tested in test - depositPool.ts

    console.log("Distributed " + ethers.utils.formatEther(operatorShare) + " ETH to 3 operators.");
    console.log("Distributed " + ethers.utils.formatEther(adminFeeEth) + " ETH and " +
      ethers.utils.formatEther(adminFeeRpl) + " RPL to the admin.");
  });

  describe.only("Test pull model", async () => {

    it("does not dilute rewards from prior operators as more operators join", async () => {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp } = setupData;
      const { yieldDistributor, whitelist } = protocol;

      // expect whitelisted operators to be empty
      const numOperators = await whitelist.numOperators();
      expect(numOperators).to.equal(0);

      // add 3 operators
      await whitelist.addOperator(signers.random.address);
      await whitelist.addOperator(signers.random2.address);
      await whitelist.addOperator(signers.random3.address);

      // send eth into yield distributor simulating yield at interval 0
      const firstYield = ethers.utils.parseEther("13");
      await signers.ethWhale.sendTransaction({
        to: protocol.yieldDistributor.address,
        value: firstYield,
      });

      const currentInterval0 = await yieldDistributor.currentInterval();
      expect(currentInterval0).to.equal(0);

      // add 2 more operators, this should have created a new interval
      await whitelist.addOperator(signers.random4.address);
      await whitelist.addOperator(signers.random5.address);

      // send 5 more eth into yield distributor simulating yield at interval 1
      const secondYield = ethers.utils.parseEther("5");
      await signers.ethWhale.sendTransaction({
        to: protocol.yieldDistributor.address,
        value: secondYield,
      });

      const totalYield = firstYield.add(secondYield);

      const currentInterval1 = await yieldDistributor.currentInterval();
      expect(currentInterval1).to.equal(1);

      await yieldDistributor.connect(signers.admin).finalizeInterval();

      // harvest rewards for each operator, should collect rewards from both intervals
      const tx1 = await yieldDistributor.connect(signers.random).harvest(signers.random.address, 0, 1);
      const tx2 = await yieldDistributor.connect(signers.random2).harvest(signers.random2.address, 0, 1);
      const tx3 = await yieldDistributor.connect(signers.random3).harvest(signers.random3.address, 0, 1);
      const tx4 = await yieldDistributor.connect(signers.random4).harvest(signers.random4.address, 1, 1);
      const tx5 = await yieldDistributor.connect(signers.random5).harvest(signers.random5.address, 1, 1);

      const ethCommissionRate = ethers.utils.parseEther("1").sub(await yieldDistributor.getEthCommissionRate());
      console.log("ethCommissionRate: " + ethers.utils.formatEther(ethCommissionRate));
      const totalYieldAfterCommission = totalYield.mul(ethCommissionRate).div(ethers.utils.parseEther("1"));
      console.log("totalYieldAfterCommission: ", (ethers.utils.formatEther(totalYieldAfterCommission)));
      expect(totalYieldAfterCommission).to.equal(await yieldDistributor.totalYieldAccrued());
      console.log("totalYieldAccrued: " + ethers.utils.formatEther(await yieldDistributor.totalYieldAccrued()));

      const firstYieldAfterCommission = firstYield.mul(ethCommissionRate).div(ethers.utils.parseEther("1"));
      const secondYieldAfterCommission = secondYield.mul(ethCommissionRate).div(ethers.utils.parseEther("1"));

      const operatorShareInterval0 = firstYieldAfterCommission.mul(ethers.utils.parseEther("1")).div(ethers.utils.parseEther("3"));
      const operatorShareInterval1 = secondYieldAfterCommission.mul(ethers.utils.parseEther("1")).div(ethers.utils.parseEther("5"));
      console.log("operatorShareInterval0: " + ethers.utils.formatEther(operatorShareInterval0));
      console.log("operatorShareInterval1: " + ethers.utils.formatEther(operatorShareInterval1));

      const interval0 = await yieldDistributor.claims(0);
      const claimPerOperatorInterval0 = interval0.amount.mul(ethers.utils.parseEther("1")).div(interval0.numOperators).div(ethers.utils.parseEther("1"));
      console.log("claimPerOperatorInterval0: " + ethers.utils.formatEther(claimPerOperatorInterval0));
      console.log("interval0: numOperators: " + interval0.numOperators.toString(),", amount: " + ethers.utils.formatEther(interval0.amount));

      const interval1 = await yieldDistributor.claims(1);
      const claimPerOperatorInterval1 = interval1.amount.mul(ethers.utils.parseEther("1")).div(interval1.numOperators).div(ethers.utils.parseEther("1"));
      console.log("claimPerOperatorInterval1: " + ethers.utils.formatEther(claimPerOperatorInterval1));
      console.log("interval1: numOperators: " + interval1.numOperators.toString(), ", amount: " + ethers.utils.formatEther(interval1.amount));

      await expect(tx1).to.emit(yieldDistributor, "RewardDistributed").withArgs([signers.random.address, operatorShareInterval0.add(operatorShareInterval1)]);

    })
  })
});



// describe("Yield Distributor", function () {
//   it("Admin can adjust rewards rate", async function () {

//   });
//   it("Can claim reward", async function () {

//   });
// });
