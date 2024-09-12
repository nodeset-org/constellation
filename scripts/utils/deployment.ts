import { ethers, upgrades } from "hardhat";
import fs from 'fs';
import path from 'path';
import { getNextContractAddress } from "../../test/utils/utils";
import { getInitializerData } from "@openzeppelin/hardhat-upgrades/dist/utils";
import readline from 'readline';
import { Treasury, Directory, IRocketStorage, IConstellationOracle, OperatorDistributor, PriceFetcher, RPLVault, SuperNodeAccount, WETHVault, Whitelist, NodeSetOperatorRewardDistributor, PoAConstellationOracle, MerkleClaimStreamer } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Protocol, Signers } from "../../test/integration/integration";
import { RocketStorage, RocketTokenRPL } from "../../test/rocketpool/_utils/artifacts";
import { ERC20 } from "../../typechain-types/contracts/Testing/Rocketpool/contract/util";
import { expect } from "chai";
import { ConstellationTimelock } from "../../typechain-types/contracts/External/TimelockController.sol";

// Function to prompt user for input
function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise<string>(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

// Updated retry operation function
export async function retryOperation(operation: () => Promise<any>, retries: number = 3, extendedRetries: number = 3) {
    try {
        return await operation();
    } catch (error) {
        console.log(error);

        if (retries > 0) {
            console.log(`Retrying operation, attempts remaining: ${retries}...`);
            return await retryOperation(operation, retries - 1, extendedRetries);
        } else if (extendedRetries > 0) {
            const answer = await askQuestion('Operation failed. Do you want to retry? (y/n): ');
            if (answer.toLowerCase() === 'y') {
                console.log(`Extended retry, attempts remaining: ${extendedRetries}...`);
                return await retryOperation(operation, 0, extendedRetries - 1);
            } else {
                throw new Error('Operation aborted by the user.');
            }
        } else {
            throw error;
        }
    }
}

// Function to generate bytes32 representation for contract identifiers
export const generateBytes32Identifier = (identifier: string) => {
    // Correctly concatenate 'contract.address' with the identifier before hashing
    return ethers.utils.solidityKeccak256(["string"], [`contract.address${identifier}`]);
};

export async function fastDeployProtocol(
    treasurer: SignerWithAddress,
    deployer: SignerWithAddress,
    nodesetAdmin: SignerWithAddress,
    nodesetAdminServer: SignerWithAddress,
    adminServer: SignerWithAddress,
    directoryDeployer: SignerWithAddress,
    oracleAdmin: SignerWithAddress,
    rocketStorage: string,
    weth: string,
    sanctions: string,
    admin: string,
    log: boolean,
    defaultOffset = 1) {
    const directoryAddress = await getNextContractAddress(directoryDeployer, defaultOffset)

    const whitelistProxy = await retryOperation(async () => {
        const whitelist = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Constellation/Whitelist.sol:Whitelist", deployer), [directoryAddress], { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        if (log) console.log("whitelist deployed to", whitelist.address)
        return whitelist;
    });

    const vCWETHProxy = await retryOperation(async () => {
        const vCWETH = await upgrades.deployProxy(await ethers.getContractFactory("WETHVault", deployer), [directoryAddress, weth], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("vaulted constellation eth deployed to", vCWETH.address)
        return vCWETH;
    });

    const oracleProxy = await retryOperation(async () => {
        const oracle = await upgrades.deployProxy(await ethers.getContractFactory("PoAConstellationOracle", deployer), [directoryAddress], { 'initializer': 'initializeOracle', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("admin oracle deployed to", oracle.address)
        return oracle;
    });

    const addressRplContract = await retryOperation(async () => {
        const bytes32IdentifierRplContract = generateBytes32Identifier('rocketTokenRPL');
        const rocketStorageDeployment = await ethers.getContractAt("RocketStorage", rocketStorage);
        const addressRplContract = await rocketStorageDeployment.getAddress(bytes32IdentifierRplContract);
        return addressRplContract
    })

    const rplContract = await retryOperation(async function () {
        return await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20", addressRplContract);
    });

    const timelockShort = await retryOperation(async function () {
        const timelockShort = await (await ethers.getContractFactory("ConstellationTimelock")).deploy(0, [admin], [admin], admin);
        await timelockShort.deployed();
        if (log) console.log("timelock short deployed to", timelockShort.address)
        return timelockShort
    })

    const timelockMed = await retryOperation(async function () {
        const timelockMed = await (await ethers.getContractFactory("ConstellationTimelock")).deploy(0, [admin], [admin], admin);
        await timelockMed.deployed();
        if (log) console.log("timelock med deployed to", timelockMed.address)
        return timelockMed
    })

    const timelockLong = await retryOperation(async function () {
        const timelockLong = await (await ethers.getContractFactory("ConstellationTimelock")).deploy(0, [admin], [admin], admin);
        await timelockLong.deployed();
        if (log) console.log("timelock long deployed to", timelockLong.address)
        return timelockLong
    })

    const vCRPLProxy = await retryOperation(async function () {
        const vCRPL = await upgrades.deployProxy(await ethers.getContractFactory("RPLVault", deployer), [directoryAddress, rplContract.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("vaulted constellation rpl deployed to", vCRPL.address)
        return vCRPL
    })

    const operatorDistributorProxy = await retryOperation(async function () {
        const od = await upgrades.deployProxy(await ethers.getContractFactory("OperatorDistributor", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("operator distributor deployed to", od.address)
        return od
    })

    const merkleClaimStreamerProxy = await retryOperation(async function () {
        const od = await upgrades.deployProxy(await ethers.getContractFactory("MerkleClaimStreamer", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("merkle claim streamer deployed to", od.address)
        return od
    })

    const yieldDistributorProxy = await retryOperation(async function () {
        const yd = await upgrades.deployProxy(await ethers.getContractFactory("NodeSetOperatorRewardDistributor", deployer), [nodesetAdmin.address, nodesetAdminServer.address], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        if (log) console.log("yield distributor deployed to", yd.address)
        return yd
    })

    const priceFetcherProxy = await retryOperation(async function () {
        const pf = await upgrades.deployProxy(await ethers.getContractFactory("PriceFetcher", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        if (log) console.log("price fetcher deployed to", pf.address)
        return pf
    })

    const treasuryProxy = await retryOperation(async function () {
        const at = await upgrades.deployProxy(await ethers.getContractFactory("Treasury", deployer), [treasurer.address], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        if (log) console.log("admin treasury deployed to", at.address)
        return at
    })

    const superNodeProxy = await retryOperation(async function () {
        const snap = await upgrades.deployProxy(await ethers.getContractFactory("SuperNodeAccount", deployer), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        if (log) console.log("super node deployed to", snap.address)
        return snap
    })

    if (log) {
        console.log("verify directory input");
        console.log("whitelistProxy.address", whitelistProxy.address)
        console.log("vCWETHProxy.address", vCWETHProxy.address)
        console.log("vCRPLProxy.address", vCRPLProxy.address)
        console.log("operatorDistributorProxy.address", operatorDistributorProxy.address)
        console.log("merkleClaimStreamerProxy.address", merkleClaimStreamerProxy.address)
        console.log("yieldDistributorProxy.address", yieldDistributorProxy.address)
        console.log("oracle", oracleProxy.address)
        console.log("priceFetcherProxy.address", priceFetcherProxy.address)
        console.log("snap.address", superNodeProxy.address)
        console.log("rocketStorage", rocketStorage)
        console.log("weth", weth)
        console.log("sanctions", sanctions)
    }

    const directoryProxy = await retryOperation(async () => {
        const dir = await upgrades.deployProxy(await ethers.getContractFactory("Directory", directoryDeployer),
            [
                [
                    whitelistProxy.address,
                    vCWETHProxy.address,
                    vCRPLProxy.address,
                    operatorDistributorProxy.address,
                    merkleClaimStreamerProxy.address,
                    oracleProxy.address,
                    priceFetcherProxy.address,
                    superNodeProxy.address,
                    rocketStorage,
                    weth,
                    sanctions,
                ],
                yieldDistributorProxy.address,
                [
                    admin,
                    treasurer.address,
                    treasuryProxy.address,
                    // timelockShort.address,
                    // timelockMed.address,
                    // timelockLong.address,
                    admin,
                    admin,
                    admin,
                    adminServer.address,
                    oracleAdmin.address
                ]
            ], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });

        if (log) console.log("directory deployed to", dir.address)

        return dir
    })

    if (log) {
        if (directoryAddress.toLocaleLowerCase() === directoryProxy.address.toLocaleLowerCase()) {
            console.log("directory matches predicted address", directoryAddress)
        } else {
            console.error("failed to deploy directory address to predicted address", directoryAddress, directoryProxy.address)
            throw new Error("Bad predicted directory")
        }
    }

    await retryOperation(async () => {
        console.log("trying to lazyInitialize superNodeProxy...")
        await superNodeProxy.lazyInitialize();
    })

    return {
        whitelist: whitelistProxy as Whitelist,
        vCWETH: vCWETHProxy as WETHVault,
        vCRPL: vCRPLProxy as RPLVault,
        operatorDistributor: operatorDistributorProxy as OperatorDistributor,
        merkleClaimStreamer: merkleClaimStreamerProxy as MerkleClaimStreamer,
        yieldDistributor: yieldDistributorProxy as NodeSetOperatorRewardDistributor,
        priceFetcher: priceFetcherProxy as PriceFetcher,
        oracle: oracleProxy as PoAConstellationOracle,
        superNode: superNodeProxy as SuperNodeAccount,
        treasury: treasuryProxy as Treasury,
        directory: directoryProxy as Directory,
        timelockShort: timelockShort as ConstellationTimelock,
        timelockMed: timelockMed as ConstellationTimelock,
        timelockLong: timelockLong as ConstellationTimelock
    }
}

export async function deployProtocol(signers: Signers, log = false): Promise<Protocol> {
    const RocketStorageDeployment = await RocketStorage.deployed();
    const rockStorageContract = (await ethers.getContractAt(
        "RocketStorage",
        RocketStorageDeployment.address
    )) as IRocketStorage;
    const RplToken = await RocketTokenRPL.deployed();
    const rplContract = (await ethers.getContractAt(
        "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
        RplToken.address // RplToken.address
    )) as ERC20;

    upgrades.silenceWarnings();

    // deploy weth
    const WETH = await ethers.getContractFactory("WETH");
    const wETH = await WETH.deploy();
    await wETH.deployed();

    // deploy mock sanctions
    const Sanctions = await ethers.getContractFactory("MockSanctions");
    const sanctions = await Sanctions.deploy();
    await sanctions.deployed();

    const deployer = (await ethers.getSigners())[0];

    const { whitelist, vCWETH, vCRPL, operatorDistributor, merkleClaimStreamer, superNode, oracle, yieldDistributor, priceFetcher, directory, treasury, timelockShort, timelockMed, timelockLong } = await fastDeployProtocol(
        signers.treasurer,
        signers.deployer,
        signers.nodesetAdmin,
        signers.nodesetServerAdmin,
        signers.adminServer,
        signers.random5,
        signers.random4,
        rockStorageContract.address,
        wETH.address,
        sanctions.address,
        signers.admin.address,
        log
    )

    const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_SERVER_ROLE"));
    let tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(adminRole), signers.adminServer.address);
    await tx.wait();

    // set timelock to be TIMELOCK_ROLE
    const timelockRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_SHORT"));
    tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(timelockRole), signers.admin.address);
    await tx.wait();

    const timelockRoleMed = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_MED"));
    tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(timelockRoleMed), signers.admin.address);
    await tx.wait();

    const timelockLongRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_LONG"));
    tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(timelockLongRole), signers.admin.address);
    await tx.wait();

    const oracleAdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
    tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(oracleAdminRole), signers.admin.address);
    await tx.wait();

    // set protocolSigner to be PROTOCOL_ROLE
    const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));
    console.log(signers.admin.address)
    tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(protocolRole), signers.protocolSigner.address);
    await tx.wait();

    expect(await directory.getTreasuryAddress()).to.equal(treasury.address);

    const returnData: Protocol = { treasury, directory, whitelist, vCWETH, vCRPL, operatorDistributor, merkleClaimStreamer, superNode, yieldDistributor, oracle, priceFetcher, wETH, sanctions };

    // send all rpl from admin to rplWhale
    const rplWhaleBalance = await rplContract.balanceOf(signers.deployer.address);
    tx = await rplContract.transfer(signers.rplWhale.address, rplWhaleBalance);
    await tx.wait();

    let hasProtocolRole = await returnData.directory.hasRole(protocolRole, signers.protocolSigner.address);
    while(!(hasProtocolRole)) {
        hasProtocolRole = await returnData.directory.hasRole(protocolRole, signers.protocolSigner.address);
    }

    return returnData;
}