import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

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

        describe("when the current streaming interval is not finished", function() {
            it("reverts", async function () {
                // Only way to set lastClaimTime is to actually claim
                const tx1 = await mockRplToken.connect(owner).transfer(merkleClaimStreamer.address, ethers.utils.parseEther("1"));
                await tx1.wait();
                const tx2 = await mockRplToken.connect(owner).transfer(pusher.address, ethers.utils.parseEther("0.28"));
                await tx2.wait();
                await merkleClaimStreamer.connect(owner).submitMerkleClaim(
                    [ethers.utils.parseEther("1")],
                    [ethers.utils.parseEther("1")],
                    [ethers.utils.parseEther("1")],
                    [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
                )

                await expect(
                    merkleClaimStreamer.connect(owner).sweepLockedTVL()
                ).to.be.revertedWith("Current streaming interval is not finished");
            });
        });

        describe("when the current streaming interval is finished", function() {
            describe("when the priorEthStreamAmount is zero", function() {
                it("updates the stream amount variables", async function() {
                    // Set RPL token balance
                    await mockRplToken.setBalance(merkleClaimStreamer.address, ethers.utils.parseEther("1"));

                    expect(await merkleClaimStreamer.priorEthStreamAmount()).to.equal(0);

                    await merkleClaimStreamer.connect(owner).sweepLockedTVL();

                    expect(await merkleClaimStreamer.priorRplStreamAmount()).to.equal(
                        ethers.utils.parseEther("1")
                    );
                });
            });

            describe("when the priorRplStreamAmount is zero", function() {
                it("updates the stream amount variables", async function() {
                    // Set ETH balance
                    await owner.sendTransaction({
                        to: merkleClaimStreamer.address,
                        value: ethers.utils.parseEther("5"),
                    });

                    expect(await merkleClaimStreamer.priorRplStreamAmount()).to.equal(0);

                    await merkleClaimStreamer.connect(owner).sweepLockedTVL();

                    // Validate that ETH stream amount is updated
                    expect(await merkleClaimStreamer.priorEthStreamAmount()).to.equal(
                        ethers.utils.parseEther("5")
                    );
                });
            });

            describe("when neither priorEthStreamAmount nor priorRplStreamAmount is zero", function() {
                beforeEach(async function () {
                    // Transfer ETH and RPL to the MerkleClaimStreamer contract
                    await owner.sendTransaction({
                        to: merkleClaimStreamer.address,
                        value: ethers.utils.parseEther("6"),
                    });
                    await mockRplToken.transfer(merkleClaimStreamer.address, ethers.utils.parseEther("9"));

                    // Initial call is to make sure that the prior amounts are non zero since there is no way to set them directly
                    await merkleClaimStreamer.connect(owner).sweepLockedTVL();

                    expect(await merkleClaimStreamer.priorEthStreamAmount()).to.equal(
                        ethers.utils.parseEther("6")
                    );
                    expect(await merkleClaimStreamer.priorRplStreamAmount()).to.equal(
                        ethers.utils.parseEther("9")
                    );
                });

                it("transfers tokens and zeroes the stream amount variables", async function() {
                    await merkleClaimStreamer.connect(owner).sweepLockedTVL();

                    // Validate that the ETH/RPL were transferred
                    expect(await ethers.provider.getBalance(mockOperatorDistributor.address)).to.equal(
                        ethers.utils.parseEther("6")
                    );
                    expect(await mockRplToken.balanceOf(mockOperatorDistributor.address)).to.equal(
                        ethers.utils.parseEther("9")
                    );

                    // Ensure the stream variables are reset to zero
                    expect(await merkleClaimStreamer.priorEthStreamAmount()).to.equal(0);
                    expect(await merkleClaimStreamer.priorRplStreamAmount()).to.equal(0);
                });
            });
        });
    });
});