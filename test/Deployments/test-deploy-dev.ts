import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber as BN } from "ethers";
import { deployRocketPool } from "../rocketpool/_helpers/deployment";
import { setDefaultParameters } from "../rocketpool/_helpers/defaults";
import { RocketStorage } from "../rocketpool/_utils/artifacts";
import { IRocketStorage } from "../../typechain-types";
import { deployDev, deployDevUsingEnv } from "../../scripts/environments/deploy_dev";
import { getWalletFromPath } from "../../scripts/environments/keyReader";

describe(`Test Deploy Dev Env`, () => {
  beforeEach(async function () {
    await network.provider.request({
      method: "hardhat_reset",
      params: [{
        forking: {
          jsonRpcUrl: process.env.HOLESKY_RPC,
        },
      }],
    });
  });

  after(async () => {
    await network.provider.request({
      method: "hardhat_reset",
      params: [{
      }],
    });
  })

  it("Should pass", async () => {
    const directory = await deployDevUsingEnv();

    expect(await directory?.getMerkleClaimStreamerAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getOperatorDistributorAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getOperatorDistributorAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getOperatorRewardAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getOracleAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getPriceFetcherAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRPLAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRPLVaultAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketDAOProtocolProposalAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketDAOProtocolSettingsMinipool()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketDAOProtocolSettingsRewardsAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketDepositPoolAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketMerkleDistributorMainnetAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketMinipoolManagerAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketNetworkPenalties()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketNetworkPrices()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketNetworkVotingAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketNodeDepositAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketNodeManagerAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketNodeStakingAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getRocketStorageAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getSuperNodeAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getTreasuryAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getWETHAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getWETHVaultAddress()).not.equals(ethers.constants.AddressZero);
    expect(await directory?.getWhitelistAddress()).not.equals(ethers.constants.AddressZero);

    const protocol = await directory?.getProtocol();

    for (let i = 0; i < protocol!.length; i++) {
      console.log(protocol![i])
      expect(protocol![i]).not.equals(ethers.constants.AddressZero);
    }

    const integrations = await directory?.getRocketIntegrations();
    for (let i = 0; i < integrations!.length; i++) {
      console.log(integrations![i])
      expect(integrations![i]).not.equals(ethers.constants.AddressZero);
    }

    const protocolRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CORE_PROTOCOL_ROLE"));
    const expectedProtocolSigner = await getWalletFromPath(process.env.DIRECTORY_DEPLOYER_PRIVATE_KEY_PATH as string)
    expect(await directory?.hasRole(protocolRole, expectedProtocolSigner.address)).equals(true)

    const treasurerRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TREASURER_ROLE"));
    const expectedTreasurerAddress = await getWalletFromPath(process.env.DIRECTORY_DEPLOYER_PRIVATE_KEY_PATH as string)
    expect(await directory?.hasRole(treasurerRole, expectedTreasurerAddress.address)).equals(true)

  })
})