import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

export async function mint_xrEth(setupData: SetupData, from: SignerWithAddress, amount: BigNumber) {
  const { protocol, signers } = setupData;
    
  return from.sendTransaction({ to: protocol.xrETH.address, value: amount, gasLimit: 1000000 });
}

describe("xrETH", function () {

  describe("Mint", function () {

    it("Mins below minimum revert", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = (await protocol.xrETH.getMinimumStakeAmount()).sub(BigNumber.from(1));
      await expect(mint_xrEth(setupData, signers.random, amount))
        .to.be.revertedWith(await protocol.xrETH.getMinimumStakeError());
    });

    it("Mints >= minimum succeed", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = ethers.utils.parseEther("100");
      const tx = mint_xrEth(setupData, signers.random, amount);
      await expect(tx).to.changeEtherBalance(signers.random, amount.mul(-1));
      await expect(tx).to.changeTokenBalance(protocol.xrETH, signers.random, amount);
      await expect(tx).to.emit(protocol.xrETH, "Transfer").withArgs("0x0000000000000000000000000000000000000000", signers.random.address, amount);
    });
  });
  
  describe("Transfer", function () {
    it("Holder can send token", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mint_xrEth(setupData, signers.random, amount)).to.not.be.reverted;
  
      const tx = protocol.xrETH.connect(signers.random).transfer(signers.random2.address, amount);
      await expect(tx).to.changeTokenBalances(protocol.xrETH, [signers.random, signers.random2], [amount.mul(-1), amount]);
      await expect(tx).to.emit(protocol.xrETH, "Transfer").withArgs(signers.random.address, signers.random2.address, amount);
    });
  
    it("Unapproved address cannot send token on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mint_xrEth(setupData, signers.random, amount)).to.not.be.reverted;
  
      await expect(protocol.xrETH.connect(signers.random2).transferFrom(signers.random.address, signers.random2.address, amount))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Approved address can send token on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mint_xrEth(setupData, signers.random, amount)).to.not.be.reverted;
  
      protocol.xrETH.connect(signers.random).approve(signers.random2.address, amount);
  
      const tx = protocol.xrETH.connect(signers.random2).transferFrom(signers.random.address, signers.random2.address, amount);

      await expect(tx).to.changeTokenBalances(protocol.xrETH, [signers.random, signers.random2], [amount.mul(-1), amount]);
      await expect(tx).to.emit(protocol.xrETH, "Transfer").withArgs(signers.random.address, signers.random2.address, amount);
    });
  });

  describe("Burn", function () {
    it("Revert if burn amount exceeds balance", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = ethers.utils.parseEther("100");

      await expect(mint_xrEth(setupData, signers.random, amount)).to.not.be.reverted;

      await expect(protocol.xrETH.connect(signers.random).burn(amount.add(1)))
        .to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("Burn reverts if the DepositPool lacks enough ETH", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let amount = ethers.utils.parseEther("100");
      await expect(mint_xrEth(setupData, signers.random, amount)).to.not.be.reverted;
    
      await expect(protocol.xrETH.connect(signers.random).burn(amount))
        .to.be.revertedWith(await protocol.depositPool.NOT_ENOUGH_ETH_ERROR());
    });
   
    it("Valid burn gives equivalent amount of ETH when redemption value is 1", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;

      let mintAmount = ethers.utils.parseEther("100");
      await expect(mint_xrEth(setupData, signers.random, mintAmount)).to.not.be.reverted;

      let burnAmount = (await protocol.depositPool.getMaxEthBalance()).sub(1);

      const tx = protocol.xrETH.connect(signers.random).burn(burnAmount);
      await expect(tx).to.changeTokenBalance(protocol.xrETH, signers.random, burnAmount.mul(-1));
      await expect(tx).to.changeEtherBalance(signers.random, burnAmount);
      await expect(tx).to.emit(protocol.xrETH, "Transfer").withArgs(signers.random.address, "0x0000000000000000000000000000000000000000", burnAmount);
    });

    it("Unapproved address cannot burn on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      let amount = ethers.utils.parseEther("100");
      await expect(mint_xrEth(setupData, signers.random, amount)).to.not.be.reverted;
  
      await expect(protocol.xrETH.connect(signers.random2).burnFrom(signers.random.address, amount))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Approved address can burn on behalf of other address", async function () {
      const setupData = await loadFixture(protocolFixture);
      const { protocol, signers } = setupData;
  
      let mintAmount = ethers.utils.parseEther("100");
      await expect(mint_xrEth(setupData, signers.random, mintAmount)).to.not.be.reverted;
  
      let burnAmount = (await protocol.depositPool.getMaxEthBalance()).sub(1);
      protocol.xrETH.connect(signers.random).approve(signers.random2.address, burnAmount);    
  
      const tx = protocol.xrETH.connect(signers.random2).burnFrom(signers.random.address, burnAmount);
      await expect(tx).to.changeTokenBalance(protocol.xrETH, signers.random, burnAmount.mul(-1));
      await expect(tx).to.changeEtherBalance(signers.random, burnAmount)
      await expect(tx).to.emit(protocol.xrETH, "Transfer").withArgs(signers.random.address, "0x0000000000000000000000000000000000000000", burnAmount);
    });
  });  

  it("Redemption value adjusts correctly for yield", async function () {
    expect.fail();
  });
});