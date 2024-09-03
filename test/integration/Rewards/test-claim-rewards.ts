import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../integration";
import { assertAddOperator, createClaimRewardBadChainIdSigWithNonce, createClaimRewardBadEncodedSigWithNonce, createClaimRewardBadSignerSigWithNonce, createClaimRewardBadTargetSigWithNonce, createClaimRewardSig, createClaimRewardSigWithNonce, createMockDid, deployMockToken, increaseEVMTime } from "../utils/utils";
import { BigNumber } from "ethers";
import { directoryAbi } from "../..";

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

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount);

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

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount);

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

                            describe("When caller is requesting rewards for several rewardees", async () => {
                                it("Shoud pass - nonces should only update the nonce for the DID not for rewardees", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    const rewardee2 = signers.random2.address;
                                    const rewardee3 = signers.random3.address;
                                    const rewardee4 = signers.random4.address;

                                    await signers.ethWhale.sendTransaction({
                                        to: protocol.yieldDistributor.address,
                                        value: amount.mul(10)
                                    })

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount);
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

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(1);

                                    const sig2 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee2, amount);
                                    await protocol.yieldDistributor.claimRewards(sig2, ethers.constants.AddressZero, did, rewardee2, amount);

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(2);

                                    const sig3 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee3, amount);
                                    await protocol.yieldDistributor.claimRewards(sig3, ethers.constants.AddressZero, did, rewardee3, amount);

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(3);

                                    const sig4 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee4, amount);
                                    await protocol.yieldDistributor.claimRewards(sig4, ethers.constants.AddressZero, did, rewardee4, amount);

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(4);
                                })
                            })

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

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, did, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    expect(await protocol.yieldDistributor.nonces(did)).equals(0);
                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount.div(2));
                                    expect(await protocol.yieldDistributor.nonces(did)).equals(1);

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

                                    const sig2 = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, did, rewardee, amount, ethers.BigNumber.from(0));
                                    await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig2, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");
                                    expect(await protocol.yieldDistributor.nonces(did)).equals(1);

                                })
                            })

                            describe("When caller has requested several sigs from the server before calling claim", async () => {

                                describe("When all params are the same", async () => {
                                    it("Should revert - several times for sig reuse", async () => {
                                        const setupData = await loadFixture(protocolFixture);
                                        const { protocol, signers, rocketPool } = setupData;

                                        const amount = ethers.utils.parseEther("1");
                                        const rewardee = signers.random.address;
                                        await assertAddOperator(setupData, signers.random);

                                        await signers.ethWhale.sendTransaction({
                                            to: protocol.yieldDistributor.address,
                                            value: amount
                                        })

                                        const did = createMockDid(rewardee);
                                        const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);
                                        const sig1 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);
                                        const sig2 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);
                                        const sig3 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);
                                        const sig4 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);
                                        const sig5 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);
                                        const sig6 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);

                                        expect(await protocol.yieldDistributor.nonces(did)).equals(0)

                                        const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount);
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

                                        // caches all the sigs, waits a year, to then try and drain contract
                                        await increaseEVMTime(60 * 60 * 24 * 365);

                                        // this nonce increases should invalidate all existing sigs
                                        expect(await protocol.yieldDistributor.nonces(did)).equals(1)

                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig1, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig2, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig3, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig4, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig5, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig6, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")

                                    })
                                })

                                describe("When all params vary such that we aren't reusing sigs", async () => {
                                    it("Should revert - several times from nonce update", async () => {
                                        const setupData = await loadFixture(protocolFixture);
                                        const { protocol, signers, rocketPool } = setupData;

                                        const amount = ethers.utils.parseEther("1");
                                        const rewardee = signers.random.address;
                                        await assertAddOperator(setupData, signers.random);

                                        await signers.ethWhale.sendTransaction({
                                            to: protocol.yieldDistributor.address,
                                            value: amount.mul(2)
                                        })

                                        const did = createMockDid(rewardee);
                                        const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);
                                        const sig1 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount.add(1));
                                        const sig2 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount.add(2));
                                        const sig3 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount.add(3));
                                        const sig4 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount.add(4));
                                        const sig5 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount.add(5));
                                        const sig6 = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount.add(6));

                                        expect(await protocol.yieldDistributor.nonces(did)).equals(0)

                                        const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount);
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

                                        // caches all the sigs, waits a year, to then try and drain contract
                                        await increaseEVMTime(60 * 60 * 24 * 365);

                                        // this nonce increases should invalidate all existing sigs
                                        expect(await protocol.yieldDistributor.nonces(did)).equals(1)

                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig1, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig2, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig3, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig4, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig5, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig6, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")

                                    })
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

                                    const did = createMockDid(rewardee);
                                    const did2 = createMockDid(rewardee2);

                                    const sig = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, did, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    const sig2 = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, did2, rewardee2, amount.div(2), ethers.BigNumber.from(0));

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(0);
                                    expect(await protocol.yieldDistributor.nonces(did2)).equals(0);

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount.div(2));
                                    const tx2 = await protocol.yieldDistributor.connect(signers.random2).claimRewards(sig2, ethers.constants.AddressZero, did2, rewardee2, amount.div(2));

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(1);
                                    expect(await protocol.yieldDistributor.nonces(did2)).equals(1);

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

                            describe("When 1 users needs their sig invalidated", async () => {
                                it("Should pass only for valid user", async () => {
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

                                    const did = createMockDid(rewardee);
                                    const did2 = createMockDid(rewardee2);

                                    const sig = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, did, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    const sig2 = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, did2, rewardee2, amount.div(2), ethers.BigNumber.from(0));

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(0);
                                    expect(await protocol.yieldDistributor.nonces(did2)).equals(0);
                                    await protocol.yieldDistributor.connect(signers.nodesetAdmin).invalidateSingleOustandingSig(did);
                                    expect(await protocol.yieldDistributor.nonces(did)).equals(1);

                                    await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount.div(2))).to.be.revertedWith("bad signer role, params, or encoding");
                                    await expect(protocol.yieldDistributor.connect(signers.random2).claimRewards(sig2, ethers.constants.AddressZero, did2, rewardee2, amount.div(2))).to.not.be.reverted;

                                    expect(await protocol.yieldDistributor.nonces(did2)).equals(1);

                                })
                            })

                            describe("When users are trying to claim a nonce 0 that became invalidated", async () => {
                                it("Should revert", async () => {
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

                                    const did = createMockDid(rewardee);
                                    const did2 = createMockDid(rewardee2);

                                    const sig = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, did, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    const sig2 = await createClaimRewardSigWithNonce(setupData, ethers.constants.AddressZero, did2, rewardee2, amount.div(2), ethers.BigNumber.from(0));

                                    expect(await protocol.yieldDistributor.nonce()).equals(0);
                                    await protocol.yieldDistributor.connect(signers.nodesetAdmin).invalidateAllOutstandingSigs();
                                    expect(await protocol.yieldDistributor.nonce()).equals(1);

                                    await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount.div(2))).to.be.revertedWith("bad signer role, params, or encoding");
                                    await expect(protocol.yieldDistributor.connect(signers.random2).claimRewards(sig2, ethers.constants.AddressZero, did2, rewardee2, amount.div(2))).to.be.revertedWith("bad signer role, params, or encoding");
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

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount);

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

                            const did = createMockDid(rewardee);
                            const sig = await createClaimRewardSig(setupData, ethers.constants.AddressZero, did, rewardee, amount);

                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, ethers.constants.AddressZero, did, rewardee, amount)).to.be.revertedWith("_rewardee failed to claim")
                        })
                    })
                })

                describe("When _token is not ETH (ERC20)", async () => {
                    describe("When contract does have enough token to send to _rewardee", async () => {
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

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount);
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

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, token.address, did, rewardee, amount);
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
                            describe("When caller is requesting rewards for several rewardees", async () => {
                                it("Shoud pass - nonces should only update for the DID not for rewardees", async () => {
                                    const setupData = await loadFixture(protocolFixture);
                                    const { protocol, signers, rocketPool } = setupData;

                                    const amount = ethers.utils.parseEther("1");
                                    const rewardee = signers.random.address;
                                    const rewardee2 = signers.random2.address;
                                    const rewardee3 = signers.random3.address;
                                    const rewardee4 = signers.random4.address;

                                    const token = await deployMockToken(ethers.utils.parseEther("1000"));
                                    await token.transfer(protocol.yieldDistributor.address, amount.mul(10));

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, token.address, did, rewardee, amount);
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

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(1);

                                    const sig2 = await createClaimRewardSig(setupData, token.address, did, rewardee2, amount);
                                    await protocol.yieldDistributor.claimRewards(sig2, token.address, did, rewardee2, amount);

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(2);

                                    const sig3 = await createClaimRewardSig(setupData, token.address, did, rewardee3, amount);
                                    await protocol.yieldDistributor.claimRewards(sig3, token.address, did, rewardee3, amount);

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(3);

                                    const sig4 = await createClaimRewardSig(setupData, token.address, did, rewardee4, amount);
                                    await protocol.yieldDistributor.claimRewards(sig4, token.address, did, rewardee4, amount);

                                    expect(await protocol.yieldDistributor.nonces(did)).equals(4);
                                })
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

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount);
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

                                    const sig2 = await createClaimRewardSigWithNonce(setupData, token.address, did, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig2, ethers.constants.AddressZero, did, rewardee, amount.div(2))).to.be.revertedWith("bad signer role, params, or encoding");

                                });
                            });

                            describe("When caller has requested several sigs from the server before calling claim", async () => {

                                describe("When all params are the same", async () => {
                                    it("Should revert - several times for sig reuse", async () => {
                                        const setupData = await loadFixture(protocolFixture);
                                        const { protocol, signers, rocketPool } = setupData;

                                        const amount = ethers.utils.parseEther("1");
                                        const rewardee = signers.random.address;
                                        await assertAddOperator(setupData, signers.random);

                                        const token = await deployMockToken(ethers.utils.parseEther("1000"));
                                        await token.transfer(protocol.yieldDistributor.address, amount);

                                        const did = createMockDid(rewardee);
                                        const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                                        const sig1 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                                        const sig2 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                                        const sig3 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                                        const sig4 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                                        const sig5 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                                        const sig6 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);

                                        expect(await protocol.yieldDistributor.nonces(did)).equals(0)

                                        const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount);
                                        const receipt = await tx.wait();
                                        const { blockNumber } = receipt;
                                        const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                                        const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });
                                        const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                                        const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });
                                        expect(tx.from).equals(rewardee)
                                        expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                                        expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)

                                        // caches all the sigs, waits a year, to then try and drain contract
                                        await increaseEVMTime(60 * 60 * 24 * 365);

                                        // this nonce increases should invalidate all existing sigs
                                        expect(await protocol.yieldDistributor.nonces(did)).equals(1)

                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig1, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig2, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig3, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig4, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig5, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig6, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")

                                    })
                                })

                                describe("When all params vary such that we aren't reusing sigs", async () => {
                                    it("Should revert - several times from nonce update", async () => {
                                        const setupData = await loadFixture(protocolFixture);
                                        const { protocol, signers, rocketPool } = setupData;

                                        const amount = ethers.utils.parseEther("1");
                                        const rewardee = signers.random.address;
                                        await assertAddOperator(setupData, signers.random);

                                        const token = await deployMockToken(ethers.utils.parseEther("1000"));
                                        await token.transfer(protocol.yieldDistributor.address, amount);

                                        const did = createMockDid(rewardee);
                                        const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                                        const sig1 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount.add(1));
                                        const sig2 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount.add(2));
                                        const sig3 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount.add(3));
                                        const sig4 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount.add(4));
                                        const sig5 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount.add(5));
                                        const sig6 = await createClaimRewardSig(setupData, token.address, did, rewardee, amount.add(6));

                                        expect(await protocol.yieldDistributor.nonces(did)).equals(0)

                                        const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount);
                                        const receipt = await tx.wait();
                                        const { blockNumber } = receipt;
                                        const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                                        const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });
                                        const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                                        const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });
                                        expect(tx.from).equals(rewardee)
                                        expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                                        expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)

                                        // caches all the sigs, waits a year, to then try and drain contract
                                        await increaseEVMTime(60 * 60 * 24 * 365);

                                        // this nonce increases should invalidate all existing sigs
                                        expect(await protocol.yieldDistributor.nonces(did)).equals(1)

                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig1, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig2, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig3, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig4, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig5, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")
                                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig6, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding")

                                    })
                                })
                            })
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

                                    const did = createMockDid(rewardee);
                                    const did2 = createMockDid(rewardee2);

                                    const sig = await createClaimRewardSigWithNonce(setupData, token.address, did, rewardee, amount.div(2), ethers.BigNumber.from(0));
                                    const sig2 = await createClaimRewardSigWithNonce(setupData, token.address, did2, rewardee2, amount.div(2), ethers.BigNumber.from(0));

                                    const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount.div(2));
                                    const tx2 = await protocol.yieldDistributor.connect(signers.random2).claimRewards(sig2, token.address, did2, rewardee2, amount.div(2));

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

                                    const did = createMockDid(rewardee);
                                    const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);

                                    const tx = await protocol.yieldDistributor.claimRewards(sig, token.address, did, rewardee, amount);
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

                            const did = createMockDid(rewardee);
                            const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);

                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
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

                            const did = createMockDid(rewardee);
                            const sig = await createClaimRewardBadEncodedSigWithNonce(setupData, token.address, did, rewardee, amount, BigNumber.from("0"));

                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

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

                            const did = createMockDid(rewardee);
                            const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token2.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

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

                            const did = createMockDid(rewardee);
                            const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount.mul(10))).to.be.revertedWith("bad signer role, params, or encoding");

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

                            const did = createMockDid(rewardee);
                            const sig = await createClaimRewardSigWithNonce(setupData, token.address, did, rewardee, amount, BigNumber.from("69"));
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

                        })
                    })
                    describe("When did is bad", async () => {

                        it("Should revert", async () => {

                            const setupData = await loadFixture(protocolFixture);
                            const { protocol, signers, rocketPool } = setupData;

                            const amount = ethers.utils.parseEther("1");
                            const rewardee = signers.random.address;
                            await assertAddOperator(setupData, signers.random);

                            const token = await deployMockToken(ethers.utils.parseEther("1000"));
                            await token.transfer(protocol.yieldDistributor.address, amount);

                            const did = createMockDid(rewardee);
                            const invalidDid = createMockDid(signers.random5.address);
                            const sig = await createClaimRewardSigWithNonce(setupData, token.address, did, rewardee, amount, BigNumber.from("0"));
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, invalidDid, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");
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

                            const did = createMockDid(rewardee);
                            const sig = await createClaimRewardBadTargetSigWithNonce(setupData, token.address, did, rewardee, amount, BigNumber.from("0"));
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

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

                            const did = createMockDid(rewardee);
                            const sig = await createClaimRewardBadChainIdSigWithNonce(setupData, token.address, did, rewardee, amount, BigNumber.from("0"));
                            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

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

                        const did = createMockDid(rewardee);
                        const sig = await createClaimRewardBadSignerSigWithNonce(setupData, signers.random, token.address, did, rewardee, amount, BigNumber.from("0"));
                        await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");

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

                const did = createMockDid(rewardee);
                const sig = await createClaimRewardSig(setupData, token.address, did, rewardee, amount);

                const tx = await protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount);
                const receipt = await tx.wait();
                const { blockNumber } = receipt;
                const initialBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber - 1 });
                const finalBalanceRewardee = await token.balanceOf(rewardee, { blockTag: blockNumber });

                const initalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber - 1 });
                const finalBalanceYd = await token.balanceOf(protocol.yieldDistributor.address, { blockTag: blockNumber });

                expect(tx.from).equals(rewardee)
                expect(finalBalanceYd.sub(initalBalanceYd)).equals(amount.mul(-1));
                expect(finalBalanceRewardee.sub(initialBalanceRewardee)).equals(amount)

                await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, token.address, did, rewardee, amount)).to.be.revertedWith("bad signer role, params, or encoding");
            });
        });
    })

    describe("When _rewardee is equal to address(0)", async () => {
        it("Should revert", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            const rewardee = ethers.constants.AddressZero
            const amount = BigNumber.from("1")

            const did = createMockDid(rewardee);
            const sig = await createClaimRewardBadSignerSigWithNonce(setupData, signers.random, rewardee, did, rewardee, amount, BigNumber.from("0"));
            await expect(protocol.yieldDistributor.connect(signers.random).claimRewards(sig, rewardee, did, rewardee, amount)).to.be.revertedWith("rewardee cannot be zero address");

        })
    })
})