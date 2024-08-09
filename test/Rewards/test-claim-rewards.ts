import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";
import { assertAddOperator, createClaimRewardSig, createClaimRewardSigWithNonce } from "../utils/utils";

describe("Claiming Rewards", async () => {
    describe("When _rewardee is not equal to address(0)", async () => {
        describe("When admin server sig has not been used", async () => {
            describe("When sig has not expired", async () => {
                describe("When sig has been verified by correct role", async () => {
                    describe("When _token is address(0)", async () => {
                        describe("When yieldDistributor has enough eth to send to _rewardee", async () => {
                            describe("When multiple users are trying to claim a nonce 0", async () => {
                                it("Should pass", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    const rewardee2 = signers.random2.address;
                                    await assertAddOperator(setupData, signers.random);
                                    await assertAddOperator(setupData, signers.random2);

                                    await signers.ethWhale.sendTransaction({
                                        to: protocol.yieldDistributor.address,
                                        value: amount
                                    })

                                    const sig = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    const sig2 = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, rewardee2, amount.div(2), ethers.BigNumber.from(0));

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, rewardee, amount.div(2));
                                    const tx2 = await protocol.yieldDistributor.connect(signers.random2).claimRewards(sig2, ethers.constants.AddressZero, rewardee2, amount.div(2));

                                    const receipt = await tx.wait();
                                    const { blockNumber, cumulativeGasUsed, effectiveGasPrice } = receipt;
                                    const ethPriceOfTx = cumulativeGasUsed.mul(effectiveGasPrice);
                                    const initialBalanceRewardee = await ethers.provider.getBalance(rewardee, blockNumber - 1);
                                    const finalBalanceRewardee = await ethers.provider.getBalance(rewardee, blockNumber);
                                    const initalBalanceYd = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber - 1);
                                    const finalBalanceYd = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber);

                                    expect(tx.from).equals(rewardee)
                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.div(-2));
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount.div(2).sub(ethPriceOfTx))

                                    const receipt2 = await tx2.wait();
                                    const { blockNumber: blockNumber2, cumulativeGasUsed: cumulativeGasUsed2, effectiveGasPrice: effectiveGasPrice2 } = receipt2;
                                    const ethPriceOfTx2 = cumulativeGasUsed2.mul(effectiveGasPrice2);
                                    const initialBalanceRewardee2 = await ethers.provider.getBalance(rewardee2, blockNumber2 - 1);
                                    const finalBalanceRewardee2 = await ethers.provider.getBalance(rewardee2, blockNumber2);
                                    const initalBalanceYd2 = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber2 - 1);
                                    const finalBalanceYd2 = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber2);

                                    expect(tx2.from).equals(rewardee2)
                                    expect(finalBalanceYd2.sub(initalBalanceYd2)).equals(amount.div(-2));
                                    expect(finalBalanceRewardee2.sub(initialBalanceRewardee2)).equals(amount.div(2).sub(ethPriceOfTx2))
                                })
                            })

                            describe("When the same user is trying to claim two sigs with nonce 0", async () => {
                                it("Should revert", async () => {

                                })
                            })

                            describe("When another user tries to steal sig to claim funds", async () => {
                                it("Should give funds to rewardee NOT sender", async () => {

                                })
                            })

                            describe("When caller is the rewardee", async () => {
                                it("Should pass", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    await assertAddOperator(setupData, signers.random);

                                    await signers.ethWhale.sendTransaction({
                                        to: protocol.yieldDistributor.address,
                                        value: amount
                                    })

                                    const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, rewardee, amount);

                                    const receipt = await tx.wait();
                                    const { blockNumber, cumulativeGasUsed, effectiveGasPrice } = receipt;
                                    const ethPriceOfTx = cumulativeGasUsed.mul(effectiveGasPrice);
                                    const initialBalanceRewardee = await ethers.provider.getBalance(rewardee, blockNumber - 1);
                                    const finalBalanceRewardee = await ethers.provider.getBalance(rewardee, blockNumber);
                                    const initalBalanceYd = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber - 1);
                                    const finalBalanceYd = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber);

                                    expect(tx.from).equals(rewardee)
                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount.sub(ethPriceOfTx))
                                })
                            })

                            describe("When caller is not the rewardee", async () => {
                                it("Should pass", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    await assertAddOperator(setupData, signers.random);

                                    await signers.ethWhale.sendTransaction({
                                        to: protocol.yieldDistributor.address,
                                        value: amount
                                    })

                                    const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, ethers.constants.AddressZero, rewardee, amount);

                                    const receipt = await tx.wait();
                                    const { blockNumber, cumulativeGasUsed, effectiveGasPrice } = receipt;
                                    const initialBalanceRewardee = await ethers.provider.getBalance(rewardee, blockNumber - 1);
                                    const finalBalanceRewardee = await ethers.provider.getBalance(rewardee, blockNumber);
                                    const initalBalanceYd = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber - 1);
                                    const finalBalanceYd = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber);
                                    const initalBalanceCaller = await ethers.provider.getBalance(signers.deployer.address, blockNumber - 1);
                                    const finalBalanceCaller = await ethers.provider.getBalance(signers.deployer.address, blockNumber);
                                    const ethPriceOfTx = cumulativeGasUsed.mul(effectiveGasPrice);

                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                                    expect(tx.from).not.equals(rewardee)
                                    expect(tx.from).equals(signers.deployer.address)
                                    expect(finalBalanceCaller.sub(initalBalanceCaller)).equals(ethPriceOfTx.mul(-1));
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)

                                })

                            })

                        })

                        describe("When yieldDistributor does not have enough eth to send to operatorController", async () => {

                            it("Should revert", async () => {

                            })
                        })
                    })

                    describe("When _token is not address(0)", async () => {
                        describe("When contract has enough token to send to _rewardee", async () => {

                        })

                        describe("When contract does not have enough token to send to _rewardee", async () => {
                            it("Should revert", async () => {

                            })
                        })
                    })


                })

                describe("When sig has not been verified by correct role due to bad params", async () => {
                    describe("When param encoding is bad", async () => {
                        it("Should revert", async () => {

                        })
                    })
                    describe("When claim.amount is bad", async () => {
                        it("Should revert", async () => {

                        })
                    })
                    describe("When nonce is bad", async () => {
                        it("Should revert", async () => {

                        })
                    })
                    describe("When yieldDistributor address is bad", async () => {
                        it("Should revert", async () => {

                        })
                    })
                    describe("When chainid is bad", async () => {
                        it("Should revert", async () => {

                        })
                    })
                })

                describe("When sig has not been verified by correct role due to bad signer", async () => {
                    it("Should revert", async () => {

                    })
                })
            })


            describe("When sig has expired", async () => {
                it("Should revert", async () => {

                })
            })

            describe("When admin server sig has been used", async () => {
                it("Should revert", async () => {

                })
            })
        })

        describe("When _rewardee is not in whitelist", async () => {
            it("Should revert", async () => {

            })
        })
    })

    describe("When _rewardee is equal to address(0)", async () => {
        it("Should revert", async () => {

        })
    })
})