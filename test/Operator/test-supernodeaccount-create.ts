import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData, Signers } from "../test";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator } from ".././utils/utils";
import { generateDepositData } from ".././rocketpool/_helpers/minipool";

const ethMintAmount = ethers.utils.parseEther("8");
const rplMintAmount = ethers.utils.parseEther("360");
const salt = 3;

describe("SuperNodeAccount create", function () {
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
                sigGenesisTime: timestamp,
                sig: sig
                }, { value: ethers.utils.parseEther('1') }))
            .to.be.revertedWith('NodeAccount: protocol must have enough rpl and eth');
        });
    });

    describe("when there is just enough assets deposited for one", async function () {
        it("should create a minipool", async function () {
            // Deposit ETH
            const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)
            await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("1000") });
            await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
            await protocol.vCWETH.connect(signers.ethWhale).deposit(ethMintAmount, signers.ethWhale.address);

            // Deposit RPL
            await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
            await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
            await protocol.vCRPL.connect(signers.ethWhale).deposit(rplMintAmount, signers.ethWhale.address);

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
                sigGenesisTime: timestamp,
                sig: sig
                }, { value: ethers.utils.parseEther('1') }))
            .to.not.be.reverted;
        });
    });

    describe("when there is enough assets for many", async function () {
        it("should create many minipools", async function () {
            // Deposit ETH (for 3 minipools)
            const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)
            await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("1000") });
            await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
            await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("24"), signers.ethWhale.address);

            // Deposit RPL (for 3 minipools)
            await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, ethers.utils.parseEther("1080"));
            await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, ethers.utils.parseEther("1080"));
            await protocol.vCRPL.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1080"), signers.ethWhale.address);

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
                sigGenesisTime: exitMessage.timestamp,
                sig: exitMessage.sig
                }, { value: ethers.utils.parseEther('1') }))
            .to.not.be.reverted;

            // Create second minipool
            salts = await approvedSalt(4, nodeOperator.address);
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
                sigGenesisTime: exitMessage.timestamp,
                sig: exitMessage.sig
                }, { value: ethers.utils.parseEther('1') }))
            .to.not.be.reverted;

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
                sigGenesisTime: exitMessage.timestamp,
                sig: exitMessage.sig
                }, { value: ethers.utils.parseEther('1') }))
            .to.not.be.reverted;
        });
    });
});