import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";
import { assertAddOperator } from "../utils/utils";

describe("totalAssets() bug", function () {

    it("burns your rpl against your will", async () => {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers, rocketPool } = setupData;

        const totalKey = ethers.utils.solidityKeccak256(
            ['string'],
            ['rpl.staked.total.amount']
        );

        await rocketPool.rockStorageContract.setUint(totalKey, ethers.utils.parseEther("5000000"));
        const totalStaked = await rocketPool.rockStorageContract.getUint(totalKey);
        expect(await rocketPool.rocketNodeStakingContract.getTotalRPLStake()).equals(totalStaked)

        const depositAmount = ethers.utils.parseEther("100");

        const previewRedeem = await protocol.vCRPL.previewDeposit(depositAmount);

        console.log("previewRedeem", previewRedeem)

        await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.random.address, depositAmount);
        await assertAddOperator(setupData, signers.random);

        await rocketPool.rplContract.connect(signers.random).approve(protocol.vCRPL.address, depositAmount);
        await protocol.vCRPL.connect(signers.random).deposit(depositAmount, signers.random.address);
        console.log(await protocol.vCRPL.balanceOf(signers.random.address));

        const expectedRplInSystem = depositAmount;
        const actualRplInSystem = await protocol.vCRPL.totalAssets();
        expect(expectedRplInSystem).equals(actualRplInSystem)

    })

})