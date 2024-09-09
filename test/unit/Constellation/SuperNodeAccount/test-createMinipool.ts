import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
import { approvedSalt } from "../../../utils/utils";
import { Uint256 } from "@chainsafe/lodestar-types";

const TimelockShortRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_SHORT"));
const AdminServerRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_SERVER_ROLE"));
const CoreProtocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));

describe("SuperNodeAccount.createMinipool", function () {
    let superNodeAccount: Contract;
    let mockDirectory: Contract;
    let mockRocketMinipoolManager: Contract;
    let mockWhitelist: Contract;
    let mockOperatorDistributor: Contract;
    let mockRocketNodeStaking: Contract;
    let mockRocketDaoProtocolSettingsMinipool: Contract;
    let mockRplToken: Contract;
    let mockWETHVault: Contract;
    let mockRocketNodeDeposit: Contract;
    let owner: any;
    let subNodeOperator: any;
    let otherSigner: any;
    let blockchainId: any;
    let salts: any;
    let rawSalt: any;
    let pepperedSalt: any;
    let mockDepositData: any;
    let config: any;
    let sig: any;

    beforeEach(async function () {
        [owner, subNodeOperator, otherSigner] = await ethers.getSigners();

        // Deploy mock contracts
        const MockWhitelist = await ethers.getContractFactory("MockWhitelist");
        mockWhitelist = await MockWhitelist.deploy();
        await mockWhitelist.deployed();

        const MockRocketMinipoolManager = await ethers.getContractFactory("MockRocketMinipoolManager");
        mockRocketMinipoolManager = await MockRocketMinipoolManager.deploy();
        await mockRocketMinipoolManager.deployed();

        const MockOperatorDistributor = await ethers.getContractFactory("MockOperatorDistributor");
        mockOperatorDistributor = await MockOperatorDistributor.deploy();
        await mockOperatorDistributor.deployed();

        const MockRocketNodeStaking = await ethers.getContractFactory("MockRocketNodeStakingConstellation");
        mockRocketNodeStaking = await MockRocketNodeStaking.deploy();
        await mockRocketNodeStaking.deployed();

        const MockRocketDaoProtocolSettingsMinipool = await ethers.getContractFactory("MockRocketDaoProtocolSettingsMinipoolConstellation");
        mockRocketDaoProtocolSettingsMinipool = await MockRocketDaoProtocolSettingsMinipool.deploy();
        await mockRocketDaoProtocolSettingsMinipool.deployed();

        const MockRplToken = await ethers.getContractFactory("MockErc20Constellation");
        mockRplToken = await MockRplToken.deploy();
        await mockRplToken.deployed();

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();

        const MockWETHVault = await ethers.getContractFactory("MockWETHVault");
        mockWETHVault = await MockWETHVault.deploy();
        await mockWETHVault.deployed()

        const MockRocketNodeDeposit = await ethers.getContractFactory("MockRocketNodeDepositConstellation");
        mockRocketNodeDeposit = await MockRocketNodeDeposit.deploy();
        await mockRocketNodeDeposit.deployed()

        // Set directory addresses
        await mockDirectory.setRocketMinipoolManagerAddress(mockRocketMinipoolManager.address);
        await mockDirectory.setWhitelistAddress(mockWhitelist.address);
        await mockDirectory.setOperatorDistributorAddress(mockOperatorDistributor.address);
        await mockDirectory.setRocketNodeStakingAddress(mockRocketNodeStaking.address);
        await mockDirectory.setRocketDAOProtocolSettingsMinipoolAddress(mockRocketDaoProtocolSettingsMinipool.address);
        await mockDirectory.setRPLAddress(mockRplToken.address);
        await mockDirectory.setWETHVaultAddress(mockWETHVault.address)
        await mockDirectory.setRocketNodeDepositAddress(mockRocketNodeDeposit.address)

        // Set roles
        await mockDirectory.setRole(TimelockShortRole, owner.address, true);
        await mockDirectory.setRole(AdminServerRole, subNodeOperator.address, true);
        await mockDirectory.setRole(CoreProtocolRole, owner.address, true);

        // Deploy the SuperNodeAccount contract
        const SuperNodeAccountFactory = await ethers.getContractFactory("SuperNodeAccount");
        superNodeAccount = await upgrades.deployProxy(SuperNodeAccountFactory, [mockDirectory.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });

        await superNodeAccount.deployed();

        // Set the lock threshold
        await superNodeAccount.connect(owner).setLockAmount(ethers.utils.parseEther('1'))

        // Set up all other constants
        blockchainId = await ethers.provider.getNetwork().then((n) => n.chainId);
        salts  = await approvedSalt(3, subNodeOperator.address);
        rawSalt = salts.rawSalt;
        pepperedSalt = salts.pepperedSalt;
        mockDepositData = {
            depositData: {
                pubkey: Buffer.from("8c5e9f4d3b5a7e9d2f6b7c4e8f3d9e1f6c7e4d5b6a3f1c9d8e4f3b6c7a9d5e2b6c4e8f3a9d2e7c1f5d3b7e8c9d6a5", "hex"),
                withdrawalCredentials: Buffer.from("00f839d2b469f5b5be987ab46ef4bb26b99e3f7e9c3a6ab4e6e1b4f52edbc293", "hex"),
                amount: BigInt(32000000000),
                signature: Buffer.from("b8e2d8a4d19f4e73a8f3", "hex"),
            },
            depositDataRoot: ethers.utils.arrayify(
                "0x0fe98b4ef4b9a2a7cde5a8d9f1c6b7a8e4d3c2b1e8f4d2c3b6a9e7f5b3d8e6f9"
            ),
            minipoolAddress: "0xabC1234567890deFAbCdEf1234567890aBcdEF12"
        }
        const bond = await superNodeAccount.bond();
        config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: mockDepositData.depositData.pubkey,
            validatorSignature: mockDepositData.depositData.signature,
            depositDataRoot: mockDepositData.depositDataRoot,
            salt: pepperedSalt,
            expectedMinipoolAddress: mockDepositData.minipoolAddress,
        };
        const subNodeOperatorNonce = await superNodeAccount.nonces(subNodeOperator.address);
        const nonce = await superNodeAccount.nonce();
        const packedData = ethers.utils.solidityPack(
            ["address", "uint256", "address", "uint256", "uint256", "uint256"],
            [
              mockDepositData.minipoolAddress,
              pepperedSalt,
              superNodeAccount.address,
              subNodeOperatorNonce,
              nonce,
              blockchainId,
            ]
        );

        const messageHash = ethers.utils.keccak256(packedData);
        sig = await subNodeOperator.signMessage(ethers.utils.arrayify(messageHash));
    });

    describe("when the message value is not equal to the lock threshold", function () {
        it("should revert", async function () {
            await expect(
                superNodeAccount
            .connect(subNodeOperator)
            .createMinipool({
                validatorPubkey: config.validatorPubkey,
                validatorSignature: config.validatorSignature,
                depositDataRoot: config.depositDataRoot,
                salt: rawSalt,
                expectedMinipoolAddress: config.expectedMinipoolAddress,
                sig: sig
                }, { value: ethers.utils.parseEther('0') }
            )).to.be.revertedWith('SuperNode: must set the message value to lockThreshold');
        });
    });
    describe("when the message value is equal to the lock threshold", function () {
        describe("when the minipool address already exists", function () {
            it("should revert", async function () {
                // Mock minipool address to already exist
                const tx = await mockRocketMinipoolManager.setMinipoolExists(config.expectedMinipoolAddress, true);

                await expect(
                    superNodeAccount
                .connect(subNodeOperator)
                .createMinipool({
                    validatorPubkey: config.validatorPubkey,
                    validatorSignature: config.validatorSignature,
                    depositDataRoot: config.depositDataRoot,
                    salt: rawSalt,
                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                    sig: sig
                    }, { value: ethers.utils.parseEther('1') }
                )).to.be.revertedWith('minipool already initialized');
            });
        });
        describe("when the minipool address does not exist", function () {
            describe("when the sub node account is not whitelisted", function () {
                it("should revert", async function () {
                    await expect(
                        superNodeAccount
                    .connect(subNodeOperator)
                    .createMinipool({
                        validatorPubkey: config.validatorPubkey,
                        validatorSignature: config.validatorSignature,
                        depositDataRoot: config.depositDataRoot,
                        salt: rawSalt,
                        expectedMinipoolAddress: config.expectedMinipoolAddress,
                        sig: sig
                        }, { value: ethers.utils.parseEther('1') }
                    )).to.be.revertedWith('sub node operator must be whitelisted');
                });
            });
            describe("when the sub node account is whitelisted", function () {
                beforeEach(async function () {
                    await mockWhitelist.setIsAddressInWhitelist(subNodeOperator.address, true);
                });

                describe("when the sub node operator is equal to the active minipool count", function () {
                    it("should revert", async function () {
                        // Mock active minipool count to equal to max validator count
                        await mockWhitelist.setActiveValidatorCountForOperator(subNodeOperator.address, 1);

                        await expect(
                            superNodeAccount
                        .connect(subNodeOperator)
                        .createMinipool({
                            validatorPubkey: config.validatorPubkey,
                            validatorSignature: config.validatorSignature,
                            depositDataRoot: config.depositDataRoot,
                            salt: rawSalt,
                            expectedMinipoolAddress: config.expectedMinipoolAddress,
                            sig: sig
                            }, { value: ethers.utils.parseEther('1') }
                        )).to.be.revertedWith('Sub node operator has created too many minipools already');
                    });
                });
                describe("when the sub node operator is below the active minipool count", function () {
                    beforeEach(async function () {
                        await mockWhitelist.setActiveValidatorCountForOperator(subNodeOperator.address, 0);
                    });
                    describe("when the protocol does not have enough liquidity", function () {
                        it("should revert", async function () {
                            // Mock liquidity values
                            await mockRocketDaoProtocolSettingsMinipool.setLaunchBalance(ethers.utils.parseEther('8'))

                            await expect(
                                superNodeAccount
                            .connect(subNodeOperator)
                            .createMinipool({
                                validatorPubkey: config.validatorPubkey,
                                validatorSignature: config.validatorSignature,
                                depositDataRoot: config.depositDataRoot,
                                salt: rawSalt,
                                expectedMinipoolAddress: config.expectedMinipoolAddress,
                                sig: sig
                                }, { value: ethers.utils.parseEther('1') }
                            )).to.be.revertedWith('NodeAccount: protocol must have enough rpl and eth');
                        });
                    });
                    describe("when the protocol has enough liquidity", function () {
                        describe("when the recoveredAddress does not have the admin server role", function () {
                            it("should revert", async function () {
                                const subNodeOperatorNonce = await superNodeAccount.nonces(subNodeOperator.address);
                                const nonce = await superNodeAccount.nonce();
                                const badPackedData = ethers.utils.solidityPack(
                                    ["address", "uint256", "address", "uint256", "uint256", "uint256"],
                                    [
                                      mockDepositData.minipoolAddress,
                                      pepperedSalt,
                                      mockDepositData.minipoolAddress, // Should be superNodeAccount.address, but we want signature to fail
                                      subNodeOperatorNonce,
                                      nonce,
                                      blockchainId,
                                    ]
                                  );
                                const badMessageHash = ethers.utils.keccak256(badPackedData);
                                const badSig = await subNodeOperator.signMessage(ethers.utils.arrayify(badMessageHash));

                                // Mock liquidity values
                                await mockRocketDaoProtocolSettingsMinipool.setLaunchBalance(ethers.utils.parseEther('8'))
                                // Send ETH to OD contract
                                const tx = await owner.sendTransaction({
                                    to: mockOperatorDistributor.address,
                                    value: ethers.utils.parseEther("8"),
                                });
                                await tx.wait();

                                await expect(
                                    superNodeAccount
                                .connect(subNodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: badSig
                                    }, { value: ethers.utils.parseEther('1') }
                                )).to.be.revertedWith('bad signer role, params, or encoding');
                            });
                        });
                        describe("when the recoveredAddress has the admin server role", function () {
                            it("should create the minipool", async function () {
                                // Mock liquidity values
                                await mockRocketDaoProtocolSettingsMinipool.setLaunchBalance(ethers.utils.parseEther('8'))
                                // Send ETH to OD contract
                                const tx = await owner.sendTransaction({
                                    to: mockOperatorDistributor.address,
                                    value: ethers.utils.parseEther("8"),
                                });
                                await tx.wait();

                                // Mock sending ETH to SuperNodeAccount contract
                                const tx2 = await owner.sendTransaction({
                                    to: superNodeAccount.address,
                                    value: ethers.utils.parseEther("8"),
                                });
                                await tx2.wait();

                                await expect(
                                    superNodeAccount
                                .connect(subNodeOperator)
                                .createMinipool({
                                    validatorPubkey: config.validatorPubkey,
                                    validatorSignature: config.validatorSignature,
                                    depositDataRoot: config.depositDataRoot,
                                    salt: rawSalt,
                                    expectedMinipoolAddress: config.expectedMinipoolAddress,
                                    sig: sig
                                    }, { value: ethers.utils.parseEther('1') }
                                )).to.not.be.reverted;
                            });
                        });
                    });
                });
            });
        });
    });
});
