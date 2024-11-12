import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const ShortTimelockRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_SHORT"));


describe("WETHVault._deposit", function () {
    let wethVault: Contract;
    let mockDirectory: Contract;
    let mockWETHToken: Contract;
    let mockRocketDepositPool: Contract;
    let mockRplToken: Contract;
    let mockRplVault: Contract;
    let priceFetcher: Contract;
    let mockOperatorDistributor: Contract;
    let mockMerkleClaimStreamer: Contract;
    let mockOracle: Contract;
    let mockSuperNodeAccount: Contract;

    let owner: any;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        const MockWETHToken = await ethers.getContractFactory("MockWEth");
        mockWETHToken = await MockWETHToken.deploy();
        await mockWETHToken.deployed();

        const MockRocketDepositPool = await ethers.getContractFactory("MockRocketDepositPool");
        mockRocketDepositPool = await MockRocketDepositPool.deploy();
        await mockRocketDepositPool.deployed();
        // await mockRocketDepositPool.setExcessBalance(ethers.utils.parseEther("3"));

        const MockMerkleClaimStreamer = await ethers.getContractFactory("MockMerkleClaimStreamer");
        mockMerkleClaimStreamer = await MockMerkleClaimStreamer.deploy();
        await mockMerkleClaimStreamer.deployed();

        const MockSuperNodeAccount = await ethers.getContractFactory("MockSuperNode");
        mockSuperNodeAccount = await MockSuperNodeAccount.deploy();
        await mockSuperNodeAccount.deployed();
        await mockSuperNodeAccount.setBond(ethers.utils.parseEther("8"));

        const MockRplToken = await ethers.getContractFactory("MockErc20");
        mockRplToken = await MockRplToken.deploy("Mock RPL", "RPL", ethers.utils.parseEther("1"));
        await mockRplToken.deployed();

        const MockOperatorDistributor = await ethers.getContractFactory("MockOperatorDistributor");
        mockOperatorDistributor = await MockOperatorDistributor.deploy();
        await mockOperatorDistributor.deployed();

        const PriceFetcher = await ethers.getContractFactory("MockPriceFetcher");
        priceFetcher = await PriceFetcher.deploy();
        await priceFetcher.deployed();

        const MockOracle = await ethers.getContractFactory("MockOracle");
        mockOracle = await MockOracle.deploy();
        await mockOracle.deployed();

        const MockRplVault = await ethers.getContractFactory("MockRPLVault");
        mockRplVault = await MockRplVault.deploy();
        await mockRplVault.deployed()

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();
        await mockDirectory.setRole(AdminRole, owner.address, true);
        await mockDirectory.setRole(ShortTimelockRole, owner.address, true);

        await mockDirectory.setWETHAddress(mockWETHToken.address);
        await mockDirectory.setRocketDepositPoolAddress(mockRocketDepositPool.address);
        await mockDirectory.setRPLAddress(mockRplToken.address);
        await mockDirectory.setRPLVaultAddress(mockRplVault.address);
        await mockDirectory.setPriceFetcherAddress(priceFetcher.address);
        await mockDirectory.setOperatorDistributorAddress(mockOperatorDistributor.address);
        await mockDirectory.setMerkleClaimStreamerAddress(mockMerkleClaimStreamer.address);
        await mockDirectory.setOracleAddress(mockOracle.address);
        await mockDirectory.setSuperNodeAddress(mockSuperNodeAccount.address);

        // We have to use a mock contract to test the internal _deposit function
        const WETHVault = await ethers.getContractFactory("MockWETHVaultDeposit");
        wethVault = await upgrades.deployProxy(
            WETHVault,
            [mockDirectory.address, mockWETHToken.address],
            { initializer: 'initializeVault', kind: 'uups', unsafeAllow: ['constructor', 'delegatecall'] }
        );
        // Reinitializer to set the default oracle update threshold
        await wethVault.reinitialize101()
        // Do not care for tests to check this right now
        await wethVault.connect(owner).setMaxWethRplRatio(ethers.utils.parseEther("9999999999999999"));

        await mockDirectory.setWETHVaultAddress(wethVault.address);
    });

    describe("when oracle has not been updated within a day", function () {
        beforeEach(async function () {
            // Set the last update to be older than one day
            const oldTimestamp = (await ethers.provider.getBlock("latest")).timestamp - (86400 * 2); // 2 day ago
            await mockOracle.setLastUpdatedTotalYieldAccrued(oldTimestamp);
        });

        it("should revert", async function () {
            const assets = ethers.utils.parseEther("1");
            const shares = 100;

            await expect(
                wethVault.proxyDeposit(owner.address, owner.address, assets, shares, { value: ethers.utils.parseEther("0.1") })
            ).to.be.revertedWith("WETHVault: Oracle is out of date.");
        });
    });


    describe("when oracle has been updated within a day", function () {
        beforeEach(async function () {
            // Set the last update to current timestamp
            await mockOracle.setLastUpdatedTotalYieldAccrued((await ethers.provider.getBlock("latest")).timestamp);
        });


        describe("when queableDepositsLimitEnabled is true", function () {
            beforeEach(async function () {
                await wethVault.connect(owner).setQueueableDepositsLimitEnabled(true);
            });
            describe("when there is no OD balance", function () {
                describe("when the message value is less than the deposit limit", async function () {
                    it("should allow deposits", async function () {
                        const assets = ethers.utils.parseEther("0");
                        const shares = 100;
                        await mockRocketDepositPool.setExcessBalance(ethers.utils.parseEther("9"));

                        await expect(wethVault.proxyDeposit(owner.address, owner.address, assets, shares, { value: ethers.utils.parseEther("1") })).to.not.be.reverted;
                    });
                });

                describe("when the message value is equal to the deposit limit", function () {
                    it("should allow deposits", async function () {
                        const assets = ethers.utils.parseEther("0");
                        const shares = 100;
                        await mockRocketDepositPool.setExcessBalance(ethers.utils.parseEther("3"));

                        await expect(wethVault.proxyDeposit(owner.address, owner.address, assets, shares, { value: ethers.utils.parseEther("1") })).to.not.be.reverted;
                    });
                });

                describe("when the message value is greater than the deposit limit", function () {
                    it("should revert", async function () {
                        const assets = ethers.utils.parseEther("0");
                        const shares = 100;
                        await mockRocketDepositPool.setExcessBalance(ethers.utils.parseEther("0.3"));

                        await expect(wethVault.proxyDeposit(owner.address, owner.address, assets, shares, { value: ethers.utils.parseEther("1") })).to.be.revertedWith("WETHVault: Deposit exceeds the TVL queueable limit.");
                    });
                });
            });

            describe("when there is OD balance", function () {
                beforeEach(async function () {
                    // Send ETH to OD contract
                    const tx = await owner.sendTransaction({
                        to: mockOperatorDistributor.address,
                        value: ethers.utils.parseEther("1"),
                    });
                    await tx.wait();

                    await mockRocketDepositPool.setExcessBalance(ethers.utils.parseEther("9"));
                });
                describe("when the message value is less than the deposit limit", async function () {
                    it("should allow deposits", async function () {
                        const assets = ethers.utils.parseEther("0");
                        const shares = 100;

                        await expect(wethVault.proxyDeposit(owner.address, owner.address, assets, shares, { value: ethers.utils.parseEther("1") })).to.not.be.reverted;
                    });
                });

                describe("when the message value is equal to the deposit limit", function () {
                    it("should allow deposits", async function () {
                        const assets = ethers.utils.parseEther("0");
                        const shares = 100;

                        await expect(wethVault.proxyDeposit(owner.address, owner.address, assets, shares, { value: ethers.utils.parseEther("2") })).to.not.be.reverted;
                    });
                });

                describe("when the message value is greater than the deposit limit", function () {
                    it("should revert", async function () {
                        const assets = ethers.utils.parseEther("0");
                        const shares = 100;

                        await expect(wethVault.proxyDeposit(owner.address, owner.address, assets, shares, { value: ethers.utils.parseEther("3") })).to.be.revertedWith("WETHVault: Deposit exceeds the TVL queueable limit.");
                    });
                });
            });
        });
    });
});