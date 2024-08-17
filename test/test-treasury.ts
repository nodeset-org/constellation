import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Treasury, Directory, MockERC20 } from "../typechain-types"; // Adjust this import according to your project's structure
import { IERC20 } from "../typechain-types/oz-contracts-3-4-0/token/ERC20";

describe("treasury", function () {
  let treasury: Treasury;
  let treasurer: SignerWithAddress;
  let nonTreasurer: SignerWithAddress;
  let token: MockERC20;
  let setupData: SetupData;

  beforeEach(async function () {
    setupData = await loadFixture(protocolFixture);

    treasurer = setupData.signers.treasurer;
    nonTreasurer = setupData.signers.random;

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("Mock Token", "MTKN", ethers.utils.parseEther("1000"));
    await token.deployed();

    const Treasury = await ethers.getContractFactory("Treasury");

    treasury = await upgrades.deployProxy(
      Treasury,
      [treasurer.address],
      { kind: 'uups', unsafeAllow: ["constructor"], initializer: "initialize" }
    ) as Treasury;

    await treasury.deployed();
    expect(await treasury.hasRole(treasury.TREASURER_ROLE(), treasurer.address)).equals(true);
  });

  describe("claimToken", function () {
    it("success - should allow treasurer to claim all tokens", async function () {

      const totalSupply = await token.totalSupply();
      await token.transfer(treasury.address, totalSupply);
      await expect(treasury.connect(setupData.signers.treasurer).claimToken(token.address, setupData.signers.treasurer.address)).to.emit(treasury, "ClaimedToken").withArgs(token.address, treasurer.address, totalSupply);
      const treasuryBalance = await token.balanceOf(setupData.signers.treasurer.address);
      expect(treasuryBalance).to.equal(totalSupply);
    });

    it("success - treasurer can partially claim tokens in contract", async () => {
      const totalSupply = await token.totalSupply();
      const decimals = await token.decimals();
      await token.transfer(treasury.address, totalSupply);
      await expect(treasury.connect(setupData.signers.treasurer).claimTokenAmount(token.address, setupData.signers.treasurer.address, ethers.utils.parseUnits("1000", decimals))).to.emit(treasury, "ClaimedToken").withArgs(token.address, treasurer.address, ethers.utils.parseUnits("1000", decimals));
      const treasuryBalance = await token.balanceOf(treasurer.address);
      expect(treasuryBalance).to.equal(ethers.utils.parseUnits("1000", decimals));
      expect(await token.balanceOf(treasury.address)).to.equal(totalSupply.sub(ethers.utils.parseUnits("1000", decimals)));
    })

    it("fail - non-treasurer claim tokens", async function () {
      await token.transfer(treasury.address, ethers.utils.parseEther("100"));
      await expect(treasury.connect(nonTreasurer).claimToken(token.address, nonTreasurer.address)).to.be.revertedWith("Can only be called by treasurer address!");
    });

  });

  describe("test claimEth", () => {
    it('success - treasurer claims all eth', async () => {
      expect(await ethers.provider.getBalance(treasury.address)).equals(0)
      await nonTreasurer.sendTransaction({
        to: treasury.address,
        value: ethers.utils.parseEther("1")
      })
      expect(await ethers.provider.getBalance(treasury.address)).equals(ethers.utils.parseEther("1"))
      await expect(treasury.connect(treasurer).claimEth(treasurer.address)).to.emit(treasury, "ClaimedEth").withArgs(treasurer.address, ethers.utils.parseEther("1"));
      expect(await ethers.provider.getBalance(treasury.address)).equals(ethers.utils.parseEther("0"))
    })

    it('success - treasury claims part of the eth', async () => {
      expect(await ethers.provider.getBalance(treasury.address)).equals(0)
      await nonTreasurer.sendTransaction({
        to: treasury.address,
        value: ethers.utils.parseEther("1")
      })
      expect(await ethers.provider.getBalance(treasury.address)).equals(ethers.utils.parseEther("1"))
      await expect(treasury.connect(treasurer).claimEthAmount(treasurer.address, ethers.utils.parseEther("0.1"))).to.emit(treasury, "ClaimedEth").withArgs(treasurer.address, ethers.utils.parseEther("0.1"));
      expect(await ethers.provider.getBalance(treasury.address)).equals(ethers.utils.parseEther(".9"))
    })

    it('fail - non-treasury claims all eth', async () => {
      expect(await ethers.provider.getBalance(treasury.address)).equals(0)
      await nonTreasurer.sendTransaction({
        to: treasury.address,
        value: ethers.utils.parseEther("1")
      })
      expect(await ethers.provider.getBalance(treasury.address)).equals(ethers.utils.parseEther("1"))
      await expect(treasury.connect(nonTreasurer).claimEth(nonTreasurer.address)).to.be.rejectedWith("Can only be called by treasurer address!");
      expect(await ethers.provider.getBalance(treasury.address)).equals(ethers.utils.parseEther("1"))
    })
  })

  describe("arbitrary execution", async () => {

    it("success - treasurer can execute single target", async () => {
      const MockTargetAlpha = await ethers.getContractFactory("MockTargetAlpha");
      const mockTargetAlpha = await MockTargetAlpha.deploy();
      await mockTargetAlpha.deployed();

      const encoding = mockTargetAlpha.interface.encodeFunctionData("doCall", [69]);

      expect(await mockTargetAlpha.called()).equals(0);
      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address], [encoding], [0])).to.emit(treasury, "Executed").withArgs(mockTargetAlpha.address, encoding);
      expect(await mockTargetAlpha.called()).equals(69);
    })

    it("success - treasurer can execute single payable target", async () => {
      const MockTargetAlpha = await ethers.getContractFactory("MockTargetAlpha");
      const mockTargetAlpha = await MockTargetAlpha.deploy();
      await mockTargetAlpha.deployed();

      const encoding = mockTargetAlpha.interface.encodeFunctionData("doCall", [6969]);

      expect(await ethers.provider.getBalance(mockTargetAlpha.address)).equals(ethers.utils.parseEther("0"))

      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address], [encoding], [ethers.utils.parseEther("1")], {
        value: ethers.utils.parseEther("1")
      })).to.emit(treasury, "Executed").withArgs(mockTargetAlpha.address, encoding);

      expect(await ethers.provider.getBalance(mockTargetAlpha.address)).equals(ethers.utils.parseEther("1"))
    })

    it("fail - non-treasurer cannot execute single target", async () => {
      const MockTargetAlpha = await ethers.getContractFactory("MockTargetAlpha");
      const mockTargetAlpha = await MockTargetAlpha.deploy();
      await mockTargetAlpha.deployed();

      const encoding = mockTargetAlpha.interface.encodeFunctionData("doCall", [69]);

      await expect(treasury.executeAll([mockTargetAlpha.address], [encoding], [0])).to.be.revertedWith("Can only be called by treasurer address!")
    })

    it("success - treasurer can execute many targets", async () => {
      const MockTargetAlpha = await ethers.getContractFactory("MockTargetAlpha");
      const mockTargetAlpha = await MockTargetAlpha.deploy();
      await mockTargetAlpha.deployed();

      const mockTargetBravo = await MockTargetAlpha.deploy();
      await mockTargetBravo.deployed();

      const mockTargetCharlie = await MockTargetAlpha.deploy();
      await mockTargetCharlie.deployed();

      const encodingAlpha = mockTargetAlpha.interface.encodeFunctionData("doCall", [69]);
      const encodingBravo = mockTargetAlpha.interface.encodeFunctionData("doCall", [420]);
      const encodingCharlie = mockTargetAlpha.interface.encodeFunctionData("doCall", [314159268]);

      expect(await mockTargetAlpha.called()).equals(0);
      expect(await mockTargetBravo.called()).equals(0);
      expect(await mockTargetCharlie.called()).equals(0);

      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo, encodingCharlie], [0, 0, 0])).to.emit(treasury, "Executed").withArgs(mockTargetAlpha.address, encodingAlpha);
      
      expect(await mockTargetAlpha.called()).equals(69);
      expect(await mockTargetBravo.called()).equals(420);
      expect(await mockTargetCharlie.called()).equals(314159268);

      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo, encodingCharlie], [0, 0, 0])).to.emit(treasury, "Executed").withArgs(mockTargetBravo.address, encodingBravo);
      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo, encodingCharlie], [0, 0, 0])).to.emit(treasury, "Executed").withArgs(mockTargetCharlie.address, encodingCharlie);
    
    })

    it("success - treasurer can execute many payable targets", async () => {
      const MockTargetAlpha = await ethers.getContractFactory("MockTargetAlpha");
      const mockTargetAlpha = await MockTargetAlpha.deploy();
      await mockTargetAlpha.deployed();

      const mockTargetBravo = await MockTargetAlpha.deploy();
      await mockTargetBravo.deployed();

      const mockTargetCharlie = await MockTargetAlpha.deploy();
      await mockTargetCharlie.deployed();

      const encodingAlpha = mockTargetAlpha.interface.encodeFunctionData("doCall", [69]);
      const encodingBravo = mockTargetAlpha.interface.encodeFunctionData("doCall", [420]);
      const encodingCharlie = mockTargetAlpha.interface.encodeFunctionData("doCall", [314159268]);

      expect(await ethers.provider.getBalance(mockTargetAlpha.address)).equals(ethers.utils.parseEther("0"))
      expect(await ethers.provider.getBalance(mockTargetBravo.address)).equals(ethers.utils.parseEther("0"))
      expect(await ethers.provider.getBalance(mockTargetCharlie.address)).equals(ethers.utils.parseEther("0"))

      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo, encodingCharlie], [ethers.utils.parseEther("1"), 0, 0], {
        value: ethers.utils.parseEther("1")
      })).to.emit(treasury, "Executed").withArgs(mockTargetAlpha.address, encodingAlpha);
      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo, encodingCharlie], [0, ethers.utils.parseEther("2"), 0], {
        value: ethers.utils.parseEther("2")
      })).to.emit(treasury, "Executed").withArgs(mockTargetBravo.address, encodingBravo);
      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo, encodingCharlie], [0, 0, ethers.utils.parseEther("3")], {
        value: ethers.utils.parseEther("3")
      })).to.emit(treasury, "Executed").withArgs(mockTargetCharlie.address, encodingCharlie);

      expect(await ethers.provider.getBalance(mockTargetAlpha.address)).equals(ethers.utils.parseEther("1"))
      expect(await ethers.provider.getBalance(mockTargetBravo.address)).equals(ethers.utils.parseEther("2"))
      expect(await ethers.provider.getBalance(mockTargetCharlie.address)).equals(ethers.utils.parseEther("3"))
    })

    it("fail - non-treasurer can execute many targets", async () => {
      const MockTargetAlpha = await ethers.getContractFactory("MockTargetAlpha");
      const mockTargetAlpha = await MockTargetAlpha.deploy();
      await mockTargetAlpha.deployed();

      const mockTargetBravo = await MockTargetAlpha.deploy();
      await mockTargetBravo.deployed();

      const mockTargetCharlie = await MockTargetAlpha.deploy();
      await mockTargetCharlie.deployed();

      const encodingAlpha = mockTargetAlpha.interface.encodeFunctionData("doCall", [69]);
      const encodingBravo = mockTargetAlpha.interface.encodeFunctionData("doCall", [420]);
      const encodingCharlie = mockTargetAlpha.interface.encodeFunctionData("doCall", [314159268]);

      await expect(treasury.executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo, encodingCharlie], [0, 0, 0])).to.be.revertedWith("Can only be called by treasurer address!")
    })

    it("fail - treasurer calls executeAll with varying param lengths", async () => {
      const MockTargetAlpha = await ethers.getContractFactory("MockTargetAlpha");
      const mockTargetAlpha = await MockTargetAlpha.deploy();
      await mockTargetAlpha.deployed();

      const mockTargetBravo = await MockTargetAlpha.deploy();
      await mockTargetBravo.deployed();

      const mockTargetCharlie = await MockTargetAlpha.deploy();
      await mockTargetCharlie.deployed();

      const encodingAlpha = mockTargetAlpha.interface.encodeFunctionData("doCall", [69]);
      const encodingBravo = mockTargetAlpha.interface.encodeFunctionData("doCall", [420]);
      const encodingCharlie = mockTargetAlpha.interface.encodeFunctionData("doCall", [314159268]);

      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo, encodingCharlie], [0, 0])).to.be.revertedWith("Treasury: array length mismatch.")
      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address, mockTargetCharlie.address], [encodingAlpha, encodingBravo], [0, 0, 0])).to.be.revertedWith("Treasury: array length mismatch.")
      await expect(treasury.connect(treasurer).executeAll([mockTargetAlpha.address, mockTargetBravo.address], [encodingAlpha, encodingBravo, encodingCharlie], [0, 0, 0])).to.be.revertedWith("Treasury: array length mismatch.")
    })
  })

  describe("test upgrades", () => {
    it("success - should upgrade", async () => {
      const { protocol, signers } = setupData;

      const MockTreasuryV2 = await ethers.getContractFactory("MockTreasuryV2");
      const mockTreasuryV2 = await MockTreasuryV2.deploy();
      await mockTreasuryV2.deployed();

      const v2 = await ethers.getContractAt("MockTreasuryV2", treasury.address);

      await expect(v2.test()).to.be.rejectedWith("CALL_EXCEPTION")
      await treasury.connect(signers.treasurer).upgradeTo(mockTreasuryV2.address)
      expect(await v2.test()).equals(69)
    })

    it("fail - non-treasurer cannot upgrade", async () => {
      const { protocol, signers } = setupData;

      const MockTreasuryV2 = await ethers.getContractFactory("MockTreasuryV2");
      const mockTreasuryV2 = await MockTreasuryV2.deploy();
      await mockTreasuryV2.deployed();

      const v2 = await ethers.getContractAt("MockTreasuryV2", treasury.address);

      await expect(v2.test()).to.be.rejectedWith("CALL_EXCEPTION")
      await expect(treasury.connect(signers.admin).upgradeTo(mockTreasuryV2.address)).to.be.revertedWith("Upgrading only allowed by treasurer!")
      await expect(v2.test()).to.be.rejectedWith("CALL_EXCEPTION")
    })
  })
});
