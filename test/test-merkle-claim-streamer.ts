import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "./utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { wEth } from "../typechain-types/factories/contracts/Testing";
import { MerkleClaimStreamer } from "../typechain-types";

describe("Merkle Claim Streamer", function () {
  let setupData: SetupData;
  let protocol: Protocol;
  let admin: SignerWithAddress;
  let mcs: MerkleClaimStreamer;
  beforeEach(async () => {
    setupData = await loadFixture(protocolFixture);
    protocol = setupData.protocol;
    admin = setupData.signers.admin;
    mcs = protocol.merkleClaimStreamer;
  })
  
  //if merkle claims are disabled, can't claim
  it("cannot claim if disabled", async () => {
    await mcs.connect(admin).setMerkleClaimsEnabled(false);
    expect(await mcs.merkleClaimsEnabled()).equals(false);

    const rewardIndex = [0];
    const amountRpl = [ethers.utils.parseEther("100")];
    const amountEth = [ethers.utils.parseEther("100")];
    const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]
    expect(await mcs.submitMerkleClaim([rewardIndex], amountRpl, amountEth, proof)).to.be.revertedWith("Merkle claims are disabled");
  });
  
});