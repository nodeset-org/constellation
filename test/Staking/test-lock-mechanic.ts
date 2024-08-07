import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from ".././test";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator, prepareOperatorDistributionContract } from "../utils/utils";
import { generateDepositData } from "../rocketpool/_helpers/minipool";
import { BigNumber } from "ethers";

const stakeWithLockAmount = async (setupData: SetupData, lockAmount: BigNumber) => {
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
    const { sig, timestamp } = await approveHasSignedExitMessageSig(setupData, '0x' + config.expectedMinipoolAddress, config.salt);
    await protocol.superNode.connect(signers.hyperdriver).createMinipool(
        {
            validatorPubkey: config.validatorPubkey,
            validatorSignature: config.validatorSignature,
            depositDataRoot: config.depositDataRoot,
            salt: rawSalt,
            expectedMinipoolAddress: config.expectedMinipoolAddress,
            sigGenesisTime: timestamp,
            sig: sig,
        },
        {
            value: lockAmount
        });

    return config.expectedMinipoolAddress;
}

describe("Locking Mechanism", async () => {



    describe("When value is more than lock amount", async () => {

        it("should pass", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers } = setupData;

            const minipool = await stakeWithLockAmount(setupData, ethers.utils.parseEther("1"))

            const lockedEth = await protocol.superNode.lockedEth(minipool);
            expect(lockedEth).to.equal(ethers.utils.parseEther("1"));
            const totalEthLocked = await protocol.superNode.totalEthLocked();
            expect(totalEthLocked).to.equal(ethers.utils.parseEther("1"));
        })
    })

    describe("When value is equal to lock amount", async () => {

    })

    describe("When value is less than lock amount", async () => {

    })

})

describe("Unlocking Mechanism", async () => {

    describe("When user locked more than locked amount", async () => {

    })

    describe("When user locked equal to lock amount", async () => {

    })

})