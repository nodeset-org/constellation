import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";


describe("Operator Distributor", function () {

	it("Receieves ETH", async function () {
		const { protocol, signers } = await loadFixture(protocolFixture);

		protocol.operatorDistributor.addToQueue(BN.from(5));
	});

});