import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts/lib/index"
import { deploy } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { Directory } from "../typechain-types/contracts/Directory";
import { DepositPool, NodeSetETH, NodeSetRPL, OperatorDistributor, YieldDistributor, RocketTokenRPLInterface, RocketDAOProtocolSettingsNetworkInterface } from "../typechain-types";
import { initializeDirectory } from "./test-directory";
import { RocketDAOProtocolSettingsNetwork, RocketNetworkFees, RocketTokenRPL } from "./_utils/artifacts";
import { deployRocketPool } from './_helpers/deployment';
import { suppressLog } from "./_helpers/console";
import { setDefaultParameters } from "./_helpers/defaults";
import { endSnapShot, injectGlobalSnapShot, startSnapShot } from './_utils/snapshotting';

const protocolParams  = { trustBuildPeriod : ethers.utils.parseUnits("1.5768", 7) }; // ~6 months in seconds

export type SetupData = {
	protocol: Protocol,
	signers: Signers,
	rocketPool: RocketPool
}

export type Protocol = {
	directory: Directory,
	whitelist: Contract,
	xrETH: NodeSetETH,
	xRPL: NodeSetRPL,
	depositPool: DepositPool,
	operatorDistributor: OperatorDistributor,
	yieldDistributor: YieldDistributor,
	rocketDAOProtocolSettingsNetwork: RocketDAOProtocolSettingsNetworkInterface
}

export type Signers = {
	admin: SignerWithAddress,
	random: SignerWithAddress,
	operator: SignerWithAddress,
	random2: SignerWithAddress,
	random3: SignerWithAddress,
	rplWhale: SignerWithAddress
}

export type RocketPool = {
	rplContract: RocketTokenRPLInterface //RocketTokenRPLInterface
	networkFeesContract: RocketDAOProtocolSettingsNetworkInterface
}

async function getRocketPool(): Promise<RocketPool> {
	const RplToken = await RocketTokenRPL.deployed();
	const rplContract = (await ethers.getContractAt(
		"contracts/Interfaces/RocketTokenRPLInterface.sol:RocketTokenRPLInterface",
		RplToken.address
	));

	const NetworkFeesContract = await RocketDAOProtocolSettingsNetwork.deployed();
	console.log("TRUEFFLE ADDR")
	console.log(NetworkFeesContract.address)
	const networkFeesContract = (await ethers.getContractAt(
		"contracts/Interfaces/RocketDAOProtocolSettingsNetworkInterface.sol:RocketDAOProtocolSettingsNetworkInterface",
		NetworkFeesContract.address
	));
	console.log(networkFeesContract.address)
	return { rplContract, networkFeesContract };
}

async function deployProtocol(rocketPool: RocketPool): Promise<Protocol> {
	const [admin] = await ethers.getSigners();
	const directory = await (await ethers.getContractFactory("Directory")).deploy();
	const whitelist = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist"), [directory.address, protocolParams.trustBuildPeriod], { 'initializer' : 'initializeWhitelist',  'kind' : 'uups', 'unsafeAllow': ['constructor'] });
	const xrETH = await (await ethers.getContractFactory("NodeSetETH")).deploy(directory.address);
	const xRPL = await (await ethers.getContractFactory("NodeSetRPL")).deploy(directory.address);
	const depositPool = await (await ethers.getContractFactory("DepositPool")).deploy(directory.address);
	const operatorDistributor = await (await ethers.getContractFactory("OperatorDistributor")).deploy(directory.address);
	const yieldDistributor = await (await ethers.getContractFactory("YieldDistributor")).deploy(directory.address);

	return { directory, whitelist, xrETH, xRPL, depositPool, operatorDistributor, yieldDistributor, rocketDAOProtocolSettingsNetwork: rocketPool.networkFeesContract};
}

async function createSigners(): Promise<Signers> {
	const signersArray: SignerWithAddress[] = (await ethers.getSigners());
	return {
		admin: signersArray[0], // contracts are deployed using the first signer/account by default
		random: signersArray[1],
		operator: signersArray[2],
		random2: signersArray[3],
		random3: signersArray[4],
		// Patricio Worthalter (patricioworthalter.eth)
		rplWhale: await ethers.getImpersonatedSigner("0x57757e3d981446d585af0d9ae4d7df6d64647806") 
	};
}

// this obnoxious double-fixture pattern is necessary because hardhat 
// doesn't allow parameters for fixtures
// see https://github.com/NomicFoundation/hardhat/issues/3508
export async function deployOnlyFixture(): Promise<SetupData> {
	await suppressLog(deployRocketPool);
	// Set starting parameters for all tests
	await setDefaultParameters();

	const rocketPool = await getRocketPool()
	return {
		protocol: await deployProtocol(rocketPool),
		signers: await createSigners(),
		rocketPool
	};
}

export async function protocolFixture(): Promise<SetupData> {
	await suppressLog(deployRocketPool);
	// Set starting parameters for all tests
	await setDefaultParameters();

	const rocketPool = await getRocketPool();
	const deployedProtocol = await deployProtocol(rocketPool);
	const signers = await createSigners();

	await expect(initializeDirectory(deployedProtocol, signers.admin)).to.not.be.reverted;
	await expect(deployedProtocol.yieldDistributor.initialize())
		.to.not.be.reverted;
	
	return { protocol: deployedProtocol, signers, rocketPool};
}