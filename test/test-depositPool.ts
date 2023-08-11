import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";

describe(`DepositPool`, function () {

	describe("Getters and Setters", function () {
		it("Random address can get splitRatioEth and splitRatioRpl", async function () {
			const setupData = await loadFixture(protocolFixture);
			let splitRatioEth = await setupData.protocol.depositPool.splitRatioEth();
			let splitRatioRpl = await setupData.protocol.depositPool.splitRatioRpl();

			expect(splitRatioEth).gt(0);
			expect(splitRatioRpl).gt(0);
		});
		it("Random address cannot set splitRatioEth and splitRatioRpl", async function () {
			const setupData = await loadFixture(protocolFixture);
			const { protocol, signers } = setupData;

			await expect(protocol.depositPool.connect(signers.random).setSplitRatioEth(1000))
				.to.be.revertedWith("Can only be called by admin address!");

			await expect(protocol.depositPool.connect(signers.random).setSplitRatioRpl(1000))
				.to.be.revertedWith("Can only be called by admin address!");
		});

		it("Admin cannot set splitRatioEth or splitRatioRpl to out of range value", async function () {
			const setupData = await loadFixture(protocolFixture);
			const { protocol, signers } = setupData;

			let splitRatioEth = await protocol.depositPool.connect(signers.random).splitRatioEth();
			let splitRatioRpl = await protocol.depositPool.connect(signers.random).splitRatioRpl();

			await expect(protocol.depositPool.connect(signers.admin).setSplitRatioEth(ethers.utils.parseUnits("1.01", 5)))
				.to.be.revertedWith("split ratio must be lte to 1e5");

			await expect(protocol.depositPool.connect(signers.admin).setSplitRatioRpl(ethers.utils.parseUnits("1.01", 5)))
				.to.be.revertedWith("split ratio must be lte to 1e5");

			expect(await protocol.depositPool.connect(signers.admin).splitRatioEth()).to.equal(splitRatioEth);
			expect(await protocol.depositPool.connect(signers.admin).splitRatioRpl()).to.equal(splitRatioRpl);
		});

		it("Admin address can set splitRatioEth and splitRatioRpl", async function () {
			const setupData = await loadFixture(protocolFixture);
			const { protocol, signers } = setupData;

			let splitRatioEth = await protocol.depositPool.connect(signers.random).splitRatioEth();
			let splitRatioRpl = await protocol.depositPool.connect(signers.random).splitRatioRpl();

			await expect(protocol.depositPool.connect(signers.admin).setSplitRatioEth(1000))
				.to.emit(protocol.depositPool, "SplitRatioEthUpdated").withArgs(splitRatioEth, 1000);

			await expect(protocol.depositPool.connect(signers.admin).setSplitRatioRpl(1000))
				.to.emit(protocol.depositPool, "SplitRatioRplUpdated").withArgs(splitRatioRpl, 1000);

			expect(await protocol.depositPool.connect(signers.admin).splitRatioEth()).to.equal(1000);
			expect(await protocol.depositPool.connect(signers.admin).splitRatioRpl()).to.equal(1000);
		});

	});

	describe("ETH", function () {
		// ETH Test the contract initialization
		// This test should assert that when the contract is deployed, the splitRatioEth is set to 0.30e5, the splitRatioRpl is set to 0.30e5, and the directoryAddress is set correctly.
		// ETH Test getTvlEth method.
		// This test should send some ETH to the contract and assert that getTvlEth returns the correct value, which should be equal to the balance of the contract.
		// ETH Test setSplitRatioEth method.
		// This test should call the setSplitRatioEth with a new value and then assert that the splitRatioEth is updated correctly. It should also check that the event SplitRatioEthUpdated is emitted correctly.
		// ETH Test sendEthToDistributors method.
		// This test should send some ETH to the contract and then call sendEthToDistributors. It should assert that the correct amount of ETH is sent to the WETHVault and OperatorDistributor.
		// ETH Test sendEthToDistributors method when the requiredCapital from WETHVault is zero.
		// This test should set the requiredCapital from WETHVault to zero, send some ETH to the contract, and then call sendEthToDistributors. It should assert that all ETH is sent to the OperatorDistributor.

	});

	describe("RPL", function () {
		// RPL Test getTvlRpl method.
		// This test should send some RPL to the contract and assert that getTvlRpl returns the correct value, which should be equal to the RPL balance of the contract.
		// RPL Test setSplitRatioRpl method.
		// This test should call the setSplitRatioRpl with a new value and then assert that the splitRatioRpl is updated correctly. It should also check that the event SplitRatioRplUpdated is emitted correctly.
		// ETH Test setSplitRatioEth method with an invalid value.
		// This test should call the setSplitRatioEth with a value greater than 1e5 and assert that it reverts with the correct error message.
		// RPL Test setSplitRatioRpl method with an invalid value.
		// This test should call the setSplitRatioRpl with a value greater than 1e5 and assert that it reverts with the correct error message.
		// RPL Test sendRplToDistributors method.
		// This test should send some RPL to the contract and then call sendRplToDistributors. It should assert that the correct amount of RPL is sent to the RPLVault and OperatorDistributor.
		// RPL Test sendRplToDistributors method when the requiredCapital from RPLVault is zero.
		// This test should set the requiredCapital from RPLVault to zero, send some RPL to the contract, and then call sendRplToDistributors. It should assert that all RPL is sent to the OperatorDistributor.
	});










});

