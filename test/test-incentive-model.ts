import { ethers } from "hardhat";
import { expect } from "chai";
import { protocolFixture } from "./test";
import { ProtocolMathTest } from "../typechain-types";

describe.only("Incentive Modeling Tests", async () => {

    let model: ProtocolMathTest;

    before(async () => {
        const Model = await ethers.getContractFactory("ProtocolMathTest");
        model = await Model.deploy();
        await model.deployed();
    })

    it("success - f(0,3,3)=0 ", async () => {
        const x = ethers.utils.parseEther("0");
        const k = ethers.utils.parseEther("3");
        const m = ethers.utils.parseEther("3");
        const result = await model.test(x, k, m);
        expect(result).to.equal(0);
    })
})