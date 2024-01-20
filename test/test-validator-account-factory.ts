import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";
import { prepareOperatorDistributionContract } from "./utils/utils";
import { generateDepositData } from "./rocketpool/_helpers/minipool";

describe("Validator Account Factory", function () {
    it("Run the MOAT (Mother Of all Atomic Transactions)", async function () {
        const setupData = await protocolFixture();
        const { protocol, signers } = setupData;

        const bond = ethers.utils.parseEther("8");
        const salt = 3;

        const sufficentLiquidity = await protocol.validatorAccountFactory.hasSufficentLiquidity(bond);
        expect(sufficentLiquidity).equals(false);

        await prepareOperatorDistributionContract(setupData, 1);

        const depositData = await generateDepositData(protocol.validatorAccountFactory.address, salt);

        await protocol.validatorAccountFactory.createNewValidatorAccount({
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        })
    });
});