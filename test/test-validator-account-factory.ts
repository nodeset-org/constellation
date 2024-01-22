import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";
import { prepareOperatorDistributionContract } from "./utils/utils";
import { generateDepositData } from "./rocketpool/_helpers/minipool";
import { RocketMinipoolFactory } from "./rocketpool/_utils/artifacts";

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

        const depositData = await generateDepositData(protocol.validatorAccountFactory.address, salt);

        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: "0xc86f125988438c35b58532322748b12c47e9e9ea"
        }

        const initCode = await protocol.validatorAccountFactory.getInitCode(config);
        const nextValidatorAccountAddress = await protocol.validatorAccountFactory.getDeterministicProxyAddress(
            ethers.utils.hexZeroPad(ethers.utils.hexValue(salt), 32),
            initCode
        )

        const rocketMinipoolFactory = await RocketMinipoolFactory.deployed();
        let minipoolAddress = (await rocketMinipoolFactory.getExpectedAddress(nextValidatorAccountAddress, salt)).substr(2);

        //config.expectedMinipoolAddress = minipoolAddress;

        await protocol.validatorAccountFactory.connect(signers.hyperdriver).createNewValidatorAccount(config, 0, {
            value: ethers.utils.parseEther("1")
        })
    });
});