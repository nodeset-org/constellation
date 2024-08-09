import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "./test";
import { prepareOperatorDistributionContract, registerNewValidator } from "./utils/utils";

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
            const sigData = { newTotalYieldAccrued: newTotalYield, currentOracleError: currentOracleError, timeStamp: timestamp };
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
            const sigData = { newTotalYieldAccrued: newTotalYield, currentOracleError: currentOracleError, timeStamp: timestamp };
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
            const sigData = { newTotalYieldAccrued: newTotalYield, currentOracleError: currentOracleError, timeStamp: timestamp };
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
            const sigData = { newTotalYieldAccrued: newTotalYield, currentOracleError: currentOracleError, timeStamp: timestamp };
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
            const sigData = { newTotalYieldAccrued: newTotalYield, currentOracleError: currentOracleError, timeStamp: timestamp };
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
            const sigData = { newTotalYieldAccrued: newTotalYield, currentOracleError: currentOracleError, timeStamp: timestamp };
            const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
            const signature = await random.signMessage(ethers.utils.arrayify(messageHash));
            await oracle.connect(admin).setTotalYieldAccrued(signature, sigData)

            await expect(
                oracle.connect(admin).setTotalYieldAccrued(signature, sigData)
            ).to.be.revertedWith("cannot update oracle using old data");
        })

        it("Reverts when processMinipool is called after signature generation", async function (){
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
            const currentOracleError = await protocol.operatorDistributor.oracleError();
            const sigData = { newTotalYieldAccrued: newTotalYield, currentOracleError: currentOracleError, timeStamp: timestamp };
            const messageHash = ethers.utils.solidityKeccak256(["int256", "uint256", "uint256", "address", "uint256"], [newTotalYield, currentOracleError, timestamp, oracle.address, chainId]);
            const signature = await random.signMessage(ethers.utils.arrayify(messageHash));
            
            console.log("oracle error before update", await protocol.operatorDistributor.oracleError());

            const minipools = await registerNewValidator(setupData, [random]);
            await signers.ethWhale.sendTransaction({
                to: minipools[0],
                value: ethers.utils.parseEther("1")
              })
            await protocol.operatorDistributor.processMinipool(minipools[0]);

            console.log("oracle error after update", await protocol.operatorDistributor.oracleError());

            await expect(
                oracle.connect(admin).setTotalYieldAccrued(signature, sigData)
            ).to.be.revertedWith("oracle error is out of date");
        });
    });
});
