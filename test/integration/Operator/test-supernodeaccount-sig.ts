import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture,} from "../integration";
import { generateDepositData } from "../../rocketpool/_helpers/minipool";
import { approvedSalt, approveHasSignedExitMessageSig, approveHasSignedExitMessageSigBadChainId, approveHasSignedExitMessageSigBadEncoding, approveHasSignedExitMessageSigBadNonce, approveHasSignedExitMessageSigBadTarget, assertAddOperator, increaseEVMTime, prepareOperatorDistributionContract } from "../../utils/utils";


describe("SuperNodeAccount creation sig", function () {
    describe("When Admin Server Check enabled", async () => {
        describe("When sig has been used", async () => {
            it("Should revert", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers } = setupData;
                await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                const nodeOperator = signers.hyperdriver;
                const bond = await setupData.protocol.superNode.bond();

                expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                await prepareOperatorDistributionContract(setupData, 3);
                expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                await assertAddOperator(setupData, nodeOperator);
                const salt = 420;
                const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                const config = {
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                await protocol.superNode.connect(signers.admin).setMaxValidators(10);

                const { sig, timestamp } = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                const { rawSalt: rawSalt2, pepperedSalt: pepperedSalt2 } = await approvedSalt(salt + 1, nodeOperator.address);
                const depositData2 = await generateDepositData(protocol.superNode.address, pepperedSalt2)
                const config2 = {
                    validatorPubkey: depositData2.depositData.pubkey,
                    validatorSignature: depositData2.depositData.signature,
                    depositDataRoot: depositData2.depositDataRoot,
                    salt: pepperedSalt2,
                    expectedMinipoolAddress: depositData2.minipoolAddress,
                };

                const { sig: sig2, timestamp: timestamp2 } = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator.address,
                    '0x' + config2.expectedMinipoolAddress,
                    config2.salt,
                );


                await expect(protocol.superNode
                    .connect(nodeOperator)
                    .createMinipool({
                        validatorPubkey: config.validatorPubkey,
                        validatorSignature: config.validatorSignature,
                        depositDataRoot: config.depositDataRoot,
                        salt: rawSalt,
                        expectedMinipoolAddress: config.expectedMinipoolAddress,
                        sig: sig
                    }, { value: ethers.utils.parseEther('1') })).to.not.be.reverted;


                await expect(protocol.superNode
                    .connect(nodeOperator)
                    .createMinipool({
                        validatorPubkey: config2.validatorPubkey,
                        validatorSignature: config2.validatorSignature,
                        depositDataRoot: config2.depositDataRoot,
                        salt: rawSalt2,
                        expectedMinipoolAddress: config2.expectedMinipoolAddress,
                        sig: sig
                    }, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("bad signer role, params, or encoding");

            })
        })

        describe("When sig has NOT been used", async () => {
            describe("When sig has been encoded correctly", async () => {
                describe("When user passes params matching sig", async () => {
                    it("Should pass", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers } = setupData;
                        await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                        await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                        const nodeOperator = signers.hyperdriver;
                        const bond = await setupData.protocol.superNode.bond();

                        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                        await prepareOperatorDistributionContract(setupData, 1);
                        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                        await assertAddOperator(setupData, nodeOperator);
                        const salt = 420;
                        const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                        const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                        const config = {
                            validatorPubkey: depositData.depositData.pubkey,
                            validatorSignature: depositData.depositData.signature,
                            depositDataRoot: depositData.depositDataRoot,
                            salt: pepperedSalt,
                            expectedMinipoolAddress: depositData.minipoolAddress,
                        };

                        const { sig, timestamp } = await approveHasSignedExitMessageSig(
                            setupData,
                            nodeOperator.address,
                            '0x' + config.expectedMinipoolAddress,
                            config.salt,
                        );

                        await expect(protocol.superNode
                            .connect(nodeOperator)
                            .createMinipool({
                                validatorPubkey: config.validatorPubkey,
                                validatorSignature: config.validatorSignature,
                                depositDataRoot: config.depositDataRoot,
                                salt: rawSalt,
                                expectedMinipoolAddress: config.expectedMinipoolAddress,
                                sig: sig
                            }, { value: ethers.utils.parseEther('1') })).to.not.be.reverted;

                    })
                })

                describe("When user passes params matching many sigs", async () => {
                    it("Should pass for one sig and revert for all subsequent (proves nonce auto invalidates)", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers } = setupData;
                        await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                        await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                        const nodeOperator = signers.hyperdriver;
                        const bond = await setupData.protocol.superNode.bond();

                        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                        await prepareOperatorDistributionContract(setupData, 3);
                        expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                        await assertAddOperator(setupData, nodeOperator);
                        const salt = 420;
                        const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                        const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                        const config = {
                            validatorPubkey: depositData.depositData.pubkey,
                            validatorSignature: depositData.depositData.signature,
                            depositDataRoot: depositData.depositDataRoot,
                            salt: pepperedSalt,
                            expectedMinipoolAddress: depositData.minipoolAddress,
                        };

                        await protocol.superNode.connect(signers.admin).setMaxValidators(10);

                        const { sig, timestamp } = await approveHasSignedExitMessageSig(
                            setupData,
                            nodeOperator.address,
                            '0x' + config.expectedMinipoolAddress,
                            config.salt,
                        );

                        const { rawSalt: rawSalt2, pepperedSalt: pepperedSalt2 } = await approvedSalt(salt + 1, nodeOperator.address);
                        const depositData2 = await generateDepositData(protocol.superNode.address, pepperedSalt2)
                        const config2 = {
                            validatorPubkey: depositData2.depositData.pubkey,
                            validatorSignature: depositData2.depositData.signature,
                            depositDataRoot: depositData2.depositDataRoot,
                            salt: pepperedSalt2,
                            expectedMinipoolAddress: depositData2.minipoolAddress,
                        };

                        const { sig: sig2, timestamp: timestamp2 } = await approveHasSignedExitMessageSig(
                            setupData,
                            nodeOperator.address,
                            '0x' + config2.expectedMinipoolAddress,
                            config2.salt,
                        );


                        const { rawSalt: rawSalt3, pepperedSalt: pepperedSalt3 } = await approvedSalt(salt + 1, nodeOperator.address);
                        const depositData3 = await generateDepositData(protocol.superNode.address, pepperedSalt3)
                        const config3 = {
                            validatorPubkey: depositData3.depositData.pubkey,
                            validatorSignature: depositData3.depositData.signature,
                            depositDataRoot: depositData3.depositDataRoot,
                            salt: pepperedSalt3,
                            expectedMinipoolAddress: depositData3.minipoolAddress,
                        };


                        const { sig: sig3, timestamp: timestamp3 } = await approveHasSignedExitMessageSig(
                            setupData,
                            nodeOperator.address,
                            '0x' + config3.expectedMinipoolAddress,
                            config3.salt,
                        );

                        await expect(protocol.superNode
                            .connect(nodeOperator)
                            .createMinipool({
                                validatorPubkey: config.validatorPubkey,
                                validatorSignature: config.validatorSignature,
                                depositDataRoot: config.depositDataRoot,
                                salt: rawSalt,
                                expectedMinipoolAddress: config.expectedMinipoolAddress,
                                sig: sig
                            }, { value: ethers.utils.parseEther('1') })).to.not.be.reverted;


                        await expect(protocol.superNode
                            .connect(nodeOperator)
                            .createMinipool({
                                validatorPubkey: config2.validatorPubkey,
                                validatorSignature: config2.validatorSignature,
                                depositDataRoot: config2.depositDataRoot,
                                salt: rawSalt2,
                                expectedMinipoolAddress: config2.expectedMinipoolAddress,
                                sig: sig2
                            }, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("bad signer role, params, or encoding");

                        await expect(protocol.superNode
                            .connect(nodeOperator)
                            .createMinipool({
                                validatorPubkey: config3.validatorPubkey,
                                validatorSignature: config3.validatorSignature,
                                depositDataRoot: config3.depositDataRoot,
                                salt: rawSalt3,
                                expectedMinipoolAddress: config3.expectedMinipoolAddress,
                                sig: sig3
                            }, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("bad signer role, params, or encoding");
                    })
                })

                describe("When user passes params NOT matching sig", async () => {
                    describe("When expectedMinipool is invalid", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers } = setupData;
                            await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                            const nodeOperator = signers.hyperdriver;
                            const bond = await setupData.protocol.superNode.bond();

                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                            await prepareOperatorDistributionContract(setupData, 1);
                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                            await assertAddOperator(setupData, nodeOperator);
                            const salt = 420;
                            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                            const config = {
                                validatorPubkey: depositData.depositData.pubkey,
                                validatorSignature: depositData.depositData.signature,
                                depositDataRoot: depositData.depositDataRoot,
                                salt: pepperedSalt,
                                expectedMinipoolAddress: depositData.minipoolAddress,
                            };

                            const { sig, timestamp } = await approveHasSignedExitMessageSig(
                                setupData,
                                nodeOperator.address,
                                '0x' + config.expectedMinipoolAddress,
                                config.salt,
                            );

                            const tx = protocol.superNode
                                .connect(nodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: signers.random.address,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') });

                            await expect(tx).to.be.revertedWith("bad signer role, params, or encoding")
                        })
                    })

                    describe("When salt is invalid", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers } = setupData;
                            await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                            const nodeOperator = signers.hyperdriver;
                            const bond = await setupData.protocol.superNode.bond();

                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                            await prepareOperatorDistributionContract(setupData, 1);
                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                            await assertAddOperator(setupData, nodeOperator);
                            const salt = 420;
                            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                            const config = {
                                validatorPubkey: depositData.depositData.pubkey,
                                validatorSignature: depositData.depositData.signature,
                                depositDataRoot: depositData.depositDataRoot,
                                salt: pepperedSalt,
                                expectedMinipoolAddress: depositData.minipoolAddress,
                            };

                            const { sig, timestamp } = await approveHasSignedExitMessageSig(
                                setupData,
                                nodeOperator.address,
                                '0x' + config.expectedMinipoolAddress,
                                config.salt,
                            );

                            const tx = protocol.superNode
                                .connect(nodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt + 1,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') });

                            await expect(tx).to.be.revertedWith("bad signer role, params, or encoding")
                        })
                    })

                    describe("When destination address is invalid", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers } = setupData;
                            await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                            const nodeOperator = signers.hyperdriver;
                            const bond = await setupData.protocol.superNode.bond();

                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                            await prepareOperatorDistributionContract(setupData, 1);
                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                            await assertAddOperator(setupData, nodeOperator);
                            const salt = 420;
                            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                            const config = {
                                validatorPubkey: depositData.depositData.pubkey,
                                validatorSignature: depositData.depositData.signature,
                                depositDataRoot: depositData.depositDataRoot,
                                salt: pepperedSalt,
                                expectedMinipoolAddress: depositData.minipoolAddress,
                            };

                            const { sig, timestamp } = await approveHasSignedExitMessageSigBadTarget(
                                setupData,
                                nodeOperator.address,
                                '0x' + config.expectedMinipoolAddress,
                                config.salt,
                            );

                            const tx = protocol.superNode
                                .connect(nodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') });

                            await expect(tx).to.be.revertedWith("bad signer role, params, or encoding")
                        })
                    })


                    describe("When per operator nonce is invalid", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers } = setupData;
                            await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                            const nodeOperator = signers.hyperdriver;
                            const bond = await setupData.protocol.superNode.bond();

                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                            await prepareOperatorDistributionContract(setupData, 1);
                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                            await assertAddOperator(setupData, nodeOperator);
                            const salt = 420;
                            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                            const config = {
                                validatorPubkey: depositData.depositData.pubkey,
                                validatorSignature: depositData.depositData.signature,
                                depositDataRoot: depositData.depositDataRoot,
                                salt: pepperedSalt,
                                expectedMinipoolAddress: depositData.minipoolAddress,
                            };

                            const { sig, timestamp } = await approveHasSignedExitMessageSigBadNonce(
                                setupData,
                                nodeOperator.address,
                                '0x' + config.expectedMinipoolAddress,
                                config.salt,
                            );

                            const tx = protocol.superNode
                                .connect(nodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') });

                            await expect(tx).to.be.revertedWith("bad signer role, params, or encoding")
                        })
                    })


                    describe("When chain.id is invalid", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers } = setupData;
                            await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                            const nodeOperator = signers.hyperdriver;
                            const bond = await setupData.protocol.superNode.bond();

                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                            await prepareOperatorDistributionContract(setupData, 1);
                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                            await assertAddOperator(setupData, nodeOperator);
                            const salt = 420;
                            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                            const config = {
                                validatorPubkey: depositData.depositData.pubkey,
                                validatorSignature: depositData.depositData.signature,
                                depositDataRoot: depositData.depositDataRoot,
                                salt: pepperedSalt,
                                expectedMinipoolAddress: depositData.minipoolAddress,
                            };

                            const { sig, timestamp } = await approveHasSignedExitMessageSigBadChainId(
                                setupData,
                                nodeOperator.address,
                                '0x' + config.expectedMinipoolAddress,
                                config.salt,
                            );

                            const tx = protocol.superNode
                                .connect(nodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') });

                            await expect(tx).to.be.revertedWith("bad signer role, params, or encoding")
                        })
                    })

                    describe("When per sig nonce is invalid", async () => {
                        it("Should revert due to having become invalidated", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers } = setupData;
                            await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                            const nodeOperator = signers.hyperdriver;
                            const bond = await setupData.protocol.superNode.bond();

                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                            await prepareOperatorDistributionContract(setupData, 1);
                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                            await assertAddOperator(setupData, nodeOperator);
                            const salt = 420;
                            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                            const config = {
                                validatorPubkey: depositData.depositData.pubkey,
                                validatorSignature: depositData.depositData.signature,
                                depositDataRoot: depositData.depositDataRoot,
                                salt: pepperedSalt,
                                expectedMinipoolAddress: depositData.minipoolAddress,
                            };

                            const { sig, timestamp } = await approveHasSignedExitMessageSig(
                                setupData,
                                nodeOperator.address,
                                '0x' + config.expectedMinipoolAddress,
                                config.salt,
                            );

                            await expect(protocol.superNode
                                .connect(nodeOperator).callStatic
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') })).to.not.be.reverted;


                            expect(await protocol.superNode.nonce()).equals(0);
                            await protocol.superNode.connect(signers.admin).invalidateAllOutstandingSigs();
                            expect(await protocol.superNode.nonce()).equals(1);

                            await expect(protocol.superNode
                                .connect(nodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })

                    describe("When per node operator nonce is invalid", async () => {
                        it("Should revert due to having become invalidated", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers } = setupData;
                            await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                            const nodeOperator = signers.hyperdriver;
                            const bond = await setupData.protocol.superNode.bond();

                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                            await prepareOperatorDistributionContract(setupData, 1);
                            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                            await assertAddOperator(setupData, nodeOperator);
                            const salt = 420;
                            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                            const config = {
                                validatorPubkey: depositData.depositData.pubkey,
                                validatorSignature: depositData.depositData.signature,
                                depositDataRoot: depositData.depositDataRoot,
                                salt: pepperedSalt,
                                expectedMinipoolAddress: depositData.minipoolAddress,
                            };

                            const { sig, timestamp } = await approveHasSignedExitMessageSig(
                                setupData,
                                nodeOperator.address,
                                '0x' + config.expectedMinipoolAddress,
                                config.salt,
                            );

                            await expect(protocol.superNode
                                .connect(nodeOperator).callStatic
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') })).to.not.be.reverted;


                            expect(await protocol.superNode.nonce()).equals(0);
                            expect(await protocol.superNode.nonces(nodeOperator.address)).equals(0);
                            await protocol.superNode.connect(signers.admin).invalidateSingleOustandingSig(nodeOperator.address);
                            expect(await protocol.superNode.nonce()).equals(0);
                            expect(await protocol.superNode.nonces(nodeOperator.address)).equals(1);

                            await expect(protocol.superNode
                                .connect(nodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                }, { value: ethers.utils.parseEther('1') })).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })
                })
            })

            describe("When params have not been encoded correctly", async () => {
                it("Should revert", async () => {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers } = setupData;
                    await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                    await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                    const nodeOperator = signers.hyperdriver;
                    const bond = await setupData.protocol.superNode.bond();

                    expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
                    await prepareOperatorDistributionContract(setupData, 1);
                    expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

                    await assertAddOperator(setupData, nodeOperator);
                    const salt = 420;
                    const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                    const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                    const config = {
                        validatorPubkey: depositData.depositData.pubkey,
                        validatorSignature: depositData.depositData.signature,
                        depositDataRoot: depositData.depositDataRoot,
                        salt: pepperedSalt,
                        expectedMinipoolAddress: depositData.minipoolAddress,
                    };

                    const { sig, timestamp } = await approveHasSignedExitMessageSigBadEncoding(
                        setupData,
                        nodeOperator.address,
                        '0x' + config.expectedMinipoolAddress,
                        config.salt,
                    );

                    const tx = protocol.superNode
                        .connect(nodeOperator)
                        .createMinipool({
                            validatorPubkey: config.validatorPubkey,
                            validatorSignature: config.validatorSignature,
                            depositDataRoot: config.depositDataRoot,
                            salt: rawSalt,
                            expectedMinipoolAddress: config.expectedMinipoolAddress,
                            sig: sig
                        }, { value: ethers.utils.parseEther('1') });

                    await expect(tx).to.be.revertedWith("bad signer role, params, or encoding");
                })
            })
        })
    })

    describe("When Admin Server Check disabled", async () => {
        it("Should pass with any sig", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;
            await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
            const nodeOperator = signers.hyperdriver;
            const bond = await setupData.protocol.superNode.bond();

            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
            await prepareOperatorDistributionContract(setupData, 1);
            expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);

            await assertAddOperator(setupData, nodeOperator);
            const salt = 420;
            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
            const config = {
                validatorPubkey: depositData.depositData.pubkey,
                validatorSignature: depositData.depositData.signature,
                depositDataRoot: depositData.depositDataRoot,
                salt: pepperedSalt,
                expectedMinipoolAddress: depositData.minipoolAddress,
            };

            const { sig, timestamp } = await approveHasSignedExitMessageSigBadEncoding(
                setupData,
                nodeOperator.address,
                '0x' + config.expectedMinipoolAddress,
                config.salt,
            );

            await protocol.superNode.connect(signers.admin).setAdminServerCheck(false);

            const tx = protocol.superNode
                .connect(nodeOperator)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: sig
                }, { value: ethers.utils.parseEther('1') });

            await expect(tx).to.not.be.reverted;
        })
    })
})

