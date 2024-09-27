import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../integration/integration";
import hre from "hardhat";
import { increaseEVMTime } from "../utils/utils";

describe("Test Admin Tasks", function () {
    describe("When task calldata matches expected protocol calldata", async () => {
        it("Should pass - setStreamingInterval", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setStreamingInterval", { newStreamingInterval: "1000" });
            const tx = await protocol.merkleClaimStreamer.connect(signers.admin).setStreamingInterval("1000");
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setMerkleClaimsEnabled", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setMerkleClaimsEnabled", { isEnabled: true });
            const tx = await protocol.merkleClaimStreamer.connect(signers.admin).setMerkleClaimsEnabled(true);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setRplStakeRebalanceEnabled", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setRplStakeRebalanceEnabled", { newValue: false });
            const tx = await protocol.operatorDistributor.connect(signers.admin).setRplStakeRebalanceEnabled(false);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setMinipoolProcessingEnabled", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setMinipoolProcessingEnabled", { newValue: false });
            const tx = await protocol.operatorDistributor.connect(signers.admin).setMinipoolProcessingEnabled(false);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setDepositsEnabledSuperNodeAccount", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setDepositsEnabledSuperNodeAccount", { newValue: true });
            const tx = await protocol.vCRPL.connect(signers.admin).setDepositsEnabled(true);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setMaxValidators", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setMaxValidators", { maxValidators: "500" });
            const tx = await protocol.superNode.connect(signers.admin).setMaxValidators("500");
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setSmoothingPoolParticipation", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            await increaseEVMTime(24 * 60 * 60 * 60 * 60)

            const calldata = await hre.run("setSmoothingPoolParticipation", { useSmoothingPool: false });
            const tx = await protocol.superNode.connect(signers.admin).setSmoothingPoolParticipation(false);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setAdminServerCheck", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setAdminServerCheck", { newValue: true });
            const tx = await protocol.superNode.connect(signers.admin).setAdminServerCheck(true);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setBond", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setBond", { newBond: "1000000000000000000" });
            const tx = await protocol.superNode.connect(signers.admin).setBond("1000000000000000000");
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setMinimumNodeFee", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("setMinimumNodeFee", { newMinimumNodeFee: "100000000000000000" });
            const tx = await protocol.superNode.connect(signers.admin).setMinimumNodeFee("100000000000000000");
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - invalidateAllOutstandingSigs", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const calldata = await hre.run("invalidateAllOutstandingSigs");
            const tx = await protocol.whitelist.connect(signers.admin).invalidateAllOutstandingSigs();
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - invalidateSingleOutstandingSig", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const nodeOperator = signers.random.address;
            const calldata = await hre.run("invalidateSingleOutstandingSig", { nodeOperator });
            const tx = await protocol.whitelist.connect(signers.admin).invalidateSingleOustandingSig(nodeOperator);
            expect(tx.data).hexEqual(calldata[0]);
        });
    });
});
