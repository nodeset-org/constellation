import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";
import { prepareOperatorDistributionContract, printEventDetails, registerNewValidator, upgradePriceFetcherToMock } from "./utils/utils";
import { IMinipool, MockMinipool } from "../typechain-types";
import { RocketDepositPool } from "./rocketpool/_utils/artifacts";

describe("Operator Distributor", function () {

	it("Tops up the RPL stake if it is below the minimum", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { operatorDistributor } = protocol;
		const { rocketNodeStakingContract, rocketDepositPoolContract } = rocketPool;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());
		const rocketDepositPool = await ethers.getContractAt("RocketDepositPool", rocketDepositPoolContract.address);

		await prepareOperatorDistributionContract(setupData, 2);
		const NodeAccounts = await registerNewValidator(setupData, [signers.random, signers.random2])

		// send rpl to the operator distributor
		const rplAmount = ethers.utils.parseEther("1000");
		await rocketPool.rplContract.connect(signers.rplWhale).transfer(operatorDistributor.address, rplAmount);

		const lastPrice = await upgradePriceFetcherToMock(signers, protocol, ethers.utils.parseEther("55"));
		console.log("last price", lastPrice);

		const initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		console.log("od.test.initial stake", initialRplStake)
		const tx = await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		console.log("printing events")
		await printEventDetails(tx, operatorDistributor);
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		const finalRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		console.log("od.test.finalRplStake stake", finalRplStake)

		expect(finalRplStake.sub(initialRplStake)).eq(ethers.BigNumber.from(0));

	});

	// test distribute yield and show how it increases and adjusts for oracle error

	it("Rewards distribution distributes correct amounts of ETH to all NOs", async function () {
		// record all node balances
		// capture pending rewards
		// distribute rewards
		// verify rewards were distributed correctly
	});
});