import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from ".././test";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator, increaseEVMTime, prepareOperatorDistributionContract } from "../utils/utils";
import { generateDepositData, generateDepositDataForStake } from "../rocketpool/_helpers/minipool";
import { BigNumber } from "ethers";

const prepareStakeWithLockAmount = async (setupData: SetupData, lockAmount: BigNumber) => {
    const { protocol, signers } = setupData;
    const bond = ethers.utils.parseEther("8");
    const { rawSalt, pepperedSalt } = await approvedSalt(3, signers.hyperdriver.address);
    expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
    await prepareOperatorDistributionContract(setupData, 2);
    expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(true);
    await assertAddOperator(setupData, signers.hyperdriver);
    const depositData = await generateDepositData(setupData.protocol.superNode.address, pepperedSalt);
    const config = {
        timezoneLocation: 'Australia/Brisbane',
        bondAmount: bond,
        minimumNodeFee: 0,
        validatorPubkey: depositData.depositData.pubkey,
        validatorSignature: depositData.depositData.signature,
        depositDataRoot: depositData.depositDataRoot,
        salt: pepperedSalt,
        expectedMinipoolAddress: depositData.minipoolAddress
    };
    const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, signers.hyperdriver.address, '0x' + config.expectedMinipoolAddress, config.salt);
    await protocol.superNode.connect(signers.hyperdriver).createMinipool(
        {
            validatorPubkey: config.validatorPubkey,
            validatorSignature: config.validatorSignature,
            depositDataRoot: config.depositDataRoot,
            salt: rawSalt,
            expectedMinipoolAddress: config.expectedMinipoolAddress,
            sig: sig,
        },
        {
            value: lockAmount
        });

    return config.expectedMinipoolAddress;
}

describe("Locking Mechanism", async () => {
    describe("When value is equal to lock amount", async () => {

        it("should pass", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const realLockAmount = await protocol.superNode.lockThreshold();
            const lockAmount = ethers.utils.parseEther("1");
            expect(lockAmount).equals(realLockAmount);

            const minipool = await prepareStakeWithLockAmount(setupData, lockAmount)

            const lockedEth = await protocol.superNode.lockedEth(minipool);
            expect(lockedEth).to.equal(lockAmount);
        })
    })

    describe("When value is more than lock amount", async () => {
        it("should revert", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const realLockAmount = await protocol.superNode.lockThreshold();
            const lockAmount = ethers.utils.parseEther("1.001");
            expect(lockAmount).gt(realLockAmount);

            await expect(prepareStakeWithLockAmount(setupData, lockAmount)).to.be.revertedWith("SuperNode: must set the message value to lockThreshold")
        })
    })

    describe("When value is less than lock amount", async () => {
        it("should revert", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const realLockAmount = await protocol.superNode.lockThreshold();
            const lockAmount = ethers.utils.parseEther(".9");
            expect(lockAmount).lt(realLockAmount);

            await expect(prepareStakeWithLockAmount(setupData, lockAmount)).to.be.revertedWith("SuperNode: must set the message value to lockThreshold")
        })
    })
})

describe("Unlocking Mechanism", async () => {
    describe("When user locked equal to lock amount", async () => {
        it("should pass", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            // lock 1 eth
            const realLockAmount = await protocol.superNode.lockThreshold();
            const lockAmount = ethers.utils.parseEther("1");
            expect(lockAmount).equals(realLockAmount);
            const minipool = await prepareStakeWithLockAmount(setupData, lockAmount)
            let lockedEth = await protocol.superNode.lockedEth(minipool);
            expect(lockedEth).to.equal(lockAmount);

            // prepare to unlock
            await setupData.rocketPool.rocketDepositPoolContract.deposit({
                value: ethers.utils.parseEther("32")
            })
            await setupData.rocketPool.rocketDepositPoolContract.assignDeposits();
            await increaseEVMTime(60 * 60 * 24 * 7 * 32);
            const depositDataStake = await generateDepositDataForStake(minipool);

            // unlock
            const tx = await protocol.superNode.connect(signers.hyperdriver).stake(depositDataStake.depositData.signature, depositDataStake.depositDataRoot, minipool);
            const receipt = await tx.wait();
            const {blockNumber, cumulativeGasUsed, effectiveGasPrice} = receipt;
            const ethPriceOfTx = cumulativeGasUsed.mul(effectiveGasPrice);
            const initialBalance = await ethers.provider.getBalance(signers.hyperdriver.address, blockNumber - 1);
            const finalBalance = await ethers.provider.getBalance(signers.hyperdriver.address, blockNumber);

            expect(finalBalance.sub(initialBalance)).equals(lockAmount.sub(ethPriceOfTx));

            lockedEth = await protocol.superNode.lockedEth(minipool);
            expect(lockedEth).to.equal(0);
        })
    })
})