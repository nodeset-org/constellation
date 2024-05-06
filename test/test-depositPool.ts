import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";
import { assertAddOperator, increaseEVMTime, prepareOperatorDistributionContract, registerNewValidator } from "./utils/utils";
import { parseRewardsMap } from "./utils/merkleClaim";
import { submitRewards } from "./rocketpool/rewards/scenario-submit-rewards";

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

        it("success - protocol stakes rpl for random node", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 1);
            const [validator] = await registerNewValidator(setupData, [signers.random]);

            const amountStaked = ethers.utils.parseUnits("1000", await rp.rplContract.decimals());
            await rp.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, amountStaked);

            const initialStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await protocol.depositPool.connect(signers.protocolSigner).stakeRPLFor(validator.address, amountStaked)
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

        it("success - protocol unstakes rpl for random node", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 1);
            const [validator] = await registerNewValidator(setupData, [signers.random]);

            const amountStaked = ethers.utils.parseUnits("1000", await rp.rplContract.decimals());
            await rp.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, amountStaked);

            const initialStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await protocol.depositPool.connect(signers.protocolSigner).stakeRPLFor(validator.address, amountStaked)
            const finalStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);

            expect(finalStake.sub(initialStake)).equals(amountStaked);

            await increaseEVMTime(60 * 60 * 24 * 7 * 32);
            console.log("acoutal stake", await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address))
            console.log("udner collat thresh old", await rp.rocketNodeStakingContract.getNodeMaximumRPLStake(validator.address))

            const amountUnstaked = ethers.utils.parseUnits("70", await rp.rplContract.decimals());
            const initialStake2 = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await protocol.depositPool.connect(signers.protocolSigner).unstakeRpl(validator.address, amountUnstaked)
            const finalStake2 = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);

            expect(initialStake2.sub(finalStake2)).equals(amountUnstaked);
        })

        it("fail - non-admin/protocol unstakes rpl for random node", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 1);
            const [validator] = await registerNewValidator(setupData, [signers.random]);

            const amountStaked = ethers.utils.parseUnits("1000", await rp.rplContract.decimals());
            await rp.rplContract.connect(signers.rplWhale).transfer(protocol.depositPool.address, amountStaked);

            const initialStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await protocol.depositPool.connect(signers.protocolSigner).stakeRPLFor(validator.address, amountStaked)
            const finalStake = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);

            expect(finalStake.sub(initialStake)).equals(amountStaked);

            await increaseEVMTime(60 * 60 * 24 * 7 * 32);
            console.log("acoutal stake", await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address))
            console.log("udner collat thresh old", await rp.rocketNodeStakingContract.getNodeMaximumRPLStake(validator.address))

            const amountUnstaked = ethers.utils.parseUnits("70", await rp.rplContract.decimals());
            const initialStake2 = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);
            await expect(protocol.depositPool.unstakeRpl(validator.address, amountUnstaked)).to.be.revertedWith("Can only be called by Protocol or Admin!")
            const finalStake2 = await rp.rocketNodeStakingContract.getNodeRPLStake(validator.address);

            expect(initialStake2.sub(finalStake2)).equals(0);
        })
    })

    describe("merkleClaim", () => {

        interface Claims {
            [address: string]: any;
        }


        it("run proof", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 2);
            const [validator0, validator1] = await registerNewValidator(setupData, [signers.random, signers.random2]);

            // Submit rewards snapshot
            const rewards = [
                {
                    address: validator0.address,
                    network: 0,
                    trustedNodeRPL: ethers.utils.parseEther("0"),
                    nodeRPL: ethers.utils.parseEther("1"),
                    nodeETH: ethers.utils.parseEther("0")
                },
                {
                    address: validator1.address,
                    network: 0,
                    trustedNodeRPL: ethers.utils.parseEther("0"),
                    nodeRPL: ethers.utils.parseEther("2"),
                    nodeETH: ethers.utils.parseEther("0")
                }
            ]

            let treeData = parseRewardsMap(rewards);
            let proof = (treeData.proof.claims as Claims)[`${validator0.address}`];
            let amountsRPL = [proof.amountRPL];
            let amountsETH = [proof.amountETH];
            let proofs = [proof.proof];

            console.log(treeData)


        })

    })
});

