import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { protocolFixture } from "../test";
import { BigNumber } from "ethers";
import { keccak256 } from "ethereumjs-util";

describe("Operator Self Remove", function () {
    describe("When there is 1 user", async () => {
        describe("When sender has been a sub node operator", async () => {
            describe("When sender activeValidatorCount is equal to 0", async () => {
                it("Should pass", async () => {

                })
            })

            describe("When sender activeValidatorCount is greater than 0", async () => {
                it("Should pass", async () => {

                })
            })
        })

        describe("When sender has not been a sub node operator", async () => {
            describe("When sender activeValidatorCount is equal to 0", async () => {
                it("Should pass", async () => {

                })
            })

            describe("When sender activeValidatorCount is greater than 0", async () => {
                it("Should pass", async () => {

                })
            })
        })
    })

    describe("When there are multiple users", async () => {
        describe("When sender has been a sub node operator", async () => {
            describe("When sender activeValidatorCount is equal to 0", async () => {
                it("Should pass", async () => {

                })
            })

            describe("When sender activeValidatorCount is greater than 0", async () => {
                it("Should pass", async () => {

                })
            })
        })

        describe("When sender has not been a sub node operator", async () => {
            describe("When sender activeValidatorCount is equal to 0", async () => {
                it("Should pass", async () => {

                })
            })

            describe("When sender activeValidatorCount is greater than 0", async () => {
                it("Should pass", async () => {

                })
            })
        })
    })
})