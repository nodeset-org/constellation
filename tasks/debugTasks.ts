import { task, types } from 'hardhat/config';

task(
  'getRevertReason',
  'Determines the revert reason for a transaction hash'
)
  .addParam('txhash', 'The hash of the transaction', undefined, types.string)
  .setAction(async ({ txhash }, hre) => {
    const getRevertReason = require('eth-revert-reason');
    const reason = await getRevertReason(txhash);

    console.log(`Transaction with hash ${txhash} reverted with reason: ${reason}`);

    return reason;
  });
