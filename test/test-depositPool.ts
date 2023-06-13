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

	let maxBalancePortion = BN.from(await protocol.depositPool.getMaxRplBalancePortion());
	let maxBalancePortionDecimals = await protocol.depositPool.MAX_BALANCE_PORTION_DECIMALS();
	let maxBalanceAfterDeposit = tvl.add(amount).mul(maxBalancePortion).div(BN.from(10).pow(maxBalancePortionDecimals));

	let dpBalanceChange, distributorBalanceChange;
	let isBalanceOverMax = (dpBalance.add(amount) > maxBalanceAfterDeposit);
	dpBalanceChange = isBalanceOverMax ? maxBalanceAfterDeposit.sub(dpBalance) : amount
	let leftover = dpBalance.add(amount).sub(maxBalanceAfterDeposit);
	distributorBalanceChange = isBalanceOverMax ? leftover : 0;

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
	const receipt = await tx.wait();
	if(receipt.status != 1){
		throw new Error("Transaction failed");
	  }
	await expect(tx)
		.to.changeTokenBalance(
			protocol.xRPL,
			from,
			amount
		);

	await expect(tx).to.changeTokenBalances(
			rp.rplContract,
			[from, protocol.depositPool, protocol.operatorDistributor],
			[amount.mul(-1), dpBalanceChange, distributorBalanceChange]
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
		it("Random address can get maxrETHBalance and maxrETHBalancePortion", async function () {
			const setupData = await loadFixture(protocolFixture);
			let maxBalance = await setupData.protocol.depositPool.getMaxrETHBalance();
			console.log("maxBalance is " + maxBalance);

		});
		it("Random address cannot set maxrETHBalancePortion and maxRplBalancePortion", async function () {
			const setupData = await loadFixture(protocolFixture);
			const { protocol, signers } = setupData;

			await expect(protocol.depositPool.connect(signers.random).setMaxrETHBalancePortion(1000))
				.to.be.revertedWith(await protocol.depositPool.ADMIN_ONLY_ERROR());

			await expect(protocol.depositPool.connect(signers.random).setMaxRplBalancePortion(1000))
				.to.be.revertedWith(await protocol.depositPool.ADMIN_ONLY_ERROR());
		});

		it("Admin cannot set maxrETHBalancePortion or maxRplBalancePortion to out of range value", async function () {
			const setupData = await loadFixture(protocolFixture);
			const { protocol, signers } = setupData;

			let maxrETHBalancePortion = await protocol.depositPool.connect(signers.random).getMaxrETHBalancePortion();
			let maxRplBalancePortion = await protocol.depositPool.connect(signers.random).getMaxrETHBalancePortion();

			expect(await protocol.depositPool.setMaxrETHBalancePortion(maxrETHBalancePortion + 1))
				.to.be.revertedWith(await protocol.depositPool.MAX_BALANCE_PORTION_OUT_OF_RANGE_ERROR());

			expect(await protocol.depositPool.setMaxRplBalancePortion(maxRplBalancePortion + 1))
				.to.be.revertedWith(await protocol.depositPool.MAX_BALANCE_PORTION_OUT_OF_RANGE_ERROR());
		});

		it("Admin address can set maxrETHBalancePortion and maxRplBalancePortion", async function () {
			const setupData = await loadFixture(protocolFixture);
			const { protocol, signers } = setupData;

			let maxrETHBalancePortion = await protocol.depositPool.connect(signers.random).getMaxrETHBalancePortion();
			let maxRplBalancePortion = await protocol.depositPool.connect(signers.random).getMaxrETHBalancePortion();

			const maxrETHTx = protocol.depositPool.setMaxrETHBalancePortion(1000);
			await expect(maxrETHTx).to.emit(protocol.depositPool, "NewMaxrETHBalancePortion").withArgs(maxrETHBalancePortion, 1000);
			await expect(maxrETHTx).to.not.be.revertedWith(await protocol.directory.ADMIN_ONLY_ERROR());

			const maxRplTx = protocol.depositPool.setMaxRplBalancePortion(1000);
			await expect(maxRplTx).to.emit(protocol.depositPool, "NewMaxRplBalancePortion").withArgs(maxRplBalancePortion, 1000);
			await expect(maxRplTx).to.not.be.revertedWith(await protocol.directory.ADMIN_ONLY_ERROR());
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

		it("Only RPL token address can send RPL from DP externally", async function () {
			const setupData = await protocolFixture();
			const { protocol, signers } = setupData;

			const rp = setupData.rocketPool;
			// seed random address with rpl
			await rp.rplContract.connect(signers.rplWhale)
				.transfer(setupData.signers.random.address, ethers.utils.parseEther("1000"));

			await depositRpl(setupData, signers.random, ethers.utils.parseEther("1"));

			// random address
			await expect(protocol.depositPool.connect(signers.random)
				.sendRpl(signers.random.address, await protocol.depositPool.signer.getBalance()))
				.to.be.revertedWith(await protocol.depositPool.ONLY_RPL_TOKEN_ERROR());

			// admin address
			await expect(protocol.depositPool
				.sendRpl(signers.random.address, await protocol.depositPool.signer.getBalance()))
				.to.be.revertedWith(await protocol.depositPool.ONLY_RPL_TOKEN_ERROR());
		});

		it("RPL TVL adjusts on withdrawal", async function () {
			const { protocol, signers, rocketPool: rp } = await loadFixture(protocolFixture);

			let mintAmount = ethers.utils.parseEther("100");
			await rp.rplContract.connect(signers.rplWhale).approve(protocol.xRPL.address, mintAmount);
			await protocol.xRPL.mint(signers.rplWhale.address, mintAmount);

			const readTvl = async () => { return await protocol.depositPool.getTvlRpl() };
			let startTvl = await readTvl();

			let burnAmount = (await protocol.depositPool.getMaxRplBalance()).sub(1);
			protocol.xRPL.connect(signers.random).burn(burnAmount);

			let finalTvl = await readTvl();

			expect(BN.from(finalTvl) === BN.from(startTvl).sub(burnAmount));
		});

	});
});

