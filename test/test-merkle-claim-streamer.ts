import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "./utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { wEth } from "../typechain-types/factories/contracts/Testing";
import { MerkleClaimStreamer } from "../typechain-types";

describe("Merkle Claim Streamer", async () => {
  let setupData: SetupData;
  let protocol: Protocol;
  let admin: SignerWithAddress;
  let nonAdmin: SignerWithAddress;
  let mcs: MerkleClaimStreamer;
  let rocketpool: RocketPool;
  beforeEach(async () => {
    setupData = await loadFixture(protocolFixture);
    protocol = setupData.protocol;
    admin = setupData.signers.admin;
    nonAdmin = setupData.signers.random;
    mcs = protocol.merkleClaimStreamer;
    rocketpool = setupData.rocketPool;
  })
  
  describe("when claims are disabled", async () => {
    beforeEach(async () => {
      await mcs.connect(admin).setMerkleClaimsEnabled(false);
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
      expect(mcs.connect(nonAdmin).setMerkleClaimsEnabled(true)).to.be.revertedWith('Can only be called by admin address!');
    })
    it("can submit claim if re-enabled", async () => {
      await mcs.connect(admin).setMerkleClaimsEnabled(true);
      expect(await mcs.merkleClaimsEnabled()).equals(true);

      const rewardIndex = [0];
      const amountRpl = [ethers.utils.parseEther("100")];
      const amountEth = [ethers.utils.parseEther("100")];
      const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]
      expect(mcs.submitMerkleClaim([rewardIndex], amountRpl, amountEth, proof)).to.not.be.reverted;
    });
  })

  describe("when claims are enabled", async () => {

    beforeEach(async () => {
      expect(await mcs.merkleClaimsEnabled()).equals(true);
      expect(await protocol.vCRPL.totalAssets()).equals(0);
      expect(await protocol.vCWETH.totalAssets()).equals(0);
    })

    it("only admin can disable", async () => {
      expect(mcs.connect(nonAdmin).setMerkleClaimsEnabled(false)).to.be.revertedWith('Can only be called by admin address!');
      expect(mcs.connect(admin).setMerkleClaimsEnabled(false)).to.not.be.reverted;
      expect(await mcs.merkleClaimsEnabled()).equals(false);
    })

    describe("when eth and rpl amount are both 0", async () => {
      it("cannot submit claim", async () => {
        const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]
        expect(await protocol.merkleClaimStreamer.submitMerkleClaim([0], [0], [0], proof)).to.be.revertedWith("ETH and RPL rewards were both zero")
      })
    })

    describe("when either eth or rpl amount is above 0", async () => {
      type ParamsType = { ethRewards: number; rplRewards: number; waitTime: number};
      [
          { ethRewards: .6, rplRewards: .4, waitTime: 1}, 
          { ethRewards: .1, rplRewards: .1, waitTime: 86400}, // 1 day in seconds
          { ethRewards: .5, rplRewards: .4, waitTime: 31556952000000000}, // ~1b years: earth becomes uninhabitable due to sun becoming red giant
          { ethRewards: .99, rplRewards: .01, waitTime: 2419200}, // 28 days in seconds
          { ethRewards: .99999, rplRewards: .00001, waitTime: 259200 }, // 3 days in seconds
          { ethRewards: 1, rplRewards: 0, waitTime: 5 },
          { ethRewards: 0, rplRewards: 1,  waitTime: 69 },
          { ethRewards: 69, rplRewards: 1,  waitTime: 0 },
          { ethRewards: 6969, rplRewards: 69,  waitTime: 0 },
      ].forEach((params: ParamsType) => {

        let rplRewards: BigNumber;
        let ethRewards: BigNumber;

        beforeEach(async () => {
          rplRewards = ethers.utils.parseEther('${params.rplRewards}')
          ethRewards = ethers.utils.parseEther('${params.rplRewards}')
        })

        it("can submit claim", async () => {
          const rewardIndex = [0];
          const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

          let originalTotalAssetsEth = await protocol.vCWETH.totalAssets();
          let originalTotalAssetsRpl = await protocol.vCRPL.totalAssets();

          //disable auto-mine of new blocks
          await ethers.provider.send("evm_setAutomine", [false]);

          await protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof);
          expect(await protocol.vCRPL.totalAssets()).equals(0); // no time has passed, so no tvl has been streamed
        
          const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval()
          
          // mine a block with above transactions
          let timestamp = (await ethers.provider.getBlock("latest")).timestamp;
          await ethers.provider.send("evm_mine", [timestamp+1]);
          timestamp = timestamp+1;
        
          expect(streamingInterval).equals(2419200); // 28 days in seconds

          expect(await rocketpool.rplContract.balanceOf(protocol.vCRPL.address)).equals(0);
          expect(await rocketpool.rplContract.balanceOf(protocol.operatorDistributor.address)).equals(0);

          // increase time by waitTime since claim
          await ethers.provider.send("evm_mine", [timestamp+params.waitTime]);
          let lastClaimTime = await protocol.merkleClaimStreamer.lastClaimTime();
          console.log("lastClaimTime", lastClaimTime);
          expect(lastClaimTime).equals((await ethers.provider.getBlock('latest')).timestamp - 86400);
          
          const expectedTreasuryPortionEth = await protocol.vCWETH.getTreasuryPortion(ethRewards); 
          const expectedTreasuryPortionRpl = await protocol.vCRPL.getTreasuryPortion(rplRewards); 
          const expectedOperatorPortionEth = await protocol.vCWETH.getOperatorPortion(ethRewards); 
          const expectedCommunityPortionEth = ethRewards.sub(expectedTreasuryPortionEth).sub(expectedOperatorPortionEth);
          const expectedCommunityPortionRpl = rplRewards.sub(expectedTreasuryPortionRpl);
          let expectedStreamedTVLEth = expectedCommunityPortionEth.mul(params.waitTime).div(streamingInterval);
          let expectedStreamedTVLRpl = expectedCommunityPortionEth.mul(params.waitTime).div(streamingInterval);
          let expectedTotalAssetsEth = originalTotalAssetsEth.add(expectedStreamedTVLEth);
          let expectedTotalAssetsRpl = originalTotalAssetsRpl.add(expectedStreamedTVLRpl);
          expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(expectedCommunityPortionEth);
          expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(expectedCommunityPortionRpl);
          expect(await protocol.merkleClaimStreamer.getStreamedTvlEth()).equals(expectedStreamedTVLEth);
          expect(await protocol.merkleClaimStreamer.getStreamedTvlRpl()).equals(expectedStreamedTVLRpl);
          expect(await protocol.vCWETH.totalAssets()).equals(expectedTotalAssetsEth);
          expect(await protocol.vCRPL.totalAssets()).equals(expectedTotalAssetsRpl);

          // re-enable automine
          await ethers.provider.send("evm_setAutomine", [true]);
        });
      })
    })
  })
});