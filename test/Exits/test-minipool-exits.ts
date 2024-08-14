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

    this.beforeEach(async () => {
        setupData = await loadFixture(protocolFixture);
        protocol = setupData.protocol;
        signers = setupData.signers;
        rocketPool = setupData.rocketPool;
    })

    describe("When caller is admin", async () => {

        this.beforeEach(async () => {
            caller = signers.admin;
        })

        describe.only("When minipool balance is greater than minipool Node Refund Balance", async () => {

            let minipool: RocketMinipoolDelegate;
            let nodeRefundBalance: BigNumber;
            let nodeDepositBalance: BigNumber;

            this.beforeEach(async () => {

                const initialDeposit = await prepareOperatorDistributionContract(setupData, 1);
                const minipools = await registerNewValidator(setupData, [signers.random]);

                minipool = await ethers.getContractAt("RocketMinipoolDelegate", minipools[0]);

                nodeRefundBalance = await minipool.getNodeRefundBalance();
                nodeDepositBalance = await minipool.getNodeDepositBalance();

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

                    // assert minipool balance is zero
                    // do state checks on distributeBalance working as expected

                    // assert onNodeMinipoolDestroy is called by doing required state checks
                    // assert onMinipoolRemoved is called correctly by doing requried state checks
                    // assert onEthRewardsReceived is called correctly by doing required state checks

                    
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
                })
            })
        })

        describe("When minipool balance is equal to minipool Node Refund Balance", async () => {
            describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })
            })

            describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })
        })

        describe("When minipool balance is less than minipool Node Refund Balance", async () => {
            it("Shoudl revert", async () => {

            })
        })
    })

    describe("When caller is protocol", async () => {

        beforeEach(async () => {
            caller = signers.protocolSigner;
        })

        describe("When minipool balance is greater than minipool Node Refund Balance", async () => {
            describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })
        })

        describe("When minipool balance is equal to minipool Node Refund Balance", async () => {
            describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })
        })

        describe("When minipool balance is less than minipool Node Refund Balance", async () => {
            it("Shoudl revert", async () => {

            })
        })
    })

    describe("When caller is neither admin nor protocol", async () => {

        beforeEach(async () => {
            caller = signers.random;
        })

        it("Shoudl revert", async () => {

        })
    })
})