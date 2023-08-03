import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { removeFeesOnRPLVault, upgradePriceFetcherToMock } from "./utils/utils";

describe.only("xrETH", function () {

  // add tests for deposit and withdraw

  it("success - deposits 1 eth at 50 rpl and 500 rpl, tvl ratio returns ~10%", async () => {
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
  })


});