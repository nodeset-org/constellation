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

  describe("Getters", function () {
    it("Random address can get the RPL fee rate", async function() {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;
  
      expect(await protocol.yieldDistributor.getRplCommissionRate())
        .to.equal(BigNumber.from("500000000000000000"));
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
  
    it("Random address cannot set ETH fee admin portion", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;
  
      await expect(protocol.yieldDistributor.connect(signers.random)
        .setEthRewardAdminPortion(BigNumber.from(999)))
        .to.be.revertedWith(await protocol.yieldDistributor.ADMIN_ONLY_ERROR());
    });
  
    it("Random address cannot set RPL fee admin portion", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;
  
      await expect(protocol.yieldDistributor.connect(signers.random)
        .setRplRewardAdminPortion(BigNumber.from(999)))
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

    it("Admin can set RPL fee portion", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;
  
      const newFee = .75 * await protocol.yieldDistributor.YIELD_PORTION_MAX();
      await expect(protocol.yieldDistributor.setRplRewardAdminPortion(newFee))
        .to.not.be.reverted;
      
      await expect(await protocol.yieldDistributor.connect(signers.random).getRplCommissionRate())
        .equals(BigNumber.from("750000000000000000"));
    });
    
  });

  async function simulateYield(setupData: SetupData, ether: number, rpl: number) {
    const { protocol, signers, rocketPool: rp} = setupData;
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
    const setupData = await protocolFixture()
    const { protocol, signers, rocketPool: rp} = setupData;
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

    const tx = await protocol.yieldDistributor.distributeRewards();

    // we should expect each fee reward to follow the formula:
    // uint operatorRewardEth = (totalEthFee - adminRewardEth) * (operators[i].feePortion / YIELD_PORTION_MAX) / length;

    await expect(tx).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random.address, operatorShare, BigNumber.from(0)]);

    await expect(tx).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random2.address, operatorShare, BigNumber.from(0)]);

    await expect(tx).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.random3.address, operatorShare, BigNumber.from(0)]);

    await expect(tx).to.emit(yieldDistributor, "RewardDistributed")
      .withArgs([signers.admin.address, adminFeeEth, adminFeeRpl]);


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
  
});


// describe("Yield Distributor", function () {
//   it("Admin can adjust rewards rate", async function () {

//   });
//   it("Can claim reward", async function () {

//   });
// });
