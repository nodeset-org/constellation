import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("OperatorDistributor.onEthBeaconRewardsReceived", function () {
    let operatorDistributor: Contract;
    let mockDirectory: Contract;
    let treasury: Contract;
    let operatorReward: Contract
    let owner: any;
    let subNodeOperator: any;

    beforeEach(async function () {
        [owner, subNodeOperator] = await ethers.getSigners();

        // Deploy mocks
        const MockTreasury = await ethers.getContractFactory("MockTreasuryV2");
        treasury = await MockTreasury.deploy();
        await treasury.deployed();

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();

        const MockOperatorReward = await ethers.getContractFactory("MockOperatorReward");
        operatorReward = await MockOperatorReward.deploy();
        await operatorReward.deployed();

        // Set directory addresses
        await mockDirectory.setTreasuryAddress(treasury.address);
        await mockDirectory.setOperatorRewardAddress(operatorReward.address);

        // Set roles
        await mockDirectory.setRole(AdminRole, owner.address, true);
        await mockDirectory.setRole(CoreProtocolRole, owner.address, true);

        const OperatorDistributor = await ethers.getContractFactory("OperatorDistributor");
        operatorDistributor = await upgrades.deployProxy(OperatorDistributor, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });
        await operatorDistributor.setMinimumStakeRatio(ethers.utils.parseEther("0.15"));
    });

    describe("when caller is not protocol", async function () {
        it.only("should revert", async function () {
            await expect(operatorDistributor.connect(subNodeOperator).onEthBeaconRewardsReceived(
                ethers.utils.parseEther("1"),
                ethers.utils.parseEther("1"),
                ethers.utils.parseEther("1"),
            )).to.be.revertedWith("Can only be called by Protocol!");
        });
    });

    describe("when caller is protocol", async function () {
        describe("when the reward amount is 0", async function () {
            it.only("does nothing", async function () {
                await expect(operatorDistributor.connect(owner).onEthBeaconRewardsReceived(
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("1"),
                    ethers.utils.parseEther("1"),
                )).to.not.be.reverted;
            });
        });
        describe("when the reward amount is not 0", async function () {
            describe("when the transfer to treasury fails", async function () {
                it("reverts", async function () {
                });
            });
            describe("when the transfer to node operator fails", async function () {
                it("reverts", async function () {
                });
            });
            describe("when both transfer succeeds", async function () {
                it("increases the oracleError amount", async function () {
                });
            });
        });

    });
});