import { expect, version } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperatorStruct } from "../typechain-types/contracts/Whitelist/Whitelist";
import { protocolFixture } from "./test";
import { BigNumber } from "ethers";

describe("Validator Account Factory", function () {
    it("Run the MOAT (Mother Of all Atomic Transactions)", async function () {
        const { protocol, signers } = await protocolFixture();
    });
});