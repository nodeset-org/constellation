import { ethers } from "hardhat";
import { expect } from "chai";
import { protocolFixture } from "./test";
import { ProtocolMathTest } from "../typechain-types";
import { expectNumberE18ToBeApproximately } from "./utils/utils";

describe.only("Incentive Modeling Tests", async () => {

    let model: ProtocolMathTest;

    before(async () => {
        const Model = await ethers.getContractFactory("ProtocolMathTest");
        model = await Model.deploy();
        await model.deployed();
    })

    it("success - f(0,3,3)=0", async () => {
        const x = 0;
        const k = 3;
        const m = 3;
        const result = await model.test(x, k, m);
        expect(result).to.equal(0);
    })

    it("success - f(.5,3,3)=.547", async () => {
        const x = ethers.utils.parseEther(".5");
        const k = 3;
        const m = 3;
        const result = await model.test(x, k, m);
        expectNumberE18ToBeApproximately(result, ethers.utils.parseEther(".547"), 0.001);
    })

    it("success - f(1,2,6)=2", async () => {
        const x = ethers.utils.parseEther("1");
        const k = 6;
        const m = 2;
        const result = await model.test(x, k, m);
        expect(result).to.equal(ethers.utils.parseEther("2"));
    })
})