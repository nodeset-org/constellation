import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

export async function mintYaspRpl(setupData: SetupData, from: SignerWithAddress, amount: BigNumber) {
  const { protocol, rocketPool: rp } = setupData;
  
  await expect(rp.rplContract.connect(from).approve(protocol.yaspRPL.address, amount))
    .to.emit(rp.rplContract, "Approval")
    .withArgs(from.address, protocol.yaspRPL.address, amount);
  
  return protocol.yaspRPL.connect(from).mint(from.address, amount);
}

describe("yaspRPL", function () {

  describe("Mints", function () {

    it("Revert mint below minimum amount", async function () {
      const setupData = await loadFixture(protocolFixture);

      let amount = (await setupData.protocol.yaspETH.getMinimumStakeAmount()).sub(BigNumber.from(1));

      await expect(mintYaspRpl(setupData, setupData.signers.rplWhale, amount))
        .to.be.revertedWith(await setupData.protocol.yaspRPL.getMinimumStakeError());
    });

    it("Revert mint if sender doesn't send enough RPL", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = await protocol.yaspRPL.getMinimumStakeAmount();

      await expect(mintYaspRpl(setupData, signers.random, amount))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Mints >= minimum succeed", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = await protocol.yaspRPL.getMinimumStakeAmount();

      await expect(mintYaspRpl(setupData, signers.rplWhale, amount))
        .to.emit(protocol.yaspRPL, "Transfer").withArgs("0x0000000000000000000000000000000000000000", signers.rplWhale, amount)
        .and.to.changeTokenBalance(
          protocol.yaspRPL,
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
      await expect(mintYaspRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;
  
      await expect(protocol.yaspRPL.connect(signers.rplWhale).transfer(signers.random.address, amount))
        .to.changeTokenBalances(protocol.yaspRPL, [signers.rplWhale, signers.random], [amount.mul(-1), amount])
        .and.to.emit(protocol.yaspRPL, "Transfer").withArgs(signers.rplWhale.address, signers.random.address, amount);
    });

    it("Unapproved address cannot send token on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mintYaspRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;
  
      await expect(protocol.yaspRPL.connect(signers.random).transferFrom(signers.rplWhale.address, signers.random.address, amount))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Approved address can send token on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mintYaspRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;
  
      protocol.yaspRPL.connect(signers.rplWhale).approve(signers.random.address, amount);
  
      await expect(protocol.yaspRPL.connect(signers.random).transferFrom(signers.rplWhale.address, signers.random.address, amount))
        .to.changeTokenBalances(protocol.yaspRPL, [signers.rplWhale, signers.random], [amount.mul(-1), amount])
        .and.to.emit(protocol.yaspRPL, "Transfer").withArgs(signers.rplWhale.address, signers.random.address, amount);
    });
  });
 
  describe("Burns", function () {

    it("Revert if burn amount exceeds balance", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = ethers.utils.parseEther("100");
      await expect(mintYaspRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;

      await expect(protocol.yaspRPL.connect(signers.rplWhale).burn(amount.add(1)))
        .to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("Burn reverts if the DepositPool lacks enough RPL", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;

      let amount = ethers.utils.parseEther("100");
      await expect(mintYaspRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;

      await expect(protocol.yaspRPL.connect(signers.rplWhale).burn(amount))
        .to.be.revertedWith(await protocol.depositPool.NOT_ENOUGH_RPL_ERROR());
    });
    
    it("Burn gives equivalent amount of RPL when redemption value is 1", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;

      let mintAmount = ethers.utils.parseEther("100");
      await expect(mintYaspRpl(setupData, signers.rplWhale, mintAmount)).to.not.be.reverted;

      let burnAmount = (await protocol.depositPool.getMaxRplBalance()).sub(1);

      await expect(protocol.yaspRPL.connect(signers.rplWhale).burn(burnAmount))
        .to.changeTokenBalance(protocol.yaspRPL, signers.rplWhale, burnAmount.mul(-1))
        .to.changeTokenBalance(rp.rplContract, signers.rplWhale, burnAmount)
        .and.to.emit(protocol.yaspRPL, "Transfer").withArgs(signers.rplWhale.address, "0x0000000000000000000000000000000000000000", burnAmount);
    });

    it("Unapproved address cannot burn on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mintYaspRpl(setupData, signers.rplWhale, amount)).to.not.be.reverted;
  
      await expect(protocol.yaspETH.connect(signers.random).burnFrom(signers.rplWhale.address, amount))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Approved address can burn on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture)
      const { protocol, signers, rocketPool: rp} = setupData;
  
      let mintAmount = ethers.utils.parseEther("100");
      await expect(mintYaspRpl(setupData, signers.rplWhale, mintAmount)).to.not.be.reverted;
  
      let burnAmount = (await protocol.depositPool.getMaxRplBalance()).sub(1);
      protocol.yaspRPL.connect(signers.rplWhale).approve(signers.random.address, burnAmount);    
  
      await expect(protocol.yaspRPL.connect(signers.random).burnFrom(signers.rplWhale.address, burnAmount))
        .to.changeTokenBalance(protocol.yaspRPL, signers.rplWhale, burnAmount.mul(-1))
        .to.changeTokenBalance(rp.rplContract, signers.rplWhale, burnAmount)
        .and.to.emit(protocol.yaspRPL, "Transfer").withArgs(signers.rplWhale.address, "0x0000000000000000000000000000000000000000", burnAmount);
    });
  }); 
  
  it("Redemption value updates after yield is distributed", async function () {
    const setupData = await loadFixture(protocolFixture)
    const { protocol, signers, rocketPool: rp} = setupData;

    let mintAmount = ethers.utils.parseEther("100");
    await mintYaspRpl(setupData, signers.rplWhale, mintAmount);
    
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