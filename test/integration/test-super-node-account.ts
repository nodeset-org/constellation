import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "./integration";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator, increaseEVMTime, predictDeploymentAddress, prepareOperatorDistributionContract, whitelistUserServerSig } from "../utils/utils";
import { generateDepositData } from "../rocketpool/_helpers/minipool";

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

        it.skip("TODO: check permissions on delegate upgrades", async function () {
        });
    });


    it("Run the MOAT (Mother Of all Atomic Transactions)", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const { rawSalt, pepperedSalt } = await approvedSalt(3, signers.hyperdriver.address);

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

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, signers.hyperdriver.address, '0x' + config.expectedMinipoolAddress, config.salt);

        await protocol.superNode.connect(signers.hyperdriver).createMinipool(
            {
                validatorPubkey: config.validatorPubkey,
                validatorSignature: config.validatorSignature,
                depositDataRoot: config.depositDataRoot,
                salt: rawSalt,
                expectedMinipoolAddress: config.expectedMinipoolAddress,
                sig: sig,
            },
            {
                value: ethers.utils.parseEther("1")
            });

        const lockedEth = await protocol.superNode.lockedEth(config.expectedMinipoolAddress);
        expect(lockedEth).to.equal(ethers.utils.parseEther("1"));

        const minipoolData = await protocol.superNode.minipoolData('0x' + config.expectedMinipoolAddress);
        expect(minipoolData.subNodeOperator).to.equal(signers.hyperdriver.address);
        expect(minipoolData.ethTreasuryFee).to.equal(await protocol.vCWETH.treasuryFee());
        expect(minipoolData.noFee).to.equal(await protocol.vCWETH.nodeOperatorFee());
        expect(minipoolData.index).to.equal(ethers.BigNumber.from(0));

    });

    it("success - users given supplying 3 as salt will result in different minipool addresses", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");

        const { rawSalt: rawSalt0, pepperedSalt: pepperedSalt0 } = await approvedSalt(3, signers.random.address);
        const { rawSalt: rawSalt1, pepperedSalt: pepperedSalt1 } = await approvedSalt(3, signers.random2.address);

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

        const { sig: sig0, timestamp: timestamp0 } = await approveHasSignedExitMessageSig(setupData, signers.random.address, '0x' + config0.expectedMinipoolAddress, config0.salt);
        const { sig: sig1, timestamp: timestamp1 } = await approveHasSignedExitMessageSig(setupData, signers.random2.address, '0x' + config1.expectedMinipoolAddress, config1.salt);

        await expect(protocol.superNode.connect(signers.random).createMinipool({
            validatorPubkey: config0.validatorPubkey,
            validatorSignature: config0.validatorSignature,
            depositDataRoot: config0.depositDataRoot,
            salt: rawSalt0,
            expectedMinipoolAddress: config0.expectedMinipoolAddress,
            sig: sig0
        }, {
            value: ethers.utils.parseEther("1")
        })).to.not.be.reverted;

        await expect(protocol.superNode.connect(signers.random2).createMinipool({
            validatorPubkey: config1.validatorPubkey,
            validatorSignature: config1.validatorSignature,
            depositDataRoot: config1.depositDataRoot,
            salt: rawSalt1,
            expectedMinipoolAddress: config1.expectedMinipoolAddress,
            sig: sig1
        }, {
            value: ethers.utils.parseEther("1")
        })).to.not.be.reverted;;
    });

    it("fails - sig cannot be reused", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const { rawSalt, pepperedSalt } = await approvedSalt(3, signers.hyperdriver.address);

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

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, signers.hyperdriver.address, '0x' + config.expectedMinipoolAddress, config.salt);

        await protocol.superNode.connect(signers.hyperdriver).createMinipool({
            validatorPubkey: config.validatorPubkey,
            validatorSignature: config.validatorSignature,
            depositDataRoot: config.depositDataRoot,
            salt: rawSalt,
            expectedMinipoolAddress: config.expectedMinipoolAddress,
            sig: sig
        }, {
            value: ethers.utils.parseEther("1")
        });

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool({
            validatorPubkey: config.validatorPubkey,
            validatorSignature: config.validatorSignature,
            depositDataRoot: config.depositDataRoot,
            salt: rawSalt,
            expectedMinipoolAddress: config.expectedMinipoolAddress,
            sig: sig
        }, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("minipool already initialized");
    });

    it("fails - not whitelisted", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const { rawSalt, pepperedSalt } = await approvedSalt(3, signers.hyperdriver.address);

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

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, signers.hyperdriver.address, '0x' + config.expectedMinipoolAddress, config.salt);

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool({
            validatorPubkey: config.validatorPubkey,
            validatorSignature: config.validatorSignature,
            depositDataRoot: config.depositDataRoot,
            salt: rawSalt,
            expectedMinipoolAddress: config.expectedMinipoolAddress,
            sig: sig
        }, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("sub node operator must be whitelisted");
    });

    it("fails - bad predicted address", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const { rawSalt, pepperedSalt } = await approvedSalt(3, signers.hyperdriver.address);

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

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, signers.hyperdriver.address, '0x' + config.expectedMinipoolAddress, config.salt);

        // this is not an intuitive fail message, but it is correct as it we sign invalid param data so it fails for bad sig
        // because the predicted address is incorrect. This may make increase future cli debugging times
        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool({
            validatorPubkey: badConfig.validatorPubkey,
            validatorSignature: badConfig.validatorSignature,
            depositDataRoot: badConfig.depositDataRoot,
            salt: rawSalt,
            expectedMinipoolAddress: badConfig.expectedMinipoolAddress,
            sig: sig
        }, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("bad signer role, params, or encoding");
    });

    it("fails - forget to lock 1 eth", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const { rawSalt, pepperedSalt } = await approvedSalt(3, signers.hyperdriver.address);

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

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, signers.hyperdriver.address, '0x' + config.expectedMinipoolAddress, config.salt);

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool({
            validatorPubkey: config.validatorPubkey,
            validatorSignature: config.validatorSignature,
            depositDataRoot: config.depositDataRoot,
            salt: rawSalt,
            expectedMinipoolAddress: config.expectedMinipoolAddress,
            sig: sig
        }, {
            value: ethers.utils.parseEther("0")
        })).to.be.revertedWith("SuperNode: must set the message value to lockThreshold");
    });

    it("fails - no liquidity for given bond", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const { rawSalt, pepperedSalt } = await approvedSalt(3, signers.hyperdriver.address);


        const depositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt);

        const config = {
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: depositData.minipoolAddress
        };

        const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, signers.hyperdriver.address, '0x' + config.expectedMinipoolAddress, config.salt);

        const { sig: sig2, timestamp: timestamp2 } = await whitelistUserServerSig(setupData, signers.hyperdriver);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.hyperdriver.address, sig2)

        await expect(protocol.superNode.connect(signers.hyperdriver).createMinipool({
            validatorPubkey: config.validatorPubkey,
            validatorSignature: config.validatorSignature,
            depositDataRoot: config.depositDataRoot,
            salt: rawSalt,
            expectedMinipoolAddress: config.expectedMinipoolAddress,
            sig: sig
        }, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("NodeAccount: protocol must have enough rpl and eth");
    });

    describe("SetSmoothingPool", async () => {
        describe("When sender is admin", async () => {

            describe("When smoothing pool is true", async () => {

                describe("When enough time has passed", async () => {
                    it("should pass", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        // this might be a bad key, i'm pretty sure it is for lastTimeUpdated??
                        const storageKeyForTimer = "0x0ffebeec6c821887d578dfaf27c0b3f03dd63cb069f39a35d4270daf9ebb531b"
                        const time = await rocketPool.rockStorageContract.getUint(storageKeyForTimer);
                        await increaseEVMTime(time.toNumber() * 100);

                        expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(true)
                        await protocol.superNode.connect(signers.admin).setSmoothingPoolParticipation(false);
                        expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(false)
                    })
                })

                describe("When not enough time has passed", async () => {
                    it("should revert", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(true)
                        await expect(protocol.superNode.connect(signers.admin).setSmoothingPoolParticipation(false)).to.revertedWith("Not enough time has passed since changing state");
                    })
                })

            })

            describe("When smoothing pool is false", async () => {

                describe("When enough time has passed", async () => {

                    it("should pass", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        // this might be a bad key, i'm pretty sure it is for lastTimeUpdated??
                        const storageKeyForTimer = "0x0ffebeec6c821887d578dfaf27c0b3f03dd63cb069f39a35d4270daf9ebb531b"
                        const time = await rocketPool.rockStorageContract.getUint(storageKeyForTimer);
                        await increaseEVMTime(time.toNumber() * 100);

                        expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(true)
                        await protocol.superNode.connect(signers.admin).setSmoothingPoolParticipation(false);

                        await increaseEVMTime(time.toNumber() * 100);

                        expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(false)
                        await protocol.superNode.connect(signers.admin).setSmoothingPoolParticipation(true);
                        expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(true)
                    })
                })

                describe("When not enough time has passed", async () => {
                    it("should revert", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        // this might be a bad key, i'm pretty sure it is for lastTimeUpdated??
                        const storageKeyForTimer = "0x0ffebeec6c821887d578dfaf27c0b3f03dd63cb069f39a35d4270daf9ebb531b"
                        const time = await rocketPool.rockStorageContract.getUint(storageKeyForTimer);
                        await increaseEVMTime(time.toNumber() * 100);

                        expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(true)
                        await protocol.superNode.connect(signers.admin).setSmoothingPoolParticipation(false);

                        expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(false)
                        await expect(protocol.superNode.connect(signers.admin).setSmoothingPoolParticipation(true)).to.revertedWith("Not enough time has passed since changing state");
                    })
                })
            })
        })

        describe("When sender is not admin", async () => {

            it("should revert", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                expect(await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(protocol.superNode.address)).equals(true)
                await expect(protocol.superNode.connect(signers.random4).setSmoothingPoolParticipation(false)).to.be.revertedWith("Can only be called by admin address!");
            })

        })
    })
});