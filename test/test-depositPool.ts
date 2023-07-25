import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";

export async function depositEth(setupData: SetupData, from: SignerWithAddress, amount: BN) {
	const { protocol } = setupData;
	let dpBalance = await ethers.provider.getBalance(protocol.depositPool.address);
	let tvl = await protocol.depositPool.getTvlEth();

	let maxBalancePortion = BN.from(await protocol.depositPool.getMaxrETHBalancePortion());
	let maxBalancePortionDecimals = await protocol.depositPool.MAX_BALANCE_PORTION_DECIMALS();
	let maxBalanceAfterDeposit = tvl.add(amount).mul(maxBalancePortion).div(BN.from(10).pow(maxBalancePortionDecimals));

	let dpBalanceChange, distributorBalanceChange;
	let isBalanceOverMax = (dpBalance.add(amount) > maxBalanceAfterDeposit);
	dpBalanceChange = isBalanceOverMax ? maxBalanceAfterDeposit.sub(dpBalance) : amount
	let leftover = dpBalance.add(amount).sub(maxBalanceAfterDeposit);
	distributorBalanceChange = isBalanceOverMax ? leftover : 0;

	console.log("\t\tDepositing " + ethers.utils.formatEther(amount) + " ether"
		+ " ether...\n\t\t\tTVL at start: ", ethers.utils.formatEther(tvl) + " ether"
		+ "\n\t\t\tDP balance at start: " + ethers.utils.formatEther(dpBalance) + " ether"
		+ "\n\t\t\tmaxrETHBalanceAfterDeposit: " + ethers.utils.formatEther(maxBalanceAfterDeposit)
		+ "\n\t\t\tNew DP balance should be " + ethers.utils.formatEther(dpBalanceChange)
		+ " ether + currentBalance = " + ethers.utils.formatEther(dpBalance.add(dpBalanceChange)) + " ether");

	const tx = from.sendTransaction({ to: protocol.depositPool.address, value: amount, gasLimit: 1000000 });
	await expect(tx)
		.to.changeEtherBalances(
			[from, protocol.depositPool.address, protocol.operatorDistributor.address],
			[amount.mul(-1), dpBalanceChange, distributorBalanceChange]
		)
	await expect(tx).to.emit(protocol.depositPool, "TotalValueUpdated").withArgs(tvl, tvl.add(amount));

	expect(maxBalanceAfterDeposit).to.equal(await protocol.depositPool.getMaxrETHBalance());

	let currTvl = await protocol.depositPool.getTvlEth();

	console.log("TVL after deposit: ", ethers.utils.formatEther(currTvl.toString()) + " ether");
	console.log("DP balance after deposit: ", ethers.utils.formatEther(await ethers.provider.getBalance(protocol.depositPool.address)));
	expect(!currTvl.eq(0));
	expect(tvl.lt(currTvl));
	expect(currTvl.eq(await ethers.provider.getBalance(protocol.depositPool.address)));
	expect(currTvl.eq(amount));
}

