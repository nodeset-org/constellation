import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";
import { generateDepositData } from ".././rocketpool/_helpers/minipool";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator } from ".././utils/utils";

describe("SuperNodeAccount close", function () {
    describe("when minipool is not dissolved", function () {
        it("should revert", async function () {
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

            // Deposit 720 RPL
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

            const minipoolContract = (await ethers.getContractAt(
                'IMinipool',
                config.expectedMinipoolAddress
            ));

            // Deposit minipool to set to prelaunch state
            await expect(minipoolContract.connect(nodeOperator).deposit({
                    value: ethMintAmount
            })).to.not.be.reverted;

            // Increase the time by 10 days
            await ethers.provider.send("evm_increaseTime", [10*24*3600]);
            await ethers.provider.send("evm_mine", []);

            // Assert validator count prior to closing minipool
            expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(1);
            expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(1);

            // Only close minipool
            await expect(protocol.superNode.connect(nodeOperator).close(nodeOperator.address, config.expectedMinipoolAddress)).to.be.revertedWith("The minipool can only be closed while dissolved");
        });
    });
    describe("when minipool is dissolved", function () {
        describe("when subNodeOperator address is valid", function () {
            describe("when minipool address is valid", function () {
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

                    // Deposit 720 RPL
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

                    const minipoolContract = (await ethers.getContractAt(
                        'IMinipool',
                        config.expectedMinipoolAddress
                    ));

                    // Deposit minipool to set to prelaunch state
                    await expect(minipoolContract.connect(nodeOperator).deposit({
                            value: ethMintAmount
                    })).to.not.be.reverted;

                    // Increase the time by 10 days
                    await ethers.provider.send("evm_increaseTime", [10*24*3600]);
                    await ethers.provider.send("evm_mine", []);

                    // Assert validator count prior to closing minipool
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(1);
                    expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(1);

                    // Dissolve and close minipool
                    await expect(minipoolContract.connect(nodeOperator).dissolve()).to.not.be.reverted;
                    await protocol.superNode.connect(nodeOperator).close(nodeOperator.address, config.expectedMinipoolAddress);

                    // Assert validator count prior after closing minipool
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(0);
                    expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(0);
                });
            });
            describe("when minipool address is invalid", function () {
                it("should revert", async function () {
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

                    // Deposit 720 RPL
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

                    const minipoolContract = (await ethers.getContractAt(
                        'IMinipool',
                        config.expectedMinipoolAddress
                    ));

                    // Deposit minipool to set to prelaunch state
                    await expect(minipoolContract.connect(nodeOperator).deposit({
                            value: ethMintAmount
                    })).to.not.be.reverted;

                    // Increase the time by 10 days
                    await ethers.provider.send("evm_increaseTime", [10*24*3600]);
                    await ethers.provider.send("evm_mine", []);

                    // Assert validator count prior to closing minipool
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(1);
                    expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(1);

                    // Dissolve and close minipool
                    await expect(minipoolContract.connect(nodeOperator).dissolve()).to.not.be.reverted;
                    // Invalid minipool address
                    await expect(protocol.superNode.connect(nodeOperator).close(nodeOperator.address, nodeOperator.address)).to.be.revertedWith("minipool not recognized");
                });
            });

        });
        describe("when subNodeOperator address is invalid", function () {
            it("should revert", async function () {
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

                // Deposit 720 RPL
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

                const minipoolContract = (await ethers.getContractAt(
                    'IMinipool',
                    config.expectedMinipoolAddress
                ));

                // Deposit minipool to set to prelaunch state
                await expect(minipoolContract.connect(nodeOperator).deposit({
                        value: ethMintAmount
                })).to.not.be.reverted;

                // Increase the time by 10 days
                await ethers.provider.send("evm_increaseTime", [10*24*3600]);
                await ethers.provider.send("evm_mine", []);

                // Assert validator count prior to closing minipool
                expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(1);
                expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(1);

                // Dissolve and close minipool
                await expect(minipoolContract.connect(nodeOperator).dissolve()).to.not.be.reverted;
                // Close with invalid address
                await protocol.superNode.connect(nodeOperator).close(config.expectedMinipoolAddress, config.expectedMinipoolAddress);

                // Assert validator count prior to closing minipool
                expect(await protocol.whitelist.getActiveValidatorCountForOperator(nodeOperator.address)).to.be.equal(0);
                expect(await protocol.superNode.connect(nodeOperator).getNumMinipools()).to.be.equal(0);
            });
        });
    });


});