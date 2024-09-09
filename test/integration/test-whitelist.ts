import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../../typechain-types/contracts/Constellation/Whitelist";
import { protocolFixture } from "./integration";
import { BigNumber } from "ethers";
import { keccak256 } from "ethereumjs-util";
import { badAutWhitelistUserServerSig, whitelistUserServerSig } from "../utils/utils";

describe("Whitelist", function () {
    it("Admin can add address to whitelist", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const currentBlock = await ethers.provider.getBlockNumber();
        const timestamp = (await ethers.provider.getBlock(currentBlock)).timestamp + (86400 - 1);

        // set timestamp for next block to be timestamp + 1 day
        await time.setNextBlockTimestamp(timestamp);

        const operator = [
            0,
            true,
            1
        ];

        const {sig, timestamp: timestamp2} = await whitelistUserServerSig(setupData, signers.random);

        await expect(protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, sig))
            .to.emit(protocol.whitelist, 'OperatorAdded').withArgs(operator);
    });

    it("Anyone can read from operator list", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const {sig, timestamp} = await whitelistUserServerSig(setupData, signers.random);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, sig);

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
        expect(operator.activeValidatorCount).equals(expected.currentValidatorCount);
    });

    it("Non-admin cannot add address to whitelist", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const {sig, timestamp} = await badAutWhitelistUserServerSig(setupData, signers.random);

        await expect(protocol.whitelist.connect(signers.random).addOperator(signers.random.address, sig))
            .to.be.revertedWith("bad signature");

        expect(await protocol.whitelist.getIsAddressInWhitelist(signers.random.address)).equals(false);
    });

    it("Admin can remove NO from whitelist", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const {sig, timestamp} = await whitelistUserServerSig(setupData, signers.random);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, sig);

        await expect(protocol.whitelist.connect(signers.admin).removeOperator(signers.random.address))
            .to.emit(protocol.whitelist, "OperatorRemoved").withArgs(signers.random.address);

        expect(await protocol.whitelist.getIsAddressInWhitelist(signers.random.address)).equals(false);
    });

    it("Non-admin cannot remove NO from whitelist", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const {sig, timestamp} = await whitelistUserServerSig(setupData, signers.random);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, sig);

        await expect(protocol.whitelist.connect(signers.random).removeOperator(signers.random.address))
            .to.be.revertedWith("Can only be called by short timelock!");
    });

    it("Sig cannot be reused to self add attack", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const {sig, timestamp} = await whitelistUserServerSig(setupData, signers.random);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, sig);
        await protocol.whitelist.connect(signers.admin).removeOperator(signers.random.address);
        await expect(protocol.whitelist.connect(signers.admin).addOperator(signers.random.address,  sig)).to.be.revertedWith("bad signature");
    });

    it("Admin can batch add addresses to whitelist", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        const {sig: sig1, timestamp: timestamp1} = await whitelistUserServerSig(setupData, signers.random);
        const {sig: sig2, timestamp: timestamp2} = await whitelistUserServerSig(setupData, signers.random2);

        await expect(protocol.whitelist.connect(signers.admin).addOperators(
            [signers.random.address, signers.random2.address],
            [sig1, sig2]
        ))
            .to.emit(protocol.whitelist, 'OperatorsAdded').withArgs([signers.random.address, signers.random2.address]);
    });

    it("Non-admin cannot batch add addresses to whitelist", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;
        const {sig: sig1, timestamp: timestamp1} = await badAutWhitelistUserServerSig(setupData, signers.random);
        const {sig: sig2, timestamp: timestamp2} = await badAutWhitelistUserServerSig(setupData, signers.random2);

        await expect(protocol.whitelist.connect(signers.random).addOperators(
            [signers.random.address, signers.random2.address],
            [sig1, sig2]
        ))
            .to.be.revertedWith("bad signature");
    });

    it("Admin can batch remove addresses from whitelist", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;
        const {sig: sig1, timestamp: timestamp1} = await whitelistUserServerSig(setupData, signers.random);
        const {sig: sig2, timestamp: timestamp2} = await whitelistUserServerSig(setupData, signers.random2);

        await protocol.whitelist.connect(signers.admin).addOperators(
            [signers.random.address, signers.random2.address],
            [sig1, sig2]);

        await expect(protocol.whitelist.connect(signers.admin).removeOperators([signers.random.address, signers.random2.address]))
            .to.emit(protocol.whitelist, 'OperatorsRemoved').withArgs([signers.random.address, signers.random2.address]);
    });

    it("Non-admin cannot batch remove addresses from whitelist", async function () {
        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;
        const {sig: sig1, timestamp: timestamp1} = await whitelistUserServerSig(setupData, signers.random);
        const {sig: sig2, timestamp: timestamp2} = await whitelistUserServerSig(setupData, signers.random2);

        await protocol.whitelist.connect(signers.admin).addOperators(
            [signers.random.address, signers.random2.address],
            [sig1, sig2]);
        await expect(protocol.whitelist.connect(signers.random).removeOperators([signers.random.address, signers.random2.address]))
            .to.be.revertedWith("Can only be called by short timelock!");
    });
});