import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { removeFeesOnBothVaults, removeFeesOnRPLVault, upgradePriceFetcherToMock } from "./utils/utils";

describe.only("xrETH", function () {

  // add tests for deposit and withdraw
  it("fail - cannot deposit 1 eth at 50 rpl and 500 rpl, tvl ratio returns ~10% if tvlCoverageRatio is 15%", async () => {
    const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

    const depositAmountEth = ethers.utils.parseEther("1");
    await signers.ethWhale.sendTransaction({ to: protocol.depositPool.address, value: depositAmountEth });

    await removeFeesOnRPLVault(protocol);

    const depositAmountRpl = ethers.utils.parseEther("500");
    await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, depositAmountRpl);
    await protocol.vCRPL.connect(signers.rplWhale).deposit(depositAmountRpl, signers.rplWhale.address);

    const totalAssetETH = await protocol.vCWETH.totalAssets();
    expect(totalAssetETH).equals(depositAmountEth);

    const totalAssetRPL = await protocol.vCRPL.totalAssets();
    expect(totalAssetRPL).equals(depositAmountRpl);

    await upgradePriceFetcherToMock(protocol, ethers.utils.parseEther("50"));

    const tvlRatio = await protocol.vCWETH.tvlRatioEthRpl();
    expect(tvlRatio).equals(ethers.utils.parseEther("0.1"));

    await expect(protocol.vCWETH.connect(signers.ethWhale).deposit(depositAmountEth, signers.ethWhale.address)).to.be.revertedWith("insufficient RPL coverage");
  })

  it("success - can deposit 5 eth at 50 rpl and 500 rpl, tvl ratio returns ~15% if tvlCoverageRatio is 15%", async () => {
    const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

    const depositAmountEth = ethers.utils.parseEther("5");
    await signers.ethWhale.sendTransaction({ to: protocol.depositPool.address, value: depositAmountEth });

    await removeFeesOnBothVaults(protocol);

    const depositAmountRpl = ethers.utils.parseEther("500");
    await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, depositAmountRpl);
    await protocol.vCRPL.connect(signers.rplWhale).deposit(depositAmountRpl, signers.rplWhale.address);

    const totalAssetETH = await protocol.vCWETH.totalAssets();
    expect(totalAssetETH).equals(depositAmountEth);

    const totalAssetRPL = await protocol.vCRPL.totalAssets();
    expect(totalAssetRPL).equals(depositAmountRpl);

    await upgradePriceFetcherToMock(protocol, ethers.utils.parseEther("50"));

    const tvlRatio = await protocol.vCWETH.tvlRatioEthRpl();
    expect(tvlRatio).equals(ethers.utils.parseEther("0.5"));

    await protocol.wETH.connect(signers.ethWhale).deposit({ value: depositAmountEth });
    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, depositAmountEth);
    await protocol.vCWETH.connect(signers.ethWhale).deposit(depositAmountEth, signers.ethWhale.address);

    const totalAssetETHAfterDeposit = await protocol.vCWETH.totalAssets();

    expect(totalAssetETHAfterDeposit).equals(depositAmountEth.mul(2));
  });

  describe("admin functions", () => {
    it("success - admin can set tvlCoverageRatio", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      const tvlCoverageRatio = ethers.utils.parseEther("0.1542069");
      await protocol.vCWETH.setRplCoverageRatio(tvlCoverageRatio);

      const tvlCoverageRatioFromContract = await protocol.vCWETH.rplCoverageRatio();
      expect(tvlCoverageRatioFromContract).equals(tvlCoverageRatio);
    });

    it("fail - non-admin cannot set tvlCoverageRatio", async () => {
      const { protocol, signers } = await loadFixture(protocolFixture);

      const tvlCoverageRatio = ethers.utils.parseEther("0.1542069");
      await expect(protocol.vCWETH.connect(signers.ethWhale).setRplCoverageRatio(tvlCoverageRatio)).to.be.revertedWith("Can only be called by admin address!");
    });
  });

});