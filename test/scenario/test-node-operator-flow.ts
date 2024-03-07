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
import { deployRPMinipool, deployValidatorAccount, expectNumberE18ToBeApproximately, prepareOperatorDistributionContract, printBalances, printObjectBalances, printObjectTokenBalances, printTokenBalances } from "../utils/utils";


describe("Node Operator Onboarding", function () {

    let setupData: SetupData;
    let protocol: Protocol;
    let signers: Signers;
    let rocketPool: RocketPool;
    let mockMinipool: RocketMinipoolInterface;

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
        await protocol.whitelist.connect(signers.admin).addOperator(signers.hyperdriver.address);
    });

    it("node operator creates minipool via creating validator account", async function () {

        expect(await protocol.validatorAccountFactory.hasSufficentLiquidity(bondValue)).equals(false);
        await prepareOperatorDistributionContract(setupData, 1);
        expect(await protocol.validatorAccountFactory.hasSufficentLiquidity(bondValue)).equals(true);

        const validatorAccount = await deployValidatorAccount(signers.hyperdriver, protocol, signers, bondValue);

        console.log("VAF:")
        console.log(validatorAccount)

    });


    it("eth whale supplies Nodeset deposit pool with eth and rpl", async function () {

        console.log("A")
        // ethWhale gets shares of xrETH
        await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
        console.log("A.1")
        await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
        console.log("A.2")
        await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);
        console.log("B")
        const expectedAmountInDP = ethers.utils.parseEther("100");
        const actualAmountInDP = await weth.balanceOf(protocol.depositPool.address);
        expectNumberE18ToBeApproximately(actualAmountInDP, expectedAmountInDP, 0.005);
        console.log("C")
        await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));
        await protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("100"), signers.rplWhale.address);
        const expectedRplInDP = ethers.utils.parseEther("100");
        const actualRplInDP = await rpl.balanceOf(protocol.depositPool.address);
        expectNumberE18ToBeApproximately(actualRplInDP, expectedRplInDP, 0.005);
    });

    it("eth whale redeems one share to trigger pool rebalacings", async function () {
        await protocol.oracle.setTotalYieldAccrued(ethers.utils.parseEther("4"));
        console.log("MAX REDEEM")
        console.log(await protocol.vCWETH.maxRedeem(signers.ethWhale.address));
        console.log(await protocol.vCWETH.totalAssets())
        console.log(await protocol.vCWETH.balanceOf(signers.ethWhale.address));

        const tx = await protocol.vCWETH.connect(signers.ethWhale).redeem(ethers.utils.parseUnits("1", 18), signers.ethWhale.address, signers.ethWhale.address);
        const receipt = await tx.wait();
        const { events } = receipt;
        if (events) {
            for (let i = 0; i < events.length; i++) {
                if (events[i].event?.includes("Capital")) {
                    expectNumberE18ToBeApproximately(events[i].args?.amount, ethers.utils.parseEther("0.1303"), 0.01);
                }
            }
        }
        console.log("totalYeildDistributed");
        console.log(await protocol.vCWETH.totalYieldDistributed())
        expectNumberE18ToBeApproximately(await protocol.vCWETH.totalYieldDistributed(), ethers.utils.parseEther("0.1303"), 0.01);
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
});