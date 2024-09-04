import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData, Signers } from "../test";
import { generateDepositData } from ".././rocketpool/_helpers/minipool";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator } from ".././utils/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { Contract } from "@openzeppelin/upgrades";
import { IMinipool } from "../../typechain-types";

const ethMintAmount = ethers.utils.parseEther("8");
const rplMintAmount = ethers.utils.parseEther("720");
const salt = 3;

describe("SuperNodeAccount close", function () {
    let setupData: SetupData;
    let protocol: Protocol;
    let signers: Signers;
    let rocketPool: RocketPool;
    let nodeOperator: SignerWithAddress;
    let salts: any;
    let rawSalt: BigNumber;
    let pepperedSalt: BigNumber;
    let config: any;
    let sig: string;
    let timestamp: number;
    let minipoolContract: IMinipool;

    beforeEach(async function () {
        setupData = await loadFixture(protocolFixture);
        protocol = setupData.protocol;
        signers = setupData.signers;
        rocketPool = setupData.rocketPool;
        // Set liquidity reserve to 0%
        await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(0);
        await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(0);

        // set fee to 0%
        await protocol.vCWETH.connect(signers.admin).setMintFee(0);

        // Deposit 8 ETH for 1 minipool
        const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)
        await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("1000") });
        await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
        await protocol.vCWETH.connect(signers.ethWhale).deposit(ethMintAmount, signers.ethWhale.address);

        // Deposit 720 RPL
        await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
        await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
        await protocol.vCRPL.connect(signers.ethWhale).deposit(rplMintAmount, signers.ethWhale.address);

        nodeOperator = signers.hyperdriver;
        await assertAddOperator(setupData, nodeOperator);
        salts  = await approvedSalt(salt, nodeOperator.address);
        rawSalt = salts.rawSalt;
        pepperedSalt = salts.pepperedSalt;
        const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
        const bond = await setupData.protocol.superNode.bond();

        config = {
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

        sig = message.sig;
        timestamp = message.timestamp;

        minipoolContract = (await ethers.getContractAt(
            'IMinipool',
            config.expectedMinipoolAddress
        ));
    });

    describe("when minipool is not dissolved", function () {
        it("should revert", async function () {
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

            // mint rETH, which will deposit into the minipool and set it to prelaunch state
            setupData.rocketPool.rocketDepositPoolContract.connect(signers.ethWhale).deposit({value: ethers.utils.parseEther("100")})

            // Increase the time by 10 days
            await ethers.provider.send("evm_increaseTime", [10*24*3600]);
            await ethers.provider.send("evm_mine", []);

            // Assert validator count prior to closing minipool
            expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(1);
            expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(1);

            // Only close minipool
            await expect(protocol.superNode.connect(nodeOperator).closeDissolvedMinipool(nodeOperator.address, config.expectedMinipoolAddress)).to.be.revertedWith("The minipool can only be closed while dissolved");
        });
    });
    describe("when minipool is dissolved", function () {
        describe("when subNodeOperator address is valid", function () {
            describe("when minipool address is valid", function () {
                it("removes the validator", async function () {
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

                    // mint rETH, which will deposit into the minipool and set it to prelaunch state
                    setupData.rocketPool.rocketDepositPoolContract.connect(signers.ethWhale).deposit({value: ethers.utils.parseEther("100")})

                    // Increase the time by 10 days
                    const tenDays = 10*24*3600;
                    let latestTimestamp = (await ethers.provider.getBlock("latest")).timestamp
                    await ethers.provider.send("evm_mine", [latestTimestamp + tenDays]);

                    // Assert validator count prior to closing minipool
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(1);
                    expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(1);

                    // Dissolve and close minipool
                    await expect(minipoolContract.connect(nodeOperator).dissolve()).to.not.be.reverted;
                    await protocol.superNode.connect(nodeOperator).closeDissolvedMinipool(nodeOperator.address, config.expectedMinipoolAddress);

                    // Assert validator count prior after closing minipool
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(0);
                    expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(0);
                });
            });
            describe("when minipool address is invalid", function () {
                it("should revert", async function () {
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

                    // mint rETH, which will deposit into the minipool and set it to prelaunch state
                    setupData.rocketPool.rocketDepositPoolContract.connect(signers.ethWhale).deposit({value: ethers.utils.parseEther("100")})

                    // Increase the time by 10 days
                    const tenDays = 10*24*3600;
                    let latestTimestamp = (await ethers.provider.getBlock("latest")).timestamp
                    await ethers.provider.send("evm_mine", [latestTimestamp + tenDays]);

                    // Assert validator count prior to closing minipool
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(1);
                    expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(1);

                    // Dissolve and close minipool
                    await expect(minipoolContract.connect(nodeOperator).dissolve()).to.not.be.reverted;
                    // Invalid minipool address
                    await expect(protocol.superNode.connect(nodeOperator).closeDissolvedMinipool(nodeOperator.address, nodeOperator.address)).to.be.revertedWith("minipool not recognized");
                });
            });

        });
        describe("when subNodeOperator address is invalid", function () {
            it("should revert", async function () {
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

                // mint rETH, which will deposit into the minipool and set it to prelaunch state
                setupData.rocketPool.rocketDepositPoolContract.connect(signers.ethWhale).deposit({value: ethers.utils.parseEther("100")})

                // Increase the time by 10 days
                const tenDays = 10*24*3600;
                let latestTimestamp = (await ethers.provider.getBlock("latest")).timestamp
                await ethers.provider.send("evm_mine", [latestTimestamp + tenDays]);

                // Assert validator count prior to closing minipool
                expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(1);
                expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(1);

                // Dissolve and close minipool
                await expect(minipoolContract.connect(nodeOperator).dissolve()).to.not.be.reverted;
                // Close with invalid address
                await expect(protocol.superNode.connect(nodeOperator).closeDissolvedMinipool(config.expectedMinipoolAddress, config.expectedMinipoolAddress)).to.be.revertedWith("operator does not own the specified minipool");
            });
        });
    });
});