import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../integration/integration";
import hre from "hardhat";

describe("Test Timelock Tasks", function () {
    describe("When task calldata matches expected timelock protocol calldata", async () => {
        it("Should pass - authorizeUpgrade", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const upgrader = signers.admin.address;
            const calldata = await hre.run("authorizeUpgrade", { upgrader });
           // const tx = await protocol.treasury.connect(signers.admin)._authorizeUpgrade(upgrader);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setTreasuryFeeRplVault", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const treasuryFee = "500";
            const calldata = await hre.run("setTreasuryFeeRplVault", { treasuryFee });
            const tx = await protocol.vCRPL.connect(signers.admin).setTreasuryFee(treasuryFee);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setMintFee", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const newMintFee = "300";
            const calldata = await hre.run("setMintFee", { newMintFee });
            const tx = await protocol.vCWETH.connect(signers.admin).setMintFee(newMintFee);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setNodeOperatorFee", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const nodeOperatorFee = "200";
            const calldata = await hre.run("setNodeOperatorFee", { nodeOperatorFee });
            const tx = await protocol.vCWETH.connect(signers.admin).setNodeOperatorFee(nodeOperatorFee);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setProtocolFees", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const nodeOperatorFee = "200";
            const treasuryFee = "100";
            const calldata = await hre.run("setProtocolFees", { nodeOperatorFee, treasuryFee });
            const tx = await protocol.vCWETH.connect(signers.admin).setProtocolFees(nodeOperatorFee, treasuryFee);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setLiquidityReservePercentWETHVault", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const liquidityReservePercent = "10";
            const calldata = await hre.run("setLiquidityReservePercentWETHVault", { liquidityReservePercent });
            const tx = await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(liquidityReservePercent);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setMinWethRplRatio", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const minWethRplRatio = "15";
            const calldata = await hre.run("setMinWethRplRatio", { minWethRplRatio });
            const tx = await protocol.vCRPL.connect(signers.admin).setMinWethRplRatio(minWethRplRatio);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setMaxWethRplRatio", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const maxWethRplRatio = "50";
            const calldata = await hre.run("setMaxWethRplRatio", { maxWethRplRatio });
            const tx = await protocol.vCWETH.connect(signers.admin).setMaxWethRplRatio(maxWethRplRatio);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setLockAmount", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const newLockThreshold = "1000000";
            const calldata = await hre.run("setLockAmount", { newLockThreshold });
            const tx = await protocol.superNode.connect(signers.admin).setLockAmount(newLockThreshold);
            expect(tx.data).hexEqual(calldata[0]);
        });

        it("Should pass - setLiquidityReservePercentRPLVault", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const liquidityReservePercent = "20";
            const calldata = await hre.run("setLiquidityReservePercentRPLVault", { liquidityReservePercent });
            const tx = await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(liquidityReservePercent);
            expect(tx.data).hexEqual(calldata[0]);
        });
    });
});
