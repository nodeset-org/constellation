import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("MerkleClaimStreamer.submitMerkleClaim", function () {
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

    describe("when merkleClaimsEnabled is true", function() {
        describe("when ethReward is greater than 0", function() {
            describe("when balance is not sufficient to send to treasury", function() {
                it("should revert", async function() {
                    // Set the ethReward amount to 1 ETH
                    const tx = await owner.sendTransaction({
                        to: pusher.address,
                        value: ethers.utils.parseEther("1")
                    });
                    await tx.wait();

                    await expect(merkleClaimStreamer.submitMerkleClaim(
                        [ethers.utils.parseEther("1")],
                        [ethers.utils.parseEther("1")],
                        [ethers.utils.parseEther("1")],
                        [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
                    )).to.be.revertedWith("Transfer to treasury failed");
                });
            });
            describe("when balance is not sufficient to send to operator reward", function() {
                it("should revert", async function() {
                    // Only have enough ETH to send to treasury
                    const tx1 = await owner.sendTransaction({
                        to: merkleClaimStreamer.address,
                        value: ethers.utils.parseEther("0.5")
                    });
                    await tx1.wait();

                    // Set the ethReward amount to 1 ETH
                    const tx2 = await owner.sendTransaction({
                        to: pusher.address,
                        value: ethers.utils.parseEther("1")
                    });
                    await tx2.wait();

                    await expect(merkleClaimStreamer.submitMerkleClaim(
                        [ethers.utils.parseEther("1")],
                        [ethers.utils.parseEther("1")],
                        [ethers.utils.parseEther("1")],
                        [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
                    )).to.be.revertedWith("Transfer to operator reward address failed");

                });
            });
            describe("when balance is sufficient to send to treasury and operator reward", function() {
                it("emits an event and sends ETH", async function() {
                    const tx1 = await owner.sendTransaction({
                        to: merkleClaimStreamer.address,
                        value: ethers.utils.parseEther("100")
                    });
                    await tx1.wait();

                    // Set the ethReward amount to 1 ETH
                    const tx2 = await owner.sendTransaction({
                        to: pusher.address,
                        value: ethers.utils.parseEther("1")
                    });
                    await tx2.wait();

                    await expect(merkleClaimStreamer.submitMerkleClaim(
                        [ethers.utils.parseEther("1")],
                        [ethers.utils.parseEther("1")],
                        [ethers.utils.parseEther("1")],
                        [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
                    )).to.emit(merkleClaimStreamer, "MerkleClaimSubmitted")
                    .withArgs(
                        anyValue, // block timestamp
                        ethers.utils.parseEther("1"),
                        ethers.utils.parseEther("0"),
                        ethers.utils.parseEther("0.5"),
                        ethers.utils.parseEther("0.5"),
                        ethers.utils.parseEther("0")
                    )

                    expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.utils.parseEther("0.5"));
                    expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.utils.parseEther("0.5"));
                });
            });
        });

        describe("when rplReward is greater than 0", function() {
            it("emits an event and sends RPL to the treasury", async function() {
                const tx1 = await mockRplToken.connect(owner).transfer(merkleClaimStreamer.address, ethers.utils.parseEther("1"));
                await tx1.wait();

                const tx2 = await mockRplToken.connect(owner).transfer(pusher.address, ethers.utils.parseEther("0.28"));
                await tx2.wait();

                await expect(merkleClaimStreamer.submitMerkleClaim(
                    [ethers.utils.parseEther("1")],
                    [ethers.utils.parseEther("1")],
                    [ethers.utils.parseEther("1")],
                    [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
                )).to.emit(merkleClaimStreamer, "MerkleClaimSubmitted")
                .withArgs(
                    anyValue, // block timestamp
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("0.28"),
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("0.28")
                )

                expect(await mockRplToken.balanceOf(mockTreasury.address)).to.equal(ethers.utils.parseEther("0.28"));
            });
        });

        describe("when both rplReward and ethReward are less than 0 ", function() {
            it("emits an event and sends no rewards", async function() {
                // Fund the merkle claim streamer just in case
                const tx1 = await mockRplToken.connect(owner).transfer(merkleClaimStreamer.address, ethers.utils.parseEther("1"));
                await tx1.wait();

                const tx2 = await owner.sendTransaction({
                    to: merkleClaimStreamer.address,
                    value: ethers.utils.parseEther("100")
                });
                await tx2.wait();

                await expect(merkleClaimStreamer.submitMerkleClaim(
                    [ethers.utils.parseEther("1")],
                    [ethers.utils.parseEther("1")],
                    [ethers.utils.parseEther("1")],
                    [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
                )).to.emit(merkleClaimStreamer, "MerkleClaimSubmitted")
                .withArgs(
                    anyValue, // block timestamp
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("0")
                )
                expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.utils.parseEther("0"));
                expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.utils.parseEther("0"));
                expect(await mockRplToken.balanceOf(mockTreasury.address)).to.equal(ethers.utils.parseEther("0.0"));

            });
        });
    });

    describe("when merkleClaimsEnabled is false", function() {
        beforeEach(async function () {
            await merkleClaimStreamer.connect(owner).setMerkleClaimsEnabled(false);
        });

        it("should revert", async function() {
            await expect(merkleClaimStreamer.submitMerkleClaim(
                [ethers.utils.parseEther("1")],
                [ethers.utils.parseEther("1")],
                [ethers.utils.parseEther("1")],
                [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
            )).to.be.revertedWith("Merkle claims are disabled");
        });
    });
});