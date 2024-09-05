import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { protocolFixture, SetupData } from "./integration";
import { BigNumber as BN } from "ethers";
import { computeKeccak256FromBytes32, prepareOperatorDistributionContract, printEventDetails, registerNewValidator, upgradePriceFetcherToMock} from "../utils/utils";
import { IMinipool, MockMinipool } from "../../typechain-types";
import { RocketDepositPool } from "../rocketpool/_utils/artifacts";

describe("Operator Distributor", function () {

	describe("Minipool processing flag", async function () {
		describe("When admin disables minipool processing", async function () {

			let setupData: SetupData;

			beforeEach(async ()=>{
				setupData = await loadFixture(protocolFixture);
				const {protocol, signers } = setupData;
				await protocol.operatorDistributor.connect(signers.admin).setMinipoolProcessingEnabled(false);
				expect(await protocol.operatorDistributor.minipoolProcessingEnabled()).equals(false);
			})

			it("Cannot be enabled by a random address", async function () {
				const {protocol, signers } = setupData;
				await expect(protocol.operatorDistributor.connect(signers.random).setMinipoolProcessingEnabled(true)).to.be.revertedWith("Can only be called by admin address!");
			})

			it("Can be enabled by an admin", async function () {
				const {protocol, signers } = setupData;
				await expect(protocol.operatorDistributor.connect(signers.admin).setMinipoolProcessingEnabled(true)).to.not.be.reverted;
				expect(await protocol.operatorDistributor.minipoolProcessingEnabled()).equals(true);
			})
		})

		describe("When minipool processing is enabled", async function () {

			let setupData: SetupData;

			beforeEach(async ()=>{
				setupData = await loadFixture(protocolFixture);
				const {protocol, signers } = setupData;

				expect(await protocol.operatorDistributor.minipoolProcessingEnabled()).equals(true); // default is true
			})

			it("Cannot be disabled by a random address", async function () {
				const {protocol, signers } = setupData;
				await expect(protocol.operatorDistributor.connect(signers.random).setMinipoolProcessingEnabled(false)).to.be.revertedWith("Can only be called by admin address!");
			})

			it("Can be disabled by an admin", async function () {
				const {protocol, signers } = setupData;
				await expect(protocol.operatorDistributor.connect(signers.admin).setMinipoolProcessingEnabled(false)).to.not.be.reverted;
				expect(await protocol.operatorDistributor.minipoolProcessingEnabled()).equals(false);
			})
		})
	})

	describe("RPL rebalance flag", async function () {
		describe("When admin disables RPL stake rebalancing", async function () {

			let setupData: SetupData;

			beforeEach(async ()=>{
				setupData = await loadFixture(protocolFixture);
				const {protocol, signers } = setupData;
				await protocol.operatorDistributor.connect(signers.admin).setRplStakeRebalanceEnabled(false);
				expect(await protocol.operatorDistributor.rplStakeRebalanceEnabled()).equals(false);
			})

			it("Cannot be enabled by a random address", async function () {
				const {protocol, signers } = setupData;
				await expect(protocol.operatorDistributor.connect(signers.random).setRplStakeRebalanceEnabled(true)).to.be.revertedWith("Can only be called by admin address!");
			})

			it("Can be enabled by an admin", async function () {
				const {protocol, signers } = setupData;
				expect(await protocol.operatorDistributor.connect(signers.admin).setRplStakeRebalanceEnabled(true)).to.not.be.reverted;
				expect(await protocol.operatorDistributor.rplStakeRebalanceEnabled()).equals(true);
			})
		})

		describe("When RPL stake rebalancing is enabled", async function () {

			let setupData: SetupData;

			beforeEach(async ()=>{
				setupData = await loadFixture(protocolFixture);
				const {protocol, signers } = setupData;

				expect(await protocol.operatorDistributor.rplStakeRebalanceEnabled()).equals(true); // default is true
			})

			it("Cannot be enabled by a random address", async function () {
				const {protocol, signers } = setupData;
				await expect(protocol.operatorDistributor.connect(signers.random).setRplStakeRebalanceEnabled(false)).to.be.revertedWith("Can only be called by admin address!");
			})

			it("Can be disabled by an admin", async function () {
				const {protocol, signers } = setupData;
				expect(await protocol.operatorDistributor.connect(signers.admin).setRplStakeRebalanceEnabled(false)).to.not.be.reverted;
				expect(await protocol.operatorDistributor.rplStakeRebalanceEnabled()).equals(false);
			})
		})
	})

	it("Returns silently if minipool processing is disabled", async function (){
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers } = setupData;

		// disable processing
		expect(await protocol.operatorDistributor.connect(signers.admin).setMinipoolProcessingEnabled(false)).to.not.be.reverted;
		expect(await protocol.operatorDistributor.minipoolProcessingEnabled()).equals(false);

		// create 1 minipool
		await prepareOperatorDistributionContract(setupData, 1);
		const minipools = (await registerNewValidator(setupData, [signers.random]));

		const priorTVL = await protocol.vCWETH.totalAssets();
		const odPriorAssets = await ethers.provider.getBalance(protocol.operatorDistributor.address);

		// simulate rewards to minipool contract from beacon
		const oneEth = ethers.utils.parseEther("1");
		await signers.ethWhale.sendTransaction({
			to: minipools[0],
			value: oneEth
		  })

		expect(await protocol.operatorDistributor.connect(signers.random).processMinipool(minipools[0])).to.not.be.reverted;

		expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).to.equal(odPriorAssets);
		expect(await protocol.vCWETH.totalAssets()).to.equal(priorTVL);
	});


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

	it.skip("TODO: Tops up the RPL stake if it is below the minimum", async function () {
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { operatorDistributor } = protocol;
	});

	it.skip("TODO: Returns silently if rpl stake rebalancing is disabled", async function (){
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { operatorDistributor } = protocol;
	})

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

	it("calculateRplStakeShortfall", async function () {
		// load fixture
		const setupData = await loadFixture(protocolFixture);
		const { protocol, signers, rocketPool } = setupData;
		const { admin, rplWhale } = signers;
		const { operatorDistributor } = protocol;
	
		expect(await operatorDistributor.minimumStakeRatio()).equals(ethers.utils.parseEther('0.15'));
		let price = await protocol.priceFetcher.getPrice();
		expect(price).equals(ethers.utils.parseEther('100'));
		console.log("price of RPL/ETH", ethers.utils.formatEther(price));
		
		console.log('0, 0', ethers.utils.formatEther(await operatorDistributor.calculateRplStakeShortfall(0, 0)), " RPL");
		
		let rplString = "100";
		let ethString = "0";
		let rpl = ethers.utils.parseEther(rplString);
		let eth = ethers.utils.parseEther(ethString);
		let ratio
		console.log(rplString +" RPL,", ethString + " ETH,", "ratio: infinite" + "%", ethers.utils.formatEther(await operatorDistributor.calculateRplStakeShortfall(rpl, eth)));

		rplString = "0";
		ethString = "100";
		rpl = ethers.utils.parseEther(rplString);
		eth = ethers.utils.parseEther(ethString);
		ratio = rpl.div(price).div(eth)
		console.log(rplString +" RPL,", ethString + " ETH,", "ratio: " + ratio + "%", ethers.utils.formatEther(await operatorDistributor.calculateRplStakeShortfall(rpl, eth)));
		
		rplString = "100";
		ethString = "100";
		rpl = ethers.utils.parseEther(rplString);
		eth = ethers.utils.parseEther(ethString);
		ratio = rpl.div(price).div(eth)
		console.log(rplString +" RPL,", ethString + " ETH,", "ratio: " + ratio + "%", ethers.utils.formatEther(await operatorDistributor.calculateRplStakeShortfall(rpl, eth)));
		
		rplString = "1000";
		ethString = "100";
		rpl = ethers.utils.parseEther(rplString);
		eth = ethers.utils.parseEther(ethString);
		ratio = rpl.div(price).div(eth)
		console.log(rplString +" RPL,", ethString + " ETH,", "ratio: " + ratio + "%", ethers.utils.formatEther(await operatorDistributor.calculateRplStakeShortfall(rpl, eth)));

		rplString = "100";
		ethString = "1000";
		rpl = ethers.utils.parseEther(rplString);
		eth = ethers.utils.parseEther(ethString);
		ratio = rpl.div(price).div(eth)
		console.log(rplString +" RPL,", ethString + " ETH,", "ratio: " + ratio + "%", ethers.utils.formatEther(await operatorDistributor.calculateRplStakeShortfall(rpl, eth)));

		rplString = "10000";
		ethString = "100";
		rpl = ethers.utils.parseEther(rplString);
		eth = ethers.utils.parseEther(ethString);
		ratio = rpl.div(price).div(eth)
		console.log(rplString +" RPL,", ethString + " ETH,", "ratio: " + ratio + "%", ethers.utils.formatEther(await operatorDistributor.calculateRplStakeShortfall(rpl, eth)));

		rplString = "100";
		ethString = "10000";
		rpl = ethers.utils.parseEther(rplString);
		eth = ethers.utils.parseEther(ethString);
		ratio = rpl.div(price).div(eth)
		console.log(rplString +" RPL,", ethString + " ETH,", "ratio: " + ratio + "%", ethers.utils.formatEther(await operatorDistributor.calculateRplStakeShortfall(rpl, eth)));
	});
});