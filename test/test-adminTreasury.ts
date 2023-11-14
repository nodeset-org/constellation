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

  beforeEach(async function () {
    const setupData = await protocolFixture();

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
    it("should allow admin to claim all tokens", async function () {

      const adminRole = await directory.hasRole(ethers.utils.keccak256(ethers.utils.arrayify(ethers.utils.toUtf8Bytes("ADMIN_ROLE"))), admin.address);
      expect(adminRole).to.equal(true);

      const totalSupply = await token.totalSupply();
      await token.transfer(adminTreasury.address, totalSupply);
      await adminTreasury.connect(admin)['claimToken(address,address)'](token.address, admin.address);
      const adminBalance = await token.balanceOf(admin.address);
      expect(adminBalance).to.equal(totalSupply);
    });

    it("should fail when non-admin tries to claim tokens", async function () {
      await token.transfer(adminTreasury.address, ethers.utils.parseEther("100"));
      await expect(adminTreasury.connect(nonAdmin)['claimToken(address,address)'](token.address, nonAdmin.address)).to.be.revertedWith("Can only be called by admin address!");
    });

  });

});