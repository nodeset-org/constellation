import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts/lib/index"
import { deploy } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { Directory } from "../typechain-types/contracts/Directory";
import { DepositPool, WETHVault, RPLVault, OperatorDistributor, YieldDistributor, RocketTokenRPLInterface, RocketDAOProtocolSettingsNetworkInterface, IXRETHOracle, IRocketStorage, IRocketNodeManager, IRocketNodeStaking, IWETH, PriceFetcher } from "../typechain-types";
import { getNextContractAddress } from "./utils/utils";
import { makeDeployProxyAdmin } from "@openzeppelin/hardhat-upgrades/dist/deploy-proxy-admin";
import { RocketDAOProtocolSettingsNetwork, RocketNetworkFees, RocketNodeManager, RocketNodeStaking, RocketStorage, RocketTokenRPL } from "./rocketpool/_utils/artifacts";
import { setDefaultParameters } from "./rocketpool/_helpers/defaults";
import { suppressLog } from "./rocketpool/_helpers/console";
import { deployRocketPool } from "./rocketpool/_helpers/deployment";
import { RocketNodeManagerInterface } from "../typechain-types/contracts/interface/node";

export const protocolParams = { trustBuildPeriod: ethers.utils.parseUnits("1.5768", 7) }; // ~6 months in seconds

export type SetupData = {
	protocol: Protocol,
	signers: Signers,
	rocketPool: RocketPool,
}

export type Protocol = {
	directory: Directory,
	whitelist: Contract,
	vCWETH: WETHVault,
	vCRPL: RPLVault,
	depositPool: DepositPool,
	operatorDistributor: OperatorDistributor,
	yieldDistributor: YieldDistributor,
	oracle: IXRETHOracle,
	priceFetcher: Contract,
	wETH: IWETH,
}

export type Signers = {
	admin: SignerWithAddress,
	random: SignerWithAddress,
	operator: SignerWithAddress,
	random2: SignerWithAddress,
	random3: SignerWithAddress,
	random4: SignerWithAddress,
	random5: SignerWithAddress,
	rplWhale: SignerWithAddress,
	hyperdriver: SignerWithAddress,
	ethWhale: SignerWithAddress,
	adminServer: SignerWithAddress,
	timelock24hour: SignerWithAddress,
	protocolSigner: SignerWithAddress,
}

export type RocketPool = {
	rplContract: RocketTokenRPLInterface, //RocketTokenRPLInterface
	networkFeesContract: RocketDAOProtocolSettingsNetworkInterface,
	rockStorageContract: IRocketStorage,
	rocketNodeManagerContract: RocketNodeManagerInterface,
	rocketNodeStakingContract: IRocketNodeStaking,
}

export function getAllAddresses(Signers: Signers, Protocol: Protocol, RocketPool: RocketPool) {
	const allAddresses = [];
	for (const [key, value] of Object.entries(Signers)) {
		allAddresses.push({ name: key, address: value.address });
	}
	for (const [key, value] of Object.entries(Protocol)) {
		allAddresses.push({ name: key, address: value.address });
	}
	for (const [key, value] of Object.entries(RocketPool)) {
		allAddresses.push({ name: key, address: value.address });
	}
	return allAddresses;
}

export async function getRocketPool(): Promise<RocketPool> {
	const RplToken = await RocketTokenRPL.deployed();
	const rplContract = (await ethers.getContractAt(
		"contracts/Interfaces/RocketTokenRPLInterface.sol:RocketTokenRPLInterface",
		RplToken.address
	)) as RocketTokenRPLInterface;

	const RocketDAOProtocolSettingsNet = await RocketDAOProtocolSettingsNetwork.deployed();
	const networkFeesContract = (await ethers.getContractAt(
		"contracts/Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol:RocketDAOProtocolSettingsNetworkInterface",
		RocketDAOProtocolSettingsNet.address
	)) as RocketDAOProtocolSettingsNetworkInterface;

	const RocketStorageDeployment = await RocketStorage.deployed();
	const rockStorageContract = (await ethers.getContractAt(
		"RocketStorage",
		RocketStorageDeployment.address
	)) as IRocketStorage;

	const RocketNodeManagerDeployment = await RocketNodeManager.deployed();
	const rocketNodeManagerContract = await ethers.getContractAt(
		"RocketNodeManagerInterface",
		RocketNodeManagerDeployment.address
	) as RocketNodeManagerInterface;

	const RocketNodeStakingDeployment = await RocketNodeStaking.deployed();;
	const rocketNodeStakingContract = await ethers.getContractAt(
		"RocketNodeStaking",
		RocketNodeStakingDeployment.address
	) as IRocketNodeStaking;

	return { rplContract, networkFeesContract, rockStorageContract, rocketNodeManagerContract, rocketNodeStakingContract };
}

