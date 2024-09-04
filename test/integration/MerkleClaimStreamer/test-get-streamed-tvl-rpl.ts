import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../integration";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe("getStreamedTvlRpl()", async () => {
    describe("when timestamp > lastClaimTime", async () => {
        describe("When timeSinceLastClaim < streamingInterval", async () => {
            it("Should pass", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                const timestamp = (await ethers.provider.getBlock("latest")).timestamp
                const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval();

                const lastClaimTimeValue = ethers.utils.hexlify(ethers.BigNumber.from(timestamp).sub(streamingInterval.sub(1)));
                const lastClaimTimeSlot = ethers.BigNumber.from(69).toHexString();
                await ethers.provider.send("hardhat_setStorageAt", [
                    protocol.merkleClaimStreamer.address,
                    "0x"+ethers.utils.stripZeros(lastClaimTimeSlot),
                    ethers.utils.hexZeroPad(lastClaimTimeValue, 32)
                ]);

                const lastClaimTime = await protocol.merkleClaimStreamer.lastClaimTime();
                expect(lastClaimTime).equals(lastClaimTimeValue);

                const priorRplStreamAmountValue = ethers.utils.parseEther("1").toHexString();
                const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                await ethers.provider.send("hardhat_setStorageAt", [
                    protocol.merkleClaimStreamer.address,
                    "0x"+ethers.utils.stripZeros(priorRplStreamAmountSlot),
                    ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                ]);

                const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);


                const timeSinceLastClaim = ethers.BigNumber.from(timestamp).sub(lastClaimTime);
                expect(timeSinceLastClaim).lt(streamingInterval);

                const expectedAmount = (priorRplStreamAmount.mul(timeSinceLastClaim)).div(streamingInterval)

                expect(await protocol.merkleClaimStreamer.getStreamedTvlRpl()).equals(expectedAmount)
            })
        })

        describe("When timeSinceLastClaim == streamingInterval", async () => {
            it("Should pass", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                const timestamp = (await ethers.provider.getBlock("latest")).timestamp
                const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval();

                const lastClaimTimeValue = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.BigNumber.from(timestamp).sub(streamingInterval)), 32);
                const slot = ethers.BigNumber.from(69).toHexString();
                await ethers.provider.send("hardhat_setStorageAt", [
                    protocol.merkleClaimStreamer.address,
                    "0x"+ethers.utils.stripZeros(slot),
                    lastClaimTimeValue
                ]);

                const lastClaimTime = await protocol.merkleClaimStreamer.lastClaimTime();
                expect(lastClaimTime).equals(lastClaimTimeValue);

                const priorRplStreamAmountValue = ethers.utils.parseEther("1").toHexString();
                const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                await ethers.provider.send("hardhat_setStorageAt", [
                    protocol.merkleClaimStreamer.address,
                    "0x"+ethers.utils.stripZeros(priorRplStreamAmountSlot),
                    ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                ]);

                const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);


                const timeSinceLastClaim = ethers.BigNumber.from(timestamp).sub(lastClaimTime);
                expect(timeSinceLastClaim).eq(streamingInterval);


                const expectedAmount = (priorRplStreamAmount.mul(timeSinceLastClaim)).div(streamingInterval)
                expect(await protocol.merkleClaimStreamer.getStreamedTvlRpl()).equals(expectedAmount)
            })
        })

        describe("When timeSinceLastClaim > streamingInterval", async () => {
            it("Should pass", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                const timestamp = (await ethers.provider.getBlock("latest")).timestamp
                const lastClaimTime = await protocol.merkleClaimStreamer.lastClaimTime();

                const timeSinceLastClaim = ethers.BigNumber.from(timestamp).sub(lastClaimTime);
                const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval();
                expect(timeSinceLastClaim).gt(streamingInterval);

                const priorRplStreamAmountValue = ethers.utils.parseEther("1").toHexString();
                const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                await ethers.provider.send("hardhat_setStorageAt", [
                    protocol.merkleClaimStreamer.address,
                    "0x"+ethers.utils.stripZeros(priorRplStreamAmountSlot),
                    ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                ]);
                const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);

                const expectedAmount = (priorRplStreamAmount.mul(timeSinceLastClaim)).div(streamingInterval)
                expect(expectedAmount).not.equals(priorRplStreamAmount);

                expect(await protocol.merkleClaimStreamer.getStreamedTvlRpl()).equals(priorRplStreamAmount)
            })
        })
    })

    describe("when timestamp == lastClaimTime", async () => {
        describe("When timeSinceLastClaim < streamingInterval", async () => {
            it("Should pass", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                const timestamp = (await ethers.provider.getBlock("latest")).timestamp
                const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval();

                const lastClaimTimeValue = ethers.utils.hexlify(ethers.BigNumber.from(timestamp));
                const lastClaimTimeSlot = ethers.BigNumber.from(69).toHexString();
                await ethers.provider.send("hardhat_setStorageAt", [
                    protocol.merkleClaimStreamer.address,
                    "0x"+ethers.utils.stripZeros(lastClaimTimeSlot),
                    ethers.utils.hexZeroPad(lastClaimTimeValue, 32)
                ]);

                const lastClaimTime = await protocol.merkleClaimStreamer.lastClaimTime();
                expect(lastClaimTime).equals(lastClaimTimeValue);

                const priorRplStreamAmountValue = ethers.utils.parseEther("1").toHexString();
                const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                await ethers.provider.send("hardhat_setStorageAt", [
                    protocol.merkleClaimStreamer.address,
                    "0x"+ethers.utils.stripZeros(priorRplStreamAmountSlot),
                    ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                ]);

                const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);


                const timeSinceLastClaim = ethers.BigNumber.from(timestamp).sub(lastClaimTime);
                expect(timeSinceLastClaim).lt(streamingInterval);
                expect(timeSinceLastClaim).equals(0)

                const expectedAmount = (priorRplStreamAmount.mul(timeSinceLastClaim)).div(streamingInterval)

                expect(await protocol.merkleClaimStreamer.getStreamedTvlRpl()).equals(expectedAmount)
            })
        })

        describe.skip("Impossible Cases", async () => {
            describe("When timeSinceLastClaim == streamingInterval", async () => {
                it("Should pass", async () => {

                })
            })

            describe("When timeSinceLastClaim > streamingInterval", async () => {
                it("Should pass", async () => {

                })
            })
        })
    })

    describe("when timestamp < lastClaimTime", async () => {
        it("Should revert", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            const timestamp = (await ethers.provider.getBlock("latest")).timestamp

            const lastClaimTimeValue = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.BigNumber.from(timestamp * 2)), 32);
            const slot = ethers.BigNumber.from(69).toHexString();
            await ethers.provider.send("hardhat_setStorageAt", [
                protocol.merkleClaimStreamer.address,
                "0x"+ethers.utils.stripZeros(slot),
                lastClaimTimeValue
            ]);

            const lastClaimTime = await protocol.merkleClaimStreamer.lastClaimTime();
            expect(lastClaimTime).equals(lastClaimTimeValue);

            // should underflow
            await expect(protocol.merkleClaimStreamer.getStreamedTvlRpl()).to.be.rejectedWith("CALL_EXCEPTION")

        })
    })
})