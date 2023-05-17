import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";

describe.only("Whitelist (proxy)", function () {
    it("Admin can update contract", async function () {
        const { protocol } = await loadFixture(protocolFixture);

        const initialAddress = protocol.whitelist.address;

        const initialImpl = await protocol.whitelist.getImplementation();

        const initialSlotValues = [];

        for(let i = 0; i < 1000; i++) {
            initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
        }

        const WhitelistV2Logic = await ethers.getContractFactory("contracts/Whitelist/WhitelistV2.sol:Whitelist");

        // upgrade protocol.whitelist to V2
        const newWhitelist = await upgrades.upgradeProxy(protocol.whitelist.address, WhitelistV2Logic, {
            kind: 'uups'
        });

        // check that the proxy address has not changed.
        expect(newWhitelist.address).to.equal(initialAddress);

        // check that the logic address has changed.
        expect(await newWhitelist.getImplementation()).to.not.equal(initialImpl);

        // execute new function
        expect(await newWhitelist.testUpgrade()).to.equal(0);

        // read from new storage
        for(let i = 0; i < 1000; i++) {
            expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
        }
    }); 
});

describe("Whitelist", function () { 
    it("Admin can add address to whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const operator = [
            BigNumber.from(0),
            signers.random.address,
            await time.latest() + 1,
            0,
            10000
        ];

        await expect(protocol.whitelist.addOperator(signers.random.address))
            .to.emit(protocol.whitelist, 'OperatorAdded').withArgs(operator);
    });

    it("Anyone can read from operator list", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await protocol.whitelist.addOperator(signers.random.address);

        const operator: OperatorStruct = await protocol.whitelist.connect(signers.random)
            .getOperatorAtAddress(signers.random.address);
        
        const expected = {
            index: BigNumber.from(0),
            nodeAddress: signers.random.address,
            operationStartTime: await time.latest(),
            currentValidatorCount: 0,
            feePortion: 10000
        };

        // Simple comparison on structs is not possible with HH chai matchers yet,
        // so we have to compare each field directly.
        // see https://github.com/NomicFoundation/hardhat/issues/3318
        await expect(operator.index).equals(expected.index);
        await expect(operator.nodeAddress).equals(expected.nodeAddress);
        await expect(operator.operationStartTime).equals(expected.operationStartTime);
        await expect(operator.currentValidatorCount).equals(expected.currentValidatorCount);
        await expect(operator.feePortion).equals(expected.feePortion);
    });

    it("Non-admin cannot add address to whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);
        
        await expect(protocol.whitelist.connect(signers.random).addOperator(signers.random.address))
            .to.be.revertedWith(await protocol.whitelist.ADMIN_ONLY_ERROR());

        await expect(protocol.whitelist.getOperatorAtAddress(signers.random.address))
            .to.be.revertedWith(await protocol.whitelist.OPERATOR_NOT_FOUND_ERROR());
    });

    it("Admin can remove NO from whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);
        
        await protocol.whitelist.addOperator(signers.random.address);
        
        await expect(protocol.whitelist.removeOperator(signers.random.address))
            .to.emit(protocol.whitelist, "OperatorRemoved").withArgs(signers.random.address);

        await expect(protocol.whitelist.getOperatorAtAddress(signers.random.address))
            .to.be.revertedWith(await protocol.whitelist.OPERATOR_NOT_FOUND_ERROR());
    });

    it("Non-admin cannot remove NO from whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);
       
        await protocol.whitelist.addOperator(signers.random.address);

        await expect(protocol.whitelist.connect(signers.random).removeOperator(signers.random.address))
            .to.be.revertedWith(await protocol.whitelist.ADMIN_ONLY_ERROR());
      });
  });