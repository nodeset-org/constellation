import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData, Signers } from "../integration";
import { prepareOperatorDistributionContract, registerNewValidator } from "../../utils/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { RocketMinipoolDelegate } from "../../typechain-types";
import { BigNumber } from "ethers";

describe("Exiting Minipools", function () {

    let protocol: Protocol;
    let signers: Signers;
    let rocketPool: RocketPool;
    let caller: SignerWithAddress;
    let setupData: SetupData

    let minipool: RocketMinipoolDelegate;
    let subNodeOperator: SignerWithAddress;
    let nodeRefundBalance: BigNumber;
    let nodeDepositBalance: BigNumber;

    beforeEach(async () => {
        setupData = await loadFixture(protocolFixture);
        protocol = setupData.protocol;
        signers = setupData.signers;
        rocketPool = setupData.rocketPool;

        subNodeOperator = signers.random;

        const initialDeposit = await prepareOperatorDistributionContract(setupData, 1);
        const minipools = await registerNewValidator(setupData, [subNodeOperator]);

        minipool = await ethers.getContractAt("RocketMinipoolDelegate", minipools[0]);

        nodeRefundBalance = await minipool.getNodeRefundBalance();
        nodeDepositBalance = await minipool.getNodeDepositBalance();

        expect(await minipool.getStatus()).equals(2);
    })

    describe("When Node Refund Balance is zero", async () => {

        describe("When caller is admin", async () => {

            beforeEach(async () => {
                caller = signers.admin;
                expect(nodeRefundBalance).equals(0)
            })

            describe("When received amount is greater than original bond", async () => {
                it("rewards should be positive", async () => {
                    // simulate an exit with rewards
                    const baconReward = ethers.utils.parseEther("1")
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: baconReward.add(ethers.utils.parseEther("32"))
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("33"));
                    // all of node refund balance is rewards in this scenario
                    const constellationPortion = baconReward.mul(ethers.utils.parseEther(".3625")).div(ethers.utils.parseEther("1"));
                    const xrETHPortion = await protocol.vCWETH.getIncomeAfterFees(constellationPortion);
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.add(xrETHPortion));
                    expect(await protocol.operatorDistributor.oracleError()).greaterThan(0)
                })
            })

            describe("When received amount is equal to original bond", async () => {
                it("Should receive no rewards", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("32")
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("32"));
                    // all of node refund balance is rewards in this scenario
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })

            describe("When received amount is less than original bond", async () => {
                it("Should receive no rewards", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("31")
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("31"));
                    // all of node refund balance is rewards in this scenario
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.sub(ethers.utils.parseEther("1")));
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })
        })

        describe("When caller is protocol", async () => {

            beforeEach(async () => {
                caller = signers.protocolSigner;
            })

            describe("When received amount is greater than original bond", async () => {
                it("rewards should be positive", async () => {
                    // simulate an exit with rewards
                    const baconReward = ethers.utils.parseEther("1")
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: baconReward.add(ethers.utils.parseEther("32"))
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("33"));
                    // all of node refund balance is rewards in this scenario
                    const constellationPortion = baconReward.mul(ethers.utils.parseEther(".3625")).div(ethers.utils.parseEther("1"));
                    const xrETHPortion = await protocol.vCWETH.getIncomeAfterFees(constellationPortion);
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.add(xrETHPortion));
                    expect(await protocol.operatorDistributor.oracleError()).greaterThan(0)
                })
            })

            describe("When received amount is equal to original bond", async () => {
                it("Should receive no rewards", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("32")
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("32"));
                    // all of node refund balance is rewards in this scenario
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })

            describe("When received amount is less than original bond", async () => {
                it("Should receive no rewards", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("31")
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("31"));
                    // all of node refund balance is rewards in this scenario
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.sub(ethers.utils.parseEther("1")));
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })
        })

    })

    describe("When Node Refund Balance is 1 eth", async () => {
        let newNodeRefundAmount: BigNumber;
        beforeEach(async () => {

            newNodeRefundAmount = ethers.utils.parseEther("1");
            const value = ethers.utils.hexZeroPad(ethers.utils.hexlify(newNodeRefundAmount), 32);

            const slot = await minipool.getNodeRefundBalanceSlot();

            await ethers.provider.send("hardhat_setStorageAt", [
                '0x' + minipool.address,
                '0x' + ethers.utils.stripZeros(slot),
                value
            ]);

            nodeRefundBalance = await minipool.getNodeRefundBalance();
            nodeDepositBalance = await minipool.getNodeDepositBalance();

            await signers.ethWhale.sendTransaction({
                to: minipool.address,
                value: newNodeRefundAmount
            })
            expect(nodeRefundBalance).equals(newNodeRefundAmount);
            expect(await ethers.provider.getBalance(minipool.address)).equals(nodeRefundBalance);
        })

        describe("When caller is admin", async () => {
            beforeEach(async () => {
                caller = signers.admin;
            })

            describe("When received amount is greater than original bond", async () => {
                it("rewards should be positive", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("32") // now 33 eth total balance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("33"));
                     // all of node refund balance is rewards in this scenario
                    const xrETHPortion = await protocol.vCWETH.getIncomeAfterFees(nodeRefundBalance);
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.add(xrETHPortion));
                    expect(await protocol.operatorDistributor.oracleError()).greaterThan(0)
                })
            })

            describe("When received amount is equal to original bond", async () => {
                it("Should receive no rewards", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("31") // now 32 eth total balance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("32"));
                    // all of node refund balance is rewards in this scenario
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })

            describe("When received amount is less than original bond", async () => {
                it("Should receive no rewards", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("30") // now 31 eth total balance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("31"));
                    // all of node refund balance is rewards in this scenario
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.sub(ethers.utils.parseEther("1")));
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })
        })

        describe("When caller is protocol", async () => {

            beforeEach(async () => {
                caller = signers.protocolSigner;
            })

            describe("When received amount is greater than original bond", async () => {
                it("rewards should be positive", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("32") // now 33 eth total balance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("33"));
                     // all of node refund balance is rewards in this scenario
                    const xrETHPortion = await protocol.vCWETH.getIncomeAfterFees(nodeRefundBalance);
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.add(xrETHPortion));
                    expect(await protocol.operatorDistributor.oracleError()).greaterThan(0)
                })
            })

            describe("When received amount is equal to original bond", async () => {
                it("Should receive no rewards", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("31") // now 32 eth total balance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("32"));
                    // all of node refund balance is rewards in this scenario
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })

            describe("When received amount is less than original bond", async () => {
                it("Should receive no rewards", async () => {
                    // simulate an exit
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: ethers.utils.parseEther("30") // now 31 eth total balance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(ethers.utils.parseEther("31"));
                    // all of node refund balance is rewards in this scenario
                    const priorAssets = await protocol.vCWETH.totalAssets();

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                    expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                    expect(await protocol.superNode.getNumMinipools()).equals(0);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                    expect(await protocol.vCWETH.totalAssets()).to.equal(priorAssets.sub(ethers.utils.parseEther("1")));
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })
        })
    })


    describe("When caller is neither admin nor protocol", async () => {
        beforeEach(async () => {
            caller = signers.random;
        })

        it("Should revert", async () => {
            await expect(protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address)).to.be.revertedWith("Can only be called by Protocol or Admin!")
        })
    })
})