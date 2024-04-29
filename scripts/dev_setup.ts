import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture, protocolParams } from "../test/test";
import { setDefaultParameters } from "../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../test/utils/utils";
import { IXRETHOracle, NodeAccountFactory } from "../typechain-types";
import { expect } from "chai";
import readline from 'readline';
import { fastDeployProtocol, generateBytes32Identifier, retryOperation } from "./utils/deployment";
import { wEth } from "../typechain-types/contracts/Testing";


async function main() {
    const [deployer, admin] = await ethers.getSigners();

    const rocketStorage = await ethers.getContractAt('RocketStorage', '0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1'); // holesky addr

    upgrades.silenceWarnings()

    // deploy weth
    const wETH = await retryOperation(async () => {
        const WETH = await ethers.getContractFactory("WETH");
        const contract = await WETH.deploy();
        await contract.deployed();
        return contract;
    });
    console.log("weth address", wETH.address)

    // deploy mock uniswap v3 pool
    const uniswapV3Pool = await retryOperation(async () => {
        const UniswapV3Pool = await ethers.getContractFactory("MockUniswapV3Pool");
        const contract = await UniswapV3Pool.deploy();
        await contract.deployed();
        return contract;
    });

    const oracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;
    console.log("oracle address", oracle.address)

    const sanctions = await retryOperation(async () => {
        const Sanctions = await ethers.getContractFactory("MockSanctions");
        const contract = await Sanctions.deploy();
        await contract.deployed();
        return contract;
    });
    console.log("sanctions address", sanctions.address);

    const { directory } = await fastDeployProtocol(deployer, admin, rocketStorage.address, wETH.address, sanctions.address, uniswapV3Pool.address, oracle.address, admin.address, true);

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