import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe("setMerkleClaimsEnabled()", async () => {

    describe("When sender is admin", async () => {
        it("Should Pass", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            const initial = await protocol.merkleClaimStreamer.merkleClaimsEnabled();
            await expect(protocol.merkleClaimStreamer.connect(signers.admin).setMerkleClaimsEnabled(!initial)).to.not.be.reverted;
            const final = await protocol.merkleClaimStreamer.merkleClaimsEnabled();

            expect(initial).not.equals(final);
        })
    })

    describe("When sender is not admin", async () => {
        it("Shoudl revert", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;
            await expect(protocol.merkleClaimStreamer.connect(signers.random).setMerkleClaimsEnabled(false)).to.be.revertedWith("Can only be called by admin address!");

        })
    })
})