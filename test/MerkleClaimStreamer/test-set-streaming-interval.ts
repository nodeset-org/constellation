import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe.only("setStreamingInterval()", async () => {

    describe("When sender is admin", async () => {
        describe("When streaming interval is greater than 0", async () => {
            describe("When streaming interval is less than 365 days", async () => {
                describe("When new streaming inverval is different", async () => {
                    it("Should pass", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const initial = await protocol.merkleClaimStreamer.streamingInterval();
                        await protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval(1);
                        const final = await protocol.merkleClaimStreamer.streamingInterval();

                        expect(initial).not.equals(final);
                        expect(final).equals(1);
                    })
                })

                describe("When new streaming inverval is the same", async () => {
                    it("Should revert", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const initial = await protocol.merkleClaimStreamer.streamingInterval();
                        await expect(protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval(initial)).to.be.revertedWith("New streaming interval must be different");
                    })
                })
            })

            describe("When streaming interval is equal to 365 days", async () => {
                describe("When new streaming inverval is different", async () => {
                    it("Should pass", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const oneYearInSeconds = 60 * 60 * 24 * 365;

                        const initial = await protocol.merkleClaimStreamer.streamingInterval();
                        await protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval(oneYearInSeconds);
                        const final = await protocol.merkleClaimStreamer.streamingInterval();

                        expect(initial).not.equals(final);
                        expect(final).equals(oneYearInSeconds);
                    })
                })

                describe("When new streaming inverval is the same", async () => {
                    it("Should revert", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const oneYearInSeconds = 60 * 60 * 24 * 365;

                        const initial = await protocol.merkleClaimStreamer.streamingInterval();
                        await protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval(oneYearInSeconds);
                        const final = await protocol.merkleClaimStreamer.streamingInterval();

                        expect(initial).not.equals(final);
                        expect(final).equals(oneYearInSeconds);

                        await expect(protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval(oneYearInSeconds)).to.be.revertedWith("New streaming interval must be different");
                    })
                })
            })

            describe("When streaming interval is greater than 365 days", async () => {
                it("Should revert", async () => {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;

                    const oneYearInSeconds = 60 * 60 * 24 * 365;

                    await expect(protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval(oneYearInSeconds + 1)).to.be.revertedWith("New streaming interval must be > 0 seconds and <= 365 days");
                })
            })
        })

        describe("When streaming interval is equal to 0", async () => {
            it("Should revert", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                await expect(protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval(0)).to.be.revertedWith("New streaming interval must be > 0 seconds and <= 365 days");
            })
        })

        describe("When streaming interval is less than 0", async () => {
            it("Should reject", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                await expect(protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval(ethers.BigNumber.from("-1"))).to.be.rejectedWith("INVALID_ARGUMENT");
            })
        })
    })

    describe("When sender is not admin", async () => {
        it("Should revert", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            await expect(protocol.merkleClaimStreamer.connect(signers.random).setStreamingInterval(1)).to.be.revertedWith("Can only be called by admin address!");
        })
    })
})

