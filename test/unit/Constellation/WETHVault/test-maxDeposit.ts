import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const ShortTimelockRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_SHORT"));

describe("WETHVault.maxDeposit", function () {
    let wethVault: Contract;
    let mockDirectory: Contract;
    let mockWETHToken: Contract;
    let mockRocketDepositPool: Contract;
    let mockSuperNodeAccount: Contract;
    let mockSanctions: Contract
    let owner: any;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        const MockSanctions = await ethers.getContractFactory("MockSanctions");
        mockSanctions = await MockSanctions.deploy();
        await mockSanctions.deployed();

        const MockWETHToken = await ethers.getContractFactory("MockWEth");
        mockWETHToken = await MockWETHToken.deploy();
        await mockWETHToken.deployed();

        const MockSuperNodeAccount = await ethers.getContractFactory("MockSuperNode");
        mockSuperNodeAccount = await MockSuperNodeAccount.deploy();
        await mockSuperNodeAccount.deployed();
        await mockSuperNodeAccount.setBond(ethers.utils.parseEther("8"));

        const MockRocketDepositPool = await ethers.getContractFactory("MockRocketDepositPool");
        mockRocketDepositPool = await MockRocketDepositPool.deploy();
        await mockRocketDepositPool.deployed();

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();
        await mockDirectory.setRole(AdminRole, owner.address, true);

        await mockDirectory.setWETHAddress(mockWETHToken.address);
        await mockDirectory.setRocketDepositPoolAddress(mockRocketDepositPool.address);
        await mockDirectory.setSuperNodeAddress(mockSuperNodeAccount.address);
        await mockDirectory.setSanctionsAddress(mockSanctions.address);

        const WETHVault = await ethers.getContractFactory("WETHVault");
        wethVault = await upgrades.deployProxy(
            WETHVault,
            [mockDirectory.address, mockWETHToken.address],
            { initializer: 'initializeVault', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
        );
        await wethVault.reinitialize101();
        await mockDirectory.setWETHVaultAddress(wethVault.address);
    });
    describe("when deposits are not enabled", function () {
        it("returns 0", async function () {
            await wethVault.connect(owner).setDepositsEnabled(false);
            const maxDeposit = await wethVault.maxDeposit(owner.address);

            expect(maxDeposit).to.equal(0);
        });
    });
    describe("when deposits are enabled", function () {
        describe("when receiver is not sanctioned", function () {
            it("returns 0", async function () {
                await mockSanctions.setSanctioned(owner.address, false);
                const maxDeposit = await wethVault.maxDeposit(owner.address);

                expect(maxDeposit).to.equal(0);

            });
        });

        describe("when receiver is sanctioned", function () {
            beforeEach(async function () {
                await mockSanctions.setSanctioned(owner.address, true);
            });

            describe("when any deposit is above or equal to the eth/rpl ratio", function () {
                it("returns 0", async function () {
                });
            });
            describe("when any deposit is below the allowed eth/rpl ratio", function () {
                it("returns a calculated limit", async function () {
                });
            });
        });
    });
});