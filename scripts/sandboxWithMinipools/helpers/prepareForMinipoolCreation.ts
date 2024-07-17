import { createSigners, getRocketPool, SetupData } from "../../../test/test";
import { SandboxDeployments } from "../../utils/setup_sandbox";

/**
 * Prepares for minipool creation by setting up necessary data and configurations.
 * 
 * @param deployments - The sandbox deployed contracts.
 * @returns The setup data containing the protocol, rocket pool instance, and signers.
 */

export const prepareForMinipoolCreation = async (deployments: SandboxDeployments) => {
    console.log('Preparing for minipool creation...');
    const signers = await createSigners();

    const { admin, adminServer } = signers;

    const rocketPool = await getRocketPool(deployments.directory);

    const setupData: SetupData = {
      protocol: deployments,
      rocketPool,
      signers,
    };

    console.log('Funded the rplWhale');

    const rplWhaleBalance = await rocketPool.rplContract.balanceOf(signers.deployer.address);
    
    await rocketPool.rplContract.transfer(signers.rplWhale.address, rplWhaleBalance);

    console.log('Granted admin server role to admin server.')
    const adminRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_SERVER_ROLE'));

    await deployments.directory.connect(admin).grantRole(ethers.utils.arrayify(adminRole), adminServer.address);

    console.log('Prepared for minipool creation.');
    return setupData;
  }