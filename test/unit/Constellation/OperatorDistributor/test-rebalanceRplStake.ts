import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("OperatorDistributor.rebalanceRplStake", function () {
    let operatorDistributor: Contract;
    let mockDirectory: Contract;
    let mockRocketNodeStaking: Contract;
    let priceFetcher: Contract;
    let mockRplToken: Contract;
    let mockRocketDAOProtocolSettingsRewards: Contract;
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

        // Set addresses
        await mockDirectory.setSuperNodeAddress(subNodeOperator.address)
        await mockDirectory.setRocketNodeStakingAddress(mockRocketNodeStaking.address);
        await mockDirectory.setPriceFetcherAddress(priceFetcher.address);
        await mockDirectory.setRPLAddress(mockRplToken.address);
        await mockDirectory.setRocketDAOProtocolSettingRewardsAddress(mockRocketDAOProtocolSettingsRewards.address);

        // Set roles
        await mockDirectory.setRole(AdminRole, owner.address, true);
        await mockDirectory.setRole(CoreProtocolRole, owner.address, true);
        await mockDirectory.setRole(CoreProtocolRole, owner.address, true);

        const OperatorDistributor = await ethers.getContractFactory("OperatorDistributor");
        operatorDistributor = await upgrades.deployProxy(OperatorDistributor, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });
        await mockDirectory.setRole(CoreProtocolRole, operatorDistributor.address, true);
    });

    describe("when the caller does not have protocol role", function () {
        it("reverts", async function () {
            await expect(
                operatorDistributor
            .connect(subNodeOperator)
            .rebalanceRplStake(ethers.utils.parseEther("1"))).to.be.revertedWith('Can only be called by Protocol!');
        });
    });

    describe("when the caller has protocol role", function () {
        describe("when the targetStake is greater than the rplStaked", function () {
            beforeEach(async function () {
                mockRocketNodeStaking.setNodeRPLLocked(subNodeOperator.address, ethers.utils.parseEther("0"));
                priceFetcher.setPrice(ethers.utils.parseEther("1"));
            });
            describe("when there is enough RPL in the contract to reach the target stake", function () {
                it("stakes RPL to the target stake", async function () {
                    mockRocketNodeStaking.setNodeRplStake(subNodeOperator.address, ethers.utils.parseEther("0"));
                    mockRplToken.setBalance(operatorDistributor.address, ethers.utils.parseEther("10000000000"));

                    let beforeStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    await expect(
                        operatorDistributor
                    .connect(owner)
                    .rebalanceRplStake(ethers.utils.parseEther("1"))).to.not.be.reverted;
                    let afterStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);

                    expect(afterStakeAmount.toBigInt() - beforeStakeAmount.toBigInt()).to.be.equal(ethers.utils.parseEther("0.6").toBigInt());
                });
            });
            describe("when there is not enough RPL in the contract to reach the target stake", function () {
                it("stakes as much RPL as possible", async function () {
                    mockRocketNodeStaking.setNodeRplStake(subNodeOperator.address, ethers.utils.parseEther("0"));
                    mockRplToken.setBalance(operatorDistributor.address, ethers.utils.parseEther("0.01"));

                    let beforeStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    await expect(
                        operatorDistributor
                    .connect(owner)
                    .rebalanceRplStake(ethers.utils.parseEther("1"))).to.not.be.reverted;

                    let afterStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    expect(afterStakeAmount.toBigInt() - beforeStakeAmount.toBigInt()).to.be.equal(ethers.utils.parseEther("0.01").toBigInt());
                });
            });
        });
        describe("when the targetStake is less than the rplStaked", function () {
            beforeEach(async function () {
                mockRocketNodeStaking.setNodeRPLLocked(subNodeOperator.address, ethers.utils.parseEther("0"));
            });
            describe("when not enough time has passed to meet rewards claim interval", function () {
                it("does nothing", async function () {
                    mockRocketNodeStaking.setNodeRplStake(subNodeOperator.address, ethers.utils.parseEther("1"));
                    mockRocketNodeStaking.setNodeRPLStakedTime(subNodeOperator.address, 1);
                    mockRocketDAOProtocolSettingsRewards.setRewardsClaimIntervalTime(9999999999);

                    let beforeStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    await expect(
                        operatorDistributor
                    .connect(owner)
                    .rebalanceRplStake(ethers.utils.parseEther("1"))).to.not.be.reverted;

                    let afterStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    expect(afterStakeAmount.toBigInt() - beforeStakeAmount.toBigInt()).to.be.equal(ethers.utils.parseEther("0").toBigInt());
                });
            });
            describe("when there is shortfall", function () {
                it("does nothing", async function () {
                    mockRocketNodeStaking.setNodeRplStake(subNodeOperator.address, ethers.utils.parseEther("1"));
                    mockRocketNodeStaking.setNodeRPLStakedTime(subNodeOperator.address, 1);
                    mockRocketDAOProtocolSettingsRewards.setRewardsClaimIntervalTime(1);
                    mockRocketNodeStaking.setNodeMaximumRPLStake(subNodeOperator.address, ethers.utils.parseEther("10"));

                    let beforeStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    await expect(
                        operatorDistributor
                    .connect(owner)
                    .rebalanceRplStake(ethers.utils.parseEther("1"))).to.not.be.reverted;

                    let afterStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    expect(afterStakeAmount.toBigInt() - beforeStakeAmount.toBigInt()).to.be.equal(ethers.utils.parseEther("0").toBigInt());
                });
            });
            describe("when there is no shortfall and enough time has passed", function () {
                it("unstakes RPL", async function () {
                    mockRocketNodeStaking.setNodeRplStake(subNodeOperator.address, ethers.utils.parseEther("1"));
                    mockRocketNodeStaking.setNodeRPLStakedTime(subNodeOperator.address, 1);
                    mockRocketDAOProtocolSettingsRewards.setRewardsClaimIntervalTime(0);

                    let beforeStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    await expect(
                        operatorDistributor
                    .connect(owner)
                    .rebalanceRplStake(ethers.utils.parseEther("1"))).to.not.be.reverted;

                    let afterStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                    expect(beforeStakeAmount.toBigInt() - afterStakeAmount.toBigInt()).to.be.equal(ethers.utils.parseEther("1").toBigInt());
                });
            });
        });
        describe("when the targetStake is equal to the rplStaked", function () {
            beforeEach(async function () {
                mockRocketNodeStaking.setNodeRPLLocked(subNodeOperator.address, ethers.utils.parseEther("0"));
                priceFetcher.setPrice(ethers.utils.parseEther("1"));
            });
            it("does nothing", async function () {
                mockRocketNodeStaking.setNodeRplStake(subNodeOperator.address, ethers.utils.parseEther("0.6"));
                mockRocketNodeStaking.setNodeRPLStakedTime(subNodeOperator.address, 1);
                mockRocketDAOProtocolSettingsRewards.setRewardsClaimIntervalTime(0);

                let beforeStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                await expect(
                    operatorDistributor
                .connect(owner)
                .rebalanceRplStake(ethers.utils.parseEther("1"))).to.not.be.reverted;

                let afterStakeAmount = await mockRocketNodeStaking.getNodeRPLStake(subNodeOperator.address);
                expect(beforeStakeAmount.toBigInt() - afterStakeAmount.toBigInt()).to.be.equal(ethers.utils.parseEther("0").toBigInt());

            });
        });
    });
});
