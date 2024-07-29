import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";

describe("Price Fetcher", function () {

    it("success - fetches correct price from ODAO", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);
		const { admin } = signers;
        const priceFetcher = protocol.priceFetcher;

        const price = await priceFetcher.getPrice();
        console.log("ODAO price: ", ethers.utils.formatEther(price));
    });


});
