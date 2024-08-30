import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";
import { prepareOperatorDistributionContract, registerNewValidator } from "../utils/utils";
import { MockOperatorDistributorV2, OperatorDistributor } from "../../typechain-types";

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

        let odProxy: MockOperatorDistributorV2 | OperatorDistributor = await ethers.getContractAt("OperatorDistributor", await directory.getOperatorDistributorAddress());
        expect(await odProxy.targetStakeRatio()).to.not.be.reverted;

        await directory.connect(signers.admin).setAll(protocolConfigWithRandomAddresses);
        odProxy = await ethers.getContractAt("OperatorDistributor", await directory.getOperatorDistributorAddress());
        await expect(odProxy.targetStakeRatio()).to.be.rejectedWith("CALL_EXCEPTION");

        await directory.connect(signers.admin).setAll(protocolConfig);
        odProxy = await ethers.getContractAt("OperatorDistributor", await directory.getOperatorDistributorAddress());
        expect(await odProxy.targetStakeRatio()).to.not.be.reverted;

        const ODV2 = await ethers.getContractFactory("MockOperatorDistributorV2");
        const odV2 = await ODV2.deploy();
        await odV2.deployed();

        odProxy = await ethers.getContractAt("MockOperatorDistributorV2", await directory.getOperatorDistributorAddress());
        await expect((odProxy as MockOperatorDistributorV2).testUpgrade()).to.be.rejectedWith("CALL_EXCEPTION");

        await odProxy.connect(signers.admin).upgradeTo(odV2.address);

        await expect((odProxy as MockOperatorDistributorV2).testUpgrade()).to.not.be.reverted;
    })
})