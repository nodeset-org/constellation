import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";
import { generateDepositData } from ".././rocketpool/_helpers/minipool";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator } from ".././utils/utils";

describe("SuperNodeAccount close", function () {
    describe("when minipool address is valid", function () {
        describe("when subNodeOperator address is valid", function () {
            describe("when minipool is not dissolved", function () {
            });
            describe("when minipool is dissolved", function () {
                it("removes the validator", async function () {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;

                    // Set liquidity reserve to 0%
                    await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(0);
                    await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(0);


                    // Deposit 8 ETH for 1 minipool
                    const ethMintAmount = ethers.utils.parseEther("8");
                    const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)

                    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("1000") });
                    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
                    await protocol.vCWETH.connect(signers.ethWhale).deposit(ethMintAmount, signers.ethWhale.address);

                    // Deposit 160 RPL
                    const rplMintAmount = ethers.utils.parseEther("720");
                    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
                    await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
                    await protocol.vCRPL.connect(signers.ethWhale).deposit(rplMintAmount, signers.ethWhale.address);

                    const nodeOperator = signers.hyperdriver;
                    await assertAddOperator(setupData, nodeOperator);
                    const salt = 3;
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


                    await protocol.superNode.close(nodeOperator.address, config.expectedMinipoolAddress);
                    // Assert that validator is no longer has any activeValidatorCount

                    // Assert that minipool got removed from SuperNodeAccount
                });
            });

        });
        describe("when subNodeOperator address is invalid", function () {
        });
    });
    describe("when minpool address is invalid", function () {
    });


});