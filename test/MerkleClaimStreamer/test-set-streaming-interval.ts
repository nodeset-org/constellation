import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe("setStreamingInterval()", async () => {

    describe("When streaming interval is greater than 0", async () => {
        describe("When streaming interval is less than 365 days", async () => {
            describe("When new streaming inverval is different", async () => {
                it("Should pass", async () => {

                })
            })

            describe("When new streaming inverval is the same", async () => {
                it("Should revert", async () => {

                })
            })
        })

        describe("When streaming interval is equal to 365 days", async () => {
            describe("When new streaming inverval is different", async () => {
                it("Should pass", async () => {

                })
            })

            describe("When new streaming inverval is the same", async () => {
                it("Should revert", async () => {

                })
            })
        })

        describe("When streaming interval is greater than 365 days", async () => {
            it("Should revert", async () => {

            })
        })
    })

    describe("When streaming interval is equal to 0", async () => {
        describe("When streaming interval is less than 365 days", async () => {
            it("Should revert", async () => {

            })
        })

        describe("When streaming interval is greater than 365 days", async () => {
            it("Should revert", async () => {

            })
        })

        describe("When streaming interval is equal to 365 days", async () => {
            it("Should revert", async () => {

            })
        })
    })

    describe("When streaming interval is less than 0", async () => {
        it("Should reject", async () => {

        })
    })

})