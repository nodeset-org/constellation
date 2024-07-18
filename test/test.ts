import { expect } from "chai";
import { config, ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts/lib/index"
import { deploy } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { Directory } from "../typechain-types/contracts/Directory";
import { FundRouter, WETHVault, RPLVault, OperatorDistributor, YieldDistributor, RocketDAOProtocolSettingsNetworkInterface, IXRETHOracle, IRocketStorage, IRocketNodeManager, IRocketNodeStaking, IWETH, PriceFetcher, MockSanctions, RocketNodeManagerInterface, RocketNodeDepositInterface, RocketDepositPool, RocketNodeDeposit, RocketDAONodeTrusted, RocketTokenRETH, RocketClaimDAO, RocketRewardsPool, RocketDAONodeTrustedActions, SuperNodeAccount, XRETHAdminOracle } from "../typechain-types";
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
import { deployProtocol, fastDeployProtocol } from "../scripts/utils/deployment";
import { BigNumber } from 'ethers';
import { DepositData } from "@chainsafe/lodestar-types";

export const protocolParams = { trustBuildPeriod: ethers.utils.parseUnits('1.5768', 7) }; // ~6 months in seconds

export type SetupData = {
  protocol: Protocol;
  signers: Signers;
  rocketPool: RocketPool;
};

export type NewOperator = {
  signer: SignerWithAddress;
  bondValue: BigNumber;
  depositData: DepositData;
  depositDataRoot: Uint8Array;
  expectedMinipoolAddress: any;
  salt: number;
  minimumNodeFee: number;
  timezoneLocation: string;
  exitMessageSignature: any;
};

export type Protocol = {
  directory: Directory;
  whitelist: Contract;
  vCWETH: WETHVault;
  vCRPL: RPLVault;
  depositPool: FundRouter;
  operatorDistributor: OperatorDistributor;
  yieldDistributor: YieldDistributor;
  oracle: XRETHAdminOracle;
  priceFetcher: Contract;
  superNode: SuperNodeAccount;
  wETH: IWETH;
  sanctions: MockSanctions;
};

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
	treasurer: SignerWithAddress
}

export type RocketPool = {
  rplContract: ERC20; //RocketTokenRPLInterface
  rockStorageContract: IRocketStorage;
  rocketNodeManagerContract: RocketNodeManagerInterface;
  rocketNodeStakingContract: IRocketNodeStaking;
  rocketNodeDepositContract: RocketNodeDepositInterface;
  rocketDepositPoolContract: RocketDepositPool;
  rocketDaoNodeTrusted: RocketDAONodeTrusted;
  rocketTokenRETH: RocketTokenRETH;
  rocketClaimDao: RocketClaimDAO;
  rocketRewardsPool: RocketRewardsPool;
  rocketDaoNodeTrustedActions: RocketDAONodeTrustedActions;
};

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
    '@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20',
    await directory.getRPLAddress()
  )) as ERC20;

  const rockStorageContract = (await ethers.getContractAt(
    'RocketStorage',
    await directory.getRocketStorageAddress()
  )) as IRocketStorage;

  const rocketNodeManagerContract = (await ethers.getContractAt(
    'RocketNodeManagerInterface',
    await directory.getRocketNodeManagerAddress()
  )) as RocketNodeManagerInterface;

  const rocketNodeStakingContract = (await ethers.getContractAt(
    'IRocketNodeStaking',
    await directory.getRocketNodeStakingAddress()
  )) as IRocketNodeStaking;

  const rocketNodeDepositContract = (await ethers.getContractAt(
    'RocketNodeDepositInterface',
    await directory.getRocketNodeDepositAddress()
  )) as RocketNodeDepositInterface;

  const rocketDepositPoolContract = (await ethers.getContractAt(
    'RocketDepositPool',
    await directory.getRocketDepositPoolAddress()
  )) as RocketDepositPool;

  const rocketDaoNodeTrusted = (await ethers.getContractAt(
    'RocketDAONodeTrusted',
    await directory.getRocketPoolAddressByTag('rocketDAONodeTrusted')
  )) as RocketDAONodeTrusted;

  const rocketTokenRETH = (await ethers.getContractAt(
    'RocketTokenRETH',
    await directory.getRocketPoolAddressByTag('rocketTokenRETH')
  )) as RocketTokenRETH;

  const rocketClaimDao = (await ethers.getContractAt(
    'RocketClaimDAO',
    await directory.getRocketPoolAddressByTag('rocketClaimDAO')
  )) as RocketClaimDAO;

  const rocketRewardsPool = (await ethers.getContractAt(
    'RocketRewardsPool',
    await directory.getRocketPoolAddressByTag('rocketRewardsPool')
  )) as RocketRewardsPool;

  const rocketDaoNodeTrustedActions = (await ethers.getContractAt(
    'RocketDAONodeTrustedActions',
    await directory.getRocketPoolAddressByTag('rocketDAONodeTrustedActions')
  )) as RocketDAONodeTrustedActions;

  return {
    rocketDaoNodeTrustedActions,
    rocketRewardsPool,
    rocketClaimDao,
    rocketTokenRETH,
    rocketDaoNodeTrusted,
    rplContract,
    rockStorageContract,
    rocketDepositPoolContract,
    rocketNodeManagerContract,
    rocketNodeStakingContract,
    rocketNodeDepositContract,
  };
}

export async function createSigners(): Promise<Signers> {
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
		treasurer: signersArray[13]
	};
}

export function getSignerPrivateKey(signer: keyof Signers) {
  const { accounts } = config.networks.hardhat;

  if (Array.isArray(accounts)) {
    throw new Error('Not using default hardhat accounts');
  }

  console.log(accounts.path);

  const HDNode = ethers.utils.HDNode.fromMnemonic(accounts.mnemonic, accounts.passphrase);

  let index = 0;

  switch (signer) {
    case 'admin':
      index = 13;
      break;
    case 'random':
      index = 1;
      break;
    case 'operator':
      index = 2;
      break;
    case 'random2':
      index = 3;
      break;
    case 'random3':
      index = 4;
      break;
    case 'random4':
      index = 5;
      break;
    case 'random5':
      index = 6;
      break;
    case 'hyperdriver':
      index = 7;
      break;
    case 'ethWhale':
      index = 8;
      break;
    case 'adminServer':
      index = 9;
      break;
    case 'timelock24hour':
      index = 10;
      break;
    case 'protocolSigner':
      index = 11;
      break;
    case 'rplWhale':
      index = 12;
      break;
    default:
      throw new Error(`Signer ${signer} not found`);
  }
  return HDNode.derivePath(`m/44'/60'/0'/0/${index}`).privateKey;
}

export async function protocolFixture(): Promise<SetupData> {
  await loadFixture(deployRocketPool);
  await loadFixture(setDefaultParameters);

  const signers = await createSigners();
  const deployedProtocol = await deployProtocol(signers);
  const rocketPool = await getRocketPool(deployedProtocol.directory);

  return { protocol: deployedProtocol, signers, rocketPool };
}
