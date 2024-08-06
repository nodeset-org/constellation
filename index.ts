//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AddressQueueStorage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addressQueueStorageAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'capacity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'dequeueItem',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'enqueueItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'getIndexOf',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getItem',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'removeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AddressQueueStorageInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addressQueueStorageInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'dequeueItem',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'enqueueItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'getIndexOf',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getItem',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'removeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AddressSetStorage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addressSetStorageAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'addItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'getIndexOf',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getItem',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'removeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AddressSetStorageInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addressSetStorageInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'addItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'getIndexOf',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getItem',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'removeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AssetRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const assetRouterAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'balanceEthAndWeth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'balanceRpl',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'closeGate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTvlEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTvlRpl',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_minipool',
        internalType: 'contract IMinipool',
        type: 'address',
      },
    ],
    name: 'onClaimSkimmedRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'bondAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'onEthBondReceived',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'rewardAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'avgTreasuryFee', internalType: 'uint256', type: 'uint256' },
      { name: 'avgOperatorsFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onEthRewardsAndBondReceived',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'rewardAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'avgTreasuryFee', internalType: 'uint256', type: 'uint256' },
      { name: 'avgOperatorsFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onEthRewardsReceived',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_minipool',
        internalType: 'contract IMinipool',
        type: 'address',
      },
    ],
    name: 'onExitedMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onRplBalanceDecrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onRplBalanceIncrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: 'avgTreasuryFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onRplRewardsRecieved',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onWethBalanceDecrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onWethBalanceIncrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'openGate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sendEthToDistributors',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sendRplToDistributors',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stakeRpl',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'unstakeRpl',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constants
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const constantsAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN_ONLY_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BAD_ADMIN_SERVER_SIGNATURE_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BAD_BOND_BOUNDS',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BAD_TREASURY_BATCH_CALL',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BAD_TREASURY_EXECUTION_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CONTRACT_NOT_FOUND_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'INITIALIZATION_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'INSUFFICIENT_ETH_IN_QUEUE_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINIPOOL_INVALID_BOND_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINIPOOL_NODE_NOT_WHITELISTED_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINIPOOL_NOT_LEB8_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINIPOOL_NOT_REGISTERED_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'OPERATOR_CONTROLLER_SET_FORBIDDEN_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'OPERATOR_DUPLICATE_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'OPERATOR_NOT_FOUND_ERROR',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DepositInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const depositInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_pubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_withdrawalCredentials', internalType: 'bytes', type: 'bytes' },
      { name: '_signature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Directory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const directoryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'eoa_origin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SanctionViolation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'eoa_origin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SanctionViolation',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'SanctionsDisabled' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disableSanctions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'enableSanctions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAssetRouterAddress',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOperatorDistributorAddress',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOracleAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPriceFetcherAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLVaultAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketDAOProtocolProposalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketDAOProtocolSettingsMinipool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketDAOProtocolSettingsRewardsAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketDepositPoolAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketMerkleDistributorMainnetAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketMinipoolManagerAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketNetworkPenalties',
    outputs: [
      {
        name: '',
        internalType: 'contract IRocketNetworkPenalties',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketNetworkPrices',
    outputs: [
      {
        name: '',
        internalType: 'contract IRocketNetworkPrices',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketNetworkVotingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketNodeDepositAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketNodeManagerAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketNodeStakingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tag', internalType: 'string', type: 'string' }],
    name: 'getRocketPoolAddressByTag',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketStorageAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSuperNodeAddress',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTreasuryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWETHAddress',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWETHVaultAddress',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWhitelistAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getYieldDistributorAddress',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newProtocol',
        internalType: 'struct Protocol',
        type: 'tuple',
        components: [
          { name: 'whitelist', internalType: 'address', type: 'address' },
          {
            name: 'wethVault',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'rplVault', internalType: 'address', type: 'address' },
          {
            name: 'assetRouter',
            internalType: 'address payable',
            type: 'address',
          },
          {
            name: 'operatorDistributor',
            internalType: 'address payable',
            type: 'address',
          },
          {
            name: 'yieldDistributor',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'priceFetcher', internalType: 'address', type: 'address' },
          {
            name: 'superNode',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'rocketStorage', internalType: 'address', type: 'address' },
          { name: 'weth', internalType: 'address payable', type: 'address' },
          { name: 'sanctions', internalType: 'address', type: 'address' },
        ],
      },
      { name: 'treasury', internalType: 'address', type: 'address' },
      { name: 'treasurer', internalType: 'address', type: 'address' },
      { name: 'admin', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_account1', internalType: 'address', type: 'address' },
      { name: '_account2', internalType: 'address', type: 'address' },
    ],
    name: 'isSanctioned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_accounts', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'isSanctioned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'isSanctioned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newProtocol',
        internalType: 'struct Protocol',
        type: 'tuple',
        components: [
          { name: 'whitelist', internalType: 'address', type: 'address' },
          {
            name: 'wethVault',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'rplVault', internalType: 'address', type: 'address' },
          {
            name: 'assetRouter',
            internalType: 'address payable',
            type: 'address',
          },
          {
            name: 'operatorDistributor',
            internalType: 'address payable',
            type: 'address',
          },
          {
            name: 'yieldDistributor',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'priceFetcher', internalType: 'address', type: 'address' },
          {
            name: 'superNode',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'rocketStorage', internalType: 'address', type: 'address' },
          { name: 'weth', internalType: 'address payable', type: 'address' },
          { name: 'sanctions', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'setAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOracle', internalType: 'address', type: 'address' }],
    name: 'setOracle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newTreasury', internalType: 'address', type: 'address' }],
    name: 'setTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name_', internalType: 'string', type: 'string' },
      { name: 'symbol_', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Burnable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20BurnableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const errorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'expectedBondAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBondAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BadBondAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'BadPredictedCreation',
  },
  {
    type: 'error',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'BadRole',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedSender', internalType: 'address', type: 'address' },
    ],
    name: 'BadSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelCall',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelEthTransfer',
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'NotAContract',
  },
  { type: 'error', inputs: [], name: 'ZeroAddressError' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IBeaconOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iBeaconOracleAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getLastUpdatedTotalYieldAccrued',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalYieldAccrued',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Burnable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20BurnableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMinipool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMinipoolAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'beginUserDistribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_balance', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateNodeShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_balance', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateUserShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canPromote',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canStake',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'delegateRollback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'delegateUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dissolve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_rewardsOnly', internalType: 'bool', type: 'bool' }],
    name: 'distributeBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFinalised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDepositAssigned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDepositBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeRefundBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeTopUpValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreLaunchValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreMigrationBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_member', internalType: 'address', type: 'address' }],
    name: 'getScrubVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatus',
    outputs: [{ name: '', internalType: 'enum MinipoolStatus', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatusBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatusTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalScrubVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositAssigned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositAssignedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacant',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondingValue', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'preDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'prepareVacancy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'promote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reduceBondAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_setting', internalType: 'bool', type: 'bool' }],
    name: 'setUseLatestDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userDistributeAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteScrub',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketDAOProtocolProposal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketDaoProtocolProposalAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      {
        name: '_voteDirection',
        internalType: 'enum VoteDirection',
        type: 'uint8',
      },
    ],
    name: 'overrideVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalMessage', internalType: 'string', type: 'string' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_blockNumber', internalType: 'uint32', type: 'uint32' },
      {
        name: '_treeNodes',
        internalType: 'struct Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'propose',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      {
        name: '_voteDirection',
        internalType: 'enum VoteDirection',
        type: 'uint8',
      },
      { name: '_votingPower', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeIndex', internalType: 'uint256', type: 'uint256' },
      {
        name: '_witness',
        internalType: 'struct Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketDAOProtocolSettingsMinipool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketDaoProtocolSettingsMinipoolAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getLaunchBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreLaunchValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketDAOProtocolSettingsRewards
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketDaoProtocolSettingsRewardsAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketMerkleDistributorMainnet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketMerkleDistributorMainnetAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketMinipoolManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketMinipoolManagerAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketNetworkPenalties
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketNetworkPenaltiesAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdatePenalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getPenaltyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitPenalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketNetworkPrices
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketNetworkPricesAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdatePrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPricesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitPrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketNetworkVoting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketNetworkVotingAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'initialiseVoting',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newDelegate', internalType: 'address', type: 'address' },
    ],
    name: 'setDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketNodeDeposit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketNodeDepositAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketNodeManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketNodeManagerAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationState',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'registerNode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_newRPLWithdrawalAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_confirm', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRPLWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_state', internalType: 'bool', type: 'bool' }],
    name: 'setSmoothingPoolRegistrationState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketNodeStaking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketNodeStakingAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatchedLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHProvided',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMaximumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinimumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStakedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_caller', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setStakeRPLForAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stakeRPLFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRocketStorage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRocketStorageAbi = [
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_newWithdrawalAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_confirm', internalType: 'bool', type: 'bool' },
    ],
    name: 'setWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ISanctions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iSanctionsAbi = [
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'isSanctioned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IWETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iwethAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'guy', internalType: 'address', type: 'address' },
      { name: 'wad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'dst', internalType: 'address', type: 'address' },
      { name: 'wad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'src', internalType: 'address', type: 'address' },
      { name: 'dst', internalType: 'address', type: 'address' },
      { name: 'wad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'wad', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockErc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_initialSupply', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockMinipool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockMinipoolAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'beginUserDistribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_balance', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateNodeShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_balance', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateUserShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canPromote',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canStake',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'delegateRollback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'delegateUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dissolve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_rewardsOnly', internalType: 'bool', type: 'bool' }],
    name: 'distributeBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFinalised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDepositAssigned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDepositBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeRefundBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeTopUpValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreLaunchValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreMigrationBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_member', internalType: 'address', type: 'address' }],
    name: 'getScrubVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatus',
    outputs: [{ name: '', internalType: 'enum MinipoolStatus', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatusBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatusTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalScrubVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositAssigned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositAssignedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacant',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '__nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondValue', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'preDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'prepareVacancy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'promote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reduceBondAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newBalance', internalType: 'uint256', type: 'uint256' }],
    name: 'setNodeDepositBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_setting', internalType: 'bool', type: 'bool' }],
    name: 'setUseLatestDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userDistributeAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteScrub',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockNodeAccountV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockNodeAccountV2Abi = [
  {
    type: 'error',
    inputs: [
      { name: 'expectedBondAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBondAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BadBondAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'BadPredictedCreation',
  },
  {
    type: 'error',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'BadRole',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedSender', internalType: 'address', type: 'address' },
    ],
    name: 'BadSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelCall',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelEthTransfer',
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'NotAContract',
  },
  { type: 'error', inputs: [], name: 'ZeroAddressError' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adminServerCheck',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adminServerSigExpiry',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allowSubOpDelegateChanges',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'bond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_subNodeOperator', internalType: 'address', type: 'address' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_config',
        internalType: 'struct SuperNodeAccount.CreateMinipoolConfig',
        type: 'tuple',
        components: [
          { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'validatorSignature', internalType: 'bytes', type: 'bytes' },
          { name: 'depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'salt', internalType: 'uint256', type: 'uint256' },
          {
            name: 'expectedMinipoolAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'sigGenesisTime', internalType: 'uint256', type: 'uint256' },
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'createMinipool',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'delegateRollback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'delegateUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNumMinipools',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSubNodeOpFromMinipool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalEthMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalEthStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_bond', internalType: 'uint256', type: 'uint256' }],
    name: 'hasSufficientLiquidity',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_directory', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lazyInitialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lockStarted',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockUpTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lockedEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxValidators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
      {
        name: '_config',
        internalType: 'struct MerkleRewardsConfig',
        type: 'tuple',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'sigGenesisTime', internalType: 'uint256', type: 'uint256' },
          {
            name: 'avgEthTreasuryFee',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'avgEthOperatorFee',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'avgRplTreasuryFee',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'merkleClaim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'merkleClaimNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'merkleClaimSigExpiry',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'merkleClaimSigUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minimumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'minipoolData',
    outputs: [
      { name: 'subNodeOperator', internalType: 'address', type: 'address' },
      { name: 'ethTreasuryFee', internalType: 'uint256', type: 'uint256' },
      { name: 'noFee', internalType: 'uint256', type: 'uint256' },
      { name: 'rplTreasuryFee', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'minipoolIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'minipools',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'bool', type: 'bool' }],
    name: 'setAdminServerCheck',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newExpiry', internalType: 'uint256', type: 'uint256' }],
    name: 'setAdminServerSigExpiry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'bool', type: 'bool' }],
    name: 'setAllowSubNodeOpDelegateChanges',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newBond', internalType: 'uint256', type: 'uint256' }],
    name: 'setBond',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newLockThreshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLockAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newLockUpTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLockUpTime',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maxValidators', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMaxValidators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newMinimumNodeFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMinimumNodeFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_setting', internalType: 'bool', type: 'bool' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'setUseLatestDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'sigsUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_subNodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'stopTrackingOperatorMinipools',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'subNodeOperatorHasMinipool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subNodeOperatorMinipools',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'test',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalEthLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'unlockEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockPriceFetcher
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockPriceFetcherAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'price',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_price', internalType: 'uint256', type: 'uint256' }],
    name: 'setPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockRETHOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockRethOracleAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastUpdatedTotalYieldAccrued',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalYieldAccrued',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'yield', internalType: 'int256', type: 'int256' }],
    name: 'setTotalYieldAccrued',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockRocketNodeManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockRocketNodeManagerAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationState',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'mockSetNodeOperatorToMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'nodeOperatorsToMinipools',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'registerNode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_newRPLWithdrawalAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_confirm', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRPLWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_state', internalType: 'bool', type: 'bool' }],
    name: 'setSmoothingPoolRegistrationState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'smoothingPoolRegistrationStates',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockRocketNodeStaking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockRocketNodeStakingAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatchedLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHProvided',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMaximumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'getNodeMinimumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStakedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rplStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_rplStaked', internalType: 'uint256', type: 'uint256' }],
    name: 'setRPLStaked',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_caller', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setStakeRPLForAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stakeRPLFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockRocketStorage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockRocketStorageAbi = [
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_newWithdrawalAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_confirm', internalType: 'bool', type: 'bool' },
    ],
    name: 'setWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockSanctions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockSanctionsAbi = [
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'addBlacklist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'isSanctioned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockSuperNodeV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockSuperNodeV2Abi = [
  {
    type: 'error',
    inputs: [
      { name: 'expectedBondAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBondAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BadBondAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'BadPredictedCreation',
  },
  {
    type: 'error',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'BadRole',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedSender', internalType: 'address', type: 'address' },
    ],
    name: 'BadSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelCall',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelEthTransfer',
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'NotAContract',
  },
  { type: 'error', inputs: [], name: 'ZeroAddressError' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adminServerCheck',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adminServerSigExpiry',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allowSubOpDelegateChanges',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'bond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_subNodeOperator', internalType: 'address', type: 'address' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_config',
        internalType: 'struct SuperNodeAccount.CreateMinipoolConfig',
        type: 'tuple',
        components: [
          { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'validatorSignature', internalType: 'bytes', type: 'bytes' },
          { name: 'depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'salt', internalType: 'uint256', type: 'uint256' },
          {
            name: 'expectedMinipoolAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'sigGenesisTime', internalType: 'uint256', type: 'uint256' },
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'createMinipool',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'delegateRollback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'delegateUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNumMinipools',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSubNodeOpFromMinipool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalEthMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalEthStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_bond', internalType: 'uint256', type: 'uint256' }],
    name: 'hasSufficientLiquidity',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_directory', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lazyInitialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lockStarted',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockUpTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lockedEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxValidators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
      {
        name: '_config',
        internalType: 'struct MerkleRewardsConfig',
        type: 'tuple',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'sigGenesisTime', internalType: 'uint256', type: 'uint256' },
          {
            name: 'avgEthTreasuryFee',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'avgEthOperatorFee',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'avgRplTreasuryFee',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'merkleClaim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'merkleClaimNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'merkleClaimSigExpiry',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'merkleClaimSigUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minimumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'minipoolData',
    outputs: [
      { name: 'subNodeOperator', internalType: 'address', type: 'address' },
      { name: 'ethTreasuryFee', internalType: 'uint256', type: 'uint256' },
      { name: 'noFee', internalType: 'uint256', type: 'uint256' },
      { name: 'rplTreasuryFee', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'minipoolIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'minipools',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'bool', type: 'bool' }],
    name: 'setAdminServerCheck',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newExpiry', internalType: 'uint256', type: 'uint256' }],
    name: 'setAdminServerSigExpiry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'bool', type: 'bool' }],
    name: 'setAllowSubNodeOpDelegateChanges',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newBond', internalType: 'uint256', type: 'uint256' }],
    name: 'setBond',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newLockThreshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLockAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newLockUpTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLockUpTime',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maxValidators', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMaxValidators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newMinimumNodeFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMinimumNodeFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_setting', internalType: 'bool', type: 'bool' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'setUseLatestDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'sigsUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_subNodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'stopTrackingOperatorMinipools',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'subNodeOperatorHasMinipool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subNodeOperatorMinipools',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testUpgrade',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalEthLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'unlockEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockTargetAlpha
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockTargetAlphaAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'called',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'number', internalType: 'uint256', type: 'uint256' }],
    name: 'doCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockTreasuryV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockTreasuryV2Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_to', internalType: 'address', type: 'address', indexed: true },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ClaimedEth',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: '_to', internalType: 'address', type: 'address', indexed: true },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ClaimedToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_functionData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: true,
      },
    ],
    name: 'Executed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [{ name: '_to', internalType: 'address payable', type: 'address' }],
    name: 'claimEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address payable', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimEthAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'claimToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimTokenAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'address payable', type: 'address' },
      { name: '_functionData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_targets',
        internalType: 'address payable[]',
        type: 'address[]',
      },
      { name: '_functionData', internalType: 'bytes[]', type: 'bytes[]' },
      { name: '_values', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'executeAll',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'test',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockUniswapV3Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockUniswapV3PoolAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: '_sqrtPriceX96', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSqrtPriceX96',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slot0',
    outputs: [
      { name: '', internalType: 'uint160', type: 'uint160' },
      { name: '', internalType: 'int24', type: 'int24' },
      { name: '', internalType: 'uint16', type: 'uint16' },
      { name: '', internalType: 'uint16', type: 'uint16' },
      { name: '', internalType: 'uint16', type: 'uint16' },
      { name: '', internalType: 'uint8', type: 'uint8' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sqrtPriceX96',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OperatorDistributor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const operatorDistributorAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'expectedBondAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBondAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BadBondAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'BadPredictedCreation',
  },
  {
    type: 'error',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'BadRole',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedSender', internalType: 'address', type: 'address' },
    ],
    name: 'BadSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelCall',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelEthTransfer',
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'NotAContract',
  },
  { type: 'error', inputs: [], name: 'ZeroAddressError' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_minipoolAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MinipoolCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_minipoolAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MinipoolDestroyed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_minipoolAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_status',
        internalType: 'enum MinipoolStatus',
        type: 'uint8',
        indexed: true,
      },
      {
        name: '_isFinalized',
        internalType: 'bool',
        type: 'bool',
        indexed: true,
      },
    ],
    name: 'WarningMinipoolNotStaking',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'WarningNoMiniPoolsToHarvest',
  },
  {
    type: 'function',
    inputs: [],
    name: 'balanceEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'balanceRpl',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_existingRplStake', internalType: 'uint256', type: 'uint256' },
      { name: '_ethStaked', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateRequiredRplTopDown',
    outputs: [
      {
        name: 'withdrawableStakeRpl',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_existingRplStake', internalType: 'uint256', type: 'uint256' },
      { name: '_rpEthMatched', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateRplStakeShortfall',
    outputs: [
      { name: 'requiredStakeRpl', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentMinipool',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextMinipool',
    outputs: [
      { name: '', internalType: 'contract IMinipool', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTvlEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTvlRpl',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_directory', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minimumStakeRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onEthBalanceDecrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onEthBalanceIncrease',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onIncreaseOracleError',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newMinipoolAddress', internalType: 'address', type: 'address' },
      { name: 'nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'onMinipoolCreated',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'onNodeMinipoolDestroy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onRplBalanceDecrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onRplBalanceIncrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oracleError',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'minipool', internalType: 'contract IMinipool', type: 'address' },
    ],
    name: 'processMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'processNextMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_bond', internalType: 'uint256', type: 'uint256' }],
    name: 'provisionLiquiditiesForMinipoolCreation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_ethStaked', internalType: 'uint256', type: 'uint256' }],
    name: 'rebalanceRplStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resetOracleError',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minimumStakeRatio', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMinimumStakeRatio',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_targetStakeRatio', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTargetStakeRatio',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetStakeRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PenaltyTest
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const penaltyTestAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_rate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setPenaltyRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PoABeaconOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const poABeaconOracleAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_amount',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'TotalYieldAccruedUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastUpdatedTotalYieldAccrued',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalYieldAccrued',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initializeOracle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_sig', internalType: 'bytes', type: 'bytes' },
      { name: '_newTotalYieldAccrued', internalType: 'int256', type: 'int256' },
      { name: '_sigTimeStamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTotalYieldAccrued',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PriceFetcher
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const priceFetcherAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_directory', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ProtocolMath
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const protocolMathAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'ONE',
    outputs: [{ name: '', internalType: 'int128', type: 'int128' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ProtocolMathTest
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const protocolMathTestAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'x', internalType: 'uint256', type: 'uint256' },
      { name: 'k', internalType: 'uint256', type: 'uint256' },
      { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'test',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RPLVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rplVaultAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'assets',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TreasuryFeeClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'assets',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdraw',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'balanceRpl',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'convertToAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'convertToShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRequiredCollateral',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'deposit', internalType: 'uint256', type: 'uint256' }],
    name: 'getRequiredCollateralAfterDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'getTreasuryPortion',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
      { name: 'rplToken', internalType: 'address', type: 'address' },
    ],
    name: 'initializeVault',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidityReservePercent',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'maxDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'maxMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'maxRedeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'maxWithdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minWethRplRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onRplBalanceDecrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onRplBalanceIncrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'previewDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'previewMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'previewRedeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'previewWithdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'redeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_liquidityReservePercent',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setLiquidityReservePercent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minWethRplRatio', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMinWethRplRatio',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_treasuryFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTreasuryFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treasuryFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RevertOnTransfer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const revertOnTransferAbi = [
  { type: 'fallback', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketAuctionManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketAuctionManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'lotIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'bidAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rplAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BidClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'lotIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'bidAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BidPlaced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'lotIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'rplAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LotCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'lotIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'rplAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLRecovered',
  },
  {
    type: 'function',
    inputs: [{ name: '_lotIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'claimBid',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'createLot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllottedRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_index', internalType: 'uint256', type: 'uint256' },
      { name: '_bidder', internalType: 'address', type: 'address' },
    ],
    name: 'getLotAddressBidAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotClaimedRPLAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotCurrentPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotEndBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotIsCleared',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_index', internalType: 'uint256', type: 'uint256' },
      { name: '_block', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLotPriceAtBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotPriceAtCurrentBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotPriceByTotalBids',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotRPLRecovered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotRemainingRPLAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotReservePrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotStartBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotStartPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotTotalBidAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotTotalRPLAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRemainingRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_lotIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'placeBid',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_lotIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'recoverUnclaimedRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketAuctionManagerInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketAuctionManagerInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_lotIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'claimBid',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'createLot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllottedRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_index', internalType: 'uint256', type: 'uint256' },
      { name: '_bidder', internalType: 'address', type: 'address' },
    ],
    name: 'getLotAddressBidAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotClaimedRPLAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotCurrentPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotEndBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotIsCleared',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_index', internalType: 'uint256', type: 'uint256' },
      { name: '_block', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLotPriceAtBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotPriceAtCurrentBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotPriceByTotalBids',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotRPLRecovered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotRemainingRPLAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotReservePrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotStartBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotStartPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotTotalBidAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getLotTotalRPLAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRemainingRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_lotIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'placeBid',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_lotIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'recoverUnclaimedRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketBase
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketBaseAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketClaimDAO
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketClaimDaoAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'invoiceID',
        internalType: 'string',
        type: 'string',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLTokensSentByDAOProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLTreasuryContractClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'contractName',
        internalType: 'string',
        type: 'string',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountPerPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'startTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'periodLength',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'numPeriods',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLTreasuryContractCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'contractName',
        internalType: 'string',
        type: 'string',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLTreasuryContractPayment',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'contractName',
        internalType: 'string',
        type: 'string',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountPerPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'periodLength',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'numPeriods',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLTreasuryContractUpdated',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getContract',
    outputs: [
      {
        name: '',
        internalType: 'struct RocketClaimDAOInterface.PaymentContract',
        type: 'tuple',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'amountPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'periodLength', internalType: 'uint256', type: 'uint256' },
          { name: 'lastPaymentTime', internalType: 'uint256', type: 'uint256' },
          { name: 'numPeriods', internalType: 'uint256', type: 'uint256' },
          { name: 'periodsPaid', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getContractExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'newContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractNames', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'payOutContracts',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'spend',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketClaimDAOInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketClaimDaoInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getContract',
    outputs: [
      {
        name: '',
        internalType: 'struct RocketClaimDAOInterface.PaymentContract',
        type: 'tuple',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'amountPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'periodLength', internalType: 'uint256', type: 'uint256' },
          { name: 'lastPaymentTime', internalType: 'uint256', type: 'uint256' },
          { name: 'numPeriods', internalType: 'uint256', type: 'uint256' },
          { name: 'periodsPaid', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getContractExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'newContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'spend',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketClaimDAOInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketClaimDaoInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'spend',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketClaimDAOOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketClaimDaoOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'invoiceID',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLTokensSentByDAOProtocol',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'spend',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketClaimNodeInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketClaimNodeInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getClaimPossible',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getClaimRewardsAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getClaimRewardsPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_enable', internalType: 'bool', type: 'bool' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketClaimTrustedNodeInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketClaimTrustedNodeInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getClaimPossible',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getClaimRewardsAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getClaimRewardsPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNode', internalType: 'address', type: 'address' },
      { name: '_enable', internalType: 'bool', type: 'bool' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrusted
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_confirmDisableBootstrapMode',
        internalType: 'bool',
        type: 'bool',
      },
    ],
    name: 'bootstrapDisable',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_url', internalType: 'string', type: 'string' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapMember',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'bootstrapSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_type', internalType: 'string', type: 'string' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_contractAbi', internalType: 'string', type: 'string' },
      { name: '_contractAddress', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'decrementMemberUnbondedValidatorCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBootstrapModeDisabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMemberAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberID',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberIsChallenged',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberIsValid',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberJoinedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberLastProposalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberMinRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalType', internalType: 'string', type: 'string' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberProposalExecutedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberQuorumVotesRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberRPLBondAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberUnbondedValidatorCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberUrl',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementMemberUnbondedValidatorCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_url', internalType: 'string', type: 'string' },
    ],
    name: 'memberJoinRequired',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedActionsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeChallengedAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nodeChallengeDeciderAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionChallengeDecided',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeChallengedAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nodeChallengerAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionChallengeMade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rplBondAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionJoined',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rplBondAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionKick',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rplBondAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionLeave',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'actionChallengeDecide',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'actionChallengeMake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'actionJoin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'actionJoinRequired',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rplFine', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'actionKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_rplBondRefundAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'actionLeave',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'memberQuickAdd',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedActionsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedActionsInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'actionChallengeDecide',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'actionChallengeMake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'actionJoin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'actionJoinRequired',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rplFine', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'actionKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_rplBondRefundAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'actionLeave',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: '_confirmDisableBootstrapMode',
        internalType: 'bool',
        type: 'bool',
      },
    ],
    name: 'bootstrapDisable',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_url', internalType: 'string', type: 'string' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapMember',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'bootstrapSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_type', internalType: 'string', type: 'string' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_contractAbi', internalType: 'string', type: 'string' },
      { name: '_contractAddress', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'decrementMemberUnbondedValidatorCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBootstrapModeDisabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMemberAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberID',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberIsChallenged',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberIsValid',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberJoinedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberLastProposalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberMinRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalType', internalType: 'string', type: 'string' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberProposalExecutedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberQuorumVotesRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberRPLBondAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberUnbondedValidatorCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberUrl',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementMemberUnbondedValidatorCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_url', internalType: 'string', type: 'string' },
    ],
    name: 'memberJoinRequired',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedProposals
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedProposalsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_url', internalType: 'string', type: 'string' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalInvite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rplFine', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalLeave',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'proposalSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_type', internalType: 'string', type: 'string' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_contractAbi', internalType: 'string', type: 'string' },
      { name: '_contractAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalMessage', internalType: 'string', type: 'string' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_support', internalType: 'bool', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedProposalsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedProposalsInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_url', internalType: 'string', type: 'string' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalInvite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rplFine', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalLeave',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'proposalSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_type', internalType: 'string', type: 'string' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_contractAbi', internalType: 'string', type: 'string' },
      { name: '_contractAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalMessage', internalType: 'string', type: 'string' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_support', internalType: 'bool', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsAbi = [
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsMembers
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsMembersAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChallengeCooldown',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChallengeCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChallengeWindow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinipoolUnbondedMax',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinipoolUnbondedMinFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsMembersInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsMembersInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getChallengeCooldown',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChallengeCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChallengeWindow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinipoolUnbondedMax',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinipoolUnbondedMinFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsMinipool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsMinipoolAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBondReductionWindowLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBondReductionWindowStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCancelBondReductionQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPromotionScrubPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getScrubPenaltyEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getScrubPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getScrubQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_time', internalType: 'uint256', type: 'uint256' }],
    name: 'isWithinBondReductionWindow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsMinipoolInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsMinipoolInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getBondReductionWindowLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBondReductionWindowStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCancelBondReductionQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPromotionScrubPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getScrubPenaltyEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getScrubPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getScrubQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_time', internalType: 'uint256', type: 'uint256' }],
    name: 'isWithinBondReductionWindow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsProposals
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsProposalsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCooldownTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExecuteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoteDelayTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsProposalsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsProposalsInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getActionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCooldownTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExecuteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoteDelayTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsRewards
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsRewardsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_network', internalType: 'uint256', type: 'uint256' }],
    name: 'getNetworkEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedSettingsRewardsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedSettingsRewardsInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_network', internalType: 'uint256', type: 'uint256' }],
    name: 'getNetworkEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedUpgrade
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedUpgradeAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'name', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ABIAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'name', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ABIUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'name', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'newAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ContractAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'name', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'oldAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ContractUpgraded',
  },
  {
    type: 'function',
    inputs: [
      { name: '_type', internalType: 'string', type: 'string' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_contractAbi', internalType: 'string', type: 'string' },
      { name: '_contractAddress', internalType: 'address', type: 'address' },
    ],
    name: 'upgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAONodeTrustedUpgradeInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoNodeTrustedUpgradeInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_type', internalType: 'string', type: 'string' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_contractAbi', internalType: 'string', type: 'string' },
      { name: '_contractAddress', internalType: 'address', type: 'address' },
    ],
    name: 'upgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProposal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProposalAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalDAO',
        internalType: 'string',
        type: 'string',
        indexed: true,
      },
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'canceller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'executer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'supported', internalType: 'bool', type: 'bool', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalVoted',
  },
  {
    type: 'function',
    inputs: [
      { name: '_member', internalType: 'address', type: 'address' },
      { name: '_dao', internalType: 'string', type: 'string' },
      { name: '_message', internalType: 'string', type: 'string' },
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_duration', internalType: 'uint256', type: 'uint256' },
      { name: '_expires', internalType: 'uint256', type: 'uint256' },
      { name: '_votesRequired', internalType: 'uint256', type: 'uint256' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'add',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_member', internalType: 'address', type: 'address' },
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getCancelled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getCreated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getDAO',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getEnd',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getExecuted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getExpires',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getMessage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getPayload',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptHasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptSupported',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getState',
    outputs: [
      {
        name: '',
        internalType: 'enum RocketDAOProposalInterface.ProposalState',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotesAgainst',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotesFor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotesRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_member', internalType: 'address', type: 'address' },
      { name: '_votes', internalType: 'uint256', type: 'uint256' },
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_support', internalType: 'bool', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProposalInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProposalInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_member', internalType: 'address', type: 'address' },
      { name: '_dao', internalType: 'string', type: 'string' },
      { name: '_message', internalType: 'string', type: 'string' },
      { name: '_startBlock', internalType: 'uint256', type: 'uint256' },
      { name: '_durationBlocks', internalType: 'uint256', type: 'uint256' },
      { name: '_expiresBlocks', internalType: 'uint256', type: 'uint256' },
      { name: '_votesRequired', internalType: 'uint256', type: 'uint256' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'add',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_member', internalType: 'address', type: 'address' },
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getCancelled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getCreated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getDAO',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getEnd',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getExecuted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getExpires',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getMessage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getPayload',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptHasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptSupported',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getState',
    outputs: [
      {
        name: '',
        internalType: 'enum RocketDAOProposalInterface.ProposalState',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotesAgainst',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotesFor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotesRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_member', internalType: 'address', type: 'address' },
      { name: '_votes', internalType: 'uint256', type: 'uint256' },
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_support', internalType: 'bool', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocol
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapDisabled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'memberAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapSecurityInvite',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'memberAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapSecurityKick',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settingContractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'settingPath',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapSettingAddress',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settingContractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'settingPath',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'value', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapSettingBool',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'trustedNodePercent',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'protocolPercent',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'nodePercent',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapSettingClaimers',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'settingPaths',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'types',
        internalType: 'enum SettingType[]',
        type: 'uint8[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapSettingMulti',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settingContractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'settingPath',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapSettingUint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'invoiceID',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'recipientAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapSpendTreasury',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'contractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'recipientAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amountPerPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'periodLength',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'startTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'numPeriods',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapTreasuryNewContract',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'contractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'recipientAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amountPerPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'periodLength',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'numPeriods',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BootstrapTreasuryUpdateContract',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_confirmDisableBootstrapMode',
        internalType: 'bool',
        type: 'bool',
      },
    ],
    name: 'bootstrapDisable',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapSecurityInvite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapSecurityKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'bootstrapSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodePercent', internalType: 'uint256', type: 'uint256' },
      { name: '_protocolPercent', internalType: 'uint256', type: 'uint256' },
      { name: '_nodePercent', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingClaimers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
      },
      { name: '_settingPaths', internalType: 'string[]', type: 'string[]' },
      { name: '_types', internalType: 'enum SettingType[]', type: 'uint8[]' },
      { name: '_values', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'bootstrapSettingMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSpendTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapTreasuryNewContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapTreasuryUpdateContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBootstrapModeDisabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberLastProposalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolActionsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: '_confirmDisableBootstrapMode',
        internalType: 'bool',
        type: 'bool',
      },
    ],
    name: 'bootstrapDisable',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapSecurityInvite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapSecurityKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'bootstrapSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodePerc', internalType: 'uint256', type: 'uint256' },
      { name: '_protocolPerc', internalType: 'uint256', type: 'uint256' },
      { name: '_nodePerc', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingClaimers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
      },
      { name: '_settingPaths', internalType: 'string[]', type: 'string[]' },
      { name: '_types', internalType: 'enum SettingType[]', type: 'uint8[]' },
      { name: '_values', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'bootstrapSettingMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSpendTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapTreasuryNewContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapTreasuryUpdateContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBootstrapModeDisabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberLastProposalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: '_confirmDisableBootstrapMode',
        internalType: 'bool',
        type: 'bool',
      },
    ],
    name: 'bootstrapDisable',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'bootstrapSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_perc', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
      },
      { name: '_settingPaths', internalType: 'string[]', type: 'string[]' },
      { name: '_types', internalType: 'enum SettingType[]', type: 'uint8[]' },
      { name: '_values', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'bootstrapSettingMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSpendTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBootstrapModeDisabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_confirmDisableBootstrapMode',
        internalType: 'bool',
        type: 'bool',
      },
    ],
    name: 'bootstrapDisable',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'bootstrapSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'bootstrapSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_perc', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
      },
      { name: '_settingPaths', internalType: 'string[]', type: 'string[]' },
      { name: '_types', internalType: 'enum SettingType[]', type: 'uint8[]' },
      { name: '_values', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'bootstrapSettingMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bootstrapSpendTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBootstrapModeDisabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolProposal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolProposalAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalDestroyed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'executer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'executer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalFinalised',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'votingPower',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalVoteOverridden',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'direction',
        internalType: 'enum RocketDAOProtocolProposalInterface.VoteDirection',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'votingPower',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalVoted',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'destroy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'finalise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getCreated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getDestroyed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getExecuted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getExpires',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getFinalised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getMessage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getPayload',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getPhase1End',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getPhase2End',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalVetoQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptDirection',
    outputs: [
      {
        name: '',
        internalType: 'enum RocketDAOProtocolProposalInterface.VoteDirection',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptHasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getState',
    outputs: [
      {
        name: '',
        internalType: 'enum RocketDAOProtocolProposalInterface.ProposalState',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVetoQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVetoed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerAbstained',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerAgainst',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerFor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerVeto',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      {
        name: '_voteDirection',
        internalType: 'enum RocketDAOProtocolProposalInterface.VoteDirection',
        type: 'uint8',
      },
    ],
    name: 'overrideVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalMessage', internalType: 'string', type: 'string' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_blockNumber', internalType: 'uint32', type: 'uint32' },
      {
        name: '_treeNodes',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      {
        name: '_voteDirection',
        internalType: 'enum RocketDAOProtocolProposalInterface.VoteDirection',
        type: 'uint8',
      },
      { name: '_votingPower', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeIndex', internalType: 'uint256', type: 'uint256' },
      {
        name: '_witness',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolProposalInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolProposalInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'destroy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'finalise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getCreated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getDestroyed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getExecuted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getExpires',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getFinalised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getMessage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getPayload',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getPhase1End',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getPhase2End',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalVetoQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptDirection',
    outputs: [
      {
        name: '',
        internalType: 'enum RocketDAOProtocolProposalInterface.VoteDirection',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReceiptHasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getState',
    outputs: [
      {
        name: '',
        internalType: 'enum RocketDAOProtocolProposalInterface.ProposalState',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVetoQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVetoed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerAbstained',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerAgainst',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerFor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getVotingPowerVeto',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      {
        name: '_voteDirection',
        internalType: 'enum RocketDAOProtocolProposalInterface.VoteDirection',
        type: 'uint8',
      },
    ],
    name: 'overrideVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalMessage', internalType: 'string', type: 'string' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_blockNumber', internalType: 'uint32', type: 'uint32' },
      {
        name: '_treeNodes',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      {
        name: '_vote',
        internalType: 'enum RocketDAOProtocolProposalInterface.VoteDirection',
        type: 'uint8',
      },
      { name: '_votingPower', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeIndex', internalType: 'uint256', type: 'uint256' },
      {
        name: '_witness',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolProposals
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolProposalsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'memberAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalSecurityInvite',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'memberAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalSecurityKick',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'memberAddresses',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalSecurityKickMulti',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'existingMemberAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newMemberId',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'newMemberAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalSecurityReplace',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settingContractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'settingPath',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalSettingAddress',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settingContractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'settingPath',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'value', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalSettingBool',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'trustedNodePercent',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'protocolPercent',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'nodePercent',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalSettingRewardsClaimers',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'settingContractName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'settingPath',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalSettingUint',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSecurityInvite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSecurityKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_memberAddresses',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'proposalSecurityKickMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_existingMemberAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_newMemberId', internalType: 'string', type: 'string' },
      { name: '_newMemberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSecurityReplace',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'proposalSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
      },
      { name: '_settingPaths', internalType: 'string[]', type: 'string[]' },
      { name: '_types', internalType: 'enum SettingType[]', type: 'uint8[]' },
      { name: '_data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'proposalSettingMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodePercent', internalType: 'uint256', type: 'uint256' },
      { name: '_protocolPercent', internalType: 'uint256', type: 'uint256' },
      { name: '_nodePercent', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingRewardsClaimers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalTreasuryNewContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalTreasuryOneTimeSpend',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalTreasuryUpdateContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolProposalsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolProposalsInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSecurityInvite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSecurityKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_memberAddresses',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'proposalSecurityKickMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_existingMemberAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_newMemberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSecurityReplace',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'proposalSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
      },
      { name: '_settingPaths', internalType: 'string[]', type: 'string[]' },
      { name: '_types', internalType: 'enum SettingType[]', type: 'uint8[]' },
      { name: '_data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'proposalSettingMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodePercent', internalType: 'uint256', type: 'uint256' },
      { name: '_protocolPercent', internalType: 'uint256', type: 'uint256' },
      { name: '_nodePercent', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingRewardsClaimers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalTreasuryNewContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalTreasuryOneTimeSpend',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amountPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: '_periodLength', internalType: 'uint256', type: 'uint256' },
      { name: '_numPeriods', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalTreasuryUpdateContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolProposalsInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolProposalsInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'proposalSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
      },
      { name: '_settingPaths', internalType: 'string[]', type: 'string[]' },
      { name: '_types', internalType: 'enum SettingType[]', type: 'uint8[]' },
      { name: '_data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'proposalSettingMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_perc', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingRewardsClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSpendTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolProposalsOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolProposalsOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'proposalSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settingContractNames',
        internalType: 'string[]',
        type: 'string[]',
      },
      { name: '_settingPaths', internalType: 'string[]', type: 'string[]' },
      { name: '_types', internalType: 'enum SettingType[]', type: 'uint8[]' },
      { name: '_data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'proposalSettingMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_perc', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingRewardsClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_invoiceID', internalType: 'string', type: 'string' },
      { name: '_recipientAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSpendTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsAbi = [
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsAuction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsAuctionAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBidOnLotEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCreateLotEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotMaximumEthValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotMinimumEthValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReservePriceRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStartingPriceRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsAuctionInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsAuctionInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getBidOnLotEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCreateLotEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotMaximumEthValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotMinimumEthValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReservePriceRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStartingPriceRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsAuctionOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsAuctionOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBidOnLotEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCreateLotEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotMaximumEthValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLotMinimumEthValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReservePriceRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStartingPriceRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsDeposit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsDepositAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAssignDepositsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositAssignments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositPoolSize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositSocialisedAssignments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsDepositInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsDepositInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getAssignDepositsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositAssignments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositPoolSize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositSocialisedAssignments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsDepositOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsDepositOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAssignDepositsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositAssignments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositPoolSize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositSocialisedAssignments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsInflation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsInflationAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalStartTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsInflationInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsInflationInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalStartTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsInflationOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsInflationOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalStartTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsMinipool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsMinipoolAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBondReductionEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'getDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFullDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getHalfDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLaunchBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLaunchTimeout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreLaunchValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitWithdrawableEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributeWindowLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributeWindowStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVariableDepositAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_time', internalType: 'uint256', type: 'uint256' }],
    name: 'hasUserDistributeWindowPassed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_time', internalType: 'uint256', type: 'uint256' }],
    name: 'isWithinUserDistributeWindow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsMinipoolInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsMinipoolInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getBondReductionEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'getDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFullDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getHalfDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLaunchBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLaunchTimeout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreLaunchValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitWithdrawableEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributeWindowLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributeWindowStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVariableDepositAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_time', internalType: 'uint256', type: 'uint256' }],
    name: 'hasUserDistributeWindowPassed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_time', internalType: 'uint256', type: 'uint256' }],
    name: 'isWithinUserDistributeWindow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsMinipoolOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsMinipoolOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBondReductionEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'getDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFullDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getHalfDepositUserAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLaunchBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLaunchTimeout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreLaunchValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitWithdrawableEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributeWindowLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributeWindowStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVariableDepositAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_time', internalType: 'uint256', type: 'uint256' }],
    name: 'hasUserDistributeWindowPassed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_time', internalType: 'uint256', type: 'uint256' }],
    name: 'isWithinUserDistributeWindow',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsNetwork
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsNetworkAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeConsensusThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFeeDemandRange',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodePenaltyThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPerPenaltyRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRethDepositDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitBalancesEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitBalancesFrequency',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitPricesEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitPricesFrequency',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitRewardsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetRethCollateralRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsNetworkInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsNetworkInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeConsensusThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFeeDemandRange',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodePenaltyThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPerPenaltyRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRethDepositDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitBalancesEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitBalancesFrequency',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitPricesEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitPricesFrequency',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitRewardsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetRethCollateralRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsNetworkInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsNetworkInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeConsensusThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFeeDemandRange',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodePenaltyThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPerPenaltyRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRethDepositDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitBalancesEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitBalancesFrequency',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitPricesEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitPricesFrequency',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitRewardsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetRethCollateralRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsNetworkOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsNetworkOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeConsensusThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFeeDemandRange',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodePenaltyThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPerPenaltyRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRethDepositDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitBalancesEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitBalancesFrequency',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitPricesEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitPricesFrequency',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSubmitRewardsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetRethCollateralRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsNode
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsNodeAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumPerMinipoolStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumPerMinipoolStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRegistrationEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSmoothingPoolRegistrationEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacantMinipoolsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsNodeInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsNodeInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getDepositEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumPerMinipoolStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinimumPerMinipoolStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRegistrationEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSmoothingPoolRegistrationEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacantMinipoolsEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsProposals
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsProposalsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChallengeBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChallengePeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExecuteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalMaxBlockAge',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalVetoQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoteDelayTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVotePhase1Time',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVotePhase2Time',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsProposalsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsProposalsInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getChallengeBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChallengePeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExecuteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalMaxBlockAge',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalVetoQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoteDelayTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVotePhase1Time',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVotePhase2Time',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsRewards
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsRewardsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimIntervalPeriods',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getRewardsClaimerPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersNodePerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersPerc',
    outputs: [
      { name: 'trustedNodePerc', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolPerc', internalType: 'uint256', type: 'uint256' },
      { name: 'nodePerc', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersProtocolPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersTimeUpdated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersTrustedNodePerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodePercent', internalType: 'uint256', type: 'uint256' },
      { name: '_protocolPercent', internalType: 'uint256', type: 'uint256' },
      { name: '_nodePercent', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingRewardsClaimers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsRewardsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsRewardsInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimIntervalPeriods',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getRewardsClaimerPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersNodePerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersPerc',
    outputs: [
      { name: '_trustedNodePercent', internalType: 'uint256', type: 'uint256' },
      { name: '_protocolPercent', internalType: 'uint256', type: 'uint256' },
      { name: '_nodePercent', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersProtocolPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersTimeUpdated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersTrustedNodePerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodePercent', internalType: 'uint256', type: 'uint256' },
      { name: '_protocolPercent', internalType: 'uint256', type: 'uint256' },
      { name: '_nodePercent', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingRewardsClaimers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsRewardsInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsRewardsInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getRewardsClaimerPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getRewardsClaimerPercTimeUpdated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersPercTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_perc', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingRewardsClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsRewardsOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsRewardsOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getRewardsClaimerPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_contractName', internalType: 'string', type: 'string' }],
    name: 'getRewardsClaimerPercTimeUpdated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardsClaimersPercTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_perc', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingRewardsClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsSecurity
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsSecurityAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExecuteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLeaveTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_settingPath', internalType: 'string', type: 'string' }],
    name: 'getSettingUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolSettingsSecurityInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolSettingsSecurityInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getActionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExecuteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLeaveTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoteTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolVerifier
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolVerifierAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'challenger',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ChallengeSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalID',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalBondBurned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'blockNumber',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'root',
        internalType: 'struct Types.Node',
        type: 'tuple',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
        indexed: false,
      },
      {
        name: 'treeNodes',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RootSubmitted',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'burnProposalBond',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_indices', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'claimBondChallenger',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_indices', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'claimBondProposer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
      {
        name: '_node',
        internalType: 'struct Types.Node',
        type: 'tuple',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      {
        name: '_witness',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'createChallenge',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'defeatProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getChallengeBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getChallengePeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getChallengeState',
    outputs: [
      { name: '', internalType: 'enum Types.ChallengeState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getDefeatIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepthPerRound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNode',
    outputs: [
      {
        name: '',
        internalType: 'struct Types.Node',
        type: 'tuple',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_proposer', internalType: 'address', type: 'address' },
      { name: '_blockNumber', internalType: 'uint32', type: 'uint32' },
      {
        name: '_treeNodes',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'submitProposalRoot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
      {
        name: '_nodes',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'submitRoot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_voter', internalType: 'address', type: 'address' },
      { name: '_nodeIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_votingPower', internalType: 'uint256', type: 'uint256' },
      {
        name: '_witness',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'verifyVote',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOProtocolVerifierInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoProtocolVerifierInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'burnProposalBond',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
      {
        name: '_node',
        internalType: 'struct Types.Node',
        type: 'tuple',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      {
        name: '_witness',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'createChallenge',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getChallengeBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getChallengePeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getChallengeState',
    outputs: [
      { name: '', internalType: 'enum Types.ChallengeState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getDefeatIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepthPerRound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalId', internalType: 'uint256', type: 'uint256' },
      { name: '_proposer', internalType: 'address', type: 'address' },
      { name: '_blockNumber', internalType: 'uint32', type: 'uint32' },
      {
        name: '_treeNodes',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'submitProposalRoot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'propId', internalType: 'uint256', type: 'uint256' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      {
        name: 'nodes',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'submitRoot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_voter', internalType: 'address', type: 'address' },
      { name: '_nodeIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_votingPower', internalType: 'uint256', type: 'uint256' },
      {
        name: '_witness',
        internalType: 'struct Types.Node[]',
        type: 'tuple[]',
        components: [
          { name: 'sum', internalType: 'uint256', type: 'uint256' },
          { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'verifyVote',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOSecurity
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoSecurityAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMemberAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberID',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberIsValid',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberJoinedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalType', internalType: 'string', type: 'string' },
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberProposalExecutedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberQuorumVotesRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOSecurityActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoSecurityActionsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionJoined',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionKick',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionLeave',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActionRequestLeave',
  },
  {
    type: 'function',
    inputs: [],
    name: 'actionJoin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'actionKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_memberAddresses',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'actionKickMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'actionLeave',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'actionRequestLeave',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOSecurityActionsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoSecurityActionsInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'actionJoin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'actionKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddresses', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'actionKickMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'actionLeave',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'actionRequestLeave',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOSecurityInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoSecurityInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMemberAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberID',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberIsValid',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberJoinedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalType', internalType: 'string', type: 'string' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMemberProposalExecutedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMemberQuorumVotesRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOSecurityProposals
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoSecurityProposalsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalInvite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_memberAddresses',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'proposalKickMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_existingMemberAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_newMemberId', internalType: 'string', type: 'string' },
      { name: '_newMemberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalReplace',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingNameSpace', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingNameSpace', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'proposalSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingNameSpace', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalMessage', internalType: 'string', type: 'string' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_support', internalType: 'bool', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDAOSecurityProposalsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDaoSecurityProposalsInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalID', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'string', type: 'string' },
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalInvite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_memberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalKick',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_memberAddresses',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'proposalKickMulti',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_existingMemberAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_newMemberId', internalType: 'string', type: 'string' },
      { name: '_newMemberAddress', internalType: 'address', type: 'address' },
    ],
    name: 'proposalReplace',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'proposalSettingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'proposalSettingBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_settingContractName', internalType: 'string', type: 'string' },
      { name: '_settingPath', internalType: 'string', type: 'string' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposalSettingUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalMessage', internalType: 'string', type: 'string' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalID', internalType: 'uint256', type: 'uint256' },
      { name: '_support', internalType: 'bool', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDepositPool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDepositPoolAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositAssigned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositRecycled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExcessWithdrawn',
  },
  {
    type: 'function',
    inputs: [],
    name: 'assignDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExcessBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserBalance',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maybeAssignDeposits',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'nodeCreditWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_totalAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'nodeDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'receiveVaultWithdrawalETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recycleDissolvedDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recycleExcessCollateral',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recycleLiquidatedStake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawExcessBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketDepositPoolInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketDepositPoolInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'assignDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExcessBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaximumDepositAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserBalance',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maybeAssignDeposits',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'nodeCreditWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_totalAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'nodeDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recycleDissolvedDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recycleExcessCollateral',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recycleLiquidatedStake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawExcessBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMerkleDistributorMainnet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMerkleDistributorMainnetAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rewardIndex',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amountRPL',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amountETH',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'RewardsClaimed',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
      { name: '_stakeAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimAndStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disableMock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_claimer', internalType: 'address', type: 'address' },
    ],
    name: 'isClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isMocking',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'receiveVaultWithdrawalETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_root', internalType: 'bytes32', type: 'bytes32' },
      { name: '_rewardsRPL', internalType: 'uint256', type: 'uint256' },
      { name: '_rewardsETH', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'relayRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketTokenRPLKey',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketVaultKey',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'useMock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMerkleDistributorMainnetOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMerkleDistributorMainnetOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rewardIndex',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amountRPL',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amountETH',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'RewardsClaimed',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
      { name: '_stakeAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimAndStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_claimer', internalType: 'address', type: 'address' },
    ],
    name: 'isClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'receiveVaultWithdrawalETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_root', internalType: 'bytes32', type: 'bytes32' },
      { name: '_rewardsRPL', internalType: 'uint256', type: 'uint256' },
      { name: '_rewardsETH', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'relayRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolBase
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolBaseAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldDelegate',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newDelegate',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateRolledBack',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldDelegate',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newDelegate',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherReceived',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'delegateRollback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'delegateUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEffectiveDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreviousDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUseLatestDelegate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rocketStorage', internalType: 'address', type: 'address' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_setting', internalType: 'bool', type: 'bool' }],
    name: 'setUseLatestDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolBaseInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolBaseInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'delegateRollback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'delegateUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEffectiveDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreviousDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUseLatestDelegate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rocketStorage', internalType: 'address', type: 'address' },
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_setting', internalType: 'bool', type: 'bool' }],
    name: 'setUseLatestDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolBondReducer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolBondReducerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newBondAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BeginBondReduction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CancelReductionVoted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReductionCancelled',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_newBondAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'beginReduceBondAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'canReduceBondAmount',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getLastBondReductionPrevNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getLastBondReductionPrevValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getLastBondReductionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReduceBondCancelled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReduceBondTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReduceBondValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reduceBondAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'voteCancelReduction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolBondReducerInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolBondReducerInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_newBondAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'beginReduceBondAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'canReduceBondAmount',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getLastBondReductionPrevNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getLastBondReductionPrevValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getLastBondReductionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReduceBondCancelled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReduceBondTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getReduceBondValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reduceBondAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'voteCancelReduction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolDelegate
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolDelegateAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousBondAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newBondAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondReduced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherDeposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executed',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nodeAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'userAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherWithdrawalProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'validatorPubkey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'validatorSignature',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'depositDataRoot',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'withdrawalCredentials',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolPrestaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolPromoted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolScrubbed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'bondAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'currentBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolVacancyPrepared',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ScrubVoted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'status', internalType: 'uint8', type: 'uint8', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StatusUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'beginUserDistribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_balance', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateNodeShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_balance', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateUserShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canPromote',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canStake',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dissolve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_rewardsOnly', internalType: 'bool', type: 'bool' }],
    name: 'distributeBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositType',
    outputs: [
      { name: '', internalType: 'enum MinipoolDeposit', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFinalised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDepositAssigned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDepositBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeRefundBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeTopUpValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreLaunchValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreMigrationBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_member', internalType: 'address', type: 'address' }],
    name: 'getScrubVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatus',
    outputs: [{ name: '', internalType: 'enum MinipoolStatus', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatusBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatusTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalScrubVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositAssigned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositAssignedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacant',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondValue', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'preDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'prepareVacancy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'promote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reduceBondAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userDistributeAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteScrub',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deployContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getExpectedAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolFactoryInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolFactoryInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deployContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getExpectedAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'beginUserDistribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_balance', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateNodeShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_balance', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateUserShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canPromote',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canStake',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dissolve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_rewardsOnly', internalType: 'bool', type: 'bool' }],
    name: 'distributeBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositType',
    outputs: [
      { name: '', internalType: 'enum MinipoolDeposit', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFinalised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDepositAssigned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDepositBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeRefundBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeTopUpValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreLaunchValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPreMigrationBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_member', internalType: 'address', type: 'address' }],
    name: 'getScrubVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatus',
    outputs: [{ name: '', internalType: 'enum MinipoolStatus', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatusBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStatusTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalScrubVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositAssigned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositAssignedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDepositBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserDistributed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacant',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondingValue', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'preDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'prepareVacancy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'promote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reduceBondAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userDistributeAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteScrub',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BeginBondReduction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CancelReductionVoted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolDestroyed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReductionCancelled',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createMinipool',
    outputs: [
      {
        name: '',
        internalType: 'contract RocketMinipoolInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [
      {
        name: '',
        internalType: 'contract RocketMinipoolInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'decrementNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'destroyMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActiveMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFinalisedMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'getMinipoolByPubkey',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMinipoolCountPerStatus',
    outputs: [
      { name: 'initialisedCount', internalType: 'uint256', type: 'uint256' },
      { name: 'prelaunchCount', internalType: 'uint256', type: 'uint256' },
      { name: 'stakingCount', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawableCount', internalType: 'uint256', type: 'uint256' },
      { name: 'dissolvedCount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolDepositType',
    outputs: [
      { name: '', internalType: 'enum MinipoolDeposit', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolDestroyed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolPubkey',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolRPLSlashed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolWithdrawalCredentials',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeActiveMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeFinalisedMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeStakingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_depositSize', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeStakingMinipoolCountBySize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeValidatingMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeValidatingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPrelaunchMinipools',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getVacantMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacantMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementNodeFinalisedMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removeVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'setMinipoolPubkey',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'tryDistribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_previousBond', internalType: 'uint256', type: 'uint256' },
      { name: '_newBond', internalType: 'uint256', type: 'uint256' },
      { name: '_previousFee', internalType: 'uint256', type: 'uint256' },
      { name: '_newFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolManagerInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolManagerInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createMinipool',
    outputs: [
      {
        name: '',
        internalType: 'contract RocketMinipoolInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [
      {
        name: '',
        internalType: 'contract RocketMinipoolInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'decrementNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'destroyMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActiveMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFinalisedMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'getMinipoolByPubkey',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMinipoolCountPerStatus',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolDepositType',
    outputs: [
      { name: '', internalType: 'enum MinipoolDeposit', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolDestroyed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolPubkey',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolRPLSlashed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolWithdrawalCredentials',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeActiveMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeFinalisedMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeStakingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_depositSize', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeStakingMinipoolCountBySize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeValidatingMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeValidatingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPrelaunchMinipools',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getVacantMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacantMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementNodeFinalisedMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removeVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'setMinipoolPubkey',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'tryDistribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_previousBond', internalType: 'uint256', type: 'uint256' },
      { name: '_newBond', internalType: 'uint256', type: 'uint256' },
      { name: '_previousFee', internalType: 'uint256', type: 'uint256' },
      { name: '_newFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolManagerInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolManagerInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createMinipool',
    outputs: [
      {
        name: '',
        internalType: 'contract RocketMinipoolInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [
      {
        name: '',
        internalType: 'contract RocketMinipoolInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'decrementNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'destroyMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActiveMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFinalisedMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'getMinipoolByPubkey',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMinipoolCountPerStatus',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolDepositType',
    outputs: [
      { name: '', internalType: 'enum MinipoolDeposit', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolDestroyed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolPubkey',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolRPLSlashed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolWithdrawalCredentials',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeActiveMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeFinalisedMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeStakingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_depositSize', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeStakingMinipoolCountBySize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeValidatingMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeValidatingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPrelaunchMinipools',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getVacantMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacantMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementNodeFinalisedMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removeVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'setMinipoolPubkey',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_previousBond', internalType: 'uint256', type: 'uint256' },
      { name: '_newBond', internalType: 'uint256', type: 'uint256' },
      { name: '_previousFee', internalType: 'uint256', type: 'uint256' },
      { name: '_newFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolManagerOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolManagerOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BeginBondReduction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CancelReductionVoted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolDestroyed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReductionCancelled',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createMinipool',
    outputs: [
      {
        name: '',
        internalType: 'contract RocketMinipoolInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [
      {
        name: '',
        internalType: 'contract RocketMinipoolInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'decrementNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'destroyMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActiveMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFinalisedMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'getMinipoolByPubkey',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMinipoolCountPerStatus',
    outputs: [
      { name: 'initialisedCount', internalType: 'uint256', type: 'uint256' },
      { name: 'prelaunchCount', internalType: 'uint256', type: 'uint256' },
      { name: 'stakingCount', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawableCount', internalType: 'uint256', type: 'uint256' },
      { name: 'dissolvedCount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolDepositType',
    outputs: [
      { name: '', internalType: 'enum MinipoolDeposit', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolDestroyed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolPubkey',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolRPLSlashed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMinipoolWithdrawalCredentials',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeActiveMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeFinalisedMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeStakingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_depositSize', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeStakingMinipoolCountBySize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeValidatingMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeValidatingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPrelaunchMinipools',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getVacantMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVacantMinipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementNodeFinalisedMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'incrementNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'removeVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'setMinipoolPubkey',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_previousBond', internalType: 'uint256', type: 'uint256' },
      { name: '_newBond', internalType: 'uint256', type: 'uint256' },
      { name: '_previousFee', internalType: 'uint256', type: 'uint256' },
      { name: '_newFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateNodeStakingMinipoolCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolPenalty
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolPenaltyAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxPenaltyRateUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaxPenaltyRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getPenaltyRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_rate', internalType: 'uint256', type: 'uint256' }],
    name: 'setMaxPenaltyRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_rate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setPenaltyRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolPenaltyInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolPenaltyInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getMaxPenaltyRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getPenaltyRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_rate', internalType: 'uint256', type: 'uint256' }],
    name: 'setMaxPenaltyRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_rate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setPenaltyRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolQueue
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolQueueAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'queueId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolDequeued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'queueId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolEnqueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipool',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'queueId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinipoolRemoved',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'dequeueMinipoolByDepositLegacy',
    outputs: [
      { name: 'minipoolAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maxToDequeue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'dequeueMinipools',
    outputs: [
      { name: 'minipoolAddress', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'enqueueMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContainsLegacy',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEffectiveCapacity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'getLengthLegacy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'getMinipoolPosition',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextCapacityLegacy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextDepositLegacy',
    outputs: [
      { name: '', internalType: 'enum MinipoolDeposit', type: 'uint8' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalCapacity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'removeMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketMinipoolQueueInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketMinipoolQueueInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'dequeueMinipoolByDepositLegacy',
    outputs: [
      { name: 'minipoolAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maxToDequeue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'dequeueMinipools',
    outputs: [
      { name: 'minipoolAddress', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'enqueueMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContainsLegacy',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEffectiveCapacity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'getLengthLegacy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getMinipoolAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'getMinipoolPosition',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextCapacityLegacy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextDepositLegacy',
    outputs: [
      { name: '', internalType: 'enum MinipoolDeposit', type: 'uint8' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalCapacity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositType',
        internalType: 'enum MinipoolDeposit',
        type: 'uint8',
      },
    ],
    name: 'removeMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkBalances
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkBalancesAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'slotTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'stakingEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rethSupply',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'blockTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BalancesSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'slotTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'stakingEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rethSupply',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'blockTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BalancesUpdated',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_totalEth', internalType: 'uint256', type: 'uint256' },
      { name: '_stakingEth', internalType: 'uint256', type: 'uint256' },
      { name: '_rethSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdateBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalancesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getETHUtilizationRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingETHBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalETHBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRETHSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_totalEth', internalType: 'uint256', type: 'uint256' },
      { name: '_stakingEth', internalType: 'uint256', type: 'uint256' },
      { name: '_rethSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkBalancesInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkBalancesInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_totalEth', internalType: 'uint256', type: 'uint256' },
      { name: '_stakingEth', internalType: 'uint256', type: 'uint256' },
      { name: '_rethSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdateBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalancesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getETHUtilizationRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingETHBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalETHBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRETHSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_total', internalType: 'uint256', type: 'uint256' },
      { name: '_staking', internalType: 'uint256', type: 'uint256' },
      { name: '_rethSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkBalancesInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkBalancesInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_totalEth', internalType: 'uint256', type: 'uint256' },
      { name: '_stakingEth', internalType: 'uint256', type: 'uint256' },
      { name: '_rethSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdateBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalancesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getETHUtilizationRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLatestReportableBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingETHBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalETHBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRETHSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_total', internalType: 'uint256', type: 'uint256' },
      { name: '_staking', internalType: 'uint256', type: 'uint256' },
      { name: '_rethSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkBalancesOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkBalancesOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'stakingEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rethSupply',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BalancesSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'stakingEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rethSupply',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BalancesUpdated',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_totalEth', internalType: 'uint256', type: 'uint256' },
      { name: '_stakingEth', internalType: 'uint256', type: 'uint256' },
      { name: '_rethSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdateBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBalancesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getETHUtilizationRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLatestReportableBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingETHBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalETHBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRETHSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_totalEth', internalType: 'uint256', type: 'uint256' },
      { name: '_stakingEth', internalType: 'uint256', type: 'uint256' },
      { name: '_rethSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkFees
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkFeesAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDemand',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_nodeDemand', internalType: 'int256', type: 'int256' }],
    name: 'getNodeFeeByDemand',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkFeesInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkFeesInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getNodeDemand',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_nodeDemand', internalType: 'int256', type: 'int256' }],
    name: 'getNodeFeeByDemand',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkPenalties
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkPenaltiesAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'minipoolAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PenaltySubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minipoolAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'penalty',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PenaltyUpdated',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdatePenalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getPenaltyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitPenalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkPenaltiesInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkPenaltiesInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdatePenalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getPenaltyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_minipoolAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitPenalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkPrices
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkPricesAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rplPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PricesSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_slotTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rplPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PricesUpdated',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdatePrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPricesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitPrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkPricesInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkPricesInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdatePrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPricesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_slotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitPrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkPricesInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkPricesInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdatePrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLatestReportableBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPricesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitPrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkPricesOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkPricesOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rplPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PricesSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'block',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rplPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PricesUpdated',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeUpdatePrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLatestReportableBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPricesBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_block', internalType: 'uint256', type: 'uint256' },
      { name: '_rplPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'submitPrices',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkSnapshots
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkSnapshotsAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'latest',
    outputs: [
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'uint224', type: 'uint224' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'latestBlock',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'latestValue',
    outputs: [{ name: '', internalType: 'uint224', type: 'uint224' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'length',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'lookup',
    outputs: [{ name: '', internalType: 'uint224', type: 'uint224' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
      { name: '_recency', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lookupRecent',
    outputs: [{ name: '', internalType: 'uint224', type: 'uint224' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
      { name: '_value', internalType: 'uint224', type: 'uint224' },
    ],
    name: 'push',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkSnapshotsInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkSnapshotsInterfaceAbi = [
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'latest',
    outputs: [
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'uint224', type: 'uint224' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'latestBlock',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'latestValue',
    outputs: [{ name: '', internalType: 'uint224', type: 'uint224' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'length',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'lookup',
    outputs: [{ name: '', internalType: 'uint224', type: 'uint224' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
      { name: '_recency', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lookupRecent',
    outputs: [{ name: '', internalType: 'uint224', type: 'uint224' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
      { name: '_value', internalType: 'uint224', type: 'uint224' },
    ],
    name: 'push',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkVoting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkVotingAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateSet',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getCurrentDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'getDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_block', internalType: 'uint32', type: 'uint32' }],
    name: 'getNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getVotingInitialised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'getVotingPower',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialiseVoting',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newDelegate', internalType: 'address', type: 'address' },
    ],
    name: 'setDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNetworkVotingInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNetworkVotingInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getCurrentDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'getDelegate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_block', internalType: 'uint32', type: 'uint32' }],
    name: 'getNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getVotingInitialised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'getVotingPower',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialiseVoting',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newDelegate', internalType: 'address', type: 'address' },
    ],
    name: 'setDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDeposit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDepositAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositFor',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawal',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'depositEthFor',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'depositWithCredit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositAmounts',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeCreditAndBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDepositCredit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeEthBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeUsableCredit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeUsableCreditAndBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseDepositCreditBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseEthMatched',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'isValidDepositAmount',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'receiveVaultWithdrawalETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDepositInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDepositInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_depositAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'depositEthFor',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_depositAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'depositWithCredit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositAmounts',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeCreditAndBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDepositCredit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeEthBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeUsableCredit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeUsableCreditAndBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseDepositCreditBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseEthMatched',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'isValidDepositAmount',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDepositInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDepositInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_depositAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_depositAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'depositWithCredit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositAmounts',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDepositCredit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseDepositCreditBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseEthMatched',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'isValidDepositAmount',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDepositLEB4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDepositLeb4Abi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositFor',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawal',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'depositEthFor',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'depositWithCredit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositAmounts',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeCreditAndBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDepositCredit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeEthBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeUsableCredit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeUsableCreditAndBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseDepositCreditBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseEthMatched',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'isValidDepositAmount',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDepositOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDepositOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositReceived',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_currentBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createVacantMinipool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bondAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_minimumNodeFee', internalType: 'uint256', type: 'uint256' },
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'uint256', type: 'uint256' },
      {
        name: '_expectedMinipoolAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'depositWithCredit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositAmounts',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDepositCredit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseDepositCreditBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseEthMatched',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'isValidDepositAmount',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDistributor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDistributorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_rocketStorage', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'fallback', stateMutability: 'payable' },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDistributorDelegate
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDistributorDelegateAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_nodeAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_userAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_nodeAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FeesDistributed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'distribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDistributorFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDistributorFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_address',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ProxyCreated',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'createProxy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getProxyAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProxyBytecode',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDistributorFactoryInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDistributorFactoryInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'createProxy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getProxyAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProxyBytecode',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeDistributorInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeDistributorInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'distribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUserShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'withdrawalAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeRPLWithdrawalAddressSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeRPLWithdrawalAddressUnset',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'network',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeRewardNetworkChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      { name: 'state', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'NodeSmoothingPoolStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeTimezoneLocationSet',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'confirmRPLWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getAverageNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getFeeDistributorInitialised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeAddresses',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getNodeAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeCountPerTimezone',
    outputs: [
      {
        name: '',
        internalType: 'struct RocketNodeManagerInterface.TimezoneCount[]',
        type: 'tuple[]',
        components: [
          { name: 'timezone', internalType: 'string', type: 'string' },
          { name: 'count', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDetails',
    outputs: [
      {
        name: 'nodeDetails',
        internalType: 'struct NodeDetails',
        type: 'tuple',
        components: [
          { name: 'exists', internalType: 'bool', type: 'bool' },
          {
            name: 'registrationTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'timezoneLocation', internalType: 'string', type: 'string' },
          {
            name: 'feeDistributorInitialised',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'feeDistributorAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rewardNetwork', internalType: 'uint256', type: 'uint256' },
          { name: 'rplStake', internalType: 'uint256', type: 'uint256' },
          {
            name: 'effectiveRPLStake',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minimumRPLStake', internalType: 'uint256', type: 'uint256' },
          { name: 'maximumRPLStake', internalType: 'uint256', type: 'uint256' },
          { name: 'ethMatched', internalType: 'uint256', type: 'uint256' },
          { name: 'ethMatchedLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'minipoolCount', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceETH', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceRETH', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceRPL', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceOldRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'depositCreditBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributorBalanceUserETH',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributorBalanceNodeETH',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'withdrawalAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'pendingWithdrawalAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'smoothingPoolRegistrationState',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'smoothingPoolRegistrationChanged',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'nodeAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodePendingRPLWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodePendingWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLWithdrawalAddressIsSet',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRegistrationTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeTimezoneLocation',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getRewardNetwork',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getSmoothingPoolRegisteredNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationChanged',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationState',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialiseFeeDistributor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'registerNode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_newRPLWithdrawalAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_confirm', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRPLWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_network', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setRewardNetwork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_state', internalType: 'bool', type: 'bool' }],
    name: 'setSmoothingPoolRegistrationState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'setTimezoneLocation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'unsetRPLWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeManagerInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeManagerInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'confirmRPLWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getAverageNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getFeeDistributorInitialised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeAddresses',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getNodeAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeCountPerTimezone',
    outputs: [
      {
        name: '',
        internalType: 'struct RocketNodeManagerInterface.TimezoneCount[]',
        type: 'tuple[]',
        components: [
          { name: 'timezone', internalType: 'string', type: 'string' },
          { name: 'count', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDetails',
    outputs: [
      {
        name: '',
        internalType: 'struct NodeDetails',
        type: 'tuple',
        components: [
          { name: 'exists', internalType: 'bool', type: 'bool' },
          {
            name: 'registrationTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'timezoneLocation', internalType: 'string', type: 'string' },
          {
            name: 'feeDistributorInitialised',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'feeDistributorAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rewardNetwork', internalType: 'uint256', type: 'uint256' },
          { name: 'rplStake', internalType: 'uint256', type: 'uint256' },
          {
            name: 'effectiveRPLStake',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minimumRPLStake', internalType: 'uint256', type: 'uint256' },
          { name: 'maximumRPLStake', internalType: 'uint256', type: 'uint256' },
          { name: 'ethMatched', internalType: 'uint256', type: 'uint256' },
          { name: 'ethMatchedLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'minipoolCount', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceETH', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceRETH', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceRPL', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceOldRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'depositCreditBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributorBalanceUserETH',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributorBalanceNodeETH',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'withdrawalAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'pendingWithdrawalAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'smoothingPoolRegistrationState',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'smoothingPoolRegistrationChanged',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'nodeAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodePendingRPLWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodePendingWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLWithdrawalAddressIsSet',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRegistrationTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeTimezoneLocation',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getRewardNetwork',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getSmoothingPoolRegisteredNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationChanged',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationState',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialiseFeeDistributor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'registerNode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_newRPLWithdrawalAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_confirm', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRPLWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: 'network', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setRewardNetwork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_state', internalType: 'bool', type: 'bool' }],
    name: 'setSmoothingPoolRegistrationState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'setTimezoneLocation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'unsetRPLWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeManagerInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeManagerInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getAverageNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getFeeDistributorInitialised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeAddresses',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getNodeAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeCountPerTimezone',
    outputs: [
      {
        name: '',
        internalType: 'struct RocketNodeManagerInterfaceOld.TimezoneCount[]',
        type: 'tuple[]',
        components: [
          { name: 'timezone', internalType: 'string', type: 'string' },
          { name: 'count', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDetails',
    outputs: [
      {
        name: '',
        internalType: 'struct NodeDetails',
        type: 'tuple',
        components: [
          { name: 'exists', internalType: 'bool', type: 'bool' },
          {
            name: 'registrationTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'timezoneLocation', internalType: 'string', type: 'string' },
          {
            name: 'feeDistributorInitialised',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'feeDistributorAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rewardNetwork', internalType: 'uint256', type: 'uint256' },
          { name: 'rplStake', internalType: 'uint256', type: 'uint256' },
          {
            name: 'effectiveRPLStake',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minimumRPLStake', internalType: 'uint256', type: 'uint256' },
          { name: 'maximumRPLStake', internalType: 'uint256', type: 'uint256' },
          { name: 'ethMatched', internalType: 'uint256', type: 'uint256' },
          { name: 'ethMatchedLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'minipoolCount', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceETH', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceRETH', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceRPL', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceOldRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'depositCreditBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributorBalanceUserETH',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributorBalanceNodeETH',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'withdrawalAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'pendingWithdrawalAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'smoothingPoolRegistrationState',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'smoothingPoolRegistrationChanged',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'nodeAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodePendingWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRegistrationTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeTimezoneLocation',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getRewardNetwork',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getSmoothingPoolRegisteredNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationChanged',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationState',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialiseFeeDistributor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'registerNode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: 'network', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setRewardNetwork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_state', internalType: 'bool', type: 'bool' }],
    name: 'setSmoothingPoolRegistrationState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'setTimezoneLocation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeManagerOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeManagerOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'network',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeRewardNetworkChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      { name: 'state', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'NodeSmoothingPoolStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeTimezoneLocationSet',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getAverageNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getFeeDistributorInitialised',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeAddresses',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_index', internalType: 'uint256', type: 'uint256' }],
    name: 'getNodeAt',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeCountPerTimezone',
    outputs: [
      {
        name: '',
        internalType: 'struct RocketNodeManagerInterfaceOld.TimezoneCount[]',
        type: 'tuple[]',
        components: [
          { name: 'timezone', internalType: 'string', type: 'string' },
          { name: 'count', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeDetails',
    outputs: [
      {
        name: 'nodeDetails',
        internalType: 'struct NodeDetails',
        type: 'tuple',
        components: [
          { name: 'exists', internalType: 'bool', type: 'bool' },
          {
            name: 'registrationTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'timezoneLocation', internalType: 'string', type: 'string' },
          {
            name: 'feeDistributorInitialised',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'feeDistributorAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'rewardNetwork', internalType: 'uint256', type: 'uint256' },
          { name: 'rplStake', internalType: 'uint256', type: 'uint256' },
          {
            name: 'effectiveRPLStake',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minimumRPLStake', internalType: 'uint256', type: 'uint256' },
          { name: 'maximumRPLStake', internalType: 'uint256', type: 'uint256' },
          { name: 'ethMatched', internalType: 'uint256', type: 'uint256' },
          { name: 'ethMatchedLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'minipoolCount', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceETH', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceRETH', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceRPL', internalType: 'uint256', type: 'uint256' },
          { name: 'balanceOldRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'depositCreditBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributorBalanceUserETH',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributorBalanceNodeETH',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'withdrawalAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'pendingWithdrawalAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'smoothingPoolRegistrationState',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'smoothingPoolRegistrationChanged',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'nodeAddress', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodePendingWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRegistrationTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeTimezoneLocation',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getRewardNetwork',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getSmoothingPoolRegisteredNodeCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationChanged',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSmoothingPoolRegistrationState',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialiseFeeDistributor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'registerNode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_network', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setRewardNetwork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_state', internalType: 'bool', type: 'bool' }],
    name: 'setSmoothingPoolRegistrationState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timezoneLocation', internalType: 'string', type: 'string' },
    ],
    name: 'setTimezoneLocation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeStaking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeStakingAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      { name: 'allowed', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLLockingAllowed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'ethValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLSlashed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLStaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'allowed', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeRPLForAllowed',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHCollateralisationRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatchedLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHProvided',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeEffectiveRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMaximumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinimumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStakedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getRPLLockingAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lockRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRPLLockingAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_caller', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setStakeRPLForAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_caller', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setStakeRPLForAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_ethSlashAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'slashRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stakeRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stakeRPLFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'unlockRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeStakingInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeStakingInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHCollateralisationRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatchedLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHProvided',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeEffectiveRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMaximumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinimumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStakedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getRPLLockingAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lockRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRPLLockingAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_caller', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setStakeRPLForAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_caller', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setStakeRPLForAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_ethSlashAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'slashRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stakeRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stakeRPLFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'unlockRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeStakingInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeStakingInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHCollateralisationRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatchedLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHProvided',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeEffectiveRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMaximumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinimumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStakedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_caller', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setStakeRPLForAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_ethSlashAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'slashRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stakeRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stakeRPLFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketNodeStakingOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketNodeStakingOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'ethValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLSlashed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLStaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'allowed', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeRPLForAllowed',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHCollateralisationRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHMatchedLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeETHProvided',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeEffectiveRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMaximumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeMinimumRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeRPLStakedTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRPLStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_caller', internalType: 'address', type: 'address' },
      { name: '_allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setStakeRPLForAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_ethSlashAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'slashRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stakeRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stakeRPLFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawRPL',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketRewardsPool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketRewardsPoolAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rewardIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
      {
        name: 'intervalStartTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'intervalEndTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardSnapshot',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'rewardIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardSnapshotSubmitted',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'executeRewardSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_interval', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIntervalExecutionAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_interval', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIntervalExecutionBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalTimeStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalsPassed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimingContract', internalType: 'string', type: 'string' },
    ],
    name: 'getClaimingContractPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_claimingContracts',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    name: 'getClaimingContractsPerc',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPendingETHRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPendingRPLRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getSubmissionCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getSubmissionFromNodeExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTrustedNodeSubmitted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'submitRewardSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketRewardsPoolInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketRewardsPoolInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'executeRewardSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_interval', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIntervalExecutionAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_interval', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIntervalExecutionBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalTimeStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalsPassed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimingContract', internalType: 'string', type: 'string' },
    ],
    name: 'getClaimingContractPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_claimingContracts',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    name: 'getClaimingContractsPerc',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPendingETHRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPendingRPLRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getSubmissionCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getSubmissionFromNodeExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTrustedNodeSubmitted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'submitRewardSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketRewardsPoolInterfaceOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketRewardsPoolInterfaceOldAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'executeRewardSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_interval', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIntervalExecutionAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_interval', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIntervalExecutionBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalTimeStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalsPassed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimingContract', internalType: 'string', type: 'string' },
    ],
    name: 'getClaimingContractPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_claimingContracts',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    name: 'getClaimingContractsPerc',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPendingETHRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPendingRPLRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getSubmissionCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getSubmissionFromNodeExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTrustedNodeSubmitted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'submitRewardSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketRewardsPoolOld
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketRewardsPoolOldAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rewardIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
      {
        name: 'intervalStartTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'intervalEndTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardSnapshot',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'rewardIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardSnapshotSubmitted',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'executeRewardSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_interval', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIntervalExecutionAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_interval', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIntervalExecutionBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalTimeStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimIntervalsPassed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimingContract', internalType: 'string', type: 'string' },
    ],
    name: 'getClaimingContractPerc',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_claimingContracts',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    name: 'getClaimingContractsPerc',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPendingETHRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPendingRPLRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRPLBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getSubmissionCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getSubmissionFromNodeExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedNodeAddress', internalType: 'address', type: 'address' },
      { name: '_rewardIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTrustedNodeSubmitted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_submission',
        internalType: 'struct RewardSubmission',
        type: 'tuple',
        components: [
          { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'executionBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'consensusBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'merkleTreeCID', internalType: 'string', type: 'string' },
          { name: 'intervalsPassed', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryRPL', internalType: 'uint256', type: 'uint256' },
          {
            name: 'trustedNodeRPL',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'nodeRPL', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'nodeETH', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userETH', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'submitRewardSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketRewardsRelayInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketRewardsRelayInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_intervalIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      { name: '_intervalIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
      { name: '_stakeAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimAndStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_intervalIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_claimer', internalType: 'address', type: 'address' },
    ],
    name: 'isClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_intervalIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_merkleRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_rewardsRPL', internalType: 'uint256', type: 'uint256' },
      { name: '_rewardsETH', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'relayRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketSmoothingPool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketSmoothingPoolAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'string', type: 'string', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherWithdrawn',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawEther',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketSmoothingPoolInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketSmoothingPoolInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawEther',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketStorage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketStorageAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldGuardian',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newGuardian',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'GuardianChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'withdrawalAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeWithdrawalAddressSet',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'confirmGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'confirmWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteBytes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteBytes32',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteInt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteString',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddress',
    outputs: [{ name: 'r', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBool',
    outputs: [{ name: 'r', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBytes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBytes32',
    outputs: [{ name: 'r', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeployedStatus',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGuardian',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getInt',
    outputs: [{ name: 'r', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodePendingWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getString',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getUint',
    outputs: [{ name: 'r', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setBytes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setBytes32',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setDeployedStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newAddress', internalType: 'address', type: 'address' }],
    name: 'setGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'int256', type: 'int256' },
    ],
    name: 'setInt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'string', type: 'string' },
    ],
    name: 'setString',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_newWithdrawalAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_confirm', internalType: 'bool', type: 'bool' },
    ],
    name: 'setWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketStorageInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketStorageInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'confirmGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'confirmWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteBytes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteBytes32',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteInt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteString',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'deleteUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBytes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBytes32',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeployedStatus',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGuardian',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodePendingWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getNodeWithdrawalAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getString',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'address', type: 'address' },
    ],
    name: 'setAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'bool', type: 'bool' },
    ],
    name: 'setBool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setBytes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setBytes32',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newAddress', internalType: 'address', type: 'address' }],
    name: 'setGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'int256', type: 'int256' },
    ],
    name: 'setInt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'string', type: 'string' },
    ],
    name: 'setString',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeAddress', internalType: 'address', type: 'address' },
      {
        name: '_newWithdrawalAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_confirm', internalType: 'bool', type: 'bool' },
    ],
    name: 'setWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subUint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketTokenDummyRPL
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketTokenDummyRplAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_minter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_address',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MintToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'exponent',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRemainingTokens',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupplyCap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketTokenRETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketTokenRethAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherDeposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'ethAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensBurned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'ethAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_rethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositExcess',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositExcessCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCollateralRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_rethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'getEthValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExchangeRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_ethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'getRethValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalCollateral',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_ethAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketTokenRETHInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketTokenRethInterfaceAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_rethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositExcess',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositExcessCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCollateralRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_rethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'getEthValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExchangeRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_ethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'getRethValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalCollateral',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_ethAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketTokenRPL
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketTokenRplAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
      {
        name: '_rocketTokenRPLFixedSupplyAddress',
        internalType: 'contract IERC20',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLFixedSupplyBurn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'inflationCalcTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RPLInflationLog',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationCalcTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalStartTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalsPassed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationRewardsContractAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'inflationCalculate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'inflationMintTokens',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'swapTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSwappedRPL',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketTokenRPLInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketTokenRplInterfaceAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationCalcTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalStartTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationIntervalsPassed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInflationRewardsContractAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'inflationCalculate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'inflationMintTokens',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'swapTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketUpgradeOneDotThree
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketUpgradeOneDotThreeAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'executed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRocketStorageAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'locked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketClaimDAO',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketClaimDAOAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocol',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolProposals',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolProposalsAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsAuction',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsAuctionAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsDeposit',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsDepositAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsInflation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsInflationAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsMinipool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsMinipoolAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsNetwork',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsNetworkAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsRewards',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketDAOProtocolSettingsRewardsAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketMinipoolManager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketMinipoolManagerAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNetworkBalances',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNetworkBalancesAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNetworkPrices',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNetworkPricesAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNodeDeposit',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNodeDepositAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNodeManager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNodeManagerAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNodeStaking',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketNodeStakingAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketRewardsPool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'newRocketRewardsPoolAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOProtocolProposal',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOProtocolProposalAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOProtocolSettingsProposals',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOProtocolSettingsProposalsAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOProtocolSettingsSecurity',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOProtocolSettingsSecurityAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOProtocolVerifier',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOProtocolVerifierAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOSecurity',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOSecurityAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOSecurityActions',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOSecurityActionsAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOSecurityProposals',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketDAOSecurityProposalsAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketNetworkSnapshots',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketNetworkSnapshotsAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketNetworkVoting',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rocketNetworkVotingAbi',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_addresses', internalType: 'address[]', type: 'address[]' },
      { name: '_abis', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketVaultAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'string', type: 'string', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherDeposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'string', type: 'string', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenBurned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenDeposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'to', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenTransfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'time',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenWithdrawn',
  },
  {
    type: 'function',
    inputs: [
      { name: '_networkContractName', internalType: 'string', type: 'string' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_networkContractName', internalType: 'string', type: 'string' },
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20',
        type: 'address',
      },
    ],
    name: 'balanceOfToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20Burnable',
        type: 'address',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositEther',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_networkContractName', internalType: 'string', type: 'string' },
      {
        name: '_tokenContract',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disableMock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isMocking',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_networkContractName', internalType: 'string', type: 'string' },
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'useMock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawEther',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_withdrawalAddress', internalType: 'address', type: 'address' },
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketVaultInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketVaultInterfaceAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_networkContractName', internalType: 'string', type: 'string' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_networkContractName', internalType: 'string', type: 'string' },
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20',
        type: 'address',
      },
    ],
    name: 'balanceOfToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20Burnable',
        type: 'address',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositEther',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_networkContractName', internalType: 'string', type: 'string' },
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_networkContractName', internalType: 'string', type: 'string' },
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawEther',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_withdrawalAddress', internalType: 'address', type: 'address' },
      {
        name: '_tokenAddress',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RocketVaultWithdrawerInterface
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rocketVaultWithdrawerInterfaceAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'receiveVaultWithdrawalETH',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SnapshotTest
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const snapshotTestAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_rocketStorageAddress',
        internalType: 'contract RocketStorageInterface',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'string', type: 'string' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'lookup',
    outputs: [{ name: '', internalType: 'uint224', type: 'uint224' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'string', type: 'string' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'lookupGas',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'string', type: 'string' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
      { name: '_recency', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lookupRecent',
    outputs: [{ name: '', internalType: 'uint224', type: 'uint224' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'string', type: 'string' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
      { name: '_recency', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lookupRecentGas',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'string', type: 'string' },
      { name: '_block', internalType: 'uint32', type: 'uint32' },
      { name: '_value', internalType: 'uint224', type: 'uint224' },
    ],
    name: 'push',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SuperNodeAccount
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const superNodeAccountAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'expectedBondAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBondAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BadBondAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'address', type: 'address' },
      { name: 'actual', internalType: 'address', type: 'address' },
    ],
    name: 'BadPredictedCreation',
  },
  {
    type: 'error',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'BadRole',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedSender', internalType: 'address', type: 'address' },
    ],
    name: 'BadSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'actualBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelCall',
  },
  {
    type: 'error',
    inputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'LowLevelEthTransfer',
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'NotAContract',
  },
  { type: 'error', inputs: [], name: 'ZeroAddressError' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adminServerCheck',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adminServerSigExpiry',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allowSubOpDelegateChanges',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'bond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_subNodeOperator', internalType: 'address', type: 'address' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_config',
        internalType: 'struct SuperNodeAccount.CreateMinipoolConfig',
        type: 'tuple',
        components: [
          { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'validatorSignature', internalType: 'bytes', type: 'bytes' },
          { name: 'depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'salt', internalType: 'uint256', type: 'uint256' },
          {
            name: 'expectedMinipoolAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'sigGenesisTime', internalType: 'uint256', type: 'uint256' },
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'createMinipool',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'delegateRollback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'delegateUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNumMinipools',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'minipoolAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getSubNodeOpFromMinipool',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalEthMatched',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalEthStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_bond', internalType: 'uint256', type: 'uint256' }],
    name: 'hasSufficientLiquidity',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_directory', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lazyInitialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lockStarted',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockUpTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lockedEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxValidators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardIndex', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountRPL', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_amountETH', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_merkleProof',
        internalType: 'bytes32[][]',
        type: 'bytes32[][]',
      },
      {
        name: '_config',
        internalType: 'struct MerkleRewardsConfig',
        type: 'tuple',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'sigGenesisTime', internalType: 'uint256', type: 'uint256' },
          {
            name: 'avgEthTreasuryFee',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'avgEthOperatorFee',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'avgRplTreasuryFee',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'merkleClaim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'merkleClaimNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'merkleClaimSigExpiry',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'merkleClaimSigUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minimumNodeFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minipoolCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'minipoolData',
    outputs: [
      { name: 'subNodeOperator', internalType: 'address', type: 'address' },
      { name: 'ethTreasuryFee', internalType: 'uint256', type: 'uint256' },
      { name: 'noFee', internalType: 'uint256', type: 'uint256' },
      { name: 'rplTreasuryFee', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'minipoolIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'minipools',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'bool', type: 'bool' }],
    name: 'setAdminServerCheck',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newExpiry', internalType: 'uint256', type: 'uint256' }],
    name: 'setAdminServerSigExpiry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'bool', type: 'bool' }],
    name: 'setAllowSubNodeOpDelegateChanges',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newBond', internalType: 'uint256', type: 'uint256' }],
    name: 'setBond',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newLockThreshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLockAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newLockUpTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLockUpTime',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maxValidators', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMaxValidators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newMinimumNodeFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMinimumNodeFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_setting', internalType: 'bool', type: 'bool' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'setUseLatestDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'sigsUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_validatorSignature', internalType: 'bytes', type: 'bytes' },
      { name: '_depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_minipool', internalType: 'address', type: 'address' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_subNodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'stopTrackingOperatorMinipools',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'subNodeOperatorHasMinipool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subNodeOperatorMinipools',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalEthLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_minipool', internalType: 'address', type: 'address' }],
    name: 'unlockEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Treasury
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const treasuryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_to', internalType: 'address', type: 'address', indexed: true },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ClaimedEth',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: '_to', internalType: 'address', type: 'address', indexed: true },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ClaimedToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_functionData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: true,
      },
    ],
    name: 'Executed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [{ name: '_to', internalType: 'address payable', type: 'address' }],
    name: 'claimEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address payable', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimEthAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
    ],
    name: 'claimToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimTokenAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'address payable', type: 'address' },
      { name: '_functionData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_targets',
        internalType: 'address payable[]',
        type: 'address[]',
      },
      { name: '_functionData', internalType: 'bytes[]', type: 'bytes[]' },
      { name: '_values', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'executeAll',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UpgradeableBase
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const upgradeableBaseAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WETH
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const wethAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WETHVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const wethVaultAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'assets',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'assets',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdraw',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'balanceWeth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'convertToAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'convertToShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDistributableYield',
    outputs: [
      { name: 'distributableYield', internalType: 'uint256', type: 'uint256' },
      { name: 'signed', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOracle',
    outputs: [
      { name: '', internalType: 'contract IBeaconOracle', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRequiredCollateral',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'deposit', internalType: 'uint256', type: 'uint256' }],
    name: 'getRequiredCollateralAfterDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
      { name: 'weth', internalType: 'address', type: 'address' },
    ],
    name: 'initializeVault',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidityReservePercent',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'maxDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'maxMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'maxRedeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxWethRplRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'maxWithdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nodeOperatorFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onWethBalanceDecrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'onWethBalanceIncrease',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'penaltyBondCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'previewDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'previewMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'previewRedeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'previewWithdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'redeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_liquidityReservePercent',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setLiquidityReservePercent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maxWethRplRatio', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMaxWethRplRatio',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperatorFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setNodeOperatorFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperatorFee', internalType: 'uint256', type: 'uint256' },
      { name: '_treasuryFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setProtocolFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_treasuryFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTreasuryFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalCounts',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalPenaltyBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treasuryFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newDeposit', internalType: 'uint256', type: 'uint256' },
      { name: 'isWeth', internalType: 'bool', type: 'bool' },
    ],
    name: 'tvlRatioEthRpl',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Whitelist
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const whitelistAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '',
        internalType: 'struct Operator',
        type: 'tuple',
        components: [
          {
            name: 'operationStartTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'currentValidatorCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'intervalStart', internalType: 'uint256', type: 'uint256' },
          {
            name: 'operatorController',
            internalType: 'address',
            type: 'address',
          },
        ],
        indexed: false,
      },
    ],
    name: 'OperatorAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldController',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newController',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OperatorControllerUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'OperatorRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operators',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'OperatorsAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operators',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'OperatorsRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [
      { name: '_operator', internalType: 'address', type: 'address' },
      { name: '_sigGenesisTime', internalType: 'uint256', type: 'uint256' },
      { name: '_sig', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'addOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operators', internalType: 'address[]', type: 'address[]' },
      {
        name: '_sigGenesisTimes',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      { name: '_sig', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'addOperators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'a', internalType: 'address', type: 'address' }],
    name: 'getIsAddressInWhitelist',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'a', internalType: 'address', type: 'address' }],
    name: 'getNumberOfValidators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getOperatorAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'a', internalType: 'address', type: 'address' }],
    name: 'getOperatorAtAddress',
    outputs: [
      {
        name: '',
        internalType: 'struct Operator',
        type: 'tuple',
        components: [
          {
            name: 'operationStartTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'currentValidatorCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'intervalStart', internalType: 'uint256', type: 'uint256' },
          {
            name: 'operatorController',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initializeWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'nodeIndexMap',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'nodeMap',
    outputs: [
      { name: 'operationStartTime', internalType: 'uint256', type: 'uint256' },
      {
        name: 'currentValidatorCount',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'intervalStart', internalType: 'uint256', type: 'uint256' },
      { name: 'operatorController', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'numOperators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'operatorControllerToNodeMap',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'registerNewValidator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'removeOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operators', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'removeOperators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'removeValidator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'reverseNodeIndexMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'controller', internalType: 'address', type: 'address' }],
    name: 'setOperatorController',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newExpiry', internalType: 'uint256', type: 'uint256' }],
    name: 'setWhitelistExpiry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'sigsUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'whitelistSigExpiry',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WhitelistV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const whitelistV2Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '',
        internalType: 'struct Operator',
        type: 'tuple',
        components: [
          {
            name: 'operationStartTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'currentValidatorCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'intervalStart', internalType: 'uint256', type: 'uint256' },
          {
            name: 'operatorController',
            internalType: 'address',
            type: 'address',
          },
        ],
        indexed: false,
      },
    ],
    name: 'OperatorAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldController',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newController',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OperatorControllerUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'OperatorRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operators',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'OperatorsAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operators',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'OperatorsRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [
      { name: '_operator', internalType: 'address', type: 'address' },
      { name: '_sigGenesisTime', internalType: 'uint256', type: 'uint256' },
      { name: '_sig', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'addOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operators', internalType: 'address[]', type: 'address[]' },
      {
        name: '_sigGenesisTimes',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      { name: '_sig', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'addOperators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'a', internalType: 'address', type: 'address' }],
    name: 'getIsAddressInWhitelist',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'a', internalType: 'address', type: 'address' }],
    name: 'getNumberOfValidators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getOperatorAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'a', internalType: 'address', type: 'address' }],
    name: 'getOperatorAtAddress',
    outputs: [
      {
        name: '',
        internalType: 'struct Operator',
        type: 'tuple',
        components: [
          {
            name: 'operationStartTime',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'currentValidatorCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'intervalStart', internalType: 'uint256', type: 'uint256' },
          {
            name: 'operatorController',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initializeWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'nodeIndexMap',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'nodeMap',
    outputs: [
      { name: 'operationStartTime', internalType: 'uint256', type: 'uint256' },
      {
        name: 'currentValidatorCount',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'intervalStart', internalType: 'uint256', type: 'uint256' },
      { name: 'operatorController', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'numOperators',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'operatorControllerToNodeMap',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'registerNewValidator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'removeOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operators', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'removeOperators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'removeValidator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'reverseNodeIndexMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'controller', internalType: 'address', type: 'address' }],
    name: 'setOperatorController',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newExpiry', internalType: 'uint256', type: 'uint256' }],
    name: 'setWhitelistExpiry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'sigsUsed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testUpgrade',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'whitelistSigExpiry',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// YieldDistributor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const yieldDistributorAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '',
        internalType: 'struct Reward',
        type: 'tuple',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'eth', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'RewardDistributed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'interval',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WarningAlreadyClaimed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentInterval',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentIntervalGenesisTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dustAccrued',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalizeInterval',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getIntervals',
    outputs: [
      {
        name: '',
        internalType: 'struct Interval[]',
        type: 'tuple[]',
        components: [
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'numOperators', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getIsEndOfIntervalTime',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardee', internalType: 'address', type: 'address' },
      { name: '_startInterval', internalType: 'uint256', type: 'uint256' },
      { name: '_endInterval', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_directory', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'intervals',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'numOperators', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'k',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxIntervalLengthSeconds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_maxIntervalLengthSeconds',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setMaxIntervalTime',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_k', internalType: 'uint256', type: 'uint256' }],
    name: 'setRewardIncentiveModel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treasurySweep',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'weth', internalType: 'uint256', type: 'uint256' }],
    name: 'wethReceived',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'weth', internalType: 'uint256', type: 'uint256' }],
    name: 'wethReceivedVoidClaim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'yieldAccruedInInterval',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZKBeaconOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const zkBeaconOracleAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDirectory',
    outputs: [
      { name: '', internalType: 'contract Directory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastUpdatedTotalYieldAccrued',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalYieldAccrued',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'directoryAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_directoryAddress', internalType: 'address', type: 'address' },
      { name: '_oracleService', internalType: 'address', type: 'address' },
    ],
    name: 'initializeOracleService',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oracleService',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const
