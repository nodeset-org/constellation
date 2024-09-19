const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('ethers');

const credentials = {
  relayerApiKey: 'CvBQUaFWBtMKoSsMp8DjgkQPimYmPcnH',
  relayerApiSecret: '4GoJqd4wL6HXEsdmt6EkqP86oa1vdcgXq9jq6XmNej58PiJFh2hXvaZQie1p49rS',
};
const OD_ADDRESS = '0x498A46Ef3EaD2D777cEF50Cb368c65FFb1c33f8E';
const ORACLE_ADDRESS = '0x189CEd4F1a9Eae002bcdb04594E3dC91368AfFaF';
const CHAIN_ID = 17000;

testFunction(credentials);

//exports.handler = async function(credentials: any) {
async function testFunction(credentials: any) {
  const client = new Defender(credentials);

  const provider = client.relaySigner.getProvider();
  const signer = client.relaySigner.getSigner(provider, { speed: 'fast' });

  const oracleURL = 'https://oracle-staging.nodeset.io/v1/total-yield-accrued';
  const oracleResponse = await fetch(oracleURL);
  if (!oracleResponse.ok) {
    throw new Error('Failed to fetch oracle response');
  }
  const data = (await oracleResponse.json()).data;
  if (data === undefined) throw new Error('Failed to fetch data from oracle response');

  const totalYieldAccrued = data.totalYieldAccrued;
  const sig = data.sig;
  const timestamp = data.timestamp;

  const od = new ethers.Contract(OD_ADDRESS, ['function oracleError() public view returns (uint256)'], provider);

  const expectedOracleError = await od.oracleError();
  console.log('expectedOracleError', expectedOracleError);
  const sigData = {
    newTotalYieldAccrued: totalYieldAccrued,
    expectedOracleError: expectedOracleError,
    timeStamp: timestamp,
  };
  console.log('sigData', sigData);

  const setTotalYieldAccruedABI = [
    'function getImplementation() public view returns (address) ',
    'function setTotalYieldAccrued(bytes calldata _sig, tuple(int256 newTotalYieldAccrued, uint256 expectedOracleError, uint256 timeStamp) calldata sigData)',
  ];

  const oracle = new ethers.Contract(ORACLE_ADDRESS, setTotalYieldAccruedABI, provider);
  //console.log('oracle', oracle)
  console.log('getImplementation', await oracle.getImplementation());
  const txResult = await oracle.callStatic.setTotalYieldAccrued(sig, sigData);

  // const txRes = await client.relaySigner.sendTransaction({
  //   to: 'ORACLE_ADDRESS',
  //   data: functionData,
  //   value: 0,
  //   speed: 'fast'
  // });

  console.log(txResult);
  // return txRes.hash;
}

const setTotalYieldAccruedABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'int256',
        name: '_amount',
        type: 'int256',
      },
    ],
    name: 'TotalYieldAccruedUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    inputs: [],
    name: 'getDirectory',
    outputs: [
      {
        internalType: 'contract Directory',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getImplementation',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLastUpdatedTotalYieldAccrued',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalYieldAccrued',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'directoryAddress',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_directoryAddress',
        type: 'address',
      },
    ],
    name: 'initializeOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'int256',
            name: 'newTotalYieldAccrued',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'expectedOracleError',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timeStamp',
            type: 'uint256',
          },
        ],
        internalType: 'struct PoAConstellationOracle.PoAOracleSignatureData',
        name: 'sigData',
        type: 'tuple',
      },
    ],
    name: 'setTotalYieldAccrued',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];
