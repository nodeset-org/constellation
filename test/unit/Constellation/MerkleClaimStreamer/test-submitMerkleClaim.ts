import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

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

        const MerkleClaimStreamer = await ethers.getContractFactory("MerkleClaimStreamer");
        merkleClaimStreamer = await upgrades.deployProxy(MerkleClaimStreamer, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });
    });

    describe("when merkleClaimsEnabled is true", function ()  {
        describe("when ethReward is greater than 0", function ()  {
            describe("when balance is not sufficient to send to treasury", function ()  {
                it("should revert", async function ()  {
                });
            });
            describe("when balance is not sufficient to send to operator reward", function ()  {
                it("should revert", async function ()  {
                });
            });
            describe("when balance is sufficient to send to treasury and operator reward", function ()  {
                it("emits an event and sends ETH", async function ()  {
                });
            });

        });

        describe("when rplReward is greater than 0", function ()  {
            it("emits an event and sends RPL to the treasury", async function ()  {
            });
        });

        describe("when both rplReward and ethReward are less than 0 ", function ()  {
            it("emits an event and sends no rewards", async function ()  {
            });
        });
    });

    describe("when merkleClaimsEnabled is false", function ()  {
        it("should revert", async function ()  {
        });
    });
});