import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";
import { assertAddOperator, createClaimRewardBadChainIdSigWithNonce, createClaimRewardBadEncodedSigWithNonce, createClaimRewardBadSignerSigWithNonce, createClaimRewardBadTargetSigWithNonce, createClaimRewardSig, createClaimRewardSigWithNonce, deployMockToken } from "../utils/utils";
import { BigNumber } from "ethers";

describe("Claiming Rewards", async () => {
    describe("When _rewardee is not equal to address(0)", async () => {
        describe("When admin server sig has not been used", async () => {
            describe("When sig has been verified by correct role", async () => {
                describe("When _token is ETH", async () => {
                    describe("When yieldDistributor has enough eth to send to _rewardee", async () => {
                        describe("When there is one user claiming", async () => {
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
                            });
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

                            });
                            describe("When the same user is trying to claim two sigs with nonce 0", async () => {
                                it("Should revert", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    await assertAddOperator(setupData, signers.random);

                                    await signers.ethWhale.sendTransaction({
                                        to: protocol.yieldDistributor.address,
                                        value: amount
                                    })

                                    const sig = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, rewardee, amount.div(2));

                                    const receipt = await tx.wait();
                                    const { blockNumber, cumulativeGasUsed, effectiveGasPrice } = receipt;
                                    const ethPriceOfTx = cumulativeGasUsed.mul(effectiveGasPrice);
                                    const initialBalanceRewardee = await ethers.provider.getBalance(rewardee, blockNumber - 1);
                                    const finalBalanceRewardee = await ethers.provider.getBalance(rewardee, blockNumber);
                                    const initalBalanceYd = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber - 1);
                                    const finalBalanceYd = await ethers.provider.getBalance(protocol.yieldDistributor.address, blockNumber);

                                    expect(tx.from).equals(rewardee)
                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.div(2).mul(-1));
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount.div(2).sub(ethPriceOfTx))

                                    // do it again

                                    await signers.ethWhale.sendTransaction({
                                        to: protocol.yieldDistributor.address,
                                        value: amount
                                    })

                                    const sig2 = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, rewardee, amount, ethers.BigNumber.from(0));
                                    await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig2, ethers.constants.AddressZero, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

                                })
                            })

                        });
                        describe("When there are multiple users claiming", async () => {
                            describe("When users are trying to claim a nonce 0", async () => {
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


                            describe("When another user tries to steal sig to claim funds", async () => {
                                it("Should give funds to rewardee NOT sender", async () => {
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
                    })

                    describe("When yieldDistributor does not have enough eth to send to rewardee", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            await signers.ethWhale.sendTransaction({
                                to: protocol.yieldDistributor.address,
                                value: amount.sub(1)
                            })

                            const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, rewardee, amount);

                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, rewardee, amount)).to.be.revertedWith("_rewardee failed to claim")
                        })
                    })
                })

                describe("When _token is not ETH (ERC20)", async () => {
                    describe("When contract does not have enough token to send to _rewardee", async () => {
                        describe("when there is one user claiming", async () => {
                            describe("When caller is the rewardee", async () => {
                                it("Should pass", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    await assertAddOperator(setupData, signers.random);

                                    const token = await deployMockToken(ethers.utils.parseEther("1000"));
                                    await token.transfer(protocol.yieldDistributor.address, amount);

                                    const sig = await createClaimRewardSig(setupData, token.address, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount);
                                    const receipt = await tx.wait();
                                    const { blockNumber } = receipt;
                                    const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                                    const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });

                                    const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                                    const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });

                                    expect(tx.from).equals(rewardee)
                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)
                                });

                            })
                            describe("When caller is not the rewardee", async () => {
                                it("Should pass", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    await assertAddOperator(setupData, signers.random);

                                    const token = await deployMockToken(ethers.utils.parseEther("1000"));
                                    await token.transfer(protocol.yieldDistributor.address, amount);

                                    const sig = await createClaimRewardSig(setupData, token.address, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, token.address, rewardee, amount);
                                    const receipt = await tx.wait();
                                    const { blockNumber } = receipt;
                                    const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                                    const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });

                                    const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                                    const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });
                                    const initalBalanceCaller = await token.balanceOf(signers.deployer.address, { blockTag: blockNumber - 1 });
                                    const finalBalanceCaller = await token.balanceOf(signers.deployer.address, { blockTag: blockNumber });

                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                                    expect(tx.from).not.equals(rewardee)
                                    expect(tx.from).equals(signers.deployer.address)
                                    expect(finalBalanceCaller.sub(initalBalanceCaller)).equals(0);
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)
                                });
                            })
                            describe("When the same user is trying to claim two sigs with nonce 0", async () => {
                                it("Should revert", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    await assertAddOperator(setupData, signers.random);

                                    const token = await deployMockToken(ethers.utils.parseEther("1000"));
                                    await token.transfer(protocol.yieldDistributor.address, amount);

                                    const sig = await createClaimRewardSig(setupData, token.address, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount);
                                    const receipt = await tx.wait();
                                    const { blockNumber } = receipt;
                                    const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                                    const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });

                                    const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                                    const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });

                                    expect(tx.from).equals(rewardee)
                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)

                                    // do it again
                                    await token.transfer(protocol.yieldDistributor.address, amount);

                                    const sig2 = await createClaimRewardSigWithNonce(setupData, token.address, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig2, ethers.constants.AddressZero, rewardee, amount.div(2))).to.be.revertedWith("bad signer role, params, or encoding");

                                });
                            });
                        })

                        describe("when there are multiple users claiming", async () => {
                            describe("When users are trying to claim a nonce 0", async () => {
                                it("Should revert", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    const rewardee2 = signers.random2.address;
                                    await assertAddOperator(setupData, signers.random);
                                    await assertAddOperator(setupData, signers.random2);

                                    const token = await deployMockToken(ethers.utils.parseEther("1000"));
                                    await token.transfer(protocol.yieldDistributor.address, amount);

                                    const sig = await createClaimRewardSigWithNonce(setupData, token.address, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    const sig2 = await createClaimRewardSigWithNonce(setupData, token.address, rewardee2, amount.div(2), ethers.BigNumber.from(0));

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount.div(2));
                                    const tx2 = await protocol.yieldDistributor.connect(signers.random2).claimRewards(sig2, token.address, rewardee2, amount.div(2));

                                    const receipt = await tx.wait();
                                    const { blockNumber, cumulativeGasUsed, effectiveGasPrice } = receipt;
                                    const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                                    const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });

                                    const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                                    const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });

                                    expect(tx.from).equals(rewardee)
                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.div(-2));
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount.div(2))
                                    expect(tx.from).equals(rewardee)
                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.div(-2));
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount.div(2))

                                    const receipt2 = await tx2.wait();
                                    const { blockNumber: blockNumber2 } = receipt2;
                                    const initialBalanceRewardee2 = await token.balanceOf(rewardee2, { blockTag: blockNumber2 - 1 });
                                    const finalBalanceRewardee2 = await token.balanceOf(rewardee2, { blockTag: blockNumber2 });
                                    const initalBalanceYd2 = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber2 - 1 });
                                    const finalBalanceYd2 = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber2 });

                                    expect(tx2.from).equals(rewardee2)
                                    expect(finalBalanceYd2.sub(initalBalanceYd2)).equals(amount.div(-2));
                                    expect(finalBalanceRewardee2.sub(initialBalanceRewardee2)).equals(amount.div(2))

                                });

                            });

                            describe("When another user tries to steal sig to claim funds", async () => {
                                it("Should give funds to rewardee NOT sender", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    await assertAddOperator(setupData, signers.random);

                                    const token = await deployMockToken(ethers.utils.parseEther("1000"));
                                    await token.transfer(protocol.yieldDistributor.address, amount);

                                    const sig = await createClaimRewardSig(setupData, token.address, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, token.address, rewardee, amount);
                                    const receipt = await tx.wait();
                                    const { blockNumber } = receipt;
                                    const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                                    const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });

                                    const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                                    const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });
                                    const initalBalanceCaller = await token.balanceOf(signers.deployer.address, { blockTag: blockNumber - 1 });
                                    const finalBalanceCaller = await token.balanceOf(signers.deployer.address, { blockTag: blockNumber });

                                    expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                                    expect(tx.from).not.equals(rewardee)
                                    expect(tx.from).equals(signers.deployer.address)
                                    expect(finalBalanceCaller.sub(initalBalanceCaller)).equals(0);
                                    expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)
                                });
                            })
                        });

                    });

                    describe("When contract does not have enough token to send to _rewardee", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            const token = await deployMockToken(ethers.utils.parseEther("1000"));
                            await token.transfer(protocol.yieldDistributor.address, amount.sub(1));

                            const sig = await createClaimRewardSig(setupData, token.address, rewardee, amount);

                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
                        })
                    })
                })
            })
            describe("When sig is incorrect", async () => {
                describe("When params are invalid", async () => {
                    describe("When param encoding is bad", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            const token = await deployMockToken(ethers.utils.parseEther("1000"));
                            await token.transfer(protocol.yieldDistributor.address, amount);

                            const sig = await createClaimRewardBadEncodedSigWithNonce(setupData, token.address, rewardee, amount, BigNumber.from("0"));

                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })
                    describe("When _token is bad", async () => {
                        it("Should revert so that user can't withdraw other tokens, only their own token", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            const token = await deployMockToken(ethers.utils.parseEther("1000"));
                            const token2 = await deployMockToken(ethers.utils.parseEther("1000"));
                            await token.transfer(protocol.yieldDistributor.address, amount);
                            await token2.transfer(protocol.yieldDistributor.address, amount);

                            const sig = await createClaimRewardSig(setupData, token.address, rewardee, amount);
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token2.address, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })
                    describe("When claim.amount is bad", async () => {
                        it("Should revert - user cannot drain contract unless authorized", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            const token = await deployMockToken(ethers.utils.parseEther("1000"));
                            await token.transfer(protocol.yieldDistributor.address, amount.mul(10));

                            const sig = await createClaimRewardSig(setupData, token.address, rewardee, amount);
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount.mul(10))).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })
                    describe("When nonce is bad", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            const token = await deployMockToken(ethers.utils.parseEther("1000"));
                            await token.transfer(protocol.yieldDistributor.address, amount);

                            const sig = await createClaimRewardSigWithNonce(setupData, token.address, rewardee, amount, BigNumber.from("69"));
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })
                    describe("When yieldDistributor address is bad", async () => {
                        it("Should revert", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            const token = await deployMockToken(ethers.utils.parseEther("1000"));
                            await token.transfer(protocol.yieldDistributor.address, amount);

                            const sig = await createClaimRewardBadTargetSigWithNonce(setupData, token.address, rewardee, amount, BigNumber.from("0"));
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })
                    describe("When chainid is bad", async () => {
                        it("Should revert - users cannot cross-chain replay attack", async () => {
                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            const token = await deployMockToken(ethers.utils.parseEther("1000"));
                            await token.transfer(protocol.yieldDistributor.address, amount);

                            const sig = await createClaimRewardBadChainIdSigWithNonce(setupData, token.address, rewardee, amount, BigNumber.from("0"));
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })
                })

                describe("When the signer is incorrect", async () => {
                    it("Should revert - rewardees can't sign for themselves", async () => {
                        const setupData = await loadFixture(protocolFixture);
                        const { protocol, signers, rocketPool } = setupData;

                        const amount = ethers.utils.parseEther("1");
                        const rewardee = signers.random.address;
                        await assertAddOperator(setupData, signers.random);

                        const token = await deployMockToken(ethers.utils.parseEther("1000"));
                        await token.transfer(protocol.yieldDistributor.address, amount);

                        const sig = await createClaimRewardBadSignerSigWithNonce(setupData, signers.random, token.address, rewardee, amount, BigNumber.from("0"));
                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

                    })
                })
            });
        })
        describe("When admin server sig has been used", async () => {
            it("Should revert - rewardees cannot double claim", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;

                const amount = ethers.utils.parseEther("1");
                const rewardee = signers.random.address;
                await assertAddOperator(setupData, signers.random);

                const token = await deployMockToken(ethers.utils.parseEther("1000"));
                await token.transfer(protocol.yieldDistributor.address, amount);

                const sig = await createClaimRewardSig(setupData, token.address, rewardee, amount);

                const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount);
                const receipt = await tx.wait();
                const { blockNumber } = receipt;
                const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });

                const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });

                expect(tx.from).equals(rewardee)
                expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)

                await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, rewardee, amount)).to.be.revertedWith("sig already used");
            });
        });
    })

    describe("When _rewardee is equal to address(0)", async () => {
        it("Should revert", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            const rewardee = ethers.constants.AddressZero
            const amount = BigNumber.from("1")

            const sig = await createClaimRewardBadSignerSigWithNonce(setupData, signers.random, rewardee, rewardee, amount, BigNumber.from("0"));
            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, rewardee, rewardee, amount)).to.be.revertedWith("rewardee cannot be zero address");

        })
    })
})