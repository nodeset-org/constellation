import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture, protocolParams } from "../test/test";
import { setDefaultParameters } from "../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../test/utils/utils";
import { IXRETHOracle, NodeAccountFactory } from "../typechain-types";
import { expect } from "chai";
import readline from 'readline';

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
async function retryOperation(operation: () => Promise<any>, retries: number = 3, extendedRetries: number = 3) {
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

async function main() {
    const predictedNonce = 12;
    const [deployer, admin] = await ethers.getSigners();

    // Function to generate bytes32 representation for contract identifiers
    const generateBytes32Identifier = (identifier: string) => {
        // Correctly concatenate 'contract.address' with the identifier before hashing
        return ethers.utils.solidityKeccak256(["string"], [`contract.address${identifier}`]);
    };


    // Contract identifiers
    const contractIdentifiers = {
        rocketNodeManager: 'rocketNodeManager',
        rocketTokenRPL: 'rocketTokenRPL',
        rocketDAOProtocolSettingsNetwork: 'rocketDAOProtocolSettingsNetwork',
        rocketStorage: 'rocketStorage',
        rocketNodeStaking: 'rocketNodeStaking',
        rocketNodeDeposit: 'rocketNodeDeposit'
    };

    const rpAddresses: { [key: string]: string } = {};

    // Generate the bytes32 hashes for each identifier
    for (const [name, identifier] of Object.entries(contractIdentifiers)) {
        const bytes32Identifier = generateBytes32Identifier(identifier);
        console.log(`${name}: ${bytes32Identifier}`);
        rpAddresses[name] = bytes32Identifier;
    }

    const rocketStorage = await ethers.getContractAt('RocketStorage', '0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1'); // holesky addr

    // Resolve contract addresses
    for (const identifier of Object.values(contractIdentifiers)) {
        const bytes32Identifier = generateBytes32Identifier(identifier);
        const address = await rocketStorage.getAddress(bytes32Identifier);

        if (address === ethers.constants.AddressZero) {
            throw new Error(`Address not found for identifier ${identifier}`);
        }

        rpAddresses[identifier] = address;
    }

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const rplContract = await ethers.getContractAt("contracts/Interfaces/RocketTokenRPLInterface.sol:RocketTokenRPLInterface", rpAddresses['rocketTokenRPL']);
    const networkFeesContract = await ethers.getContractAt("contracts/Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol:RocketDAOProtocolSettingsNetworkInterface", rpAddresses['rocketDAOProtocolSettingsNetwork']);
    const rockStorageContract = await ethers.getContractAt("RocketStorage", rpAddresses['rocketStorage']);
    const rocketNodeManagerContract = await ethers.getContractAt("RocketNodeManagerInterface", rpAddresses['rocketNodeManager']);
    const rocketNodeStakingContract = await ethers.getContractAt("RocketNodeStaking", rpAddresses['rocketNodeStaking']);
    const rocketNodeDepositContract = await ethers.getContractAt("RocketNodeDeposit", rpAddresses['rocketNodeDeposit']);

    console.log("rocketpool contracts of interest")
    console.log("rplContract", rplContract.address)
    console.log("networkFeesContract", networkFeesContract.address)
    console.log("rockStorageContract", rockStorageContract.address)
    console.log("rocketNodeManagerContract", rocketNodeManagerContract.address)

    upgrades.silenceWarnings();
    // deploy weth
    const wETH = await retryOperation(async () => {
        const WETH = await ethers.getContractFactory("WETH");
        const contract = await WETH.deploy();
        await contract.deployed();
        return contract;
    });

    // wait for weth deploy to be mined

    // deploy mock uniswap v3 pool
    const uniswapV3Pool = await retryOperation(async () => {
        const UniswapV3Pool = await ethers.getContractFactory("MockUniswapV3Pool");
        const contract = await UniswapV3Pool.deploy();
        await contract.deployed();
        return contract;
    });

    // wait for uniswap v3 pool deploy to be mined

    const directoryAddress = await getNextContractAddress(deployer, predictedNonce - 1)
    console.log("predicted directory address", directoryAddress)

    const initNonce = await deployer.getTransactionCount();
    console.log("init nonce", initNonce)

    const whitelist = await retryOperation(async () => {
        const deployedProxy = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist"), [directoryAddress], { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        await deployedProxy.deployTransaction.wait();
        return deployedProxy;
    });
    console.log("whitelist address", whitelist.address);

    const vCWETHProxyAbi = await retryOperation(async () => {
        const deployedProxy = await upgrades.deployProxy(await ethers.getContractFactory("WETHVault"), [directoryAddress, wETH.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        await deployedProxy.deployTransaction.wait();
        return deployedProxy;
    });
    console.log("vCWETHProxyAbi address", vCWETHProxyAbi.address);

    const vCWETH = await ethers.getContractAt("WETHVault", vCWETHProxyAbi.address);
    console.log("vCWETH address", vCWETH.address)

    const vCRPLProxyAbi = await retryOperation(async () => {
        const deployedProxy = await upgrades.deployProxy(await ethers.getContractFactory("RPLVault"), [directoryAddress, rplContract.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        await deployedProxy.deployTransaction.wait();
        return deployedProxy;
    });
    console.log("vCRPLProxyAbi address", vCRPLProxyAbi.address);

    const vCRPL = await ethers.getContractAt("RPLVault", vCRPLProxyAbi.address);
    console.log("vCRPL address", vCRPL.address)

    const depositPoolProxyAbi = await retryOperation(async () => {
        const deployedProxy = await upgrades.deployProxy(await ethers.getContractFactory("FundRouter"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        await deployedProxy.deployTransaction.wait();
        return deployedProxy;
    });
    console.log("depositPoolProxyAbi address", depositPoolProxyAbi.address);


    const depositPool = await ethers.getContractAt("FundRouter", depositPoolProxyAbi.address);
    console.log("depositPool address", depositPool.address)

    const operatorDistributorProxyAbi = await retryOperation(async () => {
        const deployedProxy = await upgrades.deployProxy(await ethers.getContractFactory("OperatorDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        await deployedProxy.deployTransaction.wait();
        return deployedProxy;
    });
    console.log("operatorDistributorProxyAbi address", operatorDistributorProxyAbi.address);

    // wait for operatorDistributor deploy to be mined
    await operatorDistributorProxyAbi.deployTransaction.wait();

    const operatorDistributor = await ethers.getContractAt("OperatorDistributor", operatorDistributorProxyAbi.address);
    console.log("operatorDistributor address", operatorDistributor.address)

    const yieldDistributorProxyAbi = await retryOperation(async () => {
        const deployedProxy = await upgrades.deployProxy(await ethers.getContractFactory("YieldDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
        await deployedProxy.deployTransaction.wait();
        return deployedProxy;
    });
    console.log("yieldDistributorProxyAbi address", yieldDistributorProxyAbi.address);

    const yieldDistributor = await ethers.getContractAt("YieldDistributor", yieldDistributorProxyAbi.address);
    console.log("yieldDistributor address", yieldDistributor.address)

    const oracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;
    console.log("oracle address", oracle.address)

    // wait for oracle deploy to be mined
    await oracle.deployTransaction.wait();

    const priceFetcher = await retryOperation(async () => {
        const deployedProxy = await upgrades.deployProxy(await ethers.getContractFactory("PriceFetcher"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        await deployedProxy.deployed();
        return deployedProxy;
    });
    console.log("priceFetcher address", priceFetcher.address);

    const sanctions = await retryOperation(async () => {
        const Sanctions = await ethers.getContractFactory("MockSanctions");
        const contract = await Sanctions.deploy();
        await contract.deployed();
        return contract;
    });
    console.log("sanctions address", sanctions.address);

    const NodeAccountFactory = await retryOperation(async () => {
        const NodeAccountLogic = await ethers.getContractFactory("NodeAccount");
        const NodeAccountLogic = await NodeAccountLogic.deploy();
        await NodeAccountLogic.deployed();
        const factory = await upgrades.deployProxy(await ethers.getContractFactory("NodeAccountFactory"), [directoryAddress, NodeAccountLogic.address], { 'initializer': 'initializeWithImplementation', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        await factory.deployTransaction.wait();
        return factory;
    }) as NodeAccountFactory;
    console.log("validator factory address", NodeAccountFactory.address);

    const directoryProxyAbi = await retryOperation(async () => {
        const deployedProxy = await upgrades.deployProxy(await ethers.getContractFactory("Directory"),
            [
                [
                    whitelist.address,
                    vCWETH.address,
                    vCRPL.address,
                    depositPool.address,
                    operatorDistributor.address,
                    NodeAccountFactory.address,
                    yieldDistributor.address,
                    oracle.address,
                    priceFetcher.address,
                    rockStorageContract.address,
                    rocketNodeManagerContract.address,
                    rocketNodeStakingContract.address,
                    rocketNodeDepositContract.address,
                    rplContract.address,
                    wETH.address,
                    uniswapV3Pool.address,
                    sanctions.address,
                ],
                deployer.address,
                "0x241E263b40c7Bf458b6b28D86338cf26f7Cc5a57",
            ], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
        await deployedProxy.deployTransaction.wait();
        return deployedProxy;
    });
    console.log("directoryProxyAbi address", directoryProxyAbi.address);


    const finalNonce = await deployer.getTransactionCount();
    console.log("final nonce", finalNonce)

    const directory = await ethers.getContractAt("Directory", directoryProxyAbi.address);
    console.log("directory address", directory.address)

    // wait 30 seconds to ensure everything is deployed
    console.log("waiting 30 seconds for everything to deploy")
    await new Promise(r => setTimeout(r, 30000));

    expect(finalNonce - initNonce).to.equal(predictedNonce);
    expect(directory.address).to.hexEqual(directoryAddress);

    // set adminServer to be ADMIN_SERVER_ROLE
    const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_SERVER_ROLE"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(adminRole), deployer.address);
    });

    // set timelock to be TIMELOCK_ROLE
    const timelockRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_24_HOUR"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(timelockRole), deployer.address);
    });
    console.log("timelock role set");

    // set protocolSigner to be PROTOCOL_ROLE
    const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));
    await retryOperation(async () => {
        await directory.connect(admin).grantRole(ethers.utils.arrayify(protocolRole), deployer.address);
    });
    console.log("protocol role set");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });