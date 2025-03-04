import { expect } from "chai";
import { ethers } from "hardhat";
import { getAllAddresses, protocolFixture, SetupData } from "../integration";
import { Protocol } from "../integration";
import { Signers } from "../integration";
import { RocketPool } from "../integration";
import { IERC20, WETHVault, RPLVault, IWETH } from "../../../typechain-types";
import { registerNewValidator, expectNumberE18ToBeApproximately, prepareOperatorDistributionContract, printBalances, printObjectBalances, printObjectTokenBalances, printTokenBalances, assertAddOperator, deployMinipool, increaseEVMTime } from "../../utils/utils";
import { generateDepositDataForStake } from "../../rocketpool/_helpers/minipool";


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
        await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
        await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
        rpl = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", await protocol.directory.getRPLAddress()) as IERC20;

    });

    it("admin needs to kyc the node operator and register them in the whitelist", async function () {
        await assertAddOperator(setupData, signers.hyperdriver);
    });

    it("node operator creates minipool via creating validator account", async function () {
        //await assertAddOperator(setupData, signers.hyperdriver);

        // now we must create a minipool via super node
        expect(await protocol.superNode.hasSufficientLiquidity(bondValue)).equals(false);
        await prepareOperatorDistributionContract(setupData, 1);
        expect(await protocol.superNode.hasSufficientLiquidity(bondValue)).equals(true);

        expect(await protocol.superNode.getEthStaked()).equals(BigInt(0));
        expect(await protocol.superNode.getEthMatched()).equals(BigInt(0));

        minipoolAddress = await deployMinipool(setupData, bondValue, signers.hyperdriver.address);

        // Assuming signers.hyperdriver.address and minipoolAddress are defined
        const hyperdriverAddress = await ethers.utils.getAddress(signers.hyperdriver.address);
        const minipoolFormatAddress = await ethers.utils.getAddress(minipoolAddress);

        // Check if the subNodeOperator has the minipool
        expect((await protocol.superNode.minipoolData(minipoolFormatAddress)).subNodeOperator).to.equal(hyperdriverAddress);
    });

    // continue debugging staking ops, why would staking fail here?
    it("sub node operator 'hyperdriver' decides to begin staking process", async () => {
        await setupData.rocketPool.rocketDepositPoolContract.deposit({
            value: ethers.utils.parseEther("32")
        })
        await setupData.rocketPool.rocketDepositPoolContract.assignDeposits();

        await increaseEVMTime(60 * 60 * 24 * 7 * 32);

        const depositDataStake = await generateDepositDataForStake(minipoolAddress);

        await protocol.superNode.connect(signers.hyperdriver).stake(depositDataStake.depositData.signature, depositDataStake.depositDataRoot, minipoolAddress);
    })

    it("oracle update increases yield appropriately", async function () {

        await protocol.vCWETH.connect(signers.admin).setMaxWethRplRatio(ethers.utils.parseEther('100')); // set max ratio to 10000% to allow for large ETH deposits

        // push down coverage ratio
        await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.hyperdriver.address, ethers.utils.parseEther("200"));
        await rocketPool.rplContract.connect(signers.hyperdriver).approve(protocol.vCRPL.address, ethers.utils.parseEther("200"));
        await protocol.vCRPL.connect(signers.hyperdriver).deposit(ethers.utils.parseEther("200"), signers.hyperdriver.address);

        // deposit into protocol
        await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
        await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethers.utils.parseEther("100"));
        await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("100"), signers.ethWhale.address);

        const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
        const network = await ethers.provider.getNetwork();
        const chainId = network.chainId;
        const newTotalYield = ethers.utils.parseEther("3");
        const currentOracleError = await protocol.operatorDistributor.oracleError();
        const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
        const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, protocol.oracle.address, chainId]);
        const signature = await signers.admin.signMessage(ethers.utils.arrayify(messageHash));
        // accrue yield via oracle
        await protocol.oracle.connect(signers.admin).setTotalYieldAccrued(signature, sigData)

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

        registerNewValidator(setupData, [signers.hyperdriver]);

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
        const depositDataStake = await generateDepositDataForStake(minipoolAddress);
        await expect(protocol.superNode.connect(signers.hyperdriver).stake(depositDataStake.depositData.signature, depositDataStake.depositDataRoot, minipoolAddress)).to.be.revertedWith("The minipool can only begin staking while in prelaunch");
    })
});