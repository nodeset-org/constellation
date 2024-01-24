import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture, protocolParams } from "../test/test";
import { setDefaultParameters } from "../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../test/utils/utils";
import { IXRETHOracle, ValidatorAccountFactory } from "../typechain-types";
import { expect } from "chai";

async function main() {
    const predictedNonce = 12;
    const [deployer] = await ethers.getSigners();

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
    const WETH = await ethers.getContractFactory("WETH");
    const wETH = await WETH.deploy();
    await wETH.deployed();

    // wait for weth deploy to be mined
    await wETH.deployTransaction.wait();

    // deploy mock uniswap v3 pool
    const UniswapV3Pool = await ethers.getContractFactory("MockUniswapV3Pool");
    const uniswapV3Pool = await UniswapV3Pool.deploy();
    await uniswapV3Pool.deployed();

    // wait for uniswap v3 pool deploy to be mined
    await uniswapV3Pool.deployTransaction.wait();

    const directoryAddress = await getNextContractAddress(deployer, predictedNonce - 1)
    console.log("predicted directory address", directoryAddress)

    const initNonce = await deployer.getTransactionCount();
    console.log("init nonce", initNonce)

    const whitelist = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist"), [directoryAddress], { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
    console.log("whitelist address", whitelist.address)

    // wait for whitelist deploy to be mined
    await whitelist.deployTransaction.wait();

    const vCWETHProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("WETHVault"), [directoryAddress, wETH.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("vCWETHProxyAbi address", vCWETHProxyAbi.address)

    // wait for vCWETH deploy to be mined
    await vCWETHProxyAbi.deployTransaction.wait();

    const vCWETH = await ethers.getContractAt("WETHVault", vCWETHProxyAbi.address);
    console.log("vCWETH address", vCWETH.address)

    const vCRPLProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("RPLVault"), [directoryAddress, rplContract.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("vCRPLProxyAbi address", vCRPLProxyAbi.address)

    // wait for vCRPL deploy to be mined
    await vCRPLProxyAbi.deployTransaction.wait();

    const vCRPL = await ethers.getContractAt("RPLVault", vCRPLProxyAbi.address);
    console.log("vCRPL address", vCRPL.address)

    const depositPoolProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("DepositPool"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("depositPoolProxyAbi address", depositPoolProxyAbi.address)

    // wait for depositPool deploy to be mined
    await depositPoolProxyAbi.deployTransaction.wait();

    const depositPool = await ethers.getContractAt("DepositPool", depositPoolProxyAbi.address);
    console.log("depositPool address", depositPool.address)

    const operatorDistributorProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("OperatorDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("operatorDistributorProxyAbi address", operatorDistributorProxyAbi.address)

    // wait for operatorDistributor deploy to be mined
    await operatorDistributorProxyAbi.deployTransaction.wait();

    const operatorDistributor = await ethers.getContractAt("OperatorDistributor", operatorDistributorProxyAbi.address);
    console.log("operatorDistributor address", operatorDistributor.address)

    const yieldDistributorProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("YieldDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("yieldDistributorProxyAbi address", yieldDistributorProxyAbi.address)

    // wait for yieldDistributor deploy to be mined
    await yieldDistributorProxyAbi.deployTransaction.wait();

    const yieldDistributor = await ethers.getContractAt("YieldDistributor", yieldDistributorProxyAbi.address);
    console.log("yieldDistributor address", yieldDistributor.address)

    const oracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;
    console.log("oracle address", oracle.address)

    // wait for oracle deploy to be mined
    await oracle.deployTransaction.wait();

    const priceFetcher = await upgrades.deployProxy(await ethers.getContractFactory("PriceFetcher"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
    console.log("priceFetcher address", priceFetcher.address)

    // wait for priceFetcher deploy to be mined
    await priceFetcher.deployTransaction.wait();

    // deploy mock sanctions
    const Sanctions = await ethers.getContractFactory("MockSanctions");
    const sanctions = await Sanctions.deploy();
    await sanctions.deployed();
    console.log("sanctions address", sanctions.address);

    const ValidatorAccountLogic = await ethers.getContractFactory("ValidatorAccount");
    const validatorAccountLogic = await ValidatorAccountLogic.deploy();
    await validatorAccountLogic.deployed();
    const validatorAccountFactory = await upgrades.deployProxy(await ethers.getContractFactory("ValidatorAccountFactory"), [directoryAddress, validatorAccountLogic.address], { 'initializer': 'initializeWithImplementation', 'kind': 'uups', 'unsafeAllow': ['constructor'] }) as ValidatorAccountFactory;
    console.log("validator factory address", validatorAccountFactory.address);

    const directoryProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("Directory"),
        [
            [
                whitelist.address,
                vCWETH.address,
                vCRPL.address,
                depositPool.address,
                operatorDistributor.address,
                yieldDistributor.address,
                validatorAccountFactory.address,
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

            ]
        ], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });

    console.log("directoryProxyAbi address", directoryProxyAbi.address)

    // wait for directory deploy to be mined
    await directoryProxyAbi.deployTransaction.wait();

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
    await directory.grantRole(ethers.utils.arrayify(adminRole), deployer.address);
    console.log("admin role set")

    // set timelock to be TIMELOCK_ROLE
    const timelockRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_24_HOUR"));
    await directory.grantRole(ethers.utils.arrayify(timelockRole), deployer.address);
    console.log("timelock role set")

    // set protocolSigner to be PROTOCOL_ROLE
    const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));
    await directory.grantRole(ethers.utils.arrayify(protocolRole), deployer.address);
    console.log("protocol role set")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });