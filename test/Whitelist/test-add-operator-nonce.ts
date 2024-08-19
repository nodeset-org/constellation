import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "../test";
import { BigNumber } from "ethers";
import { keccak256 } from "ethereumjs-util";
import { badAutWhitelistUserServerSig, whitelistUserServerSig } from "../utils/utils";

describe("Test Add Operator Nonce", function () {
    describe("When sig isn't used", async () => {
        describe("When sig has not expired", async () => {
            describe("When operator has ONE valid sig", async () => {
                it("Should pass", async () => {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers } = setupData;
            
                    const {sig, timestamp} = await whitelistUserServerSig(setupData, signers.random);
            
                    expect(await protocol.whitelist.nonces(signers.random.address)).equals(0);

                    await protocol.whitelist.connect(signers.admin).addOperator(signers.random.address, timestamp, sig);

                    expect(await protocol.whitelist.nonces(signers.random.address)).equals(1);
                })
            })

            describe("When operator has MANY valid sigs", async () => {
                it.skip("Should pass on the first sig and revert all other sigs due to nonce invalidations", async () =>  {
                    // we need to be using a broken signing algorithm to test this
                })
            })
        })
    })
})