import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Contract } from "@ethersproject/contracts/lib/index"
import { Directory } from "../../typechain-types/contracts/Constellation/Utils/Directory";
import { Whitelist } from "../../typechain-types/contracts/Constellation/Whitelist";
import { WETHVault, RPLVault, OperatorDistributor, NodeSetOperatorRewardDistributor, RocketDAOProtocolSettingsMinipool, RocketDAOProtocolSettingsNetworkInterface, IConstellationOracle, IRocketStorage, IRocketNodeManager, IRocketNodeStaking, IWETH, PriceFetcher, MockSanctions, RocketNodeManagerInterface, RocketNodeDepositInterface, RocketDepositPool, RocketNodeDeposit, RocketDAONodeTrusted, RocketTokenRETH, RocketClaimDAO, RocketRewardsPool, RocketDAONodeTrustedActions, SuperNodeAccount, PoAConstellationOracle, RocketMinipoolDelegate, RocketMinipoolInterface, MerkleClaimStreamer, Treasury, RocketStorage } from "../../typechain-types";
import { setDefaultParameters } from "../rocketpool/_helpers/defaults";
import { deployRocketPool } from "../rocketpool/_helpers/deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ERC20 } from "../../typechain-types/contracts/Testing/Rocketpool/contract/util";
import { BigNumber } from 'ethers';
import { DepositData } from "@chainsafe/lodestar-types";
import { RocketStorage as TruffleLegacyRocketStorage, RocketTokenRPL } from "../../test/rocketpool/_utils/artifacts";
import { fastDeployProtocol } from "../../scripts/utils/deployment";


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
  whitelist: Whitelist;
  vCWETH: WETHVault;
  vCRPL: RPLVault;
  operatorDistributor: OperatorDistributor;
  merkleClaimStreamer: MerkleClaimStreamer;
  yieldDistributor: NodeSetOperatorRewardDistributor;
  oracle: PoAConstellationOracle;
  priceFetcher: Contract;
  superNode: SuperNodeAccount;
  wETH: IWETH;
  sanctions: MockSanctions;
  treasury: Treasury;
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
	treasurer: SignerWithAddress,
  nodesetServerAdmin: SignerWithAddress,
  nodesetAdmin: SignerWithAddress
}

export type RocketPool = {
  rplContract: ERC20; //RocketTokenRPLInterface
  rockStorageContract: RocketStorage;
  rocketNodeManagerContract: RocketNodeManagerInterface;
  rocketNodeStakingContract: IRocketNodeStaking;
  rocketNodeDepositContract: RocketNodeDepositInterface;
  rocketDepositPoolContract: RocketDepositPool;
  rocketDaoNodeTrusted: RocketDAONodeTrusted;
  rocketTokenRETH: RocketTokenRETH;
  rocketClaimDao: RocketClaimDAO;
  rocketRewardsPool: RocketRewardsPool;
  rocketDaoNodeTrustedActions: RocketDAONodeTrustedActions;
  rocketDAOProtocolSettingsMinipool: RocketDAOProtocolSettingsMinipool;
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
  )) as RocketStorage;

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

  const rocketDAOProtocolSettingsMinipool = (await ethers.getContractAt(
    'RocketDAOProtocolSettingsMinipool',
    await directory.getRocketPoolAddressByTag('rocketDAOProtocolSettingsMinipool')
  )) as RocketDAOProtocolSettingsMinipool;

  return {
    rocketDAOProtocolSettingsMinipool,
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
		treasurer: signersArray[14],
    nodesetAdmin: signersArray[15],
    nodesetServerAdmin: signersArray[16],
	};
}

async function deployProtocolLocalDev(signers: Signers, log = false): Promise<Protocol> {
  const RocketStorageDeployment = await TruffleLegacyRocketStorage.deployed();
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

  const {
      whitelist, vCWETH, vCRPL, operatorDistributor, merkleClaimStreamer, superNode, oracle,
      yieldDistributor, priceFetcher, directory, treasury
  } = await fastDeployProtocol(
      signers.treasurer.address, // treasurer
      signers.deployer, // deployer
      signers.nodesetAdmin.address, // nodesetAdmin
      signers.nodesetServerAdmin.address, // nodesetServerAdmin
      signers.adminServer.address, // adminServer
      signers.random5, // directoryDeployer
      signers.random4.address, // adminOracle
      rockStorageContract.address, // rocketStorage
      wETH.address, // weth
      sanctions.address, // sanctions
      signers.admin.address, // admin
      log, // log
      true // localDev
  )


  const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_SERVER_ROLE"));
  let tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(adminRole), signers.adminServer.address);
  await tx.wait();

  // set timelock to be TIMELOCK_ROLE
  const timelockRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_SHORT"));
  tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(timelockRole), signers.admin.address);
  await tx.wait();

  const timelockRoleMed = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_MED"));
  tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(timelockRoleMed), signers.admin.address);
  await tx.wait();

  const timelockLongRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_LONG"));
  tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(timelockLongRole), signers.admin.address);
  await tx.wait();

  const oracleAdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
  tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(oracleAdminRole), signers.admin.address);
  await tx.wait();

  // set protocolSigner to be PROTOCOL_ROLE
  const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));
  console.log(signers.admin.address)
  tx = await directory.connect(signers.admin).grantRole(ethers.utils.arrayify(protocolRole), signers.protocolSigner.address);
  await tx.wait();

  expect(await directory.getTreasuryAddress()).to.equal(treasury.address);

  const returnData: Protocol = {
      treasury, directory, whitelist, vCWETH, vCRPL, operatorDistributor,
      merkleClaimStreamer, superNode, yieldDistributor, oracle, priceFetcher, wETH, sanctions
  };

  // send all rpl from admin to rplWhale
  const rplWhaleBalance = await rplContract.balanceOf(signers.deployer.address);
  tx = await rplContract.transfer(signers.rplWhale.address, rplWhaleBalance);
  await tx.wait();

  let hasProtocolRole = await returnData.directory.hasRole(protocolRole, signers.protocolSigner.address);
  while (!(hasProtocolRole)) {
      hasProtocolRole = await returnData.directory.hasRole(protocolRole, signers.protocolSigner.address);
  }

  return returnData;
}

export async function protocolFixture(): Promise<SetupData> {
  try {
    await loadFixture(deployRocketPool);
    await loadFixture(setDefaultParameters);

    const signers = await createSigners();

    const deployedProtocol = await deployProtocolLocalDev(signers);
    const rocketPool = await getRocketPool(deployedProtocol.directory);

    return { protocol: deployedProtocol, signers, rocketPool };
  } catch (e) {
    console.log("Error", e)
    return await protocolFixture();
  }
}
