import { ethers } from "hardhat";
import { expect } from "chai";
import { protocolFixture } from "./test";
import { ProtocolMathTest } from "../typechain-types";
import { evaluateModel, expectNumberE18ToBeApproximately } from "./utils/utils";
import seedrandom from 'seedrandom';

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

    type ParamsType = { x: number; k: number; m: number };
    [{ x: 0.1, k: 3, m: 3 }, { x: 0.69, k: 3, m: 3 }, { x: .6, k: 2, m: 6 }].forEach((params: ParamsType) => {
        it(`success - f(${params.x},${params.k},${params.m})=${evaluateModel(params.x, params.k, params.m)}`, async () => {
            const x = ethers.utils.parseEther(params.x.toString());
            const k = params.k;
            const m = params.m;
            const result = await model.test(x, k, m);
            expectNumberE18ToBeApproximately(result, ethers.utils.parseEther(evaluateModel(params.x, params.k, params.m).toString()), 0.001);
        })
    })

    // test over randomly generated values
    const rng = seedrandom('wen{::}moontho?');
    for (let i = 0; i < 1000; i++) {
        const x = parseFloat(rng().toFixed(5));
        const k = parseFloat((rng() * 10).toFixed(0));
        const m = parseFloat((rng() * 10).toFixed(0));
        it(`success - f(${x},${k},${m})=${evaluateModel(x, k, m)}`, async () => {
            const xBig = ethers.utils.parseEther(x.toString());
            const result = await model.test(xBig, k, m);
            expectNumberE18ToBeApproximately(result, ethers.utils.parseEther(evaluateModel(x, k, m).toFixed(18)), 0.001);
        })
    }

})