import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts/lib/index"
import { deploy } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { Directory } from "../typechain-types/contracts/Directory";
import { DepositPool, WETHVault, RPLVault, OperatorDistributor, YieldDistributor, RocketTokenRPLInterface, RocketDAOProtocolSettingsNetworkInterface, IXRETHOracle, IRocketStorage, IRocketNodeManager, IRocketNodeStaking, IWETH } from "../typechain-types";
import { initializeDirectory } from "./test-directory";

const protocolParams  = { trustBuildPeriod : ethers.utils.parseUnits("1.5768", 7) }; // ~6 months in seconds

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
	rETHOracle: IXRETHOracle,
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
}

export type RocketPool = {
	rplContract: RocketTokenRPLInterface, //RocketTokenRPLInterface
	networkFeesContract: RocketDAOProtocolSettingsNetworkInterface,
	rockStorageContract: IRocketStorage,
	rocketNodeManagerContract: IRocketNodeManager,
	rocketNodeStakingContract: IRocketNodeStaking,
}

export function getAllAddresses(Signers: Signers, Protocol: Protocol, RocketPool: RocketPool) {
	const allAddresses = [];
	for (const [key, value] of Object.entries(Signers)) {
		allAddresses.push({name: key, address: value.address});
	}
	for (const [key, value] of Object.entries(Protocol)) {
		allAddresses.push({name: key, address: value.address});
	}
	for (const [key, value] of Object.entries(RocketPool)) {
		allAddresses.push({name: key, address: value.address});
	}
	return allAddresses;
}

async function getRocketPool(): Promise<RocketPool> {
	const rplContract = (await ethers.getContractAt(
		"RocketTokenRPLInterface",
		"0xD33526068D116cE69F19A9ee46F0bd304F21A51f"
	));
	const networkFeesContract = (await ethers.getContractAt(
		"RocketDAOProtocolSettingsNetworkInterface",
		"0x320f3aAB9405e38b955178BBe75c477dECBA0C27"
	));

	// deploy mock rocket storage
	const rocketStorageFactory = await ethers.getContractFactory("MockRocketStorage");
	const rockStorageContract = (await rocketStorageFactory.deploy()) as IRocketStorage;
	await rockStorageContract.deployed();

	const rocketNodeManagerFactory = await ethers.getContractFactory("MockRocketNodeManager");
	const rocketNodeManagerContract = (await rocketNodeManagerFactory.deploy()) as IRocketNodeManager;
	await rocketNodeManagerContract.deployed();

	const rocketNodeStakingFactory = await ethers.getContractFactory("MockRocketNodeStaking");
	const rocketNodeStakingContract = (await rocketNodeStakingFactory.deploy()) as IRocketNodeStaking;
	await rocketNodeStakingContract.deployed();

	return { rplContract, networkFeesContract, rockStorageContract, rocketNodeManagerContract, rocketNodeStakingContract };
}

async function deployProtocol(): Promise<Protocol> {
	const directory = await (await ethers.getContractFactory("Directory")).deploy();
	const whitelist = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist"), [directory.address], { 'initializer' : 'initializeWhitelist',  'kind' : 'uups', 'unsafeAllow': ['constructor'] });
	const vCWETH = await (await ethers.getContractFactory("WETHVault")).deploy(directory.address);
	const vCRPL = await (await ethers.getContractFactory("RPLVault")).deploy(directory.address);
	const depositPool = await (await ethers.getContractFactory("DepositPool")).deploy(directory.address);
	const operatorDistributor = await (await ethers.getContractFactory("OperatorDistributor")).deploy(directory.address);
	const yieldDistributor = await (await ethers.getContractFactory("YieldDistributor")).deploy(directory.address);

	const rETHOracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;

	const wETH = await ethers.getContractAt("IWETH", await directory.getWETHAddress());

	return { directory, whitelist, vCWETH, vCRPL, depositPool, operatorDistributor, yieldDistributor, rETHOracle, wETH};
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
		// Patricio Worthalter (patricioworthalter.eth)
		rplWhale: await ethers.getImpersonatedSigner("0x57757e3d981446d585af0d9ae4d7df6d64647806"),
		hyperdriver: signersArray[7],
		ethWhale: signersArray[8],
	};
}

// this obnoxious double-fixture pattern is necessary because hardhat
// doesn't allow parameters for fixtures
// see https://github.com/NomicFoundation/hardhat/issues/3508
export async function deployOnlyFixture(): Promise<SetupData> {

	const deployedProtocol = await deployProtocol();
	const signers = await createSigners();
	const rocketPool = await getRocketPool();

	return {
		protocol: deployedProtocol,
		signers,
		rocketPool,
	};
}

export async function protocolFixture(): Promise<SetupData> {

	const deployedProtocol = await deployProtocol();
	const signers = await createSigners();
	const rocketPool = await getRocketPool();

	await expect(initializeDirectory(deployedProtocol, rocketPool, signers.admin)).to.not.be.reverted;
	await expect(deployedProtocol.yieldDistributor.initialize())
	.to.not.be.reverted;

	return { protocol: deployedProtocol, signers, rocketPool};
}