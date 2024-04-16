import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";

describe("Whitelist (proxy)", function () {
    it("Admin can update contract", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const initialAddress = protocol.whitelist.address;

        const initialImpl = await protocol.whitelist.getImplementation();

        const initialSlotValues = [];

        for (let i = 0; i < 1000; i++) {
            initialSlotValues.push(await ethers.provider.getStorageAt(initialAddress, i));
        }

        const WhitelistV2Logic = await ethers.getContractFactory("WhitelistV2", signers.admin);

        // upgrade protocol.whitelist to V2
        const newWhitelist = await upgrades.upgradeProxy(protocol.whitelist.address, WhitelistV2Logic, {
            kind: 'uups',
            unsafeAllow: ['constructor']
        });

        // check that the proxy address has not changed.
        expect(newWhitelist.address).to.equal(initialAddress);

        // check that the logic address has changed.
        expect(await newWhitelist.getImplementation()).to.not.equal(initialImpl);

        // execute new function
        expect(await newWhitelist.testUpgrade()).to.equal(0);

        // read from new storage
        for (let i = 0; i < 1000; i++) {
            expect(await ethers.provider.getStorageAt(initialAddress, i)).to.equal(initialSlotValues[i]);
        }
    });
});

describe("Whitelist", function () {
    it("Admin can add address to whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        const currentBlock = await ethers.provider.getBlockNumber();
        const timestamp = (await ethers.provider.getBlock(currentBlock)).timestamp + 86400;

        // set timestamp for next block to be timestamp + 1 day
        await time.setNextBlockTimestamp(timestamp);

        const operator = [
            timestamp,
            0,
            0,
        ];

        await expect(protocol.whitelist.connect(signers.admin).addOperator(signers.random.address))
            .to.emit(protocol.whitelist, 'OperatorAdded').withArgs(operator);
    });

    it("Anyone can read from operator list", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address);

        const operator: OperatorStruct = await protocol.whitelist.connect(signers.random)
            .getOperatorAtAddress(signers.random.address);

        const expected = {
            index: BigNumber.from(0),
            nodeAddress: signers.random.address,
            operationStartTime: await time.latest(),
            currentValidatorCount: 0,
            feePortion: ethers.utils.parseEther("1")
        };

        // Simple comparison on structs is not possible with HH chai matchers yet,
        // so we have to compare each field directly.
        // see https://github.com/NomicFoundation/hardhat/issues/3318
        expect(operator.operationStartTime).equals(expected.operationStartTime);
        expect(operator.currentValidatorCount).equals(expected.currentValidatorCount);
    });

    it("Node operator can only update operator controller once", async () => {
        const { protocol, signers } = await loadFixture(protocolFixture);
        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address);
        await expect(protocol.whitelist.connect(signers.random).setOperatorController(signers.random2.address))
            .to.emit(protocol.whitelist, "OperatorControllerUpdated").withArgs(signers.random.address, signers.random2.address);
        await expect(protocol.whitelist.connect(signers.random).setOperatorController(signers.random2.address))
            .to.be.revertedWith("Whitelist: Operator controller may only be set by the operator controller!");
    })

    it("Node operator can only updated by operator controller", async () => {
        const { protocol, signers } = await loadFixture(protocolFixture);
        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address);
        await expect(protocol.whitelist.connect(signers.random).setOperatorController(signers.random2.address))
            .to.emit(protocol.whitelist, "OperatorControllerUpdated").withArgs(signers.random.address, signers.random2.address);
        await expect(protocol.whitelist.connect(signers.random).setOperatorController(signers.random2.address))
            .to.be.revertedWith("Whitelist: Operator controller may only be set by the operator controller!");
        await expect(protocol.whitelist.connect(signers.random2).setOperatorController(signers.random3.address))
            .to.emit(protocol.whitelist, "OperatorControllerUpdated").withArgs(signers.random2.address, signers.random3.address);
    })

    it("Non-admin cannot add address to whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await expect(protocol.whitelist.connect(signers.random).addOperator(signers.random.address))
            .to.be.revertedWith("Can only be called by 24 hour timelock!");

        await expect(protocol.whitelist.getOperatorAtAddress(signers.random.address))
            .to.be.revertedWith("Whitelist: Provided address is not an allowed operator!");
    });

    it("Admin can remove NO from whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address);

        await expect(protocol.whitelist.connect(signers.admin).removeOperator(signers.random.address))
            .to.emit(protocol.whitelist, "OperatorRemoved").withArgs(signers.random.address);

        await expect(protocol.whitelist.getOperatorAtAddress(signers.random.address))
            .to.be.revertedWith("Whitelist: Provided address is not an allowed operator!");
    });

    it("Non-admin cannot remove NO from whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address);

        await expect(protocol.whitelist.connect(signers.random).removeOperator(signers.random.address))
            .to.be.revertedWith("Can only be called by 24 hour timelock!");
    });

    it("Admin can batch add addresses to whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await expect(protocol.whitelist.connect(signers.admin).addOperators([signers.random.address, signers.random2.address]))
            .to.emit(protocol.whitelist, 'OperatorsAdded').withArgs([signers.random.address, signers.random2.address]);
    });

    it("Non-admin cannot batch add addresses to whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await expect(protocol.whitelist.connect(signers.random).addOperators([signers.random.address, signers.random2.address]))
            .to.be.revertedWith("Can only be called by 24 hour timelock!");
    });

    it("Admin can batch remove addresses from whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await protocol.whitelist.connect(signers.admin).addOperators([signers.random.address, signers.random2.address]);

        await expect(protocol.whitelist.connect(signers.admin).removeOperators([signers.random.address, signers.random2.address]))
            .to.emit(protocol.whitelist, 'OperatorsRemoved').withArgs([signers.random.address, signers.random2.address]);
    });

    it("Non-admin cannot batch remove addresses from whitelist", async function () {
        const { protocol, signers } = await loadFixture(protocolFixture);

        await protocol.whitelist.connect(signers.admin).addOperators([signers.random.address, signers.random2.address]);

        await expect(protocol.whitelist.connect(signers.random).removeOperators([signers.random.address, signers.random2.address]))
            .to.be.revertedWith("Can only be called by 24 hour timelock!");
    });
});