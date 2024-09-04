import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData, Signers } from "../integration";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { generateDepositData } from "../../rocketpool/_helpers/minipool";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator } from "../../utils/utils";

const salt = 3;

describe("SuperNodeAccount createMinipool", function () {
    let setupData: SetupData;
    let protocol: Protocol;
    let signers: Signers;
    let rocketPool: RocketPool;
    let nodeOperator: SignerWithAddress;

    beforeEach(async function () {
        setupData = await loadFixture(protocolFixture);
        protocol = setupData.protocol;
        signers = setupData.signers;
        rocketPool = setupData.rocketPool;
        nodeOperator = signers.hyperdriver;

        // Set liquidity reserve to 0%
        await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(0);
        await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(0);

        await protocol.superNode.connect(signers.admin).setMaxValidators(10);
    });

    describe("when the message value is below the threshold", function () {
        it("should revert", async function () {
            const salts  = await approvedSalt(salt, nodeOperator.address);
            const rawSalt = salts.rawSalt;
            const pepperedSalt = salts.pepperedSalt;

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
            const message = await approveHasSignedExitMessageSig(
                setupData,
                nodeOperator.address,
                '0x' + config.expectedMinipoolAddress,
                config.salt,
            );

            const sig = message.sig
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
                }, { value: ethers.utils.parseEther('0') }))
            .to.be.revertedWith('SuperNode: must set the message value to lockThreshold');

        });
    });
    describe("when the message value is equal to the threshold", function () {
        describe("when the minipool address already exists", function () {
            it("should revert", async function () {
                const salts  = await approvedSalt(salt, nodeOperator.address);
                const rawSalt = salts.rawSalt;
                const pepperedSalt = salts.pepperedSalt;

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
                const message = await approveHasSignedExitMessageSig(
                    setupData,
                    nodeOperator.address,
                    '0x' + config.expectedMinipoolAddress,
                    config.salt,
                );

                const sig = message.sig

                nodeOperator = signers.hyperdriver;
                await assertAddOperator(setupData, nodeOperator);

                // Create minipool
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

                // Create same minipool
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
                .to.be.revertedWith('SuperNode: minipool already exists');
            });
        });
        describe("when the minipool address does not exist", function () {
            describe("when the sub node account is not whitelisted", function () {
                it("should revert", async function () {
                });
            });
            describe("when the sub node account is whitelisted", function () {
                describe("when the sub node operator is equal to the active minipool count", function () {
                    it("should revert", async function () {
                    });
                });
                describe("when the sub node operator is below the active minipool count", function () {
                    describe("when the protocol does not have enough liquidity", function () {
                        it("should revert", async function () {
                        });
                    });
                    describe("when the protocol has enough liquidity", function () {
                        it("should create the minipool", async function () {
                        });
                    });
                });
            });
        });
    });
    describe("when the message value is above the threshold", function () {
    });
});