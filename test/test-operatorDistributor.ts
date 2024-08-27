import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";
import { computeKeccak256FromBytes32, prepareOperatorDistributionContract, printEventDetails, registerNewValidator, upgradePriceFetcherToMock } from "./utils/utils";
import { IMinipool, MockMinipool } from "../typechain-types";
import { RocketDepositPool } from "./rocketpool/_utils/artifacts";

describe("Operator Distributor", function () {

	describe("Minipool processing", async function () {
		describe("When admin disables minipool processing", async function () {
			it("Cannot be enabled by a random address", async function () {
			
			})

			it("Can be enabled by an admin", async function () {
			
			})
		})
	})
	


	it("Processes minipool rewards correctly even when nodeRefundBalance > 0 (no exit)", async function (){
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { operatorDistributor } = protocol;

		// create 1 minipool
		await prepareOperatorDistributionContract(setupData, 1);
		const minipools = await registerNewValidator(setupData, [signers.random]);

		const priorAssets = await protocol.vCWETH.totalAssets();

		// simulate rewards to minipool contract from beacon
		const baconReward = ethers.utils.parseEther("1");
		// assume a 15% rETH fee and LEB8 (36.25% of all rewards), which is default settings for RP
		const constellationPortion = baconReward.mul(ethers.utils.parseEther(".3625")).div(ethers.utils.parseEther("1"));
		const xrETHPortion = await protocol.vCWETH.getIncomeAfterFees(constellationPortion);
		await signers.ethWhale.sendTransaction({
			to: minipools[0],
			value: baconReward
		  })
		
		// random person distributes the balance to increase nodeRefundBalance
		const minipool = await ethers.getContractAt("IMinipool", minipools[0]);
		await minipool.connect(signers.random).distributeBalance(true);
		expect(await minipool.getNodeRefundBalance()).equals(constellationPortion);

		// protocol sweeps in rewards
		await protocol.operatorDistributor.connect(signers.random).processMinipool(minipools[0]);

		expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.add(xrETHPortion));
	});

	it("Processes minipool rewards correctly even when nodeRefundBalance > 0  (exit)", async function (){
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { operatorDistributor } = protocol;

		// create 1 minipool
		await prepareOperatorDistributionContract(setupData, 1);
		const minipools = await registerNewValidator(setupData, [signers.random]);

		const priorAssets = await protocol.vCWETH.totalAssets();

		// simulate rewards to minipool contract from beacon
		const baconReward = ethers.utils.parseEther("1");
		// assume a 15% rETH fee and LEB8 (36.25% of all rewards), which is default settings for RP
		const constellationPortion = baconReward.mul(ethers.utils.parseEther(".3625")).div(ethers.utils.parseEther("1"));
		const xrETHPortion = await protocol.vCWETH.getIncomeAfterFees(constellationPortion);
		await signers.ethWhale.sendTransaction({
			to: minipools[0],
			value: baconReward
		  })
		
		// random person distributes the balance to increase nodeRefundBalance
		const minipool = await ethers.getContractAt("IMinipool", minipools[0]);
		await minipool.connect(signers.random).distributeBalance(true);
		expect(await minipool.getNodeRefundBalance()).equals(constellationPortion);

		// exit the minipool
		const beaconBalance = ethers.utils.parseEther("32");
		await signers.ethWhale.sendTransaction({
			to: minipools[0],
			value: beaconBalance
		  })
		
		// protocol sweeps in rewards
		await protocol.operatorDistributor.connect(signers.random).processMinipool(minipools[0]);

		expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.add(xrETHPortion));
	});

	it("Tops up the RPL stake if it is below the minimum", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { operatorDistributor } = protocol;
		const { rocketNodeStakingContract, rocketDepositPoolContract } = rocketPool;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());
		const rocketDepositPool = await ethers.getContractAt("RocketDepositPool", rocketDepositPoolContract.address);

		// set expectations for params
		//expect(setupData.protocol.operatorDistributor.targetStakeRatio >= (await setupData.protocol.operatorDistributor.minimumStakeRatio()).mul(2));
		
		// add minimum assets for 2 minipools
		await prepareOperatorDistributionContract(setupData, 2);

		// create 2 minipools
		await registerNewValidator(setupData, [signers.random, signers.random2]);

		// send rpl to the operator distributor
		const rplAmount = ethers.utils.parseEther("1000");
		await rocketPool.rplContract.connect(signers.rplWhale).transfer(operatorDistributor.address, rplAmount);

		const lastPrice = await upgradePriceFetcherToMock(signers, protocol, ethers.utils.parseEther("55"));

		const initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		const tx = await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		await operatorDistributor.connect(signers.protocolSigner).processNextMinipool();
		const finalRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);

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
		await prepareOperatorDistributionContract(setupData, 1);
		await registerNewValidator(setupData, [signers.random]);

		const price = await protocol.priceFetcher.getPrice();
	});

	it("success - target stake ratio may be set equal 100%", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { admin, rplWhale } = signers;
		const { operatorDistributor } = protocol;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());

		// getSettingUint('node.per.minipool.stake.minimum');
		//await rocketPool.rockStorageContract.setUint("0x2667306bf1c3fdbd6985406babb7b6f4af682212c96c7461d13f2c6e46339fe5", ethers.utils.parseEther(".3"));

		await operatorDistributor.connect(admin).setTargetStakeRatio(ethers.utils.parseEther("1"));

		await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.operatorDistributor.address, ethers.utils.parseEther("5000"));

		let initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		expect(initialRplStake).equals(0)
		await prepareOperatorDistributionContract(setupData, 1);
		await registerNewValidator(setupData, [signers.random]);
	});

	it("success - target stake ratio may be set less than 100%", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { admin, rplWhale } = signers;
		const { operatorDistributor } = protocol;
		const rocketNodeStaking = await ethers.getContractAt("RocketNodeStaking", await protocol.directory.getRocketNodeStakingAddress());

		// getSettingUint('node.per.minipool.stake.minimum');
		//await rocketPool.rockStorageContract.setUint("0x2667306bf1c3fdbd6985406babb7b6f4af682212c96c7461d13f2c6e46339fe5", ethers.utils.parseEther(".3"));

		await operatorDistributor.connect(admin).setTargetStakeRatio(ethers.utils.parseEther(".5"));

		await rocketPool.rplContract.connect(signers.rplWhale).transfer(protocol.operatorDistributor.address, ethers.utils.parseEther("5000"));

		let initialRplStake = await rocketNodeStaking.getNodeRPLStake(protocol.superNode.address);
		expect(initialRplStake).equals(0)
		await prepareOperatorDistributionContract(setupData, 2);
		await registerNewValidator(setupData, [signers.random]);
	});
});