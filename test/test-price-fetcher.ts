import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";


describe.only("Price Fetcher", function () {

	it("success - fetches correct price for Jan-13-2023", async function () {
		const { protocol, signers } = await loadFixture(protocolFixture);

		const priceFetcher = protocol.priceFetcher;

        const price = await priceFetcher.getPrice();

        console.log("price: ", ethers.utils.formatEther(price));
	});

});