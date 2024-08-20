import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { protocolFixture } from "../test";
import { BigNumber } from "ethers";
import { keccak256 } from "ethereumjs-util";
import { badAutWhitelistUserServerSig, whitelistUserServerSig } from "../utils/utils";

describe("Test Add Operator Nonce", function () {
    describe("When sig isn't used", async () => {
        describe("When operator has ONE valid sig", async () => {
            it("Should pass", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers } = setupData;

                const { sig } = await whitelistUserServerSig(setupData, signers.random);

                expect(await protocol.whitelist.nonces(signers.random.address)).equals(0);

                await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, sig);

                expect(await protocol.whitelist.nonces(signers.random.address)).equals(1);
            })
        })

        describe("When admin invalidates sig type nonce", async () => {
            it("Shoudl revert", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers } = setupData;

                const { sig } = await whitelistUserServerSig(setupData, signers.random);
                expect(await protocol.whitelist.nonce()).equals(0);
                await protocol.whitelist.connect(signers.admin).invalidateAllOutstandingSigs();
                expect(await protocol.whitelist.nonce()).equals(1);
                expect(await protocol.whitelist.nonces(signers.random.address)).equals(0);
                await expect(protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, sig)).to.be.revertedWith("signer must be admin server role");

            })
        })

        describe("When admin invalidates per operator nonce", async () => {
            it("Shoudl revert", async () => {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers } = setupData;

                const { sig } = await whitelistUserServerSig(setupData, signers.random);
                expect(await protocol.whitelist.nonce()).equals(0);
                expect(await protocol.whitelist.nonces(signers.random.address)).equals(0);
                await protocol.whitelist.connect(signers.admin).invalidateSingleOustandingSig(signers.random.address);
                expect(await protocol.whitelist.nonce()).equals(0);
                expect(await protocol.whitelist.nonces(signers.random.address)).equals(1);
                await expect(protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, sig)).to.be.revertedWith("signer must be admin server role");

            })
        })

        describe("When operator has MANY valid sigs", async () => {
            it.skip("Should pass on the first sig and revert all other sigs due to nonce invalidations", async () => {
                // we need to be using a broken signing algorithm to test this
            })
        })
    })
})