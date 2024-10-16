import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("MerkleClaimStreamer.sweepLockedTVL", function () {
    let merkleClaimStreamer: Contract;
    let mockDirectory: Contract;
    let mockOperatorDistributor: Contract;
    let mockRplToken: Contract;
    let mockWETHToken: Contract;
    let mockWETHVault: Contract;
    let mockTreasury: Contract;
    let mockOperatorReward: Contract;
    let mockRPLVault: Contract;
    let pusher: Contract;
    let owner: any;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        // Deploy mocks
        const MockRplToken = await ethers.getContractFactory("MockErc20");
        mockRplToken = await MockRplToken.deploy('Mock RPL', 'RPL', ethers.utils.parseEther("1000"));
        await mockRplToken.deployed();

        const MockRPLVault = await ethers.getContractFactory("MockRPLVault");
        mockRPLVault = await MockRPLVault.deploy();
        await mockRPLVault.deployed

        const Pusher = await ethers.getContractFactory("Pusher");
        pusher = await Pusher.deploy();
        await pusher.deployed();
        await pusher.setRplToken(mockRplToken.address);

        const MockTreasury = await ethers.getContractFactory("MockTreasury");
        mockTreasury = await MockTreasury.deploy();
        await mockTreasury.deployed();

        const MockOperatorReward = await ethers.getContractFactory("MockOperatorReward");
        mockOperatorReward = await MockOperatorReward.deploy();
        await mockOperatorReward.deployed();

        const MockOperatorDistributor = await ethers.getContractFactory("MockOperatorDistributor");
        mockOperatorDistributor = await MockOperatorDistributor.deploy();
        await mockOperatorDistributor.deployed();
        mockOperatorDistributor.setPusherAddress(pusher.address);

        const MockWETHToken = await ethers.getContractFactory("MockWEth");
        mockWETHToken = await MockWETHToken.deploy();
        await mockWETHToken.deployed();

        const MockWETHVault = await ethers.getContractFactory("MockWETHVault");
        mockWETHVault = await MockWETHVault.deploy();
        await mockWETHVault.deployed()

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();

        await mockDirectory.setRole(AdminRole, owner.address, true);

        await mockDirectory.setOperatorDistributorAddress(mockOperatorDistributor.address);
        await mockDirectory.setRPLAddress(mockRplToken.address);
        await mockDirectory.setWETHAddress(mockWETHToken.address);
        await mockDirectory.setWETHVaultAddress(mockWETHVault.address);
        await mockDirectory.setTreasuryAddress(mockTreasury.address);
        await mockDirectory.setOperatorRewardAddress(mockOperatorReward.address);
        await mockDirectory.setRPLVaultAddress(mockRPLVault.address);

        const MerkleClaimStreamer = await ethers.getContractFactory("MerkleClaimStreamer");
        merkleClaimStreamer = await upgrades.deployProxy(MerkleClaimStreamer, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });
        await mockDirectory.setRole(CoreProtocolRole, merkleClaimStreamer.address, true);
    });

    describe("when sender is not protocol", function() {
        it("reverts", async function() {
            await expect(merkleClaimStreamer.connect(owner).sweepLockedTVL()).to.be.revertedWith("Can only be called by Protocol!");
        });
    });
    describe("when sender is protocol", function() {
        beforeEach(async function () {
            await mockDirectory.setRole(CoreProtocolRole, owner.address, true);
        });

        describe("when the priorEthStreamAmount is zero", function() {
            it("updates the stream amount variables", async function() {
            });
        });

        describe("when the priorRplStreamAmount is zero", function() {
            it("updates the stream amount variables", async function() {
            });
        });

        describe("when neither priorEthStreamAmount nor priorRplStreamAmount is zero", function() {
            it("transfers tokens and then updates the stream amount variables", async function() {
            });
        });
    });
});