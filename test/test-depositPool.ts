import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";
import { assertAddOperator, increaseEVMTime, prepareOperatorDistributionContract, registerNewValidator } from "./utils/utils";

describe(`FundRouter`, () => {

    describe('stakeRPLFor', () => {
        it("success - admin stakes rpl for random node", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 1);
            const [validator] = await registerNewValidator(setupData, [signers.random]);

            const amountStaked = ethers.utils.parseUnits("1000", await rp.rplContract.decimals());
            await rp.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, amountStaked);

            const initialStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await protocol.depositPool.connect(signers.admin).stakeRPLFor(validator.address, amountStaked)
            const finalStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);

            expect(finalStake.sub(initialStake)).equals(amountStaked);

        })

        it("fail - non-admin/protocol stakes rpl for random node", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 1);
            const [validator] = await registerNewValidator(setupData, [signers.random]);

            const amountStaked = ethers.utils.parseUnits("1000", await rp.rplContract.decimals());
            await rp.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, amountStaked);

            const initialStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await expect(protocol.depositPool.connect(signers.deployer).stakeRPLFor(validator.address, amountStaked)).to.be.revertedWith("Can only be called by Protocol or Admin!")
            const finalStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);

            expect(finalStake.sub(initialStake)).equals(0);

        })
    })

    describe('unstakeRpl', () => {
        it("success - admin unstakes rpl for random node", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 1);
            const [validator] = await registerNewValidator(setupData, [signers.random]);

            const amountStaked = ethers.utils.parseUnits("1000", await rp.rplContract.decimals());
            await rp.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, amountStaked);

            const initialStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await protocol.depositPool.connect(signers.admin).stakeRPLFor(validator.address, amountStaked)
            const finalStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);

            expect(finalStake.sub(initialStake)).equals(amountStaked);

            await increaseEVMTime(60 * 60 * 24 * 7 * 32);
            console.log("acoutal stake", await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address))
            console.log("udner collat thresh old", await rp.rocketNodeStakingContract.getNodeMaximumRPLStake(validator.address))

            const amountUnstaked = ethers.utils.parseUnits("70", await rp.rplContract.decimals());
            const initialStake2 = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await protocol.depositPool.connect(signers.admin).unstakeRpl(validator.address, amountUnstaked)
            const finalStake2 = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);

            expect(initialStake2.sub(finalStake2)).equals(amountUnstaked);
        })
    })
});

