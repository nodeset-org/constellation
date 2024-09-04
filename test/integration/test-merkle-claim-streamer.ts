import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "./integration";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { wEth } from "../../typechain-types/factories/contracts/Testing";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe("Merkle Claim Streamer", async () => {
  let setupData: SetupData;
  let protocol: Protocol;
  let admin: SignerWithAddress;
  let nonAdmin: SignerWithAddress;
  let mcs: MerkleClaimStreamer;
  let rocketpool: RocketPool;
  let rocketVault: RocketVault;
  let rocketMDM: RocketMerkleDistributorMainnet;
  beforeEach(async () => {
    setupData = await loadFixture(protocolFixture);
    protocol = setupData.protocol;
    admin = setupData.signers.admin;
    nonAdmin = setupData.signers.random;
    mcs = protocol.merkleClaimStreamer;
    rocketpool = setupData.rocketPool;
    rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress())
    await rocketMDM.useMock();
    rocketVault = await ethers.getContractAt("RocketVault", await rocketpool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));
    await rocketVault.useMock();
  })



  describe("streaming interval is changed", async () => {
    it("can be changed by admin to something above zero and up to 365 days", async () => {
      await expect(mcs.connect(admin).setStreamingInterval(69)).to.not.be.reverted;
      expect(await mcs.streamingInterval()).equals(69)

      await expect(mcs.connect(admin).setStreamingInterval(31536000)).to.not.be.reverted;
      expect(await mcs.streamingInterval()).equals(31536000)

      await expect(mcs.connect(admin).setStreamingInterval(1)).to.not.be.reverted;
      expect(await mcs.streamingInterval()).equals(1)
    })

    it("cannot be set out of bounds", async () => {
      await expect(mcs.connect(admin).setStreamingInterval(0)).to.be.revertedWith("New streaming interval must be > 0 seconds and <= 365 days");
      expect(await mcs.streamingInterval()).not.equals(0)

      await expect(mcs.connect(admin).setStreamingInterval(31536001)).to.be.revertedWith("New streaming interval must be > 0 seconds and <= 365 days");
      expect(await mcs.streamingInterval()).not.equals(31536001)
    })

    it("cannot be changed by nonAdmin", async () => {
      await expect(mcs.connect(nonAdmin).setStreamingInterval(69)).to.be.revertedWith("Can only be called by admin address!");
      expect(await mcs.streamingInterval()).not.equals(69)

      await expect(mcs.connect(nonAdmin).setStreamingInterval(31536000)).to.be.revertedWith("Can only be called by admin address!");
      expect(await mcs.streamingInterval()).not.equals(31536000)

      await expect(mcs.connect(nonAdmin).setStreamingInterval(1)).to.be.revertedWith("Can only be called by admin address!");
      expect(await mcs.streamingInterval()).not.equals(1)
    })

    it.skip("can submit merkle claim after changing streaming interval time", async () => {
      await assertMerkleClaim(rocketVault, setupData, ethers.utils.parseEther("1"),ethers.utils.parseEther("1"), 69);

      await expect(mcs.connect(admin).setStreamingInterval(6969)).to.not.be.reverted;
      expect(await mcs.streamingInterval()).equals(6969)

      await assertMerkleClaim(rocketVault, setupData, ethers.utils.parseEther("1"),ethers.utils.parseEther("1"), 69);
    })
  })

  describe("when claims are disabled", async () => {
    beforeEach(async () => {
      await expect(await mcs.connect(admin).setMerkleClaimsEnabled(false)).to.not.be.reverted;
      expect(await mcs.merkleClaimsEnabled()).equals(false);
    })
    it("cannot submit claim", async () => {
      const rewardIndex = [0];
      const amountRpl = [ethers.utils.parseEther("100")];
      const amountEth = [ethers.utils.parseEther("100")];
      const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]
      expect(mcs.submitMerkleClaim([rewardIndex], amountRpl, amountEth, proof)).to.be.revertedWith("Merkle claims are disabled");
    });
    it("only admin can re-enable", async () => {
      await expect(mcs.connect(nonAdmin).setMerkleClaimsEnabled(true)).to.be.revertedWith('Can only be called by admin address!');
    })
    it("can submit claim if re-enabled", async () => {
      await mcs.connect(admin).setMerkleClaimsEnabled(true);
      expect(await mcs.merkleClaimsEnabled()).equals(true);

      await assertMerkleClaim(rocketVault, setupData, ethers.utils.parseEther("1"), ethers.utils.parseEther("1"), 1);
    });
  })

  describe("when claims are enabled", async () => {

    beforeEach(async () => {
      expect(await mcs.merkleClaimsEnabled()).equals(true);
      expect(await protocol.vCRPL.totalAssets()).equals(0);
      expect(await protocol.vCWETH.totalAssets()).equals(0);
    })

    it("only admin can disable", async () => {
      await expect(mcs.connect(nonAdmin).setMerkleClaimsEnabled(false)).to.be.revertedWith('Can only be called by admin address!');
      await expect(mcs.connect(admin).setMerkleClaimsEnabled(false)).to.not.be.reverted;
      expect(await mcs.merkleClaimsEnabled()).equals(false);
    })

    describe("when eth and rpl amount are both 0", async () => {
      it("cannot submit claim", async () => {
        rocketMDM.disableMock();
        const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]
        await expect(protocol.merkleClaimStreamer.submitMerkleClaim([0], [0], [0], proof)).to.be.revertedWith("Invalid amount")
      })
    })

    describe("when either eth or rpl amount is above 0", async () => {
      type ParamsType = { ethRewards: number; rplRewards: number; waitTime: number};
      [
        { ethRewards: 28, rplRewards: 28, waitTime: 86400},
        { ethRewards: .6, rplRewards: .4, waitTime: 1},
        { ethRewards: .1, rplRewards: .1, waitTime: 86400}, // 1 day in seconds
        { ethRewards: .5, rplRewards: .4, waitTime: 31556952000}, // 1000 years
        { ethRewards: .99, rplRewards: .01, waitTime: 2419200}, // 28 days in seconds
        { ethRewards: .99999, rplRewards: .00001, waitTime: 259200 }, // 3 days in seconds
        { ethRewards: 1, rplRewards: 0, waitTime: 5 },
        { ethRewards: 0, rplRewards: 1,  waitTime: 69 },
        { ethRewards: 69, rplRewards: 1,  waitTime: 0 },
        { ethRewards: 0, rplRewards: 69,  waitTime: 0 },
      ].forEach((params: ParamsType) => {

        let rplRewards = ethers.utils.parseEther(`${params.rplRewards}`)
        let ethRewards = ethers.utils.parseEther(`${params.ethRewards}`)

        it(`can submit claim with ethRewards=${ethRewards}, rplRewards=${rplRewards}, waitTime=${params.waitTime}`, async () => {
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, params.waitTime);
        });

        it.skip(`can submit multiple claims with ethRewards=${ethRewards}, rplRewards=${rplRewards}, waitTime=${params.waitTime}`, async () => {
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, params.waitTime);
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, params.waitTime);
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, params.waitTime);
        })

        it.skip(`can submit multiple claims in the same block with ethRewards=${ethRewards}, rplRewards=${rplRewards}, waitTime=${params.waitTime}`, async () => {
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, 0);
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, 0);
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, 0);
        })

        it.skip(`can submit multiple claims with different wait times and ethRewards=${ethRewards}, rplRewards=${rplRewards}}`, async () => {
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, 69);
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, 2419200);
          await assertMerkleClaim(rocketVault, setupData, ethRewards, rplRewards, 31556952000);
        })
      })
    })
  })
});

