import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("OperatorDistributor.onEthBeaconRewardsReceived", function () {
    let operatorDistributor: Contract;
    let mockDirectory: Contract;
    let mockTreasury: Contract;
    let mockOperatorReward: Contract
    let owner: any;
    let subNodeOperator: any;

    beforeEach(async function () {
        [owner, subNodeOperator] = await ethers.getSigners();
        // Deploy mocks
        const MockTreasury = await ethers.getContractFactory("MockTreasury");
        mockTreasury = await MockTreasury.deploy();
        await mockTreasury.deployed();

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();

        const MockOperatorReward = await ethers.getContractFactory("MockOperatorReward");
        mockOperatorReward = await MockOperatorReward.deploy();
        await mockOperatorReward.deployed();

        // Set directory addresses
        await mockDirectory.setTreasuryAddress(mockTreasury.address);
        await mockDirectory.setOperatorRewardAddress(mockOperatorReward.address);

        // Set roles
        await mockDirectory.setRole(AdminRole, owner.address, true);
        await mockDirectory.setRole(CoreProtocolRole, owner.address, true);

        const OperatorDistributor = await ethers.getContractFactory("OperatorDistributor");
        operatorDistributor = await upgrades.deployProxy(OperatorDistributor, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });

        await mockDirectory.setOperatorDistributorAddress(operatorDistributor.address);
        await mockDirectory.setRole(CoreProtocolRole, operatorDistributor.address, true);

        // Fund operator distributor for sending ETH
        const tx = await owner.sendTransaction({
            to: operatorDistributor.address,
            value: ethers.utils.parseEther("100")
          });
          await tx.wait();

    });

    describe("when caller is not protocol", function () {
        it("should revert", async function () {
            expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
            expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));

            await expect(operatorDistributor.connect(subNodeOperator).onEthBeaconRewardsReceived(
                ethers.utils.parseEther("1"),
                ethers.utils.parseEther("1"),
                ethers.utils.parseEther("1"),
            )).to.be.revertedWith("Can only be called by Protocol!");

            expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
            expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));
            expect(await operatorDistributor.oracleError()).to.equal(ethers.BigNumber.from("0"));
        });
    });

    describe("when caller is protocol", function () {
        describe("when the reward amount is 0", async function () {
            it("does nothing", async function () {
                expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
                expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));

                await expect(operatorDistributor.connect(owner).onEthBeaconRewardsReceived(
                    ethers.utils.parseEther("0"),
                    ethers.utils.parseEther("1"),
                    ethers.utils.parseEther("1"),
                )).to.not.be.reverted;

                expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
                expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));
                expect(await operatorDistributor.oracleError()).to.equal(ethers.BigNumber.from("0"));
            });
        });
        describe("when the reward amount is not 0", function () {
            describe("when the transfer to treasury fails", async function () {
                it("reverts", async function () {
                    await expect(mockTreasury.setRejectCall(true)).to.not.be.reverted;
                    await expect(mockOperatorReward.setRejectCall(false)).to.not.be.reverted;

                    expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
                    expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));

                    await expect(operatorDistributor.connect(owner).onEthBeaconRewardsReceived(
                        ethers.utils.parseEther("1"),
                        ethers.utils.parseEther("1"),
                        ethers.utils.parseEther("1"),
                    )).to.be.revertedWith("Transfer to treasury failed");

                    expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
                    expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));
                    expect(await operatorDistributor.oracleError()).to.equal(ethers.BigNumber.from("0"));
                });
            });
            describe("when the transfer to node operator fails", function () {
                it("reverts", async function () {
                    await expect(mockTreasury.setRejectCall(false)).to.not.be.reverted;
                    await expect(mockOperatorReward.setRejectCall(true)).to.not.be.reverted;

                    expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
                    expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));

                    await expect(operatorDistributor.connect(owner).onEthBeaconRewardsReceived(
                        ethers.utils.parseEther("1"),
                        ethers.utils.parseEther("1"),
                        ethers.utils.parseEther("1"),
                    )).to.be.revertedWith("Transfer to operator fee address failed");

                    expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
                    expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));
                    expect(await operatorDistributor.oracleError()).to.equal(ethers.BigNumber.from("0"));

                });
            });
            describe("when both transfer succeeds", function () {
                it("increases the oracleError amount", async function () {
                    await expect(mockTreasury.setRejectCall(false)).to.not.be.reverted;
                    await expect(mockOperatorReward.setRejectCall(false)).to.not.be.reverted;

                    expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.BigNumber.from("0"));
                    expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("0"));

                    await expect(operatorDistributor.connect(owner).onEthBeaconRewardsReceived(
                        ethers.utils.parseEther("10"),
                        ethers.utils.parseEther("0.1"),
                        ethers.utils.parseEther("0.2"),
                    )).to.not.be.rejected;

                    expect(await ethers.provider.getBalance(mockTreasury.address)).to.equal(ethers.utils.parseEther("1"));
                    expect(await ethers.provider.getBalance(mockOperatorReward.address)).to.equal(ethers.BigNumber.from("2000000000000000000"));
                    expect(await operatorDistributor.oracleError()).to.equal(ethers.BigNumber.from("7000000000000000000"));
                });
            });
        });
    });
});