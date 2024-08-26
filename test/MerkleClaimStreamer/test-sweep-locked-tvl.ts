import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
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

                        const tx = await protocol.merkleClaimStreamer.connect(signers.admin).sweepLockedTVL();
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
                            "0x"+ethers.utils.stripZeros(priorRplStreamAmountSlot),
                            ethers.utils.hexZeroPad(priorRplStreamAmountValue, 32)
                        ]);
                        const priorRplStreamAmount = await protocol.merkleClaimStreamer.priorRplStreamAmount();
                        expect(priorRplStreamAmount).equals(priorRplStreamAmountValue);
                        await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.merkleClaimStreamer.address, rplOut);

                        expect(await protocol.merkleClaimStreamer.priorEthStreamAmount()).equals(0)

                        const odInitial = await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address);
                        const mcInitial = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);
                        const tx = await protocol.merkleClaimStreamer.connect(signers.admin).sweepLockedTVL();
                        const odFinal = await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address);
                        const mcFinal = await rocketPool.rplContract.balanceOf(protocol.merkleClaimStreamer.address);

                        const receipt = await tx.wait();
                        expect(receipt.events?.length).not.equals(0);

                        // assert the exact transfers that happended
                        expect(odFinal.sub(odInitial)).equals(rplOut.mul(-1));
                        expect(mcFinal.sub(mcInitial)).equals(rplOut);
                    })
                })
            })

            describe("When prior eth stream amount is not 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should pass (transfer out eth NOT rpl)", async () => {

                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl AND eth)", async () => {

                    })
                })
            })


            describe("When prior rpl stream amount is 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {

                    })
                })

                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth NOT rpl", async () => {

                    })
                })
            })

            describe("When prior rpl stream amount is not 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {

                    })
                })


                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth AND rpl)", async () => {

                    })
                })
            })
        })

        describe("When streaming interval has not finished", async () => {
            it("Should revert", async () => {

            })
        })
    })

    describe("When sender is admin", async () => {
        describe("When streaming interval has finished", async () => {

            describe("When prior eth stream amount is 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {

                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {

                    })
                })
            })

            describe("When prior eth stream amount is not 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should pass (transfer out eth NOT rpl)", async () => {

                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl AND eth)", async () => {

                    })
                })
            })


            describe("When prior rpl stream amount is 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {

                    })
                })

                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth NOT rpl", async () => {

                    })
                })
            })

            describe("When prior rpl stream amount is not 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {

                    })
                })


                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth AND rpl)", async () => {

                    })
                })
            })
        })

        describe("When streaming interval has not finished", async () => {
            it("Should revert", async () => {

            })
        })
    })

    describe("When sender is neither protocol nor admin", async () => {
        it("Should revert", async () => {

        })
    })
})