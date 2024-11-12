import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));


describe("WETHVault.calculateDepositLimit", function () {
    let wethVault: Contract;
    let mockDirectory: Contract;
    let mockWETHToken: Contract;
    let mockRocketDepositPool: Contract;
    let owner: any;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        const MockWETHToken = await ethers.getContractFactory("MockWEth");
        mockWETHToken = await MockWETHToken.deploy();
        await mockWETHToken.deployed();

        const MockRocketDepositPool = await ethers.getContractFactory("MockRocketDepositPool");
        mockRocketDepositPool = await MockRocketDepositPool.deploy();
        await mockRocketDepositPool.deployed();

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();
        await mockDirectory.setRole(AdminRole, owner.address, true);

        await mockDirectory.setWETHAddress(mockWETHToken.address);
        await mockDirectory.setRocketDepositPoolAddress(mockRocketDepositPool.address);

        const WETHVault = await ethers.getContractFactory("WETHVault");
        wethVault = await upgrades.deployProxy(
            WETHVault,
            [mockDirectory.address, mockWETHToken.address],
            { initializer: 'initializeVault', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
        );
        await wethVault.reinitialize101();
        await mockDirectory.setWETHVaultAddress(wethVault.address);
    });

    describe("when excess balance is greater than 0 ", function () {
        it("should return excess balance divided by 3", async function () {
            mockRocketDepositPool.setExcessBalance(ethers.utils.parseEther("30000"));

            const result = await wethVault.calculateDepositLimit();
            expect(result).to.equal(ethers.utils.parseEther("10000"));
        });
    });

    describe("when excess balance is 0 ", function () {
        it("should return 0", async function () {
            mockRocketDepositPool.setExcessBalance(ethers.utils.parseEther("0"));

            const result = await wethVault.calculateDepositLimit();
            expect(result).to.equal(ethers.utils.parseEther("0"));
        });
    });
});
