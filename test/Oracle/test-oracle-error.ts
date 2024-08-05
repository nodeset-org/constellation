import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("oracleError", function () {

    describe("when oracle is negative", function () {
        describe("claim rewards from distribute balance", async () => {
            it("creates negative getDistributableYield", async () => {

            })

            it("increases a losing share value", async () => {

            })
        })

        describe("claim rewards from merkle claim", async () => {

            it("creates negative getDistributableYield", async () => {

            })

            it("increases a losing share value", async () => {

            })
        })
    })

    describe("when oracle is positive", function () {
        describe("claim rewards from distribute balance", async () => {
            it("creates a positive getDistributableYield", async () => {

            })

            it("increases a winning share value", async () => {

            })
        })


        describe("claim rewards from merkle claim", async () => {
            it("creates a positive getDistributableYield", async () => {

            })

            it("increases a winning share value", async () => {

            })
        })
    })

    describe("when oracle is 0", function () {
        describe("claim rewards from distribute balance", async () => {
            it("creates a positive getDistributableYield", async () => {

            })

            it("increases a winning share value", async () => {

            })
        })


        describe("claim rewards from merkle claim", async () => {
            it("creates a positive getDistributableYield", async () => {

            })

            it("increases a winning share value", async () => {

            })
        })
    })
});