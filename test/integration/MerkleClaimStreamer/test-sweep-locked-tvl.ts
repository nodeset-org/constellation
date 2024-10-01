import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../integration";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assertTransferEvents, expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe("sweepLockedTVL()", async () => {

    describe("When sender is protocol", async () => {
        describe("When streaming interval has finished", async () => {
            describe("When prior eth stream amount is 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0)
                        expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0)

                        const tx = await protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL();
                        const receipt = await tx.wait();
                        expect(receipt.events?.length).equals(0);
                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const rplOut = ethers.utils.parseEther("1");
                        const priorRplStreamAmountValue = rplOut.toHexString();
                        const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorRplStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                        ]);
                        const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                        expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);
                        await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.merkleClaimStreamer.address, rplOut);

                        expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0)

                        const mcInitial = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const tx = await protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL();
                        const mcFinal = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);

                        const receipt = await tx.wait();
                        expect(receipt.events?.length).not.equals(0);

                        // assert the exact transfers that happended
                        expect(mcFinal.sub(mcInitial)).equals(rplOut.mul(-1));

                        expect(assertTransferEvents(receipt, [{
                            address: rocketPool.rplContract.address,
                            from: protocol.merkleClaimStreamer.address,
                            to: protocol.operatorDistributor.address,
                            amount: rplOut
                        }])).to.be.true;
                    })
                })
            })

            describe("When prior eth stream amount is not 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should pass (transfer out eth NOT rpl)", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const ethOut = ethers.utils.parseEther("1");

                        const priorEthStreamAmountValue = ethOut.toHexString();
                        const priorEthStreamAmountSlot = ethers.BigNumber.from(67).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorEthStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorEthStreamAmountValue, 32)
                        ]);

                        const priorEthStreamAmount = await protocol.merkleClaimStreamer.priorEthStreamAmount();
                        expect(priorEthStreamAmount).equals(priorEthStreamAmountValue);

                        signers.ethWhale.sendTransaction({
                            to: protocol.merkleClaimStreamer.address,
                            value: ethOut
                        })

                        const mcInitial = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);
                        const tx = await protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL();
                        const mcFinal = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);

                        const receipt = await tx.wait();
                        expect(receipt.events?.length).not.equals(0);

                        // assert the exact transfers that happended
                        expect(mcFinal.sub(mcInitial)).equals(ethOut.mul(-1));
                        expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).gt(0);
                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl AND eth)", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const ethOut = ethers.utils.parseEther("1");

                        const priorEthStreamAmountValue = ethOut.toHexString();
                        const priorEthStreamAmountSlot = ethers.BigNumber.from(67).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorEthStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorEthStreamAmountValue, 32)
                        ]);

                        const priorEthStreamAmount = await protocol.merkleClaimStreamer.priorEthStreamAmount();
                        expect(priorEthStreamAmount).equals(priorEthStreamAmountValue);

                        signers.ethWhale.sendTransaction({
                            to: protocol.merkleClaimStreamer.address,
                            value: ethOut
                        })

                        const rplOut = ethers.utils.parseEther("1");
                        const priorRplStreamAmountValue = rplOut.toHexString();
                        const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorRplStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                        ]);
                        const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                        expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);
                        await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.merkleClaimStreamer.address, rplOut);


                        const mcInitialRpl = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const mcInitialEth = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);
                        const tx = await protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL();
                        const mcFinalRpl = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const mcFinalEth = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);

                        const receipt = await tx.wait();
                        expect(receipt.events?.length).not.equals(0);

                        // assert the exact transfers that happended
                        expect(mcFinalEth.sub(mcInitialEth)).equals(ethOut.mul(-1));
                        expect(mcFinalRpl.sub(mcInitialRpl)).equals(rplOut.mul(-1));

                        expect(assertTransferEvents(receipt, [{
                            address: rocketPool.rplContract.address,
                            from: protocol.merkleClaimStreamer.address,
                            to: protocol.operatorDistributor.address,
                            amount: rplOut
                        }])).to.be.true;
                        expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).gt(0);
                    })
                })
            })


            describe("When prior rpl stream amount is 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0)
                        expect(await protocol.merkleClaimStreamer.priorRplStreamAmount()).equals(0)

                        const tx = await protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL();
                        const receipt = await tx.wait();
                        expect(receipt.events?.length).equals(0);
                    })
                })

                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth NOT rpl", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const ethOut = ethers.utils.parseEther("1");

                        const priorEthStreamAmountValue = ethOut.toHexString();
                        const priorEthStreamAmountSlot = ethers.BigNumber.from(67).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorEthStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorEthStreamAmountValue, 32)
                        ]);

                        const priorEthStreamAmount = await protocol.merkleClaimStreamer.priorEthStreamAmount();
                        expect(priorEthStreamAmount).equals(priorEthStreamAmountValue);

                        signers.ethWhale.sendTransaction({
                            to: protocol.merkleClaimStreamer.address,
                            value: ethOut
                        })

                        const rplOut = ethers.utils.parseEther("0");
                        const priorRplStreamAmountValue = rplOut.toHexString();
                        const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorRplStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                        ]);
                        const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                        expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);
                        await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.merkleClaimStreamer.address, rplOut);


                        const mcInitialRpl = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const mcInitialEth = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);
                        const tx = await protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL();
                        const mcFinalRpl = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const mcFinalEth = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);

                        const receipt = await tx.wait();
                        expect(receipt.events?.length).not.equals(0);

                        // assert the exact transfers that happended
                        expect(mcFinalEth.sub(mcInitialEth)).equals(ethOut.mul(-1));
                        expect(mcFinalRpl.sub(mcInitialRpl)).equals(rplOut.mul(-1));


                        expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).gt(0);
                    })
                })
            })

            describe("When prior rpl stream amount is not 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const ethOut = ethers.utils.parseEther("0");
                        const priorEthStreamAmount = await protocol.merkleClaimStreamer.priorEthStreamAmount();
                        expect(priorEthStreamAmount).equals(ethOut);


                        const rplOut = ethers.utils.parseEther("1");
                        const priorRplStreamAmountValue = rplOut.toHexString();
                        const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorRplStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                        ]);
                        const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                        expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);
                        await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.merkleClaimStreamer.address, rplOut);


                        const mcInitialRpl = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const mcInitialEth = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);
                        const tx = await protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL();
                        const mcFinalRpl = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const mcFinalEth = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);

                        const receipt = await tx.wait();
                        expect(receipt.events?.length).not.equals(0);

                        // assert the exact transfers that happended
                        expect(mcFinalEth.sub(mcInitialEth)).equals(ethOut.mul(-1));
                        expect(mcFinalRpl.sub(mcInitialRpl)).equals(rplOut.mul(-1));

                        expect(assertTransferEvents(receipt, [{
                            address: rocketPool.rplContract.address,
                            from: protocol.merkleClaimStreamer.address,
                            to: protocol.operatorDistributor.address,
                            amount: rplOut
                        }])).to.be.true;
                        expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).eq(0);
                    })
                })


                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth AND rpl)", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const ethOut = ethers.utils.parseEther("1");

                        const priorEthStreamAmountValue = ethOut.toHexString();
                        const priorEthStreamAmountSlot = ethers.BigNumber.from(67).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorEthStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorEthStreamAmountValue, 32)
                        ]);

                        const priorEthStreamAmount = await protocol.merkleClaimStreamer.priorEthStreamAmount();
                        expect(priorEthStreamAmount).equals(priorEthStreamAmountValue);

                        signers.ethWhale.sendTransaction({
                            to: protocol.merkleClaimStreamer.address,
                            value: ethOut
                        })

                        const rplOut = ethers.utils.parseEther("1");
                        const priorRplStreamAmountValue = rplOut.toHexString();
                        const priorRplStreamAmountSlot = ethers.BigNumber.from(68).toHexString();
                        await ethers.provider.send("hardhat_setStorageAt", [
                            protocol.merkleClaimStreamer.address,
                            "0x" + ethers.utils.stripZeros(priorRplStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                        ]);
                        const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                        expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);
                        await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.merkleClaimStreamer.address, rplOut);


                        const mcInitialRpl = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const mcInitialEth = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);
                        const tx = await protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL();
                        const mcFinalRpl = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const mcFinalEth = await ethers.provider.getBalance(protocol.merkleClaimStreamer.address);

                        const receipt = await tx.wait();
                        expect(receipt.events?.length).not.equals(0);

                        // assert the exact transfers that happended
                        expect(mcFinalEth.sub(mcInitialEth)).equals(ethOut.mul(-1));
                        expect(mcFinalRpl.sub(mcInitialRpl)).equals(rplOut.mul(-1));

                        expect(assertTransferEvents(receipt, [{
                            address: rocketPool.rplContract.address,
                            from: protocol.merkleClaimStreamer.address,
                            to: protocol.operatorDistributor.address,
                            amount: rplOut
                        }])).to.be.true;
                        expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).gt(0);
                    })
                })
            })
        })

        describe("When streaming interval has not finished", async () => {
            it("Should revert", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                const timestamp = (await ethers.provider.getBlock("latest")).timestamp

                const lastClaimTimeValue = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.BigNumber.from(timestamp - 600)), 32);
                const slot = ethers.BigNumber.from(69).toHexString();
                await ethers.provider.send("hardhat_setStorageAt", [
                    protocol.merkleClaimStreamer.address,
                    "0x" + ethers.utils.stripZeros(slot),
                    lastClaimTimeValue
                ]);

                const lastClaimTime = await protocol.merkleClaimStreamer.lastClaimTime();
                expect(lastClaimTime).equals(lastClaimTimeValue);


                await expect(protocol.merkleClaimStreamer.connect(signers.protocolSigner).sweepLockedTVL()).to.be.revertedWith("Current streaming interval is not finished");

            })
        })
    })

    describe("When sender not protocol", async () => {
        it("Should revert", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            await expect(protocol.merkleClaimStreamer.connect(signers.random).sweepLockedTVL()).to.be.revertedWith("Can only be called by Protocol!");
        })

        it("Should revert if admin calls", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            await expect(protocol.merkleClaimStreamer.connect(signers.admin).sweepLockedTVL()).to.be.revertedWith("Can only be called by Protocol!");
        })
    })
})