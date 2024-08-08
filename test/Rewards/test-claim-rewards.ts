import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";

describe("Claiming Rewards", async () => {
    describe("When _rewardee is not equal to address(0)", async () => {
        describe("When _rewardee is in whitelist", async () => {
            describe("When admin server sig has not been used", async () => {
                describe("When sig has not expired", async () => {
                    describe("When sig has been verified by correct role", async () => {
                        describe("When yieldDistributor has enough eth to send to operatorController", async () => {
                            it("Should pass", async () => {

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
                        describe("When claim.sigGenesisTime is bad", async () => {
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