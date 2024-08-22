import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe("getStreamedTvlRpl()", async () => {
    describe("when timestamp > lastClaimTime", async () => {
        describe("When timeSinceLastClaim < streamingInterval", async () => {
            it("Should pass", async () => {

            })
        })

        describe("When timeSinceLastClaim == streamingInterval", async () => {
            it("Should pass", async () => {

            })
        })

        describe("When timeSinceLastClaim > streamingInterval", async () => {
            it("Should pass", async () => {

            })
        })
    })

    describe("when timestamp == lastClaimTime", async () => {
        describe("When timeSinceLastClaim < streamingInterval", async () => {
            it("Should pass", async () => {

            })
        })

        describe("When timeSinceLastClaim == streamingInterval", async () => {
            it("Should pass", async () => {

            })
        })

        describe("When timeSinceLastClaim > streamingInterval", async () => {
            it("Should pass", async () => {

            })
        })
    })

    describe("when timestamp < lastClaimTime", async () => {
        it("Should revert", async () => {

        })
    })
})