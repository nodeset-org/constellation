import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";
import { getMinipoolsInProtocol, getMockMinipoolsInProtocol, prepareOperatorDistributionContract, printEventDetails, registerNewValidator, upgradePriceFetcherToMock } from "./utils/utils";
import { IMinipool, MockMinipool } from "../typechain-types";
import { RocketDepositPool } from "./rocketpool/_utils/artifacts";

describe("Operator Distributor", function () {

	it("Tops up the RPL stake if it is below the minimum", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { operatorDistributor } = protocol;
		const { rocketNodeStakingContract, rocketDepositPoolContract } = rocketPool;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", rocketNodeStakingContract.address);
		const rocketDepositPool = await ethers.getContractAt("RocketDepositPool", rocketDepositPoolContract.address);

		await prepareOperatorDistributionContract(setupData, 2);
		await registerNewValidator(setupData, [signers.random, signers.random2])

		// send rpl to the operator distributor
		const rplAmount = ethers.utils.parseEther("1000");
		await rocketPool.rplContract.connect(signers.rplWhale).transfer(operatorDistributor.address, rplAmount);

		const minipools: MockMinipool[] = await getMockMinipoolsInProtocol(setupData);
		for (let i = 0; i < minipools.length; i++) {
			const minipool = minipools[i];
			//await minipool.setNodeDepositBalance(ethers.utils.parseEther("1"));
		}

		const initialRplStake = await rocketNodeStaking.getNodeRPLStake(signers.random.address);
		const tx = await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		printEventDetails(tx, operatorDistributor);
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		const finalRplStake = await rocketNodeStaking.getNodeRPLStake(signers.random.address);

		expect(finalRplStake.sub(initialRplStake)).gt(ethers.BigNumber.from(0));

	});

	it("Rewards distribution distributes correct amounts of ETH to all NOs", async function () {
		// record all node balances
		// capture pending rewards
		// distribute rewards
		// verify rewards were distributed correctly
	});
});