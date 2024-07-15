import { deriveEth2ValidatorKeys, deriveKeyFromMaster } from '@chainsafe/bls-keygen';
import { RocketMinipoolFactory } from '../../../test/rocketpool/_utils/artifacts';
import { getSignerPrivateKey, NewOperator, SetupData, Signers } from '../../../test/test';
import { approveHasSignedExitMessageSig, prepareOperatorDistributionContract } from '../../../test/utils/utils';
import { ethers } from 'hardhat';
import { types } from '@chainsafe/lodestar-types/lib/ssz/presets/mainnet';
import { DepositData } from '@chainsafe/lodestar-types';
import { keccak256 } from 'ethereumjs-util';
import { bls12_381 as bls } from '@noble/curves/bls12-381';

export const prepareNewOperators = async (setupData: SetupData): Promise<[SetupData, NewOperator[]]> => {
  console.log('Preparing new operators...');

  const { signers } = setupData;

  const operators = await Promise.all([
    makeOperator('operator', setupData, 0),
    makeOperator('random', setupData, 1),
    makeOperator('random2', setupData, 2),
    makeOperator('random3', setupData, 3),
    makeOperator('random4', setupData, 4),
    makeOperator('random5', setupData, 5),
  ]);

  // TODO: Not sure why the + 1 necessary? Without it we seem to run out of RPL/ETH in the node
  await prepareOperatorDistributionContract(setupData, operators.length + 1);

  console.log('Prepared new operators.');
  return [setupData, operators];
};

const makeOperator = async (signerKey: keyof Signers, setupData: SetupData, salt: number): Promise<NewOperator> => {
  const index = 0;
  const { signers, protocol: { superNode } } = setupData;
  const privateKey = getSignerPrivateKey(signerKey);

  const privateKeyArr = ethers.utils.arrayify(privateKey);

  const signer = signers[signerKey];
  const amount = BigInt(1000000000);

  const rocketMinipoolFactory = await RocketMinipoolFactory.deployed();
  let expectedMinipoolAddress = (await rocketMinipoolFactory.getExpectedAddress(superNode.address, salt)).substr(2);

  console.log('expectedMinipoolAddress: ', expectedMinipoolAddress);

  let withdrawalCredentials = '0x010000000000000000000000' + expectedMinipoolAddress;

  const pubkey = deriveKeyFromMaster(privateKeyArr, `m/12381/3600/${index}/0/0`);

  const validatorKey = deriveEth2ValidatorKeys(pubkey, 1);

  console.log('minipool public key: ', Buffer.from(ethers.utils.zeroPad(pubkey, 48)));

  const depositMessage = Buffer.concat([
    Buffer.from(ethers.utils.zeroPad(pubkey, 48)),
    Buffer.from(withdrawalCredentials.substr(2), 'hex'),
    ethers.utils.zeroPad(ethers.utils.arrayify(ethers.BigNumber.from(amount)), 8),
  ]);

  const signingRoot = keccak256(depositMessage);

  const signature = bls.sign(signingRoot, validatorKey.signing);

  const depositData: DepositData = {
    pubkey: Buffer.from(ethers.utils.zeroPad(pubkey, 48)),
    amount,
    signature,
    withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), 'hex'),
  };

  const depositDataRoot = types.DepositData.hashTreeRoot(depositData);

  const exitMessageSignature = await approveHasSignedExitMessageSig(
    setupData,
    '0x' + expectedMinipoolAddress,
    salt
  );

  return {
    signer,
    depositData,
    depositDataRoot,
    expectedMinipoolAddress,
    salt,
    bondValue: ethers.utils.parseEther('8'),
    minimumNodeFee: 0,
    timezoneLocation: 'Australia/Brisbane',
    exitMessageSignature
  };
};
