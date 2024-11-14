import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));

describe("WETHVault.maxDeposit", function () {
    let wethVault: Contract;
    let mockRplVault: Contract;
    let mockDirectory: Contract;
    let mockWETHToken: Contract;
    let mockPriceFetcher: Contract;
    let mockRocketDepositPool: Contract;
    let mockSuperNodeAccount: Contract;
    let mockSanctions: Contract;
    let mockRplToken: Contract;
    let mockMerkleClaimStreamer: Contract;
    let mockOracle: Contract;
    let mockOperatorDistributor: Contract;
    let owner: any;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        const MockSanctions = await ethers.getContractFactory("MockSanctions");
        mockSanctions = await MockSanctions.deploy();
        await mockSanctions.deployed();

        const MockRplVault = await ethers.getContractFactory("MockRPLVault");
        mockRplVault = await MockRplVault.deploy();
        await mockRplVault.deployed();

        const MockRplToken = await ethers.getContractFactory("MockErc20");
        mockRplToken = await MockRplToken.deploy("Mock RPL", "RPL", ethers.utils.parseEther("1"));
        await mockRplToken.deployed();

        const PriceFetcher = await ethers.getContractFactory("MockPriceFetcher");
        mockPriceFetcher = await PriceFetcher.deploy();
        await mockPriceFetcher.deployed();

        const MockWETHToken = await ethers.getContractFactory("MockWEth");
        mockWETHToken = await MockWETHToken.deploy();
        await mockWETHToken.deployed();

        const MockMerkleClaimStreamer = await ethers.getContractFactory("MockMerkleClaimStreamer");
        mockMerkleClaimStreamer = await MockMerkleClaimStreamer.deploy();
        await mockMerkleClaimStreamer.deployed();

        const MockOracle = await ethers.getContractFactory("MockOracle");
        mockOracle = await MockOracle.deploy();
        await mockOracle.deployed();

        const MockOperatorDistributor = await ethers.getContractFactory("MockOperatorDistributor");
        mockOperatorDistributor = await MockOperatorDistributor.deploy();
        await mockOperatorDistributor.deployed();

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
        await mockDirectory.setRPLAddress(mockRplToken.address);
        await mockDirectory.setRPLVaultAddress(mockRplVault.address);
        await mockDirectory.setPriceFetcherAddress(mockPriceFetcher.address);
        await mockDirectory.setOperatorDistributorAddress(mockOperatorDistributor.address);
        await mockDirectory.setMerkleClaimStreamerAddress(mockMerkleClaimStreamer.address);
        await mockDirectory.setOracleAddress(mockOracle.address);
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
        describe("when receiver is sanctioned", function () {
            it("returns 0", async function () {
                await mockSanctions.setSanctioned(owner.address, true);
                const maxDeposit = await wethVault.maxDeposit(owner.address);

                expect(maxDeposit).to.equal(0);

            });
        });

        describe("when receiver is not sanctioned", function () {
            beforeEach(async function () {
                await mockSanctions.setSanctioned(owner.address, false);
            });

            describe("when any deposit is above or equal to the eth/rpl ratio", function () {
                it("returns 0", async function () {
                    await mockRplVault.setMinWethRplRatio(ethers.utils.parseEther("0"));

                    const maxDeposit = await wethVault.maxDeposit(owner.address);
                    expect(maxDeposit).to.equal(0);
                });
            });
            describe("when any deposit is below the allowed eth/rpl ratio", function () {
                it("returns a calculated limit", async function () {
                    await mockRplVault.setMinWethRplRatio(ethers.utils.parseEther("999"));
                    await mockRplVault.setTotalAssets(ethers.utils.parseEther("1"));
                    await mockPriceFetcher.setPrice(ethers.utils.parseEther("1"));

                    const maxDeposit = await wethVault.maxDeposit(owner.address);
                    expect(maxDeposit).to.not.equal(0);
                });
            });
        });
    });
});