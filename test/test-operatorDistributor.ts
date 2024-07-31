import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";
import { computeKeccak256FromBytes32, prepareOperatorDistributionContract, printEventDetails, registerNewValidator, upgradePriceFetcherToMock } from "./utils/utils";
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
		console.log("start");
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

	// test target stake ratio logic
	it("success - target stake ratio may be set above 100%", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { admin } = signers;
		const { operatorDistributor } = protocol;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());


		await operatorDistributor.connect(admin).setTargetStakeRatio(ethers.utils.parseEther("1.0001"));

		const initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		expect(initialRplStake).equals(0)
		await prepareOperatorDistributionContract(setupData, 2);
		await registerNewValidator(setupData, [signers.random]);

		const price = await protocol.priceFetcher.getPrice();
		const expectedStake = ethers.utils.parseEther("8").mul(price);
		console.log("exepcted stake", expectedStake)

	});

	it("success - target stake ratio may be set equal 100%", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { admin, rplWhale } = signers;
		const { operatorDistributor } = protocol;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());

		// getSettingUint('node.per.minipool.stake.minimum');
		await rocketPool.rockStorageContract.setUint("0x2667306bf1c3fdbd6985406babb7b6f4af682212c96c7461d13f2c6e46339fe5", ethers.utils.parseEther(".3"));

		await operatorDistributor.connect(admin).setTargetStakeRatio(ethers.utils.parseEther("1"));

		await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, ethers.utils.parseEther("5000"));

		let initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		expect(initialRplStake).equals(0)
		await prepareOperatorDistributionContract(setupData, 2);
		await registerNewValidator(setupData, [signers.random]);
		console.log("p=rpl stake after depo", await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address));

		let price = await protocol.priceFetcher.getPrice();
		let expectedStake = ethers.utils.parseEther("8").mul(price);
		console.log("p=exepcted stake", expectedStake)
	});

	it("success - target stake ratio may be set less than 100%", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { admin, rplWhale } = signers;
		const { operatorDistributor } = protocol;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());

		// getSettingUint('node.per.minipool.stake.minimum');
		await rocketPool.rockStorageContract.setUint("0x2667306bf1c3fdbd6985406babb7b6f4af682212c96c7461d13f2c6e46339fe5", ethers.utils.parseEther(".3"));

		await operatorDistributor.connect(admin).setTargetStakeRatio(ethers.utils.parseEther(".5"));

		await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, ethers.utils.parseEther("5000"));

		let initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		expect(initialRplStake).equals(0)
		await prepareOperatorDistributionContract(setupData, 2);
		await registerNewValidator(setupData, [signers.random]);
		console.log("p=rpl stake after depo", await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address));

		let price = await protocol.priceFetcher.getPrice();
		let expectedStake = ethers.utils.parseEther("8").mul(price);
		console.log("p=exepcted stake", expectedStake)
	});

	it("success - fundedRpl updates correctly", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { admin, rplWhale } = signers;
		const { operatorDistributor } = protocol;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());

		await rocketPool.rockStorageContract.setUint("0x2667306bf1c3fdbd6985406babb7b6f4af682212c96c7461d13f2c6e46339fe5", ethers.utils.parseEther(".3"));

		await operatorDistributor.connect(admin).setTargetStakeRatio(ethers.utils.parseEther(".5"));

		expect(await protocol.operatorDistributor.fundedRpl()).equals(0);
		await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, ethers.utils.parseEther("5000"));
		await protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("5000"), signers.rplWhale.address);
		
		let initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		expect(initialRplStake).equals(0)
		await prepareOperatorDistributionContract(setupData, 2);
		await registerNewValidator(setupData, [signers.random]);
		expect(await protocol.operatorDistributor.fundedRpl()).equals(ethers.utils.parseEther("1200")); // the amount that got staked

		const actualStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		let price = await protocol.priceFetcher.getPrice();
		let expectedStake = ethers.utils.parseEther("8").mul(price);
		
	});

	it("success - fundedRpl updates correctly when there is shortfall on stake", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { admin, rplWhale } = signers;
		const { operatorDistributor } = protocol;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());

		await rocketPool.rockStorageContract.setUint("0x2667306bf1c3fdbd6985406babb7b6f4af682212c96c7461d13f2c6e46339fe5", ethers.utils.parseEther(".3"));

		// attempting a stake of 6900%
		await operatorDistributor.connect(admin).setTargetStakeRatio(ethers.utils.parseEther("69"));

		expect(await protocol.operatorDistributor.fundedRpl()).equals(0);
		await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, ethers.utils.parseEther("5000"));
		await protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("5000"), signers.rplWhale.address);
		
		let initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		expect(initialRplStake).equals(0)
		await prepareOperatorDistributionContract(setupData, 2);
		await registerNewValidator(setupData, [signers.random]);
		const actualStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		expect(await protocol.operatorDistributor.fundedRpl()).equals(actualStake); 

	});
});