import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployOnlyFixture, Protocol, protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { initializeDirectory } from "./test-directory";
import { mintNodeSetRpl } from "./test-xRpl";
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
      const { protocol, signers } = setupData;
  
      await expect(initializeDirectory(protocol, signers.admin)).to.not.be.reverted;
      await expect(protocol.yieldDistributor.initialize()).to.not.be.reverted;
  
      expect(await protocol.yieldDistributor.getIsInitialized()).equals(true);
    });
  
    it("Can only be initialized once by admin", async function () {
      const setupData = await loadFixture(deployOnlyFixture);
      const { protocol, signers } = setupData;
  
      await expect(initializeDirectory(protocol, signers.admin)).to.not.be.reverted;
      await expect(protocol.yieldDistributor.initialize()).to.not.be.reverted;
  
      await expect(protocol.yieldDistributor.initialize())
        .to.be.revertedWith(await protocol.yieldDistributor.INITIALIZATION_ERROR());
    });
  });

  describe("Getters", function () {
    it("Random address can get the RPL fee rate", async function() {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      await expect(await protocol.yieldDistributor.getRplFeeRate())
        .to.equal(BigNumber.from("150000000000000000"));
    });
  });

  describe("Setters", function () {
    it("Random address cannot set ETH fee modifier", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      await expect(protocol.yieldDistributor.connect(signers.random)
        .setEthFeeModifier(BigNumber.from(999)))
        .to.be.revertedWith(await protocol.yieldDistributor.ADMIN_ONLY_ERROR());
    });
  
    it("Random address cannot set ETH fee admin portion", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      await expect(protocol.yieldDistributor.connect(signers.random)
        .setEthFeeAdminPortion(BigNumber.from(999)))
        .to.be.revertedWith(await protocol.yieldDistributor.ADMIN_ONLY_ERROR());
    });
  
    it("Random address cannot set RPL fee admin portion", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      await expect(protocol.yieldDistributor.connect(signers.random)
        .setRplFeeAdminPortion(BigNumber.from(999)))
        .to.be.revertedWith(await protocol.yieldDistributor.ADMIN_ONLY_ERROR());
    });
  
    it("Admin can set ETH fee modifier", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers, rocketPool: rp } = setupData;
  
      let newFee = ethers.utils.parseEther("0.01");
      await expect(protocol.yieldDistributor.setEthFeeModifier(newFee))
        .to.not.be.reverted;
      
      let expectedFee = (await rp.networkFeesContract.getMaximumNodeFee()).add(newFee);
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthFeeRate())
        .equals(expectedFee);
      
      newFee = ethers.utils.parseEther("-0.01");
      await expect(protocol.yieldDistributor.setEthFeeModifier(newFee))
          .to.not.be.reverted;
        
      expectedFee = (await rp.networkFeesContract.getMaximumNodeFee()).add(newFee);
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthFeeRate())
          .equals(expectedFee);
    });

    it("Revert if ETH fee modifier set too high", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers, rocketPool: rp } = setupData;
  
      let newFee = (await protocol.yieldDistributor.MAX_ETH_FEE_MODIFIER()).add(ethers.utils.parseEther("0.1"));
      await expect(protocol.yieldDistributor.setEthFeeModifier(newFee))
        .to.be.revertedWith(await protocol.yieldDistributor.ETH_FEE_MODIFIER_OUT_OF_BOUNDS_ERROR());
      
      let expectedFee = (await rp.networkFeesContract.getMaximumNodeFee()).add(newFee)
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthFeeRate())
        .to.not.equal(expectedFee);
    });
    
    it("Revert if ETH fee modifier set too low", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers, rocketPool: rp } = setupData;

      const newFee = ((await protocol.yieldDistributor.MAX_ETH_FEE_MODIFIER()).add(ethers.utils.parseEther("0.1"))).mul(-1);
      await expect(protocol.yieldDistributor.setEthFeeModifier(newFee))
        .to.be.revertedWith(await protocol.yieldDistributor.ETH_FEE_MODIFIER_OUT_OF_BOUNDS_ERROR());
        
      const expectedFee = (await rp.networkFeesContract.getMaximumNodeFee()).add(newFee)
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthFeeRate())
          .to.not.equal(expectedFee);
    });

    it("Admin can set ETH fee admin portion", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      const newFee = .75 * await protocol.yieldDistributor.YIELD_FEE_MAX();
      await expect(protocol.yieldDistributor.setEthFeeAdminPortion(newFee))
        .to.not.be.reverted;
      
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthFeeAdminPortion())
        .equals(newFee);
    });
  
    it("Revert if ETH fee admin portion is out of bounds", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      const previousFee = await protocol.yieldDistributor.connect(signers.random).getEthFeeAdminPortion();

      const newFee = await protocol.yieldDistributor.YIELD_FEE_MAX() + 1;
      await expect(protocol.yieldDistributor.setEthFeeAdminPortion(newFee))
        .to.be.revertedWith(await protocol.yieldDistributor.ETH_FEE_ADMIN_PORTION_OUT_OF_BOUNDS_ERROR());
      
      await expect(await protocol.yieldDistributor.connect(signers.random).getEthFeeAdminPortion()).to.equal(previousFee);
    });

    it("Admin can set RPL fee portion", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      const newFee = .75 * await protocol.yieldDistributor.YIELD_FEE_MAX();
      await expect(protocol.yieldDistributor.setRplFeeAdminPortion(newFee))
        .to.not.be.reverted;
      
      await expect(await protocol.yieldDistributor.connect(signers.random).getRplFeeRate())
        .equals(BigNumber.from("750000000000000000"));
    });
    
  });

  it("Distributes fees appropriately", async function () {
    const setupData = await loadFixture(protocolFixture)
    const { protocol, signers, rocketPool: rp} = setupData;

    let mintAmount = ethers.utils.parseEther("100");
    await mintNodeSetRpl(setupData, signers.rplWhale, mintAmount);
    await mint_xrEth(setupData, signers.rplWhale, mintAmount);

    await protocol.whitelist.addOperator(signers.random.address);
    await protocol.whitelist.addOperator(signers.random2.address);
    await protocol.whitelist.addOperator(signers.random3.address);

    const yieldAmountEth = ethers.utils.parseEther("1");
    const yieldAmountRpl = ethers.utils.parseEther("1");

    console.log("Simulating yield of " + ethers.utils.formatEther(yieldAmountEth) + " ETH and " +
      ethers.utils.formatEther(yieldAmountRpl) + " RPL")

    // simulate yield from validator
    rp.rplContract.connect(signers.rplWhale)
      .transfer(protocol.yieldDistributor.address, yieldAmountRpl);
    signers.random.sendTransaction({ to: protocol.yieldDistributor.address, value: yieldAmountEth, gasLimit: 1000000 });
       
    const totalFee = yieldAmountEth.mul(await rp.networkFeesContract.getMaximumNodeFee());
    const operatorShare = totalFee.mul(
      ethers.utils.parseEther("1").sub(await protocol.yieldDistributor.getEthFeeAdminPortion())
    ).div(3); // 3 operators used in this test
    const adminShareEth = totalFee.mul(await protocol.yieldDistributor.getEthFeeAdminPortion());
    const adminShareRpl = yieldAmountRpl.mul(await protocol.yieldDistributor.getRplFeeRate())
      .div(ethers.utils.parseEther("1"));

    await expect(protocol.yieldDistributor.distributeRewards())
      .to.emit(protocol.yieldDistributor, "RewardDistributed")
      .withArgs([signers.random.address, operatorShare, BigNumber.from(0)])
      .to.emit(protocol.yieldDistributor, "RewardDistributed")
      .withArgs([signers.random2.address, operatorShare, BigNumber.from(0)])
      .to.emit(protocol.yieldDistributor, "RewardDistributed")
      .withArgs([signers.random3.address, operatorShare, BigNumber.from(0)])
      .to.emit(protocol.yieldDistributor, "RewardDistributed")
      .withArgs([signers.admin.address, adminShareEth, adminShareRpl])
      .and.to.changeEtherBalances(
        [signers.random.address, signers.random2.address, signers.random3.address, signers.admin.address],
        [operatorShare, operatorShare, operatorShare, adminShareEth]
      )
      .and.to.changeTokenBalance(
        protocol.xRPL, signers.admin.address, adminShareRpl
      );
    // should also send some amount to the DP (then OD), 
    // but this functionality is tested in test - depositPool.ts

    console.log("Distributed " + ethers.utils.formatEther(operatorShare) + " ETH to 3 operators.");
    console.log("Distributed " + ethers.utils.formatEther(adminShareEth) + " ETH and " +
      ethers.utils.formatEther(adminShareRpl) + " RPL to the admin.");
  });
  
});