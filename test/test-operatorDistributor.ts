import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";
import { getMinipoolsInProtocol, getMockMinipoolsInProtocol, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock } from "./utils/utils";
import { IMinipool, MockMinipool } from "../typechain-types";

describe("Operator Distributor", function () {

	// TODO: Why does this only work when the test is run on its own?
	it.only("Tops up the RPL stake if it is below the minimum", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { operatorDistributor } = protocol;
		const { rocketNodeStakingContract } = rocketPool;
		const mockRocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", rocketNodeStakingContract.address);
		console.log("hi3");

		await prepareOperatorDistributionContract(setupData, 2);
		await registerNewValidator(setupData, [signers.random, signers.random2])
		console.log("hi2");

		// send rpl to the operator distributor
		const rplAmount = ethers.utils.parseEther("1000");
		await rocketPool.rplContract.connect(signers.rplWhale).transfer(operatorDistributor.address, rplAmount);

		console.log("passes rplContract.connec")
		const minipools: MockMinipool[] = await getMockMinipoolsInProtocol(setupData);
		console.log("got mock miniipools")
		for(let i = 0; i < minipools.length; i++) {
			console.log("setting at i", i);
			const minipool = minipools[i];
			//await minipool.setNodeDepositBalance(ethers.utils.parseEther("1"));
		}
		console.log("hi1-----dfasdfasdfasdfas-dfa-----------------------");

		const initialRplStake = await mockRocketNodeStaking.getNodeRPLStake(signers.random.address);
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		const finalRplStake = await mockRocketNodeStaking.getNodeRPLStake(signers.random.address);

		expect(finalRplStake.sub(initialRplStake)).gt(0);

	});

   it("Rewards distribution distributes correct amounts of ETH to all NOs", async function () {
     // record all node balances
     // capture pending rewards
     // distribute rewards
     // verify rewards were distributed correctly
   });
 });