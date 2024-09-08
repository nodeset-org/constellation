import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { protocolFixture } from '../integration';
import { ethers } from 'hardhat';

describe('xrETH First Mint', async function () {
  it.skip('previewMint() and previewDeposit() work correctly when TVL > 0 and totalSupply() == 0', async function () {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers } = setupData;

    // add between 1 and 10 random amount of ETH to TVL
    const randValue = 1; //Math.floor(Math.random() * 9 + 1);
    console.log('adding', randValue.toString(), 'ETH to TVL');
    const tx = {
      to: protocol.operatorDistributor.address,
      value: ethers.utils.parseEther(randValue.toString()),
    };
    expect(await signers.ethWhale.sendTransaction(tx)).to.not.be.reverted;

    // Deposit enough for 1 share using deposit()
    console.log('fee', await protocol.vCWETH.getMintFeePortion(ethers.utils.parseEther('1')));
    console.log('total supply', await protocol.vCWETH.totalSupply());
    console.log('tvl', await protocol.vCWETH.totalAssets());
    console.log('previewMint', await protocol.vCWETH.previewMint(ethers.utils.parseEther('1')));
    console.log('previewDeposit', await protocol.vCWETH.previewDeposit(ethers.utils.parseEther('1')));
    let depositAmount = await protocol.vCWETH.previewMint(ethers.utils.parseEther('1'));
    expect(await protocol.vCWETH.previewDeposit(depositAmount)).equals(ethers.utils.parseEther('1'));
    console.log('depositing', depositAmount.toString());
    protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmount });
    protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmount);
    expect(await protocol.vCWETH.connect(signers.ethWhale).deposit(depositAmount, signers.ethWhale.address)).to.not.be
      .reverted;

    const xrETHMinted = await protocol.vCWETH.balanceOf(signers.ethWhale.address);
    console.log('xrETH minted', xrETHMinted.toString());
    expect(xrETHMinted).equals(await protocol.vCWETH.convertToShares(depositAmount));

    depositAmount = await protocol.vCWETH.previewMint(ethers.utils.parseEther('1'));
    expect(await protocol.vCWETH.previewDeposit(depositAmount)).equals(ethers.utils.parseEther('1'));
  });
});

describe('xRPL First Mint', async function () {
  it.skip('previewMint() and previewDeposit() work correctly when TVL > 0 and totalSupply() == 0', async function () {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;

    // add between 1 and 10 random amount of ETH to TVL
    const randValue = 1; //Math.floor(Math.random() * 9 + 1);
    console.log('adding', randValue.toString(), 'RPL to TVL');
    await rocketPool.rplContract
      .connect(signers.rplWhale)
      .transfer(protocol.operatorDistributor.address, ethers.utils.parseEther(randValue.toString()));

    // Deposit enough for 1 share using deposit()
    console.log('total supply', await protocol.vCRPL.totalSupply());
    console.log('tvl', await protocol.vCRPL.totalAssets());
    console.log('previewMint', await protocol.vCRPL.previewMint(ethers.utils.parseEther('1')));
    console.log('previewDeposit', await protocol.vCRPL.previewDeposit(ethers.utils.parseEther('1')));
    let depositAmount = await protocol.vCRPL.previewMint(ethers.utils.parseEther('1'));
    expect(await protocol.vCRPL.previewDeposit(depositAmount)).equals(ethers.utils.parseEther('1'));
    console.log('depositing', depositAmount.toString());
    rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, depositAmount);
    expect(await protocol.vCRPL.connect(signers.rplWhale).deposit(depositAmount, signers.rplWhale.address)).to.not.be
      .reverted;

    const xRPLMinted = await protocol.vCRPL.balanceOf(signers.rplWhale.address);
    console.log('xRPL minted', xRPLMinted.toString());
    expect(xRPLMinted).equals(await protocol.vCRPL.convertToShares(depositAmount));

    depositAmount = await protocol.vCRPL.previewMint(ethers.utils.parseEther('1'));
    expect(await protocol.vCRPL.previewDeposit(depositAmount)).equals(ethers.utils.parseEther('1'));
  });
});
