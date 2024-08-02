import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "./test";
import { approvedSalt, approveHasSignedExitMessageSig, approveSalt, assertAddOperator, predictDeploymentAddress, prepareOperatorDistributionContract, whitelistUserServerSig } from "./utils/utils";
import { generateDepositData } from "./rocketpool/_helpers/minipool";

describe("SuperNodeAccount", function () {
    describe("SuperNodeAccount Admin Setters", function () {
        it("Admin can set lock threshold", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;

            const newLockThreshold = ethers.utils.parseEther("2");
            await superNode.connect(admin).setLockAmount(newLockThreshold);
            expect(await superNode.lockThreshold()).to.equal(newLockThreshold);
        });

        it("Admin can set lock-up time", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;
            const newLockUpTime = 30 * 24 * 60 * 60; // 30 days in seconds
            await superNode.connect(admin).setLockUpTime(newLockUpTime);
            expect(await superNode.lockUpTime()).to.equal(newLockUpTime);
        });

        it("Admin can set admin server signature expiry", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;
            const newExpiry = 2 * 24 * 60 * 60; // 2 days in seconds
            await superNode.connect(admin).setAdminServerSigExpiry(newExpiry);
            expect(await superNode.adminServerSigExpiry()).to.equal(newExpiry);
        });

        it("Admin can set bond amount", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;
            const newBond = ethers.utils.parseEther("10");
            await superNode.connect(admin).setBond(newBond);
            expect(await superNode.bond()).to.equal(newBond);
        });

        it("Admin can set minimum node fee", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;
            const newMinimumNodeFee = ethers.utils.parseEther("0.2");
            await superNode.connect(admin).setMinimumNodeFee(newMinimumNodeFee);
            expect(await superNode.minimumNodeFee()).to.equal(newMinimumNodeFee);
        });

        it("Non-admin cannot set lock threshold", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;
            const newLockThreshold = ethers.utils.parseEther("2");
            await expect(superNode.connect(random).setLockAmount(newLockThreshold)).to.be.revertedWith(
                "Can only be called by short timelock!"
            );
        });

        it("Non-admin cannot set lock-up time", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;
            const newLockUpTime = 30 * 24 * 60 * 60; // 30 days in seconds
            await expect(superNode.connect(random).setLockUpTime(newLockUpTime)).to.be.revertedWith(
                "Can only be called by short timelock!"
            );
        });

        it("Non-admin cannot set admin server signature expiry", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;
            const newExpiry = 2 * 24 * 60 * 60; // 2 days in seconds
            await expect(superNode.connect(random).setAdminServerSigExpiry(newExpiry)).to.be.revertedWith(
                "Can only be called by admin address!"
            );
        });

        it("Non-admin cannot set bond amount", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;
            const newBond = ethers.utils.parseEther("10");
            await expect(superNode.connect(random).setBond(newBond)).to.be.revertedWith("Can only be called by admin address!");
        });

        it("Non-admin cannot set minimum node fee", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;

            const newMinimumNodeFee = ethers.utils.parseEther("0.2");
            await expect(superNode.connect(random).setMinimumNodeFee(newMinimumNodeFee)).to.be.revertedWith(
                "Can only be called by admin address!"
            );
        });
    });

    describe("SuperNodeAccount Admin Setters", function () {
        it("Admin can set lock threshold", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;

            const newLockThreshold = ethers.utils.parseEther("2");
            await superNode.connect(admin).setLockAmount(newLockThreshold);
            expect(await superNode.lockThreshold()).to.equal(newLockThreshold);
        });

        it("Admin can set lock-up time", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;
            const newLockUpTime = 30 * 24 * 60 * 60; // 30 days in seconds
            await superNode.connect(admin).setLockUpTime(newLockUpTime);
            expect(await superNode.lockUpTime()).to.equal(newLockUpTime);
        });

        it("Admin can set admin server signature expiry", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;
            const newExpiry = 2 * 24 * 60 * 60; // 2 days in seconds
            await superNode.connect(admin).setAdminServerSigExpiry(newExpiry);
            expect(await superNode.adminServerSigExpiry()).to.equal(newExpiry);
        });

        it("Admin can set bond amount", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;
            const newBond = ethers.utils.parseEther("10");
            await superNode.connect(admin).setBond(newBond);
            expect(await superNode.bond()).to.equal(newBond);
        });

        it("Admin can set minimum node fee", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { admin } = signers;
            const newMinimumNodeFee = ethers.utils.parseEther("0.2");
            await superNode.connect(admin).setMinimumNodeFee(newMinimumNodeFee);
            expect(await superNode.minimumNodeFee()).to.equal(newMinimumNodeFee);
        });

        it("Non-admin cannot set lock threshold", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;
            const newLockThreshold = ethers.utils.parseEther("2");
            await expect(superNode.connect(random).setLockAmount(newLockThreshold)).to.be.revertedWith(
                "Can only be called by short timelock!"
            );
        });

        it("Non-admin cannot set lock-up time", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;
            const newLockUpTime = 30 * 24 * 60 * 60; // 30 days in seconds
            await expect(superNode.connect(random).setLockUpTime(newLockUpTime)).to.be.revertedWith(
                "Can only be called by short timelock!"
            );
        });

        it("Non-admin cannot set admin server signature expiry", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;
            const newExpiry = 2 * 24 * 60 * 60; // 2 days in seconds
            await expect(superNode.connect(random).setAdminServerSigExpiry(newExpiry)).to.be.revertedWith(
                "Can only be called by admin address!"
            );
        });

        it("Non-admin cannot set bond amount", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;
            const newBond = ethers.utils.parseEther("10");
            await expect(superNode.connect(random).setBond(newBond)).to.be.revertedWith("Can only be called by admin address!");
        });

        it("Non-admin cannot set minimum node fee", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { superNode } = protocol;
            const { random } = signers;

            const newMinimumNodeFee = ethers.utils.parseEther("0.2");
            await expect(superNode.connect(random).setMinimumNodeFee(newMinimumNodeFee)).to.be.revertedWith(
                "Can only be called by admin address!"
            );
        });
    });

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
        const {rawSalt, pepperedSalt} = await approvedSalt(3, signers.hyperdriver.address);

        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 2);
        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.hyperdriver);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await protocol.superNode.connect(signers.hyperdriver).createMinipool(config.validatorPubkey, config.validatorSignature, config.depositDataRoot, rawSalt, config.expectedMinipoolAddress, timestamp, sig, {
            value: ethers.utils.parseEther("1")
        });

        const lockedEth = await protocol.superNode.lockedEth(config.expectedMinipoolAddress);
        expect(lockedEth).to.equal(ethers.utils.parseEther("1"));

        const totalEthLocked = await protocol.superNode.totalEthLocked();
        expect(totalEthLocked).to.equal(ethers.utils.parseEther("1"));

        const subNodeOperator = await protocol.superNode.subNodeOperatorMinipools(signers.hyperdriver.address, 0);
        expect(subNodeOperator).to.equal('0x' + config.expectedMinipoolAddress);

        const lockStarted = await protocol.superNode.lockStarted(config.expectedMinipoolAddress);
        expect(lockStarted).to.be.gt(0);
    });

    it("success - users given supplying 3 as salt will result in different minipool addresses", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");

        const {rawSalt: rawSalt0, pepperedSalt: pepperedSalt0} = await approvedSalt(3, signers.random.address);
        const {rawSalt: rawSalt1, pepperedSalt: pepperedSalt1} = await approvedSalt(3, signers.random2.address);

        // proves subNodeOperators are using 3 as their salt value
        expect(3).equals(rawSalt0)
        expect(rawSalt0).equals(rawSalt1)

        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 4);
        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.random);
        await assertAddOperator(setupData, signers.random2);

        const depositData0 = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt0);
        const depositData1 = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt1);

        const config0 = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData0.depositData.pubkey,
            validatorSignature: depositData0.depositData.signature,
            depositDataRoot: depositData0.depositDataRoot,
            salt: pepperedSalt0,
            expectedMinipoolAddress: depositData0.minipoolAddress
        };

        const config1 = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData1.depositData.pubkey,
            validatorSignature: depositData1.depositData.signature,
            depositDataRoot: depositData1.depositDataRoot,
            salt: pepperedSalt1,
            expectedMinipoolAddress: depositData1.minipoolAddress
        };

        expect(config0.expectedMinipoolAddress).not.equal(config1.expectedMinipoolAddress);

        const { sig: sig0, timestamp: timestamp0 } = await approveHasSignedExitMessageSig(setupData, '0x' + config0.expectedMinipoolAddress, config0.salt);
        const { sig: sig1, timestamp: timestamp1 } = await approveHasSignedExitMessageSig(setupData, '0x' + config1.expectedMinipoolAddress, config1.salt);

        await expect(protocol.superNode.connect(signers.random).createMinipool(config0.validatorPubkey, config0.validatorSignature, config0.depositDataRoot, rawSalt0, config0.expectedMinipoolAddress, timestamp0, sig0, {
            value: ethers.utils.parseEther("1")
        })).to.not.be.reverted;

        await expect(protocol.superNode.connect(signers.random2).createMinipool(config1.validatorPubkey, config1.validatorSignature, config1.depositDataRoot, rawSalt1, config1.expectedMinipoolAddress, timestamp1, sig1, {
            value: ethers.utils.parseEther("1")
        })).to.not.be.reverted;;
    });

    it("fails - sig cannot be reused", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const {rawSalt, pepperedSalt} = await approvedSalt(3, signers.hyperdriver.address);

        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 5);
        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.hyperdriver);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt);

        const config = {
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await protocol.superNode.connect(signers.hyperdriver).createMinipool(config.validatorPubkey, config.validatorSignature, config.depositDataRoot, rawSalt, config.expectedMinipoolAddress, timestamp, sig, {
            value: ethers.utils.parseEther("1")
        });

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(config.validatorPubkey, config.validatorSignature, config.depositDataRoot, rawSalt, config.expectedMinipoolAddress, timestamp, sig, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("minipool already initialized");
    });

    it("fails - not whitelisted", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const {rawSalt, pepperedSalt} = await approvedSalt(3, signers.hyperdriver.address);

        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 1);
        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt);

        const config = {
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(config.validatorPubkey, config.validatorSignature, config.depositDataRoot, rawSalt, config.expectedMinipoolAddress, timestamp, sig, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("sub node operator must be whitelisted");
    });

    it("fails - bad predicted address", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const {rawSalt, pepperedSalt} = await approvedSalt(3, signers.hyperdriver.address);

        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 2);
        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.hyperdriver);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt);
        const badDepositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt.add(3));

        const config = {
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const badConfig = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: badDepositData.depositData.pubkey,
            validatorSignature: badDepositData.depositData.signature,
            depositDataRoot: badDepositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: badDepositData.minipoolAddress
        };

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        // this is not an intuitive fail message, but it is correct as it we sign invalid param data so it fails for bad sig
        // because the predicted address is incorrect. This may make increase future cli debugging times
        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(badConfig.validatorPubkey, badConfig.validatorSignature, badConfig.depositDataRoot, rawSalt, badConfig.expectedMinipoolAddress, timestamp, sig, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("signer must have permission from admin server role");
    });

    it("fails - forget to lock 1 eth", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const {rawSalt, pepperedSalt} = await approvedSalt(3, signers.hyperdriver.address);

        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
        await prepareOperatorDistributionContract(setupData, 2);
        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

        await assertAddOperator(setupData, signers.hyperdriver);

        const depositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt);

        const config = {
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(config.validatorPubkey, config.validatorSignature, config.depositDataRoot, rawSalt, config.expectedMinipoolAddress, timestamp, sig, {
            value: ethers.utils.parseEther("0")
        })).to.be.revertedWith("SuperNode: must set the message value to lockThreshold");
    });

    it("fails - no liquidity for given bond", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const {rawSalt, pepperedSalt} = await approvedSalt(3, signers.hyperdriver.address);


        const depositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt);

        const config = {
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);

        const {sig: sig2, timestamp: timestamp2} = await whitelistUserServerSig(setupData, signers.hyperdriver);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.hyperdriver.address, timestamp2, sig2)

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool(config.validatorPubkey, config.validatorSignature, config.depositDataRoot, rawSalt, config.expectedMinipoolAddress, timestamp, sig, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("NodeAccount: protocol must have enough rpl and eth");
    });
});