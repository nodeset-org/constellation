import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";

describe("Yield Accrual", function () {

    describe("When sender is not protocol", async () => {
        it("should revert", async () => {
            const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

            await expect(protocol.assetRouter.connect(signers.random5).onEthRewardsReceived(6, 6, 6)).to.be.revertedWith("Can only be called by Protocol!");
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
                        await expect(protocol.assetRouter.connect(signers.protocolSigner).onEthRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)).to.be.revertedWith("Transfer to treasury failed");
                    })
                })

                describe("When there is not enough eth in Asset Router for avgOperatorsFee", async () => {
                    it("should revert", async () => {
                        const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);
                        const reward = ethers.utils.parseEther("1")
                        const avgTreasuryFee = ethers.utils.parseEther("0")
                        const avgOperatorsFee = ethers.utils.parseEther("1")
                        await expect(protocol.assetRouter.connect(signers.protocolSigner).onEthRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)).to.be.revertedWith("Transfer to yield distributor failed");
                    })
                })
            })

            describe("When sufficent balance", async () => {
                describe("When community rewards are positive", async () => {
                    it("should increase balanceEthAndWeth & call onIncreaseOracleError", async () => {
                        const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);
                        const reward = ethers.utils.parseEther("1")
                        const avgTreasuryFee = ethers.utils.parseEther(".6") // 50%
                        const avgOperatorsFee = ethers.utils.parseEther(".4") // 50%

                        expect(await ethers.provider.getBalance(protocol.assetRouter.address)).equals(0);

                        // simulate reward sent to asset router
                        await protocol.assetRouter.connect(signers.protocolSigner).openGate();
                        await signers.ethWhale.sendTransaction({
                            to: protocol.assetRouter.address,
                            value: reward
                        })
                        await protocol.assetRouter.connect(signers.protocolSigner).closeGate();

                        expect(await ethers.provider.getBalance(protocol.assetRouter.address)).equals(reward);
                        expect(await ethers.provider.getBalance(protocol.yieldDistributor.address)).equals(0);
                        const initialBalanceTreasury = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress());
                        expect(await protocol.assetRouter.balanceEthAndWeth()).equals(0);

                        const expectedTreasuryPortion = reward.mul(avgTreasuryFee).div(ethers.utils.parseEther("1"))
                        const expectedOperatorPortion = reward.mul(avgOperatorsFee).div(ethers.utils.parseEther("1"))
                        const expectedCommunityPortion = reward.sub(expectedTreasuryPortion.add(expectedOperatorPortion));

                        await protocol.assetRouter.connect(signers.protocolSigner).onEthRewardsReceived(reward, avgTreasuryFee, avgOperatorsFee)
                        const finalBalanceTreasury = await ethers.provider.getBalance(await protocol.directory.getTreasuryAddress());

                        expect(finalBalanceTreasury.sub(initialBalanceTreasury)).equals(expectedTreasuryPortion);
                        expect(await ethers.provider.getBalance(protocol.yieldDistributor.address)).equals(expectedOperatorPortion);
                        expect(await ethers.provider.getBalance(protocol.assetRouter.address)).equals(expectedCommunityPortion);
                        expect(await protocol.assetRouter.balanceEthAndWeth()).equals(expectedCommunityPortion);

                    })
                })
    
                describe("When community rewards are negative", async () => {
                    it("should revert", async () => {
    
                    })
                })
            })
        })

        describe("When rewards are 0", async () => {

            it("does nothing", async () => {

            })

        })

        describe("When rewards are negative", async () => {

        })
    })
})