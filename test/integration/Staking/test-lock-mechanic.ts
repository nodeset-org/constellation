import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData, Protocol, Signers } from "../integration";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator, increaseEVMTime, prepareOperatorDistributionContract } from "../../utils/utils";
import { generateDepositData, generateDepositDataForStake } from "../../rocketpool/_helpers/minipool";
import { BigNumber } from "ethers";
import { IMinipool } from "../../../typechain-types";
import { ethers } from 'hardhat';

const prepareStakeWithLockAmount = async (setupData: SetupData, lockAmount: BigNumber) => {
    const { protocol, signers } = setupData;
    const bond = ethers.utils.parseEther("8");
    const { rawSalt, pepperedSalt } = await approvedSalt(3, signers.hyperdriver.address);
    expect(await protocol.superNode.hasSufficientLiquidity(bond)).to.equal(false);
    await prepareOperatorDistributionContract(setupData, 1);
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

    let tvl = await protocol.vCWETH.totalAssets();

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

    // ensure tvl is not changed after locking
    expect(tvl).equals(await protocol.vCWETH.totalAssets());

    return config.expectedMinipoolAddress;
}

describe("Locking Mechanism", async () => {
    describe("When value is equal to lock amount", async () => {
        it("should pass", async () => {
            let setupData = await loadFixture(protocolFixture);
            let { protocol, signers } = setupData;
            await expect(protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false)).to.not.be.reverted;
            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
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
            let setupData = await loadFixture(protocolFixture);
            let { protocol, signers } = setupData;
            await expect(protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false)).to.not.be.reverted;
            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
            const realLockAmount = await protocol.superNode.lockThreshold();
            const lockAmount = ethers.utils.parseEther("1.001");
            expect(lockAmount).gt(realLockAmount);

            await expect(prepareStakeWithLockAmount(setupData, lockAmount)).to.be.revertedWith("SuperNode: must set the message value to lockThreshold")
        })
    })

    describe("When value is less than lock amount", async () => {
        it("should revert", async () => {
            let setupData = await loadFixture(protocolFixture);
            let { protocol, signers } = setupData;
            await expect(protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false)).to.not.be.reverted;
            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
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
            let setupData = await loadFixture(protocolFixture);
            let { protocol, signers } = setupData;
            await expect(protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false)).to.not.be.reverted;
            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
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

            let tvl = await protocol.vCWETH.totalAssets();

            // unlock
            const tx = await protocol.superNode.connect(signers.hyperdriver).stake(depositDataStake.depositData.signature, depositDataStake.depositDataRoot, minipool);
            const receipt = await tx.wait();
            const {blockNumber, cumulativeGasUsed, effectiveGasPrice} = receipt;
            const ethPriceOfTx = cumulativeGasUsed.mul(effectiveGasPrice);
            const initialBalance = await ethers.provider.getBalance(signers.hyperdriver.address, blockNumber - 1);
            const finalBalance = await ethers.provider.getBalance(signers.hyperdriver.address, blockNumber);

            // ensure tvl is not changed after unlocking
            expect(tvl).equals(await protocol.vCWETH.totalAssets());

            expect(finalBalance.sub(initialBalance)).equals(lockAmount.sub(ethPriceOfTx));

            lockedEth = await protocol.superNode.lockedEth(minipool);
            expect(lockedEth).to.equal(0);
        })
    })

    describe("When minipool is closed", async () => {
        it("should reclaim lock for OD", async () => {
            let setupData = await loadFixture(protocolFixture);
            let { protocol, signers } = setupData;
            await expect(protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false)).to.not.be.reverted;
            await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
            const realLockAmount = await protocol.superNode.lockThreshold();
            const lockAmount = ethers.utils.parseEther("1");
            expect(lockAmount).equals(realLockAmount);

            // this adds 8 ETH to the operator distributor contract and then immediately deposits it into the minipool
            const minipool = await prepareStakeWithLockAmount(setupData, lockAmount)

            // Assert validator count prior to closing minipool
            expect(await protocol.whitelist.getActiveValidatorCountForOperator(signers.hyperdriver.address)).to.be.equal(1);
            expect(await protocol.superNode.connect(signers.hyperdriver).getNumMinipools()).to.be.equal(1);

            // ensure lock is 1 ETH
            let lockedEth = await protocol.superNode.lockedEth(minipool);
            expect(lockedEth).equals(await protocol.superNode.lockThreshold());

            let tvl = await protocol.vCWETH.totalAssets();

            const snaBalanacePrior = await ethers.provider.getBalance(protocol.superNode.address);
            const operatorBalanacePrior = await ethers.provider.getBalance(signers.hyperdriver.address);

            const minipoolContract: IMinipool = await ethers.getContractAt("IMinipool", minipool);

            // mint rETH, which will deposit into the minipool and set it to prelaunch state
            setupData.rocketPool.rocketDepositPoolContract.connect(signers.ethWhale).deposit({value: ethers.utils.parseEther("100")})

            // Increase the time by 10 days
            const tenDays = 10*24*3600;
            let latestTimestamp = (await ethers.provider.getBlock("latest")).timestamp
            await ethers.provider.send("evm_mine", [latestTimestamp + tenDays]);

            // Dissolve and close minipool (unlock)
            await expect(minipoolContract.connect(signers.admin).dissolve()).to.not.be.reverted;
            await expect(protocol.superNode.closeDissolvedMinipool(minipool)).to.not.be.reverted;

            // ensure tvl is not changed after unlocking
            expect(tvl).equals(await protocol.vCWETH.totalAssets());

            lockedEth = await protocol.superNode.lockedEth(minipool);
            expect(lockedEth).equals(0);

            // closing a dissolved minipool should return 7 ETH from RP (8 ETH minus their 1 ETH lock)
            // and the 1 ETH locked by the Constellation NO in the SNA to the OD
            const expectedODBalance = ethers.utils.parseEther("7").add(realLockAmount);

            // lock amount should be reclaimed by OD
            expect(await ethers.provider.getBalance(protocol.operatorDistributor.address)).equals(expectedODBalance);
            expect(await ethers.provider.getBalance(protocol.superNode.address)).equals(snaBalanacePrior.sub(realLockAmount));
            expect(await ethers.provider.getBalance(signers.hyperdriver.address)).equals(operatorBalanacePrior);

            lockedEth = await protocol.superNode.lockedEth(minipool);
            expect(lockedEth).to.equal(0);
        })
    })
})