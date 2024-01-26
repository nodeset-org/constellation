import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";
import { getNextContractAddress, getNextFactoryContractAddress, prepareOperatorDistributionContract } from "./utils/utils";
import { generateDepositData } from "./rocketpool/_helpers/minipool";

describe("Validator Account Factory", function () {
    it("Run the MOAT (Mother Of all Atomic Transactions)", async function () {
        const setupData = await protocolFixture();
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const salt = 3;

        expect( await protocol.validatorAccountFactory.hasSufficentLiquidity(bond)).equals(false);
        await prepareOperatorDistributionContract(setupData, 1);
        expect( await protocol.validatorAccountFactory.hasSufficentLiquidity(bond)).equals(true);

        await protocol.whitelist.connect(signers.admin).addOperator(signers.hyperdriver.address);

        const nextAddress = "0xD9bf496401781cc411AE0F465Fe073872A50D639";
        const depositData = await generateDepositData(nextAddress, salt);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        }

        await protocol.validatorAccountFactory.connect(signers.hyperdriver).createNewValidatorAccount(config, nextAddress, {
            value: ethers.utils.parseEther("1")
        })

        const badConfig = {
            timezoneLocation: 'Australia/Sydney',
            bondAmount: 0,
            minimumNodeFee: 0,
            validatorPubkey: "0x00",
            validatorSignature:  "0x00",
            depositDataRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
            salt: 0,
            expectedMinipoolAddress: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97"
        }

        await expect(protocol.validatorAccountFactory.connect(signers.hyperdriver).createNewValidatorAccount(badConfig, nextAddress, {
            value: ethers.utils.parseEther("1")
        })).to.be.revertedWith("BadPredictedCreation");

        expect(await protocol.directory.hasRole(ethers.utils.id("FACTORY_ROLE"), protocol.validatorAccountFactory.address)).equals(true)
        expect(await protocol.directory.hasRole(ethers.utils.id("CORE_PROTOCOL_ROLE"), protocol.validatorAccountFactory.address)).equals(true)
        expect(await protocol.directory.hasRole(ethers.utils.id("CORE_PROTOCOL_ROLE"), nextAddress)).equals(true)
    });
});