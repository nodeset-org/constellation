// This script is an example of an automated oracle update.
// This one in particular is intended to be loaded into OZ Defender for a scheduled transaction
// To test locally, check the instructions below and run with `npx tsx run scripts/oracle_autoupdate.ts`
// It's best to run via tsx and not via hardhat so you can emulate a similar TS environment that Defender would use

// INSTRUCTIONS
// 1. Set the constants
// 2. Follow comment/uncomment instructions depending on if you are deploying or testing

// comment this out for deployment
//require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('ethers');

// comment this out for deployment (Defender will provide the credentials)
// if you're testing, you need these relayer API keys set in your .env file
// const credentials = {
//   relayerApiKey: `${process.env.DEFENDER_RELAY_KEY}`,
//   relayerApiSecret: `${process.env.DEFENDER_RELAY_SECRET}`,
// };

// make sure to change these to the correct values
const OD_ADDRESS = '0x498A46Ef3EaD2D777cEF50Cb368c65FFb1c33f8E';
const ORACLE_ADDRESS = '0x189CEd4F1a9Eae002bcdb04594E3dC91368AfFaF';
const CHAIN_ID = 17000;

//comment this out for deployment
//testFunction(credentials);

// use the exports.handler line for deployment, use the other one for testing
exports.handler = async function(credentials) {
//async function testFunction(credentials: any) {
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
  console.log('totalYieldAccrued', totalYieldAccrued);
  const sig = data.signature;
  console.log('sig', sig);
  const timestamp = data.timestamp;
  console.log('timestamp', timestamp);
  console.log('latest timestamp', (await provider.getBlock('latest')).timestamp);

  const od = new ethers.Contract(OD_ADDRESS, ['function oracleError() public view returns (uint256)'], provider);

  const expectedOracleError = await od.oracleError();
  console.log('expectedOracleError', expectedOracleError);
  const sigData = {
    newTotalYieldAccrued: totalYieldAccrued,
    expectedOracleError: expectedOracleError,
    timeStamp: timestamp,
  };
  console.log('sigData', sigData);

  const oracleABI = [
    'function setTotalYieldAccrued(bytes calldata _sig, (int256 newTotalYieldAccrued, uint256 expectedOracleError, uint256 timeStamp) calldata sigData)',
  ];

  const oracle = new ethers.Contract(ORACLE_ADDRESS, oracleABI, signer);

  // use the callStatic line for local testing, the other for deployment
  //const txResult = await oracle.callStatic.setTotalYieldAccrued(sig, sigData, { maxFeePerGas: 200, gasLimit: 1000000 });
  const txResult = await oracle.setTotalYieldAccrued(sig, sigData, { maxFeePerGas: 200 });

  console.log(txResult);

  // uncomment this for deployment
  return txResult.hash;
}
