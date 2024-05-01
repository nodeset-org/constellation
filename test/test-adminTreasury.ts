import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AdminTreasury, Directory, MockERC20 } from "../typechain-types"; // Adjust this import according to your project's structure
import { IERC20 } from "../typechain-types/oz-contracts-3-4-0/token/ERC20";

describe("adminTreasury", function () {
  let adminTreasury: AdminTreasury;
  let admin: SignerWithAddress;
  let nonAdmin: SignerWithAddress;
  let token: MockERC20;
  let directory: Directory;
  let setupData: SetupData;

  beforeEach(async function () {
    setupData = await loadFixture(protocolFixture);

    admin = setupData.signers.admin;
    nonAdmin = setupData.signers.random;

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("Mock Token", "MTKN", ethers.utils.parseEther("1000"));
    await token.deployed();

    const AdminTreasury = await ethers.getContractFactory("AdminTreasury");

    const directoryAddress = setupData.protocol.directory.address;
    directory = setupData.protocol.directory;

    adminTreasury = await upgrades.deployProxy(
      AdminTreasury,
      [directoryAddress],
      { kind: 'uups', unsafeAllow: ["constructor"], initializer: "initialize" }
    ) as AdminTreasury;


    await adminTreasury.deployed();
  });

  describe("initialize", function () {
    it("should initialize with the correct directory address", async function () {
      const setDirectoryAddress = await adminTreasury.getDirectory();
      expect(setDirectoryAddress).to.equal(directory.address);
    });
  });

  describe("claimToken", function () {
    it("success - should allow admin to claim all tokens", async function () {
      const adminRole = await directory.hasRole(ethers.utils.keccak256(ethers.utils.arrayify(ethers.utils.toUtf8Bytes("ADMIN_ROLE"))), admin.address);
      expect(adminRole).to.equal(true);

      const totalSupply = await token.totalSupply();
      await token.transfer(adminTreasury.address, totalSupply);
      await expect(adminTreasury.connect(admin)['claimToken(address,address)'](token.address, admin.address)).to.emit(adminTreasury, "ClaimedToken").withArgs(admin.address, totalSupply);
      const adminBalance = await token.balanceOf(admin.address);
      expect(adminBalance).to.equal(totalSupply);
    });

    it("success - admin can partially claim tokens in contract", async () => {
      const adminRole = await directory.hasRole(ethers.utils.keccak256(ethers.utils.arrayify(ethers.utils.toUtf8Bytes("ADMIN_ROLE"))), admin.address);
      expect(adminRole).to.equal(true);

      const totalSupply = await token.totalSupply();
      const decimals = await token.decimals();
      await token.transfer(adminTreasury.address, totalSupply);
      await expect(adminTreasury.connect(admin)["claimToken(address,address,uint256)"](token.address, admin.address, ethers.utils.parseUnits("1000", decimals))).to.emit(adminTreasury, "ClaimedToken").withArgs(admin.address, ethers.utils.parseUnits("1000", decimals));
      const adminBalance = await token.balanceOf(admin.address);
      expect(adminBalance).to.equal(ethers.utils.parseUnits("1000", decimals));
      expect(await token.balanceOf(adminTreasury.address)).to.equal(totalSupply.sub(ethers.utils.parseUnits("1000", decimals)));
    })

    it("fail - non-admin claim tokens", async function () {
      await token.transfer(adminTreasury.address, ethers.utils.parseEther("100"));
      await expect(adminTreasury.connect(nonAdmin)['claimToken(address,address)'](token.address, nonAdmin.address)).to.be.revertedWith("Can only be called by admin address!");
    });

  });

  describe("test claimEth", () => {
    it('success - admin claims all eth', async () => {
      const { protocol, signers } = setupData;
      const adminRole = await directory.hasRole(ethers.utils.keccak256(ethers.utils.arrayify(ethers.utils.toUtf8Bytes("ADMIN_ROLE"))), admin.address);
      expect(adminRole).to.equal(true);


      expect(await ethers.provider.getBalance(adminTreasury.address)).equals(0)
      await signers.random.sendTransaction({
        to: adminTreasury.address,
        value: ethers.utils.parseEther("1")
      })
      expect(await ethers.provider.getBalance(adminTreasury.address)).equals(ethers.utils.parseEther("1"))
      await expect(adminTreasury.connect(admin)["claimEth(address)"](signers.admin.address)).to.emit(adminTreasury, "ClaimedEth").withArgs(signers.admin.address, ethers.utils.parseEther("1"));
      expect(await ethers.provider.getBalance(adminTreasury.address)).equals(ethers.utils.parseEther("0"))
    })

    it('fail - non-admin claims all eth', async () => {
      const { protocol, signers } = setupData;
      const adminRole = await directory.hasRole(ethers.utils.keccak256(ethers.utils.arrayify(ethers.utils.toUtf8Bytes("ADMIN_ROLE"))), signers.random.address);
      expect(adminRole).to.equal(false);

      expect(await ethers.provider.getBalance(adminTreasury.address)).equals(0)
      await signers.random.sendTransaction({
        to: adminTreasury.address,
        value: ethers.utils.parseEther("1")
      })
      expect(await ethers.provider.getBalance(adminTreasury.address)).equals(ethers.utils.parseEther("1"))
      await  expect(adminTreasury.connect(signers.random)["claimEth(address)"](signers.random.address)).to.be.rejectedWith("Can only be called by admin address!");
      expect(await ethers.provider.getBalance(adminTreasury.address)).equals(ethers.utils.parseEther("1"))
    })
  })

  describe("test upgrades",  () => {
    it("success - should upgrade", async () => {
      const { protocol, signers } = setupData;

      const MockAdminTreasuryV2 = await ethers.getContractFactory("MockAdminTreasuryV2");
      const mockAdminTreasuryV2 = await MockAdminTreasuryV2.deploy();
      await mockAdminTreasuryV2.deployed();
      
      const v2 = await ethers.getContractAt("MockAdminTreasuryV2", adminTreasury.address);
      
      await expect(v2.test()).to.be.rejectedWith("CALL_EXCEPTION")
      await adminTreasury.connect(signers.admin).upgradeTo(mockAdminTreasuryV2.address)
      expect(await v2.test()).equals(69)
    })

    it("fail - non-admin can upgrade", async () => {
      const { protocol, signers } = setupData;

      const MockAdminTreasuryV2 = await ethers.getContractFactory("MockAdminTreasuryV2");
      const mockAdminTreasuryV2 = await MockAdminTreasuryV2.deploy();
      await mockAdminTreasuryV2.deployed();
      
      const v2 = await ethers.getContractAt("MockAdminTreasuryV2", adminTreasury.address);
      
      await expect(v2.test()).to.be.rejectedWith("CALL_EXCEPTION")
      await expect(adminTreasury.connect(signers.random).upgradeTo(mockAdminTreasuryV2.address)).to.be.revertedWith("Can only be called by admin address!")
      await expect(v2.test()).to.be.rejectedWith("CALL_EXCEPTION")

    })
  })
});
