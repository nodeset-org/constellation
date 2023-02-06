import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

export async function mintNodeSetRpl(setupData: SetupData, from: SignerWithAddress, amount: BigNumber) {
  const { protocol, rocketPool: rp } = setupData;
  
  await expect(rp.rplContract.connect(from).approve(protocol.xRPL.address, amount))
    .to.emit(rp.rplContract, "Approval")
    .withArgs(from.address, protocol.xRPL.address, amount);
  
  return protocol.xRPL.connect(from).mint(from.address, amount);
}

describe("xRPL", function () {

  describe("Mints", function () {

    it("Revert mint below minimum amount", async function () {
      const setupData = await loadFixture(protocolFixture);

      let amount = (await setupData.protocol.xrETH.getMinimumStakeAmount()).sub(BigNumber.from(1));

      await expect(mintNodeSetRpl(setupData, setupData.signers.rplWhale, amount))
        .to.be.revertedWith(await setupData.protocol.xRPL.getMinimumStakeError());
    });

    it("Revert mint if sender doesn't send enough RPL", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = await protocol.xRPL.getMinimumStakeAmount();

      await expect(mintNodeSetRpl(setupData, signers.random, amount))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Mints >= minimum succeed", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = await protocol.xRPL.getMinimumStakeAmount();

      await expect(mintNodeSetRpl(setupData, signers.rplWhale, amount))
        .to.emit(protocol.xRPL, "Transfer").withArgs("0x0000000000000000000000000000000000000000", signers.rplWhale, amount)
        .and.to.changeTokenBalance(
          protocol.xRPL,
          signers.rplWhale.address,
          amount
        );
    });
  });

  describe("Transfers", function () {

    it("Holder can send token", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mintNodeSetRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;
  
      await expect(protocol.xRPL.connect(signers.rplWhale).transfer(signers.random.address, amount))
        .to.changeTokenBalances(protocol.xRPL, [signers.rplWhale, signers.random], [amount.mul(-1), amount])
        .and.to.emit(protocol.xRPL, "Transfer").withArgs(signers.rplWhale.address, signers.random.address, amount);
    });

    it("Unapproved address cannot send token on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mintNodeSetRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;
  
      await expect(protocol.xRPL.connect(signers.random).transferFrom(signers.rplWhale.address, signers.random.address, amount))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Approved address can send token on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mintNodeSetRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;
  
      protocol.xRPL.connect(signers.rplWhale).approve(signers.random.address, amount);
  
      await expect(protocol.xRPL.connect(signers.random).transferFrom(signers.rplWhale.address, signers.random.address, amount))
        .to.changeTokenBalances(protocol.xRPL, [signers.rplWhale, signers.random], [amount.mul(-1), amount])
        .and.to.emit(protocol.xRPL, "Transfer").withArgs(signers.rplWhale.address, signers.random.address, amount);
    });
  });
 
  describe("Burns", function () {

    it("Revert if burn amount exceeds balance", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = ethers.utils.parseEther("100");
      await expect(mintNodeSetRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;

      await expect(protocol.xRPL.connect(signers.rplWhale).burn(amount.add(1)))
        .to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("Burn reverts if the DepositPool lacks enough RPL", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;

      let amount = ethers.utils.parseEther("100");
      await expect(mintNodeSetRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;

      await expect(protocol.xRPL.connect(signers.rplWhale).burn(amount))
        .to.be.revertedWith(await protocol.depositPool.NOT_ENOUGH_RPL_ERROR());
    });
    
    it("Burn gives equivalent amount of RPL when redemption value is 1", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;

      let mintAmount = ethers.utils.parseEther("100");
      await expect(mintNodeSetRpl(setupData, signers.rplWhale, mintAmount)).to.not.be.reverted;

      let burnAmount = (await protocol.depositPool.getMaxRplBalance()).sub(1);

      await expect(protocol.xRPL.connect(signers.rplWhale).burn(burnAmount))
        .to.changeTokenBalance(protocol.xRPL, signers.rplWhale, burnAmount.mul(-1))
        .to.changeTokenBalance(rp.rplContract, signers.rplWhale, burnAmount)
        .and.to.emit(protocol.xRPL, "Transfer").withArgs(signers.rplWhale.address, "0x0000000000000000000000000000000000000000", burnAmount);
    });

    it("Unapproved address cannot burn on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mintNodeSetRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;
  
      await expect(protocol.xrETH.connect(signers.random).burnFrom(signers.rplWhale.address, amount))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Approved address can burn on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let mintAmount = ethers.utils.parseEther("100");
      await expect(mintNodeSetRpl(setupData, signers.rplWhale, mintAmount)).to.not.be.reverted;
  
      let burnAmount = (await protocol.depositPool.getMaxRplBalance()).sub(1);
      protocol.xRPL.connect(signers.rplWhale).approve(signers.random.address, burnAmount);    
  
      await expect(protocol.xRPL.connect(signers.random).burnFrom(signers.rplWhale.address, burnAmount))
        .to.changeTokenBalance(protocol.xRPL, signers.rplWhale, burnAmount.mul(-1))
        .to.changeTokenBalance(rp.rplContract, signers.rplWhale, burnAmount)
        .and.to.emit(protocol.xRPL, "Transfer").withArgs(signers.rplWhale.address, "0x0000000000000000000000000000000000000000", burnAmount);
    });
  }); 
  
  it("Redemption value updates after yield is distributed", async function () {
    const setupData = await loadFixture(protocolFixture)
    const { protocol, signers, rocketPool: rp} = setupData;

    let mintAmount = ethers.utils.parseEther("100");
    await mintNodeSetRpl(setupData, signers.rplWhale, mintAmount);
    
    // simulate yield from validator
    rp.rplContract.connect(signers.rplWhale)
      .transfer(protocol.yieldDistributor.address, ethers.utils.parseEther("1"));
    

    await expect(protocol.yieldDistributor.distributeRewards());

    // TODO
    
    expect.fail();
  });

  it("Mint gives appropriate redemption value after yield", async function () {
    expect.fail();
  });

  it("Burn gives appropriate redemption value after yield", async function () {
    expect.fail();
  });

});