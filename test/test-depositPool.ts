import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { protocolFixture, SetupData } from "./test";
import { BigNumber as BN } from "ethers";
import { assertAddOperator, increaseEVMTime, prepareOperatorDistributionContract, registerNewValidator, createMerkleSig } from "./utils/utils";
import { parseRewardsMap } from "./utils/merkleClaim";
import { submitRewards } from "./rocketpool/rewards/scenario-submit-rewards";

describe(`AssetRouter`, () => {

    describe('stakeRPLFor', () => {

        it("success - protocol stakes rpl for random node", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 2);
            await registerNewValidator(setupData, [signers.random]);

            const amountStaked = ethers.utils.parseUnits("1000", await rp.rplContract.decimals());
            await rp.rplContract.connect(signers.rplWhale).transfer(protocol.operatorDistributor.address, amountStaked);

            const initialStake = await rp.rocketNodeStakingContract.getNodeRPLStake(protocol.superNode.address);
            await protocol.operatorDistributor.connect(signers.protocolSigner).stakeRpl(amountStaked)
            const finalStake = await rp.rocketNodeStakingContract.getNodeRPLStake(protocol.superNode.address);

            expect(finalStake.sub(initialStake)).equals(amountStaked);

        })
    })

    describe('unstakeRpl', () => {

        it("success - protocol unstakes rpl for random node", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;

            await prepareOperatorDistributionContract(setupData, 2);
            await registerNewValidator(setupData, [signers.random]);

            const amountStaked = ethers.utils.parseUnits("1000", await rp.rplContract.decimals());
            await rp.rplContract.connect(signers.rplWhale).transfer(protocol.operatorDistributor.address, amountStaked);

            const initialStake = await rp.rocketNodeStakingContract.getNodeRPLStake(protocol.superNode.address);
            await protocol.operatorDistributor.connect(signers.protocolSigner).stakeRpl(amountStaked)
            const finalStake = await rp.rocketNodeStakingContract.getNodeRPLStake(protocol.superNode.address);

            expect(finalStake.sub(initialStake)).equals(amountStaked);

            await increaseEVMTime(60 * 60 * 24 * 7 * 32);
            console.log("acoutal stake", await rp.rocketNodeStakingContract.getNodeRPLStake(protocol.superNode.address))
            console.log("udner collat thresh old", await rp.rocketNodeStakingContract.getNodeMaximumRPLStake(protocol.superNode.address))

            const amountUnstaked = ethers.utils.parseUnits("70", await rp.rplContract.decimals());
            const initialStake2 = await rp.rocketNodeStakingContract.getNodeRPLStake(protocol.superNode.address);
            await protocol.operatorDistributor.connect(signers.protocolSigner).unstakeRpl(amountUnstaked)
            const finalStake2 = await rp.rocketNodeStakingContract.getNodeRPLStake(protocol.superNode.address);

            expect(initialStake2.sub(finalStake2)).equals(amountUnstaked);
        })
    })

    describe("merkleClaim", () => {
        interface Claims {
            [address: string]: any;
        }
    
        it.skip("TODO: old proof test needs to be adjusted to SuperNode", async () => {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool: rp } = setupData;
    
            // Set up the distribution contract and register new validators
            await prepareOperatorDistributionContract(setupData, 2);
            await registerNewValidator(setupData, [signers.random, signers.random2]);
    
            // Rewards data setup
            const rewards = [
                {
                    address: protocol.superNode.address,
                    network: 0,
                    trustedNodeRPL: ethers.utils.parseEther("0"),
                    nodeRPL: ethers.utils.parseEther("1"),
                    nodeETH: ethers.utils.parseEther("0")
                }
            ];
    
            // Generate the Merkle Tree and claims data
            let treeData = await parseRewardsMap(rewards);
            let proof0 = (treeData.proof.claims as Claims)[`${protocol.superNode.address}`];
    
            // Extract proofs and amounts for each validator
            let amountsRPL0 = [proof0.amountRPL];
            let amountsETH0 = [proof0.amountETH];
            let proofs0 = [proof0.proof];
    
            // Aggregate network rewards
            const trustedNodeRPL = [];
            const nodeRPL = [];
            const nodeETH = [];
    
            let maxNetwork = rewards.reduce((a, b) => Math.max(a, b.network), 0);
    
            for (let i = 0; i <= maxNetwork; i++) {
                trustedNodeRPL[i] = ethers.BigNumber.from('0');
                nodeRPL[i] = ethers.BigNumber.from('0');
                nodeETH[i] = ethers.BigNumber.from('0');
            }
    
            for (let i = 0; i < rewards.length; i++) {
                trustedNodeRPL[rewards[i].network] = trustedNodeRPL[rewards[i].network].add(rewards[i].trustedNodeRPL);
                nodeRPL[rewards[i].network] = nodeRPL[rewards[i].network].add(rewards[i].nodeRPL);
                nodeETH[rewards[i].network] = nodeETH[rewards[i].network].add(rewards[i].nodeETH);
            }
    
            // Convert to string for web3 compatibility
            for (let i = 0; i <= maxNetwork; i++) {
                trustedNodeRPL[i] = trustedNodeRPL[i].toString();
                nodeRPL[i] = nodeRPL[i].toString();
                nodeETH[i] = nodeETH[i].toString();
            }
    
            // Prepare submission object
            const submission = {
                rewardIndex: 0,
                executionBlock: '0',
                consensusBlock: '0',
                merkleRoot: treeData.proof.merkleRoot,
                merkleTreeCID: '0',
                intervalsPassed: '1',
                treasuryRPL: '0',
                trustedNodeRPL: trustedNodeRPL,
                nodeRPL: nodeRPL,
                nodeETH: nodeETH,
                userETH: '0'
            };
    
            // Add deployer as a trusted node before submitting the snapshot
            await rp.rocketDaoNodeTrustedActions.memberQuickAdd(signers.deployer.address);
    
            // Submit the rewards snapshot
            await rp.rocketRewardsPool.submitRewardSnapshot(submission);
    
            // Perform the Merkle Claim for each validator
            await protocol.superNode.merkleClaim(
                [0],
                amountsRPL0,
                amountsETH0,
                proofs0,
                await createMerkleSig(setupData, 
                    await setupData.protocol.vCWETH.treasuryFee(), 
                    await setupData.protocol.vCWETH.nodeOperatorFee(), 
                    await setupData.protocol.vCRPL.treasuryFee() 
                )
            );
    
        });
    });
    
    
        
});

