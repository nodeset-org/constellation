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

// describe("Operator Distributor", function () {
//   it("Admin can update contract", async function () {

//   });
//   it("Admin can adjust rewards split", async function () {

//   });
//   it("Rewards distribution distributes correct amounts of ETH to all NOs", async function () {
//     // record all node balances
//     // capture pending rewards
//     // distribute rewards
//     // verify rewards were distributed correctly
//   });
// });