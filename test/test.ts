import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts/lib/index"
import { deploy } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { Directory } from "../typechain-types/contracts/Directory";
import { DepositPool, WETHVault, RPLVault, OperatorDistributor, YieldDistributor, RocketTokenRPLInterface, RocketDAOProtocolSettingsNetworkInterface, IXRETHOracle, IRocketStorage, IRocketNodeManager, IRocketNodeStaking, IWETH, PriceFetcher } from "../typechain-types";
import { getNextContractAddress } from "./utils/utils";
import { makeDeployProxyAdmin } from "@openzeppelin/hardhat-upgrades/dist/deploy-proxy-admin";

const protocolParams = { trustBuildPeriod: ethers.utils.parseUnits("1.5768", 7) }; // ~6 months in seconds

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

async function deployProtocol(rocketPool: RocketPool): Promise<Protocol> {
	upgrades.silenceWarnings();

	const deployer = (await ethers.getSigners())[0];

	const predictedNonce = 9;
	const directoryAddress = await getNextContractAddress(deployer, predictedNonce-1)
	const initNonce = await deployer.getTransactionCount();

	const whitelist = await upgrades.deployProxy(await ethers.getContractFactory("contracts/Whitelist/Whitelist.sol:Whitelist"), [directoryAddress, protocolParams.trustBuildPeriod], { 'initializer': 'initializeWhitelist', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
	const vCWETHProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("WETHVault"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
	const vCWETH = await ethers.getContractAt("WETHVault", vCWETHProxyAbi.address);
	const vCRPLProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("RPLVault"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
	const vCRPL = await ethers.getContractAt("RPLVault", vCRPLProxyAbi.address);
	const depositPoolProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("DepositPool"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
	const depositPool = await ethers.getContractAt("DepositPool", depositPoolProxyAbi.address);
	const operatorDistributorProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("OperatorDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
	const operatorDistributor = await ethers.getContractAt("OperatorDistributor", operatorDistributorProxyAbi.address);
	const yieldDistributorProxyAbi = await upgrades.deployProxy(await ethers.getContractFactory("YieldDistributor"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor', 'delegatecall'] });
	const yieldDistributor = await ethers.getContractAt("YieldDistributor", yieldDistributorProxyAbi.address);
	const oracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;
	const priceFetcher = await upgrades.deployProxy(await ethers.getContractFactory("PriceFetcher"), [directoryAddress], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
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
		]
	], { 'initializer': 'initialize', 'kind': 'uups', 'unsafeAllow': ['constructor'] });
	const finalNonce = await deployer.getTransactionCount();
	const directory = await ethers.getContractAt("Directory", directoryProxyAbi.address);
	expect(finalNonce - initNonce).to.equal(predictedNonce);
	expect(directory.address).to.hexEqual(directoryAddress);

	const wETH = await ethers.getContractAt("IWETH", await directory.getWETHAddress());

	return { directory, whitelist, vCWETH, vCRPL, depositPool, operatorDistributor, yieldDistributor, oracle, priceFetcher, wETH };
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

	const signers = await createSigners();
	const rocketPool = await getRocketPool();
	const deployedProtocol = await deployProtocol(rocketPool);

	return {
		protocol: deployedProtocol,
		signers,
		rocketPool,
	};
}

export async function protocolFixture(): Promise<SetupData> {

	const signers = await createSigners();
	const rocketPool = await getRocketPool();
	const deployedProtocol = await deployProtocol(rocketPool);

	return { protocol: deployedProtocol, signers, rocketPool };
}