import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts/lib/index"
import { deploy } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { Directory } from "../typechain-types/contracts/Directory";
import { FundRouter, WETHVault, RPLVault, OperatorDistributor, YieldDistributor, RocketDAOProtocolSettingsNetworkInterface, IXRETHOracle, IRocketStorage, IRocketNodeManager, IRocketNodeStaking, IWETH, PriceFetcher, MockSanctions, RocketNodeManagerInterface, RocketNodeDepositInterface, NodeAccountFactory, RocketDepositPool, RocketNodeDeposit } from "../typechain-types";
import { getNextContractAddress } from "./utils/utils";
import { makeDeployProxyAdmin } from "@openzeppelin/hardhat-upgrades/dist/deploy-proxy-admin";
import { RocketDAOProtocolSettingsNetwork, RocketNetworkFees, RocketNodeManager, RocketNodeManagerNew, RocketNodeStaking, RocketNodeStakingNew, RocketStorage, RocketTokenRPL } from "./rocketpool/_utils/artifacts";
import { setDefaultParameters } from "./rocketpool/_helpers/defaults";
import { suppressLog } from "./rocketpool/_helpers/console";
import { deployRocketPool } from "./rocketpool/_helpers/deployment";
import { upgradeExecuted } from "./rocketpool/_utils/upgrade";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ERC20 } from "../typechain-types/contracts/Testing/Rocketpool/contract/util";
import { IERC20 } from "../typechain-types/oz-contracts-3-4-0/token/ERC20";
import { fastDeployProtocol } from "../scripts/utils/deployment";

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
	depositPool: FundRouter,
	operatorDistributor: OperatorDistributor,
	NodeAccountFactory: NodeAccountFactory,
	yieldDistributor: YieldDistributor,
	oracle: IXRETHOracle,
	priceFetcher: Contract,
	wETH: IWETH,
	sanctions: MockSanctions
}

export type Signers = {
	deployer: SignerWithAddress,
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
	rplContract: ERC20, //RocketTokenRPLInterface
	rockStorageContract: IRocketStorage,
	rocketNodeManagerContract: RocketNodeManagerInterface,
	rocketNodeStakingContract: IRocketNodeStaking,
	rocketNodeDepositContract: RocketNodeDepositInterface,
	rocketDepositPoolContract: RocketDepositPool
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

export async function getRocketPool(directory: Directory): Promise<RocketPool> {

	const rplContract = (await ethers.getContractAt(
		"@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
		await directory.getRPLAddress()
	)) as ERC20;

	const rockStorageContract = (await ethers.getContractAt(
		"RocketStorage",
		await directory.getRocketStorageAddress()
	)) as IRocketStorage;

	const rocketNodeManagerContract = await ethers.getContractAt(
		"RocketNodeManagerInterface",
		await directory.getRocketNodeManagerAddress()
	) as RocketNodeManagerInterface;

	const rocketNodeStakingContract = await ethers.getContractAt(
		"IRocketNodeStaking",
		await directory.getRocketNodeStakingAddress()
	) as IRocketNodeStaking;

	const rocketNodeDepositContract = await ethers.getContractAt(
		"RocketNodeDepositInterface",
		await directory.getRocketNodeDepositAddress()
	) as RocketNodeDepositInterface;

	const rocketDepositPoolContract = await ethers.getContractAt(
		"RocketDepositPool",
		await directory.getRocketDepositPoolAddress()
	) as RocketDepositPool;

	return { rplContract, rockStorageContract, rocketDepositPoolContract, rocketNodeManagerContract, rocketNodeStakingContract, rocketNodeDepositContract };
}

async function deployProtocol(signers: Signers): Promise<Protocol> {
	const RocketStorageDeployment = await RocketStorage.deployed();
	const rockStorageContract = (await ethers.getContractAt(
		"RocketStorage",
		RocketStorageDeployment.address
	)) as IRocketStorage;

	const RplToken = await RocketTokenRPL.deployed();
	const rplContract = (await ethers.getContractAt(
		"@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
		RplToken.address
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

	// deploy mock uniswap v3 pool
	const UniswapV3Pool = await ethers.getContractFactory("MockUniswapV3Pool");
	const uniswapV3Pool = await UniswapV3Pool.deploy();
	await uniswapV3Pool.deployed();

	const deployer = (await ethers.getSigners())[0];

	const oracle = (await (await ethers.getContractFactory("MockRETHOracle")).deploy()) as IXRETHOracle;

	const { whitelist, vCWETH, vCRPL, depositPool, operatorDistributor, nodeAccountFactory, yieldDistributor, priceFetcher, directory, adminTreasury } = await fastDeployProtocol(
		signers.deployer,
		signers.random5,
		rockStorageContract.address,
		wETH.address,
		sanctions.address,
		uniswapV3Pool.address,
		oracle.address,
		signers.admin.address,
		false
	)

	// set adminServer to be ADMIN_SERVER_ROLE
	const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_SERVER_ROLE"));
	await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(adminRole), signers.adminServer.address);

	// set timelock to be TIMELOCK_ROLE
	const timelockRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_24_HOUR"));
	await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(timelockRole), signers.admin.address);

	// set protocolSigner to be PROTOCOL_ROLE
	const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));
	await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(protocolRole), signers.protocolSigner.address);

	// set directory treasury to deployer to prevent tests from failing
	expect(await directory.getTreasuryAddress()).to.equal(adminTreasury.address);
	await directory.connect(signers.admin).setTreasury(deployer.address);

	const returnData: Protocol = { directory, whitelist, vCWETH, vCRPL, depositPool, operatorDistributor, NodeAccountFactory: nodeAccountFactory, yieldDistributor, oracle, priceFetcher, wETH, sanctions };

	// send all rpl from admin to rplWhale
	const rplWhaleBalance = await rplContract.balanceOf(signers.deployer.address);
	await rplContract.transfer(signers.rplWhale.address, rplWhaleBalance);

	await priceFetcher.connect(signers.admin).useFallback();

	return returnData;
}

async function createSigners(): Promise<Signers> {
	const signersArray: SignerWithAddress[] = (await ethers.getSigners());
	return {
		deployer: signersArray[0],
		admin: signersArray[13], // contracts are deployed using the first signer/account by default
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
	await loadFixture(deployRocketPool);
	await loadFixture(setDefaultParameters);

	const signers = await createSigners();
	const deployedProtocol = await deployProtocol(signers);
	const rocketPool = await getRocketPool(deployedProtocol.directory);

	return { protocol: deployedProtocol, signers, rocketPool };
}