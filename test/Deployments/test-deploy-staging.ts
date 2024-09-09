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
import { deployStagingUsingEnv } from "../../scripts/environments/deploy_staging";

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
        const directory = await deployStagingUsingEnv();

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
        const expectedProtocolSigner = await getWalletFromPath(ethers, process.env.DIRECTORY_DEPLOYER_PRIVATE_KEY_PATH as string)
        expect(await directory?.hasRole(protocolRole, expectedProtocolSigner.address)).equals(false)

        const treasurerRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TREASURER_ROLE"));
        expect(await directory?.hasRole(treasurerRole, process.env.TREASURER_ADDRESS as string)).equals(true)

        const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
        expect(await directory?.hasRole(adminRole, process.env.ADMIN_MULTISIG as string)).equals(true)
        expect(await directory?.hasRole(adminRole, (await getWalletFromPath(ethers, process.env.TEMPORAL_ADMIN_KEY_PATH as string)).address)).equals(false)

        const nodeSetServerAdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("NODESET_ADMIN_SERVER_ROLE"));
        const nodeSetAdminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("NODESET_ADMIN_ROLE"));
        const nodesetRewardsAddress = await directory?.getOperatorRewardAddress();
        const nodesetRewards = await ethers.getContractAt("NodeSetOperatorRewardDistributor", nodesetRewardsAddress as string);
        expect(await nodesetRewards?.hasRole(nodeSetServerAdminRole, process.env.NODESET_SERVER_ADMIN as string)).equals(true)
        expect(await nodesetRewards?.hasRole(nodeSetAdminRole, process.env.NODESET_ADMIN as string)).equals(true)

        const adminOracleRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ORACLE_ROLE"));
        expect(await directory?.hasRole(adminOracleRole, process.env.ADMIN_ORACLE as string)).equals(true)

        const adminServerRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_SERVER_ROLE"));
        expect(await directory?.hasRole(adminServerRole, process.env.ADMIN_SERVER as string)).equals(true)

        const timelockShortRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_SHORT"));
        expect(await directory?.hasRole(timelockShortRole, process.env.TIMELOCK_SHORT as string)).equals(true)

        const timelockMedRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_MED"));
        expect(await directory?.hasRole(timelockMedRole, process.env.TIMELOCK_MEDIUM as string)).equals(true)

        const timelockLongRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TIMELOCK_LONG"));
        expect(await directory?.hasRole(timelockLongRole, process.env.TIMELOCK_LONG as string)).equals(true)
    })
});