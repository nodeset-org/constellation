import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { protocolFixture } from '../integration';

describe('differing receiver', function () {
  it('can be toggled by admin, but not to the same value', async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers } = setupData;
    await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
    expect(await protocol.vCWETH.differingSenderRecipientEnabled()).equals(false);
    await expect(protocol.vCWETH.connect(signers.admin).setDifferingSenderRecipientEnabled(false)).to.be.revertedWith(
      'WETHVault: new differingSenderRecipientEnabled value must be different than existing value'
    );
    await expect(protocol.vCWETH.connect(signers.admin).setDifferingSenderRecipientEnabled(true)).to.not.be.reverted;
    expect(await protocol.vCWETH.differingSenderRecipientEnabled()).equals(true);
    await expect(protocol.vCWETH.connect(signers.admin).setDifferingSenderRecipientEnabled(true)).to.be.revertedWith(
      'WETHVault: new differingSenderRecipientEnabled value must be different than existing value'
    );

    expect(await protocol.vCRPL.differingSenderRecipientEnabled()).equals(false);
    await expect(protocol.vCRPL.connect(signers.admin).setDifferingSenderRecipientEnabled(false)).to.be.revertedWith(
      'RPLVault: new differingSenderRecipientEnabled value must be different than existing value'
    );
    await expect(protocol.vCRPL.connect(signers.admin).setDifferingSenderRecipientEnabled(true)).to.not.be.reverted;
    expect(await protocol.vCRPL.differingSenderRecipientEnabled()).equals(true);
    await expect(protocol.vCRPL.connect(signers.admin).setDifferingSenderRecipientEnabled(true)).to.be.revertedWith(
      'RPLVault: new differingSenderRecipientEnabled value must be different than existing value'
    );
  });

  it('cannot be updated by non-admin', async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers } = setupData;
    await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
    expect(await protocol.vCWETH.differingSenderRecipientEnabled()).equals(false);
    await expect(protocol.vCWETH.connect(signers.random).setDifferingSenderRecipientEnabled(true)).to.be.revertedWith(
      'Can only be called by admin address!'
    );

    await protocol.vCWETH.connect(signers.admin).setDifferingSenderRecipientEnabled(true);
    await expect(protocol.vCWETH.connect(signers.random).setDifferingSenderRecipientEnabled(false)).to.be.revertedWith(
      'Can only be called by admin address!'
    );

    expect(await protocol.vCRPL.differingSenderRecipientEnabled()).equals(false);
    await expect(protocol.vCRPL.connect(signers.random).setDifferingSenderRecipientEnabled(true)).to.be.revertedWith(
      'Can only be called by admin address!'
    );

    await protocol.vCRPL.connect(signers.admin).setDifferingSenderRecipientEnabled(true);
    await expect(protocol.vCRPL.connect(signers.random).setDifferingSenderRecipientEnabled(false)).to.be.revertedWith(
      'Can only be called by admin address!'
    );
  });

  it('can be different receiver than sender if setting is true', async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;
    await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
    await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
    // WETH
    await protocol.vCWETH.connect(signers.admin).setDifferingSenderRecipientEnabled(true);

    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther('2') });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther('2'));
    await expect(
      protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther('1'), signers.random.address)
    ).to.not.be.reverted;
    await expect(
      protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther('1'), signers.ethWhale.address)
    ).to.not.be.reverted;

    // RPL
    await protocol.vCRPL.connect(signers.admin).setDifferingSenderRecipientEnabled(true);

    await rocketPool.rplContract
      .connect(signers.rplWhale)
      .approve(protocol.vCRPL.address, ethers.utils.parseEther('2'));
    await expect(
      protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther('1'), signers.random.address)
    ).to.not.be.reverted;
    await expect(
      protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther('1'), signers.ethWhale.address)
    ).to.not.be.reverted;
  });

  it('cannot be different receiver than sender if setting is false', async () => {
    const setupData = await loadFixture(protocolFixture);
    const { protocol, signers, rocketPool } = setupData;
    await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
    await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
    // WETH
    expect(await protocol.vCWETH.differingSenderRecipientEnabled()).equals(false);

    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther('2') });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther('2'));
    await expect(
      protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther('1'), signers.random.address)
    ).to.be.revertedWith('caller must be receiver');
    await expect(
      protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther('1'), signers.ethWhale.address)
    ).to.not.be.reverted;

    // RPL
    expect(await protocol.vCRPL.differingSenderRecipientEnabled()).equals(false);

    await rocketPool.rplContract
      .connect(signers.rplWhale)
      .approve(protocol.vCRPL.address, ethers.utils.parseEther('2'));
    await expect(
      protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther('1'), signers.random.address)
    ).to.be.revertedWith('caller must be receiver');
    await expect(
      protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther('1'), signers.rplWhale.address)
    ).to.not.be.reverted;
  });
});
