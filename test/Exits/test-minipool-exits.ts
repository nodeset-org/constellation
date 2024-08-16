import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData, Signers } from "../test";
import { prepareOperatorDistributionContract, registerNewValidator } from "../utils/utils";
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

            describe("When minipool balance is greater than minipool Node Refund Balance", async () => {

                beforeEach(async () => {
                    const largerBalance = nodeRefundBalance.add(ethers.utils.parseEther("1"));
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: largerBalance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).greaterThan(await minipool.getNodeRefundBalance());
                })

                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Should pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("32")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).greaterThan(nodeDepositBalance);


                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).not.equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("31")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).equals(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("30")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).lessThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })
            })

            describe("When minipool balance is equal to minipool Node Refund Balance", async () => {
                beforeEach(async () => {
                    const equalBalance = nodeRefundBalance;
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: equalBalance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(await minipool.getNodeRefundBalance());
                })

                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("33")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).greaterThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).not.equals(0)
                    })

                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("32")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).equals(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("30")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).lessThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    })
                })
            })

            describe("When minipool balance is less than minipool Node Refund Balance", async () => {
                it("Shoudl return with a warning", async () => {
                    const newNodeRefundAmount = ethers.utils.parseEther("1");
                    const value = ethers.utils.hexZeroPad(ethers.utils.hexlify(newNodeRefundAmount), 32);

                    const slot = await minipool.getNodeRefundBalanceSlot();

                    await ethers.provider.send("hardhat_setStorageAt", [
                        '0x' + minipool.address,
                        '0x' + ethers.utils.stripZeros(slot),
                        value
                    ]);

                    expect(await ethers.provider.getBalance(minipool.address)).lessThan(await minipool.getNodeRefundBalance());
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    await expect(await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address)).to.emit(protocol.operatorDistributor, "WarningEthBalanceSmallerThanRefundBalance").withArgs('0x' + minipool.address)
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })
        })

        describe("When caller is protocol", async () => {

            beforeEach(async () => {
                caller = signers.protocolSigner;
            })

            describe("When minipool balance is greater than minipool Node Refund Balance", async () => {

                beforeEach(async () => {
                    const largerBalance = nodeRefundBalance.add(ethers.utils.parseEther("1"));
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: largerBalance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).greaterThan(await minipool.getNodeRefundBalance());
                })

                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("32")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).greaterThan(nodeDepositBalance);


                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).not.equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("31")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).equals(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("30")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).lessThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })
            })

            describe("When minipool balance is equal to minipool Node Refund Balance", async () => {
                beforeEach(async () => {
                    const equalBalance = nodeRefundBalance;
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: equalBalance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(await minipool.getNodeRefundBalance());
                })

                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("33")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).greaterThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).not.equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("32")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).equals(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("30")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).lessThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })
            })

            describe("When minipool balance is less than minipool Node Refund Balance", async () => {
                it("Shoudl return with a warning", async () => {
                    const newNodeRefundAmount = ethers.utils.parseEther("1");
                    const value = ethers.utils.hexZeroPad(ethers.utils.hexlify(newNodeRefundAmount), 32);

                    const slot = await minipool.getNodeRefundBalanceSlot();

                    await ethers.provider.send("hardhat_setStorageAt", [
                        '0x' + minipool.address,
                        '0x' + ethers.utils.stripZeros(slot),
                        value
                    ]);

                    expect(await ethers.provider.getBalance(minipool.address)).lessThan(await minipool.getNodeRefundBalance());
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    await expect(await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address)).to.emit(protocol.operatorDistributor, "WarningEthBalanceSmallerThanRefundBalance").withArgs('0x' + minipool.address)
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })
        })

    })

    describe("When Node Refund Balance is 1 eth", async () => {

        beforeEach(async () => {

            const newNodeRefundAmount = ethers.utils.parseEther("1");
            const value = ethers.utils.hexZeroPad(ethers.utils.hexlify(newNodeRefundAmount), 32);

            const slot = await minipool.getNodeRefundBalanceSlot();

            await ethers.provider.send("hardhat_setStorageAt", [
                '0x' + minipool.address,
                '0x' + ethers.utils.stripZeros(slot),
                value
            ]);

            nodeRefundBalance = await minipool.getNodeRefundBalance();
            nodeDepositBalance = await minipool.getNodeDepositBalance();

            expect(nodeRefundBalance).equals(ethers.utils.parseEther("1"));
        })

        describe("When caller is admin", async () => {

            beforeEach(async () => {
                caller = signers.admin;

            })

            describe("When minipool balance is greater than minipool Node Refund Balance", async () => {

                beforeEach(async () => {
                    const largerBalance = nodeRefundBalance.add(ethers.utils.parseEther("1"));
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: largerBalance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).greaterThan(await minipool.getNodeRefundBalance());
                })

                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Should pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("32")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).greaterThan(nodeDepositBalance);


                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).not.equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("31")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).equals(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("30")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).lessThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })
            })

            describe("When minipool balance is equal to minipool Node Refund Balance", async () => {
                beforeEach(async () => {
                    const equalBalance = nodeRefundBalance;
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: equalBalance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(await minipool.getNodeRefundBalance());
                })

                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("33")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).greaterThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).not.equals(0)
                    })

                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("32")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).equals(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("30")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).lessThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                    })
                })
            })

            describe("When minipool balance is less than minipool Node Refund Balance", async () => {
                it("Shoudl return with a warning", async () => {
                    expect(await ethers.provider.getBalance(minipool.address)).lessThan(await minipool.getNodeRefundBalance());
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    await expect(await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address)).to.emit(protocol.operatorDistributor, "WarningEthBalanceSmallerThanRefundBalance").withArgs('0x' + minipool.address)
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })
        })

        describe("When caller is protocol", async () => {

            beforeEach(async () => {
                caller = signers.protocolSigner;
            })

            describe("When minipool balance is greater than minipool Node Refund Balance", async () => {

                beforeEach(async () => {
                    const largerBalance = nodeRefundBalance.add(ethers.utils.parseEther("1"));
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: largerBalance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).greaterThan(await minipool.getNodeRefundBalance());
                })

                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("32")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).greaterThan(nodeDepositBalance);


                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).not.equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("31")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).equals(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("30")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).lessThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })
            })

            describe("When minipool balance is equal to minipool Node Refund Balance", async () => {
                beforeEach(async () => {
                    const equalBalance = nodeRefundBalance;
                    await signers.ethWhale.sendTransaction({
                        to: minipool.address,
                        value: equalBalance
                    })
                    expect(await ethers.provider.getBalance(minipool.address)).equals(await minipool.getNodeRefundBalance());
                })

                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("33")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).greaterThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).not.equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("32")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).equals(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {
                        await signers.ethWhale.sendTransaction({
                            to: minipool.address,
                            value: ethers.utils.parseEther("30")
                        })

                        const minipoolBalance = await ethers.provider.getBalance(minipool.address);
                        const balanceAfterRefund = minipoolBalance.sub(nodeRefundBalance);

                        const nodeShare = await minipool.calculateNodeShare(balanceAfterRefund);

                        expect(nodeShare).lessThan(nodeDepositBalance);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                        expect(await protocol.superNode.getNumMinipools()).equals(1);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)

                        await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address);

                        expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(0)
                        expect(await ethers.provider.getBalance(minipool.address)).equals(0);
                        expect(await protocol.superNode.getNumMinipools()).equals(0);
                        expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(ethers.constants.AddressZero);
                        expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    })
                })
            })

            describe("When minipool balance is less than minipool Node Refund Balance", async () => {
                it("Shoudl return with a warning", async () => {
                    expect(await ethers.provider.getBalance(minipool.address)).lessThan(await minipool.getNodeRefundBalance());
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                    await expect(await protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address)).to.emit(protocol.operatorDistributor, "WarningEthBalanceSmallerThanRefundBalance").withArgs('0x' + minipool.address)
                    expect(await protocol.whitelist.getActiveValidatorCountForOperator(subNodeOperator.address)).equals(1)
                    expect(await protocol.superNode.getNumMinipools()).equals(1);
                    expect((await protocol.superNode.minipoolData(minipool.address)).subNodeOperator).equals(subNodeOperator.address);
                    expect(await protocol.operatorDistributor.oracleError()).equals(0)
                })
            })
        })
    })


    describe("When caller is neither admin nor protocol", async () => {


        beforeEach(async () => {
            caller = signers.random;
        })

        it("Shoudl revert", async () => {
            await expect(protocol.operatorDistributor.connect(caller).distributeExitedMinipool(minipool.address)).to.be.revertedWith("Can only be called by Protocol or Admin!")
        })
    })
})