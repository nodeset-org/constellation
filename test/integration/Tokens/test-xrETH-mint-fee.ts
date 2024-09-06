import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { protocolFixture } from '../integration';
import { ethers } from 'hardhat';

describe('xrETH Mint Fee', async function () {
  it('Assess the same fee when using deposit() and mint()', async function () {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers } = setupData;

    // add between 1 and 10 random amount of ETH to total supply so it's not 0
    let randValue = Math.floor(Math.random() * 9 + 1);
    console.log('adding', randValue.toString(), 'ETH to supply');
    let depositAmount = ethers.utils.parseEther(randValue.toString());
    protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmount });
    protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmount);
    expect(await protocol.vCWETH.connect(signers.ethWhale).deposit(depositAmount, signers.ethWhale.address)).to.not.be
      .reverted;

    // add between 1 and 10 random amount of ETH to TVL
    randValue = Math.floor(Math.random() * 9 + 1);
    console.log('adding', randValue.toString(), 'ETH to TVL');
    const tx = {
      to: protocol.operatorDistributor.address,
      value: ethers.utils.parseEther(randValue.toString()),
    };
    expect(await signers.ethWhale.sendTransaction(tx)).to.not.be.reverted;

    // set 100% liquidity reserve so we can redeem 100% of the first deposit
    await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther('1'));

    // Deposit enough for 1 share using deposit()
    depositAmount = await protocol.vCWETH.previewMint(ethers.utils.parseEther('1'));
    expect(await protocol.vCWETH.previewDeposit(depositAmount)).equals(ethers.utils.parseEther('1'));
    console.log('depositing', depositAmount.toString());
    protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmount });
    protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmount);
    expect(await protocol.vCWETH.connect(signers.ethWhale).deposit(depositAmount, signers.ethWhale.address)).to.not.be
      .reverted;
    const sharesWithDeposit = await protocol.vCWETH.balanceOf(signers.ethWhale.address);

    console.log('redeem', sharesWithDeposit.toString(), 'shares');
    // redeem the shares again to reset xrETH balance
    expect(
      await protocol.vCWETH
        .connect(signers.ethWhale)
        .redeem(sharesWithDeposit, signers.ethWhale.address, signers.ethWhale.address)
    ).to.not.be.reverted;
    expect(await protocol.vCWETH.balanceOf(signers.ethWhale.address)).to.equal(0);

    // Mint 1 share using mint()
    console.log('mint');
    depositAmount = await protocol.vCWETH.previewMint(ethers.utils.parseEther('1'));
    expect(await protocol.vCWETH.previewDeposit(depositAmount)).equals(ethers.utils.parseEther('1'));
    protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmount });
    protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmount);
    expect(await protocol.vCWETH.connect(signers.ethWhale).mint(ethers.utils.parseEther('1'), signers.ethWhale.address))
      .to.not.be.reverted;
    const sharesWithMint = await protocol.vCWETH.balanceOf(signers.ethWhale.address);

    expect(sharesWithDeposit).equals(sharesWithMint);
  });
});
