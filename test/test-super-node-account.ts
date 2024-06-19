import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "./test";
import { approveHasSignedExitMessageSig, assertAddOperator, countProxyCreatedEvents, predictDeploymentAddress, prepareOperatorDistributionContract } from "./utils/utils";
import { generateDepositData } from "./rocketpool/_helpers/minipool";

describe("SuperNodeAccount", function () {

    describe("Upgradability", async () => {
        it("Admin can update contract", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
    
            const initialAddress = protocol.superNode.address;
    
            const initialImpl = await protocol.superNode.getImplementation();
    
            const initialSlotValues = [];
    
            for (let i = 0; i < 1000; i++) {
                initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
            }
    
            const MockSuperNodeV2 = await ethers.getContractFactory("MockSuperNodeV2", signers.admin);
    
            const newSuperNode = await upgrades.upgradeProxy(protocol.superNode.address, MockSuperNodeV2, {
                kind: 'uups',
                unsafeAllow: ['constructor', 'state-variable-assignment', 'delegatecall', 'enum-definition', 'external-library-linking', 'missing-public-upgradeto', 'selfdestruct', 'state-variable-immutable', 'struct-definition']
            });
    
            expect(newSuperNode.address).to.equal(initialAddress);
    
            expect(await newSuperNode.getImplementation()).to.not.equal(initialImpl);
    
            expect(await newSuperNode.testUpgrade()).to.equal(0);
    
            for (let i = 0; i < 1000; i++) {
                expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
            }
        });
    })

    it("Run the MOAT (Mother Of all Atomic Transactions)", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const salt = 3;

        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 2);
        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.hyperdriver);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, salt);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const sig = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await protocol.superNode.connect(signers.hyperdriver).createMinipool(config, sig, {
            value: ethers.utils.parseEther("1")
        });

        const lockedEth = await protocol.superNode.lockedEth(config.expectedMinipoolAddress);
        expect(lockedEth).to.equal(ethers.utils.parseEther("1"));

        const totalEthLocked = await protocol.superNode.totalEthLocked();
        expect(totalEthLocked).to.equal(ethers.utils.parseEther("1"));

        const subNodeOperator = await protocol.superNode.subNodeOperatorMinipools(signers.hyperdriver.address, 0);
        expect(subNodeOperator).to.equal('0x'+config.expectedMinipoolAddress);

        const lockStarted = await protocol.superNode.lockStarted(config.expectedMinipoolAddress);
        expect(lockStarted).to.be.gt(0); 
    });

    it("fails - sig cannot be reused", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const salt = 3;

        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 5);
        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.hyperdriver);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, salt);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const sig = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await protocol.superNode.connect(signers.hyperdriver).createMinipool(config, sig, {
            value: ethers.utils.parseEther("1")
        });

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(config, sig, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("sig already used");
    });

    it("fails - not whitelisted", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const salt = 3;

        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 1);
        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(true);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, salt);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const sig = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(config, sig, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("sub node operator must be whitelisted");
    });

    it("fails - bad predicted address", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const salt = 3;

        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 2);
        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.hyperdriver);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, salt);
        const badDepositData = await generateDepositData(setupData.protocol.superNode.address, salt+3);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const badConfig = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: badDepositData.depositData.pubkey,
            validatorSignature: badDepositData.depositData.signature,
            depositDataRoot: badDepositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: badDepositData.minipoolAddress
        };

        const sig = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        // this is not an intuitive fail message, but it is correct as it we sign invalid param data so it fails for bad sig
        // because the predicted address is incorrect. This may make increase future cli debugging times
        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(badConfig, sig, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("signer must have permission from admin server role");
    });

    it("fails - forget to lock 1 eth", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const salt = 3;

        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 2);
        expect(await protocol.superNode.hasSufficentLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.hyperdriver);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, salt);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const sig = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(config, sig, {
            value: ethers.utils.parseEther("0")
        })).to.be.revertedWith("SuperNode: must lock 1 ether");
    });

    it("fails - no liquidity for given bond", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const salt = 3;

        const depositData = await generateDepositData(setupData.protocol.superNode.address, salt);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const sig = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(config, sig, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("NodeAccount: protocol must have enough rpl and eth");
    });
});