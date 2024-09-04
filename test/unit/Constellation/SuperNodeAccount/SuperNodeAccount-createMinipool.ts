import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
import { generateDepositData } from "../../../rocketpool/_helpers/minipool";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator } from "../../../utils/utils";
describe("SuperNodeAccount", function () {
  let superNodeAccount: Contract;
  let mockRocketMinipoolManager: Contract;
  let mockWhitelist: Contract;
  let mockOperatorDistributor: Contract;
  let owner: any;
  let subNodeOperator: any;
  let otherSigner: any;

    beforeEach(async function () {
        [owner, subNodeOperator, otherSigner] = await ethers.getSigners();

        // Deploy mock contracts
        const MockRocketMinipoolManager = await ethers.getContractFactory("MockRocketMinipoolManager");
        mockRocketMinipoolManager = await MockRocketMinipoolManager.deploy();
        await mockRocketMinipoolManager.deployed();

        const MockWhitelist = await ethers.getContractFactory("MockWhitelist");
        mockWhitelist = await MockWhitelist.deploy();
        await mockWhitelist.deployed();

        const MockOperatorDistributor = await ethers.getContractFactory("MockOperatorDistributor");
        mockOperatorDistributor = await MockOperatorDistributor.deploy();
        await mockOperatorDistributor.deployed();

        // Deploy the SuperNodeAccount contract
        const SuperNodeAccountFactory = await ethers.getContractFactory("SuperNodeAccount");
        superNodeAccount = await upgrades.deployProxy(SuperNodeAccountFactory, [mockOperatorDistributor.address], {
            initializer: "initialize",
            kind: "uups",
            unsafeAllow: ["constructor"],
        });

        await superNodeAccount.deployed();
    });

    describe("when the message value is below the threshold", function () {
        it("should revert", async function () {
            const salts  = await approvedSalt(3, subNodeOperator.address);
            const rawSalt = salts.rawSalt;
            const pepperedSalt = salts.pepperedSalt;
                const depositData = await generateDepositData(superNodeAccount.address, pepperedSalt)
            const bond = await setupData.protocol.superNode.bond();
            const config = {
                timezoneLocation: 'Australia/Brisbane',
                bondAmount: bond,
                minimumNodeFee: 0,
                validatorPubkey: depositData.depositData.pubkey,
                validatorSignature: depositData.depositData.signature,
                depositDataRoot: depositData.depositDataRoot,
                salt: pepperedSalt,
                expectedMinipoolAddress: depositData.minipoolAddress,
            };
            const message = await approveHasSignedExitMessageSig(
                setupData,
                nodeOperator.address,
                '0x' + config.expectedMinipoolAddress,
                config.salt,
            );
            const sig = message.sig
            await expect(
                protocol.superNode
            .connect(nodeOperator)
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
    describe("when the message value is equal to the threshold", function () {
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
    // describe("when the message value is above the threshold", function () {
    // });
});
