import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";
import { countProxyCreatedEvents, getNextContractAddress, getNextFactoryContractAddress, predictDeploymentAddress, prepareOperatorDistributionContract, registerNewValidator } from "./utils/utils";
import { generateDepositData } from "./rocketpool/_helpers/minipool";

describe("Validator Account Factory", function () {

    it("test initialize", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        await prepareOperatorDistributionContract(setupData, 2);
        const nodeAccounts = await registerNewValidator(setupData, [signers.random, signers.random2]);

        
    });

    it("test upgrade", async function() {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;
        
        await prepareOperatorDistributionContract(setupData, 2);
        const nodeAccounts = await registerNewValidator(setupData, [signers.random, signers.random2]);
        
        const vaf = protocol.NodeAccountFactory;
        const oldImpl = vaf.implementationAddress();

        const V2 = await ethers.getContractFactory("MockNodeAccountV2");
        const v2 = await V2.deploy();

        await vaf.connect(signers.admin).setImplementation(v2.address);

        expect(await vaf.implementationAddress()).not.equals(oldImpl);
        expect(await vaf.implementationAddress()).equals(v2.address);

        await nodeAccounts[0].connect(signers.random).upgradeTo(await vaf.implementationAddress());

        const v2_0 = await ethers.getContractAt("MockNodeAccountV2", nodeAccounts[0].address);
        const v2_1 = await ethers.getContractAt("MockNodeAccountV2", nodeAccounts[1].address);

        expect(await v2_0.test()).equals(69)
        await expect(v2_1.test()).to.be.rejectedWith("CALL_EXCEPTION")

        await nodeAccounts[1].connect(signers.random2).upgradeTo(await vaf.implementationAddress());

        expect(await v2_0.test()).equals(69)
        expect(await v2_1.test()).equals(69)

    })


});