async function deployProtocol(rocketPool: RocketPool, signers: Signers): Promise<Protocol> {
	const predictedNonce = 10;
	try {
		upgrades.silenceWarnings();
		// deploy weth
		const WETH = await ethers.getContractFactory("WETH");
		const wETH = await WETH.deploy();
		await wETH.deployed();

		// deploy mock uniswap v3 pool
		const UniswapV3Pool = await ethers.getContractFactory("MockUniswapV3Pool");
		const uniswapV3Pool = await UniswapV3Pool.deploy();
		await uniswapV3Pool.deployed();

		const deployer = (await ethers.getSigners())[0];

		const directoryAddress = await getNextContractAddress(deployer, predictedNonce-1)
		const initNonce = await deployer.getTransactionCount();
		const whitelist = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist"), [directoryAddress], { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
		const vCWETHProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("WETHVault"), [directoryAddress, wETH.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
		const vCWETH = await ethers.getContractAt("WETHVault", vCWETHProxyAbi.address);
		const vCRPLProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("RPLVault"), [directoryAddress, rocketPool.rplContract.address], { 'initializer': 'initializeVault', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
		const vCRPL = await ethers.getContractAt("RPLVault", vCRPLProxyAbi.address);
		const depositPoolProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("DepositPool"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
		const depositPool = await ethers.getContractAt("DepositPool", depositPoolProxyAbi.address);
		const operatorDistributorProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("OperatorDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
		const operatorDistributor = await ethers.getContractAt("OperatorDistributor", operatorDistributorProxyAbi.address);
		const yieldDistributorProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("YieldDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
		const yieldDistributor = await ethers.getContractAt("YieldDistributor", yieldDistributorProxyAbi.address);
		const oracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;
		const priceFetcher = await upgrades.deployProxy(await ethers.getContractFactory("PriceFetcher"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
		const adminTreasury = await upgrades.deployProxy(await ethers.getContractFactory("AdminTreasury"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
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
				rocketPool.rockStorageContract.address,
				rocketPool.rocketNodeManagerContract.address,
				rocketPool.rocketNodeStakingContract.address,
				rocketPool.rplContract.address,
				wETH.address,
				uniswapV3Pool.address
			],
			adminTreasury.address,
		], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
		const finalNonce = await deployer.getTransactionCount();
		const directory = await ethers.getContractAt("Directory", directoryProxyAbi.address);
		expect(finalNonce - initNonce).to.equal(predictedNonce);
		expect(directory.address).to.hexEqual(directoryAddress);

		// set adminServer to be ADMIN_SERVER_ROLE
		const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_SERVER_ROLE"));
		await directory.grantRole(ethers.utils.arrayify(adminRole), signers.adminServer.address);

		// set timelock to be TIMELOCK_ROLE
		const timelockRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_24_HOUR"));
		await directory.grantRole(ethers.utils.arrayify(timelockRole), signers.admin.address);

		// set protocolSigner to be PROTOCOL_ROLE
		const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));
		await directory.grantRole(ethers.utils.arrayify(protocolRole), signers.protocolSigner.address);

		// set directory treasury to deployer to prevent tests from failing
		console.log("directory treasury address: ", await directory.getTreasuryAddress());
		console.log("deployer address: ", deployer.address);
		console.log("admin treasury address: ", adminTreasury.address);
		expect(await directory.getTreasuryAddress()).to.equal(adminTreasury.address);
		await directory.setTreasury(deployer.address);

		const returnData: Protocol = { directory, whitelist, vCWETH, vCRPL, depositPool, operatorDistributor, yieldDistributor, oracle, priceFetcher, wETH };

		// send all rpl from admin to rplWhale
		const rplWhaleBalance = await rocketPool.rplContract.balanceOf(signers.admin.address);
		await rocketPool.rplContract.transfer(signers.rplWhale.address, rplWhaleBalance);

		return returnData;
	} catch(e: any) {
		const message = e.toString();
		if(message.includes(`to equal ${predictedNonce}`)) {
			// always fails the first try due to lower level library limitations
			return await deployProtocol(rocketPool, signers);
		} else {
			throw e;
		}
	}
}

async function createSigners(): Promise<Signers> {
	const signersArray: SignerWithAddress[] = (await ethers.getSigners());
	return {
		admin: signersArray[0], // contracts are deployed using the first signer/account by default
		random: signersArray[1],
		operator: signersArray[2],
		random2: signersArray[3],
		random3: signersArray[4],
		random4: signersArray[5],
		random5: signersArray[6],
		hyperdriver: signersArray[7],
		ethWhale: signersArray[8],
		adminServer: signersArray[9],
		timelock24hour: signersArray[10],
		protocolSigner: signersArray[11],
		rplWhale: signersArray[12],
	};
}

export async function protocolFixture(): Promise<SetupData> {
	await suppressLog(deployRocketPool);
	await setDefaultParameters();

	const signers = await createSigners();
	const rocketPool = await getRocketPool();
	const deployedProtocol = await deployProtocol(rocketPool, signers);

	return { protocol: deployedProtocol, signers, rocketPool };
}