async function assertMerkleClaim(rocketVault: RocketVault, setupData: SetupData, ethRewards: BigNumber, rplRewards: BigNumber, waitTime: number ) {
  try {
    let protocol = setupData.protocol;
    let rocketpool = setupData.rocketPool;
    let mcs = protocol.merkleClaimStreamer;

    // send rewards to merkle distributor
    await rocketpool.rplContract.connect(setupData.signers.rplWhale).transfer(rocketVault.address, rplRewards);
    await setupData.signers.ethWhale.sendTransaction({
      to: rocketVault.address,
      value: ethRewards
    })
    const rewardIndex = [0];
    const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

    let originalTotalAssetsEth = await protocol.vCWETH.totalAssets();
    let originalTotalAssetsRpl = await protocol.vCRPL.totalAssets();

    const streamingInterval = await mcs.streamingInterval()

    const expectedTreasuryPortionEth = await protocol.vCWETH.getTreasuryPortion(ethRewards);
    const expectedTreasuryPortionRpl = await protocol.vCRPL.getTreasuryPortion(rplRewards);
    const expectedOperatorPortionEth = await protocol.vCWETH.getOperatorPortion(ethRewards);
    const expectedCommunityPortionEth = ethRewards.sub(expectedTreasuryPortionEth).sub(expectedOperatorPortionEth);
    const expectedCommunityPortionRpl = rplRewards.sub(expectedTreasuryPortionRpl);

    //disable auto-mine of new blocks
    await ethers.provider.send("evm_setAutomine", [false]);

    let claimTimestamp = (await ethers.provider.getBlock("latest")).timestamp+1
    let claimTx = mcs.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof)
    // no time has passed, so no tvl has been streamed
    expect(await protocol.vCRPL.totalAssets()).equals(originalTotalAssetsRpl);
    expect(await protocol.vCWETH.totalAssets()).equals(originalTotalAssetsEth);

    // mine a block with the merkle claim transaction above
    await ethers.provider.send("evm_mine", [claimTimestamp]);
    await expect(claimTx).to.not.be.revertedWith("");
    const tx = await ((await claimTx).wait())
    expect((await ethers.provider.getBlock(tx.blockHash)).timestamp).equals(claimTimestamp)
    expect((await ethers.provider.getBlock("latest")).timestamp).equals(claimTimestamp);
    expect(await mcs.queryFilter(mcs.filters.MerkleClaimSubmitted(claimTimestamp))).not.equals([]);

    // todo: these don't work
    //expect(claimTx).to.emit(mcs, "ASDF");
    // expect(claimTx).to.emit(mcs, "MerkleClaimSubmitted")
    //   .withArgs(claimTimestamp, ethRewards, rplRewards, expectedTreasuryPortionEth, expectedOperatorPortionEth, expectedTreasuryPortionRpl)
    console.log("claimTimestamp", claimTimestamp)
    console.log("lastclaimtime()", await mcs.lastClaimTime())
    expect(await mcs.lastClaimTime()).equals(claimTimestamp);

    expect(await rocketpool.rplContract.balanceOf(protocol.vCRPL.address)).equals(0);
    expect(await rocketpool.rplContract.balanceOf(protocol.operatorDistributor.address)).equals(0);

    if(waitTime > 0) {
      // mine another block to wait some time
      await ethers.provider.send("evm_mine", [waitTime + claimTimestamp]);
    }

    let expectedStreamedTVLEth = streamingInterval.gt(waitTime) ? expectedCommunityPortionEth.mul(waitTime).div(streamingInterval) : expectedCommunityPortionEth;
    let expectedStreamedTVLRpl = streamingInterval.gt(waitTime) ? expectedCommunityPortionRpl.mul(waitTime).div(streamingInterval) : expectedCommunityPortionRpl;
    let expectedTotalAssetsEth = originalTotalAssetsEth.add(expectedStreamedTVLEth);
    let expectedTotalAssetsRpl = originalTotalAssetsRpl.add(expectedStreamedTVLRpl);
    expect(await mcs.priorEthStreamAmount()).equals(expectedCommunityPortionEth);
    expect(await mcs.priorRplStreamAmount()).equals(expectedCommunityPortionRpl);
    expect(await mcs.getStreamedTvlEth()).equals(expectedStreamedTVLEth);
    expect(await mcs.getStreamedTvlRpl()).equals(expectedStreamedTVLRpl);
    expect(await protocol.vCWETH.totalAssets()).equals(expectedTotalAssetsEth);
    expect(await protocol.vCRPL.totalAssets()).equals(expectedTotalAssetsRpl);
  }
  // re-enable automine
  finally { await ethers.provider.send("evm_setAutomine", [true]); }
}