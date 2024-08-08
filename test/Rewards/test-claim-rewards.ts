import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";
import { assertAddOperator, createClaimRewardSig } from "../utils/utils";

describe("Claiming Rewards", async () => {
    describe("When _rewardee is not equal to address(0)", async () => {
        describe("When _rewardee is in whitelist", async () => {
            describe("When admin server sig has not been used", async () => {
                describe("When sig has not expired", async () => {
                    describe("When sig has been verified by correct role", async () => {
                        describe("When yieldDistributor has enough eth to send to operatorController", async () => {
                            it("Should pass", async () => {
                                const setupData = await loadFixture(protocolFixture);
                                const { protocol, signers, rocketPool } = setupData;
                            
                                const amount = ethers.utils.parseEther("1");
                                const rewardee = signers.random.address;
                                await assertAddOperator(setupData, signers.random);

                                await signers.ethWhale.sendTransaction({
                                    to: protocol.yieldDistributor.address,
                                    value: amount
                                })

                                const sig = await createClaimRewardSig(setupData, rewardee, amount);

                                await protocol.yieldDistributor.claimRewards(sig, rewardee, amount);

                            })

                            describe("When multiple users are trying to claim a nonce 0", async () => {
                                it("Should pass", async () => {

                                })
                            })

                            describe("When the same user is trying to claim two sigs with nonce 0", async () => {
                                it("Should revert", async () => {

                                })
                            })

                            describe("When another user tries to steal sig to claim funds", async () => {
                                it("Should give funds to rewardee NOT sender", async () => {

                                })
                            })
                        })

                        describe("When yieldDistributor does not have enough eth to send to operatorController", async () => {

                            it("Should revert", async () => {

                            })
                        })
                    })

                    describe("When sig has not been verified by correct role due to bad params", async () => {
                        describe("When param encoding is bad", async () => {
                            it("Should revert", async () => {

                            })
                        })
                        describe("When claim.amount is bad", async () => {
                            it("Should revert", async () => {

                            })
                        })
                        describe("When nonce is bad", async () => {
                            it("Should revert", async () => {

                            })
                        })
                        describe("When yieldDistributor address is bad", async () => {
                            it("Should revert", async () => {

                            })
                        })
                        describe("When chainid is bad", async () => {
                            it("Should revert", async () => {

                            })
                        })
                    })

                    describe("When sig has not been verified by correct role due to bad signer", async () => {
                        it("Should revert", async () => {

                        })
                    })
                })


                describe("When sig has expired", async () => {
                    it("Should revert", async () => {

                    })
                })
            })

            describe("When admin server sig has been used", async () => {
                it("Should revert", async () => {

                })
            })
        })

        describe("When _rewardee is not in whitelist", async () => {
            it("Should revert", async () => {

            })
        })
    })

    describe("When _rewardee is equal to address(0)", async () => {
        it("Should revert", async () => {

        })
    })
})