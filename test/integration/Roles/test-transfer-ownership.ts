import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData, Protocol, RocketPool } from "../integration";

const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));

describe("Admin Rights Transfer", function () {

    it("Treasurer is not admin, deployer, or treasury", async function () {

        const { protocol, signers } = await loadFixture(protocolFixture);

        expect(await protocol.directory.hasRole(adminRole, signers.admin.address)).to.be.true;
        expect(await protocol.directory.hasRole(adminRole, signers.random.address)).to.be.false;

        await protocol.directory.connect(signers.admin).grantRole(ethers.utils.arrayify(adminRole), signers.random.address);

        expect(await protocol.directory.hasRole(adminRole, signers.admin.address)).to.be.true;
        expect(await protocol.directory.hasRole(adminRole, signers.random.address)).to.be.true;


        await protocol.directory.connect(signers.admin).revokeRole(adminRole, signers.admin.address)

        expect(await protocol.directory.hasRole(adminRole, signers.admin.address)).to.be.false;
        expect(await protocol.directory.hasRole(adminRole, signers.random.address)).to.be.true;
    });

});