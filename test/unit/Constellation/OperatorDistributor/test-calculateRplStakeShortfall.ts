import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));


describe("OperatorDistributor.calculateRplStakeShortfall", function () {
    let operatorDistributor: Contract;
    let mockDirectory: Contract;
    let priceFetcher: Contract;
    let owner: any;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        // Deploy mocks
        const PriceFetcher = await ethers.getContractFactory("MockPriceFetcher");
        priceFetcher = await PriceFetcher.deploy();
        await priceFetcher.deployed();

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();

        // Set directory addresses
        await mockDirectory.setPriceFetcherAddress(priceFetcher.address);
        // Set roles
        await mockDirectory.setRole(AdminRole, owner.address, true);

        const OperatorDistributor = await ethers.getContractFactory("OperatorDistributor");
        operatorDistributor = await upgrades.deployProxy(OperatorDistributor, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });
        await operatorDistributor.setMinimumStakeRatio(ethers.utils.parseEther("0.15"));
    });

    describe("test case 1", function () {
        it("should pass", async function () {
            const existingRplStake = ethers.utils.parseEther("0");
            const rpEthMatched = ethers.utils.parseEther("100");
            await priceFetcher.setPrice(ethers.utils.parseEther("100"));
            expect(await operatorDistributor.calculateRplStakeShortfall(existingRplStake, rpEthMatched)).to.equal(ethers.utils.parseEther("1500"));
        });
    });

    describe("test case 2", function () {
        it("should pass", async function () {
            const existingRplStake = ethers.utils.parseEther("1000");
            const rpEthMatched = ethers.utils.parseEther("100");
            await priceFetcher.setPrice(ethers.utils.parseEther("100"));
            expect(await operatorDistributor.calculateRplStakeShortfall(existingRplStake, rpEthMatched)).to.equal(ethers.utils.parseEther("500"));
        });
    });

    describe("test case 3", function () {
        it("should pass", async function () {
            const existingRplStake = ethers.utils.parseEther("1500");
            const rpEthMatched = ethers.utils.parseEther("100");
            await priceFetcher.setPrice(ethers.utils.parseEther("100"));
            expect(await operatorDistributor.calculateRplStakeShortfall(existingRplStake, rpEthMatched)).to.equal(ethers.utils.parseEther("0"));
        });
    });

    describe("test case 4", function () {
        it("should pass", async function () {
            const existingRplStake = ethers.utils.parseEther("0");
            const rpEthMatched = ethers.utils.parseEther("0");
            await priceFetcher.setPrice(ethers.utils.parseEther("100"));
            expect(await operatorDistributor.calculateRplStakeShortfall(existingRplStake, rpEthMatched)).to.equal(ethers.utils.parseEther("0"));
        });
    });

    describe("test case 5", function () {
        it("should pass", async function () {
            const existingRplStake = ethers.utils.parseEther("100");
            const rpEthMatched = ethers.utils.parseEther("0");
            await priceFetcher.setPrice(ethers.utils.parseEther("100"));
            expect(await operatorDistributor.calculateRplStakeShortfall(existingRplStake, rpEthMatched)).to.equal(ethers.utils.parseEther("0"));
        });
    });
});