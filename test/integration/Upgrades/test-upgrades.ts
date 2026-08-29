import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../integration";

describe("Contract Upgrades", function () {
    it("Admin can upgrade SuperNodeAccount", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const initialAddress = protocol.superNode.address;

        const initialImpl = await protocol.superNode.getImplementation();

        const initialSlotValues = [];

        for (let i = 0; i < 1000; i++) {
            initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
        }

        const SuperNodeAccountV2Logic = await ethers.getContractFactory("MockSuperNodeAccountV2", signers.admin);

        // Upgrade protocol.superNodeAccount to V2
        const newSuperNodeAccount = await upgrades.upgradeProxy(protocol.superNode.address, SuperNodeAccountV2Logic, {
            kind: 'uups',
            unsafeAllow: ['constructor']
        });

        // Check that the proxy address has not changed
        expect(newSuperNodeAccount.address).to.equal(initialAddress);

        // Check that the implementation address has changed
        expect(await newSuperNodeAccount.getImplementation()).to.not.equal(initialImpl);

        // Execute new function
        expect(await newSuperNodeAccount.testUpgrade()).to.equal(0);

        // Verify storage slots remain the same
        for (let i = 0; i < 1000; i++) {
            expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
        }
    });

    it("Admin can upgrade VCRPL", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const initialAddress = protocol.vCRPL.address;

        const initialImpl = await protocol.vCRPL.getImplementation();

        const initialSlotValues = [];

        for (let i = 0; i < 1000; i++) {
            initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
        }

        const VCRPLV2Logic = await ethers.getContractFactory("MockRPLVaultV2", signers.admin);

        // Upgrade protocol.vCRPL to V2
        const newVCRPL = await upgrades.upgradeProxy(protocol.vCRPL.address, VCRPLV2Logic, {
            kind: 'uups',
            unsafeAllow: ['constructor']
        });

        // Check that the proxy address has not changed
        expect(newVCRPL.address).to.equal(initialAddress);

        // Check that the implementation address has changed
        expect(await newVCRPL.getImplementation()).to.not.equal(initialImpl);

        // Execute new function
        expect(await newVCRPL.testUpgrade()).to.equal(0);

        // Verify storage slots remain the same
        for (let i = 0; i < 1000; i++) {
            expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
        }
    });

    it("Admin can upgrade PoAOracle", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const initialAddress = protocol.oracle.address;

        const initialImpl = await protocol.oracle.getImplementation();

        const initialSlotValues = [];

        for (let i = 0; i < 1000; i++) {
            initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
        }

        const PoAOracleV2Logic = await ethers.getContractFactory("MockPoAConstellationOracleV2", signers.admin);

        // Upgrade protocol.oracle to V2
        const newPoAOracle = await upgrades.upgradeProxy(protocol.oracle.address, PoAOracleV2Logic, {
            kind: 'uups',
            unsafeAllow: ['constructor']
        });

        // Check that the proxy address has not changed
        expect(newPoAOracle.address).to.equal(initialAddress);

        // Check that the implementation address has changed
        expect(await newPoAOracle.getImplementation()).to.not.equal(initialImpl);

        // Execute new function
        expect(await newPoAOracle.testUpgrade()).to.equal(0);

        // Verify storage slots remain the same
        for (let i = 0; i < 1000; i++) {
            expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
        }
    });

    it("Admin can upgrade OperatorDistributor", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const initialAddress = protocol.operatorDistributor.address;

        const initialImpl = await protocol.operatorDistributor.getImplementation();

        const initialSlotValues = [];

        for (let i = 0; i < 1000; i++) {
            initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
        }

        const OperatorDistributorV2Logic = await ethers.getContractFactory("MockOperatorDistributorV2", signers.admin);

        // Upgrade protocol.operatorDistributor to V2
        const newOperatorDistributor = await upgrades.upgradeProxy(protocol.operatorDistributor.address, OperatorDistributorV2Logic, {
            kind: 'uups',
            unsafeAllow: ['constructor']
        });

        // Check that the proxy address has not changed
        expect(newOperatorDistributor.address).to.equal(initialAddress);

        // Check that the implementation address has changed
        expect(await newOperatorDistributor.getImplementation()).to.not.equal(initialImpl);

        // Execute new function
        expect(await newOperatorDistributor.testUpgrade()).to.equal(0);

        // Verify storage slots remain the same
        for (let i = 0; i < 1000; i++) {
            expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
        }
    });

    it("Admin can upgrade MerkleClaimStreamer", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const initialAddress = protocol.merkleClaimStreamer.address;

        const initialImpl = await protocol.merkleClaimStreamer.getImplementation();

        const initialSlotValues = [];

        for (let i = 0; i < 1000; i++) {
            initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
        }

        const MerkleClaimStreamerV2Logic = await ethers.getContractFactory("MockMerkleClaimStreamerV2", signers.admin);

        // Upgrade protocol.merkleClaimStreamer to V2
        const newMerkleClaimStreamer = await upgrades.upgradeProxy(protocol.merkleClaimStreamer.address, MerkleClaimStreamerV2Logic, {
            kind: 'uups',
            unsafeAllow: ['constructor']
        });

        // Check that the proxy address has not changed
        expect(newMerkleClaimStreamer.address).to.equal(initialAddress);

        // Check that the implementation address has changed
        expect(await newMerkleClaimStreamer.getImplementation()).to.not.equal(initialImpl);

        // Execute new function
        expect(await newMerkleClaimStreamer.testUpgrade()).to.equal(0);

        // Verify storage slots remain the same
        for (let i = 0; i < 1000; i++) {
            expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
        }
    });

    it("Admin can upgrade VCWETH", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const initialAddress = protocol.vCWETH.address;

        const initialImpl = await protocol.vCWETH.getImplementation();

        const initialSlotValues = [];

        for (let i = 0; i < 1000; i++) {
            initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
        }

        const VCWETHV2Logic = await ethers.getContractFactory("MockWETHVaultV2", signers.admin);

        // Upgrade protocol.vCWETH to V2
        const newVCWETH = await upgrades.upgradeProxy(protocol.vCWETH.address, VCWETHV2Logic, {
            kind: 'uups',
            unsafeAllow: ['constructor']
        });

        // Check that the proxy address has not changed
        expect(newVCWETH.address).to.equal(initialAddress);

        // Check that the implementation address has changed
        expect(await newVCWETH.getImplementation()).to.not.equal(initialImpl);

        // Execute new function
        expect(await newVCWETH.testUpgrade()).to.equal(0);

        // Verify storage slots remain the same
        for (let i = 0; i < 1000; i++) {
            expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
        }
    });
});
