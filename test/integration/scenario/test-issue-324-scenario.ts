import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../integration";
import { Contract } from 'ethers';

describe("Upgrade Protocol", function () {
    it("Issue #324 flow", async () => {

        const { protocol, signers } = await loadFixture(protocolFixture);
        const { oracle, directory } = protocol;

        const protocolConfig = await directory.getProtocol();
        const protocolConfigWithRandomAddresses = protocolConfig.map((item: string) => {
            if (typeof item === 'string' && ethers.utils.isAddress(item)) {
                return ethers.Wallet.createRandom().address;
            } else if (typeof item === 'object') {
                const key = Object.keys(item)[0];
                if (ethers.utils.isAddress(item[key])) {
                    return { [key]: ethers.Wallet.createRandom().address };
                }
            }
            return item;
        });

        let odProxy: Contract = await ethers.getContractAt("OperatorDistributor", await directory.getOperatorDistributorAddress());
        expect(await odProxy.targetStakeRatio()).to.not.be.reverted;

        await directory.connect(signers.admin).setAll(protocolConfigWithRandomAddresses);
        odProxy = await ethers.getContractAt("OperatorDistributor", await directory.getOperatorDistributorAddress());
        await expect(odProxy.targetStakeRatio()).to.be.rejectedWith("CALL_EXCEPTION");

        await directory.connect(signers.admin).setAll(protocolConfig);
        odProxy = await ethers.getContractAt("OperatorDistributor", await directory.getOperatorDistributorAddress());
        expect(await odProxy.targetStakeRatio()).to.not.be.reverted;

        const ODV2 = await ethers.getContractFactory("MockOperatorDistributor");
        const odV2 = await ODV2.deploy();
        await odV2.deployed();

        odProxy = await ethers.getContractAt("MockOperatorDistributor", await directory.getOperatorDistributorAddress());
        await expect((odProxy as Contract).testUpgrade()).to.be.rejectedWith("CALL_EXCEPTION");

        await odProxy.connect(signers.admin).upgradeTo(odV2.address);

        await expect((odProxy as Contract).testUpgrade()).to.not.be.reverted;
    })
})