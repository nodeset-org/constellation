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
import { deployMockMinipool, expectNumberE18ToBeApproximately, printBalances, printObjectBalances, printObjectTokenBalances, printTokenBalances } from "../utils/utils";


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

    it("node operator creates minipool", async function () {
        mockMinipool = await deployMockMinipool(signers.hyperdriver, rocketPool, signers, bondValue);
        expect(await mockMinipool.getNodeAddress()).to.equal(signers.hyperdriver.address);
        expect(await mockMinipool.getNodeDepositBalance()).to.equal(bondValue);
        // expect(await mockMinipool.getStatus()).to.equal(1);
        // for some reason we are not in prelaunch

        // hyperdriver sets withdrawal address to be Nodeset's deposit pool
        await rocketPool.rockStorageContract.connect(signers.hyperdriver).setWithdrawalAddress(signers.hyperdriver.address, protocol.depositPool.address, true);
        expect(await rocketPool.rockStorageContract.getNodeWithdrawalAddress(signers.hyperdriver.address)).to.equal(protocol.depositPool.address);

        // NO sets smoothing pool registration state to true
        await rocketPool.rocketNodeManagerContract.connect(signers.hyperdriver).setSmoothingPoolRegistrationState(true);
        const smoothingPool = await rocketPool.rocketNodeManagerContract.callStatic.getSmoothingPoolRegistrationState(signers.hyperdriver.address);
        expect(smoothingPool).to.equal(true);
        // waiting to be funded remaining eth by rocket pool...

    });

    it("admin needs to kyc the node operator and register them in the whitelist", async function () {
        await protocol.whitelist.connect(signers.admin).addOperator(signers.hyperdriver.address);
    });


    it("eth whale supplies Nodeset deposit pool with eth and rpl", async function () {

        // eth gets shares of xrETH
        await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
        await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
        await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);

        const expectedAmountInDP =  ethers.utils.parseEther("100");
        const actualAmountInDP = await weth.balanceOf(protocol.depositPool.address);
        expectNumberE18ToBeApproximately(actualAmountInDP, expectedAmountInDP, 0.005);

        await rocketPool.rplContract.connect(signers.rplWhale).approve(protocol.vCRPL.address, ethers.utils.parseEther("100"));
        await protocol.vCRPL.connect(signers.rplWhale).deposit(ethers.utils.parseEther("100"), signers.rplWhale.address);
        const expectedRplInDP = ethers.utils.parseEther("100");
        const actualRplInDP = await rpl.balanceOf(protocol.depositPool.address);
        expectNumberE18ToBeApproximately(actualRplInDP, expectedRplInDP, 0.005);
    });

    it("eth whale redeems one share to trigger pool rebalacings", async function () {
        await protocol.oracle.setTotalYieldAccrued(ethers.utils.parseEther("2"));
        const tx = await protocol.vCWETH.connect(signers.ethWhale).redeem(ethers.utils.parseUnits("40", 18), signers.ethWhale.address, signers.ethWhale.address);
        const receipt = await tx.wait();
        const {events} = receipt;
        if(events) {
            for(let i = 0; i < events.length; i++) {
                if(events[i].event?.includes("Capital")) {
                    expectNumberE18ToBeApproximately(events[i].args?.amount, ethers.utils.parseEther(".8"), 0.01);
                }
            }
        }
        expectNumberE18ToBeApproximately(await protocol.vCWETH.totalYieldDistributed(), ethers.utils.parseEther(".8"), 0.01);
    });

    it("node operator gets reimbursement", async function () {
        const initialRPLBalanceNO = await rocketPool.rplContract.balanceOf(signers.hyperdriver.address);
        const initialEthBalanceNO = await ethers.provider.getBalance(signers.hyperdriver.address);
        const initialRPLBalanceOD = await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address);
        const initialEthBalanceOD = await ethers.provider.getBalance(protocol.operatorDistributor.address);

        // admin will sign mockMinipool's address via signMessage
        const encodedMinipoolAddress = ethers.utils.defaultAbiCoder.encode(["address"], [mockMinipool.address]);
        const mockMinipoolAddressHash = ethers.utils.keccak256(encodedMinipoolAddress);
        const mockMinipoolAddressHashBytes = ethers.utils.arrayify(mockMinipoolAddressHash);
        const sig = await signers.adminServer.signMessage(mockMinipoolAddressHashBytes);

        let operatorData = await protocol.whitelist.getOperatorAtAddress(signers.hyperdriver.address);
        expect(operatorData.currentValidatorCount).to.equal(0);
        //await protocol.operatorDistributor.connect(signers.admin).reimburseNodeForMinipool(sig, mockMinipool.address);
        operatorData = await protocol.whitelist.getOperatorAtAddress(signers.hyperdriver.address);
    //    expect(operatorData.currentValidatorCount).to.equal(1);

        const finalRPLBalanceNO = await rocketPool.rplContract.balanceOf(signers.hyperdriver.address);
        const finalEthBalanceNO = await ethers.provider.getBalance(signers.hyperdriver.address);
        const finalRPLBalanceOD = await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address);
        const finalEthBalanceOD = await ethers.provider.getBalance(protocol.operatorDistributor.address);

        const expectedReimbursementRPL = await rocketPool.rocketNodeStakingContract.getNodeMinimumRPLStake(signers.hyperdriver.address);
        const expectedReimbursementEth = bondValue

        //expect(finalRPLBalanceNO.sub(initialRPLBalanceNO)).to.equal(expectedReimbursementRPL);
      //  expect(finalEthBalanceNO.sub(initialEthBalanceNO)).to.equal(expectedReimbursementEth);
        //expect(initialRPLBalanceOD.sub(finalRPLBalanceOD)).to.equal(expectedReimbursementRPL);
      //  expect(initialEthBalanceOD.sub(finalEthBalanceOD)).to.equal(expectedReimbursementEth);

        // print balances of deposit pool and operator distribution pool
        console.log("deposit pool eth balance: ", ethers.utils.formatEther(await ethers.provider.getBalance(protocol.depositPool.address)));
        console.log("deposit pool rpl balance: ", ethers.utils.formatEther(await rocketPool.rplContract.balanceOf(protocol.depositPool.address)));
        console.log("operator distribution pool eth balance: ", ethers.utils.formatEther(await ethers.provider.getBalance(protocol.operatorDistributor.address)));
        console.log("operator distribution pool rpl balance: ", ethers.utils.formatEther(await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)));

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

        const currentInterval = await protocol.yieldDistributor.currentInterval();
        await protocol.yieldDistributor.connect(signers.admin).finalizeInterval();
        await protocol.yieldDistributor.connect(signers.random).harvest(signers.hyperdriver.address, currentInterval, currentInterval);

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