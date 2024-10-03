import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

// TODO: Move to some utils
function generateBytes32Identifier(contractName: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes('contract.address' + contractName));
}

describe("Directory.getters", function () {
  let directory: Contract;
  let mockWETHToken: Contract;
  let mockPriceFetcher: Contract;
  let mockWETHVault: Contract;
  let mockRPLVault: Contract;
  let mockWhitelist: Contract;
  let mockRocketStorage: Contract;
  let mockSuperNode: Contract;
  let mockSanctions: Contract;
  let mockOracle: Contract;
  let mockMerkleClaimStreamer: Contract;
  let mockOperatorDistributor: Contract;
  let mockTreasury: Contract;
  let mockTimelockShort: Contract;
  let mockTimelockMedium: Contract;
  let mockTimelockLong: Contract;
  let mockYieldDistributor: Contract;

  let owner: any;
  let admin: any;
  let treasurer: any;
  let adminServer: any;
  let oracleAdmin: any;

  beforeEach(async function () {
    [owner, admin, treasurer, adminServer, oracleAdmin] = await ethers.getSigners();
    // Deploy mocks
    const PriceFetcher = await ethers.getContractFactory("MockPriceFetcher");
    mockPriceFetcher = await PriceFetcher.deploy();
    await mockPriceFetcher.deployed();

    const MockWhitelist = await ethers.getContractFactory("MockWhitelist");
    mockWhitelist = await MockWhitelist.deploy();
    await mockWhitelist.deployed();

    const MockWETHToken = await ethers.getContractFactory("MockWEth");
    mockWETHToken = await MockWETHToken.deploy();
    await mockWETHToken.deployed();

    const MockWETHVault = await ethers.getContractFactory("MockWETHVault");
    mockWETHVault = await MockWETHVault.deploy();
    await mockWETHVault.deployed()

    const MockRPLVault = await ethers.getContractFactory("MockRPLVault");
    mockRPLVault = await MockRPLVault.deploy();
    await mockRPLVault.deployed()

    const MockSuperNode = await ethers.getContractFactory("MockSuperNode");
    mockSuperNode = await MockSuperNode.deploy();
    await mockSuperNode.deployed();

    const MockSanctions = await ethers.getContractFactory("MockSanctions");
    mockSanctions = await MockSanctions.deploy();
    await mockSanctions.deployed();

    const MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy();
    await mockOracle.deployed();

    const MockMerkleClaimStreamer = await ethers.getContractFactory("MockMerkleClaimStreamer");
    mockMerkleClaimStreamer = await MockMerkleClaimStreamer.deploy();
    await mockMerkleClaimStreamer.deployed();

    const MockOperatorDistributor = await ethers.getContractFactory("MockOperatorDistributor");
    mockOperatorDistributor = await MockOperatorDistributor.deploy();
    await mockOperatorDistributor.deployed();

    const MockTreasury = await ethers.getContractFactory("MockTreasury");
    mockTreasury = await MockTreasury.deploy();
    await mockTreasury.deployed();

    const MockTimelockShort = await ethers.getContractFactory("MockTimelock");
    mockTimelockShort = await MockTimelockShort.deploy();
    await mockTimelockShort.deployed();

    const MockTimelockMedium = await ethers.getContractFactory("MockTimelock");
    mockTimelockMedium = await MockTimelockMedium.deploy();
    await mockTimelockMedium.deployed();

    const MockTimelockLong = await ethers.getContractFactory("MockTimelock");
    mockTimelockLong = await MockTimelockLong.deploy();
    await mockTimelockLong.deployed();

    const MockYieldDistributor = await ethers.getContractFactory("MockYieldDistributor");
    mockYieldDistributor = await MockYieldDistributor.deploy();
    await mockYieldDistributor.deployed();

    const MockRocketStorage = await ethers.getContractFactory("MockRocketStorage");
    mockRocketStorage = await MockRocketStorage.deploy();
    await mockRocketStorage.deployed()


    // Deploy contract to test
    const Directory = await ethers.getContractFactory("Directory");
    directory = await upgrades.deployProxy(
      Directory,
      [
        [
          mockWhitelist.address,
          mockWETHVault.address,
          mockRPLVault.address,
          mockOperatorDistributor.address,
          mockMerkleClaimStreamer.address,
          mockOracle.address,
          mockPriceFetcher.address,
          mockSuperNode.address,
          mockRocketStorage.address,
          mockWETHToken.address,
          mockSanctions.address,
        ],
        mockYieldDistributor.address,
        [
          admin.address,
          treasurer.address,
          mockTreasury.address,
          mockTimelockShort.address,
          mockTimelockMedium.address,
          mockTimelockLong.address,
          adminServer.address,
          oracleAdmin.address
        ]
      ],
      { initializer: "initialize", kind: "uups", unsafeAllow: ["constructor"] }
    );
  });

  it("should return the correct addresses after RocketStorage values change", async function () {
    // Set initial rocket storage values
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNodeManager"), "0x0000000000000000000000000000000000000001");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNodeDeposit"), "0x0000000000000000000000000000000000000002");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNodeStaking"), "0x0000000000000000000000000000000000000003");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketMinipoolManager"), "0x0000000000000000000000000000000000000004");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketDAOProtocolSettingsRewards"), "0x0000000000000000000000000000000000000005");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketDAOProtocolSettingsMinipool"), "0x0000000000000000000000000000000000000006");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketTokenRPL"), "0x0000000000000000000000000000000000000007");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNetworkPenalties"), "0x0000000000000000000000000000000000000008");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketDepositPool"), "0x0000000000000000000000000000000000000009");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNetworkPrices"), "0x0000000000000000000000000000000000000010");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketDAOProtocolProposal"), "0x0000000000000000000000000000000000000011");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketMerkleDistributorMainnet"), "0x0000000000000000000000000000000000000012");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNetworkVoting"), "0x0000000000000000000000000000000000000013");

    // Protocol addresses should not change
    expect(await directory.getWhitelistAddress()).to.equal(mockWhitelist.address);
    expect(await directory.getWETHVaultAddress()).to.equal(mockWETHVault.address);
    expect(await directory.getRPLVaultAddress()).to.equal(mockRPLVault.address);
    expect(await directory.getOracleAddress()).to.equal(mockOracle.address);
    expect(await directory.getRocketStorageAddress()).to.equal(mockRocketStorage.address);
    expect(await directory.getOperatorDistributorAddress()).to.equal(mockOperatorDistributor.address);
    expect(await directory.getMerkleClaimStreamerAddress()).to.equal(mockMerkleClaimStreamer.address);

    // RocketStorage addresses should change
    expect(await directory.getRocketNodeManagerAddress()).to.equal("0x0000000000000000000000000000000000000001");
    expect(await directory.getRocketNodeDepositAddress()).to.equal("0x0000000000000000000000000000000000000002");
    expect(await directory.getRocketNodeStakingAddress()).to.equal("0x0000000000000000000000000000000000000003");
    expect(await directory.getRocketMinipoolManagerAddress()).to.equal("0x0000000000000000000000000000000000000004");
    expect(await directory.getRocketDAOProtocolSettingsRewardsAddress()).to.equal("0x0000000000000000000000000000000000000005");
    expect(await directory.getRocketDAOProtocolSettingsMinipool()).to.equal("0x0000000000000000000000000000000000000006");
    expect(await directory.getRPLAddress()).to.equal("0x0000000000000000000000000000000000000007");
    expect(await directory.getRocketNetworkPenalties()).to.equal("0x0000000000000000000000000000000000000008");
    expect(await directory.getRocketDepositPoolAddress()).to.equal("0x0000000000000000000000000000000000000009");
    expect(await directory.getRocketNetworkPrices()).to.equal("0x0000000000000000000000000000000000000010");
    expect(await directory.getRocketDAOProtocolProposalAddress()).to.equal("0x0000000000000000000000000000000000000011");
    expect(await directory.getRocketMerkleDistributorMainnetAddress()).to.equal("0x0000000000000000000000000000000000000012");
    expect(await directory.getRocketNetworkVotingAddress()).to.equal("0x0000000000000000000000000000000000000013");

    // Update rocket storage values (change first byte to "9" for each address)
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNodeManager"), "0x9000000000000000000000000000000000000001");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNodeDeposit"), "0x9000000000000000000000000000000000000002");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNodeStaking"), "0x9000000000000000000000000000000000000003");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketMinipoolManager"), "0x9000000000000000000000000000000000000004");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketDAOProtocolSettingsRewards"), "0x9000000000000000000000000000000000000005");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketDAOProtocolSettingsMinipool"), "0x9000000000000000000000000000000000000006");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketTokenRPL"), "0x9000000000000000000000000000000000000007");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNetworkPenalties"), "0x9000000000000000000000000000000000000008");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketDepositPool"), "0x9000000000000000000000000000000000000009");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNetworkPrices"), "0x9000000000000000000000000000000000000010");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketDAOProtocolProposal"), "0x9000000000000000000000000000000000000011");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketMerkleDistributorMainnet"), "0x9000000000000000000000000000000000000012");
    await mockRocketStorage.setAddress(generateBytes32Identifier("rocketNetworkVoting"), "0x9000000000000000000000000000000000000013");

    // Protocol addresses should not change
    expect(await directory.getWhitelistAddress()).to.equal(mockWhitelist.address);
    expect(await directory.getWETHVaultAddress()).to.equal(mockWETHVault.address);
    expect(await directory.getRPLVaultAddress()).to.equal(mockRPLVault.address);
    expect(await directory.getOracleAddress()).to.equal(mockOracle.address);
    expect(await directory.getRocketStorageAddress()).to.equal(mockRocketStorage.address);
    expect(await directory.getOperatorDistributorAddress()).to.equal(mockOperatorDistributor.address);
    expect(await directory.getMerkleClaimStreamerAddress()).to.equal(mockMerkleClaimStreamer.address);

    // RocketStorage addresses should change
    expect(await directory.getRocketNodeManagerAddress()).to.equal("0x9000000000000000000000000000000000000001");
    expect(await directory.getRocketNodeDepositAddress()).to.equal("0x9000000000000000000000000000000000000002");
    expect(await directory.getRocketNodeStakingAddress()).to.equal("0x9000000000000000000000000000000000000003");
    expect(await directory.getRocketMinipoolManagerAddress()).to.equal("0x9000000000000000000000000000000000000004");
    expect(await directory.getRocketDAOProtocolSettingsRewardsAddress()).to.equal("0x9000000000000000000000000000000000000005");
    expect(await directory.getRocketDAOProtocolSettingsMinipool()).to.equal("0x9000000000000000000000000000000000000006");
    expect(await directory.getRPLAddress()).to.equal("0x9000000000000000000000000000000000000007");
    expect(await directory.getRocketNetworkPenalties()).to.equal("0x9000000000000000000000000000000000000008");
    expect(await directory.getRocketDepositPoolAddress()).to.equal("0x9000000000000000000000000000000000000009");
    expect(await directory.getRocketNetworkPrices()).to.equal("0x9000000000000000000000000000000000000010");
    expect(await directory.getRocketDAOProtocolProposalAddress()).to.equal("0x9000000000000000000000000000000000000011");
    expect(await directory.getRocketMerkleDistributorMainnetAddress()).to.equal("0x9000000000000000000000000000000000000012");
    expect(await directory.getRocketNetworkVotingAddress()).to.equal("0x9000000000000000000000000000000000000013");
  });
});

