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


describe("SuperNodeAccount creation sig", function () {


    describe("When Admin Server Check enabled", async () => {

        describe("When timestamp - sigGenesisTime is greather than adminServerSigExpiry", async () => {
            it("Should revert", async () => {

            })
        })

        describe("When timestamp - sigGenesisTime is equal to adminServerSigExpiry", async () => {
            it("Should revert", async () => {
                
            })
        })

        describe("When timestamp - sigGenesisTime is less than to adminServerSigExpiry", async () => {
            describe("When sig has been used", async () => {
                it("Should revert", async () => {
                
                })
            })

            describe("When sig has NOT been used", async () => {
                describe("When sig has been encoded correctly", async () => {
                    describe("When user passes params matching sig", async () => {
                        it("Should pass", async () => {
                
                        })
                    })

                    describe("When user passes params matching many sigs", async () => {
                        it("Should pass for one sig and revert for all subsequent", async () => {
                
                        })
                    })

                    describe("When user passes params NOT matching sig", async () => {
                        describe("When expectedMinipool is invalid", async () => {
                            it("Should revert", async () => {
                
                            })
                        })

                        describe("When salt is invalid", async () => {
                            it("Should revert", async () => {
                
                            })
                        })

                        describe("When sigGenesisTime is invalid", async () => {
                            it("Should revert", async () => {
                
                            })
                        })


                        describe("When destination address is invalid", async () => {
                            it("Should revert", async () => {
                
                            })
                        })


                        describe("When nonce is invalid", async () => {
                            it("Should revert", async () => {
                
                            })
                        })


                        describe("When chain.id is invalid", async () => {
                            it("Should revert", async () => {
                
                            })
                        })
                    })
                })

                describe("When params have not been encoded correctly", async () => {
                    it("Should revert", async () => {
                
                    })
                })
            })
        })

    })


    describe("When Admin Server Check disabled", async () => {
        it("Should revert", async () => {
                
        })
    })

})