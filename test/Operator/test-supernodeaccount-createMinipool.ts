// import { expect } from "chai";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { Protocol, protocolFixture, RocketPool, SetupData, Signers } from "../test";

describe("SuperNodeAccount createMinipool", function () {
    describe("when the message value is below the threshold", function () {
        it("should revert", async function () {
        });
    });
    describe("when the message value is equal to the threshold", function () {
        describe("when the minipool address already exists", function () {
            it("should revert", async function () {
            });
        });
        describe("when the minipool address does not exist", function () {
            describe("when the sub node account is not whitelisted", function () {
                it("should revert", async function () {
                });
            });
            describe("when the sub node account is whitelisted", function () {
                describe("when the sub node operator is equal to the active minipool count", function () {
                    it("should revert", async function () {
                    });
                });
                describe("when the sub node operator is below the active minipool count", function () {
                    describe("when the protocol does not have enough liquidity", function () {
                        it("should revert", async function () {
                        });
                    });
                    describe("when the protocol has enough liquidity", function () {
                        it("should create the minipool", async function () {
                        });
                    });
                });
            });
        });
    });
    describe("when the message value is above the threshold", function () {
    });
});