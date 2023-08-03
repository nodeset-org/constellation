import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployOnlyFixture, Protocol, protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { initializeDirectory } from "./test-directory";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { operator, whitelist } from "../typechain-types/contracts";
import { RewardStruct } from "../typechain-types/contracts/Operator/YieldDistributor";
import { evaluateModel, expectNumberE18ToBeApproximately, registerNewValidator } from "./utils/utils";

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
    it("Random address cannot setMaxIntervalTime", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;

      await expect(protocol.yieldDistributor.connect(signers.random).setMaxIntervalTime(1))
        .to.be.revertedWith(await protocol.yieldDistributor.ADMIN_ONLY_ERROR());

    })
  });

  async function simulateYield(setupData: SetupData, yieldAmountEth: BigNumber) {
    const { protocol, signers, rocketPool: rp } = setupData;

    await protocol.whitelist.addOperator(signers.random.address);
    await protocol.whitelist.addOperator(signers.random2.address);
    await protocol.whitelist.addOperator(signers.random3.address);


    // simulate yield from validator
    await signers.ethWhale.sendTransaction({ to: protocol.yieldDistributor.address, value: yieldAmountEth});
  }


  it("Distributes fees appropriately", async function () {
    const setupData = await loadFixture(protocolFixture)
    const { protocol, signers, rocketPool: rp } = setupData;
    const yieldDistributor = protocol.yieldDistributor;

    const totalEthYield = ethers.utils.parseEther("1");

    await simulateYield(setupData, totalEthYield);

    const wethBalance = await protocol.wETH.balanceOf(protocol.yieldDistributor.address);
    expect(wethBalance).to.equal(totalEthYield);

    const totalFee = await yieldDistributor.totalYieldAccrued()

    const operatorShare = (totalFee).div(3); // 3 operators used in this test

    await protocol.yieldDistributor.connect(signers.admin).finalizeInterval();


    await signers.ethWhale.sendTransaction({ to: protocol.operatorDistributor.address, value: ethers.utils.parseEther("24") });
    await registerNewValidator(setupData, [signers.random, signers.random2, signers.random3]);

    const tx1 = await protocol.yieldDistributor.connect(signers.ethWhale).harvest(signers.random.address, 1, 1);
    const tx2 = await protocol.yieldDistributor.connect(signers.ethWhale).harvest(signers.random2.address, 1, 1);
    const tx3 = await protocol.yieldDistributor.connect(signers.ethWhale).harvest(signers.random3.address, 1, 1);

    expectNumberE18ToBeApproximately(await ethers.provider.getBalance(protocol.yieldDistributor.address), ethers.BigNumber.from("0"), 0.0001);


    const expectedReward = evaluateModel(.2, 7, 1).toFixed(18).toString();

    await expect(tx1).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random.address, ethers.utils.parseEther(expectedReward).add(1)]);

    await expect(tx2).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random2.address, ethers.utils.parseEther(expectedReward).add(1)]);

    await expect(tx3).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random3.address, ethers.utils.parseEther(expectedReward).add(1)]);


  });

  it("Test pull model", async () => {

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
      // expect balance to be 18 eth
      expect(await ethers.provider.getBalance(yieldDistributor.address)).to.equal(totalYield);

      const currentInterval1 = await yieldDistributor.currentInterval();
      expect(currentInterval1).to.equal(1);

      await yieldDistributor.connect(signers.admin).finalizeInterval();

      // harvest rewards for each operator, should collect rewards from both intervals
      const tx1 = await yieldDistributor.connect(signers.random).harvest(signers.random.address, 0, 1);
      const tx2 = await yieldDistributor.connect(signers.random2).harvest(signers.random2.address, 0, 1);
      const tx3 = await yieldDistributor.connect(signers.random3).harvest(signers.random3.address, 0, 1);
      const tx4 = await yieldDistributor.connect(signers.random4).harvest(signers.random4.address, 1, 1);
      const tx5 = await yieldDistributor.connect(signers.random5).harvest(signers.random5.address, 1, 1);

      const claims = await yieldDistributor.getClaims();

      expect(claims[0].amount).to.equal(firstYield);
      expect(claims[1].amount).to.equal(secondYield);

      const operatorShareInterval0 = firstYield.mul(ethers.utils.parseEther("1")).div(ethers.utils.parseEther("3"));
      const operatorShareInterval1 = secondYield.mul(ethers.utils.parseEther("1")).div(ethers.utils.parseEther("5"));

      const interval0 = await yieldDistributor.claims(0);
      const claimPerOperatorInterval0 = interval0.amount.mul(ethers.utils.parseEther("1")).div(interval0.numOperators).div(ethers.utils.parseEther("1"));

      const interval1 = await yieldDistributor.claims(1);
      const claimPerOperatorInterval1 = interval1.amount.mul(ethers.utils.parseEther("1")).div(interval1.numOperators).div(ethers.utils.parseEther("1"));

      await expect(tx1).to.emit(yieldDistributor, "RewardDistributed").withArgs([signers.random.address, operatorShareInterval0.add(operatorShareInterval1)]);
      await expect(tx2).to.emit(yieldDistributor, "RewardDistributed").withArgs([signers.random2.address, operatorShareInterval0.add(operatorShareInterval1)]);
      await expect(tx3).to.emit(yieldDistributor, "RewardDistributed").withArgs([signers.random3.address, operatorShareInterval0.add(operatorShareInterval1)]);
      await expect(tx4).to.emit(yieldDistributor, "RewardDistributed").withArgs([signers.random4.address, operatorShareInterval1]);
      await expect(tx5).to.emit(yieldDistributor, "RewardDistributed").withArgs([signers.random5.address, operatorShareInterval1]);

      expect(await ethers.provider.getBalance(yieldDistributor.address)).to.equal(totalYield);
    })

    it("cannot claim mulitple times for the same interval", async () => {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp } = setupData;
      const { yieldDistributor, whitelist } = protocol;

      // add 3 operators
      await whitelist.addOperator(signers.random.address);
      await whitelist.addOperator(signers.random2.address);
      await whitelist.addOperator(signers.random3.address);

      // send eth into yield distributor simulating yield at interval 0
      const firstYield = ethers.utils.parseEther("0.0017");
      await signers.ethWhale.sendTransaction({
        to: protocol.yieldDistributor.address,
        value: firstYield,
      });

      await yieldDistributor.connect(signers.admin).finalizeInterval();

      // harvest rewards for each operator
      await yieldDistributor.connect(signers.random).harvest(signers.random.address, 0, 0);

      // try to harvest again
      await expect(yieldDistributor.connect(signers.random).harvest(signers.random.address, 0, 0)).to.emit(yieldDistributor, "WarningAlreadyClaimed").withArgs(signers.random.address, 0);
      await expect(yieldDistributor.connect(signers.random).harvest(signers.random.address, 0, 0)).to.emit(yieldDistributor, "WarningAlreadyClaimed").withArgs(signers.random.address, 0);
      await expect(yieldDistributor.connect(signers.random).harvest(signers.random.address, 0, 0)).to.emit(yieldDistributor, "WarningAlreadyClaimed").withArgs(signers.random.address, 0);

    });

    it("cannot claim until it has been assigned an interval", async () => {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp } = setupData;
      const { yieldDistributor, whitelist } = protocol;

      // add 1/3 operators
      await whitelist.addOperator(signers.random.address);

      // send eth into yield distributor simulating yield at interval 0
      const firstYield = ethers.utils.parseEther("0.17");
      await signers.ethWhale.sendTransaction({
        to: protocol.yieldDistributor.address,
        value: firstYield,
      });

      expect(await yieldDistributor.currentInterval()).to.equal(1);
      // since there are no operators, nobody can claim

      // add 2/3 operators
      await whitelist.addOperator(signers.random2.address);

      // send eth into yield distributor simulating yield at interval 1
      const secondYield = ethers.utils.parseEther("0.317");
      await signers.ethWhale.sendTransaction({
        to: protocol.yieldDistributor.address,
        value: secondYield,
      });

      expect(await yieldDistributor.currentInterval()).to.equal(2)

      // add 3/3 operators
      await whitelist.addOperator(signers.random3.address);

      // send eth into yield distributor simulating yield at interval 2
      const thirdYield = ethers.utils.parseEther("3.0017");
      await signers.ethWhale.sendTransaction({
        to: protocol.yieldDistributor.address,
        value: thirdYield,
      });

      expect(await yieldDistributor.currentInterval()).to.equal(3)

      // finalize current interval
      await yieldDistributor.connect(signers.admin).finalizeInterval();

      console.log("Operator", await whitelist.getOperatorAtAddress(signers.random.address));
      console.log("Operator 2", await whitelist.getOperatorAtAddress(signers.random2.address));
      console.log("Operator 3", await whitelist.getOperatorAtAddress(signers.random3.address));

      await expect(yieldDistributor.harvest(signers.random.address, 0, 3)).to.be.rejectedWith("Rewardee has not been an operator since startInterval");
      await expect(yieldDistributor.harvest(signers.random2.address, 1, 3)).to.be.rejectedWith("Rewardee has not been an operator since startInterval");
      await expect(yieldDistributor.harvest(signers.random3.address, 2, 3)).to.be.revertedWith("Rewardee has not been an operator since startInterval");

    });
  })
});



// describe("Yield Distributor", function () {
//   it("Admin can adjust rewards rate", async function () {

//   });
//   it("Can claim reward", async function () {

//   });
// });
