// This script is an example of an automated oracle update.
// This one in particular is intended to be loaded into OZ Defender for a scheduled transaction
// To test locally, check the instructions below and run with `npx tsx run scripts/oracle_autoupdate.ts`
// It's best to run via tsx and not via hardhat so you can emulate a similar TS environment that Defender would use

import G from 'glob';

// INSTRUCTIONS
// 1. Set the constants
// 2. Follow comment/uncomment instructions depending on if you are deploying or testing

// comment this out for deployment
require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('ethers');

// comment this out for deployment (Defender will provide the credentials)
// if you're testing, you need these relayer API keys set in your .env file
const credentials = {
  relayerApiKey: `${process.env.DEFENDER_RELAY_KEY}`,
  relayerApiSecret: `${process.env.DEFENDER_RELAY_SECRET}`,
};

// make sure to change these to the correct values
const DIRECTORY_ADDRESS = '0x925D0700407fB0C855Ae9903B3a2727F1e88576c';
const CHAIN_ID = 17000;

//comment this out for deployment
testFunction(credentials);

// use the exports.handler line for deployment, use the other one for testing
//exports.handler = async function(credentials) {
async function testFunction(credentials: any) {
  const client = new Defender(credentials);

  const provider = client.relaySigner.getProvider();
  const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });

  const oracleURL = 'https://oracle-staging.nodeset.io/v1/total-yield-accrued';
  const oracleResponse = await fetch(oracleURL);
  if (!oracleResponse.ok) {
    throw new Error('Failed to fetch oracle response');
  }
  const data = (await oracleResponse.json()).data;
  if (data === undefined) throw new Error('Failed to fetch data from oracle response');

  const totalYieldAccrued = data.totalYieldAccrued;
  //console.log('totalYieldAccrued', totalYieldAccrued);
  const sig = data.signature;
  //console.log('sig', sig);
  const timestamp = data.timestamp;
  //console.log('timestamp', timestamp);
  //console.log('latest timestamp', (await provider.getBlock('latest')).timestamp);
  const oracleOffset = data.oracleOffset;

  const directory = new ethers.Contract(
    DIRECTORY_ADDRESS,
    [
      'function getOracleAddress() public view returns (address)',
      'function getOperatorDistributorAddress() public view returns (address)',
    ],
    provider
  );
  const od = new ethers.Contract(
    await directory.getOperatorDistributorAddress(),
    ['function oracleError() public view returns (uint256)'],
    provider
  );

  const sigData = {
    newTotalYieldAccrued: totalYieldAccrued,
    expectedOracleError: oracleOffset,
    timeStamp: timestamp,
  };
  //console.log('sigData', sigData);

  const oracleABI = [
    'function setTotalYieldAccrued(bytes calldata _sig, (int256 newTotalYieldAccrued, uint256 expectedOracleError, uint256 timeStamp) calldata sigData)',
  ];

  const oracle = new ethers.Contract(await directory.getOracleAddress(), oracleABI, signer);

  //console.log("gas needed: ", (await oracle.estimateGas.setTotalYieldAccrued(sig, sigData)).toString());

  //return;
  // use the callStatic line for local testing, the other for deployment
  const txResult = await oracle.callStatic.setTotalYieldAccrued(sig, sigData, { gasLimit: 100000 });
  // gas limit is set to 100000 because ethers estimated the required amount as 82684
  // const txResult = await oracle.setTotalYieldAccrued(sig, sigData, { gasLimit: 100000});
  await txResult.wait();

  if (txResult.status === 0) throw new Error(`Transaction reverted: ${txResult}`);
  console.log(`Transaction successful: ${txResult}`);

  // uncomment this for deployment
  return txResult.hash;
}
