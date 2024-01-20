import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";
import { prepareOperatorDistributionContract } from "./utils/utils";

describe("Validator Account Factory", function () {
    it("Run the MOAT (Mother Of all Atomic Transactions)", async function () {
        const setupData = await protocolFixture();
        const {protocol, signers} = setupData;

        const bond = ethers.utils.parseEther("8");

        const sufficentLiquidity = await protocol.validatorAccountFactory.hasSufficentLiquidity(bond);
        expect(sufficentLiquidity).equals(false);

		await prepareOperatorDistributionContract(setupData, 2);

        
        await protocol.validatorAccountFactory.createNewValidatorAccount({
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: "",
            validatorPubkey: "",
            validatorSignature: "", 
            depositDataRoot: "", 
            salt: 3, 
            expectedMinipoolAddress: ""
        })
    });
});