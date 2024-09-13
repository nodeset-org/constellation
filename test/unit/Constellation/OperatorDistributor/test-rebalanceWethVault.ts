// TODO

import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("OperatorDistributor.rebalanceWethVault", function () {
    let operatorDistributor: Contract;
    let mockDirectory: Contract;
    let mockRocketNodeStaking: Contract;
    let priceFetcher: Contract;
    let mockRplToken: Contract;
    let mockRocketDAOProtocolSettingsRewards: Contract;
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
        mockRplToken = await MockRplToken.deploy("MockRPL", "RPL", ethers.utils.parseEther("10000"));
        await mockRplToken.deployed();

        const MockWETHToken = await ethers.getContractFactory("MockWEth");
        mockWETHToken = await MockWETHToken.deploy();
        await mockWETHToken.deployed();


        const MockWETHVault = await ethers.getContractFactory("MockWETHVault");
        mockWETHVault = await MockWETHVault.deploy();
        await mockWETHVault.deployed()

        const MockRocketDAOProtocolSettingsRewards = await ethers.getContractFactory("MockRocketDAOProtocolSettingsRewards");
        mockRocketDAOProtocolSettingsRewards = await MockRocketDAOProtocolSettingsRewards.deploy();
        await mockRocketDAOProtocolSettingsRewards.deployed();

        // Set addresses
        await mockDirectory.setSuperNodeAddress(subNodeOperator.address)
        await mockDirectory.setRocketNodeStakingAddress(mockRocketNodeStaking.address);
        await mockDirectory.setPriceFetcherAddress(priceFetcher.address);
        await mockDirectory.setRPLAddress(mockRplToken.address);
        await mockDirectory.setRocketDAOProtocolSettingRewardsAddress(mockRocketDAOProtocolSettingsRewards.address);
        await mockDirectory.setWETHAddress(mockWETHToken.address);
        await mockDirectory.setWETHVaultAddress(mockWETHVault.address)

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

    describe("when caller does not have protocol role", function () {
        it("reverts", async function () {
            await expect(operatorDistributor.connect(subNodeOperator).rebalanceWethVault())
                .to.be.revertedWith("Can only be called by Protocol!");
        });
    });
    describe("when caller has protocol role", function () {
        describe("when the total eth and weth balance is greater than the required weth", function () {
            it("sends the required amount to the vault and unwraps the rest", async function () {
                expect(await mockWETHToken.balanceOf(mockWETHVault.address)).to.equal(0);
                await mockWETHVault.setMissingLiquidity(ethers.utils.parseEther("5"));

                const tx = await owner.sendTransaction({
                    to: operatorDistributor.address,
                    value: ethers.utils.parseEther("10")
                  });
                  await tx.wait();

                await expect(operatorDistributor.connect(owner).rebalanceWethVault()).to.not.be.reverted;

                expect(await mockWETHToken.balanceOf(operatorDistributor.address)).to.equal(0);
                expect(await mockWETHToken.balanceOf(mockWETHVault.address)).to.equal(ethers.utils.parseEther("5"));
            });
        });
        describe("when the total eth and weth balance is equal to the required weth", function () {
            it("sends the required amount to the vault and unwraps the rest", async function () {
                expect(await mockWETHToken.balanceOf(mockWETHVault.address)).to.equal(0);
                await mockWETHVault.setMissingLiquidity(ethers.utils.parseEther("5"));

                const tx = await owner.sendTransaction({
                    to: operatorDistributor.address,
                    value: ethers.utils.parseEther("5")
                  });
                  await tx.wait();

                await expect(operatorDistributor.connect(owner).rebalanceWethVault()).to.not.be.reverted;

                expect(await mockWETHToken.balanceOf(operatorDistributor.address)).to.equal(0);
                expect(await mockWETHToken.balanceOf(mockWETHVault.address)).to.equal(ethers.utils.parseEther("5"));
            });
        });
        describe("when the total eth and weth balance is less than the required weth", function () {
            it("sends everything to the vault", async function () {
                expect(await mockWETHToken.balanceOf(mockWETHVault.address)).to.equal(0);
                await mockWETHVault.setMissingLiquidity(ethers.utils.parseEther("10"));

                const tx = await owner.sendTransaction({
                    to: operatorDistributor.address,
                    value: ethers.utils.parseEther("3")
                  });
                  await tx.wait();

                await expect(operatorDistributor.connect(owner).rebalanceWethVault()).to.not.be.reverted;

                expect(await mockWETHToken.balanceOf(operatorDistributor.address)).to.equal(0);
                expect(await mockWETHToken.balanceOf(mockWETHVault.address)).to.equal(ethers.utils.parseEther("3"));
            });
        });

    });

});