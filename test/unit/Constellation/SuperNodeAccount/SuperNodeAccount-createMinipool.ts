import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
import { approvedSalt } from "../../../utils/utils";

const TimelockShortRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_SHORT"));

describe("SuperNodeAccount", function () {
    let superNodeAccount: Contract;
    let mockDirectory: Contract;
    let owner: any;
    let subNodeOperator: any;
    let otherSigner: any;
    let blockchainId: any;

    beforeEach(async function () {
        [owner, subNodeOperator, otherSigner] = await ethers.getSigners();

        // Deploy mock contracts
        const MockRocketMinipoolManager = await ethers.getContractFactory("MockRocketMinipoolManager");
        const mockRocketMinipoolManager = await MockRocketMinipoolManager.deploy();
        await mockRocketMinipoolManager.deployed();

        const MockDirectory = await ethers.getContractFactory("MockDirectory");
        mockDirectory = await MockDirectory.deploy();
        await mockDirectory.deployed();
        await mockDirectory.setRocketMinipoolManagerAddress(mockRocketMinipoolManager.address);
        await mockDirectory.setRole(TimelockShortRole, owner.address, true);

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

        blockchainId = await ethers.provider.getNetwork().then((n) => n.chainId);
    });

    describe("when the message value is not equal to the lock threshold", function () {
        it.only("should revert", async function () {
            const salts  = await approvedSalt(3, subNodeOperator.address);
            const rawSalt = salts.rawSalt;
            const pepperedSalt = salts.pepperedSalt;
            const mockDepositData = {
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
            const config = {
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
            const messageHash = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(
                  ["address", "uint256", "address", "uint256", "uint256", "uint256"],
                  [
                    mockDepositData.minipoolAddress,
                    pepperedSalt,
                    superNodeAccount.address,
                    subNodeOperatorNonce,
                    nonce,
                    blockchainId,
                  ]
                )
            );
            const ethSignedMessageHash = ethers.utils.hashMessage(ethers.utils.arrayify(messageHash));
            const sig = await subNodeOperator.signMessage(ethers.utils.arrayify(messageHash));

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
            });
        });
        describe("when the minipool address does not exist", function () {
            describe("when the sub node account is not whitelisted", function () {
                it("should revert", async function () {
                });
            });
            describe("when the sub node account is whitelisted", function () {
                describe("when the sub node operator is equal to the active minipool count", function () {
                    it("should revert", async function () {
                    });
                });
                describe("when the sub node operator is below the active minipool count", function () {
                    describe("when the protocol does not have enough liquidity", function () {
                        it("should revert", async function () {
                        });
                    });
                    describe("when the protocol has enough liquidity", function () {
                        it("should create the minipool", async function () {
                        });
                    });
                });
            });
        });
    });
});
