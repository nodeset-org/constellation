import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Yield Accrual", function () {

    describe("When sender is not protocol", async () => {
        it("should revert", async () => {

        })
    })

    describe("When sender is protocol", async () => {
        describe("When rewards are positive", async () => {

            describe("When there is not enough eth in Asset Router for avgTreasuryFee", async () => {
                it("should revert", async () => {

                })
            })

            describe("When there is not enough eth in Asset Router for avgOperatorsFee", async () => {
                it("should revert", async () => {

                })
            })

            describe("When community rewards are positive", async () => {
                it("should increase balanceEthAndWeth & call onIncreaseOracleError", async () => {
                    
                })
            })

            describe("When community rewards are negative", async () => {
                it("should revert", async () => {

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