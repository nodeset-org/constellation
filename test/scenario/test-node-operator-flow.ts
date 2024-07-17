import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { getAllAddresses, protocolFixture, SetupData } from "../test";
import { BigNumber as BN } from "ethers";
import { Protocol } from "../test";
import { Signers } from "../test";
import { RocketPool } from "../test";
import { IERC20, IMinipool__factory, MockMinipool, MockMinipool__factory, MockRocketNodeManager, WETHVault, RPLVault, IWETH, RocketMinipoolInterface } from "../../typechain-types";
import { OperatorStruct } from "../protocol-types/types";
import { deployRPMinipool, expectNumberE18ToBeApproximately, prepareOperatorDistributionContract, printBalances, printObjectBalances, printObjectTokenBalances, printTokenBalances, assertAddOperator, deployMinipool, increaseEVMTime } from "../utils/utils";


describe("Node Operator Onboarding", function () {

    let setupData: SetupData;
    let protocol: Protocol;
    let signers: Signers;
    let rocketPool: RocketPool;
    let minipoolAddress: string;

    let xrETH: WETHVault;
    let xRPL: RPLVault;
    let rpl: IERC20;
    let weth: IWETH;

    const bondValue = ethers.utils.parseEther("8");

    before(async function () {
        setupData = await protocolFixture();

        protocol = setupData.protocol;
        signers = setupData.signers;
        rocketPool = setupData.rocketPool;

        await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.hyperdriver.address, ethers.utils.parseEther("100"));

        xrETH = protocol.vCWETH;
        xRPL = protocol.vCRPL;
        weth = protocol.wETH;
        rpl = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", await protocol.directory.getRPLAddress()) as IERC20;

    });

    it("admin needs to kyc the node operator and register them in the whitelist", async function () {
        await assertAddOperator(setupData, signers.hyperdriver);
    });

    it("node operator creates minipool via creating validator account", async function () {
        console.log("operator flow minipoolAddress fda:,", minipoolAddress);

        // now we must create a minipool via super node
        expect(await protocol.superNode.hasSufficientLiquidity(bondValue)).equals(false);
        await prepareOperatorDistributionContract(setupData, 1);
        expect(await protocol.superNode.hasSufficientLiquidity(bondValue)).equals(true);

        console.log("is this f-ing thing null?", signers.hyperdriver.address)
        //expect(await protocol.superNode.subNodeOperatorHasMinipool(signers.hyperdriver.address)).equals(false);
        console.log("operator flow minipoolAddress adf:,", minipoolAddress);
        minipoolAddress = await deployMinipool(setupData, bondValue);
        console.log("operator flow minipoolAddress", minipoolAddress);

        // Assuming signers.hyperdriver.address and minipoolAddress are defined
        const hyperdriverAddress = ethers.utils.getAddress(signers.hyperdriver.address);
        const minipoolFormatAddress = ethers.utils.getAddress(minipoolAddress);

        // Encode the values and hash using keccak256
        const encodedSubNodeOperator = ethers.utils.keccak256(
            ethers.utils.solidityPack(
                ["address", "address"],
                [hyperdriverAddress, minipoolFormatAddress]
            )
        );

        // Check if the subNodeOperator has the minipool
        expect(await protocol.superNode.subNodeOperatorHasMinipool(encodedSubNodeOperator)).to.equal(true);
    });

    // continue debugging staking ops, why would staking fail here?
    it("sub node operator 'hyperdriver' decides to begin staking process", async () => {
        await setupData.rocketPool.rocketDepositPoolContract.deposit({
            value: ethers.utils.parseEther("32")
        })
        await setupData.rocketPool.rocketDepositPoolContract.assignDeposits();

        await increaseEVMTime(60 * 60 * 24 * 7 * 32);

        await protocol.superNode.connect(signers.hyperdriver).stake(minipoolAddress);
    })

    it("eth whale supplies Nodeset deposit pool with eth and rpl", async function () {

        // ethWhale gets shares of xrETH
        const initialBalance = await weth.balanceOf(protocol.depositPool.address);
        await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
        await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
        await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);
        const expectedAmountInDP = ethers.utils.parseEther("100");
        const actualAmountInDP = (await weth.balanceOf(protocol.depositPool.address)).sub(initialBalance);
        expectNumberE18ToBeApproximately(actualAmountInDP, expectedAmountInDP, 0.05);
        const intialBalanceRpl = await protocol.vCRPL.totalAssets();
        await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));
        await protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("100"), signers.rplWhale.address);
        const expectedRplInDP = ethers.utils.parseEther("100");
        const actualRplInDP = (await protocol.vCRPL.totalAssets()).sub(intialBalanceRpl);
        expectNumberE18ToBeApproximately(actualRplInDP, expectedRplInDP, 0.1); // ooof, lets get this estimate down to 0.001%
    });

    it("eth whale redeems one share to trigger pool rebalacings", async function () {


        const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
        const network = await ethers.provider.getNetwork();
        const chainId = network.chainId;
        const newTotalYield = ethers.utils.parseEther("3");
        const incorrectMessageHash = ethers.utils.solidityKeccak256(["uint256", "uint256", "address", "uint256"], [newTotalYield, timestamp, protocol.oracle.address, chainId]);
        const signature = await signers.admin.signMessage(ethers.utils.arrayify(incorrectMessageHash));
        await protocol.oracle.connect(signers.admin).setTotalYieldAccrued(signature, newTotalYield, timestamp)

        console.log("total supply of shares")
        console.log(await protocol.vCWETH.totalSupply())
        console.log(await protocol.vCWETH.maxRedeem(signers.ethWhale.address));
        console.log(await protocol.vCWETH.totalAssets())
        console.log(await protocol.vCWETH.balanceOf(signers.ethWhale.address));
        console.log(await protocol.wETH.balanceOf(protocol.vCWETH.address));
        console.log(await ethers.provider.getBalance(protocol.vCWETH.address));
        console.log(await protocol.vCWETH.convertToAssets(ethers.utils.parseEther("1")));
        console.log("balance of deposit pool / opd")
        console.log(await protocol.wETH.balanceOf(protocol.depositPool.address));
        console.log(await protocol.wETH.balanceOf(protocol.operatorDistributor.address));
        console.log(await protocol.vCWETH.maxRedeem(signers.ethWhale.address));

        const tx = await protocol.vCWETH.connect(signers.ethWhale).redeem(ethers.utils.parseEther("1"), signers.ethWhale.address, signers.ethWhale.address);
        const receipt = await tx.wait();
        const { events } = receipt;
        if (events) {
            for (let i = 0; i < events.length; i++) {
                if (events[i].event?.includes("Capital")) {
                    expectNumberE18ToBeApproximately(events[i].args?.amount, ethers.utils.parseEther("0.7246"), 0.01);
                }
            }
        }
        console.log("totalYeildDistributed");
        console.log(await protocol.vCWETH.totalYieldDistributed())
        expectNumberE18ToBeApproximately(await protocol.vCWETH.totalYieldDistributed(), ethers.utils.parseEther("0.7246"), 0.01);
    });

    it("someone calls for yield distribution", async function () {

        const xrETHBalancesBefore = [];
        const xRPLBalancesBefore = [];

        const ETHbalancesBefore = [];
        const RPLbalancesBefore = [];

        const allAddresses = getAllAddresses(signers, protocol, rocketPool);

        for (let i = 0; i < allAddresses.length; i++) {
            xrETHBalancesBefore.push(allAddresses[i].name + " - " + await protocol.vCWETH.balanceOf(allAddresses[i].address));
            xRPLBalancesBefore.push(allAddresses[i].name + " - " + await protocol.vCRPL.balanceOf(allAddresses[i].address));
            ETHbalancesBefore.push(allAddresses[i].name + " - " + await ethers.provider.getBalance(allAddresses[i].address));
            RPLbalancesBefore.push(allAddresses[i].name + " - " + await rocketPool.rplContract.balanceOf(allAddresses[i].address));
        }

        console.log("AA")

        console.log("BB")

        await protocol.yieldDistributor.connect(signers.admin).finalizeInterval();

        const currentInterval = (await protocol.yieldDistributor.currentInterval()).sub(1);

        console.log(await protocol.yieldDistributor.getClaims())

        const tx = await protocol.yieldDistributor.connect(signers.random).harvest(signers.hyperdriver.address, 0, currentInterval);
        const receipt = await tx.wait();
        const { events } = receipt;
        if (events) {
            for (let i = 0; i < events.length; i++) {
                if (events[i].event?.includes("RewardDistributed")) {
                    console.log("RewardDistributed")
                    console.log(events[i].args)
                }
            }
        }

        console.log("deposit pool eth balance: ", ethers.utils.formatEther(await ethers.provider.getBalance(protocol.depositPool.address)));
        console.log("deposit pool rpl balance: ", ethers.utils.formatEther(await rocketPool.rplContract.balanceOf(protocol.depositPool.address)));
        console.log("operator distribution pool eth balance: ", ethers.utils.formatEther(await ethers.provider.getBalance(protocol.operatorDistributor.address)));
        console.log("operator distribution pool rpl balance: ", ethers.utils.formatEther(await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)));

        const xrETHBalancesAfter = [];
        const xRPLBalancesAfter = [];
        const ETHbalancesAfter = [];
        const RPLbalancesAfter = [];

        for (let i = 0; i < allAddresses.length; i++) {
            xrETHBalancesAfter.push(allAddresses[i].name + " - " + await protocol.vCWETH.balanceOf(allAddresses[i].address));
            xRPLBalancesAfter.push(allAddresses[i].name + " - " + await protocol.vCRPL.balanceOf(allAddresses[i].address));
            ETHbalancesAfter.push(allAddresses[i].name + " - " + await ethers.provider.getBalance(allAddresses[i].address));
            RPLbalancesAfter.push(allAddresses[i].name + " - " + await rocketPool.rplContract.balanceOf(allAddresses[i].address));
        }

        // print before - after balances if delta is not 0
        console.log("printing delta balances")
        for (let i = 0; i < allAddresses.length; i++) {
            if (xrETHBalancesBefore[i] != xrETHBalancesAfter[i]) {
                console.log("xrETH balance before: ", xrETHBalancesBefore[i]);
                console.log("xrETH balance after: ", xrETHBalancesAfter[i]);
            }
            if (xRPLBalancesBefore[i] != xRPLBalancesAfter[i]) {
                console.log("xRPL balance before: ", xRPLBalancesBefore[i]);
                console.log("xRPL balance after: ", xRPLBalancesAfter[i]);
            }
            if (ETHbalancesBefore[i] != ETHbalancesAfter[i]) {
                console.log("ETH balance before: ", ETHbalancesBefore[i]);
                console.log("ETH balance after: ", ETHbalancesAfter[i]);
            }
            if (RPLbalancesBefore[i] != RPLbalancesAfter[i]) {
                console.log("RPL balance before: ", RPLbalancesBefore[i]);
                console.log("RPL balance after: ", RPLbalancesAfter[i]);
            }
        }
    });

    it("sub node operator 'hyperdriver' decides to begin staking process again...", async () => {
        await setupData.rocketPool.rocketDepositPoolContract.deposit({
            value: ethers.utils.parseEther("32")
        })
        await setupData.rocketPool.rocketDepositPoolContract.assignDeposits();

        await increaseEVMTime(60 * 60 * 24 * 7 * 32);

        await expect(protocol.superNode.connect(signers.hyperdriver).stake(minipoolAddress)).to.be.revertedWith("The minipool can only begin staking while in prelaunch");
    })
});