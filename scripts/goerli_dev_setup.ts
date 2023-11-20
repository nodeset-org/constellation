import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture, protocolParams } from "../test/test";
import { setDefaultParameters } from "../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../test/utils/utils";
import { IXRETHOracle } from "../typechain-types";
import { expect } from "chai";

async function main() {
    const predictedNonce = 9;
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());


    // load required rocket pool contracts
    const { rplContract, networkFeesContract, rockStorageContract, rocketNodeManagerContract, rocketNodeStakingContract } = {
        rplContract: await ethers.getContractAt("contracts/Interfaces/RocketTokenRPLInterface.sol:RocketTokenRPLInterface", "0x012222D4F3AE9E665761b26B67CA87B74c21E552"),
        networkFeesContract: await ethers.getContractAt("contracts/Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol:RocketDAOProtocolSettingsNetworkInterface", "0x04c1dc9b7469466c271Ec61052e777cCbe85567a"),
        rockStorageContract: await ethers.getContractAt("RocketStorage", "0x5467C31426F096e18e174C91dEA078bdc2e0aabD"),
        rocketNodeManagerContract: await ethers.getContractAt("RocketNodeManagerInterface", "0x4263d1Eb9bBa3335057E8093346091d92fa20C19"),
        rocketNodeStakingContract: await ethers.getContractAt("RocketNodeStaking", "0xc8b48F10b5656AD586924BC695c0ABD05dE5Aa44")
    }

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