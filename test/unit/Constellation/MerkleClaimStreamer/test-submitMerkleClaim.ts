import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));

describe("MerkleClaimStreamer.submitMerkleClaim", function () {
    let merkleClaimStreamer: Contract;
    let mockDirectory: Contract;
    let owner: any;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        // Deploy mocks
        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();
        await mockDirectory.setRole(AdminRole, owner.address, true);

        const MerkleClaimStreamer = await ethers.getContractFactory("MerkleClaimStreamer");
        merkleClaimStreamer = await upgrades.deployProxy(MerkleClaimStreamer, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });
    });

    describe("when merkleClaimsEnabled is true", function() {
        describe("when ethReward is greater than 0", function() {
            describe("when balance is not sufficient to send to treasury", function() {
                it("should revert", async function() {
                    await merkleClaimStreamer.submitMerkleClaim(
                        [ethers.utils.parseEther("1")],
                        [ethers.utils.parseEther("1")],
                        [ethers.utils.parseEther("1")],
                        [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
                    );
                });
            });
            describe("when balance is not sufficient to send to operator reward", function() {
                it("should revert", async function() {
                });
            });
            describe("when balance is sufficient to send to treasury and operator reward", function() {
                it("emits an event and sends ETH", async function() {
                });
            });
        });

        describe("when rplReward is greater than 0", function() {
            it("emits an event and sends RPL to the treasury", async function() {
            });
        });

        describe("when both rplReward and ethReward are less than 0 ", function() {
            it("emits an event and sends no rewards", async function() {
            });
        });
    });

    describe("when merkleClaimsEnabled is false", function() {
        beforeEach(async function () {
            await merkleClaimStreamer.connect(owner).setMerkleClaimsEnabled(false);
        });

        it.only("should revert", async function() {
            await expect(merkleClaimStreamer.submitMerkleClaim(
                [ethers.utils.parseEther("1")],
                [ethers.utils.parseEther("1")],
                [ethers.utils.parseEther("1")],
                [["0x0000000000000000000000000000000000000000000000000000000000000000"]]
            )).to.be.revertedWith("Merkle claims are disabled");
        });
    });
});