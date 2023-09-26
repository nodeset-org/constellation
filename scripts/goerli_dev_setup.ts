import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture, protocolParams } from "../test/test";
import { setDefaultParameters } from "../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../test/utils/utils";
import { IXRETHOracle } from "../typechain-types";
import { expect } from "chai";

async function main() {
    const predictedNonce = 17;
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    console.log("deploying rocket pool")
    await deployRocketPool();

    console.log("configuring rocket pool parameters")
    await setDefaultParameters();

    // load required rocket pool contracts
    const { rplContract, networkFeesContract, rockStorageContract, rocketNodeManagerContract, rocketNodeStakingContract } = await getRocketPool()

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

    // deploy mock uniswap v3 pool
    const UniswapV3Pool = await ethers.getContractFactory("MockUniswapV3Pool");
    const uniswapV3Pool = await UniswapV3Pool.deploy();
    await uniswapV3Pool.deployed();

    const directoryAddress = await getNextContractAddress(deployer, predictedNonce - 1)
    console.log("predicted directory address", directoryAddress)

    const initNonce = await deployer.getTransactionCount();
    console.log("init nonce", initNonce)

    const whitelist = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist"), [directoryAddress, protocolParams.trustBuildPeriod], { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
    console.log("whitelist address", whitelist.address)

    const vCWETHProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("WETHVault"), [directoryAddress, wETH.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("vCWETHProxyAbi address", vCWETHProxyAbi.address)

    const vCWETH = await ethers.getContractAt("WETHVault", vCWETHProxyAbi.address);
    console.log("vCWETH address", vCWETH.address)

    const vCRPLProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("RPLVault"), [directoryAddress, rplContract.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("vCRPLProxyAbi address", vCRPLProxyAbi.address)

    const vCRPL = await ethers.getContractAt("RPLVault", vCRPLProxyAbi.address);
    console.log("vCRPL address", vCRPL.address)

    const depositPoolProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("DepositPool"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("depositPoolProxyAbi address", depositPoolProxyAbi.address)

    const depositPool = await ethers.getContractAt("DepositPool", depositPoolProxyAbi.address);
    console.log("depositPool address", depositPool.address)

    const operatorDistributorProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("OperatorDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("operatorDistributorProxyAbi address", operatorDistributorProxyAbi.address)

    const operatorDistributor = await ethers.getContractAt("OperatorDistributor", operatorDistributorProxyAbi.address);
    console.log("operatorDistributor address", operatorDistributor.address)

    const yieldDistributorProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("YieldDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
    console.log("yieldDistributorProxyAbi address", yieldDistributorProxyAbi.address)

    const yieldDistributor = await ethers.getContractAt("YieldDistributor", yieldDistributorProxyAbi.address);
    console.log("yieldDistributor address", yieldDistributor.address)

    const oracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;
    console.log("oracle address", oracle.address)

    const priceFetcher = await upgrades.deployProxy(await ethers.getContractFactory("PriceFetcher"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
    console.log("priceFetcher address", priceFetcher.address)

    const directoryProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("Directory"),
        [
            [
                whitelist.address,
                vCWETH.address,
                vCRPL.address,
                depositPool.address,
                operatorDistributor.address,
                yieldDistributor.address,
                oracle.address,
                priceFetcher.address,
                rockStorageContract.address,
                rocketNodeManagerContract.address,
                rocketNodeStakingContract.address,
                rplContract.address,
                wETH.address,
                uniswapV3Pool.address
            ]
        ], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });

    console.log("directoryProxyAbi address", directoryProxyAbi.address)

    const finalNonce = await deployer.getTransactionCount();
    console.log("final nonce", finalNonce)

    const directory = await ethers.getContractAt("Directory", directoryProxyAbi.address);
    console.log("directory address", directory.address)


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

    const setup = await protocolFixture();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });