import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";
import { countProxyCreatedEvents, getNextContractAddress, getNextFactoryContractAddress, predictDeploymentAddress, prepareOperatorDistributionContract, registerNewValidator } from "./utils/utils";
import { generateDepositData } from "./rocketpool/_helpers/minipool";

describe("Validator Account Factory", function () {

    it("test initialize", async function () {

        const setupData = await loadFixture(protocolFixture);
        const { protocol, signers } = setupData;

        await prepareOperatorDistributionContract(setupData, 2);
        const validatorAccounts = await registerNewValidator(setupData, [signers.random, signers.random2]);

        
    });


});