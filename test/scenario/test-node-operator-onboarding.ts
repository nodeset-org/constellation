import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { protocolFixture, SetupData } from "../test";
import { BigNumber as BN } from "ethers";
import { Protocol } from "../test";
import { Signers } from "../test";
import { RocketPool } from "../test";

export async function deployMockMinipool(signer: SignerWithAddress, rocketPool: RocketPool) {
    const mockMinipoolFactory = await ethers.getContractFactory("MockMinipool");
    const mockMinipool = await mockMinipoolFactory.deploy();
    await mockMinipool.deployed();

    await mockMinipool.initialise(
        signer.address,
    )

    return mockMinipool;
}


describe("Node Operator Onboarding", function () {

    let setupData: SetupData;
    let protocol: Protocol;
    let signers: Signers;
    let rocketPool: RocketPool;

    before(async function () {
        setupData = await protocolFixture();
        protocol = setupData.protocol;
        signers = setupData.signers;
        rocketPool = setupData.rocketPool;
    });

    it("node operator creates minipool", async function () {
        const bondValue = ethers.utils.parseEther("8");
        const mockValidatorPubkey = ethers.utils.randomBytes(128);
        const mockValidatorSignature = ethers.utils.randomBytes(96);
        const mockDepositDataRoot = ethers.utils.randomBytes(32);
        const mockMinipool = await deployMockMinipool(signers.hyperdriver, rocketPool);

        await mockMinipool.preDeposit(
            bondValue,
            mockValidatorPubkey,
            mockValidatorSignature,
            mockDepositDataRoot,
            {
                value: bondValue
            }
        )


    });

});