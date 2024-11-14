import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));

describe("WETHVault.maxRedeem", function () {
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

        // Hack to bypass the treasury rebalance
        await mockDirectory.setTreasuryAddress(wethVault.address);

    });
    describe("when the user has no shares", function () {
        it("returns 0", async function () {
            const maxRedeem = await wethVault.maxRedeem(owner.address);
            expect(maxRedeem).to.equal(ethers.utils.parseEther("0"));
        });
    });

    describe("when the user has shares", function () {
        it.skip("returns the max redeem amount", async function () {
            await mockSanctions.setSanctioned(owner.address, false);
            await mockDirectory.setIsSanctioned(false);
            await mockOracle.setLastUpdatedTotalYieldAccrued((await ethers.provider.getBlock("latest")).timestamp);
            await mockWETHToken.connect(owner).approve(wethVault.address, ethers.utils.parseEther("100"));

            // Set up mocks for ETH/RPL ratio to allow deposits
            await mockRplVault.setMinWethRplRatio(ethers.utils.parseEther("4"));
            await mockRplVault.setTotalAssets(ethers.utils.parseEther("100"));
            await mockOperatorDistributor.setTvlEth(ethers.utils.parseEther("1"));
            await mockPriceFetcher.setPrice(ethers.utils.parseEther("1"));

            // Mint WETH to the user and vault for liquidity
            await mockWETHToken.mint(owner.address, ethers.utils.parseEther("10"));
            await mockWETHToken.mint(wethVault.address, ethers.utils.parseEther("1000"));

            const assetsBefore = await wethVault.totalAssets();
            console.log("Total Assets before deposit:", assetsBefore);


            // Deposit to mint shares
            await wethVault.connect(owner).deposit(ethers.utils.parseEther("5"), owner.address);
            await mockRplVault.setTotalAssets(ethers.utils.parseEther("105"));

            const maxRedeem = await wethVault.maxRedeem(owner.address);
            expect(maxRedeem).to.not.equal(ethers.utils.parseEther("0"));
        });
    });
});