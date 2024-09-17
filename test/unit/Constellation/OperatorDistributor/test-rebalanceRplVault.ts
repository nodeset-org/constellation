// TODO

import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const AdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("OperatorDistributor.rebalanceRplVault", function () {
    let operatorDistributor: Contract;
    let mockDirectory: Contract;
    let mockRocketNodeStaking: Contract;
    let priceFetcher: Contract;
    let mockRplToken: Contract;
    let mockRocketDaoProtocolSettingsRewards: Contract;
    let mockRplVault: Contract;
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

        const MockRocketDaoProtocolSettingsRewards = await ethers.getContractFactory("MockRocketDaoProtocolSettingsRewards");
        mockRocketDaoProtocolSettingsRewards = await MockRocketDaoProtocolSettingsRewards.deploy();
        await mockRocketDaoProtocolSettingsRewards.deployed();

        const MockRplVault = await ethers.getContractFactory("MockRPLVault");
        mockRplVault = await MockRplVault.deploy();
        await mockRplVault.deployed()

        // Set addresses
        await mockDirectory.setSuperNodeAddress(subNodeOperator.address);
        await mockDirectory.setRocketNodeStakingAddress(mockRocketNodeStaking.address);
        await mockDirectory.setPriceFetcherAddress(priceFetcher.address);
        await mockDirectory.setRPLAddress(mockRplToken.address);
        await mockDirectory.setRocketDAOProtocolSettingRewardsAddress(mockRocketDaoProtocolSettingsRewards.address);
        await mockDirectory.setRPLVaultAddress(mockRplVault.address);

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
    describe('when the caller is not the protocol', function () {
        it('reverts', async function () {
            await expect(operatorDistributor.connect(subNodeOperator).rebalanceRplVault())
                .to.be.revertedWith('Can only be called by Protocol!');
        });
    });
    describe('when the caller is the protocol', function () {
        describe('when the RPL balance is greater than the required RPL balance', function () {
            describe('when the required RPL is zero', function () {
                it('does nothing', async function () {
                    await mockRplToken.setBalance(operatorDistributor.address, ethers.utils.parseEther("1"));
                    expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0"));

                    await expect(operatorDistributor.connect(owner).rebalanceRplVault()).to.not.be.reverted;

                    expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0"));
                });
            });
            describe('when the required RPL is greater than zero', function () {
                it('send the required amount to the vault', async function () {
                    await mockRplVault.setMissingLiquidity(ethers.utils.parseEther("0.2"));
                    await mockRplToken.setBalance(operatorDistributor.address, ethers.utils.parseEther("1"));
                    expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0"));

                    await expect(operatorDistributor.connect(owner).rebalanceRplVault()).to.not.be.reverted;

                    expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0.2"));
                });
            });
        });
        describe('when the RPL balance is equal to the required RPL balance', function () {
            describe('when the required RPL is zero', function () {
                it('does nothing', async function () {
                    await mockRplVault.setMissingLiquidity(ethers.utils.parseEther("0"));
                    await mockRplToken.setBalance(operatorDistributor.address, ethers.utils.parseEther("0"));
                    expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0"));

                    await expect(operatorDistributor.connect(owner).rebalanceRplVault()).to.not.be.reverted;

                    expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0"));
                });
            });
            describe('when the required RPL is greater than zero', function () {
                it('send the required amount to the vault', async function () {
                    await mockRplVault.setMissingLiquidity(ethers.utils.parseEther("1"));
                    await mockRplToken.setBalance(operatorDistributor.address, ethers.utils.parseEther("1"));
                    expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0"));

                    await expect(operatorDistributor.connect(owner).rebalanceRplVault()).to.not.be.reverted;

                    expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("1"));
                });
            });
        });
        describe('when the RPL balance is less than the required RPL balance', function () {
            it('sends everything to the vault', async function () {
                await mockRplVault.setMissingLiquidity(ethers.utils.parseEther("1"));
                await mockRplToken.setBalance(operatorDistributor.address, ethers.utils.parseEther("0.2"));
                expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0"));

                await expect(operatorDistributor.connect(owner).rebalanceRplVault()).to.not.be.reverted;

                expect(await mockRplToken.balanceOf(mockRplVault.address)).to.equal(ethers.utils.parseEther("0.2"));

            });
        });
    });
});