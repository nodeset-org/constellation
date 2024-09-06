import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../integration";

describe("Distributable Yield", async () => {
    describe("When last oracle update is not 0", async () => {
        describe("When totalUnrealizedAccrual is greater than 0", async () => {
            it("should return positive totalUnrealizedAccrual", async () => {
                const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

                const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
                await protocol.directory.connect(signers.admin).grantRole(adminOracleRole, signers.random.address);
                const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
                const network = await ethers.provider.getNetwork();
                const chainId = network.chainId;
                const newTotalYield = ethers.utils.parseEther("100");
                const currentOracleError = await protocol.operatorDistributor.oracleError();
                const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
                const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, protocol.oracle.address, chainId]);
                const signature = await signers.random.signMessage(ethers.utils.arrayify(messageHash));
                const tx = await protocol.oracle.connect(signers.admin).setTotalYieldAccrued(signature, sigData);
                const receipt = await tx.wait();
                const block = await ethers.provider.getBlock(receipt.blockNumber)

                expect(await protocol.oracle.getLastUpdatedTotalYieldAccrued()).equals(block.timestamp);
                expect(await protocol.operatorDistributor.oracleError()).equals(0);

                const {signed, distributableYield} = await protocol.vCWETH.getDistributableYield();
                expect(signed).equals(false)
                expect(distributableYield).equals(newTotalYield)
            })
        })

        describe("When totalUnrealizedAccrual is equal 0", async () => {
            it("should return positive totalUnrealizedAccrual", async () => {
                const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

                const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
                await protocol.directory.connect(signers.admin).grantRole(adminOracleRole, signers.random.address);
                const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
                const network = await ethers.provider.getNetwork();
                const chainId = network.chainId;
                const newTotalYield = ethers.utils.parseEther("0");
                const currentOracleError = await protocol.operatorDistributor.oracleError();
                const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
                const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, protocol.oracle.address, chainId]);
                const signature = await signers.random.signMessage(ethers.utils.arrayify(messageHash));
                const tx = await protocol.oracle.connect(signers.admin).setTotalYieldAccrued(signature, sigData);
                const receipt = await tx.wait();
                const block = await ethers.provider.getBlock(receipt.blockNumber)

                expect(await protocol.oracle.getLastUpdatedTotalYieldAccrued()).equals(block.timestamp);
                expect(await protocol.oracle.getLastUpdatedTotalYieldAccrued()).not.equals(0);
                expect(await protocol.operatorDistributor.oracleError()).equals(0);

                const {signed, distributableYield} = await protocol.vCWETH.getDistributableYield();
                expect(signed).equals(false)
                expect(distributableYield).equals(0)
            })
        })

        describe("When totalUnrealizedAccrual is less than 0", async () => {
            it("should return negative totalUnrealizedAccrual", async () => {
                const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

                const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
                await protocol.directory.connect(signers.admin).grantRole(adminOracleRole, signers.random.address);
                const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
                const network = await ethers.provider.getNetwork();
                const chainId = network.chainId;
                const newTotalYield = ethers.utils.parseEther("-10");
                const currentOracleError = await protocol.operatorDistributor.oracleError();
                const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
                const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, protocol.oracle.address, chainId]);
                const signature = await signers.random.signMessage(ethers.utils.arrayify(messageHash));
                const tx = await protocol.oracle.connect(signers.admin).setTotalYieldAccrued(signature, sigData);
                const receipt = await tx.wait();
                const block = await ethers.provider.getBlock(receipt.blockNumber)

                expect(await protocol.oracle.getLastUpdatedTotalYieldAccrued()).equals(block.timestamp);
                expect(await protocol.oracle.getLastUpdatedTotalYieldAccrued()).not.equals(0);
                expect(await protocol.operatorDistributor.oracleError()).equals(0);

                const {signed, distributableYield} = await protocol.vCWETH.getDistributableYield();
                expect(signed).equals(true)
                expect(distributableYield).equals(newTotalYield.mul(-1))
            })
        })

    })

    describe("When last oracle update is 0", async () => {
        describe("When totalUnrealizedAccrual is equal to 0", async () => {
            it("should return positive totalUnrealizedAccrual", async () => {
                const { protocol, signers, rocketPool } = await loadFixture(protocolFixture);

                expect(await protocol.oracle.getLastUpdatedTotalYieldAccrued()).equals(0);
                expect(await protocol.operatorDistributor.oracleError()).equals(0);

                const {signed, distributableYield} = await protocol.vCWETH.getDistributableYield();

                expect(distributableYield).equals(0);
                expect(signed).equals(false);
            })
        })
    })
})