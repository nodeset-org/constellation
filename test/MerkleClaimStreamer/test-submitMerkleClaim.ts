import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assertTransferEvents, expectNumberE18ToBeApproximately, getEventNames, increaseEVMTime, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe("submitMerkleClaim()", async () => {

    describe("When claim is submitted for 1 user", async () => {
        describe("When merkleClaimsEnabled", async () => {
            describe("When ethReward is greater than 0", async () => {
                describe("When has enough balance to send ethTreasuryPortion to Treasury Address", async () => {
                    describe("When has enough balance to send ethOperatorPortion to Operator Reward Address", async () => {
                        it("Should pass and update eth balances accordingly", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const treasury = await protocol.directory.getTreasuryAddress();
                            const operatorRewards = await protocol.directory.getOperatorRewardAddress();

                            const rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress())
                            await rocketMDM.useMock();
                            const rocketVault = await ethers.getContractAt("RocketVault", await rocketPool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));
                            await rocketVault.useMock();

                            const ethRewards = ethers.utils.parseEther("1");
                            const rplRewards = ethers.utils.parseEther("0");

                            expect(await protocol.merkleClaimStreamer.merkleClaimsEnabled()).equals(true);
                            await rocketPool.rplContract.connect(setupData.signers.rplWhale).transfer(rocketVault.address, rplRewards);
                            await setupData.signers.ethWhale.sendTransaction({
                                to: rocketVault.address,
                                value: ethRewards
                            })

                            const rewardIndex = [0];
                            const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

                            const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval()

                            const expectedTreasuryPortionEth = await protocol.vCWETH.getTreasuryPortion(ethRewards);
                            const expectedOperatorPortionEth = await protocol.vCWETH.getOperatorPortion(ethRewards);
                            const expectedCommunityPortionEth = ethRewards.sub(expectedTreasuryPortionEth).sub(expectedOperatorPortionEth);


                            const initialBalanceTreasury = await ethers.provider.getBalance(treasury);
                            const initialBalanceOd = await ethers.provider.getBalance(operatorRewards);

                            expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0);
                            expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0);
                            expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals(0)

                            const tx = await protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof);

                            const finalBalanceTreasury = await ethers.provider.getBalance(treasury);
                            const finalBalanceOd = await ethers.provider.getBalance(operatorRewards);

                            const receipt = await tx.wait();

                            expect(finalBalanceTreasury.sub(initialBalanceTreasury)).equals(expectedTreasuryPortionEth);
                            expect(finalBalanceOd.sub(initialBalanceOd)).equals(expectedOperatorPortionEth);

                            expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(expectedCommunityPortionEth);
                            expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0);
                            expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals((await ethers.provider.getBlock(receipt.blockNumber)).timestamp)


                        })
                    })
                })

                describe("When does not have enough balance to send ethTreasuryPortion to Treasury Address", async () => {


                    it("Should revert", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress())
                        await rocketMDM.useMock();
                        const rocketVault = await ethers.getContractAt("RocketVault", await rocketPool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));
                        await rocketVault.useMock();

                        const ethRewards = ethers.utils.parseEther("1");
                        const rplRewards = ethers.utils.parseEther("0");

                        const rewardIndex = [0];
                        const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

                        await expect(protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof)).to.be.reverted;

                    })

                })

            })

            describe("When ethReward is equal to 0", async () => {

                it("Should pass without changing eth balances", async () => {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;

                    const treasury = await protocol.directory.getTreasuryAddress();
                    const operatorRewards = await protocol.directory.getOperatorRewardAddress();

                    const rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress())
                    await rocketMDM.useMock();
                    const rocketVault = await ethers.getContractAt("RocketVault", await rocketPool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));
                    await rocketVault.useMock();

                    const ethRewards = ethers.utils.parseEther("0");
                    const rplRewards = ethers.utils.parseEther("0");

                    expect(await protocol.merkleClaimStreamer.merkleClaimsEnabled()).equals(true);
                    await rocketPool.rplContract.connect(setupData.signers.rplWhale).transfer(rocketVault.address, rplRewards);
                    await setupData.signers.ethWhale.sendTransaction({
                        to: rocketVault.address,
                        value: ethRewards
                    })

                    const rewardIndex = [0];
                    const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

                    const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval()

                    const expectedTreasuryPortionEth = await protocol.vCWETH.getTreasuryPortion(ethRewards);
                    const expectedOperatorPortionEth = await protocol.vCWETH.getOperatorPortion(ethRewards);
                    const expectedCommunityPortionEth = ethRewards.sub(expectedTreasuryPortionEth).sub(expectedOperatorPortionEth);


                    const initialBalanceTreasury = await ethers.provider.getBalance(treasury);
                    const initialBalanceOd = await ethers.provider.getBalance(operatorRewards);

                    expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0);
                    expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0);
                    expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals(0)

                    // TODO: This should fail in RP but we've added a mock mode to the RocketMerkleDistributorMainnet's _claim function to bypass
                    // actual merkle proof validation for unit tests.
                    const tx = await protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof);

                    const finalBalanceTreasury = await ethers.provider.getBalance(treasury);
                    const finalBalanceOd = await ethers.provider.getBalance(operatorRewards);

                    const receipt = await tx.wait();

                    expect(finalBalanceTreasury.sub(initialBalanceTreasury)).equals(0);
                    expect(finalBalanceOd.sub(initialBalanceOd)).equals(0);

                    expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0);
                    expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0);
                    expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals((await ethers.provider.getBlock(receipt.blockNumber)).timestamp)

                })

            })

            describe("When rplReward is greater than 0", async () => {

                describe("When has enough balance to send rplTreasuryPortion to Treasury Address", async () => {

                    it("Should pass and update rpl balances accordingly", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const treasury = await protocol.directory.getTreasuryAddress();
                        const operatorRewards = await protocol.directory.getOperatorRewardAddress();

                        const rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress())
                        await rocketMDM.useMock();
                        const rocketVault = await ethers.getContractAt("RocketVault", await rocketPool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));
                        await rocketVault.useMock();

                        const ethRewards = ethers.utils.parseEther("0");
                        const rplRewards = ethers.utils.parseEther("1");

                        expect(await protocol.merkleClaimStreamer.merkleClaimsEnabled()).equals(true);
                        await rocketPool.rplContract.connect(setupData.signers.rplWhale).transfer(rocketVault.address, rplRewards);
                        await setupData.signers.ethWhale.sendTransaction({
                            to: rocketVault.address,
                            value: ethRewards
                        })

                        const rewardIndex = [0];
                        const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

                        const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval()

                        const expectedTreasuryPortionRpl = await protocol.vCRPL.getTreasuryPortion(rplRewards);
                        const expectedCommunityPortionRpl = rplRewards.sub(expectedTreasuryPortionRpl);

                        const initialBalanceTreasury = await rocketPool.rplContract.balanceOf(treasury);
                        const initialBalanceOd = await rocketPool.rplContract.balanceOf(operatorRewards);

                        expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0);
                        expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0);
                        expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals(0)

                        const tx = await protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof);

                        const finalBalanceTreasury = await rocketPool.rplContract.balanceOf(treasury);
                        const finalBalanceOd = await rocketPool.rplContract.balanceOf(operatorRewards);

                        const receipt = await tx.wait();

                        expect(finalBalanceTreasury.sub(initialBalanceTreasury)).equals(expectedTreasuryPortionRpl);
                        expect(finalBalanceOd.sub(initialBalanceOd)).equals(0);

                        expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0);
                        expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(expectedCommunityPortionRpl);
                        expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals((await ethers.provider.getBlock(receipt.blockNumber)).timestamp)

                    })

                })

                describe("When does not have enough balance to send rplTreasuryPortion to Treasury Address", async () => {
                    it("Should revert", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress())
                        await rocketMDM.useMock();
                        const rocketVault = await ethers.getContractAt("RocketVault", await rocketPool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));
                        await rocketVault.useMock();

                        const ethRewards = ethers.utils.parseEther("0");
                        const rplRewards = ethers.utils.parseEther("1");

                        expect(await protocol.merkleClaimStreamer.merkleClaimsEnabled()).equals(true);

                        const rewardIndex = [0];
                        const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

                        await expect(protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof)).to.be.reverted;

                    })
                })
            })

            describe("When rplReward is equal 0", async () => {

                it("Should pass without changing rpl balances", async () => {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;

                    const treasury = await protocol.directory.getTreasuryAddress();
                    const operatorRewards = await protocol.directory.getOperatorRewardAddress();

                    const rocketMDM = await ethers.getContractAt("RocketMerkleDistributorMainnet", await protocol.directory.getRocketMerkleDistributorMainnetAddress())
                    await rocketMDM.useMock();
                    const rocketVault = await ethers.getContractAt("RocketVault", await rocketPool.rockStorageContract.getAddress(await rocketMDM.rocketVaultKey()));
                    await rocketVault.useMock();

                    const ethRewards = ethers.utils.parseEther("0");
                    const rplRewards = ethers.utils.parseEther("0");

                    expect(await protocol.merkleClaimStreamer.merkleClaimsEnabled()).equals(true);
                    await rocketPool.rplContract.connect(setupData.signers.rplWhale).transfer(rocketVault.address, rplRewards);
                    await setupData.signers.ethWhale.sendTransaction({
                        to: rocketVault.address,
                        value: ethRewards
                    })

                    const rewardIndex = [0];
                    const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

                    const streamingInterval = await protocol.merkleClaimStreamer.streamingInterval()

                    const initialBalanceTreasury = await rocketPool.rplContract.balanceOf(treasury);
                    const initialBalanceOd = await rocketPool.rplContract.balanceOf(operatorRewards);

                    expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0);
                    expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0);
                    expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals(0)

                    // TODO: This should fail in RP but we've added a mock mode to the RocketMerkleDistributorMainnet's _claim function to bypass
                    // actual merkle proof validation for unit tests.
                    const tx = await protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof);

                    const finalBalanceTreasury = await rocketPool.rplContract.balanceOf(treasury);
                    const finalBalanceOd = await rocketPool.rplContract.balanceOf(operatorRewards);

                    const receipt = await tx.wait();

                    expect(finalBalanceTreasury.sub(initialBalanceTreasury)).equals(0);
                    expect(finalBalanceOd.sub(initialBalanceOd)).equals(0);

                    expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0);
                    expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0);
                    expect(await protocol.merkleClaimStreamer.lastClaimTime()).equals((await ethers.provider.getBlock(receipt.blockNumber)).timestamp)
                })

            })
        })

        describe("When not merkleClaimsEnabled", async () => {
            it("Should revert", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                await protocol.merkleClaimStreamer.connect(signers.admin).setMerkleClaimsEnabled(false);


                const ethRewards = ethers.utils.parseEther("0");
                const rplRewards = ethers.utils.parseEther("0");
                const rewardIndex = [0];
                const proof = [[ethers.utils.hexZeroPad("0x0", 32)], [ethers.utils.hexZeroPad("0x0", 32)]]

                await expect(protocol.merkleClaimStreamer.submitMerkleClaim(rewardIndex, [rplRewards], [ethRewards], proof)).to.be.revertedWith("Merkle claims are disabled");
            })
        })
    })
})