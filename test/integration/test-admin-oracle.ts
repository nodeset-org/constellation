import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "./integration";
import { registerNewValidator } from "../utils/utils";

describe("XRETHOracle", function () {

    describe("Initialization", function () {
        it("Should initialize with correct directory address", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            expect(await oracle.getDirectory()).to.equal(directory.address);
        });
    });

    describe("Upgradability", function () {
        it("Admin can upgrade contract", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin } = signers;

            const initialAddress = oracle.address;
            const initialImpl = await upgrades.erc1967.getImplementationAddress(initialAddress);

            const MockXRETHOracleV2 = await ethers.getContractFactory("MockRETHOracle", admin);
            const newXRETHOracle = await upgrades.upgradeProxy(oracle.address, MockXRETHOracleV2, {
                kind: 'uups', unsafeAllow: [
                    'state-variable-assignment',
                    'missing-public-upgradeto',
                    'state-variable-immutable',
                    'constructor',
                    'delegatecall',
                    'selfdestruct',
                    'external-library-linking',
                    'enum-definition',
                    'struct-definition'
                ], unsafeAllowCustomTypes: true, unsafeSkipStorageCheck: true

            });

            expect(newXRETHOracle.address).to.equal(initialAddress);
            expect(await upgrades.erc1967.getImplementationAddress(initialAddress)).to.not.equal(initialImpl);
        });
    });

    describe("Yield Accrual", function () {
        it("Should return the correct total yield accrued", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin } = signers;

            expect(await oracle.getTotalYieldAccrued()).to.equal(0);
        });

        it("Cannot update yield with future timestamp", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin, random } = signers;

            const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));

            await directory.connect(admin).grantRole(adminOracleRole, random.address);

            const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp+10000
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            const newTotalYield = ethers.utils.parseEther("100");
            const currentOracleError = await protocol.operatorDistributor.oracleError();
            const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
            const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
            const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

            await expect(oracle.connect(admin).setTotalYieldAccrued(signature, sigData)).to.be.revertedWith("cannot update oracle using future data");
        })

        it("Should set total yield accrued with valid signature", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin, random } = signers;

            const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));

            await directory.connect(admin).grantRole(adminOracleRole, random.address);

            const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            const newTotalYield = ethers.utils.parseEther("100");
            const currentOracleError = await protocol.operatorDistributor.oracleError();
            const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
            const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
            const signature = await random.signMessage(ethers.utils.arrayify(messageHash));


            await oracle.connect(admin).setTotalYieldAccrued(signature, sigData);
            expect(await oracle.getTotalYieldAccrued()).to.equal(newTotalYield);
        });

        it("Should set total yield accrued with valid signature adjusting for 0 fees (expect no impact)", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin, random } = signers;

            const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));

            await directory.connect(admin).grantRole(adminOracleRole, random.address);

            const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            await protocol.vCWETH.connect(signers.admin).setTreasuryFee(0);
            await protocol.vCWETH.connect(signers.admin).setNodeOperatorFee(0);

            const newTotalYield = ethers.utils.parseEther("100");

            const currentOracleError = await protocol.operatorDistributor.oracleError();
            const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
            const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
            const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

            await oracle.connect(admin).setTotalYieldAccrued(signature, sigData);
            expect(await oracle.getTotalYieldAccrued()).to.equal(newTotalYield);
        });

        it("Should set total yield accrued with valid signature adjusting for 100% fees (expect no impact)", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin, random } = signers;

            const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));

            await directory.connect(admin).grantRole(adminOracleRole, random.address);

            const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            await protocol.vCWETH.connect(signers.admin).setNodeOperatorFee(0);
            await protocol.vCWETH.connect(signers.admin).setTreasuryFee(ethers.utils.parseEther("1"));

            const newTotalYield = ethers.utils.parseEther("100");

            const currentOracleError = await protocol.operatorDistributor.oracleError();
            const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
            const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
            const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

            await oracle.connect(admin).setTotalYieldAccrued(signature, sigData);
            expect(await oracle.getTotalYieldAccrued()).to.equal(newTotalYield);
        });

        it("Should fail to set total yield accrued with invalid signature", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin, random } = signers;

            const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            const newTotalYield = ethers.utils.parseEther("100");
            const currentOracleError = await protocol.operatorDistributor.oracleError();
            const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
            const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
            const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

            await expect(
                oracle.connect(admin).setTotalYieldAccrued(signature, sigData)
            ).to.be.revertedWith("signer must have permission from admin oracle role");
        });

        it("Should fail to set total yield accrued with incorrect message hash", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin, random, random2 } = signers;

            const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
            await directory.connect(admin).grantRole(adminOracleRole, random.address);

            const newTotalYield = ethers.utils.parseEther("100");
            const currentOracleError = await protocol.operatorDistributor.oracleError();
            const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
            const incorrectMessageHash = ethers.utils.solidityKeccak256(["int256"], [newTotalYield]);
            const signature = await random.signMessage(ethers.utils.arrayify(incorrectMessageHash));

            await expect(
                oracle.connect(random).setTotalYieldAccrued(signature, sigData)
            ).to.be.revertedWith("signer must have permission from admin oracle role");
        });

        it("Should fail to set total yield accrued with older signature", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            const { admin, random } = signers;

            const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
            await directory.connect(admin).grantRole(adminOracleRole, random.address);

            const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;
            const newTotalYield = ethers.utils.parseEther("100");
            const currentOracleError = await protocol.operatorDistributor.oracleError();
            const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
            const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
            const signature = await random.signMessage(ethers.utils.arrayify(messageHash));
            await oracle.connect(admin).setTotalYieldAccrued(signature, sigData)

            await expect(
                oracle.connect(admin).setTotalYieldAccrued(signature, sigData)
            ).to.be.revertedWith("cannot update oracle using old data");
        })

        describe("When expected oracle error is less than the actual error", function () {
            describe("When new yield is greater than 0", function () {
                it("Adjusts appropriately", async function () {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers } = setupData;
                    const { oracle, directory } = protocol;
                    const { admin, random } = signers;
                    await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                    await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);

                    const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
                    await directory.connect(admin).grantRole(adminOracleRole, random.address);

                    const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
                    const network = await ethers.provider.getNetwork();
                    const chainId = network.chainId;
                    let newTotalYield = ethers.utils.parseEther("100");
                    let currentOracleError = await protocol.operatorDistributor.oracleError();
                    const expectedOracleError = currentOracleError;
                    const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: expectedOracleError, timeStamp: timestamp };
                    const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
                    const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

                    const minipools = await registerNewValidator(setupData, [random]);
                    const newRewards = ethers.utils.parseEther("1");
                    const priorBalance = await protocol.vCWETH.totalAssets();
                    await signers.ethWhale.sendTransaction({
                        to: minipools[0],
                        value: newRewards
                    })

                    await protocol.operatorDistributor.processMinipool(minipools[0]);

                    const actualYieldIncrease = (await protocol.vCWETH.totalAssets()).sub(priorBalance);

                    await oracle.connect(admin).setTotalYieldAccrued(signature, sigData)
                    newTotalYield = newTotalYield.sub(actualYieldIncrease);
                    expect(expectedOracleError < currentOracleError);
                    expect(await oracle.getTotalYieldAccrued()).to.equal(newTotalYield);
                });
            });
            describe("When new yield is less than 0", function () {
                it("Adjusts appropriately", async function () {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers } = setupData;
                    const { oracle, directory } = protocol;
                    const { admin, random } = signers;
                    await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                    await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);

                    const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
                    await directory.connect(admin).grantRole(adminOracleRole, random.address);

                    const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
                    const network = await ethers.provider.getNetwork();
                    const chainId = network.chainId;
                    let newTotalYield = ethers.utils.parseEther("-100");
                    let currentOracleError = await protocol.operatorDistributor.oracleError();
                    const expectedOracleError = currentOracleError;
                    const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: expectedOracleError, timeStamp: timestamp };
                    const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
                    const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

                    const minipools = await registerNewValidator(setupData, [random]);
                    const newRewards = ethers.utils.parseEther("1");
                    const priorBalance = await protocol.vCWETH.totalAssets();
                    await signers.ethWhale.sendTransaction({
                        to: minipools[0],
                        value: newRewards
                    })

                    await protocol.operatorDistributor.processMinipool(minipools[0]);

                    const actualYieldIncrease = (await protocol.vCWETH.totalAssets()).sub(priorBalance);

                    await oracle.connect(admin).setTotalYieldAccrued(signature, sigData)
                    newTotalYield = newTotalYield.add(actualYieldIncrease);
                    expect(expectedOracleError < currentOracleError);
                    expect(await oracle.getTotalYieldAccrued()).to.equal(newTotalYield);
                });
            });
            describe("When new yield is equal to 0", function () {
                it("New yield remains 0", async function () {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers } = setupData;
                    const { oracle, directory } = protocol;
                    const { admin, random } = signers;
                    await protocol.vCWETH.connect(signers.admin).setQueueableDepositsLimitEnabled(false);
                    await protocol.vCWETH.connect(signers.admin).setOracleUpdateThreshold(9999999999);
                    const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
                    await directory.connect(admin).grantRole(adminOracleRole, random.address);

                    const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
                    const network = await ethers.provider.getNetwork();
                    const chainId = network.chainId;
                    let newTotalYield = ethers.utils.parseEther("0");
                    let currentOracleError = await protocol.operatorDistributor.oracleError();
                    const expectedOracleError = currentOracleError;
                    const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: expectedOracleError, timeStamp: timestamp };
                    const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
                    const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

                    const minipools = await registerNewValidator(setupData, [random]);
                    const newRewards = ethers.utils.parseEther("1");
                    await signers.ethWhale.sendTransaction({
                        to: minipools[0],
                        value: newRewards
                    })
                    await protocol.operatorDistributor.processMinipool(minipools[0]);
                    expect(expectedOracleError < currentOracleError);
                    await oracle.connect(admin).setTotalYieldAccrued(signature, sigData)

                    expect(await oracle.getTotalYieldAccrued()).to.equal(0);
                });
            });
        });
        describe("When expected oracle error is equal to the actual error", function () {
            it("Total yield is not changed", async function () {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers } = setupData;
                const { oracle, directory } = protocol;
                const { admin, random } = signers;

                const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
                await directory.connect(admin).grantRole(adminOracleRole, random.address);

                const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
                const network = await ethers.provider.getNetwork();
                const chainId = network.chainId;
                let newTotalYield = ethers.utils.parseEther("100");
                let currentOracleError = await protocol.operatorDistributor.oracleError();
                const expectedOracleError = currentOracleError;
                const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: expectedOracleError, timeStamp: timestamp };
                const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
                const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

                await oracle.connect(admin).setTotalYieldAccrued(signature, sigData)

                expect(expectedOracleError).equals(currentOracleError);
                expect(await oracle.getTotalYieldAccrued()).to.equal(newTotalYield);
            });
        });
        describe("When expected oracle error is greater than the actual error", function () {
            it("Reverts", async function () {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers } = setupData;
                const { oracle, directory } = protocol;
                const { admin, random } = signers;

                const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
                await directory.connect(admin).grantRole(adminOracleRole, random.address);

                const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
                const network = await ethers.provider.getNetwork();
                const chainId = network.chainId;
                const newTotalYield = ethers.utils.parseEther("100");
                let currentOracleError = (await protocol.operatorDistributor.oracleError()).add(1); // add a bit to simulate a broken oracle
                const sigData = { newTotalYieldAccrued: newTotalYield, expectedOracleError: currentOracleError, timeStamp: timestamp };
                const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
                const signature = await random.signMessage(ethers.utils.arrayify(messageHash));

                await expect(oracle.connect(admin).setTotalYieldAccrued(signature, sigData))
                    .to.be.revertedWith('actual oracleError was less than expectedOracleError');
            });
        });

    });
});
