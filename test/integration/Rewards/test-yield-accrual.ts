import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../integration";

describe("Yield Accrual", function () {
    describe("When sender is not protocol", async () => {
        it("should revert", async () => {

            const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

            await expect(protocol.operatorDistributor.connect(signers.random5).onEthBeaconRewardsReceived(6, 6, 6)).to.be.revertedWith("Can only be called by Protocol!");
        })
    })

    describe("When sender is protocol", async () => {
        describe("When rewards are positive", async () => {
            describe("When insufficient balance", async () => {
                describe("When there is not enough eth in Asset Router for avgTreasuryFee", async () => {
                    it("should revert", async () => {
                        const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);
                        const reward = ethers.utils.parseEther("1")
                        const avgTreasuryFee = ethers.utils.parseEther("1")
                        const avgOperatorsFee = ethers.utils.parseEther("0")
                        await expect(protocol.operatorDistributor.connect(signers.protocolSigner).onEthBeaconRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)).to.be.revertedWith("Transfer to treasury failed");
                    })
                })

                describe("When there is not enough eth in Asset Router for avgOperatorsFee", async () => {
                    it("should revert", async () => {
                        const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);
                        const reward = ethers.utils.parseEther("1")
                        const avgTreasuryFee = ethers.utils.parseEther("0")
                        const avgOperatorsFee = ethers.utils.parseEther("1")
                        await expect(protocol.operatorDistributor.connect(signers.protocolSigner).onEthBeaconRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)).to.be.revertedWith("Transfer to operator fee address failed");
                    })
                })
            })

            describe("When sufficent balance", async () => {

                describe("When oracle error is true", async () => {
                    describe("When community rewards are positive", async () => {
                        type ParamsType = { avgTreasuryFeeRaw: number; avgOperatorsFeeRaw: number; };
                        [
                            { avgTreasuryFeeRaw: .6, avgOperatorsFeeRaw: .4, },
                            { avgTreasuryFeeRaw: .1, avgOperatorsFeeRaw: .1, },
                            { avgTreasuryFeeRaw: .5, avgOperatorsFeeRaw: .4, },
                            { avgTreasuryFeeRaw: .99, avgOperatorsFeeRaw: .01, },
                            { avgTreasuryFeeRaw: .99999, avgOperatorsFeeRaw: .00001, },
                            { avgTreasuryFeeRaw: 1, avgOperatorsFeeRaw: 0, },
                            { avgTreasuryFeeRaw: 0, avgOperatorsFeeRaw: 1, }
                        ].forEach((params: ParamsType) => {
                            it(`should increase balance & call onIncreaseOracleError: avgTreasuryFee=${params.avgTreasuryFeeRaw}, avgOperatorsFee=${params.avgOperatorsFeeRaw}`, async () => {
                                const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);
                                const reward = ethers.utils.parseEther("1")
                                const avgTreasuryFee = ethers.utils.parseEther(`${params.avgTreasuryFeeRaw}`) // 50%
                                const avgOperatorsFee = ethers.utils.parseEther(`${params.avgOperatorsFeeRaw}`) // 50%

                                expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(0);

                                // simulate reward sent to operatorDistributor
                                await signers.random.sendTransaction({
                                    to: protocol.operatorDistributor.address,
                                    value: reward
                                })

                                expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(reward);
                                expect(await ethers.provider.getBalance(protocol.yieldDistributor.address)).equals(0);
                                expect(await protocol.wETH.balanceOf(protocol.operatorDistributor.address)).equals(0);

                                const expectedTreasuryPortion = reward.mul(avgTreasuryFee).div(ethers.utils.parseEther("1"))
                                const expectedOperatorPortion = reward.mul(avgOperatorsFee).div(ethers.utils.parseEther("1"))
                                const expectedCommunityPortion = reward.sub(expectedTreasuryPortion.add(expectedOperatorPortion));

                                const tx = await protocol.operatorDistributor.connect(signers.protocolSigner).onEthBeaconRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)
                                const receipt = await tx.wait();
                                const block = receipt.blockNumber;

                                const initialBalanceTreasury = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress(), block - 1);
                                const finalBalanceTreasury = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress(), block);

                                expect(finalBalanceTreasury.sub(initialBalanceTreasury)).equals(expectedTreasuryPortion);
                                expect(await ethers.provider.getBalance(protocol.directory.getOperatorRewardAddress())).equals(expectedOperatorPortion);
                                expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(expectedCommunityPortion);
                                expect(await protocol.operatorDistributor.oracleError()).equals(expectedCommunityPortion);
                            })
                        })
                    })

                })

                describe("When community rewards are negative", async () => {
                    it("should revert", async () => {
                        const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);
                        const reward = ethers.utils.parseEther("1")
                        const avgTreasuryFee = ethers.utils.parseEther(".9") // 90%
                        const avgOperatorsFee = ethers.utils.parseEther(".9") // 90%

                        expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(0);

                        // simulate reward sent to asset router
                        await signers.ethWhale.sendTransaction({
                            to: protocol.operatorDistributor.address,
                            value: reward.mul(10)
                        })

                        expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(reward.mul(10));
                        expect(await ethers.provider.getBalance(protocol.yieldDistributor.address)).equals(0);

                        const expectedTreasuryPortion = reward.mul(avgTreasuryFee).div(ethers.utils.parseEther("1"))
                        const expectedOperatorPortion = reward.mul(avgOperatorsFee).div(ethers.utils.parseEther("1"))

                        // expect the community rewards underflow to cause revert
                        await expect(protocol.operatorDistributor.connect(signers.protocolSigner).onEthBeaconRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)).to.be.revertedWithPanic('0x11')

                    })
                })
            })
        })

        describe("When rewards are 0", async () => {

            it("does nothing", async () => {
                const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);
                const reward = ethers.utils.parseEther("0")
                const avgTreasuryFee = ethers.utils.parseEther(".6") // 50%
                const avgOperatorsFee = ethers.utils.parseEther(".4") // 50%

                expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(0);

                // simulate reward sent to asset router
                await signers.ethWhale.sendTransaction({
                    to: protocol.operatorDistributor.address,
                    value: reward
                })

                expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(reward);
                expect(await ethers.provider.getBalance(protocol.yieldDistributor.address)).equals(0);
                const initialBalanceTreasury = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress());

                const expectedTreasuryPortion = 0
                const expectedOperatorPortion = 0
                const expectedCommunityPortion = 0

                await protocol.operatorDistributor.connect(signers.protocolSigner).onEthBeaconRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)
                const finalBalanceTreasury = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress());

                expect(finalBalanceTreasury.sub(initialBalanceTreasury)).equals(expectedTreasuryPortion);
                expect(await ethers.provider.getBalance(protocol.yieldDistributor.address)).equals(expectedOperatorPortion);
                expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(expectedCommunityPortion);
            })

        })

        describe("When rewards are negative", async () => {

            it("should revert", async () => {
            const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);
            const reward = ethers.utils.parseEther("1").mul(-1);
            const avgTreasuryFee = ethers.utils.parseEther(".6") // 50%
            const avgOperatorsFee = ethers.utils.parseEther(".4") // 50%

            expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(0);

            // simulate reward sent to asset router
            await signers.ethWhale.sendTransaction({
                to: protocol.operatorDistributor.address,
                value: reward.mul(-1)
            })

            await expect(protocol.operatorDistributor.connect(signers.protocolSigner).onEthBeaconRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)).to.be.rejected;
            })
        })
    })
})