export async function depositRpl(setupData: SetupData, from: SignerWithAddress, amount: BN) {
	const { protocol } = setupData;
	let dpBalance = await ethers.provider.getBalance(protocol.depositPool.address);
	let tvl = await protocol.depositPool.getTvlRpl();

	let dpBalanceChange, distributorBalanceChange;
	let isBalanceOverMax = (dpBalance.add(amount) > maxBalanceAfterDeposit);
	dpBalanceChange = dpBalance.add(amount)
	let leftover = dpBalance.add(amount).sub(maxBalanceAfterDeposit);
	distributorBalanceChange = 0; // operatorDistributor doesn't get any RPL due to expense of creating gas inefficiency

	let currAccountBalance = await setupData.rocketPool.rplContract.balanceOf(from.address);

	console.log("\t\tDepositing " + ethers.utils.formatEther(amount) + " RPL"
		+ "...\n\t\t\tFrom address balance at start: " + ethers.utils.formatEther(currAccountBalance) + " RPL"
		+ "\n\t\t\tTVL at start: ", ethers.utils.formatEther(tvl) + " RPL"
		+ "\n\t\t\tDP balance at start: " + ethers.utils.formatEther(dpBalance) + " RPL"
		+ "\n\t\t\tmaxRplBalanceAfterDeposit: " + ethers.utils.formatEther(maxBalanceAfterDeposit)
		+ "\n\t\t\tNew DP balance should be " + ethers.utils.formatEther(dpBalanceChange)
		+ " RPL + currentBalance = " + ethers.utils.formatEther(dpBalance.add(dpBalanceChange)) + " RPL");

	const rp = setupData.rocketPool;

	await expect(rp.rplContract.connect(from).approve(protocol.xRPL.address, amount))
		.to.emit(rp.rplContract, "Approval")
		.withArgs(from.address, protocol.xRPL.address, amount);

	const tx = await protocol.xRPL.connect(from).mint(from.address, amount);

	const adminRplFee = await protocol.xRPL.adminFeeRate();

	const receipt = await tx.wait();
	if (receipt.status != 1) {
		throw new Error("Transaction failed");
	}
	await expect(tx)
		.to.changeTokenBalance(
			protocol.xRPL,
			from,
			amount.mul(adminRplFee).div(ethers.utils.parseEther("1"))
		);

	await expect(tx).to.changeTokenBalances(
		rp.rplContract,
		[from, protocol.depositPool, protocol.operatorDistributor],
		[-amount.mul(adminRplFee).div(ethers.utils.parseEther("1")), dpBalanceChange, distributorBalanceChange]
	);

	await expect(tx)
		.to.emit(protocol.depositPool, "TotalValueUpdated").withArgs(tvl, tvl.add(amount));


	expect(maxBalanceAfterDeposit).to.equal(await protocol.depositPool.getMaxRplBalance());

	let currTvl = await protocol.depositPool.getTvlRpl();

	console.log("TVL after deposit: ", ethers.utils.formatEther(currTvl.toString()) + " RPL");
	console.log("DP balance after deposit: ", ethers.utils.formatEther(await ethers.provider.getBalance(protocol.depositPool.address)));
	expect(!currTvl.eq(0));
	expect(tvl.lt(currTvl));
	expect(currTvl.eq(await ethers.provider.getBalance(protocol.depositPool.address)));
	expect(currTvl.eq(tvl.add(amount)));
}

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
				.to.be.revertedWith(await protocol.depositPool.ADMIN_ONLY_ERROR());

			await expect(protocol.depositPool.connect(signers.random).setSplitRatioRpl(1000))
				.to.be.revertedWith(await protocol.depositPool.ADMIN_ONLY_ERROR());
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
		it("State adjusts correctly on ETH deposit from xrETH", async function () {
			const setupData = await loadFixture(protocolFixture);

			await depositEth(setupData, setupData.signers.random, BN.from(ethers.utils.parseEther("100")));
		});

		it("ETH TVL adjusts on withdrawal", async function () {
			const { protocol, signers } = await loadFixture(protocolFixture);

			let mintAmount = ethers.utils.parseEther("100");
			await signers.random.sendTransaction({ to: protocol.xrETH.address, value: mintAmount, gasLimit: 1000000 });

			const readTvl = async () => { return await protocol.depositPool.getTvlEth() };
			let startTvl = await readTvl();

			let burnAmount = (await protocol.depositPool.getMaxrETHBalance()).sub(1);
			await protocol.xrETH.connect(signers.random).burn(burnAmount);

			let finalTvl = await readTvl();

			expect(BN.from(finalTvl) === BN.from(startTvl).sub(burnAmount));
		});

		it("Only ETH token address can send ETH from DP", async function () {
			const setupData = await protocolFixture();
			const { protocol, signers } = setupData;
			await depositEth(setupData, setupData.signers.random, ethers.utils.parseEther("1"));

			// random address
			await expect(protocol.depositPool.connect(signers.random)
				.sendEth(signers.random.address, await protocol.depositPool.signer.getBalance()))
				.to.be.revertedWith(await protocol.depositPool.ONLY_ETH_TOKEN_ERROR());

			// admin address
			await expect(protocol.depositPool
				.sendEth(signers.random.address, await protocol.depositPool.signer.getBalance()))
				.to.be.revertedWith(await protocol.depositPool.ONLY_ETH_TOKEN_ERROR());
		});

	});

	describe("RPL", function () {

		it("State adjusts correctly on RPL deposit from xRPL", async function () {

			const setupData = await protocolFixture();

			const rp = setupData.rocketPool;

			// seed random address with rpl
			await rp.rplContract.connect(setupData.signers.rplWhale)
				.transfer(setupData.signers.random.address, ethers.utils.parseEther("100"));

			await depositRpl(setupData, setupData.signers.random, ethers.utils.parseEther("100"));
		});
	});
});

