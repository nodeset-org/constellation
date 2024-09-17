import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("OperatorDistributor.processNextMinipool", function () {
    let operatorDistributor: Contract;
    let mockDirectory: Contract;
    let mockRocketNodeStaking: Contract;
    let priceFetcher: Contract;
    let mockRplToken: Contract;
    let mockRocketDAOProtocolSettingsRewards: Contract;
    let mockSuperNode: Contract;
    let mockWETHToken: Contract;
    let mockWETHVault: Contract;
    let owner: any;
    let subNodeOperator: any;

    beforeEach(async function () {
        [owner, subNodeOperator] = await ethers.getSigners();

        // Deploy mocks
        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();

        const MockRocketNodeStaking = await ethers.getContractFactory("MockRocketNodeStaking");
        mockRocketNodeStaking = await MockRocketNodeStaking.deploy();
        await mockRocketNodeStaking.deployed();

        const PriceFetcher = await ethers.getContractFactory("MockPriceFetcher");
        priceFetcher = await PriceFetcher.deploy();
        await priceFetcher.deployed();

        const MockRplToken = await ethers.getContractFactory("MockErc20");
        mockRplToken = await MockRplToken.deploy("Mock RPL", "RPL", ethers.utils.parseEther("1"));
        await mockRplToken.deployed();

        const MockRocketDAOProtocolSettingsRewards = await ethers.getContractFactory("MockRocketDAOProtocolSettingsRewards");
        mockRocketDAOProtocolSettingsRewards = await MockRocketDAOProtocolSettingsRewards.deploy();
        await mockRocketDAOProtocolSettingsRewards.deployed();

        const MockWETHToken = await ethers.getContractFactory("MockWEth");
        mockWETHToken = await MockWETHToken.deploy();
        await mockWETHToken.deployed();

        const MockWETHVault = await ethers.getContractFactory("MockWETHVault");
        mockWETHVault = await MockWETHVault.deploy();
        await mockWETHVault.deployed()

        const MockSuperNode = await ethers.getContractFactory("MockSuperNode");
        mockSuperNode = await MockSuperNode.deploy();
        await mockSuperNode.deployed();

        // Set addresses
        await mockDirectory.setSuperNodeAddress(mockSuperNode.address);
        await mockDirectory.setRocketNodeStakingAddress(mockRocketNodeStaking.address);
        await mockDirectory.setPriceFetcherAddress(priceFetcher.address);
        await mockDirectory.setRPLAddress(mockRplToken.address);
        await mockDirectory.setRocketDAOProtocolSettingRewardsAddress(mockRocketDAOProtocolSettingsRewards.address);
        await mockDirectory.setWETHAddress(mockWETHToken.address);
        await mockDirectory.setWETHVaultAddress(mockWETHVault.address);

        // Set roles
        await mockDirectory.setRole(AdminRole, owner.address, true);
        await mockDirectory.setRole(CoreProtocolRole, owner.address, true);

        const OperatorDistributor = await ethers.getContractFactory("OperatorDistributor");
        operatorDistributor = await upgrades.deployProxy(OperatorDistributor, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });
        await mockDirectory.setRole(CoreProtocolRole, operatorDistributor.address, true);
    });

    describe("when the next minipool address is the zero address", function () {
        it("does nothing", async function () {
            await expect(operatorDistributor.processNextMinipool()).to.not.be.reverted;
        });
    });

    describe("when the next minipool address is not the zero address", function () {
        let mockMinipool: Contract;

        beforeEach(async function () {
            const MinipoolContract = await ethers.getContractFactory("MockMinipool");
            mockMinipool = await MinipoolContract.deploy();
            await expect(mockSuperNode.setMinipools([mockMinipool.address])).to.not.be.reverted;
            await expect(mockSuperNode.setNumMinipools(1)).to.not.be.reverted;
        });

        describe("when minipool processing is not enabled", function () {
            beforeEach(async function () {
                await expect(operatorDistributor.setMinipoolProcessingEnabled(false)).to.not.be.reverted;
            });

            it("does nothing", async function () {
                await expect(operatorDistributor.processNextMinipool()).to.not.be.reverted;
            });
        });

        describe("when minipool processing is enabled", function () {
            beforeEach(async function () {
                await expect(operatorDistributor.setMinipoolProcessingEnabled(true)).to.not.be.reverted;
            });

            describe("when the minipool balance is zero", function () {
                it("does nothing", async function () {
                    await expect(operatorDistributor.processNextMinipool()).to.not.be.reverted;
                });
            });

            describe("when the minipool balance is not zero", function () {
                beforeEach(async function () {
                    const tx = await owner.sendTransaction({
                        to: mockMinipool.address,
                        value: ethers.utils.parseEther("1")
                    });
                    await tx.wait();
                });

                describe("when the minipool is not managed by Constellation", function () {
                    beforeEach(async function () {
                        await expect(mockSuperNode.setIsMinipoolRecognized(mockMinipool.address, false)).to.not.be.reverted;
                    });

                    it("reverts", async function () {
                        await expect(operatorDistributor.processNextMinipool()).to.be.revertedWith("Must be a minipool managed by Constellation");
                    });
                });

                describe("when the minipool is managed by Constellation", function () {
                    beforeEach(async function () {
                        await expect(mockSuperNode.setIsMinipoolRecognized(mockMinipool.address, true)).to.not.be.reverted;
                    });

                    describe("when the minipool is finalised", function () {
                        it("does nothing", async function () {
                            await expect(mockMinipool.setFinalised(true)).to.not.be.reverted;
                            await expect(mockMinipool.setStaking()).to.not.be.reverted;

                            await expect(operatorDistributor.processNextMinipool()).to.not.be.reverted;
                        });
                    });

                    describe("when the status is not Staking", function () {
                        it("does nothing", async function () {
                            await expect(mockMinipool.setFinalised(false)).to.not.be.reverted;
                            await expect(mockMinipool.setPrelaunch()).to.not.be.reverted;

                            await expect(operatorDistributor.processNextMinipool()).to.not.be.reverted;
                        });
                    });

                    describe("when the minipool is not finalised and the status is Staking", function () {
                        beforeEach(async function () {
                            await expect(mockMinipool.setFinalised(false)).to.not.be.reverted;
                            await expect(mockMinipool.setStaking()).to.not.be.reverted;
                        });

                        describe("when the post-refund balance is greater than deposit balance", function () {
                            describe("when the minipool balance is less than the launch balance", function () {
                                it.only("emits a suspected penalized minipool exit message", async function () {
                                    await expect(operatorDistributor.processNextMinipool()).to.not.be.reverted;
                                });
                            });

                            describe("when the minipool balance is equal to the launch balance", function () {
                                it("distributes and rebalances the vaults", async function () {
                                });
                            });

                            describe("when the minipool balance is greater than the launch balance", function () {
                                it("distributes and rebalances the vaults", async function () {
                                });
                            });
                        });

                        describe("when the post-refund balance is equal to deposit balance", function () {
                            describe("when the minipool balance is less than the launch balance", function () {
                                it("emits a suspected penalized minipool exit message", async function () {
                                });
                            });

                            describe("when the minipool balance is equal to the launch balance", function () {
                                it("distributes and rebalances the vaults", async function () {
                                });
                            });

                            describe("when the minipool balance is greater than the launch balance", function () {
                                it("distributes and rebalances the vaults", async function () {
                                });
                            });
                        });

                        describe("when the post-refund balance is less than deposit balance", function () {
                            it("distributes and rebalances the vaults", async function () {
                            });
                        });
                    });
                });
            });
        });
    });
});