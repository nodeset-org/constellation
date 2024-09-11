import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData, Signers } from "../integration";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator } from "../../utils/utils";
import { generateDepositData } from "../../rocketpool/_helpers/minipool";
import { prepareOperatorDistributionContract } from "../../utils/utils";
import { ethers } from 'hardhat';

const ethMintAmount = ethers.utils.parseEther("8");
const rplMintAmount = ethers.utils.parseEther("360");
const salt = 3;

describe("SuperNodeAccount creation under validator limits", function () {
    let setupData: SetupData;
    let protocol: Protocol;
    let signers: Signers;
    let rocketPool: RocketPool;

    beforeEach(async function () {
        setupData = await loadFixture(protocolFixture);
        protocol = setupData.protocol;
        signers = setupData.signers;
        rocketPool = setupData.rocketPool;

        // Set liquidity reserve to 0%
        await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(0);
        await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(0);

        await protocol.superNode.connect(signers.admin).setMaxValidators(10);
    });

    describe("when there is not enough assets deposited", async function () {
        it("should revert", async function () {
            // Deposit ETH
            const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)
            await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("1000") });
            await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
            // Subtract 1 from mint amount to ensure it is not enough
            await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("7"), signers.ethWhale.address);

            // Deposit RPL
            await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
            await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
            // Subtract 1 from mint amount to ensure it is not enough
            await protocol.vCRPL.connect(signers.ethWhale).deposit(ethers.utils.parseEther("359"), signers.ethWhale.address);

            const nodeOperator = signers.hyperdriver;
            await assertAddOperator(setupData, nodeOperator);
            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
            const bond = await setupData.protocol.superNode.bond();
            const config = {
                timezoneLocation: 'Australia/Brisbane',
                bondAmount: bond,
                minimumNodeFee: 0,
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

            await expect(
                protocol.superNode
            .connect(nodeOperator)
            .createMinipool({
                validatorPubkey: config.validatorPubkey,
                validatorSignature: config.validatorSignature,
                depositDataRoot: config.depositDataRoot,
                salt: rawSalt,
                expectedMinipoolAddress: config.expectedMinipoolAddress,
                sig: sig
                }, { value: ethers.utils.parseEther('1') }))
            .to.be.revertedWith('NodeAccount: protocol must have enough rpl and eth');
        });
    });

    describe("when there is just enough assets deposited for one", async function () {
        describe("when a single node operator attempts to create a minipool", async function () {
            it("should create a minipool", async function () {
                await prepareOperatorDistributionContract(setupData, 1);

                const nodeOperator = signers.hyperdriver;
                await assertAddOperator(setupData, nodeOperator);
                const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
                const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
                const bond = await setupData.protocol.superNode.bond();
                const config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: bond,
                    minimumNodeFee: 0,
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

                await expect(
                    protocol.superNode
                .connect(nodeOperator)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;
            });
            it("should allow for the reuse of funds", async function () {
                await protocol.superNode.connect(signers.admin).setMaxValidators(1);
                // Deposit ETH (for 3 minipools)
                await prepareOperatorDistributionContract(setupData, 3);

                const nodeOperator1 = signers.hyperdriver;
                await assertAddOperator(setupData, nodeOperator1);

                // create minipool for nodeOperator1
                let salts = await approvedSalt(1, nodeOperator1.address);
                let depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                const config1 = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                let exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator1.address,
                    '0x' + config1.expectedMinipoolAddress,
                    config1.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config1.validatorPubkey,
                    validatorSignature: config1.validatorSignature,
                    depositDataRoot: config1.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config1.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                // create second minipool for nodeOperator1 - it should fail due to max validator
                salts = await approvedSalt(2, nodeOperator1.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                const config2 = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator1.address,
                    '0x' + config2.expectedMinipoolAddress,
                    config2.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config2.validatorPubkey,
                    validatorSignature: config2.validatorSignature,
                    depositDataRoot: config2.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config2.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.be.revertedWith('Sub node operator has created too many minipools already');

                // Dissolve and close minipool 1
                const minipoolContract = (await ethers.getContractAt(
                    'IMinipool',
                    config1.expectedMinipoolAddress
                ));
                await expect(setupData.rocketPool.rocketDepositPoolContract.connect(signers.ethWhale).deposit({value: ethers.utils.parseEther("100")})).to.not.be.reverted
                let timestamp = (await ethers.provider.getBlock("latest")).timestamp;
                await ethers.provider.send("evm_mine", [timestamp+(10*24*3600)]);
                expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator1.address)).to.be.equal(1);
                await expect(minipoolContract.connect(nodeOperator1).dissolve()).to.not.be.reverted;
                await protocol.superNode.connect(nodeOperator1).closeDissolvedMinipool(nodeOperator1.address, config1.expectedMinipoolAddress);
                expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator1.address)).to.be.equal(0);

                // create final minipool (3rd but 2nd active)
                salts = await approvedSalt(3, nodeOperator1.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                const config3 = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator1.address,
                    '0x' + config3.expectedMinipoolAddress,
                    config3.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config3.validatorPubkey,
                    validatorSignature: config3.validatorSignature,
                    depositDataRoot: config3.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config3.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;
            });
        });
    });

    describe("when there is enough assets for many", async function () {
        describe("when there is a single node operator", async function () {
            it("should create many minipools", async function () {
                // Deposit ETH (for 3 minipools)
                await prepareOperatorDistributionContract(setupData, 3);

                const nodeOperator = signers.hyperdriver;
                await assertAddOperator(setupData, nodeOperator);
                const bond = await setupData.protocol.superNode.bond();

                // Create first minipool
                let salts = await approvedSalt(salt, nodeOperator.address);
                let depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                let config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: bond,
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                let exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                expect(await protocol.superNode.getMinipoolCount(nodeOperator.address)).equals(0)
                expect(await protocol.superNode.getMinipools(nodeOperator.address)).eqls([])

                await expect(
                    protocol.superNode
                .connect(nodeOperator)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                expect(await protocol.superNode.getMinipoolCount(nodeOperator.address)).equals(1)
                expect(await protocol.superNode.getMinipools(nodeOperator.address)).eqls(['0x'+config.expectedMinipoolAddress])

                // Create second minipool
                salts = await approvedSalt(4, nodeOperator.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                const lastMinipool = config.expectedMinipoolAddress;
                config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: bond,
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );


                await expect(
                    protocol.superNode
                .connect(nodeOperator)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                expect(await protocol.superNode.getMinipoolCount(nodeOperator.address)).equals(2)
                expect(await protocol.superNode.getMinipools(nodeOperator.address)).eqls(['0x'+lastMinipool, '0x'+config.expectedMinipoolAddress])

                // Create third minipool
                salts = await approvedSalt(5, nodeOperator.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: bond,
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                // Create fourth minipool
                salts = await approvedSalt(6, nodeOperator.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: bond,
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.be.revertedWith('NodeAccount: protocol must have enough rpl and eth');

                await protocol.superNode.connect(signers.admin).setMaxValidators(3);

                await expect(
                    protocol.superNode
                .connect(nodeOperator)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.be.revertedWith('Sub node operator has created too many minipools already');

            });
        });
        describe("when there are multiple node operators", async function () {
            it("should create many minipools", async function () {
                await protocol.superNode.connect(signers.admin).setMaxValidators(1);

                // Deposit ETH (for 3 minipools)
                await prepareOperatorDistributionContract(setupData, 3);

                const nodeOperator1 = signers.hyperdriver;
                await assertAddOperator(setupData, nodeOperator1);

                const nodeOperator2 = signers.random;
                await assertAddOperator(setupData, nodeOperator2);

                // create minipool for nodeOperator1
                let salts = await approvedSalt(salt, nodeOperator1.address);
                let depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                let config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                let exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator1.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                // create minipool for nodeOperator2
                salts = await approvedSalt(4, nodeOperator2.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator2.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator2)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                // create minipool for nodeOperator1
                salts = await approvedSalt(5, nodeOperator1.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator1.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.be.revertedWith('Sub node operator has created too many minipools already');

                await protocol.superNode.connect(signers.admin).setMaxValidators(2);

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                // create minipool for nodeOperator2
                salts = await approvedSalt(6, nodeOperator2.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)

                config = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator2.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator2)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.be.revertedWith('NodeAccount: protocol must have enough rpl and eth');
            });

            it("should allow for the reuse of funds", async function () {
                await protocol.superNode.connect(signers.admin).setMaxValidators(1);
                // Deposit ETH (for 3 minipools)
                await prepareOperatorDistributionContract(setupData, 3);

                const nodeOperator1 = signers.hyperdriver;
                await assertAddOperator(setupData, nodeOperator1);

                const nodeOperator2 = signers.random;
                await assertAddOperator(setupData, nodeOperator2);

                // create minipool for nodeOperator1
                let salts = await approvedSalt(salt, nodeOperator1.address);
                let depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                const config1 = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                let exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator1.address,
                    '0x' + config1.expectedMinipoolAddress,
                    config1.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config1.validatorPubkey,
                    validatorSignature: config1.validatorSignature,
                    depositDataRoot: config1.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config1.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                // create minipool for nodeOperator2
                salts = await approvedSalt(4, nodeOperator2.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                const config2 = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator2.address,
                    '0x' + config2.expectedMinipoolAddress,
                    config2.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator2)
                .createMinipool({
                    validatorPubkey: config2.validatorPubkey,
                    validatorSignature: config2.validatorSignature,
                    depositDataRoot: config2.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config2.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;

                // create minipool for nodeOperator1
                salts = await approvedSalt(5, nodeOperator1.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                const config3 = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator1.address,
                    '0x' + config3.expectedMinipoolAddress,
                    config3.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config3.validatorPubkey,
                    validatorSignature: config3.validatorSignature,
                    depositDataRoot: config3.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config3.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.be.revertedWith('Sub node operator has created too many minipools already');

                // Dissolve and close minipool 1
                const minipoolContract = (await ethers.getContractAt(
                    'IMinipool',
                    config1.expectedMinipoolAddress
                ));
                await expect(setupData.rocketPool.rocketDepositPoolContract.connect(signers.ethWhale).deposit({
                    value: ethers.utils.parseEther("100")
                })).to.not.be.reverted
                let timestamp = (await ethers.provider.getBlock("latest")).timestamp;
                await ethers.provider.send("evm_mine", [timestamp+(10*24*3600)]);
                expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator1.address)).to.be.equal(1);
                await expect(minipoolContract.connect(nodeOperator1).dissolve()).to.not.be.reverted;
                await protocol.superNode.connect(nodeOperator1).closeDissolvedMinipool(nodeOperator1.address, config1.expectedMinipoolAddress);
                expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator1.address)).to.be.equal(0);

                // create minipool for nodeOperator2
                salts = await approvedSalt(6, nodeOperator2.address);
                depositData = await generateDepositData(nodeOperator2.address, salts.pepperedSalt)
                const config4 = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator2.address,
                    '0x' + config4.expectedMinipoolAddress,
                    config4.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator2)
                .createMinipool({
                    validatorPubkey: config4.validatorPubkey,
                    validatorSignature: config4.validatorSignature,
                    depositDataRoot: config4.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config4.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.be.revertedWith('Sub node operator has created too many minipools already');

                // create minipool for nodeOperator1
                salts = await approvedSalt(7, nodeOperator1.address);
                depositData = await generateDepositData(protocol.superNode.address, salts.pepperedSalt)
                const config5 = {
                    timezoneLocation: 'Australia/Brisbane',
                    bondAmount: await protocol.superNode.bond(),
                    minimumNodeFee: 0,
                    validatorPubkey: depositData.depositData.pubkey,
                    validatorSignature: depositData.depositData.signature,
                    depositDataRoot: depositData.depositDataRoot,
                    salt: salts.pepperedSalt,
                    expectedMinipoolAddress: depositData.minipoolAddress,
                };

                exitMessage = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator1.address,
                    '0x' + config5.expectedMinipoolAddress,
                    config5.salt,
                );

                await expect(
                    protocol.superNode
                .connect(nodeOperator1)
                .createMinipool({
                    validatorPubkey: config5.validatorPubkey,
                    validatorSignature: config5.validatorSignature,
                    depositDataRoot: config5.depositDataRoot,
                    salt: salts.rawSalt,
                    expectedMinipoolAddress: config5.expectedMinipoolAddress,
                    sig: exitMessage.sig
                    }, { value: ethers.utils.parseEther('1') }))
                .to.not.be.reverted;
            });
        });
    });
});
