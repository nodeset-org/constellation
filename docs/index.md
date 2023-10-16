# Solidity API

## RocketBase

### calcBase

```solidity
uint256 calcBase
```

### version

```solidity
uint8 version
```

### rocketStorage

```solidity
contract RocketStorageInterface rocketStorage
```

### onlyLatestNetworkContract

```solidity
modifier onlyLatestNetworkContract()
```

_Throws if called by any sender that doesn't match a Rocket Pool network contract_

### onlyLatestContract

```solidity
modifier onlyLatestContract(string _contractName, address _contractAddress)
```

_Throws if called by any sender that doesn't match one of the supplied contract or is the latest version of that contract_

### onlyRegisteredNode

```solidity
modifier onlyRegisteredNode(address _nodeAddress)
```

_Throws if called by any sender that isn't a registered node_

### onlyTrustedNode

```solidity
modifier onlyTrustedNode(address _nodeAddress)
```

_Throws if called by any sender that isn't a trusted node DAO member_

### onlyRegisteredMinipool

```solidity
modifier onlyRegisteredMinipool(address _minipoolAddress)
```

_Throws if called by any sender that isn't a registered minipool_

### onlyGuardian

```solidity
modifier onlyGuardian()
```

_Throws if called by any account other than a guardian account (temporary account allowed access to settings before DAO is fully enabled)_

### onlyRegisteredNodeOrWithdrawalAddress

```solidity
modifier onlyRegisteredNodeOrWithdrawalAddress(address _nodeAddress)
```

_Throws if called by any sender that isn't a registered node or the their respective withdrawal address_

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) internal
```

_Set the main Rocket Storage address_

### getContractAddress

```solidity
function getContractAddress(string _contractName) internal view returns (address)
```

_Get the address of a network contract by name_

### getContractAddressUnsafe

```solidity
function getContractAddressUnsafe(string _contractName) internal view returns (address)
```

_Get the address of a network contract by name (returns address(0x0) instead of reverting if contract does not exist)_

### getContractName

```solidity
function getContractName(address _contractAddress) internal view returns (string)
```

_Get the name of a network contract by address_

### getRevertMsg

```solidity
function getRevertMsg(bytes _returnData) internal pure returns (string)
```

_Get revert error message from a .call method_

### getAddress

```solidity
function getAddress(bytes32 _key) internal view returns (address)
```

_Storage get methods_

### getUint

```solidity
function getUint(bytes32 _key) internal view returns (uint256)
```

### getString

```solidity
function getString(bytes32 _key) internal view returns (string)
```

### getBytes

```solidity
function getBytes(bytes32 _key) internal view returns (bytes)
```

### getBool

```solidity
function getBool(bytes32 _key) internal view returns (bool)
```

### getInt

```solidity
function getInt(bytes32 _key) internal view returns (int256)
```

### getBytes32

```solidity
function getBytes32(bytes32 _key) internal view returns (bytes32)
```

### setAddress

```solidity
function setAddress(bytes32 _key, address _value) internal
```

_Storage set methods_

### setUint

```solidity
function setUint(bytes32 _key, uint256 _value) internal
```

### setString

```solidity
function setString(bytes32 _key, string _value) internal
```

### setBytes

```solidity
function setBytes(bytes32 _key, bytes _value) internal
```

### setBool

```solidity
function setBool(bytes32 _key, bool _value) internal
```

### setInt

```solidity
function setInt(bytes32 _key, int256 _value) internal
```

### setBytes32

```solidity
function setBytes32(bytes32 _key, bytes32 _value) internal
```

### deleteAddress

```solidity
function deleteAddress(bytes32 _key) internal
```

_Storage delete methods_

### deleteUint

```solidity
function deleteUint(bytes32 _key) internal
```

### deleteString

```solidity
function deleteString(bytes32 _key) internal
```

### deleteBytes

```solidity
function deleteBytes(bytes32 _key) internal
```

### deleteBool

```solidity
function deleteBool(bytes32 _key) internal
```

### deleteInt

```solidity
function deleteInt(bytes32 _key) internal
```

### deleteBytes32

```solidity
function deleteBytes32(bytes32 _key) internal
```

### addUint

```solidity
function addUint(bytes32 _key, uint256 _amount) internal
```

_Storage arithmetic methods_

### subUint

```solidity
function subUint(bytes32 _key, uint256 _amount) internal
```

## RocketStorage

### NodeWithdrawalAddressSet

```solidity
event NodeWithdrawalAddressSet(address node, address withdrawalAddress, uint256 time)
```

### GuardianChanged

```solidity
event GuardianChanged(address oldGuardian, address newGuardian)
```

### guardian

```solidity
address guardian
```

### newGuardian

```solidity
address newGuardian
```

### storageInit

```solidity
bool storageInit
```

### onlyLatestRocketNetworkContract

```solidity
modifier onlyLatestRocketNetworkContract()
```

_Only allow access from the latest version of a contract in the Rocket Pool network after deployment_

### constructor

```solidity
constructor() public
```

_Construct RocketStorage_

### getGuardian

```solidity
function getGuardian() external view returns (address)
```

### setGuardian

```solidity
function setGuardian(address _newAddress) external
```

### confirmGuardian

```solidity
function confirmGuardian() external
```

### getDeployedStatus

```solidity
function getDeployedStatus() external view returns (bool)
```

### setDeployedStatus

```solidity
function setDeployedStatus() external
```

### getNodeWithdrawalAddress

```solidity
function getNodeWithdrawalAddress(address _nodeAddress) public view returns (address)
```

### getNodePendingWithdrawalAddress

```solidity
function getNodePendingWithdrawalAddress(address _nodeAddress) external view returns (address)
```

### setWithdrawalAddress

```solidity
function setWithdrawalAddress(address _nodeAddress, address _newWithdrawalAddress, bool _confirm) external
```

### confirmWithdrawalAddress

```solidity
function confirmWithdrawalAddress(address _nodeAddress) external
```

### getAddress

```solidity
function getAddress(bytes32 _key) external view returns (address r)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### getUint

```solidity
function getUint(bytes32 _key) external view returns (uint256 r)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### getString

```solidity
function getString(bytes32 _key) external view returns (string)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### getBytes

```solidity
function getBytes(bytes32 _key) external view returns (bytes)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### getBool

```solidity
function getBool(bytes32 _key) external view returns (bool r)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### getInt

```solidity
function getInt(bytes32 _key) external view returns (int256 r)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### getBytes32

```solidity
function getBytes32(bytes32 _key) external view returns (bytes32 r)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### setAddress

```solidity
function setAddress(bytes32 _key, address _value) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _value | address |  |

### setUint

```solidity
function setUint(bytes32 _key, uint256 _value) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _value | uint256 |  |

### setString

```solidity
function setString(bytes32 _key, string _value) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _value | string |  |

### setBytes

```solidity
function setBytes(bytes32 _key, bytes _value) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _value | bytes |  |

### setBool

```solidity
function setBool(bytes32 _key, bool _value) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _value | bool |  |

### setInt

```solidity
function setInt(bytes32 _key, int256 _value) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _value | int256 |  |

### setBytes32

```solidity
function setBytes32(bytes32 _key, bytes32 _value) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _value | bytes32 |  |

### deleteAddress

```solidity
function deleteAddress(bytes32 _key) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### deleteUint

```solidity
function deleteUint(bytes32 _key) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### deleteString

```solidity
function deleteString(bytes32 _key) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### deleteBytes

```solidity
function deleteBytes(bytes32 _key) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### deleteBool

```solidity
function deleteBool(bytes32 _key) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### deleteInt

```solidity
function deleteInt(bytes32 _key) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### deleteBytes32

```solidity
function deleteBytes32(bytes32 _key) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |

### addUint

```solidity
function addUint(bytes32 _key, uint256 _amount) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _amount | uint256 | An amount to add to the record's value |

### subUint

```solidity
function subUint(bytes32 _key, uint256 _amount) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | bytes32 | The key for the record |
| _amount | uint256 | An amount to subtract from the record's value |

## RocketVault

### etherBalances

```solidity
mapping(string => uint256) etherBalances
```

### tokenBalances

```solidity
mapping(bytes32 => uint256) tokenBalances
```

### EtherDeposited

```solidity
event EtherDeposited(string by, uint256 amount, uint256 time)
```

### EtherWithdrawn

```solidity
event EtherWithdrawn(string by, uint256 amount, uint256 time)
```

### TokenDeposited

```solidity
event TokenDeposited(bytes32 by, address tokenAddress, uint256 amount, uint256 time)
```

### TokenWithdrawn

```solidity
event TokenWithdrawn(bytes32 by, address tokenAddress, uint256 amount, uint256 time)
```

### TokenBurned

```solidity
event TokenBurned(bytes32 by, address tokenAddress, uint256 amount, uint256 time)
```

### TokenTransfer

```solidity
event TokenTransfer(bytes32 by, bytes32 to, address tokenAddress, uint256 amount, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### balanceOf

```solidity
function balanceOf(string _networkContractName) external view returns (uint256)
```

### balanceOfToken

```solidity
function balanceOfToken(string _networkContractName, contract IERC20 _tokenAddress) external view returns (uint256)
```

### depositEther

```solidity
function depositEther() external payable
```

### withdrawEther

```solidity
function withdrawEther(uint256 _amount) external
```

### depositToken

```solidity
function depositToken(string _networkContractName, contract IERC20 _tokenContract, uint256 _amount) external
```

### withdrawToken

```solidity
function withdrawToken(address _withdrawalAddress, contract IERC20 _tokenAddress, uint256 _amount) external
```

### transferToken

```solidity
function transferToken(string _networkContractName, contract IERC20 _tokenAddress, uint256 _amount) external
```

### burnToken

```solidity
function burnToken(contract ERC20Burnable _tokenAddress, uint256 _amount) external
```

## RocketAuctionManager

### LotCreated

```solidity
event LotCreated(uint256 lotIndex, address by, uint256 rplAmount, uint256 time)
```

### BidPlaced

```solidity
event BidPlaced(uint256 lotIndex, address by, uint256 bidAmount, uint256 time)
```

### BidClaimed

```solidity
event BidClaimed(uint256 lotIndex, address by, uint256 bidAmount, uint256 rplAmount, uint256 time)
```

### RPLRecovered

```solidity
event RPLRecovered(uint256 lotIndex, address by, uint256 rplAmount, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getTotalRPLBalance

```solidity
function getTotalRPLBalance() public view returns (uint256)
```

### getAllottedRPLBalance

```solidity
function getAllottedRPLBalance() public view returns (uint256)
```

### getRemainingRPLBalance

```solidity
function getRemainingRPLBalance() public view returns (uint256)
```

### getLotCount

```solidity
function getLotCount() public view returns (uint256)
```

### getLotExists

```solidity
function getLotExists(uint256 _index) public view returns (bool)
```

### getLotStartBlock

```solidity
function getLotStartBlock(uint256 _index) public view returns (uint256)
```

### getLotEndBlock

```solidity
function getLotEndBlock(uint256 _index) public view returns (uint256)
```

### getLotStartPrice

```solidity
function getLotStartPrice(uint256 _index) public view returns (uint256)
```

### getLotReservePrice

```solidity
function getLotReservePrice(uint256 _index) public view returns (uint256)
```

### getLotTotalRPLAmount

```solidity
function getLotTotalRPLAmount(uint256 _index) public view returns (uint256)
```

### getLotTotalBidAmount

```solidity
function getLotTotalBidAmount(uint256 _index) public view returns (uint256)
```

### getLotAddressBidAmount

```solidity
function getLotAddressBidAmount(uint256 _index, address _bidder) public view returns (uint256)
```

### getLotRPLRecovered

```solidity
function getLotRPLRecovered(uint256 _index) public view returns (bool)
```

### getLotPriceAtBlock

```solidity
function getLotPriceAtBlock(uint256 _index, uint256 _block) public view returns (uint256)
```

### getLotPriceAtCurrentBlock

```solidity
function getLotPriceAtCurrentBlock(uint256 _index) public view returns (uint256)
```

### getLotPriceByTotalBids

```solidity
function getLotPriceByTotalBids(uint256 _index) public view returns (uint256)
```

### getLotCurrentPrice

```solidity
function getLotCurrentPrice(uint256 _index) public view returns (uint256)
```

### getLotClaimedRPLAmount

```solidity
function getLotClaimedRPLAmount(uint256 _index) public view returns (uint256)
```

### getLotRemainingRPLAmount

```solidity
function getLotRemainingRPLAmount(uint256 _index) public view returns (uint256)
```

### getLotIsCleared

```solidity
function getLotIsCleared(uint256 _index) external view returns (bool)
```

### createLot

```solidity
function createLot() external
```

### placeBid

```solidity
function placeBid(uint256 _lotIndex) external payable
```

### claimBid

```solidity
function claimBid(uint256 _lotIndex) external
```

### recoverUnclaimedRPL

```solidity
function recoverUnclaimedRPL(uint256 _lotIndex) external
```

## RocketDAOProposal

### ProposalAdded

```solidity
event ProposalAdded(address proposer, string proposalDAO, uint256 proposalID, bytes payload, uint256 time)
```

### ProposalVoted

```solidity
event ProposalVoted(uint256 proposalID, address voter, bool supported, uint256 time)
```

### ProposalExecuted

```solidity
event ProposalExecuted(uint256 proposalID, address executer, uint256 time)
```

### ProposalCancelled

```solidity
event ProposalCancelled(uint256 proposalID, address canceller, uint256 time)
```

### onlyDAOContract

```solidity
modifier onlyDAOContract(string _daoName)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getTotal

```solidity
function getTotal() public view returns (uint256)
```

### getDAO

```solidity
function getDAO(uint256 _proposalID) public view returns (string)
```

### getProposer

```solidity
function getProposer(uint256 _proposalID) public view returns (address)
```

### getMessage

```solidity
function getMessage(uint256 _proposalID) external view returns (string)
```

### getStart

```solidity
function getStart(uint256 _proposalID) public view returns (uint256)
```

### getEnd

```solidity
function getEnd(uint256 _proposalID) public view returns (uint256)
```

### getExpires

```solidity
function getExpires(uint256 _proposalID) public view returns (uint256)
```

### getCreated

```solidity
function getCreated(uint256 _proposalID) external view returns (uint256)
```

### getVotesFor

```solidity
function getVotesFor(uint256 _proposalID) public view returns (uint256)
```

### getVotesAgainst

```solidity
function getVotesAgainst(uint256 _proposalID) public view returns (uint256)
```

### getVotesRequired

```solidity
function getVotesRequired(uint256 _proposalID) public view returns (uint256)
```

### getCancelled

```solidity
function getCancelled(uint256 _proposalID) public view returns (bool)
```

### getExecuted

```solidity
function getExecuted(uint256 _proposalID) public view returns (bool)
```

### getPayload

```solidity
function getPayload(uint256 _proposalID) public view returns (bytes)
```

### getReceiptHasVoted

```solidity
function getReceiptHasVoted(uint256 _proposalID, address _nodeAddress) public view returns (bool)
```

### getReceiptSupported

```solidity
function getReceiptSupported(uint256 _proposalID, address _nodeAddress) external view returns (bool)
```

### getState

```solidity
function getState(uint256 _proposalID) public view returns (enum RocketDAOProposalInterface.ProposalState)
```

### add

```solidity
function add(address _member, string _dao, string _message, uint256 _startTime, uint256 _duration, uint256 _expires, uint256 _votesRequired, bytes _payload) external returns (uint256)
```

### vote

```solidity
function vote(address _member, uint256 _votes, uint256 _proposalID, bool _support) external
```

### execute

```solidity
function execute(uint256 _proposalID) external
```

### cancel

```solidity
function cancel(address _member, uint256 _proposalID) external
```

## RocketDAONodeTrusted

### daoNameSpace

```solidity
string daoNameSpace
```

### daoMemberMinCount

```solidity
uint256 daoMemberMinCount
```

### onlyBootstrapMode

```solidity
modifier onlyBootstrapMode()
```

### onlyLowMemberMode

```solidity
modifier onlyLowMemberMode()
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getBootstrapModeDisabled

```solidity
function getBootstrapModeDisabled() public view returns (bool)
```

### getMemberQuorumVotesRequired

```solidity
function getMemberQuorumVotesRequired() external view returns (uint256)
```

### getMemberIsValid

```solidity
function getMemberIsValid(address _nodeAddress) external view returns (bool)
```

### getMemberAt

```solidity
function getMemberAt(uint256 _index) external view returns (address)
```

### getMemberCount

```solidity
function getMemberCount() public view returns (uint256)
```

### getMemberMinRequired

```solidity
function getMemberMinRequired() external pure returns (uint256)
```

### getMemberLastProposalTime

```solidity
function getMemberLastProposalTime(address _nodeAddress) external view returns (uint256)
```

### getMemberID

```solidity
function getMemberID(address _nodeAddress) external view returns (string)
```

### getMemberUrl

```solidity
function getMemberUrl(address _nodeAddress) external view returns (string)
```

### getMemberJoinedTime

```solidity
function getMemberJoinedTime(address _nodeAddress) external view returns (uint256)
```

### getMemberProposalExecutedTime

```solidity
function getMemberProposalExecutedTime(string _proposalType, address _nodeAddress) external view returns (uint256)
```

### getMemberRPLBondAmount

```solidity
function getMemberRPLBondAmount(address _nodeAddress) external view returns (uint256)
```

### getMemberIsChallenged

```solidity
function getMemberIsChallenged(address _nodeAddress) external view returns (bool)
```

### getMemberUnbondedValidatorCount

```solidity
function getMemberUnbondedValidatorCount(address _nodeAddress) external view returns (uint256)
```

### incrementMemberUnbondedValidatorCount

```solidity
function incrementMemberUnbondedValidatorCount(address _nodeAddress) external
```

### decrementMemberUnbondedValidatorCount

```solidity
function decrementMemberUnbondedValidatorCount(address _nodeAddress) external
```

### bootstrapMember

```solidity
function bootstrapMember(string _id, string _url, address _nodeAddress) external
```

### bootstrapSettingUint

```solidity
function bootstrapSettingUint(string _settingContractName, string _settingPath, uint256 _value) external
```

### bootstrapSettingBool

```solidity
function bootstrapSettingBool(string _settingContractName, string _settingPath, bool _value) external
```

### bootstrapUpgrade

```solidity
function bootstrapUpgrade(string _type, string _name, string _contractAbi, address _contractAddress) external
```

### bootstrapDisable

```solidity
function bootstrapDisable(bool _confirmDisableBootstrapMode) external
```

### memberJoinRequired

```solidity
function memberJoinRequired(string _id, string _url) external
```

## RocketDAONodeTrustedActions

### ActionJoined

```solidity
event ActionJoined(address nodeAddress, uint256 rplBondAmount, uint256 time)
```

### ActionLeave

```solidity
event ActionLeave(address nodeAddress, uint256 rplBondAmount, uint256 time)
```

### ActionKick

```solidity
event ActionKick(address nodeAddress, uint256 rplBondAmount, uint256 time)
```

### ActionChallengeMade

```solidity
event ActionChallengeMade(address nodeChallengedAddress, address nodeChallengerAddress, uint256 time)
```

### ActionChallengeDecided

```solidity
event ActionChallengeDecided(address nodeChallengedAddress, address nodeChallengeDeciderAddress, bool success, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### actionJoin

```solidity
function actionJoin() external
```

### actionJoinRequired

```solidity
function actionJoinRequired(address _nodeAddress) external
```

### actionLeave

```solidity
function actionLeave(address _rplBondRefundAddress) external
```

### actionKick

```solidity
function actionKick(address _nodeAddress, uint256 _rplFine) external
```

### actionChallengeMake

```solidity
function actionChallengeMake(address _nodeAddress) external payable
```

### actionChallengeDecide

```solidity
function actionChallengeDecide(address _nodeAddress) external
```

## RocketDAONodeTrustedProposals

### daoNameSpace

```solidity
string daoNameSpace
```

### onlyExecutingContracts

```solidity
modifier onlyExecutingContracts()
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### propose

```solidity
function propose(string _proposalMessage, bytes _payload) external returns (uint256)
```

### vote

```solidity
function vote(uint256 _proposalID, bool _support) external
```

### cancel

```solidity
function cancel(uint256 _proposalID) external
```

### execute

```solidity
function execute(uint256 _proposalID) external
```

### proposalInvite

```solidity
function proposalInvite(string _id, string _url, address _nodeAddress) external
```

### proposalLeave

```solidity
function proposalLeave(address _nodeAddress) external
```

### proposalKick

```solidity
function proposalKick(address _nodeAddress, uint256 _rplFine) external
```

### proposalSettingUint

```solidity
function proposalSettingUint(string _settingContractName, string _settingPath, uint256 _value) external
```

### proposalSettingBool

```solidity
function proposalSettingBool(string _settingContractName, string _settingPath, bool _value) external
```

### proposalUpgrade

```solidity
function proposalUpgrade(string _type, string _name, string _contractAbi, address _contractAddress) external
```

## RocketDAONodeTrustedUpgrade

### ContractUpgraded

```solidity
event ContractUpgraded(bytes32 name, address oldAddress, address newAddress, uint256 time)
```

### ContractAdded

```solidity
event ContractAdded(bytes32 name, address newAddress, uint256 time)
```

### ABIUpgraded

```solidity
event ABIUpgraded(bytes32 name, uint256 time)
```

### ABIAdded

```solidity
event ABIAdded(bytes32 name, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### upgrade

```solidity
function upgrade(string _type, string _name, string _contractAbi, address _contractAddress) external
```

### _upgradeContract

```solidity
function _upgradeContract(string _name, address _contractAddress, string _contractAbi) internal
```

### _addContract

```solidity
function _addContract(string _name, address _contractAddress, string _contractAbi) internal
```

### _upgradeABI

```solidity
function _upgradeABI(string _name, string _contractAbi) internal
```

### _addABI

```solidity
function _addABI(string _name, string _contractAbi) internal
```

## RocketDAONodeTrustedSettings

### settingNameSpace

```solidity
bytes32 settingNameSpace
```

### onlyDAONodeTrustedProposal

```solidity
modifier onlyDAONodeTrustedProposal()
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress, string _settingNameSpace) internal
```

### getSettingUint

```solidity
function getSettingUint(string _settingPath) public view returns (uint256)
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) public virtual
```

### getSettingBool

```solidity
function getSettingBool(string _settingPath) public view returns (bool)
```

### setSettingBool

```solidity
function setSettingBool(string _settingPath, bool _value) public virtual
```

## RocketDAONodeTrustedSettingsMembers

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) public
```

### getQuorum

```solidity
function getQuorum() external view returns (uint256)
```

### getRPLBond

```solidity
function getRPLBond() external view returns (uint256)
```

### getMinipoolUnbondedMax

```solidity
function getMinipoolUnbondedMax() external view returns (uint256)
```

### getMinipoolUnbondedMinFee

```solidity
function getMinipoolUnbondedMinFee() external view returns (uint256)
```

### getChallengeCooldown

```solidity
function getChallengeCooldown() external view returns (uint256)
```

### getChallengeWindow

```solidity
function getChallengeWindow() external view returns (uint256)
```

### getChallengeCost

```solidity
function getChallengeCost() external view returns (uint256)
```

## RocketDAONodeTrustedSettingsMinipool

The Trusted Node DAO Minipool settings

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) public
```

Update a setting, overrides inherited setting method with extra checks for this contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _settingPath | string | The path of the setting within this contract's namespace |
| _value | uint256 | The value to set it to |

### getScrubPeriod

```solidity
function getScrubPeriod() external view returns (uint256)
```

How long minipools must wait before moving to staking status (can be scrubbed by ODAO before then)

### getPromotionScrubPeriod

```solidity
function getPromotionScrubPeriod() external view returns (uint256)
```

How long minipools must wait before promoting a vacant minipool to staking status (can be scrubbed by ODAO before then)

### getScrubQuorum

```solidity
function getScrubQuorum() external view returns (uint256)
```

Returns the required number of trusted nodes to vote to scrub a minipool

### getCancelBondReductionQuorum

```solidity
function getCancelBondReductionQuorum() external view returns (uint256)
```

Returns the required number of trusted nodes to vote to cancel a bond reduction

### getScrubPenaltyEnabled

```solidity
function getScrubPenaltyEnabled() external view returns (bool)
```

Returns true if scrubbing results in an RPL penalty for the node operator

### isWithinBondReductionWindow

```solidity
function isWithinBondReductionWindow(uint256 _time) external view returns (bool)
```

Returns true if the given time is within the bond reduction window

### getBondReductionWindowStart

```solidity
function getBondReductionWindowStart() public view returns (uint256)
```

Returns the start of the bond reduction window

### getBondReductionWindowLength

```solidity
function getBondReductionWindowLength() public view returns (uint256)
```

Returns the length of the bond reduction window

## RocketDAONodeTrustedSettingsProposals

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getCooldownTime

```solidity
function getCooldownTime() external view returns (uint256)
```

### getVoteTime

```solidity
function getVoteTime() external view returns (uint256)
```

### getVoteDelayTime

```solidity
function getVoteDelayTime() external view returns (uint256)
```

### getExecuteTime

```solidity
function getExecuteTime() external view returns (uint256)
```

### getActionTime

```solidity
function getActionTime() external view returns (uint256)
```

## RocketDAONodeTrustedSettingsRewards

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setSettingBool

```solidity
function setSettingBool(string _settingPath, bool _value) public
```

### getNetworkEnabled

```solidity
function getNetworkEnabled(uint256 _network) external view returns (bool)
```

## RocketDAOProtocol

### daoNameSpace

```solidity
string daoNameSpace
```

### onlyBootstrapMode

```solidity
modifier onlyBootstrapMode()
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getBootstrapModeDisabled

```solidity
function getBootstrapModeDisabled() public view returns (bool)
```

### bootstrapSettingMulti

```solidity
function bootstrapSettingMulti(string[] _settingContractNames, string[] _settingPaths, enum SettingType[] _types, bytes[] _values) external
```

### bootstrapSettingUint

```solidity
function bootstrapSettingUint(string _settingContractName, string _settingPath, uint256 _value) external
```

### bootstrapSettingBool

```solidity
function bootstrapSettingBool(string _settingContractName, string _settingPath, bool _value) external
```

### bootstrapSettingAddress

```solidity
function bootstrapSettingAddress(string _settingContractName, string _settingPath, address _value) external
```

### bootstrapSettingClaimer

```solidity
function bootstrapSettingClaimer(string _contractName, uint256 _perc) external
```

### bootstrapSpendTreasury

```solidity
function bootstrapSpendTreasury(string _invoiceID, address _recipientAddress, uint256 _amount) external
```

### bootstrapDisable

```solidity
function bootstrapDisable(bool _confirmDisableBootstrapMode) external
```

## RocketDAOProtocolActions

### daoNameSpace

```solidity
string daoNameSpace
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

## RocketDAOProtocolProposals

### daoNameSpace

```solidity
string daoNameSpace
```

### onlyExecutingContracts

```solidity
modifier onlyExecutingContracts()
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### proposalSettingMulti

```solidity
function proposalSettingMulti(string[] _settingContractNames, string[] _settingPaths, enum SettingType[] _types, bytes[] _data) external
```

### proposalSettingUint

```solidity
function proposalSettingUint(string _settingContractName, string _settingPath, uint256 _value) public
```

### proposalSettingBool

```solidity
function proposalSettingBool(string _settingContractName, string _settingPath, bool _value) public
```

### proposalSettingAddress

```solidity
function proposalSettingAddress(string _settingContractName, string _settingPath, address _value) public
```

### proposalSettingRewardsClaimer

```solidity
function proposalSettingRewardsClaimer(string _contractName, uint256 _perc) external
```

### proposalSpendTreasury

```solidity
function proposalSpendTreasury(string _invoiceID, address _recipientAddress, uint256 _amount) external
```

## RocketDAOProtocolSettings

### settingNameSpace

```solidity
bytes32 settingNameSpace
```

### onlyDAOProtocolProposal

```solidity
modifier onlyDAOProtocolProposal()
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress, string _settingNameSpace) internal
```

### getSettingUint

```solidity
function getSettingUint(string _settingPath) public view returns (uint256)
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) public virtual
```

### getSettingBool

```solidity
function getSettingBool(string _settingPath) public view returns (bool)
```

### setSettingBool

```solidity
function setSettingBool(string _settingPath, bool _value) public virtual
```

### getSettingAddress

```solidity
function getSettingAddress(string _settingPath) external view returns (address)
```

### setSettingAddress

```solidity
function setSettingAddress(string _settingPath, address _value) external virtual
```

## RocketDAOProtocolSettingsAuction

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getCreateLotEnabled

```solidity
function getCreateLotEnabled() external view returns (bool)
```

### getBidOnLotEnabled

```solidity
function getBidOnLotEnabled() external view returns (bool)
```

### getLotMinimumEthValue

```solidity
function getLotMinimumEthValue() external view returns (uint256)
```

### getLotMaximumEthValue

```solidity
function getLotMaximumEthValue() external view returns (uint256)
```

### getLotDuration

```solidity
function getLotDuration() external view returns (uint256)
```

### getStartingPriceRatio

```solidity
function getStartingPriceRatio() external view returns (uint256)
```

### getReservePriceRatio

```solidity
function getReservePriceRatio() external view returns (uint256)
```

## RocketDAOProtocolSettingsDeposit

Network deposit settings

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getDepositEnabled

```solidity
function getDepositEnabled() external view returns (bool)
```

Returns true if deposits are currently enabled

### getAssignDepositsEnabled

```solidity
function getAssignDepositsEnabled() external view returns (bool)
```

Returns true if deposit assignments are currently enabled

### getMinimumDeposit

```solidity
function getMinimumDeposit() external view returns (uint256)
```

Returns the minimum deposit size

### getMaximumDepositPoolSize

```solidity
function getMaximumDepositPoolSize() external view returns (uint256)
```

Returns the maximum size of the deposit pool

### getMaximumDepositAssignments

```solidity
function getMaximumDepositAssignments() external view returns (uint256)
```

Returns the maximum number of deposit assignments to perform at once

### getMaximumDepositSocialisedAssignments

```solidity
function getMaximumDepositSocialisedAssignments() external view returns (uint256)
```

Returns the maximum number of socialised (ie, not related to deposit size) assignments to perform

### getDepositFee

```solidity
function getDepositFee() external view returns (uint256)
```

Returns the current fee paid on user deposits

## RocketDAOProtocolSettingsInflation

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) public
```

### getInflationIntervalRate

```solidity
function getInflationIntervalRate() external view returns (uint256)
```

### getInflationIntervalStartTime

```solidity
function getInflationIntervalStartTime() public view returns (uint256)
```

## RocketDAOProtocolSettingsMinipool

Network minipool settings

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) public
```

Update a setting, overrides inherited setting method with extra checks for this contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _settingPath | string | The path of the setting within this contract's namespace |
| _value | uint256 | The value to set it to |

### getLaunchBalance

```solidity
function getLaunchBalance() public pure returns (uint256)
```

Returns the balance required to launch minipool

### getPreLaunchValue

```solidity
function getPreLaunchValue() public pure returns (uint256)
```

Returns the value required to pre-launch a minipool

### getDepositUserAmount

```solidity
function getDepositUserAmount(enum MinipoolDeposit _depositType) external pure returns (uint256)
```

Returns the deposit amount for a given deposit type (only used for legacy minipool types)

### getFullDepositUserAmount

```solidity
function getFullDepositUserAmount() public pure returns (uint256)
```

Returns the user amount for a "Full" deposit minipool

### getHalfDepositUserAmount

```solidity
function getHalfDepositUserAmount() public pure returns (uint256)
```

Returns the user amount for a "Half" deposit minipool

### getVariableDepositAmount

```solidity
function getVariableDepositAmount() public pure returns (uint256)
```

Returns the amount a "Variable" minipool requires to move to staking status

### getSubmitWithdrawableEnabled

```solidity
function getSubmitWithdrawableEnabled() external view returns (bool)
```

Submit minipool withdrawable events currently enabled (trusted nodes only)

### getBondReductionEnabled

```solidity
function getBondReductionEnabled() external view returns (bool)
```

Returns true if bond reductions are currentl enabled

### getLaunchTimeout

```solidity
function getLaunchTimeout() external view returns (uint256)
```

Returns the timeout period in seconds for prelaunch minipools to launch

### getMaximumCount

```solidity
function getMaximumCount() external view returns (uint256)
```

Returns the maximum number of minipools allowed at one time

### isWithinUserDistributeWindow

```solidity
function isWithinUserDistributeWindow(uint256 _time) external view returns (bool)
```

Returns true if the given time is within the user distribute window

### hasUserDistributeWindowPassed

```solidity
function hasUserDistributeWindowPassed(uint256 _time) external view returns (bool)
```

Returns true if the given time has passed the distribute window

### getUserDistributeWindowStart

```solidity
function getUserDistributeWindowStart() public view returns (uint256)
```

Returns the start of the user distribute window

### getUserDistributeWindowLength

```solidity
function getUserDistributeWindowLength() public view returns (uint256)
```

Returns the length of the user distribute window

## RocketDAOProtocolSettingsNetwork

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) public
```

### getNodeConsensusThreshold

```solidity
function getNodeConsensusThreshold() external view returns (uint256)
```

### getNodePenaltyThreshold

```solidity
function getNodePenaltyThreshold() external view returns (uint256)
```

### getPerPenaltyRate

```solidity
function getPerPenaltyRate() external view returns (uint256)
```

### getSubmitBalancesEnabled

```solidity
function getSubmitBalancesEnabled() external view returns (bool)
```

### getSubmitBalancesFrequency

```solidity
function getSubmitBalancesFrequency() external view returns (uint256)
```

### getSubmitPricesEnabled

```solidity
function getSubmitPricesEnabled() external view returns (bool)
```

### getSubmitPricesFrequency

```solidity
function getSubmitPricesFrequency() external view returns (uint256)
```

### getMinimumNodeFee

```solidity
function getMinimumNodeFee() external view returns (uint256)
```

### getTargetNodeFee

```solidity
function getTargetNodeFee() external view returns (uint256)
```

### getMaximumNodeFee

```solidity
function getMaximumNodeFee() external view returns (uint256)
```

### getNodeFeeDemandRange

```solidity
function getNodeFeeDemandRange() external view returns (uint256)
```

### getTargetRethCollateralRate

```solidity
function getTargetRethCollateralRate() external view returns (uint256)
```

### getRethDepositDelay

```solidity
function getRethDepositDelay() external view returns (uint256)
```

### getSubmitRewardsEnabled

```solidity
function getSubmitRewardsEnabled() external view returns (bool)
```

## RocketDAOProtocolSettingsNode

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getRegistrationEnabled

```solidity
function getRegistrationEnabled() external view returns (bool)
```

### getSmoothingPoolRegistrationEnabled

```solidity
function getSmoothingPoolRegistrationEnabled() external view returns (bool)
```

### getDepositEnabled

```solidity
function getDepositEnabled() external view returns (bool)
```

### getVacantMinipoolsEnabled

```solidity
function getVacantMinipoolsEnabled() external view returns (bool)
```

### getMinimumPerMinipoolStake

```solidity
function getMinimumPerMinipoolStake() external view returns (uint256)
```

### getMaximumPerMinipoolStake

```solidity
function getMaximumPerMinipoolStake() external view returns (uint256)
```

## RocketDAOProtocolSettingsRewards

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setSettingRewardsClaimer

```solidity
function setSettingRewardsClaimer(string _contractName, uint256 _perc) public
```

### getRewardsClaimerPerc

```solidity
function getRewardsClaimerPerc(string _contractName) public view returns (uint256)
```

### getRewardsClaimerPercTimeUpdated

```solidity
function getRewardsClaimerPercTimeUpdated(string _contractName) external view returns (uint256)
```

### getRewardsClaimersPercTotal

```solidity
function getRewardsClaimersPercTotal() public view returns (uint256)
```

### getRewardsClaimIntervalTime

```solidity
function getRewardsClaimIntervalTime() external view returns (uint256)
```

## RocketDepositPool

Accepts user deposits and mints rETH; handles assignment of deposited ETH to minipools

### rocketVault

```solidity
contract RocketVaultInterface rocketVault
```

### rocketTokenRETH

```solidity
contract RocketTokenRETHInterface rocketTokenRETH
```

### DepositReceived

```solidity
event DepositReceived(address from, uint256 amount, uint256 time)
```

### DepositRecycled

```solidity
event DepositRecycled(address from, uint256 amount, uint256 time)
```

### DepositAssigned

```solidity
event DepositAssigned(address minipool, uint256 amount, uint256 time)
```

### ExcessWithdrawn

```solidity
event ExcessWithdrawn(address to, uint256 amount, uint256 time)
```

### MinipoolAssignment

```solidity
struct MinipoolAssignment {
  address minipoolAddress;
  uint256 etherAssigned;
}
```

### onlyThisLatestContract

```solidity
modifier onlyThisLatestContract()
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getBalance

```solidity
function getBalance() public view returns (uint256)
```

Returns the current deposit pool balance

### getNodeBalance

```solidity
function getNodeBalance() public view returns (uint256)
```

Returns the amount of ETH contributed to the deposit pool by node operators waiting in the queue

### getUserBalance

```solidity
function getUserBalance() public view returns (int256)
```

Returns the user owned portion of the deposit pool (negative indicates more ETH has been "lent" to the
        deposit pool by node operators in the queue than is available from user deposits)

### getExcessBalance

```solidity
function getExcessBalance() public view returns (uint256)
```

Excess deposit pool balance (in excess of minipool queue capacity)

### receiveVaultWithdrawalETH

```solidity
function receiveVaultWithdrawalETH() external payable
```

_Callback required to receive ETH withdrawal from the vault_

### deposit

```solidity
function deposit() external payable
```

Deposits ETH into Rocket Pool and mints the corresponding amount of rETH to the caller

### getMaximumDepositAmount

```solidity
function getMaximumDepositAmount() external view returns (uint256)
```

Returns the maximum amount that can be accepted into the deposit pool at this time in wei

### nodeDeposit

```solidity
function nodeDeposit(uint256 _totalAmount) external payable
```

_Accepts ETH deposit from the node deposit contract (does not mint rETH)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _totalAmount | uint256 | The total node deposit amount including any credit balance used |

### nodeCreditWithdrawal

```solidity
function nodeCreditWithdrawal(uint256 _amount) external
```

_Withdraws ETH from the deposit pool to RocketNodeDeposit contract to be used for a new minipool_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | The amount of ETH to withdraw |

### recycleDissolvedDeposit

```solidity
function recycleDissolvedDeposit() external payable
```

_Recycle a deposit from a dissolved minipool_

### recycleExcessCollateral

```solidity
function recycleExcessCollateral() external payable
```

_Recycle excess ETH from the rETH token contract_

### recycleLiquidatedStake

```solidity
function recycleLiquidatedStake() external payable
```

_Recycle a liquidated RPL stake from a slashed minipool_

### assignDeposits

```solidity
function assignDeposits() external
```

Assign deposits to available minipools. Reverts if assigning deposits is disabled.

### maybeAssignDeposits

```solidity
function maybeAssignDeposits() external returns (bool)
```

_Assign deposits to available minipools. Does nothing if assigning deposits is disabled._

### withdrawExcessBalance

```solidity
function withdrawExcessBalance(uint256 _amount) external
```

_Withdraw excess deposit pool balance for rETH collateral_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | The amount of excess ETH to withdraw |

## PenaltyTest

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setPenaltyRate

```solidity
function setPenaltyRate(address _minipoolAddress, uint256 _rate) external
```

## RocketNodeDepositLEB4

_NOT USED IN PRODUCTION - This contract only exists to test future functionality that may or may not be included
in a future Rocket Pool release_

### DepositReceived

```solidity
event DepositReceived(address from, uint256 amount, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### receive

```solidity
receive() external payable
```

_Accept incoming ETH from the deposit pool_

### getNodeDepositCredit

```solidity
function getNodeDepositCredit(address _nodeOperator) public view returns (uint256)
```

Returns a node operator's credit balance in wei

### increaseDepositCreditBalance

```solidity
function increaseDepositCreditBalance(address _nodeOperator, uint256 _amount) external
```

_Increases a node operators deposit credit balance_

### deposit

```solidity
function deposit(uint256 _bondAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot, uint256 _salt, address _expectedMinipoolAddress) external payable
```

Accept a node deposit and create a new minipool under the node. Only accepts calls from registered nodes

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _bondAmount | uint256 | The amount of capital the node operator wants to put up as his bond |
| _minimumNodeFee | uint256 | Transaction will revert if network commission rate drops below this amount |
| _validatorPubkey | bytes | Pubkey of the validator the node operator wishes to migrate |
| _validatorSignature | bytes | Signature from the validator over the deposit data |
| _depositDataRoot | bytes32 | The hash tree root of the deposit data (passed onto the deposit contract on pre stake) |
| _salt | uint256 | Salt used to deterministically construct the minipool's address |
| _expectedMinipoolAddress | address | The expected deterministic minipool address. Will revert if it doesn't match |

### depositWithCredit

```solidity
function depositWithCredit(uint256 _bondAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot, uint256 _salt, address _expectedMinipoolAddress) external payable
```

Accept a node deposit and create a new minipool under the node. Only accepts calls from registered nodes

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _bondAmount | uint256 | The amount of capital the node operator wants to put up as his bond |
| _minimumNodeFee | uint256 | Transaction will revert if network commission rate drops below this amount |
| _validatorPubkey | bytes | Pubkey of the validator the node operator wishes to migrate |
| _validatorSignature | bytes | Signature from the validator over the deposit data |
| _depositDataRoot | bytes32 | The hash tree root of the deposit data (passed onto the deposit contract on pre stake) |
| _salt | uint256 | Salt used to deterministically construct the minipool's address |
| _expectedMinipoolAddress | address | The expected deterministic minipool address. Will revert if it doesn't match |

### isValidDepositAmount

```solidity
function isValidDepositAmount(uint256 _amount) public pure returns (bool)
```

Returns true if the given amount is a valid deposit amount

### getDepositAmounts

```solidity
function getDepositAmounts() external pure returns (uint256[])
```

Returns an array of valid deposit amounts

### createVacantMinipool

```solidity
function createVacantMinipool(uint256 _bondAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, uint256 _salt, address _expectedMinipoolAddress, uint256 _currentBalance) external
```

Creates a "vacant" minipool which a node operator can use to migrate a validator with a BLS withdrawal credential

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _bondAmount | uint256 | The amount of capital the node operator wants to put up as his bond |
| _minimumNodeFee | uint256 | Transaction will revert if network commission rate drops below this amount |
| _validatorPubkey | bytes | Pubkey of the validator the node operator wishes to migrate |
| _salt | uint256 | Salt used to deterministically construct the minipool's address |
| _expectedMinipoolAddress | address | The expected deterministic minipool address. Will revert if it doesn't match |
| _currentBalance | uint256 | The current balance of the validator on the beaconchain (will be checked by oDAO and scrubbed if not correct) |

### increaseEthMatched

```solidity
function increaseEthMatched(address _nodeAddress, uint256 _amount) external
```

Called by minipools during bond reduction to increase the amount of ETH the node operator has

_Will revert if the new ETH matched amount exceeds the node operators limit_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator's address to increase the ETH matched for |
| _amount | uint256 | The amount to increase the ETH matched |

## RocketMinipoolBase

Contains the initialisation and delegate upgrade logic for minipools

### EtherReceived

```solidity
event EtherReceived(address from, uint256 amount, uint256 time)
```

### DelegateUpgraded

```solidity
event DelegateUpgraded(address oldDelegate, address newDelegate, uint256 time)
```

### DelegateRolledBack

```solidity
event DelegateRolledBack(address oldDelegate, address newDelegate, uint256 time)
```

### self

```solidity
address self
```

### constructor

```solidity
constructor() public
```

### notSelf

```solidity
modifier notSelf()
```

_Prevent direct calls to this contract_

### onlyMinipoolOwner

```solidity
modifier onlyMinipoolOwner()
```

_Only allow access from the owning node address_

### initialise

```solidity
function initialise(address _rocketStorage, address _nodeAddress) external
```

Sets up starting delegate contract and then delegates initialisation to it

### receive

```solidity
receive() external payable
```

Receive an ETH deposit

### delegateUpgrade

```solidity
function delegateUpgrade() external
```

Upgrade this minipool to the latest network delegate contract

### delegateRollback

```solidity
function delegateRollback() external
```

Rollback to previous delegate contract

### setUseLatestDelegate

```solidity
function setUseLatestDelegate(bool _setting) external
```

Sets the flag to automatically use the latest delegate contract or not

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _setting | bool | If true, will always use the latest delegate contract |

### getUseLatestDelegate

```solidity
function getUseLatestDelegate() external view returns (bool)
```

Returns true if this minipool always uses the latest delegate contract

### getDelegate

```solidity
function getDelegate() external view returns (address)
```

Returns the address of the minipool's stored delegate

### getPreviousDelegate

```solidity
function getPreviousDelegate() external view returns (address)
```

Returns the address of the minipool's previous delegate (or address(0) if not set)

### getEffectiveDelegate

```solidity
function getEffectiveDelegate() external view returns (address)
```

Returns the delegate which will be used when calling this minipool taking into account useLatestDelegate setting

### fallback

```solidity
fallback(bytes _input) external payable returns (bytes)
```

Delegates all calls to minipool delegate contract (or latest if flag is set)

## RocketMinipoolBondReducer

Handles bond reduction window and trusted node cancellation

### BeginBondReduction

```solidity
event BeginBondReduction(address minipool, uint256 newBondAmount, uint256 time)
```

### CancelReductionVoted

```solidity
event CancelReductionVoted(address minipool, address member, uint256 time)
```

### ReductionCancelled

```solidity
event ReductionCancelled(address minipool, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### beginReduceBondAmount

```solidity
function beginReduceBondAmount(address _minipoolAddress, uint256 _newBondAmount) external
```

Flags a minipool as wanting to reduce collateral, owner can then call `reduceBondAmount` once waiting
        period has elapsed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | Address of the minipool |
| _newBondAmount | uint256 | The new bond amount |

### getReduceBondTime

```solidity
function getReduceBondTime(address _minipoolAddress) external view returns (uint256)
```

Returns the timestamp of when a given minipool began their bond reduction waiting period

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | Address of the minipool to query |

### getReduceBondValue

```solidity
function getReduceBondValue(address _minipoolAddress) external view returns (uint256)
```

Returns the new bond that a given minipool has indicated they are reducing to

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | Address of the minipool to query |

### getReduceBondCancelled

```solidity
function getReduceBondCancelled(address _minipoolAddress) public view returns (bool)
```

Returns true if the given minipool has had it's bond reduction cancelled by the oDAO

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | Address of the minipool to query |

### canReduceBondAmount

```solidity
function canReduceBondAmount(address _minipoolAddress) public view returns (bool)
```

Returns whether owner of given minipool can reduce bond amount given the waiting period constraint

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | Address of the minipool |

### voteCancelReduction

```solidity
function voteCancelReduction(address _minipoolAddress) external
```

Can be called by trusted nodes to cancel a reduction in bond if the validator has too low of a balance

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | Address of the minipool |

### reduceBondAmount

```solidity
function reduceBondAmount() external returns (uint256)
```

Called by minipools when they are reducing bond to handle state changes outside the minipool

### getLastBondReductionTime

```solidity
function getLastBondReductionTime(address _minipoolAddress) external view returns (uint256)
```

Returns a timestamp of when the given minipool last performed a bond reduction

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | The address of the minipool to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Unix timestamp of last bond reduction (or 0 if never reduced) |

### getLastBondReductionPrevValue

```solidity
function getLastBondReductionPrevValue(address _minipoolAddress) external view returns (uint256)
```

Returns the previous bond value of the given minipool on their last bond reduction

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | The address of the minipool to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Previous bond value in wei (or 0 if never reduced) |

### getLastBondReductionPrevNodeFee

```solidity
function getLastBondReductionPrevNodeFee(address _minipoolAddress) external view returns (uint256)
```

Returns the previous node fee of the given minipool on their last bond reduction

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | The address of the minipool to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Previous node fee |

## RocketMinipoolDelegate

Provides the logic for each individual minipool in the Rocket Pool network

_Minipools exclusively DELEGATECALL into this contract it is never called directly_

### version

```solidity
uint8 version
```

### calcBase

```solidity
uint256 calcBase
```

### legacyPrelaunchAmount

```solidity
uint256 legacyPrelaunchAmount
```

### StatusUpdated

```solidity
event StatusUpdated(uint8 status, uint256 time)
```

### ScrubVoted

```solidity
event ScrubVoted(address member, uint256 time)
```

### BondReduced

```solidity
event BondReduced(uint256 previousBondAmount, uint256 newBondAmount, uint256 time)
```

### MinipoolScrubbed

```solidity
event MinipoolScrubbed(uint256 time)
```

### MinipoolPrestaked

```solidity
event MinipoolPrestaked(bytes validatorPubkey, bytes validatorSignature, bytes32 depositDataRoot, uint256 amount, bytes withdrawalCredentials, uint256 time)
```

### MinipoolPromoted

```solidity
event MinipoolPromoted(uint256 time)
```

### MinipoolVacancyPrepared

```solidity
event MinipoolVacancyPrepared(uint256 bondAmount, uint256 currentBalance, uint256 time)
```

### EtherDeposited

```solidity
event EtherDeposited(address from, uint256 amount, uint256 time)
```

### EtherWithdrawn

```solidity
event EtherWithdrawn(address to, uint256 amount, uint256 time)
```

### EtherWithdrawalProcessed

```solidity
event EtherWithdrawalProcessed(address executed, uint256 nodeAmount, uint256 userAmount, uint256 totalBalance, uint256 time)
```

### getStatus

```solidity
function getStatus() external view returns (enum MinipoolStatus)
```

### getFinalised

```solidity
function getFinalised() external view returns (bool)
```

### getStatusBlock

```solidity
function getStatusBlock() external view returns (uint256)
```

### getStatusTime

```solidity
function getStatusTime() external view returns (uint256)
```

### getScrubVoted

```solidity
function getScrubVoted(address _member) external view returns (bool)
```

### getDepositType

```solidity
function getDepositType() external view returns (enum MinipoolDeposit)
```

### getNodeAddress

```solidity
function getNodeAddress() external view returns (address)
```

### getNodeFee

```solidity
function getNodeFee() external view returns (uint256)
```

### getNodeDepositBalance

```solidity
function getNodeDepositBalance() external view returns (uint256)
```

### getNodeRefundBalance

```solidity
function getNodeRefundBalance() external view returns (uint256)
```

### getNodeDepositAssigned

```solidity
function getNodeDepositAssigned() external view returns (bool)
```

### getPreLaunchValue

```solidity
function getPreLaunchValue() external view returns (uint256)
```

### getNodeTopUpValue

```solidity
function getNodeTopUpValue() external view returns (uint256)
```

### getVacant

```solidity
function getVacant() external view returns (bool)
```

### getPreMigrationBalance

```solidity
function getPreMigrationBalance() external view returns (uint256)
```

### getUserDistributed

```solidity
function getUserDistributed() external view returns (bool)
```

### getUserDepositBalance

```solidity
function getUserDepositBalance() public view returns (uint256)
```

### getUserDepositAssigned

```solidity
function getUserDepositAssigned() external view returns (bool)
```

### getUserDepositAssignedTime

```solidity
function getUserDepositAssignedTime() external view returns (uint256)
```

### getTotalScrubVotes

```solidity
function getTotalScrubVotes() external view returns (uint256)
```

### onlyInitialised

```solidity
modifier onlyInitialised()
```

_Prevent direct calls to this contract_

### onlyUninitialised

```solidity
modifier onlyUninitialised()
```

_Prevent multiple calls to initialise_

### onlyMinipoolOwner

```solidity
modifier onlyMinipoolOwner(address _nodeAddress)
```

_Only allow access from the owning node address_

### onlyMinipoolOwnerOrWithdrawalAddress

```solidity
modifier onlyMinipoolOwnerOrWithdrawalAddress(address _nodeAddress)
```

_Only allow access from the owning node address or their withdrawal address_

### onlyLatestContract

```solidity
modifier onlyLatestContract(string _contractName, address _contractAddress)
```

_Only allow access from the latest version of the specified Rocket Pool contract_

### initialise

```solidity
function initialise(address _nodeAddress) external
```

_Called once on creation to initialise starting state_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator who will own this minipool |

### preDeposit

```solidity
function preDeposit(uint256 _bondValue, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot) external payable
```

Performs the initial pre-stake on the beacon chain to set the withdrawal credentials

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _bondValue | uint256 | The amount of the stake which will be provided by the node operator |
| _validatorPubkey | bytes | The public key of the validator |
| _validatorSignature | bytes | A signature over the deposit message object |
| _depositDataRoot | bytes32 | The hash tree root of the deposit data object |

### deposit

```solidity
function deposit() external payable
```

Performs the second deposit which provides the validator with the remaining balance to become active

### userDeposit

```solidity
function userDeposit() external payable
```

Assign user deposited ETH to the minipool and mark it as prelaunch

_No longer used in "Variable" type minipools (only retained for legacy minipools still in queue)_

### refund

```solidity
function refund() external
```

Refund node ETH refinanced from user deposited ETH

### slash

```solidity
function slash() external
```

Called to slash node operator's RPL balance if withdrawal balance was less than user deposit

### canStake

```solidity
function canStake() external view returns (bool)
```

Returns true when `stake()` can be called by node operator taking into consideration the scrub period

### canPromote

```solidity
function canPromote() external view returns (bool)
```

Returns true when `promote()` can be called by node operator taking into consideration the scrub period

### stake

```solidity
function stake(bytes _validatorSignature, bytes32 _depositDataRoot) external
```

Progress the minipool to staking, sending its ETH deposit to the deposit contract. Only accepts calls from the minipool owner (node) while in prelaunch and once scrub period has ended

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _validatorSignature | bytes | A signature over the deposit message object |
| _depositDataRoot | bytes32 | The hash tree root of the deposit data object |

### prepareVacancy

```solidity
function prepareVacancy(uint256 _bondAmount, uint256 _currentBalance) external
```

_Sets the bond value and vacancy flag on this minipool_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _bondAmount | uint256 | The bond amount selected by the node operator |
| _currentBalance | uint256 | The current balance of the validator on the beaconchain (will be checked by oDAO and scrubbed if not correct) |

### promote

```solidity
function promote() external
```

_Promotes this minipool to a complete minipool_

### preStake

```solidity
function preStake(bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot) internal
```

_Stakes the balance of this minipool into the deposit contract to set withdrawal credentials to this contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _validatorPubkey | bytes |  |
| _validatorSignature | bytes | A signature over the deposit message object |
| _depositDataRoot | bytes32 | The hash tree root of the deposit data object |

### distributeBalance

```solidity
function distributeBalance(bool _rewardsOnly) external
```

Distributes the contract's balance.
        If balance is greater or equal to 8 ETH, the NO can call to distribute capital and finalise the minipool.
        If balance is greater or equal to 8 ETH, users who have called `beginUserDistribute` and waited the required
        amount of time can call to distribute capital.
        If balance is lower than 8 ETH, can be called by anyone and is considered a partial withdrawal and funds are
        split as rewards.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardsOnly | bool | If set to true, will revert if balance is not being treated as rewards |

### distributeToOwner

```solidity
function distributeToOwner() internal
```

_Distribute the entire balance to the minipool owner_

### beginUserDistribute

```solidity
function beginUserDistribute() external
```

Allows a user (other than the owner of this minipool) to signal they want to call distribute.
        After waiting the required period, anyone may then call `distributeBalance()`.

### userDistributeAllowed

```solidity
function userDistributeAllowed() public view returns (bool)
```

Returns true if enough time has passed for a user to distribute

### finalise

```solidity
function finalise() external
```

Allows the owner of this minipool to finalise it after a user has manually distributed the balance

### calculateNodeShare

```solidity
function calculateNodeShare(uint256 _balance) public view returns (uint256)
```

Given a balance, this function returns what portion of it belongs to the node taking into
consideration the 8 ether reward threshold, the minipool's commission rate and any penalties it may have
attracted. Another way of describing this function is that if this contract's balance was
`_balance + nodeRefundBalance` this function would return how much of that balance would be paid to the node
operator if a distribution occurred

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _balance | uint256 | The balance to calculate the node share of. Should exclude nodeRefundBalance |

### calculateUserShare

```solidity
function calculateUserShare(uint256 _balance) external view returns (uint256)
```

Performs the same calculation as `calculateNodeShare` but on the user side

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _balance | uint256 | The balance to calculate the node share of. Should exclude nodeRefundBalance |

### _calculateNodeShare

```solidity
function _calculateNodeShare(uint256 _balance) internal view returns (uint256)
```

_Given a balance, this function returns what portion of it belongs to the node taking into
consideration the minipool's commission rate and any penalties it may have attracted_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _balance | uint256 | The balance to calculate the node share of (with nodeRefundBalance already subtracted) |

### calculateNodeRewards

```solidity
function calculateNodeRewards(uint256 _nodeCapital, uint256 _userCapital, uint256 _rewards) internal view returns (uint256)
```

_Calculates what portion of rewards should be paid to the node operator given a capital ratio_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeCapital | uint256 | The node supplied portion of the capital |
| _userCapital | uint256 | The user supplied portion of the capital |
| _rewards | uint256 | The amount of rewards to split |

### dissolve

```solidity
function dissolve() external
```

Dissolve the minipool, returning user deposited ETH to the deposit pool.

### close

```solidity
function close() external
```

Withdraw node balances from the minipool and close it. Only accepts calls from the owner

### voteScrub

```solidity
function voteScrub() external
```

Can be called by trusted nodes to scrub this minipool if its withdrawal credentials are not set correctly

### reduceBondAmount

```solidity
function reduceBondAmount() external
```

Reduces the ETH bond amount and credits the owner the difference

### distributeSkimmedRewards

```solidity
function distributeSkimmedRewards() internal
```

_Distributes the current contract balance based on capital ratio and node fee_

## RocketMinipoolFactory

Performs CREATE2 deployment of minipool contracts

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getExpectedAddress

```solidity
function getExpectedAddress(address _nodeOperator, uint256 _salt) external view returns (address)
```

Returns the expected minipool address for a node operator given a user-defined salt

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeOperator | address |  |
| _salt | uint256 | The salt used in minipool creation |

### deployContract

```solidity
function deployContract(address _nodeAddress, uint256 _salt) external returns (address)
```

Performs a CREATE2 deployment of a minipool contract with given salt

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | Owning node operator's address |
| _salt | uint256 | A salt used in determining minipool address |

## RocketMinipoolManager

Minipool creation, removal and management

### MinipoolCreated

```solidity
event MinipoolCreated(address minipool, address node, uint256 time)
```

### MinipoolDestroyed

```solidity
event MinipoolDestroyed(address minipool, address node, uint256 time)
```

### BeginBondReduction

```solidity
event BeginBondReduction(address minipool, uint256 time)
```

### CancelReductionVoted

```solidity
event CancelReductionVoted(address minipool, address member, uint256 time)
```

### ReductionCancelled

```solidity
event ReductionCancelled(address minipool, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getMinipoolCount

```solidity
function getMinipoolCount() public view returns (uint256)
```

Get the number of minipools in the network

### getStakingMinipoolCount

```solidity
function getStakingMinipoolCount() public view returns (uint256)
```

Get the number of minipools in the network in the Staking state

### getFinalisedMinipoolCount

```solidity
function getFinalisedMinipoolCount() external view returns (uint256)
```

Get the number of finalised minipools in the network

### getActiveMinipoolCount

```solidity
function getActiveMinipoolCount() public view returns (uint256)
```

Get the number of active minipools in the network

### getMinipoolRPLSlashed

```solidity
function getMinipoolRPLSlashed(address _minipoolAddress) external view returns (bool)
```

Returns true if a minipool has had an RPL slashing

### getMinipoolCountPerStatus

```solidity
function getMinipoolCountPerStatus(uint256 _offset, uint256 _limit) external view returns (uint256 initialisedCount, uint256 prelaunchCount, uint256 stakingCount, uint256 withdrawableCount, uint256 dissolvedCount)
```

Get the number of minipools in each status.
        Returns the counts for Initialised, Prelaunch, Staking, Withdrawable, and Dissolved in that order.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _offset | uint256 | The offset into the minipool set to start |
| _limit | uint256 | The maximum number of minipools to iterate |

### getPrelaunchMinipools

```solidity
function getPrelaunchMinipools(uint256 _offset, uint256 _limit) external view returns (address[])
```

Returns an array of all minipools in the prelaunch state

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _offset | uint256 | The offset into the minipool set to start iterating |
| _limit | uint256 | The maximum number of minipools to iterate over |

### getMinipoolAt

```solidity
function getMinipoolAt(uint256 _index) external view returns (address)
```

Get a network minipool address by index

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | Index into the minipool set to return |

### getNodeMinipoolCount

```solidity
function getNodeMinipoolCount(address _nodeAddress) external view returns (uint256)
```

Get the number of minipools owned by a node

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to query the count of minipools of |

### getNodeActiveMinipoolCount

```solidity
function getNodeActiveMinipoolCount(address _nodeAddress) public view returns (uint256)
```

Get the number of minipools owned by a node that are not finalised

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to query the count of active minipools of |

### getNodeFinalisedMinipoolCount

```solidity
function getNodeFinalisedMinipoolCount(address _nodeAddress) external view returns (uint256)
```

Get the number of minipools owned by a node that are finalised

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to query the count of finalised minipools of |

### getNodeStakingMinipoolCount

```solidity
function getNodeStakingMinipoolCount(address _nodeAddress) public view returns (uint256)
```

Get the number of minipools owned by a node that are in staking status

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to query the count of staking minipools of |

### getNodeStakingMinipoolCountBySize

```solidity
function getNodeStakingMinipoolCountBySize(address _nodeAddress, uint256 _depositSize) public view returns (uint256)
```

Get the number of minipools owned by a node that are in staking status

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to query the count of minipools by desposit size of |
| _depositSize | uint256 | The deposit size to filter result by |

### getNodeMinipoolAt

```solidity
function getNodeMinipoolAt(address _nodeAddress, uint256 _index) external view returns (address)
```

Get a node minipool address by index

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to query the minipool of |
| _index | uint256 | Index into the node operator's set of minipools |

### getNodeValidatingMinipoolCount

```solidity
function getNodeValidatingMinipoolCount(address _nodeAddress) external view returns (uint256)
```

Get the number of validating minipools owned by a node

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to query the count of validating minipools of |

### getNodeValidatingMinipoolAt

```solidity
function getNodeValidatingMinipoolAt(address _nodeAddress, uint256 _index) external view returns (address)
```

Get a validating node minipool address by index

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to query the validating minipool of |
| _index | uint256 | Index into the node operator's set of validating minipools |

### getMinipoolByPubkey

```solidity
function getMinipoolByPubkey(bytes _pubkey) public view returns (address)
```

Get a minipool address by validator pubkey

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _pubkey | bytes | The pubkey to query |

### getMinipoolExists

```solidity
function getMinipoolExists(address _minipoolAddress) public view returns (bool)
```

Returns true if a minipool exists

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | The address of the minipool to check the existence of |

### getMinipoolDestroyed

```solidity
function getMinipoolDestroyed(address _minipoolAddress) external view returns (bool)
```

Returns true if a minipool previously existed at the given address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | The address to check the previous existence of a minipool at |

### getMinipoolPubkey

```solidity
function getMinipoolPubkey(address _minipoolAddress) public view returns (bytes)
```

Returns a minipool's validator pubkey

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | The minipool to query the pubkey of |

### getMinipoolWithdrawalCredentials

```solidity
function getMinipoolWithdrawalCredentials(address _minipoolAddress) public pure returns (bytes)
```

Calculates what the withdrawal credentials of a minipool should be set to

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | The minipool to calculate the withdrawal credentials for |

### updateNodeStakingMinipoolCount

```solidity
function updateNodeStakingMinipoolCount(uint256 _previousBond, uint256 _newBond, uint256 _previousFee, uint256 _newFee) external
```

Decrements a node operator's number of staking minipools based on the minipools prior bond amount and
        increments it based on their new bond amount.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _previousBond | uint256 | The minipool's previous bond value |
| _newBond | uint256 | The minipool's new bond value |
| _previousFee | uint256 | The fee of the minipool prior to the bond change |
| _newFee | uint256 | The fee of the minipool after the bond change |

### incrementNodeStakingMinipoolCount

```solidity
function incrementNodeStakingMinipoolCount(address _nodeAddress) external
```

_Increments a node operator's number of staking minipools and calculates updated average node fee.
     Must be called from the minipool itself as msg.sender is used to query the minipool's node fee_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node address to increment the number of staking minipools of |

### decrementNodeStakingMinipoolCount

```solidity
function decrementNodeStakingMinipoolCount(address _nodeAddress) external
```

_Decrements a node operator's number of minipools in staking status and calculates updated average node fee.
     Must be called from the minipool itself as msg.sender is used to query the minipool's node fee_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node address to decrement the number of staking minipools of |

### _tryDistribute

```solidity
function _tryDistribute(address _nodeAddress) internal
```

_Calls distribute on the given node's distributor if it has a balance and has been initialised_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to try distribute rewards for |

### incrementNodeFinalisedMinipoolCount

```solidity
function incrementNodeFinalisedMinipoolCount(address _nodeAddress) external
```

_Increments a node operator's number of minipools that have been finalised_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator to increment finalised minipool count for |

### createMinipool

```solidity
function createMinipool(address _nodeAddress, uint256 _salt) public returns (contract RocketMinipoolInterface)
```

_Create a minipool. Only accepts calls from the RocketNodeDeposit contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The owning node operator's address |
| _salt | uint256 | A salt used in determining the minipool's address |

### createVacantMinipool

```solidity
function createVacantMinipool(address _nodeAddress, uint256 _salt, bytes _validatorPubkey, uint256 _bondAmount, uint256 _currentBalance) external returns (contract RocketMinipoolInterface)
```

Creates a vacant minipool that can be promoted by changing the given validator's withdrawal credentials

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | Address of the owning node operator |
| _salt | uint256 | A salt used in determining the minipool's address |
| _validatorPubkey | bytes | A validator pubkey that the node operator intends to migrate the withdrawal credentials of |
| _bondAmount | uint256 | The bond amount selected by the node operator |
| _currentBalance | uint256 | The current balance of the validator on the beaconchain (will be checked by oDAO and scrubbed if not correct) |

### removeVacantMinipool

```solidity
function removeVacantMinipool() external
```

_Called by minipool to remove from vacant set on promotion or dissolution_

### getVacantMinipoolCount

```solidity
function getVacantMinipoolCount() external view returns (uint256)
```

Returns the number of minipools in the vacant minipool set

### getVacantMinipoolAt

```solidity
function getVacantMinipoolAt(uint256 _index) external view returns (address)
```

Returns the vacant minipool at a given index

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index into the vacant minipool set to retrieve |

### destroyMinipool

```solidity
function destroyMinipool() external
```

_Destroy a minipool cleaning up all relevant state. Only accepts calls from registered minipools_

### setMinipoolPubkey

```solidity
function setMinipoolPubkey(bytes _pubkey) public
```

_Set a minipool's validator pubkey. Only accepts calls from registered minipools_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _pubkey | bytes | The pubkey to set for the calling minipool |

### getMinipoolDepositType

```solidity
function getMinipoolDepositType(address _minipoolAddress) external view returns (enum MinipoolDeposit)
```

_Wrapper around minipool getDepositType which handles backwards compatibility with v1 and v2 delegates_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipoolAddress | address | Minipool address to get the deposit type of |

## RocketMinipoolPenalty

### MaxPenaltyRateUpdated

```solidity
event MaxPenaltyRateUpdated(uint256 rate, uint256 time)
```

### maxPenaltyRate

```solidity
uint256 maxPenaltyRate
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### setMaxPenaltyRate

```solidity
function setMaxPenaltyRate(uint256 _rate) external
```

### getMaxPenaltyRate

```solidity
function getMaxPenaltyRate() external view returns (uint256)
```

### getPenaltyRate

```solidity
function getPenaltyRate(address _minipoolAddress) external view returns (uint256)
```

### setPenaltyRate

```solidity
function setPenaltyRate(address _minipoolAddress, uint256 _rate) external
```

## RocketMinipoolQueue

Minipool queueing for deposit assignment

### MinipoolEnqueued

```solidity
event MinipoolEnqueued(address minipool, bytes32 queueId, uint256 time)
```

### MinipoolDequeued

```solidity
event MinipoolDequeued(address minipool, bytes32 queueId, uint256 time)
```

### MinipoolRemoved

```solidity
event MinipoolRemoved(address minipool, bytes32 queueId, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getTotalLength

```solidity
function getTotalLength() external view returns (uint256)
```

Get the total combined length of the queues

### getContainsLegacy

```solidity
function getContainsLegacy() external view returns (bool)
```

Returns true if there are any legacy minipools in the queue

### getLengthLegacy

```solidity
function getLengthLegacy(enum MinipoolDeposit _depositType) external view returns (uint256)
```

Get the length of a given queue. Returns 0 for invalid queues

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _depositType | enum MinipoolDeposit | Which queue to query the length of |

### getLength

```solidity
function getLength() public view returns (uint256)
```

Gets the length of the variable (global) queue

### getTotalCapacity

```solidity
function getTotalCapacity() external view returns (uint256)
```

Get the total combined capacity of the queues

### getEffectiveCapacity

```solidity
function getEffectiveCapacity() external view returns (uint256)
```

Get the total effective capacity of the queues (used in node demand calculation)

### getVariableCapacity

```solidity
function getVariableCapacity() internal view returns (uint256)
```

_Get the ETH capacity of the variable queue_

### getNextCapacityLegacy

```solidity
function getNextCapacityLegacy() external view returns (uint256)
```

Get the capacity of the next available minipool. Returns 0 if no minipools are available

### getNextDepositLegacy

```solidity
function getNextDepositLegacy() external view returns (enum MinipoolDeposit, uint256)
```

Get the deposit type of the next available minipool and the number of deposits in that queue.
        Returns None if no minipools are available

### enqueueMinipool

```solidity
function enqueueMinipool(address _minipool) external
```

_Add a minipool to the end of the appropriate queue. Only accepts calls from the RocketMinipoolManager contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipool | address | Address of the minipool to add to the queue |

### dequeueMinipoolByDepositLegacy

```solidity
function dequeueMinipoolByDepositLegacy(enum MinipoolDeposit _depositType) external returns (address minipoolAddress)
```

_Dequeues a minipool from a legacy queue_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _depositType | enum MinipoolDeposit | The queue to dequeue a minipool from |

### dequeueMinipools

```solidity
function dequeueMinipools(uint256 _maxToDequeue) external returns (address[] minipoolAddress)
```

_Dequeues multiple minipools from the variable queue and returns them all_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _maxToDequeue | uint256 | The maximum number of items to dequeue |

### removeMinipool

```solidity
function removeMinipool(enum MinipoolDeposit _depositType) external
```

_Remove a minipool from a queue. Only accepts calls from registered minipools_

### getMinipoolAt

```solidity
function getMinipoolAt(uint256 _index) external view returns (address)
```

Returns the minipool address of the minipool in the global queue at a given index

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index into the queue to retrieve |

### getMinipoolPosition

```solidity
function getMinipoolPosition(address _minipool) external view returns (int256)
```

Returns the position a given minipool is in the queue

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minipool | address | The minipool to query the position of |

## RocketMinipoolStorageLayout

### StorageState

```solidity
enum StorageState {
  Undefined,
  Uninitialised,
  Initialised
}
```

### rocketStorage

```solidity
contract RocketStorageInterface rocketStorage
```

### status

```solidity
enum MinipoolStatus status
```

### statusBlock

```solidity
uint256 statusBlock
```

### statusTime

```solidity
uint256 statusTime
```

### withdrawalBlock

```solidity
uint256 withdrawalBlock
```

### depositType

```solidity
enum MinipoolDeposit depositType
```

### nodeAddress

```solidity
address nodeAddress
```

### nodeFee

```solidity
uint256 nodeFee
```

### nodeDepositBalance

```solidity
uint256 nodeDepositBalance
```

### nodeDepositAssigned

```solidity
bool nodeDepositAssigned
```

### nodeRefundBalance

```solidity
uint256 nodeRefundBalance
```

### nodeSlashBalance

```solidity
uint256 nodeSlashBalance
```

### userDepositBalanceLegacy

```solidity
uint256 userDepositBalanceLegacy
```

### userDepositAssignedTime

```solidity
uint256 userDepositAssignedTime
```

### useLatestDelegate

```solidity
bool useLatestDelegate
```

### rocketMinipoolDelegate

```solidity
address rocketMinipoolDelegate
```

### rocketMinipoolDelegatePrev

```solidity
address rocketMinipoolDelegatePrev
```

### rocketTokenRETH

```solidity
address rocketTokenRETH
```

### rocketMinipoolPenalty

```solidity
address rocketMinipoolPenalty
```

### storageState

```solidity
enum RocketMinipoolStorageLayout.StorageState storageState
```

### finalised

```solidity
bool finalised
```

### memberScrubVotes

```solidity
mapping(address => bool) memberScrubVotes
```

### totalScrubVotes

```solidity
uint256 totalScrubVotes
```

### preLaunchValue

```solidity
uint256 preLaunchValue
```

### userDepositBalance

```solidity
uint256 userDepositBalance
```

### vacant

```solidity
bool vacant
```

### preMigrationBalance

```solidity
uint256 preMigrationBalance
```

### userDistributed

```solidity
bool userDistributed
```

### userDistributeTime

```solidity
uint256 userDistributeTime
```

## RocketNetworkBalances

### BalancesSubmitted

```solidity
event BalancesSubmitted(address from, uint256 block, uint256 totalEth, uint256 stakingEth, uint256 rethSupply, uint256 time)
```

### BalancesUpdated

```solidity
event BalancesUpdated(uint256 block, uint256 totalEth, uint256 stakingEth, uint256 rethSupply, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getBalancesBlock

```solidity
function getBalancesBlock() public view returns (uint256)
```

### getTotalETHBalance

```solidity
function getTotalETHBalance() public view returns (uint256)
```

### getStakingETHBalance

```solidity
function getStakingETHBalance() public view returns (uint256)
```

### getTotalRETHSupply

```solidity
function getTotalRETHSupply() external view returns (uint256)
```

### getETHUtilizationRate

```solidity
function getETHUtilizationRate() external view returns (uint256)
```

### submitBalances

```solidity
function submitBalances(uint256 _block, uint256 _totalEth, uint256 _stakingEth, uint256 _rethSupply) external
```

### executeUpdateBalances

```solidity
function executeUpdateBalances(uint256 _block, uint256 _totalEth, uint256 _stakingEth, uint256 _rethSupply) external
```

### getLatestReportableBlock

```solidity
function getLatestReportableBlock() external view returns (uint256)
```

## RocketNetworkFees

Network node demand and commission rate

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getNodeDemand

```solidity
function getNodeDemand() public view returns (int256)
```

Returns the current RP network node demand in ETH
        Node demand is equal to deposit pool balance minus available minipool capacity

### getNodeFee

```solidity
function getNodeFee() external view returns (uint256)
```

Returns the current RP network node fee as a fraction of 1 ETH

### getNodeFeeByDemand

```solidity
function getNodeFeeByDemand(int256 _nodeDemand) public view returns (uint256)
```

Returns the network node fee for a given node demand value

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeDemand | int256 | The node demand to calculate the fee for |

## RocketNetworkPenalties

### PenaltySubmitted

```solidity
event PenaltySubmitted(address from, address minipoolAddress, uint256 block, uint256 time)
```

### PenaltyUpdated

```solidity
event PenaltyUpdated(address minipoolAddress, uint256 penalty, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### submitPenalty

```solidity
function submitPenalty(address _minipoolAddress, uint256 _block) external
```

### executeUpdatePenalty

```solidity
function executeUpdatePenalty(address _minipoolAddress, uint256 _block) external
```

### getPenaltyCount

```solidity
function getPenaltyCount(address _minipoolAddress) external view returns (uint256)
```

## RocketNetworkPrices

Oracle contract for network token price data

### PricesSubmitted

```solidity
event PricesSubmitted(address from, uint256 block, uint256 rplPrice, uint256 time)
```

### PricesUpdated

```solidity
event PricesUpdated(uint256 block, uint256 rplPrice, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getPricesBlock

```solidity
function getPricesBlock() public view returns (uint256)
```

Returns the block number which prices are current for

### getRPLPrice

```solidity
function getRPLPrice() public view returns (uint256)
```

Returns the current network RPL price in ETH

### submitPrices

```solidity
function submitPrices(uint256 _block, uint256 _rplPrice) external
```

Submit network price data for a block
        Only accepts calls from trusted (oracle) nodes

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _block | uint256 | The block this price submission is for |
| _rplPrice | uint256 | The price of RPL at the given block |

### executeUpdatePrices

```solidity
function executeUpdatePrices(uint256 _block, uint256 _rplPrice) external
```

Executes updatePrices if consensus threshold is reached

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _block | uint256 | The block to execute price update for |
| _rplPrice | uint256 | The price of RPL at the given block |

### getLatestReportableBlock

```solidity
function getLatestReportableBlock() external view returns (uint256)
```

Returns the latest block number that oracles should be reporting prices for

## RocketNodeDeposit

Handles node deposits and minipool creation

### DepositReceived

```solidity
event DepositReceived(address from, uint256 amount, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### receive

```solidity
receive() external payable
```

_Accept incoming ETH from the deposit pool_

### getNodeDepositCredit

```solidity
function getNodeDepositCredit(address _nodeOperator) public view returns (uint256)
```

Returns a node operator's credit balance in wei

### increaseDepositCreditBalance

```solidity
function increaseDepositCreditBalance(address _nodeOperator, uint256 _amount) external
```

_Increases a node operators deposit credit balance_

### deposit

```solidity
function deposit(uint256 _bondAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot, uint256 _salt, address _expectedMinipoolAddress) external payable
```

Accept a node deposit and create a new minipool under the node. Only accepts calls from registered nodes

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _bondAmount | uint256 | The amount of capital the node operator wants to put up as his bond |
| _minimumNodeFee | uint256 | Transaction will revert if network commission rate drops below this amount |
| _validatorPubkey | bytes | Pubkey of the validator the node operator wishes to migrate |
| _validatorSignature | bytes | Signature from the validator over the deposit data |
| _depositDataRoot | bytes32 | The hash tree root of the deposit data (passed onto the deposit contract on pre stake) |
| _salt | uint256 | Salt used to deterministically construct the minipool's address |
| _expectedMinipoolAddress | address | The expected deterministic minipool address. Will revert if it doesn't match |

### depositWithCredit

```solidity
function depositWithCredit(uint256 _bondAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot, uint256 _salt, address _expectedMinipoolAddress) external payable
```

Accept a node deposit and create a new minipool under the node. Only accepts calls from registered nodes

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _bondAmount | uint256 | The amount of capital the node operator wants to put up as his bond |
| _minimumNodeFee | uint256 | Transaction will revert if network commission rate drops below this amount |
| _validatorPubkey | bytes | Pubkey of the validator the node operator wishes to migrate |
| _validatorSignature | bytes | Signature from the validator over the deposit data |
| _depositDataRoot | bytes32 | The hash tree root of the deposit data (passed onto the deposit contract on pre stake) |
| _salt | uint256 | Salt used to deterministically construct the minipool's address |
| _expectedMinipoolAddress | address | The expected deterministic minipool address. Will revert if it doesn't match |

### isValidDepositAmount

```solidity
function isValidDepositAmount(uint256 _amount) public pure returns (bool)
```

Returns true if the given amount is a valid deposit amount

### getDepositAmounts

```solidity
function getDepositAmounts() external pure returns (uint256[])
```

Returns an array of valid deposit amounts

### createVacantMinipool

```solidity
function createVacantMinipool(uint256 _bondAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, uint256 _salt, address _expectedMinipoolAddress, uint256 _currentBalance) external
```

Creates a "vacant" minipool which a node operator can use to migrate a validator with a BLS withdrawal credential

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _bondAmount | uint256 | The amount of capital the node operator wants to put up as his bond |
| _minimumNodeFee | uint256 | Transaction will revert if network commission rate drops below this amount |
| _validatorPubkey | bytes | Pubkey of the validator the node operator wishes to migrate |
| _salt | uint256 | Salt used to deterministically construct the minipool's address |
| _expectedMinipoolAddress | address | The expected deterministic minipool address. Will revert if it doesn't match |
| _currentBalance | uint256 | The current balance of the validator on the beaconchain (will be checked by oDAO and scrubbed if not correct) |

### increaseEthMatched

```solidity
function increaseEthMatched(address _nodeAddress, uint256 _amount) external
```

Called by minipools during bond reduction to increase the amount of ETH the node operator has

_Will revert if the new ETH matched amount exceeds the node operators limit_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node operator's address to increase the ETH matched for |
| _amount | uint256 | The amount to increase the ETH matched |

## RocketNodeDistributor

### distributorStorageKey

```solidity
bytes32 distributorStorageKey
```

### constructor

```solidity
constructor(address _nodeAddress, address _rocketStorage) public
```

### receive

```solidity
receive() external payable
```

### fallback

```solidity
fallback() external payable
```

## RocketNodeDistributorDelegate

_Contains the logic for RocketNodeDistributors_

### FeesDistributed

```solidity
event FeesDistributed(address _nodeAddress, uint256 _userAmount, uint256 _nodeAmount, uint256 _time)
```

### version

```solidity
uint8 version
```

### calcBase

```solidity
uint256 calcBase
```

### rocketNodeManagerKey

```solidity
bytes32 rocketNodeManagerKey
```

### rocketNodeStakingKey

```solidity
bytes32 rocketNodeStakingKey
```

### rocketTokenRETHKey

```solidity
bytes32 rocketTokenRETHKey
```

### nonReentrant

```solidity
modifier nonReentrant()
```

### constructor

```solidity
constructor() public
```

### getNodeShare

```solidity
function getNodeShare() public view returns (uint256)
```

Returns the portion of the contract's balance that belongs to the node operator

### getUserShare

```solidity
function getUserShare() external view returns (uint256)
```

Returns the portion of the contract's balance that belongs to the users

### distribute

```solidity
function distribute() external
```

Distributes the balance of this contract to its owners

## RocketNodeDistributorFactory

### ProxyCreated

```solidity
event ProxyCreated(address _address)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getProxyBytecode

```solidity
function getProxyBytecode() public pure returns (bytes)
```

### getProxyAddress

```solidity
function getProxyAddress(address _nodeAddress) external view returns (address)
```

### createProxy

```solidity
function createProxy(address _nodeAddress) external
```

## RocketNodeDistributorStorageLayout

### rocketStorage

```solidity
contract RocketStorageInterface rocketStorage
```

### nodeAddress

```solidity
address nodeAddress
```

### lock

```solidity
uint256 lock
```

## RocketNodeManager

### NodeRegistered

```solidity
event NodeRegistered(address node, uint256 time)
```

### NodeTimezoneLocationSet

```solidity
event NodeTimezoneLocationSet(address node, uint256 time)
```

### NodeRewardNetworkChanged

```solidity
event NodeRewardNetworkChanged(address node, uint256 network)
```

### NodeSmoothingPoolStateChanged

```solidity
event NodeSmoothingPoolStateChanged(address node, bool state)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getNodeCount

```solidity
function getNodeCount() public view returns (uint256)
```

### getNodeCountPerTimezone

```solidity
function getNodeCountPerTimezone(uint256 _offset, uint256 _limit) external view returns (struct RocketNodeManagerInterface.TimezoneCount[])
```

### getNodeAt

```solidity
function getNodeAt(uint256 _index) external view returns (address)
```

### getNodeExists

```solidity
function getNodeExists(address _nodeAddress) public view returns (bool)
```

### getNodeWithdrawalAddress

```solidity
function getNodeWithdrawalAddress(address _nodeAddress) public view returns (address)
```

### getNodePendingWithdrawalAddress

```solidity
function getNodePendingWithdrawalAddress(address _nodeAddress) public view returns (address)
```

### getNodeTimezoneLocation

```solidity
function getNodeTimezoneLocation(address _nodeAddress) public view returns (string)
```

### registerNode

```solidity
function registerNode(string _timezoneLocation) external
```

### getNodeRegistrationTime

```solidity
function getNodeRegistrationTime(address _nodeAddress) public view returns (uint256)
```

### setTimezoneLocation

```solidity
function setTimezoneLocation(string _timezoneLocation) external
```

### getFeeDistributorInitialised

```solidity
function getFeeDistributorInitialised(address _nodeAddress) public view returns (bool)
```

### initialiseFeeDistributor

```solidity
function initialiseFeeDistributor() external
```

### _initialiseFeeDistributor

```solidity
function _initialiseFeeDistributor(address _nodeAddress) internal
```

### getAverageNodeFee

```solidity
function getAverageNodeFee(address _nodeAddress) external view returns (uint256)
```

### setRewardNetwork

```solidity
function setRewardNetwork(address _nodeAddress, uint256 _network) external
```

### getRewardNetwork

```solidity
function getRewardNetwork(address _nodeAddress) public view returns (uint256)
```

### setSmoothingPoolRegistrationState

```solidity
function setSmoothingPoolRegistrationState(bool _state) external
```

### getSmoothingPoolRegistrationState

```solidity
function getSmoothingPoolRegistrationState(address _nodeAddress) public view returns (bool)
```

### getSmoothingPoolRegistrationChanged

```solidity
function getSmoothingPoolRegistrationChanged(address _nodeAddress) external view returns (uint256)
```

### getSmoothingPoolRegisteredNodeCount

```solidity
function getSmoothingPoolRegisteredNodeCount(uint256 _offset, uint256 _limit) external view returns (uint256)
```

### getNodeDetails

```solidity
function getNodeDetails(address _nodeAddress) public view returns (struct NodeDetails nodeDetails)
```

Convenience function to return all on-chain details about a given node

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | Address of the node to query details for |

### getNodeAddresses

```solidity
function getNodeAddresses(uint256 _offset, uint256 _limit) external view returns (address[])
```

Returns a slice of the node operator address set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _offset | uint256 | The starting point into the slice |
| _limit | uint256 | The maximum number of results to return |

## RocketNodeStaking

Handles node deposits and minipool creation

### RPLStaked

```solidity
event RPLStaked(address from, uint256 amount, uint256 time)
```

### RPLWithdrawn

```solidity
event RPLWithdrawn(address to, uint256 amount, uint256 time)
```

### RPLSlashed

```solidity
event RPLSlashed(address node, uint256 amount, uint256 ethValue, uint256 time)
```

### StakeRPLForAllowed

```solidity
event StakeRPLForAllowed(address node, address caller, bool allowed, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getTotalRPLStake

```solidity
function getTotalRPLStake() external view returns (uint256)
```

Returns the total quantity of RPL staked on the network

### getNodeRPLStake

```solidity
function getNodeRPLStake(address _nodeAddress) public view returns (uint256)
```

Returns the amount a given node operator has staked

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to query |

### getNodeETHMatched

```solidity
function getNodeETHMatched(address _nodeAddress) public view returns (uint256)
```

Returns a node's matched ETH amount (amount taken from protocol to stake)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to query |

### getNodeETHProvided

```solidity
function getNodeETHProvided(address _nodeAddress) public view returns (uint256)
```

Returns a node's provided ETH amount (amount supplied to create minipools)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to query |

### getNodeETHCollateralisationRatio

```solidity
function getNodeETHCollateralisationRatio(address _nodeAddress) public view returns (uint256)
```

Returns the ratio between capital taken from users and provided by a node operator.
        The value is a 1e18 precision fixed point integer value of (node capital + user capital) / node capital.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to query |

### getNodeRPLStakedTime

```solidity
function getNodeRPLStakedTime(address _nodeAddress) public view returns (uint256)
```

Returns the timestamp at which a node last staked RPL

### getNodeEffectiveRPLStake

```solidity
function getNodeEffectiveRPLStake(address _nodeAddress) external view returns (uint256)
```

Calculate and return a node's effective RPL stake amount

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to calculate for |

### getNodeMinimumRPLStake

```solidity
function getNodeMinimumRPLStake(address _nodeAddress) external view returns (uint256)
```

Calculate and return a node's minimum RPL stake to collateralize their minipools

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to calculate for |

### getNodeMaximumRPLStake

```solidity
function getNodeMaximumRPLStake(address _nodeAddress) public view returns (uint256)
```

Calculate and return a node's maximum RPL stake to fully collateralise their minipools

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to calculate for |

### getNodeETHMatchedLimit

```solidity
function getNodeETHMatchedLimit(address _nodeAddress) external view returns (uint256)
```

Calculate and return a node's limit of how much user ETH they can use based on RPL stake

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to calculate for |

### stakeRPL

```solidity
function stakeRPL(uint256 _amount) external
```

Accept an RPL stake
        Only accepts calls from registered nodes
        Requires call to have approved this contract to spend RPL

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | The amount of RPL to stake |

### stakeRPLFor

```solidity
function stakeRPLFor(address _nodeAddress, uint256 _amount) external
```

Accept an RPL stake from any address for a specified node
        Requires caller to have approved this contract to spend RPL
        Requires caller to be on the node operator's allow list (see `setStakeForAllowed`)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to stake on behalf of |
| _amount | uint256 | The amount of RPL to stake |

### setStakeRPLForAllowed

```solidity
function setStakeRPLForAllowed(address _caller, bool _allowed) external
```

Explicitly allow or remove allowance of an address to be able to stake on behalf of a node

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _caller | address | The address you wish to allow |
| _allowed | bool | Whether the address is allowed or denied |

### _stakeRPL

```solidity
function _stakeRPL(address _nodeAddress, uint256 _amount) internal
```

_Internal logic for staking RPL_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address to increase the RPL stake of |
| _amount | uint256 | The amount of RPL to stake |

### withdrawRPL

```solidity
function withdrawRPL(uint256 _amount) external
```

Withdraw staked RPL back to the node account
        Only accepts calls from registered nodes or their respective withdrawal addresses
        Withdraws to withdrawal address if set, otherwise defaults to node address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | The amount of RPL to withdraw |

### slashRPL

```solidity
function slashRPL(address _nodeAddress, uint256 _ethSlashAmount) external
```

Slash a node's RPL by an ETH amount
        Only accepts calls from registered minipools

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address to slash RPL from |
| _ethSlashAmount | uint256 | The amount of RPL to slash denominated in ETH value |

## RocketClaimDAO

### RPLTokensSentByDAOProtocol

```solidity
event RPLTokensSentByDAOProtocol(string invoiceID, address from, address to, uint256 amount, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### spend

```solidity
function spend(string _invoiceID, address _recipientAddress, uint256 _amount) external
```

## RocketMerkleDistributorMainnet

### RewardsClaimed

```solidity
event RewardsClaimed(address claimer, uint256[] rewardIndex, uint256[] amountRPL, uint256[] amountETH)
```

### network

```solidity
uint256 network
```

### rocketVaultKey

```solidity
bytes32 rocketVaultKey
```

### rocketTokenRPLKey

```solidity
bytes32 rocketTokenRPLKey
```

### receive

```solidity
receive() external payable
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### relayRewards

```solidity
function relayRewards(uint256 _rewardIndex, bytes32 _root, uint256 _rewardsRPL, uint256 _rewardsETH) external
```

### claim

```solidity
function claim(address _nodeAddress, uint256[] _rewardIndex, uint256[] _amountRPL, uint256[] _amountETH, bytes32[][] _merkleProof) external
```

### claimAndStake

```solidity
function claimAndStake(address _nodeAddress, uint256[] _rewardIndex, uint256[] _amountRPL, uint256[] _amountETH, bytes32[][] _merkleProof, uint256 _stakeAmount) public
```

### _claim

```solidity
function _claim(uint256[] _rewardIndex, address _nodeAddress, uint256[] _amountRPL, uint256[] _amountETH, bytes32[][] _merkleProof) internal
```

### _verifyProof

```solidity
function _verifyProof(uint256 _rewardIndex, address _nodeAddress, uint256 _amountRPL, uint256 _amountETH, bytes32[] _merkleProof) internal view returns (bool)
```

### isClaimed

```solidity
function isClaimed(uint256 _rewardIndex, address _claimer) public view returns (bool)
```

### receiveVaultWithdrawalETH

```solidity
function receiveVaultWithdrawalETH() external payable
```

## RocketRewardsPool

### RewardSnapshotSubmitted

```solidity
event RewardSnapshotSubmitted(address from, uint256 rewardIndex, struct RewardSubmission submission, uint256 time)
```

### RewardSnapshot

```solidity
event RewardSnapshot(uint256 rewardIndex, struct RewardSubmission submission, uint256 intervalStartTime, uint256 intervalEndTime, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getRewardIndex

```solidity
function getRewardIndex() public view returns (uint256)
```

### getRPLBalance

```solidity
function getRPLBalance() public view returns (uint256)
```

Get how much RPL the Rewards Pool contract currently has assigned to it as a whole

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 Returns rpl balance of rocket rewards contract |

### getPendingRPLRewards

```solidity
function getPendingRPLRewards() public view returns (uint256)
```

### getPendingETHRewards

```solidity
function getPendingETHRewards() public view returns (uint256)
```

### getClaimIntervalTimeStart

```solidity
function getClaimIntervalTimeStart() public view returns (uint256)
```

Get the last set interval start time

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 Last set start timestamp for a claim interval |

### getClaimIntervalTime

```solidity
function getClaimIntervalTime() public view returns (uint256)
```

Get how many seconds in a claim interval

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 Number of seconds in a claim interval |

### getClaimIntervalsPassed

```solidity
function getClaimIntervalsPassed() public view returns (uint256)
```

Compute intervals since last claim period

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 Time intervals since last update |

### getClaimIntervalExecutionBlock

```solidity
function getClaimIntervalExecutionBlock(uint256 _interval) external view returns (uint256)
```

Returns the block number that the given claim interval was executed at

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _interval | uint256 | The interval for which to grab the execution block of |

### getClaimingContractPerc

```solidity
function getClaimingContractPerc(string _claimingContract) public view returns (uint256)
```

Get the percentage this contract can claim in this interval

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 Rewards percentage this contract can claim in this interval |

### getClaimingContractsPerc

```solidity
function getClaimingContractsPerc(string[] _claimingContracts) external view returns (uint256[])
```

Get an array of percentages that the given contracts can claim in this interval

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | uint256[] Array of percentages in the order of the supplied contract names |

### getTrustedNodeSubmitted

```solidity
function getTrustedNodeSubmitted(address _trustedNodeAddress, uint256 _rewardIndex) external view returns (bool)
```

### getSubmissionCount

```solidity
function getSubmissionCount(struct RewardSubmission _submission) external view returns (uint256)
```

### submitRewardSnapshot

```solidity
function submitRewardSnapshot(struct RewardSubmission _submission) external
```

### executeRewardSnapshot

```solidity
function executeRewardSnapshot(struct RewardSubmission _submission) external
```

## RocketSmoothingPool

### EtherWithdrawn

```solidity
event EtherWithdrawn(string by, address to, uint256 amount, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### receive

```solidity
receive() external payable
```

### withdrawEther

```solidity
function withdrawEther(address _to, uint256 _amount) external
```

## RocketTokenRETH

### EtherDeposited

```solidity
event EtherDeposited(address from, uint256 amount, uint256 time)
```

### TokensMinted

```solidity
event TokensMinted(address to, uint256 amount, uint256 ethAmount, uint256 time)
```

### TokensBurned

```solidity
event TokensBurned(address from, uint256 amount, uint256 ethAmount, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### receive

```solidity
receive() external payable
```

### getEthValue

```solidity
function getEthValue(uint256 _rethAmount) public view returns (uint256)
```

### getRethValue

```solidity
function getRethValue(uint256 _ethAmount) public view returns (uint256)
```

### getExchangeRate

```solidity
function getExchangeRate() external view returns (uint256)
```

### getTotalCollateral

```solidity
function getTotalCollateral() public view returns (uint256)
```

### getCollateralRate

```solidity
function getCollateralRate() public view returns (uint256)
```

### depositExcess

```solidity
function depositExcess() external payable
```

### mint

```solidity
function mint(uint256 _ethAmount, address _to) external
```

### burn

```solidity
function burn(uint256 _rethAmount) external
```

### depositExcessCollateral

```solidity
function depositExcessCollateral() external
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address, uint256) internal
```

## RocketTokenRPL

### totalInitialSupply

```solidity
uint256 totalInitialSupply
```

### inflationInterval

```solidity
uint256 inflationInterval
```

### totalSwappedRPL

```solidity
uint256 totalSwappedRPL
```

### rplFixedSupplyContract

```solidity
contract IERC20 rplFixedSupplyContract
```

### RPLInflationLog

```solidity
event RPLInflationLog(address sender, uint256 value, uint256 inflationCalcTime)
```

### RPLFixedSupplyBurn

```solidity
event RPLFixedSupplyBurn(address from, uint256 amount, uint256 time)
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress, contract IERC20 _rocketTokenRPLFixedSupplyAddress) public
```

### getInflationCalcTime

```solidity
function getInflationCalcTime() public view returns (uint256)
```

Get the last time that inflation was calculated at

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 Last timestamp since inflation was calculated |

### getInflationIntervalTime

```solidity
function getInflationIntervalTime() external pure returns (uint256)
```

How many seconds to calculate inflation at

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 how many seconds to calculate inflation at |

### getInflationIntervalRate

```solidity
function getInflationIntervalRate() public view returns (uint256)
```

The current inflation rate per interval (eg 1000133680617113500 = 5% annual)

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 The current inflation rate per interval |

### getInflationIntervalStartTime

```solidity
function getInflationIntervalStartTime() public view returns (uint256)
```

The current block to begin inflation at

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 The current block to begin inflation at |

### getInflationRewardsContractAddress

```solidity
function getInflationRewardsContractAddress() external view returns (address)
```

The current rewards pool address that receives the inflation

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | address The rewards pool contract address |

### getInflationIntervalsPassed

```solidity
function getInflationIntervalsPassed() public view returns (uint256)
```

Compute interval since last inflation update (on call)

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 Time intervals since last update |

### inflationCalculate

```solidity
function inflationCalculate() external view returns (uint256)
```

_Function to compute how many tokens should be minted_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | A uint256 specifying number of new tokens to mint |

### inflationMintTokens

```solidity
function inflationMintTokens() external returns (uint256)
```

_Mint new tokens if enough time has elapsed since last mint_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | A uint256 specifying number of new tokens that were minted |

### swapTokens

```solidity
function swapTokens(uint256 _amount) external
```

_Swap current RPL fixed supply tokens for new RPL 1:1 to the same address from the user calling it_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | The amount of RPL fixed supply tokens to swap |

## RocketTokenDummyRPL

### decimalPlaces

```solidity
uint8 decimalPlaces
```

### exponent

```solidity
uint256 exponent
```

### totalSupplyCap

```solidity
uint256 totalSupplyCap
```

### MintToken

```solidity
event MintToken(address _minter, address _address, uint256 _value)
```

### constructor

```solidity
constructor(address _rocketStorageAddress) public
```

### mint

```solidity
function mint(address _to, uint256 _amount) external returns (bool)
```

### getRemainingTokens

```solidity
function getRemainingTokens() external view returns (uint256)
```

_Returns the amount of tokens that can still be minted_

## AddressQueueStorage

### capacity

```solidity
uint256 capacity
```

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getLength

```solidity
function getLength(bytes32 _key) public view returns (uint256)
```

### getItem

```solidity
function getItem(bytes32 _key, uint256 _index) external view returns (address)
```

### getIndexOf

```solidity
function getIndexOf(bytes32 _key, address _value) external view returns (int256)
```

### enqueueItem

```solidity
function enqueueItem(bytes32 _key, address _value) external
```

### dequeueItem

```solidity
function dequeueItem(bytes32 _key) external returns (address)
```

### removeItem

```solidity
function removeItem(bytes32 _key, address _value) external
```

## AddressSetStorage

### constructor

```solidity
constructor(contract RocketStorageInterface _rocketStorageAddress) public
```

### getCount

```solidity
function getCount(bytes32 _key) external view returns (uint256)
```

### getItem

```solidity
function getItem(bytes32 _key, uint256 _index) external view returns (address)
```

### getIndexOf

```solidity
function getIndexOf(bytes32 _key, address _value) external view returns (int256)
```

### addItem

```solidity
function addItem(bytes32 _key, address _value) external
```

### removeItem

```solidity
function removeItem(bytes32 _key, address _value) external
```

## RocketStorageInterface

### getDeployedStatus

```solidity
function getDeployedStatus() external view returns (bool)
```

### getGuardian

```solidity
function getGuardian() external view returns (address)
```

### setGuardian

```solidity
function setGuardian(address _newAddress) external
```

### confirmGuardian

```solidity
function confirmGuardian() external
```

### getAddress

```solidity
function getAddress(bytes32 _key) external view returns (address)
```

### getUint

```solidity
function getUint(bytes32 _key) external view returns (uint256)
```

### getString

```solidity
function getString(bytes32 _key) external view returns (string)
```

### getBytes

```solidity
function getBytes(bytes32 _key) external view returns (bytes)
```

### getBool

```solidity
function getBool(bytes32 _key) external view returns (bool)
```

### getInt

```solidity
function getInt(bytes32 _key) external view returns (int256)
```

### getBytes32

```solidity
function getBytes32(bytes32 _key) external view returns (bytes32)
```

### setAddress

```solidity
function setAddress(bytes32 _key, address _value) external
```

### setUint

```solidity
function setUint(bytes32 _key, uint256 _value) external
```

### setString

```solidity
function setString(bytes32 _key, string _value) external
```

### setBytes

```solidity
function setBytes(bytes32 _key, bytes _value) external
```

### setBool

```solidity
function setBool(bytes32 _key, bool _value) external
```

### setInt

```solidity
function setInt(bytes32 _key, int256 _value) external
```

### setBytes32

```solidity
function setBytes32(bytes32 _key, bytes32 _value) external
```

### deleteAddress

```solidity
function deleteAddress(bytes32 _key) external
```

### deleteUint

```solidity
function deleteUint(bytes32 _key) external
```

### deleteString

```solidity
function deleteString(bytes32 _key) external
```

### deleteBytes

```solidity
function deleteBytes(bytes32 _key) external
```

### deleteBool

```solidity
function deleteBool(bytes32 _key) external
```

### deleteInt

```solidity
function deleteInt(bytes32 _key) external
```

### deleteBytes32

```solidity
function deleteBytes32(bytes32 _key) external
```

### addUint

```solidity
function addUint(bytes32 _key, uint256 _amount) external
```

### subUint

```solidity
function subUint(bytes32 _key, uint256 _amount) external
```

### getNodeWithdrawalAddress

```solidity
function getNodeWithdrawalAddress(address _nodeAddress) external view returns (address)
```

### getNodePendingWithdrawalAddress

```solidity
function getNodePendingWithdrawalAddress(address _nodeAddress) external view returns (address)
```

### setWithdrawalAddress

```solidity
function setWithdrawalAddress(address _nodeAddress, address _newWithdrawalAddress, bool _confirm) external
```

### confirmWithdrawalAddress

```solidity
function confirmWithdrawalAddress(address _nodeAddress) external
```

## RocketVaultInterface

### balanceOf

```solidity
function balanceOf(string _networkContractName) external view returns (uint256)
```

### depositEther

```solidity
function depositEther() external payable
```

### withdrawEther

```solidity
function withdrawEther(uint256 _amount) external
```

### depositToken

```solidity
function depositToken(string _networkContractName, contract IERC20 _tokenAddress, uint256 _amount) external
```

### withdrawToken

```solidity
function withdrawToken(address _withdrawalAddress, contract IERC20 _tokenAddress, uint256 _amount) external
```

### balanceOfToken

```solidity
function balanceOfToken(string _networkContractName, contract IERC20 _tokenAddress) external view returns (uint256)
```

### transferToken

```solidity
function transferToken(string _networkContractName, contract IERC20 _tokenAddress, uint256 _amount) external
```

### burnToken

```solidity
function burnToken(contract ERC20Burnable _tokenAddress, uint256 _amount) external
```

## RocketVaultWithdrawerInterface

### receiveVaultWithdrawalETH

```solidity
function receiveVaultWithdrawalETH() external payable
```

## RocketAuctionManagerInterface

### getTotalRPLBalance

```solidity
function getTotalRPLBalance() external view returns (uint256)
```

### getAllottedRPLBalance

```solidity
function getAllottedRPLBalance() external view returns (uint256)
```

### getRemainingRPLBalance

```solidity
function getRemainingRPLBalance() external view returns (uint256)
```

### getLotCount

```solidity
function getLotCount() external view returns (uint256)
```

### getLotExists

```solidity
function getLotExists(uint256 _index) external view returns (bool)
```

### getLotStartBlock

```solidity
function getLotStartBlock(uint256 _index) external view returns (uint256)
```

### getLotEndBlock

```solidity
function getLotEndBlock(uint256 _index) external view returns (uint256)
```

### getLotStartPrice

```solidity
function getLotStartPrice(uint256 _index) external view returns (uint256)
```

### getLotReservePrice

```solidity
function getLotReservePrice(uint256 _index) external view returns (uint256)
```

### getLotTotalRPLAmount

```solidity
function getLotTotalRPLAmount(uint256 _index) external view returns (uint256)
```

### getLotTotalBidAmount

```solidity
function getLotTotalBidAmount(uint256 _index) external view returns (uint256)
```

### getLotAddressBidAmount

```solidity
function getLotAddressBidAmount(uint256 _index, address _bidder) external view returns (uint256)
```

### getLotRPLRecovered

```solidity
function getLotRPLRecovered(uint256 _index) external view returns (bool)
```

### getLotPriceAtBlock

```solidity
function getLotPriceAtBlock(uint256 _index, uint256 _block) external view returns (uint256)
```

### getLotPriceAtCurrentBlock

```solidity
function getLotPriceAtCurrentBlock(uint256 _index) external view returns (uint256)
```

### getLotPriceByTotalBids

```solidity
function getLotPriceByTotalBids(uint256 _index) external view returns (uint256)
```

### getLotCurrentPrice

```solidity
function getLotCurrentPrice(uint256 _index) external view returns (uint256)
```

### getLotClaimedRPLAmount

```solidity
function getLotClaimedRPLAmount(uint256 _index) external view returns (uint256)
```

### getLotRemainingRPLAmount

```solidity
function getLotRemainingRPLAmount(uint256 _index) external view returns (uint256)
```

### getLotIsCleared

```solidity
function getLotIsCleared(uint256 _index) external view returns (bool)
```

### createLot

```solidity
function createLot() external
```

### placeBid

```solidity
function placeBid(uint256 _lotIndex) external payable
```

### claimBid

```solidity
function claimBid(uint256 _lotIndex) external
```

### recoverUnclaimedRPL

```solidity
function recoverUnclaimedRPL(uint256 _lotIndex) external
```

## DepositInterface

### deposit

```solidity
function deposit(bytes _pubkey, bytes _withdrawalCredentials, bytes _signature, bytes32 _depositDataRoot) external payable
```

## RocketDAOProposalInterface

### ProposalState

```solidity
enum ProposalState {
  Pending,
  Active,
  Cancelled,
  Defeated,
  Succeeded,
  Expired,
  Executed
}
```

### getTotal

```solidity
function getTotal() external view returns (uint256)
```

### getDAO

```solidity
function getDAO(uint256 _proposalID) external view returns (string)
```

### getProposer

```solidity
function getProposer(uint256 _proposalID) external view returns (address)
```

### getMessage

```solidity
function getMessage(uint256 _proposalID) external view returns (string)
```

### getStart

```solidity
function getStart(uint256 _proposalID) external view returns (uint256)
```

### getEnd

```solidity
function getEnd(uint256 _proposalID) external view returns (uint256)
```

### getExpires

```solidity
function getExpires(uint256 _proposalID) external view returns (uint256)
```

### getCreated

```solidity
function getCreated(uint256 _proposalID) external view returns (uint256)
```

### getVotesFor

```solidity
function getVotesFor(uint256 _proposalID) external view returns (uint256)
```

### getVotesAgainst

```solidity
function getVotesAgainst(uint256 _proposalID) external view returns (uint256)
```

### getVotesRequired

```solidity
function getVotesRequired(uint256 _proposalID) external view returns (uint256)
```

### getCancelled

```solidity
function getCancelled(uint256 _proposalID) external view returns (bool)
```

### getExecuted

```solidity
function getExecuted(uint256 _proposalID) external view returns (bool)
```

### getPayload

```solidity
function getPayload(uint256 _proposalID) external view returns (bytes)
```

### getReceiptHasVoted

```solidity
function getReceiptHasVoted(uint256 _proposalID, address _nodeAddress) external view returns (bool)
```

### getReceiptSupported

```solidity
function getReceiptSupported(uint256 _proposalID, address _nodeAddress) external view returns (bool)
```

### getState

```solidity
function getState(uint256 _proposalID) external view returns (enum RocketDAOProposalInterface.ProposalState)
```

### add

```solidity
function add(address _member, string _dao, string _message, uint256 _startBlock, uint256 _durationBlocks, uint256 _expiresBlocks, uint256 _votesRequired, bytes _payload) external returns (uint256)
```

### vote

```solidity
function vote(address _member, uint256 _votes, uint256 _proposalID, bool _support) external
```

### cancel

```solidity
function cancel(address _member, uint256 _proposalID) external
```

### execute

```solidity
function execute(uint256 _proposalID) external
```

## RocketDAONodeTrustedActionsInterface

### actionJoin

```solidity
function actionJoin() external
```

### actionJoinRequired

```solidity
function actionJoinRequired(address _nodeAddress) external
```

### actionLeave

```solidity
function actionLeave(address _rplBondRefundAddress) external
```

### actionKick

```solidity
function actionKick(address _nodeAddress, uint256 _rplFine) external
```

### actionChallengeMake

```solidity
function actionChallengeMake(address _nodeAddress) external payable
```

### actionChallengeDecide

```solidity
function actionChallengeDecide(address _nodeAddress) external
```

## RocketDAONodeTrustedInterface

### getBootstrapModeDisabled

```solidity
function getBootstrapModeDisabled() external view returns (bool)
```

### getMemberQuorumVotesRequired

```solidity
function getMemberQuorumVotesRequired() external view returns (uint256)
```

### getMemberAt

```solidity
function getMemberAt(uint256 _index) external view returns (address)
```

### getMemberCount

```solidity
function getMemberCount() external view returns (uint256)
```

### getMemberMinRequired

```solidity
function getMemberMinRequired() external view returns (uint256)
```

### getMemberIsValid

```solidity
function getMemberIsValid(address _nodeAddress) external view returns (bool)
```

### getMemberLastProposalTime

```solidity
function getMemberLastProposalTime(address _nodeAddress) external view returns (uint256)
```

### getMemberID

```solidity
function getMemberID(address _nodeAddress) external view returns (string)
```

### getMemberUrl

```solidity
function getMemberUrl(address _nodeAddress) external view returns (string)
```

### getMemberJoinedTime

```solidity
function getMemberJoinedTime(address _nodeAddress) external view returns (uint256)
```

### getMemberProposalExecutedTime

```solidity
function getMemberProposalExecutedTime(string _proposalType, address _nodeAddress) external view returns (uint256)
```

### getMemberRPLBondAmount

```solidity
function getMemberRPLBondAmount(address _nodeAddress) external view returns (uint256)
```

### getMemberIsChallenged

```solidity
function getMemberIsChallenged(address _nodeAddress) external view returns (bool)
```

### getMemberUnbondedValidatorCount

```solidity
function getMemberUnbondedValidatorCount(address _nodeAddress) external view returns (uint256)
```

### incrementMemberUnbondedValidatorCount

```solidity
function incrementMemberUnbondedValidatorCount(address _nodeAddress) external
```

### decrementMemberUnbondedValidatorCount

```solidity
function decrementMemberUnbondedValidatorCount(address _nodeAddress) external
```

### bootstrapMember

```solidity
function bootstrapMember(string _id, string _url, address _nodeAddress) external
```

### bootstrapSettingUint

```solidity
function bootstrapSettingUint(string _settingContractName, string _settingPath, uint256 _value) external
```

### bootstrapSettingBool

```solidity
function bootstrapSettingBool(string _settingContractName, string _settingPath, bool _value) external
```

### bootstrapUpgrade

```solidity
function bootstrapUpgrade(string _type, string _name, string _contractAbi, address _contractAddress) external
```

### bootstrapDisable

```solidity
function bootstrapDisable(bool _confirmDisableBootstrapMode) external
```

### memberJoinRequired

```solidity
function memberJoinRequired(string _id, string _url) external
```

## RocketDAONodeTrustedProposalsInterface

### propose

```solidity
function propose(string _proposalMessage, bytes _payload) external returns (uint256)
```

### vote

```solidity
function vote(uint256 _proposalID, bool _support) external
```

### cancel

```solidity
function cancel(uint256 _proposalID) external
```

### execute

```solidity
function execute(uint256 _proposalID) external
```

### proposalInvite

```solidity
function proposalInvite(string _id, string _url, address _nodeAddress) external
```

### proposalLeave

```solidity
function proposalLeave(address _nodeAddress) external
```

### proposalKick

```solidity
function proposalKick(address _nodeAddress, uint256 _rplFine) external
```

### proposalSettingUint

```solidity
function proposalSettingUint(string _settingContractName, string _settingPath, uint256 _value) external
```

### proposalSettingBool

```solidity
function proposalSettingBool(string _settingContractName, string _settingPath, bool _value) external
```

### proposalUpgrade

```solidity
function proposalUpgrade(string _type, string _name, string _contractAbi, address _contractAddress) external
```

## RocketDAONodeTrustedUpgradeInterface

### upgrade

```solidity
function upgrade(string _type, string _name, string _contractAbi, address _contractAddress) external
```

## RocketDAONodeTrustedSettingsInterface

### getSettingUint

```solidity
function getSettingUint(string _settingPath) external view returns (uint256)
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) external
```

### getSettingBool

```solidity
function getSettingBool(string _settingPath) external view returns (bool)
```

### setSettingBool

```solidity
function setSettingBool(string _settingPath, bool _value) external
```

## RocketDAONodeTrustedSettingsMembersInterface

### getQuorum

```solidity
function getQuorum() external view returns (uint256)
```

### getRPLBond

```solidity
function getRPLBond() external view returns (uint256)
```

### getMinipoolUnbondedMax

```solidity
function getMinipoolUnbondedMax() external view returns (uint256)
```

### getMinipoolUnbondedMinFee

```solidity
function getMinipoolUnbondedMinFee() external view returns (uint256)
```

### getChallengeCooldown

```solidity
function getChallengeCooldown() external view returns (uint256)
```

### getChallengeWindow

```solidity
function getChallengeWindow() external view returns (uint256)
```

### getChallengeCost

```solidity
function getChallengeCost() external view returns (uint256)
```

## RocketDAONodeTrustedSettingsMinipoolInterface

### getScrubPeriod

```solidity
function getScrubPeriod() external view returns (uint256)
```

### getPromotionScrubPeriod

```solidity
function getPromotionScrubPeriod() external view returns (uint256)
```

### getScrubQuorum

```solidity
function getScrubQuorum() external view returns (uint256)
```

### getCancelBondReductionQuorum

```solidity
function getCancelBondReductionQuorum() external view returns (uint256)
```

### getScrubPenaltyEnabled

```solidity
function getScrubPenaltyEnabled() external view returns (bool)
```

### isWithinBondReductionWindow

```solidity
function isWithinBondReductionWindow(uint256 _time) external view returns (bool)
```

### getBondReductionWindowStart

```solidity
function getBondReductionWindowStart() external view returns (uint256)
```

### getBondReductionWindowLength

```solidity
function getBondReductionWindowLength() external view returns (uint256)
```

## RocketDAONodeTrustedSettingsProposalsInterface

### getCooldownTime

```solidity
function getCooldownTime() external view returns (uint256)
```

### getVoteTime

```solidity
function getVoteTime() external view returns (uint256)
```

### getVoteDelayTime

```solidity
function getVoteDelayTime() external view returns (uint256)
```

### getExecuteTime

```solidity
function getExecuteTime() external view returns (uint256)
```

### getActionTime

```solidity
function getActionTime() external view returns (uint256)
```

## RocketDAONodeTrustedSettingsRewardsInterface

### getNetworkEnabled

```solidity
function getNetworkEnabled(uint256 _network) external view returns (bool)
```

## RocketDAOProtocolActionsInterface

## RocketDAOProtocolInterface

### getBootstrapModeDisabled

```solidity
function getBootstrapModeDisabled() external view returns (bool)
```

### bootstrapSettingMulti

```solidity
function bootstrapSettingMulti(string[] _settingContractNames, string[] _settingPaths, enum SettingType[] _types, bytes[] _values) external
```

### bootstrapSettingUint

```solidity
function bootstrapSettingUint(string _settingContractName, string _settingPath, uint256 _value) external
```

### bootstrapSettingBool

```solidity
function bootstrapSettingBool(string _settingContractName, string _settingPath, bool _value) external
```

### bootstrapSettingAddress

```solidity
function bootstrapSettingAddress(string _settingContractName, string _settingPath, address _value) external
```

### bootstrapSettingClaimer

```solidity
function bootstrapSettingClaimer(string _contractName, uint256 _perc) external
```

### bootstrapSpendTreasury

```solidity
function bootstrapSpendTreasury(string _invoiceID, address _recipientAddress, uint256 _amount) external
```

### bootstrapDisable

```solidity
function bootstrapDisable(bool _confirmDisableBootstrapMode) external
```

## RocketDAOProtocolProposalsInterface

### proposalSettingMulti

```solidity
function proposalSettingMulti(string[] _settingContractNames, string[] _settingPaths, enum SettingType[] _types, bytes[] _data) external
```

### proposalSettingUint

```solidity
function proposalSettingUint(string _settingContractName, string _settingPath, uint256 _value) external
```

### proposalSettingBool

```solidity
function proposalSettingBool(string _settingContractName, string _settingPath, bool _value) external
```

### proposalSettingAddress

```solidity
function proposalSettingAddress(string _settingContractName, string _settingPath, address _value) external
```

### proposalSettingRewardsClaimer

```solidity
function proposalSettingRewardsClaimer(string _contractName, uint256 _perc) external
```

### proposalSpendTreasury

```solidity
function proposalSpendTreasury(string _invoiceID, address _recipientAddress, uint256 _amount) external
```

## RocketDAOProtocolSettingsAuctionInterface

### getCreateLotEnabled

```solidity
function getCreateLotEnabled() external view returns (bool)
```

### getBidOnLotEnabled

```solidity
function getBidOnLotEnabled() external view returns (bool)
```

### getLotMinimumEthValue

```solidity
function getLotMinimumEthValue() external view returns (uint256)
```

### getLotMaximumEthValue

```solidity
function getLotMaximumEthValue() external view returns (uint256)
```

### getLotDuration

```solidity
function getLotDuration() external view returns (uint256)
```

### getStartingPriceRatio

```solidity
function getStartingPriceRatio() external view returns (uint256)
```

### getReservePriceRatio

```solidity
function getReservePriceRatio() external view returns (uint256)
```

## RocketDAOProtocolSettingsDepositInterface

### getDepositEnabled

```solidity
function getDepositEnabled() external view returns (bool)
```

### getAssignDepositsEnabled

```solidity
function getAssignDepositsEnabled() external view returns (bool)
```

### getMinimumDeposit

```solidity
function getMinimumDeposit() external view returns (uint256)
```

### getMaximumDepositPoolSize

```solidity
function getMaximumDepositPoolSize() external view returns (uint256)
```

### getMaximumDepositAssignments

```solidity
function getMaximumDepositAssignments() external view returns (uint256)
```

### getMaximumDepositSocialisedAssignments

```solidity
function getMaximumDepositSocialisedAssignments() external view returns (uint256)
```

### getDepositFee

```solidity
function getDepositFee() external view returns (uint256)
```

## RocketDAOProtocolSettingsInflationInterface

### getInflationIntervalRate

```solidity
function getInflationIntervalRate() external view returns (uint256)
```

### getInflationIntervalStartTime

```solidity
function getInflationIntervalStartTime() external view returns (uint256)
```

## RocketDAOProtocolSettingsInterface

### getSettingUint

```solidity
function getSettingUint(string _settingPath) external view returns (uint256)
```

### setSettingUint

```solidity
function setSettingUint(string _settingPath, uint256 _value) external
```

### getSettingBool

```solidity
function getSettingBool(string _settingPath) external view returns (bool)
```

### setSettingBool

```solidity
function setSettingBool(string _settingPath, bool _value) external
```

### getSettingAddress

```solidity
function getSettingAddress(string _settingPath) external view returns (address)
```

### setSettingAddress

```solidity
function setSettingAddress(string _settingPath, address _value) external
```

## RocketDAOProtocolSettingsMinipoolInterface

### getLaunchBalance

```solidity
function getLaunchBalance() external view returns (uint256)
```

### getPreLaunchValue

```solidity
function getPreLaunchValue() external pure returns (uint256)
```

### getDepositUserAmount

```solidity
function getDepositUserAmount(enum MinipoolDeposit _depositType) external view returns (uint256)
```

### getFullDepositUserAmount

```solidity
function getFullDepositUserAmount() external view returns (uint256)
```

### getHalfDepositUserAmount

```solidity
function getHalfDepositUserAmount() external view returns (uint256)
```

### getVariableDepositAmount

```solidity
function getVariableDepositAmount() external view returns (uint256)
```

### getSubmitWithdrawableEnabled

```solidity
function getSubmitWithdrawableEnabled() external view returns (bool)
```

### getBondReductionEnabled

```solidity
function getBondReductionEnabled() external view returns (bool)
```

### getLaunchTimeout

```solidity
function getLaunchTimeout() external view returns (uint256)
```

### getMaximumCount

```solidity
function getMaximumCount() external view returns (uint256)
```

### isWithinUserDistributeWindow

```solidity
function isWithinUserDistributeWindow(uint256 _time) external view returns (bool)
```

### hasUserDistributeWindowPassed

```solidity
function hasUserDistributeWindowPassed(uint256 _time) external view returns (bool)
```

### getUserDistributeWindowStart

```solidity
function getUserDistributeWindowStart() external view returns (uint256)
```

### getUserDistributeWindowLength

```solidity
function getUserDistributeWindowLength() external view returns (uint256)
```

## RocketDAOProtocolSettingsNetworkInterface

### getNodeConsensusThreshold

```solidity
function getNodeConsensusThreshold() external view returns (uint256)
```

### getNodePenaltyThreshold

```solidity
function getNodePenaltyThreshold() external view returns (uint256)
```

### getPerPenaltyRate

```solidity
function getPerPenaltyRate() external view returns (uint256)
```

### getSubmitBalancesEnabled

```solidity
function getSubmitBalancesEnabled() external view returns (bool)
```

### getSubmitBalancesFrequency

```solidity
function getSubmitBalancesFrequency() external view returns (uint256)
```

### getSubmitPricesEnabled

```solidity
function getSubmitPricesEnabled() external view returns (bool)
```

### getSubmitPricesFrequency

```solidity
function getSubmitPricesFrequency() external view returns (uint256)
```

### getMinimumNodeFee

```solidity
function getMinimumNodeFee() external view returns (uint256)
```

### getTargetNodeFee

```solidity
function getTargetNodeFee() external view returns (uint256)
```

### getMaximumNodeFee

```solidity
function getMaximumNodeFee() external view returns (uint256)
```

### getNodeFeeDemandRange

```solidity
function getNodeFeeDemandRange() external view returns (uint256)
```

### getTargetRethCollateralRate

```solidity
function getTargetRethCollateralRate() external view returns (uint256)
```

### getRethDepositDelay

```solidity
function getRethDepositDelay() external view returns (uint256)
```

### getSubmitRewardsEnabled

```solidity
function getSubmitRewardsEnabled() external view returns (bool)
```

## RocketDAOProtocolSettingsNodeInterface

### getRegistrationEnabled

```solidity
function getRegistrationEnabled() external view returns (bool)
```

### getSmoothingPoolRegistrationEnabled

```solidity
function getSmoothingPoolRegistrationEnabled() external view returns (bool)
```

### getDepositEnabled

```solidity
function getDepositEnabled() external view returns (bool)
```

### getVacantMinipoolsEnabled

```solidity
function getVacantMinipoolsEnabled() external view returns (bool)
```

### getMinimumPerMinipoolStake

```solidity
function getMinimumPerMinipoolStake() external view returns (uint256)
```

### getMaximumPerMinipoolStake

```solidity
function getMaximumPerMinipoolStake() external view returns (uint256)
```

## RocketDAOProtocolSettingsRewardsInterface

### setSettingRewardsClaimer

```solidity
function setSettingRewardsClaimer(string _contractName, uint256 _perc) external
```

### getRewardsClaimerPerc

```solidity
function getRewardsClaimerPerc(string _contractName) external view returns (uint256)
```

### getRewardsClaimerPercTimeUpdated

```solidity
function getRewardsClaimerPercTimeUpdated(string _contractName) external view returns (uint256)
```

### getRewardsClaimersPercTotal

```solidity
function getRewardsClaimersPercTotal() external view returns (uint256)
```

### getRewardsClaimIntervalTime

```solidity
function getRewardsClaimIntervalTime() external view returns (uint256)
```

## RocketDepositPoolInterface

### getBalance

```solidity
function getBalance() external view returns (uint256)
```

### getNodeBalance

```solidity
function getNodeBalance() external view returns (uint256)
```

### getUserBalance

```solidity
function getUserBalance() external view returns (int256)
```

### getExcessBalance

```solidity
function getExcessBalance() external view returns (uint256)
```

### deposit

```solidity
function deposit() external payable
```

### getMaximumDepositAmount

```solidity
function getMaximumDepositAmount() external view returns (uint256)
```

### nodeDeposit

```solidity
function nodeDeposit(uint256 _totalAmount) external payable
```

### nodeCreditWithdrawal

```solidity
function nodeCreditWithdrawal(uint256 _amount) external
```

### recycleDissolvedDeposit

```solidity
function recycleDissolvedDeposit() external payable
```

### recycleExcessCollateral

```solidity
function recycleExcessCollateral() external payable
```

### recycleLiquidatedStake

```solidity
function recycleLiquidatedStake() external payable
```

### assignDeposits

```solidity
function assignDeposits() external
```

### maybeAssignDeposits

```solidity
function maybeAssignDeposits() external returns (bool)
```

### withdrawExcessBalance

```solidity
function withdrawExcessBalance(uint256 _amount) external
```

## RocketMinipoolBaseInterface

### initialise

```solidity
function initialise(address _rocketStorage, address _nodeAddress) external
```

### delegateUpgrade

```solidity
function delegateUpgrade() external
```

### delegateRollback

```solidity
function delegateRollback() external
```

### setUseLatestDelegate

```solidity
function setUseLatestDelegate(bool _setting) external
```

### getUseLatestDelegate

```solidity
function getUseLatestDelegate() external view returns (bool)
```

### getDelegate

```solidity
function getDelegate() external view returns (address)
```

### getPreviousDelegate

```solidity
function getPreviousDelegate() external view returns (address)
```

### getEffectiveDelegate

```solidity
function getEffectiveDelegate() external view returns (address)
```

## RocketMinipoolBondReducerInterface

### beginReduceBondAmount

```solidity
function beginReduceBondAmount(address _minipoolAddress, uint256 _newBondAmount) external
```

### getReduceBondTime

```solidity
function getReduceBondTime(address _minipoolAddress) external view returns (uint256)
```

### getReduceBondValue

```solidity
function getReduceBondValue(address _minipoolAddress) external view returns (uint256)
```

### getReduceBondCancelled

```solidity
function getReduceBondCancelled(address _minipoolAddress) external view returns (bool)
```

### canReduceBondAmount

```solidity
function canReduceBondAmount(address _minipoolAddress) external view returns (bool)
```

### voteCancelReduction

```solidity
function voteCancelReduction(address _minipoolAddress) external
```

### reduceBondAmount

```solidity
function reduceBondAmount() external returns (uint256)
```

### getLastBondReductionTime

```solidity
function getLastBondReductionTime(address _minipoolAddress) external view returns (uint256)
```

### getLastBondReductionPrevValue

```solidity
function getLastBondReductionPrevValue(address _minipoolAddress) external view returns (uint256)
```

### getLastBondReductionPrevNodeFee

```solidity
function getLastBondReductionPrevNodeFee(address _minipoolAddress) external view returns (uint256)
```

## RocketMinipoolFactoryInterface

### getExpectedAddress

```solidity
function getExpectedAddress(address _nodeAddress, uint256 _salt) external view returns (address)
```

### deployContract

```solidity
function deployContract(address _nodeAddress, uint256 _salt) external returns (address)
```

## RocketMinipoolInterface

### version

```solidity
function version() external view returns (uint8)
```

### initialise

```solidity
function initialise(address _nodeAddress) external
```

### getStatus

```solidity
function getStatus() external view returns (enum MinipoolStatus)
```

### getFinalised

```solidity
function getFinalised() external view returns (bool)
```

### getStatusBlock

```solidity
function getStatusBlock() external view returns (uint256)
```

### getStatusTime

```solidity
function getStatusTime() external view returns (uint256)
```

### getScrubVoted

```solidity
function getScrubVoted(address _member) external view returns (bool)
```

### getDepositType

```solidity
function getDepositType() external view returns (enum MinipoolDeposit)
```

### getNodeAddress

```solidity
function getNodeAddress() external view returns (address)
```

### getNodeFee

```solidity
function getNodeFee() external view returns (uint256)
```

### getNodeDepositBalance

```solidity
function getNodeDepositBalance() external view returns (uint256)
```

### getNodeRefundBalance

```solidity
function getNodeRefundBalance() external view returns (uint256)
```

### getNodeDepositAssigned

```solidity
function getNodeDepositAssigned() external view returns (bool)
```

### getPreLaunchValue

```solidity
function getPreLaunchValue() external view returns (uint256)
```

### getNodeTopUpValue

```solidity
function getNodeTopUpValue() external view returns (uint256)
```

### getVacant

```solidity
function getVacant() external view returns (bool)
```

### getPreMigrationBalance

```solidity
function getPreMigrationBalance() external view returns (uint256)
```

### getUserDistributed

```solidity
function getUserDistributed() external view returns (bool)
```

### getUserDepositBalance

```solidity
function getUserDepositBalance() external view returns (uint256)
```

### getUserDepositAssigned

```solidity
function getUserDepositAssigned() external view returns (bool)
```

### getUserDepositAssignedTime

```solidity
function getUserDepositAssignedTime() external view returns (uint256)
```

### getTotalScrubVotes

```solidity
function getTotalScrubVotes() external view returns (uint256)
```

### calculateNodeShare

```solidity
function calculateNodeShare(uint256 _balance) external view returns (uint256)
```

### calculateUserShare

```solidity
function calculateUserShare(uint256 _balance) external view returns (uint256)
```

### preDeposit

```solidity
function preDeposit(uint256 _bondingValue, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot) external payable
```

### deposit

```solidity
function deposit() external payable
```

### userDeposit

```solidity
function userDeposit() external payable
```

### distributeBalance

```solidity
function distributeBalance(bool _rewardsOnly) external
```

### beginUserDistribute

```solidity
function beginUserDistribute() external
```

### userDistributeAllowed

```solidity
function userDistributeAllowed() external view returns (bool)
```

### refund

```solidity
function refund() external
```

### slash

```solidity
function slash() external
```

### finalise

```solidity
function finalise() external
```

### canStake

```solidity
function canStake() external view returns (bool)
```

### canPromote

```solidity
function canPromote() external view returns (bool)
```

### stake

```solidity
function stake(bytes _validatorSignature, bytes32 _depositDataRoot) external
```

### prepareVacancy

```solidity
function prepareVacancy(uint256 _bondAmount, uint256 _currentBalance) external
```

### promote

```solidity
function promote() external
```

### dissolve

```solidity
function dissolve() external
```

### close

```solidity
function close() external
```

### voteScrub

```solidity
function voteScrub() external
```

### reduceBondAmount

```solidity
function reduceBondAmount() external
```

## RocketMinipoolManagerInterface

### getMinipoolCount

```solidity
function getMinipoolCount() external view returns (uint256)
```

### getStakingMinipoolCount

```solidity
function getStakingMinipoolCount() external view returns (uint256)
```

### getFinalisedMinipoolCount

```solidity
function getFinalisedMinipoolCount() external view returns (uint256)
```

### getActiveMinipoolCount

```solidity
function getActiveMinipoolCount() external view returns (uint256)
```

### getMinipoolRPLSlashed

```solidity
function getMinipoolRPLSlashed(address _minipoolAddress) external view returns (bool)
```

### getMinipoolCountPerStatus

```solidity
function getMinipoolCountPerStatus(uint256 offset, uint256 limit) external view returns (uint256, uint256, uint256, uint256, uint256)
```

### getPrelaunchMinipools

```solidity
function getPrelaunchMinipools(uint256 offset, uint256 limit) external view returns (address[])
```

### getMinipoolAt

```solidity
function getMinipoolAt(uint256 _index) external view returns (address)
```

### getNodeMinipoolCount

```solidity
function getNodeMinipoolCount(address _nodeAddress) external view returns (uint256)
```

### getNodeActiveMinipoolCount

```solidity
function getNodeActiveMinipoolCount(address _nodeAddress) external view returns (uint256)
```

### getNodeFinalisedMinipoolCount

```solidity
function getNodeFinalisedMinipoolCount(address _nodeAddress) external view returns (uint256)
```

### getNodeStakingMinipoolCount

```solidity
function getNodeStakingMinipoolCount(address _nodeAddress) external view returns (uint256)
```

### getNodeStakingMinipoolCountBySize

```solidity
function getNodeStakingMinipoolCountBySize(address _nodeAddress, uint256 _depositSize) external view returns (uint256)
```

### getNodeMinipoolAt

```solidity
function getNodeMinipoolAt(address _nodeAddress, uint256 _index) external view returns (address)
```

### getNodeValidatingMinipoolCount

```solidity
function getNodeValidatingMinipoolCount(address _nodeAddress) external view returns (uint256)
```

### getNodeValidatingMinipoolAt

```solidity
function getNodeValidatingMinipoolAt(address _nodeAddress, uint256 _index) external view returns (address)
```

### getMinipoolByPubkey

```solidity
function getMinipoolByPubkey(bytes _pubkey) external view returns (address)
```

### getMinipoolExists

```solidity
function getMinipoolExists(address _minipoolAddress) external view returns (bool)
```

### getMinipoolDestroyed

```solidity
function getMinipoolDestroyed(address _minipoolAddress) external view returns (bool)
```

### getMinipoolPubkey

```solidity
function getMinipoolPubkey(address _minipoolAddress) external view returns (bytes)
```

### updateNodeStakingMinipoolCount

```solidity
function updateNodeStakingMinipoolCount(uint256 _previousBond, uint256 _newBond, uint256 _previousFee, uint256 _newFee) external
```

### getMinipoolWithdrawalCredentials

```solidity
function getMinipoolWithdrawalCredentials(address _minipoolAddress) external pure returns (bytes)
```

### createMinipool

```solidity
function createMinipool(address _nodeAddress, uint256 _salt) external returns (contract RocketMinipoolInterface)
```

### createVacantMinipool

```solidity
function createVacantMinipool(address _nodeAddress, uint256 _salt, bytes _validatorPubkey, uint256 _bondAmount, uint256 _currentBalance) external returns (contract RocketMinipoolInterface)
```

### removeVacantMinipool

```solidity
function removeVacantMinipool() external
```

### getVacantMinipoolCount

```solidity
function getVacantMinipoolCount() external view returns (uint256)
```

### getVacantMinipoolAt

```solidity
function getVacantMinipoolAt(uint256 _index) external view returns (address)
```

### destroyMinipool

```solidity
function destroyMinipool() external
```

### incrementNodeStakingMinipoolCount

```solidity
function incrementNodeStakingMinipoolCount(address _nodeAddress) external
```

### decrementNodeStakingMinipoolCount

```solidity
function decrementNodeStakingMinipoolCount(address _nodeAddress) external
```

### incrementNodeFinalisedMinipoolCount

```solidity
function incrementNodeFinalisedMinipoolCount(address _nodeAddress) external
```

### setMinipoolPubkey

```solidity
function setMinipoolPubkey(bytes _pubkey) external
```

### getMinipoolDepositType

```solidity
function getMinipoolDepositType(address _minipoolAddress) external view returns (enum MinipoolDeposit)
```

## RocketMinipoolPenaltyInterface

### setMaxPenaltyRate

```solidity
function setMaxPenaltyRate(uint256 _rate) external
```

### getMaxPenaltyRate

```solidity
function getMaxPenaltyRate() external view returns (uint256)
```

### setPenaltyRate

```solidity
function setPenaltyRate(address _minipoolAddress, uint256 _rate) external
```

### getPenaltyRate

```solidity
function getPenaltyRate(address _minipoolAddress) external view returns (uint256)
```

## RocketMinipoolQueueInterface

### getTotalLength

```solidity
function getTotalLength() external view returns (uint256)
```

### getContainsLegacy

```solidity
function getContainsLegacy() external view returns (bool)
```

### getLengthLegacy

```solidity
function getLengthLegacy(enum MinipoolDeposit _depositType) external view returns (uint256)
```

### getLength

```solidity
function getLength() external view returns (uint256)
```

### getTotalCapacity

```solidity
function getTotalCapacity() external view returns (uint256)
```

### getEffectiveCapacity

```solidity
function getEffectiveCapacity() external view returns (uint256)
```

### getNextCapacityLegacy

```solidity
function getNextCapacityLegacy() external view returns (uint256)
```

### getNextDepositLegacy

```solidity
function getNextDepositLegacy() external view returns (enum MinipoolDeposit, uint256)
```

### enqueueMinipool

```solidity
function enqueueMinipool(address _minipool) external
```

### dequeueMinipoolByDepositLegacy

```solidity
function dequeueMinipoolByDepositLegacy(enum MinipoolDeposit _depositType) external returns (address minipoolAddress)
```

### dequeueMinipools

```solidity
function dequeueMinipools(uint256 _maxToDequeue) external returns (address[] minipoolAddress)
```

### removeMinipool

```solidity
function removeMinipool(enum MinipoolDeposit _depositType) external
```

### getMinipoolAt

```solidity
function getMinipoolAt(uint256 _index) external view returns (address)
```

### getMinipoolPosition

```solidity
function getMinipoolPosition(address _minipool) external view returns (int256)
```

## RocketNetworkBalancesInterface

### getBalancesBlock

```solidity
function getBalancesBlock() external view returns (uint256)
```

### getLatestReportableBlock

```solidity
function getLatestReportableBlock() external view returns (uint256)
```

### getTotalETHBalance

```solidity
function getTotalETHBalance() external view returns (uint256)
```

### getStakingETHBalance

```solidity
function getStakingETHBalance() external view returns (uint256)
```

### getTotalRETHSupply

```solidity
function getTotalRETHSupply() external view returns (uint256)
```

### getETHUtilizationRate

```solidity
function getETHUtilizationRate() external view returns (uint256)
```

### submitBalances

```solidity
function submitBalances(uint256 _block, uint256 _total, uint256 _staking, uint256 _rethSupply) external
```

### executeUpdateBalances

```solidity
function executeUpdateBalances(uint256 _block, uint256 _totalEth, uint256 _stakingEth, uint256 _rethSupply) external
```

## RocketNetworkFeesInterface

### getNodeDemand

```solidity
function getNodeDemand() external view returns (int256)
```

### getNodeFee

```solidity
function getNodeFee() external view returns (uint256)
```

### getNodeFeeByDemand

```solidity
function getNodeFeeByDemand(int256 _nodeDemand) external view returns (uint256)
```

## RocketNetworkPenaltiesInterface

### submitPenalty

```solidity
function submitPenalty(address _minipoolAddress, uint256 _block) external
```

### executeUpdatePenalty

```solidity
function executeUpdatePenalty(address _minipoolAddress, uint256 _block) external
```

### getPenaltyCount

```solidity
function getPenaltyCount(address _minipoolAddress) external view returns (uint256)
```

## RocketNetworkPricesInterface

### getPricesBlock

```solidity
function getPricesBlock() external view returns (uint256)
```

### getRPLPrice

```solidity
function getRPLPrice() external view returns (uint256)
```

### getLatestReportableBlock

```solidity
function getLatestReportableBlock() external view returns (uint256)
```

### submitPrices

```solidity
function submitPrices(uint256 _block, uint256 _rplPrice) external
```

### executeUpdatePrices

```solidity
function executeUpdatePrices(uint256 _block, uint256 _rplPrice) external
```

## RocketNodeDepositInterface

### getNodeDepositCredit

```solidity
function getNodeDepositCredit(address _nodeOperator) external view returns (uint256)
```

### increaseDepositCreditBalance

```solidity
function increaseDepositCreditBalance(address _nodeOperator, uint256 _amount) external
```

### deposit

```solidity
function deposit(uint256 _depositAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot, uint256 _salt, address _expectedMinipoolAddress) external payable
```

### depositWithCredit

```solidity
function depositWithCredit(uint256 _depositAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot, uint256 _salt, address _expectedMinipoolAddress) external payable
```

### isValidDepositAmount

```solidity
function isValidDepositAmount(uint256 _amount) external pure returns (bool)
```

### getDepositAmounts

```solidity
function getDepositAmounts() external pure returns (uint256[])
```

### createVacantMinipool

```solidity
function createVacantMinipool(uint256 _bondAmount, uint256 _minimumNodeFee, bytes _validatorPubkey, uint256 _salt, address _expectedMinipoolAddress, uint256 _currentBalance) external
```

### increaseEthMatched

```solidity
function increaseEthMatched(address _nodeAddress, uint256 _amount) external
```

## RocketNodeDistributorFactoryInterface

### getProxyBytecode

```solidity
function getProxyBytecode() external pure returns (bytes)
```

### getProxyAddress

```solidity
function getProxyAddress(address _nodeAddress) external view returns (address)
```

### createProxy

```solidity
function createProxy(address _nodeAddress) external
```

## RocketNodeDistributorInterface

### getNodeShare

```solidity
function getNodeShare() external view returns (uint256)
```

### getUserShare

```solidity
function getUserShare() external view returns (uint256)
```

### distribute

```solidity
function distribute() external
```

## RocketNodeManagerInterface

### TimezoneCount

```solidity
struct TimezoneCount {
  string timezone;
  uint256 count;
}
```

### getNodeCount

```solidity
function getNodeCount() external view returns (uint256)
```

### getNodeCountPerTimezone

```solidity
function getNodeCountPerTimezone(uint256 offset, uint256 limit) external view returns (struct RocketNodeManagerInterface.TimezoneCount[])
```

### getNodeAt

```solidity
function getNodeAt(uint256 _index) external view returns (address)
```

### getNodeExists

```solidity
function getNodeExists(address _nodeAddress) external view returns (bool)
```

### getNodeWithdrawalAddress

```solidity
function getNodeWithdrawalAddress(address _nodeAddress) external view returns (address)
```

### getNodePendingWithdrawalAddress

```solidity
function getNodePendingWithdrawalAddress(address _nodeAddress) external view returns (address)
```

### getNodeTimezoneLocation

```solidity
function getNodeTimezoneLocation(address _nodeAddress) external view returns (string)
```

### registerNode

```solidity
function registerNode(string _timezoneLocation) external
```

### getNodeRegistrationTime

```solidity
function getNodeRegistrationTime(address _nodeAddress) external view returns (uint256)
```

### setTimezoneLocation

```solidity
function setTimezoneLocation(string _timezoneLocation) external
```

### setRewardNetwork

```solidity
function setRewardNetwork(address _nodeAddress, uint256 network) external
```

### getRewardNetwork

```solidity
function getRewardNetwork(address _nodeAddress) external view returns (uint256)
```

### getFeeDistributorInitialised

```solidity
function getFeeDistributorInitialised(address _nodeAddress) external view returns (bool)
```

### initialiseFeeDistributor

```solidity
function initialiseFeeDistributor() external
```

### getAverageNodeFee

```solidity
function getAverageNodeFee(address _nodeAddress) external view returns (uint256)
```

### setSmoothingPoolRegistrationState

```solidity
function setSmoothingPoolRegistrationState(bool _state) external
```

### getSmoothingPoolRegistrationState

```solidity
function getSmoothingPoolRegistrationState(address _nodeAddress) external returns (bool)
```

### getSmoothingPoolRegistrationChanged

```solidity
function getSmoothingPoolRegistrationChanged(address _nodeAddress) external returns (uint256)
```

### getSmoothingPoolRegisteredNodeCount

```solidity
function getSmoothingPoolRegisteredNodeCount(uint256 _offset, uint256 _limit) external view returns (uint256)
```

### getNodeDetails

```solidity
function getNodeDetails(address _nodeAddress) external view returns (struct NodeDetails)
```

### getNodeAddresses

```solidity
function getNodeAddresses(uint256 _offset, uint256 _limit) external view returns (address[])
```

## RocketNodeStakingInterface

### getTotalRPLStake

```solidity
function getTotalRPLStake() external view returns (uint256)
```

### getNodeRPLStake

```solidity
function getNodeRPLStake(address _nodeAddress) external view returns (uint256)
```

### getNodeETHMatched

```solidity
function getNodeETHMatched(address _nodeAddress) external view returns (uint256)
```

### getNodeETHProvided

```solidity
function getNodeETHProvided(address _nodeAddress) external view returns (uint256)
```

### getNodeETHCollateralisationRatio

```solidity
function getNodeETHCollateralisationRatio(address _nodeAddress) external view returns (uint256)
```

### getNodeRPLStakedTime

```solidity
function getNodeRPLStakedTime(address _nodeAddress) external view returns (uint256)
```

### getNodeEffectiveRPLStake

```solidity
function getNodeEffectiveRPLStake(address _nodeAddress) external view returns (uint256)
```

### getNodeMinimumRPLStake

```solidity
function getNodeMinimumRPLStake(address _nodeAddress) external view returns (uint256)
```

### getNodeMaximumRPLStake

```solidity
function getNodeMaximumRPLStake(address _nodeAddress) external view returns (uint256)
```

### getNodeETHMatchedLimit

```solidity
function getNodeETHMatchedLimit(address _nodeAddress) external view returns (uint256)
```

### stakeRPL

```solidity
function stakeRPL(uint256 _amount) external
```

### stakeRPLFor

```solidity
function stakeRPLFor(address _nodeAddress, uint256 _amount) external
```

### setStakeRPLForAllowed

```solidity
function setStakeRPLForAllowed(address _caller, bool _allowed) external
```

### withdrawRPL

```solidity
function withdrawRPL(uint256 _amount) external
```

### slashRPL

```solidity
function slashRPL(address _nodeAddress, uint256 _ethSlashAmount) external
```

## RocketRewardsPoolInterface

### getRewardIndex

```solidity
function getRewardIndex() external view returns (uint256)
```

### getRPLBalance

```solidity
function getRPLBalance() external view returns (uint256)
```

### getPendingRPLRewards

```solidity
function getPendingRPLRewards() external view returns (uint256)
```

### getPendingETHRewards

```solidity
function getPendingETHRewards() external view returns (uint256)
```

### getClaimIntervalTimeStart

```solidity
function getClaimIntervalTimeStart() external view returns (uint256)
```

### getClaimIntervalTime

```solidity
function getClaimIntervalTime() external view returns (uint256)
```

### getClaimIntervalsPassed

```solidity
function getClaimIntervalsPassed() external view returns (uint256)
```

### getClaimIntervalExecutionBlock

```solidity
function getClaimIntervalExecutionBlock(uint256 _interval) external view returns (uint256)
```

### getClaimingContractPerc

```solidity
function getClaimingContractPerc(string _claimingContract) external view returns (uint256)
```

### getClaimingContractsPerc

```solidity
function getClaimingContractsPerc(string[] _claimingContracts) external view returns (uint256[])
```

### getTrustedNodeSubmitted

```solidity
function getTrustedNodeSubmitted(address _trustedNodeAddress, uint256 _rewardIndex) external view returns (bool)
```

### getSubmissionCount

```solidity
function getSubmissionCount(struct RewardSubmission _submission) external view returns (uint256)
```

### submitRewardSnapshot

```solidity
function submitRewardSnapshot(struct RewardSubmission _submission) external
```

### executeRewardSnapshot

```solidity
function executeRewardSnapshot(struct RewardSubmission _submission) external
```

## RocketRewardsRelayInterface

### relayRewards

```solidity
function relayRewards(uint256 _intervalIndex, bytes32 _merkleRoot, uint256 _rewardsRPL, uint256 _rewardsETH) external
```

### claim

```solidity
function claim(address _nodeAddress, uint256[] _intervalIndex, uint256[] _amountRPL, uint256[] _amountETH, bytes32[][] _merkleProof) external
```

### claimAndStake

```solidity
function claimAndStake(address _nodeAddress, uint256[] _intervalIndex, uint256[] _amountRPL, uint256[] _amountETH, bytes32[][] _merkleProof, uint256 _stakeAmount) external
```

### isClaimed

```solidity
function isClaimed(uint256 _intervalIndex, address _claimer) external view returns (bool)
```

## RocketSmoothingPoolInterface

### withdrawEther

```solidity
function withdrawEther(address _to, uint256 _amount) external
```

## RocketClaimDAOInterface

### spend

```solidity
function spend(string _invoiceID, address _recipientAddress, uint256 _amount) external
```

## RocketClaimTrustedNodeInterface

### getEnabled

```solidity
function getEnabled() external view returns (bool)
```

### getClaimPossible

```solidity
function getClaimPossible(address _trustedNodeAddress) external view returns (bool)
```

### getClaimRewardsPerc

```solidity
function getClaimRewardsPerc(address _trustedNodeAddress) external view returns (uint256)
```

### getClaimRewardsAmount

```solidity
function getClaimRewardsAmount(address _trustedNodeAddress) external view returns (uint256)
```

### register

```solidity
function register(address _trustedNode, bool _enable) external
```

### claim

```solidity
function claim() external
```

## RocketTokenRETHInterface

### getEthValue

```solidity
function getEthValue(uint256 _rethAmount) external view returns (uint256)
```

### getRethValue

```solidity
function getRethValue(uint256 _ethAmount) external view returns (uint256)
```

### getExchangeRate

```solidity
function getExchangeRate() external view returns (uint256)
```

### getTotalCollateral

```solidity
function getTotalCollateral() external view returns (uint256)
```

### getCollateralRate

```solidity
function getCollateralRate() external view returns (uint256)
```

### depositExcess

```solidity
function depositExcess() external payable
```

### depositExcessCollateral

```solidity
function depositExcessCollateral() external
```

### mint

```solidity
function mint(uint256 _ethAmount, address _to) external
```

### burn

```solidity
function burn(uint256 _rethAmount) external
```

## RocketTokenRPLInterface

### getInflationCalcTime

```solidity
function getInflationCalcTime() external view returns (uint256)
```

### getInflationIntervalTime

```solidity
function getInflationIntervalTime() external view returns (uint256)
```

### getInflationIntervalRate

```solidity
function getInflationIntervalRate() external view returns (uint256)
```

### getInflationIntervalsPassed

```solidity
function getInflationIntervalsPassed() external view returns (uint256)
```

### getInflationIntervalStartTime

```solidity
function getInflationIntervalStartTime() external view returns (uint256)
```

### getInflationRewardsContractAddress

```solidity
function getInflationRewardsContractAddress() external view returns (address)
```

### inflationCalculate

```solidity
function inflationCalculate() external view returns (uint256)
```

### inflationMintTokens

```solidity
function inflationMintTokens() external returns (uint256)
```

### swapTokens

```solidity
function swapTokens(uint256 _amount) external
```

## AddressQueueStorageInterface

### getLength

```solidity
function getLength(bytes32 _key) external view returns (uint256)
```

### getItem

```solidity
function getItem(bytes32 _key, uint256 _index) external view returns (address)
```

### getIndexOf

```solidity
function getIndexOf(bytes32 _key, address _value) external view returns (int256)
```

### enqueueItem

```solidity
function enqueueItem(bytes32 _key, address _value) external
```

### dequeueItem

```solidity
function dequeueItem(bytes32 _key) external returns (address)
```

### removeItem

```solidity
function removeItem(bytes32 _key, address _value) external
```

## AddressSetStorageInterface

### getCount

```solidity
function getCount(bytes32 _key) external view returns (uint256)
```

### getItem

```solidity
function getItem(bytes32 _key, uint256 _index) external view returns (address)
```

### getIndexOf

```solidity
function getIndexOf(bytes32 _key, address _value) external view returns (int256)
```

### addItem

```solidity
function addItem(bytes32 _key, address _value) external
```

### removeItem

```solidity
function removeItem(bytes32 _key, address _value) external
```

## MinipoolDeposit

```solidity
enum MinipoolDeposit {
  None,
  Full,
  Half,
  Empty,
  Variable
}
```

## MinipoolDetails

```solidity
struct MinipoolDetails {
  bool exists;
  address minipoolAddress;
  bytes pubkey;
  enum MinipoolStatus status;
  uint256 statusBlock;
  uint256 statusTime;
  bool finalised;
  enum MinipoolDeposit depositType;
  uint256 nodeFee;
  uint256 nodeDepositBalance;
  bool nodeDepositAssigned;
  uint256 userDepositBalance;
  bool userDepositAssigned;
  uint256 userDepositAssignedTime;
  bool useLatestDelegate;
  address delegate;
  address previousDelegate;
  address effectiveDelegate;
  uint256 penaltyCount;
  uint256 penaltyRate;
  address nodeAddress;
}
```

## MinipoolStatus

```solidity
enum MinipoolStatus {
  Initialised,
  Prelaunch,
  Staking,
  Withdrawable,
  Dissolved
}
```

## NodeDetails

```solidity
struct NodeDetails {
  bool exists;
  uint256 registrationTime;
  string timezoneLocation;
  bool feeDistributorInitialised;
  address feeDistributorAddress;
  uint256 rewardNetwork;
  uint256 rplStake;
  uint256 effectiveRPLStake;
  uint256 minimumRPLStake;
  uint256 maximumRPLStake;
  uint256 ethMatched;
  uint256 ethMatchedLimit;
  uint256 minipoolCount;
  uint256 balanceETH;
  uint256 balanceRETH;
  uint256 balanceRPL;
  uint256 balanceOldRPL;
  uint256 depositCreditBalance;
  uint256 distributorBalanceUserETH;
  uint256 distributorBalanceNodeETH;
  address withdrawalAddress;
  address pendingWithdrawalAddress;
  bool smoothingPoolRegistrationState;
  uint256 smoothingPoolRegistrationChanged;
  address nodeAddress;
}
```

## RewardSubmission

```solidity
struct RewardSubmission {
  uint256 rewardIndex;
  uint256 executionBlock;
  uint256 consensusBlock;
  bytes32 merkleRoot;
  string merkleTreeCID;
  uint256 intervalsPassed;
  uint256 treasuryRPL;
  uint256[] trustedNodeRPL;
  uint256[] nodeRPL;
  uint256[] nodeETH;
  uint256 userETH;
}
```

## SettingType

```solidity
enum SettingType {
  UINT256,
  BOOL,
  ADDRESS,
  STRING,
  BYTES,
  BYTES32,
  INT256
}
```

## DepositPool

Immutable deposit pool which holds deposits and provides a minimum source of liquidity for depositors.
ETH + RPL intakes from token mints and validator yields and sends to respective ERC4246 vaults.

### splitRatioEth

```solidity
uint256 splitRatioEth
```

### splitRatioRpl

```solidity
uint256 splitRatioRpl
```

### TotalValueUpdated

```solidity
event TotalValueUpdated(uint256 oldValue, uint256 newValue)
```

Emitted whenever this contract sends or receives ETH outside of the protocol.

### SplitRatioEthUpdated

```solidity
event SplitRatioEthUpdated(uint256 oldValue, uint256 newValue)
```

### SplitRatioRplUpdated

```solidity
event SplitRatioRplUpdated(uint256 oldValue, uint256 newValue)
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(address directoryAddress) public virtual
```

_Initializes the DepositPool contract with the specified directory address._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| directoryAddress | address | The address of the directory contract. |

### getTvlEth

```solidity
function getTvlEth() public view returns (uint256)
```

Retrieves the total ETH and WETH value locked inside this deposit pool.

_This function calculates and returns the combined value of ETH and WETH held by the deposit pool.
     It sums the ETH balance of this contract and the WETH balance from the WETH contract._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total value in ETH and WETH locked in the deposit pool. |

### getTvlRpl

```solidity
function getTvlRpl() public view returns (uint256)
```

Retrieves the total RPL value locked inside this deposit pool.

_This function calculates and returns the total amount of RPL tokens held by the deposit pool._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total value in RPL locked in the deposit pool. |

### setSplitRatioEth

```solidity
function setSplitRatioEth(uint256 newSplitRatio) external
```

Sets the split ratio for ETH deposits.

_This function allows an administrator to update the split ratio for ETH deposits in the deposit pool.
     The split ratio determines how ETH deposits are distributed between the OperatorDistributor and the WETHVault.
Throws an error if the new split ratio is greater than 100% (100000) to ensure it stays within a valid range._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newSplitRatio | uint256 | The new split ratio for ETH deposits, expressed as a percentage (e.g., 30000 for 30%). |

### setSplitRatioRpl

```solidity
function setSplitRatioRpl(uint256 newSplitRatio) external
```

Sets the split ratio for RPL deposits.

_This function allows an administrator to update the split ratio for RPL deposits in the deposit pool.
     The split ratio determines how RPL deposits are distributed between the OperatorDistributor and the RPLVault.
Throws an error if the new split ratio is greater than 100% (100000) to ensure it stays within a valid range._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newSplitRatio | uint256 | The new split ratio for RPL deposits, expressed as a percentage (e.g., 30000 for 30%). |

### unstakeRpl

```solidity
function unstakeRpl(uint256 amount) external
```

Unstakes a specified amount of RPL tokens.

_This function allows an administrator to unstake a specified amount of RPL tokens from the Rocket Node Staking contract.
The tokens will be withdrawn from the Rocket Node Staking contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The amount of RPL tokens to unstake. |

### stakeRPLFor

```solidity
function stakeRPLFor(address _nodeAddress, uint256 _amount) external
```

Stakes a specified amount of RPL tokens on behalf of a node operator.

_This function allows the protocol or an administrator to stake a specified amount of RPL tokens on behalf of a node operator
     using the Rocket Node Staking contract.
This function ensures that the specified amount of RPL tokens is approved and then staked for the given node operator._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator on whose behalf the RPL tokens are being staked. |
| _amount | uint256 | The amount of RPL tokens to stake. |

### sendEthToDistributors

```solidity
function sendEthToDistributors() public
```

Sends ETH to the OperatorDistributor and WETHVault based on specified ratios.

_This function splits the total ETH balance of the contract into WETH tokens and distributes them between the WETHVault and OperatorDistributor
     based on the `splitRatioEth`. If the `requiredCapital` from WETHVault is zero, all the ETH balance is sent to the OperatorDistributor._

### sendRplToDistributors

```solidity
function sendRplToDistributors() public
```

Sends RPL tokens to the OperatorDistributor and RPLVault based on specified ratios.

_This function distributes RPL tokens held by the contract between the RPLVault and OperatorDistributor
     based on the `splitRatioRpl`. If the `requiredCapital` from RPLVault is zero, all RPL tokens are sent to the OperatorDistributor._

### receive

```solidity
receive() external payable
```

Receive hook for ETH deposits.

_This function allows the contract to receive ETH deposits sent to its address.
     It is used as a fallback function to accept incoming ETH transfers._

## Protocol

```solidity
struct Protocol {
  address whitelist;
  address payable wethVault;
  address payable rplVault;
  address payable depositPool;
  address payable operatorDistributor;
  address payable yieldDistributor;
  address oracle;
  address priceFetcher;
  address rocketStorage;
  address rocketNodeManager;
  address rocketNodeStaking;
  address rplToken;
  address payable weth;
  address uniswapV3Pool;
}
```

## Directory

The Directory contract holds references to all protocol contracts and role mechanisms.

_The Directory contract is a central component of the protocol, managing contract addresses and access control roles.
     It provides the ability to set contract addresses during initialization, manage treasury, and update the Oracle contract._

### constructor

```solidity
constructor() public
```

### getImplementation

```solidity
function getImplementation() public view returns (address)
```

Retrieves the address of the current implementation of the contract.

_This function allows users to query the current implementation contract address._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of the current implementation contract. |

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal view
```

Internal function to authorize contract upgrades.

_This function is used internally to ensure that only administrators can authorize contract upgrades.
     It checks whether the sender has the required ADMIN_ROLE before allowing the upgrade._

### getWhitelistAddress

```solidity
function getWhitelistAddress() public view returns (address)
```

### getWETHVaultAddress

```solidity
function getWETHVaultAddress() public view returns (address payable)
```

### getRPLVaultAddress

```solidity
function getRPLVaultAddress() public view returns (address payable)
```

### getDepositPoolAddress

```solidity
function getDepositPoolAddress() public view returns (address payable)
```

### getRETHOracleAddress

```solidity
function getRETHOracleAddress() public view returns (address)
```

### getRocketStorageAddress

```solidity
function getRocketStorageAddress() public view returns (address)
```

### getOperatorDistributorAddress

```solidity
function getOperatorDistributorAddress() public view returns (address payable)
```

### getYieldDistributorAddress

```solidity
function getYieldDistributorAddress() public view returns (address payable)
```

### getRocketNodeManagerAddress

```solidity
function getRocketNodeManagerAddress() public view returns (address)
```

### getRocketNodeStakingAddress

```solidity
function getRocketNodeStakingAddress() public view returns (address)
```

### getPriceFetcherAddress

```solidity
function getPriceFetcherAddress() public view returns (address)
```

### getWETHAddress

```solidity
function getWETHAddress() public view returns (address payable)
```

### getRPLAddress

```solidity
function getRPLAddress() public view returns (address)
```

### getTreasuryAddress

```solidity
function getTreasuryAddress() public view returns (address)
```

### getUniswapV3PoolAddress

```solidity
function getUniswapV3PoolAddress() public view returns (address)
```

### initialize

```solidity
function initialize(struct Protocol newProtocol) public
```

Initializes the Directory contract with the addresses of various protocol contracts.

_This function sets initial contract addresses and grants admin roles to core protocol contracts.
     It can only be called once during contract deployment._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newProtocol | struct Protocol | A Protocol struct containing addresses of protocol contracts. |

### setTreasurer

```solidity
function setTreasurer(address newTreasurer) public
```

### setOracle

```solidity
function setOracle(address newOracle) public
```

### setAll

```solidity
function setAll(struct Protocol newProtocol) public
```

Updates all protocol contract addresses in a single call.

_This function allows an administrator to update all protocol contract addresses simultaneously._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newProtocol | struct Protocol | A Protocol struct containing updated addresses of protocol contracts. |

## IWETH

### deposit

```solidity
function deposit() external payable
```

### withdraw

```solidity
function withdraw(uint256 wad) external
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

_Returns the amount of tokens in existence._

### approve

```solidity
function approve(address guy, uint256 wad) external returns (bool)
```

### transfer

```solidity
function transfer(address dst, uint256 wad) external returns (bool)
```

### transferFrom

```solidity
function transferFrom(address src, address dst, uint256 wad) external returns (bool)
```

## IXRETHOracle

### getTotalYieldAccrued

```solidity
function getTotalYieldAccrued() external view returns (uint256)
```

_Oracle data verified using cryptographic fraud proofs._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total value locked in the protocol, in wei, for each minipool + rewards earned. |

### setTotalYieldAccrued

```solidity
function setTotalYieldAccrued(uint256 yield) external
```

_Sets decentralized data provided by the Constellation network's cryptographic fraud proofs._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| yield | uint256 | The total value locked in the protocol, in wei, for each minipool + rewards earned. |

## RocketDAOProtocolSettingsNetworkInterface

### getNodeConsensusThreshold

```solidity
function getNodeConsensusThreshold() external view returns (uint256)
```

### getNodePenaltyThreshold

```solidity
function getNodePenaltyThreshold() external view returns (uint256)
```

### getPerPenaltyRate

```solidity
function getPerPenaltyRate() external view returns (uint256)
```

### getSubmitBalancesEnabled

```solidity
function getSubmitBalancesEnabled() external view returns (bool)
```

### getSubmitBalancesFrequency

```solidity
function getSubmitBalancesFrequency() external view returns (uint256)
```

### getSubmitPricesEnabled

```solidity
function getSubmitPricesEnabled() external view returns (bool)
```

### getSubmitPricesFrequency

```solidity
function getSubmitPricesFrequency() external view returns (uint256)
```

### getMinimumNodeFee

```solidity
function getMinimumNodeFee() external view returns (uint256)
```

### getTargetNodeFee

```solidity
function getTargetNodeFee() external view returns (uint256)
```

### getMaximumNodeFee

```solidity
function getMaximumNodeFee() external view returns (uint256)
```

### getNodeFeeDemandRange

```solidity
function getNodeFeeDemandRange() external view returns (uint256)
```

### getTargetRethCollateralRate

```solidity
function getTargetRethCollateralRate() external view returns (uint256)
```

### getRethDepositDelay

```solidity
function getRethDepositDelay() external view returns (uint256)
```

### getSubmitRewardsEnabled

```solidity
function getSubmitRewardsEnabled() external view returns (bool)
```

## MinipoolStatus

```solidity
enum MinipoolStatus {
  Initialised,
  Prelaunch,
  Staking,
  Withdrawable,
  Dissolved
}
```

## IMinipool

### getNodeAddress

```solidity
function getNodeAddress() external view returns (address)
```

### getStatus

```solidity
function getStatus() external view returns (enum MinipoolStatus)
```

### getPreLaunchValue

```solidity
function getPreLaunchValue() external view returns (uint256)
```

### getNodeDepositBalance

```solidity
function getNodeDepositBalance() external view returns (uint256)
```

### getUserDepositBalance

```solidity
function getUserDepositBalance() external view returns (uint256)
```

### distributeBalance

```solidity
function distributeBalance(bool _rewardsOnly) external
```

Distributes the contract's balance.
        If balance is greater or equal to 8 ETH, the NO can call to distribute capital and finalise the minipool.
        If balance is greater or equal to 8 ETH, users who have called `beginUserDistribute` and waited the required
        amount of time can call to distribute capital.
        If balance is lower than 8 ETH, can be called by anyone and is considered a partial withdrawal and funds are
        split as rewards.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardsOnly | bool | If set to true, will revert if balance is not being treated as rewards |

### userDistributeAllowed

```solidity
function userDistributeAllowed() external view returns (bool)
```

Returns true if enough time has passed for a user to distribute

### beginUserDistribute

```solidity
function beginUserDistribute() external
```

Allows a user (other than the owner of this minipool) to signal they want to call distribute.
        After waiting the required period, anyone may then call `distributeBalance()`.

## IRocketNodeManager

### setSmoothingPoolRegistrationState

```solidity
function setSmoothingPoolRegistrationState(bool _state) external returns (bool)
```

_Allows a node to register or deregister from the smoothing pool_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _state | bool | The state to set |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | isRegistered The new registration state of the smoothing pool |

### getSmoothingPoolRegistrationState

```solidity
function getSmoothingPoolRegistrationState(address _nodeAddress) external view returns (bool)
```

_Returns the registration state of the smoothing pool_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node address to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | isRegistered The registration state of the smoothing pool |

## IRocketNodeStaking

### getNodeMinimumRPLStake

```solidity
function getNodeMinimumRPLStake(address _nodeAddress) external view returns (uint256)
```

Calculate and return a node's minimum RPL stake to collateralize their minipools

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to calculate for |

### stakeRPLFor

```solidity
function stakeRPLFor(address _nodeAddress, uint256 _amount) external
```

Accept an RPL stake from any address for a specified node
        Requires caller to have approved this contract to spend RPL
        Requires caller to be on the node operator's allow list (see `setStakeForAllowed`)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to stake on behalf of |
| _amount | uint256 | The amount of RPL to stake |

### getNodeRPLStake

```solidity
function getNodeRPLStake(address _nodeAddress) external view returns (uint256)
```

Returns the amount a given node operator has staked

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to query |

### withdrawRPL

```solidity
function withdrawRPL(uint256 _amount) external
```

## IRocketStorage

### getNodeWithdrawalAddress

```solidity
function getNodeWithdrawalAddress(address _nodeAddress) external view returns (address)
```

### setWithdrawalAddress

```solidity
function setWithdrawalAddress(address _nodeAddress, address _newWithdrawalAddress, bool _confirm) external
```

## RocketTokenRPLInterface

### getInflationCalcTime

```solidity
function getInflationCalcTime() external view returns (uint256)
```

### getInflationIntervalTime

```solidity
function getInflationIntervalTime() external view returns (uint256)
```

### getInflationIntervalRate

```solidity
function getInflationIntervalRate() external view returns (uint256)
```

### getInflationIntervalsPassed

```solidity
function getInflationIntervalsPassed() external view returns (uint256)
```

### getInflationIntervalStartTime

```solidity
function getInflationIntervalStartTime() external view returns (uint256)
```

### getInflationRewardsContractAddress

```solidity
function getInflationRewardsContractAddress() external view returns (address)
```

### inflationCalculate

```solidity
function inflationCalculate() external view returns (uint256)
```

### inflationMintTokens

```solidity
function inflationMintTokens() external returns (uint256)
```

### swapTokens

```solidity
function swapTokens(uint256 _amount) external
```

## OperatorDistributor

### MinipoolCreated

```solidity
event MinipoolCreated(address _minipoolAddress, address _nodeAddress)
```

### MinipoolDestroyed

```solidity
event MinipoolDestroyed(address _minipoolAddress, address _nodeAddress)
```

### WarningNoMiniPoolsToHarvest

```solidity
event WarningNoMiniPoolsToHarvest()
```

### _queuedEth

```solidity
uint256 _queuedEth
```

### minipoolAddresses

```solidity
address[] minipoolAddresses
```

### nextMinipoolHavestIndex

```solidity
uint256 nextMinipoolHavestIndex
```

### targetStakeRatio

```solidity
uint256 targetStakeRatio
```

### numMinipoolsProcessedPerInterval

```solidity
uint256 numMinipoolsProcessedPerInterval
```

### minipoolIndexMap

```solidity
mapping(address => uint256) minipoolIndexMap
```

### minipoolAmountFundedEth

```solidity
mapping(address => uint256) minipoolAmountFundedEth
```

### minipoolAmountFundedRpl

```solidity
mapping(address => uint256) minipoolAmountFundedRpl
```

### nodeOperatorOwnedMinipools

```solidity
mapping(address => address[]) nodeOperatorOwnedMinipools
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(address _rocketStorageAddress) public
```

Initializes the contract with the provided storage address.

_This function should only be called once, during contract creation or proxy initialization.
It overrides the `initialize` function from a parent contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _rocketStorageAddress | address | The address of the storage contract. |

### receive

```solidity
receive() external payable
```

Receives incoming Ether and adds it to the queued balance.

_This is the fallback function that is called when Ether is sent directly to the contract.
Ensure that any mechanisms consuming `_queuedEth` are secure._

### getAmountFundedEth

```solidity
function getAmountFundedEth() public view returns (uint256)
```

Returns the total amount of Ether funded across all minipools.

_Iterates over all minipool addresses and sums up the funded Ether from each minipool.
Make sure to be cautious with this function as it could be expensive in gas if the `minipoolAddresses` array becomes large._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | amountFunded The total amount of Ether funded in all minipools. |

### getAmountFundedRpl

```solidity
function getAmountFundedRpl() public view returns (uint256)
```

Returns the total amount of RPL tokens funded across all minipools.

_Iterates over all minipool addresses and sums up the funded RPL tokens from each minipool.
Be cautious using this function as it could become gas-expensive if the `minipoolAddresses` array grows significantly._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | amountFunded The total amount of RPL tokens funded in all minipools. |

### getTvlEth

```solidity
function getTvlEth() public view returns (uint256)
```

Gets the total ETH value locked inside the protocol, including inside of validators, the OperatorDistributor,
and this contract.

_This function sums up the balance of this contract with the amount of funded ETH across all minipools.
Ensure that all sources of ETH (like the OperatorDistributor) are properly accounted for in the calculation._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total amount of Ether locked inside the protocol. |

### getTvlRpl

```solidity
function getTvlRpl() public view returns (uint256)
```

Gets the total RPL value locked inside the protocol, including inside of validators, the OperatorDistributor,
and this contract.

_This function calculates the total RPL by summing up the balance of RPL tokens of this contract
with the amount of funded RPL across all minipools. It retrieves the RPL token address from the `_directory` contract.
Ensure that all sources of RPL (like the OperatorDistributor) are accurately accounted for._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total amount of RPL tokens locked inside the protocol. |

### removeMinipoolAddress

```solidity
function removeMinipoolAddress(address _address) public
```

Removes a minipool address from the tracked list when a node operator exits.

_This function efficiently reorders the minipool addresses array and updates the index map.
It then resets the funded amount of ETH and RPL tokens for the removed minipool.
Should only be called by authorized protocol actors or admin._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _address | address | The address of the minipool to be removed. Emits a `MinipoolDestroyed` event upon successful removal. |

### removeNodeOperator

```solidity
function removeNodeOperator(address _address) external
```

Removes a node operator and all associated minipools.

_Iterates through all minipools owned by the node operator and removes them.
This action cannot be reversed, so it should be executed with caution.
Only authorized protocol actors or admin can call this function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _address | address | The address of the node operator to be removed. |

### _stakeRPLFor

```solidity
function _stakeRPLFor(address _nodeAddress) internal
```

Stakes the minimum required RPL tokens on behalf of a node.

_This function first fetches the node's minimum RPL stake requirement,
approves the Node Staking contract to spend the RPL, and then stakes the RPL for the node.
It assumes that the contract already holds enough RPL tokens for the staking process._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node for which RPL should be staked. |

### _validateWithdrawalAddress

```solidity
function _validateWithdrawalAddress(address _nodeAddress) internal view
```

Validates that the withdrawal address for a node is set to the Deposit Pool address.

_This function fetches the node's withdrawal address from RocketStorage and checks if
it matches the Deposit Pool address. Throws an error if they don't match.
It is a security check to ensure minipools delegate control to the Deposit Pool._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node whose withdrawal address should be validated. |

### prepareNodeForReimbursement

```solidity
function prepareNodeForReimbursement(address _nodeAddress) external
```

Prepares a node for minipool creation by setting up necessary staking and validations.

_This function first validates the node's withdrawal address, then calculates the required amount of
RPL to stake based on the number of validators associated with the node, and performs a top-up.
It stakes an amount equivalent to `(2.4 + 100% padding) ether` worth of RPL for each validator of the node.
Only the protocol or admin can call this function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to be prepared for minipool creation. |

### reimburseNodeForMinipool

```solidity
function reimburseNodeForMinipool(bytes sig, address newMinipoolAdress) public
```

Reimburses a node for minipool creation, validates the minipool and handles necessary staking.

_The function goes through multiple validation steps:
1. Checks if the node is in the whitelist.
2. Validates that the minipool's creation was signed by the admin.
3. Validates the node's withdrawal address.
4. Checks if the minipool is registered in the smoothing pool.
5. Ensures there's sufficient ETH in queue for reimbursement.
After validations, it performs necessary top-ups, updates the node and minipool data, and then transfers out the ETH._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sig | bytes | Signature from the admin server confirming minipool creation. |
| newMinipoolAdress | address | Address of the newly created minipool. |

### performTopUp

```solidity
function performTopUp(address _nodeAddress, uint256 _ethStaked) public
```

Tops up the node operator's RPL stake if it falls below the target stake ratio.

_This function checks the current staking ratio of the node (calculated as ETH staked times its price in RPL
divided by RPL staked). If the ratio is below a predefined target, it calculates the necessary RPL amount to
bring the stake ratio back to the target. Then, the function either stakes the required RPL or stakes
the remaining RPL balance if it's not enough._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator. |
| _ethStaked | uint256 | The amount of ETH currently staked by the node operator. |

### processNextMinipool

```solidity
function processNextMinipool() external
```

Processes rewards for a predefined number of minipools. This function is meant to be called during
the creation of new intervals. It serves to withdraw rewards from minipools and to top up the RPL stake.

_The function first checks if there are any minipools to process. If there aren't, it emits a warning event
and exits. Otherwise, it calls the internal function _processNextMinipool() for a certain number of times defined
by numMinipoolsProcessedPerInterval._

### _processNextMinipool

```solidity
function _processNextMinipool() internal
```

_Processes a single minipool by performing RPL top-up and distributing balance if certain conditions are met._

### setNumMinipoolsProcessedPerInterval

```solidity
function setNumMinipoolsProcessedPerInterval(uint256 _numMinipoolsProcessedPerInterval) external
```

Set the number of minipools to be processed per interval.

_This function can only be called by the contract's admin.
Adjusting this parameter allows the admin to control and optimize the load
on the network for each interval, especially in scenarios with a large number of minipools._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _numMinipoolsProcessedPerInterval | uint256 | The new number of minipools to process per interval. |

### getMinipoolAddresses

```solidity
function getMinipoolAddresses() external view returns (address[])
```

Retrieves the list of minipool addresses managed by the contract.

_This function provides a way to fetch all the current minipool addresses in memory.
Useful for off-chain services or frontend interfaces that need to display or interact
with the various minipools._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | A list of addresses corresponding to the minipools. |

## Reward

```solidity
struct Reward {
  address recipient;
  uint256 eth;
}
```

## Claim

```solidity
struct Claim {
  uint256 amount;
  uint256 numOperators;
}
```

## YieldDistributor

distributes rewards in weth to node operators

### RewardDistributed

```solidity
event RewardDistributed(struct Reward)
```

### WarningAlreadyClaimed

```solidity
event WarningAlreadyClaimed(address operator, uint256 interval)
```

### totalYieldAccrued

```solidity
uint256 totalYieldAccrued
```

### yieldAccruedInInterval

```solidity
uint256 yieldAccruedInInterval
```

### dustAccrued

```solidity
uint256 dustAccrued
```

### claims

```solidity
mapping(uint256 => struct Claim) claims
```

### hasClaimed

```solidity
mapping(address => mapping(uint256 => bool)) hasClaimed
```

### currentInterval

```solidity
uint256 currentInterval
```

### currentIntervalGenesisTime

```solidity
uint256 currentIntervalGenesisTime
```

### maxIntervalLengthSeconds

```solidity
uint256 maxIntervalLengthSeconds
```

### k

```solidity
uint256 k
```

### maxValidators

```solidity
uint256 maxValidators
```

### initialize

```solidity
function initialize(address _directory) public
```

Initializes the contract with the specified directory address and sets the initial configurations.

_This function is an override and should be called only once. It sets up the initial values
for the contract including the interval genesis time, maximum interval length, and configurations for
validator settings._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _directory | address | The address of the directory contract or service that this contract will reference. |

### wethReceived

```solidity
function wethReceived(uint256 weth) external
```

Handles the event when WETH (Wrapped Ether) is received by the contract.

_This function should only be callable by the protocol (or a designated service). It forwards the
WETH amount received to an internal handler function for further processing._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| weth | uint256 | The amount of WETH received by the contract. |

### _wethReceived

```solidity
function _wethReceived(uint256 weth) internal
```

_Handles the internal logic when WETH (Wrapped Ether) is received by the contract.
It updates the total yield accrued and checks if the current interval should be finalized._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| weth | uint256 | The amount of WETH received by the contract. |

### getClaims

```solidity
function getClaims() public view returns (struct Claim[])
```

Retrieves all claims from the beginning up to and including the current interval.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Claim[] | _claims An array containing all claims up to the current interval. |

### harvest

```solidity
function harvest(address _rewardee, uint256 _startInterval, uint256 _endInterval) public
```

Distributes rewards accrued between two intervals to a specific rewardee.

_The function calculates the reward based on the number of validators managed by the rewardee and uses an exponential function to determine the portion of the reward. Any rewards not claimed due to conditions or errors are considered "dust" and are accumulated in the `dustAccrued` variable. The caller should ensure that the function is called in a gas-efficient manner._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardee | address | The address of the operator to distribute rewards to. |
| _startInterval | uint256 | The interval (inclusive) from which to start distributing the rewards. |
| _endInterval | uint256 | The interval (inclusive) at which to end distributing the rewards. |

### finalizeInterval

```solidity
function finalizeInterval() public
```

Ends the current rewards interval and starts a new one.

_This function records the rewards for the current interval and increments the interval counter. It's primarily triggered when there's a change in the number of operators or when the duration of the current interval exceeds the `maxIntervalLengthSeconds`. Also, it triggers the process of distributing rewards to the minipools via the `OperatorDistributor`. Intervals without yield are skipped, except for the first interval._

### setMaxIntervalTime

```solidity
function setMaxIntervalTime(uint256 _maxIntervalLengthSeconds) public
```

Updates the maximum duration for each rewards interval.

_This function allows the admin to adjust the length of time between rewards intervals. Adjustments may be necessary based on changing network conditions or governance decisions._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _maxIntervalLengthSeconds | uint256 | The new maximum duration (in seconds) for each interval. |

### adminSweep

```solidity
function adminSweep(address treasury) public
```

Transfers the accumulated dust (residual ETH) to the specified treasury address.

_This function can only be called by the contract's admin. It allows for the collection of small residual ETH balances (dust) that may have accumulated due to rounding errors or other minor discrepancies._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| treasury | address | The address of the treasury to which the dust will be sent. |

### setRewardIncentiveModel

```solidity
function setRewardIncentiveModel(uint256 _k, uint256 _maxValidators) public
```

Sets the parameters for the reward incentive model used in reward distribution.

_This function can only be called by the contract's admin. Adjusting these parameters can change the reward distribution dynamics for validators._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _k | uint256 | The curvature parameter for the exponential function used in reward calculation. |
| _maxValidators | uint256 | The maximum number of validators to be considered in the reward calculation. |

### onlyOperator

```solidity
modifier onlyOperator()
```

Modifier to ensure the calling account is a whitelisted operator.

_Throws if the calling account is not in the operator whitelist._

### receive

```solidity
receive() external payable
```

Fallback function to receive ETH and convert it to WETH (Wrapped ETH).

_When ETH is sent to this contract, it is automatically wrapped into WETH and the corresponding amount is processed._

## PriceFetcher

### getPrice

```solidity
function getPrice() public view returns (uint256)
```

Returns the average price of ETH denominated in RPL with 18 decimals from 45 to 60 minutes ago

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The price of ETH denominated in RPL with 18 decimals |

## MockPriceFetcher

### price

```solidity
uint256 price
```

### getPrice

```solidity
function getPrice() public view returns (uint256)
```

### setPrice

```solidity
function setPrice(uint256 _price) public
```

## WhitelistV2

Controls operator access to the protocol.
Only modifiable by admin. Upgradeable and intended to be replaced by a ZK-ID check when possible.

### testUpgrade

```solidity
function testUpgrade() public pure returns (uint256)
```

## ProtocolMathTest

### test

```solidity
function test(uint256 x, uint256 k, uint256 maxValue) public pure returns (uint256)
```

## RPLVault

### NAME

```solidity
string NAME
```

### SYMBOL

```solidity
string SYMBOL
```

### enforceWethCoverageRatio

```solidity
bool enforceWethCoverageRatio
```

### makerFeeBasePoint

```solidity
uint256 makerFeeBasePoint
```

### takerFeeBasePoint

```solidity
uint256 takerFeeBasePoint
```

### collateralizationRatioBasePoint

```solidity
uint256 collateralizationRatioBasePoint
```

### wethCoverageRatio

```solidity
uint256 wethCoverageRatio
```

### constructor

```solidity
constructor() public
```

### initializeVault

```solidity
function initializeVault(address directoryAddress, address rplToken) public virtual
```

Initializes the vault with necessary parameters and settings.

_This function sets up the vault's token references, fee structures, and various configurations. It's intended to be called once after deployment._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| directoryAddress | address | Address of the directory contract to reference other platform contracts. |
| rplToken | address | Address of the RPL token contract to be used in this vault. |

### previewDeposit

```solidity
function previewDeposit(uint256 assets) public view virtual returns (uint256)
```

Calculates the amount that will be deposited after accounting for the maker fee.

_This function subtracts the maker fee from the total assets to provide an accurate preview of the deposit amount.
It overrides the previewDeposit function in the parent contract to include the deduction of the maker fee._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| assets | uint256 | The total assets that the user intends to deposit. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The amount that will be deposited after accounting for the maker fee. |

### previewMint

```solidity
function previewMint(uint256 shares) public view virtual returns (uint256)
```

Calculates the total assets associated with a specified number of shares, inclusive of the maker fee.

_This function first determines the raw assets for the given shares from the parent contract and then adds the maker fee.
It overrides the previewMint function in the parent contract to include the addition of the maker fee._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares for which the total assets are being determined. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total assets corresponding to the provided shares, inclusive of the maker fee. |

### previewWithdraw

```solidity
function previewWithdraw(uint256 assets) public view virtual returns (uint256)
```

Calculates the number of shares required to withdraw a specified amount of assets, taking into account the taker fee.

_This function first adjusts the assets by adding the taker fee and then determines the corresponding shares using the parent contract's function.
It overrides the previewWithdraw function in the parent contract to include the consideration of the taker fee._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| assets | uint256 | The amount of assets for which the corresponding shares are being determined. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The number of shares required to withdraw the specified amount of assets, considering the taker fee. |

### previewRedeem

```solidity
function previewRedeem(uint256 shares) public view virtual returns (uint256)
```

Calculates the amount of assets obtainable for a specified number of shares upon redemption, after deducting the taker fee.

_This function first calculates the assets corresponding to the given shares using the parent contract's function.
It then adjusts the resulting assets by deducting the taker fee.
It overrides the previewRedeem function in the parent contract to account for the taker fee deduction._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares to be redeemed for assets. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The amount of assets obtainable for the specified shares after considering the taker fee deduction. |

### _deposit

```solidity
function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual
```

Handles deposits into the vault, ensuring compliance with WETH coverage ratio and distribution of fees.

_This function first checks if the WETH coverage ratio is above the threshold, and then continues with the deposit process.
It takes a fee based on the deposit amount and distributes the fee to the treasury.
The rest of the deposited amount is transferred to a deposit pool for utilization.
This function overrides the `_deposit` function in the parent contract to ensure custom business logic is applied._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| caller | address | The address initiating the deposit. |
| receiver | address | The address designated to receive the issued shares for the deposit. |
| assets | uint256 | The amount of assets being deposited. |
| shares | uint256 | The number of shares to be minted in exchange for the deposit. |

### _withdraw

```solidity
function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares) internal virtual
```

Handles withdrawals from the vault, distributing the taker fees to the treasury.

_This function first calculates the taker fee based on the withdrawal amount and then
proceeds with the withdrawal process. After the withdrawal, the calculated fee is transferred
to the treasury. This function overrides the `_withdraw` function in the parent contract to
ensure custom business logic is applied._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| caller | address | The address initiating the withdrawal. |
| receiver | address | The address designated to receive the withdrawn assets. |
| owner | address | The address that owns the shares being redeemed. |
| assets | uint256 | The amount of assets being withdrawn. |
| shares | uint256 | The number of shares to be burned in exchange for the withdrawal. |

### totalAssets

```solidity
function totalAssets() public view returns (uint256)
```

Returns the total assets managed by this vault.

_This function aggregates the total assets from three sources:
1. Assets directly held in this vault.
2. Assets held in the associated DepositPool.
3. Assets held in the associated OperatorDistributor.
The sum of these gives the overall total assets managed by the vault._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The aggregated total assets managed by this vault. |

### getRequiredCollateral

```solidity
function getRequiredCollateral() public view returns (uint256)
```

Calculates the required collateral to ensure the contract remains sufficiently collateralized.

_This function compares the current balance of assets in the contract with the desired collateralization ratio.
If the required collateral based on the desired ratio is greater than the current balance, the function returns
the amount of collateral needed to achieve the desired ratio. Otherwise, it returns 0, indicating no additional collateral
is needed. The desired collateralization ratio is defined by `collateralizationRatioBasePoint`._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The amount of asset required to maintain the desired collateralization ratio, or 0 if no additional collateral is needed. |

### setFees

```solidity
function setFees(uint256 _makerFeeBasePoint, uint256 _takerFeeBasePoint) external
```

Sets the fee rates for both makers and takers.

_This function allows the admin to adjust the fee rates for both makers and takers.
The sum of both fee rates must not exceed 100%._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _makerFeeBasePoint | uint256 | The fee rate (expressed in base points, where 1e5 represents 100%) to be set for makers. |
| _takerFeeBasePoint | uint256 | The fee rate (expressed in base points, where 1e5 represents 100%) to be set for takers. |

### setWETHCoverageRatio

```solidity
function setWETHCoverageRatio(uint256 _wethCoverageRatio) external
```

Update the WETH coverage ratio.

_This function allows the admin to adjust the WETH coverage ratio.
The ratio determines the minimum coverage required to ensure the contract's health and stability.
It's expressed in base points, where 1e5 represents 100%._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _wethCoverageRatio | uint256 | The new WETH coverage ratio to be set (in base points). |

### setEnforceWethCoverageRatio

```solidity
function setEnforceWethCoverageRatio(bool _enforceWethCoverageRatio) external
```

Set the enforcement status of the WETH coverage ratio.

_Allows the admin to toggle whether or not the contract should enforce the WETH coverage ratio.
When enforced, certain operations will require that the WETH coverage ratio is met.
This could be useful to ensure the contract's health and stability._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _enforceWethCoverageRatio | bool | True if the WETH coverage ratio should be enforced, otherwise false. |

## WETHVault

### NewCapitalGain

```solidity
event NewCapitalGain(uint256 amount, address winner)
```

### Position

```solidity
struct Position {
  uint256 shares;
  uint256 pricePaidPerShare;
}
```

### WeightedAverageCalculation

```solidity
struct WeightedAverageCalculation {
  uint256 totalPriceOfShares;
  uint256 lastPricePaidPerShare;
  uint256 originalValueTimesShares;
  uint256 newValueTimesShares;
  uint256 totalShares;
  uint256 weightedPriceSum;
}
```

### NAME

```solidity
string NAME
```

### SYMBOL

```solidity
string SYMBOL
```

### enforceRplCoverageRatio

```solidity
bool enforceRplCoverageRatio
```

### makerFee1BasePoint

```solidity
uint256 makerFee1BasePoint
```

### makerFee2BasePoint

```solidity
uint256 makerFee2BasePoint
```

### takerFee1BasePoint

```solidity
uint256 takerFee1BasePoint
```

### takerFee2BasePoint

```solidity
uint256 takerFee2BasePoint
```

### collateralizationRatioBasePoint

```solidity
uint256 collateralizationRatioBasePoint
```

### rplCoverageRatio

```solidity
uint256 rplCoverageRatio
```

### totalYieldDistributed

```solidity
uint256 totalYieldDistributed
```

### positions

```solidity
mapping(address => struct WETHVault.Position) positions
```

### constructor

```solidity
constructor() public
```

### initializeVault

```solidity
function initializeVault(address directoryAddress, address weth) public virtual
```

Initializes the vault contract with essential parameters.

_This function sets initial parameters for the ETH vault including fees, collateralization ratios, and WETH token address.
     It is intended to be called only once, upon the vault's deployment, utilizing the OpenZeppelin's `initializer` modifier.
     This ensures that the function's logic can only be executed a single time._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| directoryAddress | address | Address of the directory contract to fetch system-wide configurations or addresses. |
| weth | address | Address of the Wrapped Ether (WETH) token contract. WETH is used to represent ETH in ERC-20 compliant way. |

### previewDeposit

```solidity
function previewDeposit(uint256 assets) public view virtual returns (uint256)
```

Calculates the net assets after applying both maker fees during a deposit preview.

_This function estimates the final depositable amount post the application of two maker fees.
     It relies on the `_feeOnTotal` internal function to compute fees and then deducts these from the initial assets.
     This function provides an override for the `previewDeposit` function defined in the {IERC4626} interface._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| assets | uint256 | The initial amount of assets for which the deposit is being previewed. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The final depositable amount after deducting both maker fees. |

### previewMint

```solidity
function previewMint(uint256 shares) public view virtual returns (uint256)
```

Estimates the total assets obtainable after applying both maker fees during a mint preview.

_This function computes the final assets amount post the addition of two maker fees.
     It makes use of the `_feeOnRaw` internal function to estimate fees and then adds these to the initial assets.
     It provides an override for the `previewMint` function detailed in the {IERC4626} interface._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares for which the mint is being previewed. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The estimated total assets after the addition of both maker fees. |

### previewWithdraw

```solidity
function previewWithdraw(uint256 assets) public view virtual returns (uint256)
```

Estimates the total assets obtainable after applying both taker fees during a withdrawal preview.

_This function computes the final assets amount post the addition of two taker fees.
     It makes use of the `_feeOnRaw` internal function to estimate fees and then adjusts the assets accordingly.
     It provides an override for the `previewWithdraw` function detailed in the {IERC4626} interface._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| assets | uint256 | The initial assets amount for which the withdrawal is being previewed. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The estimated total assets after the addition of both taker fees. |

### previewRedeem

```solidity
function previewRedeem(uint256 shares) public view virtual returns (uint256)
```

Estimates the total assets obtainable after deducting both taker fees during a redemption preview.

_This function calculates the final assets amount by subtracting two taker fees from the initial assets.
     It uses the `_feeOnTotal` internal function to compute fees and then subtracts these from the initial assets.
     It provides an override for the `previewRedeem` function as defined in the {IERC4626} interface._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares for which the redemption is being previewed. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The estimated total assets after deducting both taker fees. |

### _deposit

```solidity
function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual
```

_Internal function for depositing assets and shares into the protocol.

This function is called internally to deposit assets and shares into the protocol.
It ensures that there is sufficient RPL coverage by checking the RPL coverage ratio.

Requirements:
- The `enforceRplCoverageRatio` must be enabled, and the TVL ratio to ETH RPL must be greater than or equal to `rplCoverageRatio`.
- `caller` is the address initiating the deposit.
- `receiver` is the address that will receive the deposited shares.
- `assets` is the amount of assets being deposited.
- `shares` is the number of shares being deposited._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| caller | address | The address of the caller initiating the deposit. |
| receiver | address | The address of the receiver who will receive the deposited shares. |
| assets | uint256 | The amount of assets being deposited. |
| shares | uint256 | The number of shares being deposited. |

### _withdraw

```solidity
function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares) internal virtual
```

_Internal function for withdrawing assets and shares from the protocol.

This function is called internally to withdraw assets and shares from the protocol.
It calculates taker fees, sends ETH to distributors from the deposit pool, and updates position information.
Additionally, it calculates and distributes capital gains and transfers fees to designated recipients._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| caller | address | The address of the caller initiating the withdrawal. |
| receiver | address | The address that will receive the withdrawn assets and shares. |
| owner | address | The address of the owner of the shares being withdrawn. |
| assets | uint256 | The amount of assets being withdrawn. |
| shares | uint256 | The number of shares being withdrawn. |

### getDistributableYield

```solidity
function getDistributableYield() public view returns (uint256)
```

Get the total value of non-distributed yield.

This function calculates the total value of non-distributed yield by subtracting
the `totalYieldDistributed` amount from the total unrealized yield accrual obtained
from the oracle.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total value of non-distributed yield. |

### getOracle

```solidity
function getOracle() public view returns (contract IXRETHOracle)
```

Get the Oracle contract interface.

This function retrieves the address of the RETH Oracle contract from the directory
and returns it as an interface of type `IXRETHOracle`. The Oracle contract is used
for fetching important data and calculations related to RETH.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract IXRETHOracle | An instance of the `IXRETHOracle` interface representing the RETH Oracle contract. |

### totalAssets

```solidity
function totalAssets() public view returns (uint256)
```

Get the total value of assets held by the protocol.

This function calculates the total value of assets held by the protocol, which includes:
- The total assets held by the parent contract (inherited from the superclass).
- The value of non-distributed yield (obtained from `getDistributableYield`).
- The total value locked (TVL) in the Deposit Pool (obtained from `dp.getTvlEth`).
- The TVL of the Operator Distributor (obtained from `od.getTvlEth`).

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total value of assets held by the protocol. |

### tvlRatioEthRpl

```solidity
function tvlRatioEthRpl() public view returns (uint256)
```

Get the ratio of ETH to RPL in the vault.

This function calculates the ratio of ETH to RPL in the vault by considering:
- The total value of assets in ETH (obtained from `totalAssets`).
- The total value of assets in RPL held in the RPL Vault contract.
- The current price of ETH in RPL (obtained from `PriceFetcher`).

If there are no RPL assets in the vault, the function returns 100% (1e18).

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The ratio of ETH to RPL in the vault, expressed as a fixed-point number (1e18 represents 100%). |

### getRequiredCollateral

```solidity
function getRequiredCollateral() public view returns (uint256)
```

Get the minimal amount of assets this contract must contain to be sufficiently collateralized for operations.

This function calculates the minimal amount of assets that this contract must hold to maintain a sufficient
collateralization ratio for operations. It considers:
- The current balance of the asset held by this contract.
- The total value of assets held by the protocol (obtained from `totalAssets`).
- The collateralization ratio expressed in basis points (1 basis point = 0.01%).

If the current balance is less than the required collateral, it returns the required collateral; otherwise, it returns 0.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The minimal amount of assets required for sufficient collateralization. |

### setFees

```solidity
function setFees(uint256 _makerFee1BasePoint, uint256 _makerFee2BasePoint, uint256 _takerFee1BasePoint, uint256 _takerFee2BasePoint) external
```

Set the fee rates for makers and takers.

This function allows the admin to set the fee rates for makers and takers, represented
in basis points (1 basis point = 0.01%). The sum of all fee rates must not exceed 100% (1e5 basis points).

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _makerFee1BasePoint | uint256 | The fee rate in basis points for maker fee type 1. |
| _makerFee2BasePoint | uint256 | The fee rate in basis points for maker fee type 2. |
| _takerFee1BasePoint | uint256 | The fee rate in basis points for taker fee type 1. |
| _takerFee2BasePoint | uint256 | The fee rate in basis points for taker fee type 2. |

### setRplCoverageRatio

```solidity
function setRplCoverageRatio(uint256 _rplCoverageRatio) external
```

Set the required RPL coverage ratio.

This function allows the admin to set the required RPL coverage ratio, which determines
the minimum ratio of RPL coverage required for operations. The RPL coverage ratio is expressed
as a fixed-point number (1e18 represents 100% coverage).

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _rplCoverageRatio | uint256 | The new required RPL coverage ratio to be set. |

### setEnforceRplCoverageRatio

```solidity
function setEnforceRplCoverageRatio(bool _enforceRplCoverage) external
```

Set the enforcement of the RPL coverage ratio requirement.

This function allows the admin to enable or disable the enforcement of the RPL coverage ratio requirement.
When enforcement is enabled, certain operations will check if the RPL coverage ratio is met.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _enforceRplCoverage | bool | A boolean flag indicating whether to enable or disable the enforcement of the RPL coverage ratio requirement. |

## UpgradeableBase

### _directory

```solidity
contract Directory _directory
```

### initialize

```solidity
function initialize(address directoryAddress) public virtual
```

### constructor

```solidity
constructor() internal
```

### onlyAdmin

```solidity
modifier onlyAdmin()
```

### onlyDepositPool

```solidity
modifier onlyDepositPool()
```

### onlyProtocolOrAdmin

```solidity
modifier onlyProtocolOrAdmin()
```

### onlyProtocol

```solidity
modifier onlyProtocol()
```

### only24HourTimelock

```solidity
modifier only24HourTimelock()
```

### getDirectory

```solidity
function getDirectory() internal view returns (contract Directory)
```

### getImplementation

```solidity
function getImplementation() public view returns (address)
```

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

## Constants

### ADMIN_ROLE

```solidity
bytes32 ADMIN_ROLE
```

### ADMIN_SERVER_ROLE

```solidity
bytes32 ADMIN_SERVER_ROLE
```

### CORE_PROTOCOL_ROLE

```solidity
bytes32 CORE_PROTOCOL_ROLE
```

### TIMELOCK_24_HOUR

```solidity
bytes32 TIMELOCK_24_HOUR
```

### CONTRACT_NOT_FOUND_ERROR

```solidity
string CONTRACT_NOT_FOUND_ERROR
```

### ADMIN_ONLY_ERROR

```solidity
string ADMIN_ONLY_ERROR
```

### INITIALIZATION_ERROR

```solidity
string INITIALIZATION_ERROR
```

### OPERATOR_NOT_FOUND_ERROR

```solidity
string OPERATOR_NOT_FOUND_ERROR
```

### OPERATOR_DUPLICATE_ERROR

```solidity
string OPERATOR_DUPLICATE_ERROR
```

### OPERATOR_CONTROLLER_SET_FORBIDDEN_ERROR

```solidity
string OPERATOR_CONTROLLER_SET_FORBIDDEN_ERROR
```

## ProtocolMath

A library for performing precise mathematical operations using 64x64 fixed-point arithmetic.

_This library provides functions for handling fixed-point numbers, allowing precise calculations
     with fractional values._

### ONE

```solidity
int128 ONE
```

_64x64 fixed-point representation of 1._

### fromRatio

```solidity
function fromRatio(uint256 numerator, uint256 denominator) internal pure returns (int128)
```

Convert a ratio of two unsigned integers into a fixed-point 64x64 number.

_The resulting fixed-point number is equivalent to (numerator / denominator).
     Using 64x64 fixed-point arithmetic allows for precise calculations with fractional values,
     ensuring accuracy in financial and mathematical operations._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| numerator | uint256 | The numerator of the ratio. |
| denominator | uint256 | The denominator of the ratio. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int128 | A fixed-point 64x64 number representing the ratio. |

### exponentialFunction

```solidity
function exponentialFunction(uint256 x0, uint256 x1, uint256 k0, uint256 k1, uint256 maxValue0, uint256 maxValue1) internal pure returns (uint256)
```

Calculate the value of an exponential function with parameters.

_This function calculates the value of the exponential function:
     f(x) = maxValue * (e^(k*(x-1)) - e^-k) / (1 - e^-k)
     where:
     - x is the input variable represented as a 64x64 fixed-point number.
     - k is the exponent constant represented as a 64x64 fixed-point number.
     - maxValue is the maximum value of the function represented as a 64x64 fixed-point number.
     - e is Euler's number (approximately 2.71828).
     - The result is converted from binary fixed-point to uint256.
 Requirements:
     - x must be less than or equal to ONE (1.0 in fixed-point).
     - k must be greater than 0._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x0 | uint256 | The numerator part of x (input variable). |
| x1 | uint256 | The denominator part of x (input variable). |
| k0 | uint256 | The numerator part of k (exponent constant). |
| k1 | uint256 | The denominator part of k (exponent constant). |
| maxValue0 | uint256 | The numerator part of maxValue (maximum value of the function). |
| maxValue1 | uint256 | The denominator part of maxValue (maximum value of the function). |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The result of the exponential function as a uint256. |

## Operator

```solidity
struct Operator {
  uint256 operationStartTime;
  uint256 currentValidatorCount;
  uint256 intervalStart;
  address operatorController;
}
```

## Whitelist

Controls operator access to the protocol.
Only modifiable by admin. Upgradeable and intended to be replaced by a ZK-ID check when possible.

### OperatorAdded

```solidity
event OperatorAdded(struct Operator)
```

### OperatorsAdded

```solidity
event OperatorsAdded(address[] operators)
```

### OperatorRemoved

```solidity
event OperatorRemoved(address)
```

### OperatorsRemoved

```solidity
event OperatorsRemoved(address[] operators)
```

### OperatorControllerUpdated

```solidity
event OperatorControllerUpdated(address oldController, address newController)
```

### _permissions

```solidity
mapping(address => bool) _permissions
```

### operatorControllerToNodeMap

```solidity
mapping(address => address) operatorControllerToNodeMap
```

### nodeMap

```solidity
mapping(address => struct Operator) nodeMap
```

### nodeIndexMap

```solidity
mapping(uint256 => address) nodeIndexMap
```

### reverseNodeIndexMap

```solidity
mapping(address => uint256) reverseNodeIndexMap
```

### numOperators

```solidity
uint256 numOperators
```

### initializeWhitelist

```solidity
function initializeWhitelist(address directoryAddress) public
```

Initializes the Whitelist contract with a directory address.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| directoryAddress | address | The address of the directory contract. |

### getIsAddressInWhitelist

```solidity
function getIsAddressInWhitelist(address a) public view returns (bool)
```

Checks if an address is in the whitelist.

_This function allows users to query whether a specific address is in the whitelist._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| a | address | The address to check. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the address is in the whitelist, otherwise false. |

### getOperatorAtAddress

```solidity
function getOperatorAtAddress(address a) public view returns (struct Operator)
```

Retrieves the Operator struct associated with a specific address.

_This function allows users to retrieve detailed information about an operator
     based on their address.
Throws an error if the specified address is not found in the whitelist._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| a | address | The address of the operator to retrieve information for. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Operator | An Operator struct containing details about the operator. |

### getNumberOfValidators

```solidity
function getNumberOfValidators(address a) public view returns (uint256)
```

Retrieves the number of validators associated with a specific operator address.

_This function allows users to query the number of validators managed by an operator
     based on their address.
Throws an error if the specified address is not found in the whitelist._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| a | address | The address of the operator to retrieve the number of validators for. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The number of validators associated with the specified operator. |

### registerNewValidator

```solidity
function registerNewValidator(address nodeOperator) public
```

Registers a new validator under a specific node operator.

_This function allows the protocol to register a new validator under a node operator's address.
     Only accessible to authorized protocol administrators.
Increases the validator count for the specified node operator._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| nodeOperator | address | The address of the node operator to register the new validator under. |

### getOperatorAddress

```solidity
function getOperatorAddress(uint256 index) public view returns (address)
```

Retrieves the address of an operator based on its index.

_This function allows users to obtain the address of an operator using its index.
If the index is invalid or does not correspond to any operator, the result will be an empty address._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | The index of the operator whose address is being retrieved. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of the operator associated with the specified index. |

### _addOperator

```solidity
function _addOperator(address a) internal returns (struct Operator)
```

Internal function to add a new operator to the whitelist.

_This function is used internally to add a new operator to the whitelist, including updating permissions, initializing operator data,
     and emitting the 'OperatorAdded' event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| a | address | The address of the operator to be added. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Operator | An Operator struct containing details about the newly added operator. |

### addOperator

```solidity
function addOperator(address a) public
```

Adds a new operator to the whitelist.

_This function can only be called by a 24-hour timelock and ensures that the operator being added is not a duplicate.
     It emits the 'OperatorAdded' event to notify when an operator has been successfully added.
Throws an error if the operator being added already exists in the whitelist._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| a | address | The address of the operator to be added. |

### _removeOperator

```solidity
function _removeOperator(address nodeOperator) internal
```

Internal function to remove an operator from the whitelist.

_This function is used internally to remove an operator from the whitelist, including updating permissions, clearing operator data,
     and notifying the OperatorDistributor and YieldDistributor contracts._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| nodeOperator | address | The address of the operator to be removed. |

### removeOperator

```solidity
function removeOperator(address nodeOperator) public
```

Removes an operator from the whitelist.

_This function can only be called by a 24-hour timelock and is used to remove an operator from the whitelist.
     It emits the 'OperatorRemoved' event to notify when an operator has been successfully removed.
Throws no errors during execution._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| nodeOperator | address | The address of the operator to be removed. |

### addOperators

```solidity
function addOperators(address[] operators) public
```

Batch addition of operators to the whitelist.

_This function can only be called by a 24-hour timelock and allows multiple operators to be added to the whitelist simultaneously.
     It checks for duplicates among the provided addresses, adds valid operators, and emits the 'OperatorsAdded' event.
Throws an error if any of the operators being added already exist in the whitelist._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operators | address[] | An array of addresses representing the operators to be added. |

### removeOperators

```solidity
function removeOperators(address[] operators) public
```

Batch removal of operators from the whitelist.

_This function can only be called by a 24-hour timelock and allows multiple operators to be removed from the whitelist simultaneously.
     It removes valid operators and emits the 'OperatorsRemoved' event.
Throws no errors during execution._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operators | address[] | An array of addresses representing the operators to be removed. |

### setOperatorController

```solidity
function setOperatorController(address controller) public
```

Sets the operator controller for a node operator.

_This function allows a node operator or their authorized controller to set a new operator controller address.
     The function updates the mapping of operator controllers to node addresses and emits the 'OperatorControllerUpdated' event.
Throws an error if the sender is not the current operator controller for the specified node._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| controller | address | The address of the new operator controller. |

## MockRocketNodeStaking

### rplStaked

```solidity
uint256 rplStaked
```

### getNodeMinimumRPLStake

```solidity
function getNodeMinimumRPLStake(address) external view returns (uint256)
```

### stakeRPLFor

```solidity
function stakeRPLFor(address _nodeAddress, uint256 _amount) external
```

Accept an RPL stake from any address for a specified node
        Requires caller to have approved this contract to spend RPL
        Requires caller to be on the node operator's allow list (see `setStakeForAllowed`)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to stake on behalf of |
| _amount | uint256 | The amount of RPL to stake |

### getNodeRPLStake

```solidity
function getNodeRPLStake(address _nodeAddress) external view returns (uint256)
```

Returns the amount a given node operator has staked

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The address of the node operator to query |

### setRPLStaked

```solidity
function setRPLStaked(uint256 _rplStaked) external
```

### withdrawRPL

```solidity
function withdrawRPL(uint256 _amount) external
```

## MockMinipool

### _nodeAddress

```solidity
address _nodeAddress
```

### _status

```solidity
enum MinipoolStatus _status
```

### _preLaunchValue

```solidity
uint256 _preLaunchValue
```

### _nodeDepositBalance

```solidity
uint256 _nodeDepositBalance
```

### userDepositBalance

```solidity
uint256 userDepositBalance
```

nodeDepositBalance
This variable represents the total amount of ETH that the node operator has committed to the minipool. If the amount committed is less than than 32 ETH, then the deposit pool will top up the difference.
This could be either 16 ETH or 32 ETH depending on whether the minipool is a "half" minipool or a "full" minipool, respectively.
This commitment is usually collateralized with RPL tokens by the node operator as per the staking rules of Rocket Pool, however nodeset will manage risk differently.

### initialise

```solidity
function initialise(address __nodeAddress) public
```

preLaunchValue
This variable is used in the preDeposit function and represents the initial deposit made to a minipool before it's launched on the beacon chain.
This deposit sets the withdrawal credentials for the minipool.

### preDeposit

```solidity
function preDeposit(uint256 _bondValue, bytes _validatorPubkey, bytes _validatorSignature, bytes32 _depositDataRoot) public payable
```

### deposit

```solidity
function deposit() public payable
```

### getNodeAddress

```solidity
function getNodeAddress() external view returns (address)
```

### getStatus

```solidity
function getStatus() external view returns (enum MinipoolStatus)
```

### getPreLaunchValue

```solidity
function getPreLaunchValue() external view returns (uint256)
```

### getNodeDepositBalance

```solidity
function getNodeDepositBalance() external view returns (uint256)
```

### getUserDepositBalance

```solidity
function getUserDepositBalance() external view returns (uint256)
```

### distributeBalance

```solidity
function distributeBalance(bool _rewardsOnly) external
```

Distributes the contract's balance.
        If balance is greater or equal to 8 ETH, the NO can call to distribute capital and finalise the minipool.
        If balance is greater or equal to 8 ETH, users who have called `beginUserDistribute` and waited the required
        amount of time can call to distribute capital.
        If balance is lower than 8 ETH, can be called by anyone and is considered a partial withdrawal and funds are
        split as rewards.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardsOnly | bool | If set to true, will revert if balance is not being treated as rewards |

### userDistributeAllowed

```solidity
function userDistributeAllowed() external view returns (bool)
```

Returns true if enough time has passed for a user to distribute

### beginUserDistribute

```solidity
function beginUserDistribute() external
```

Allows a user (other than the owner of this minipool) to signal they want to call distribute.
        After waiting the required period, anyone may then call `distributeBalance()`.

### setNodeDepositBalance

```solidity
function setNodeDepositBalance(uint256 _newBalance) external
```

## MockRETHOracle

### setTotalYieldAccrued

```solidity
function setTotalYieldAccrued(uint256 yield) public
```

_Sets decentralized data provided by the Constellation network's cryptographic fraud proofs._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| yield | uint256 | The total value locked in the protocol, in wei, for each minipool + rewards earned. |

### getTotalYieldAccrued

```solidity
function getTotalYieldAccrued() public view returns (uint256)
```

_Oracle data verified using cryptographic fraud proofs._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total value locked in the protocol, in wei, for each minipool + rewards earned. |

## MockRocketNodeManager

### smoothingPoolRegistrationStates

```solidity
mapping(address => bool) smoothingPoolRegistrationStates
```

### nodeOperatorsToMinipools

```solidity
mapping(address => address) nodeOperatorsToMinipools
```

### setSmoothingPoolRegistrationState

```solidity
function setSmoothingPoolRegistrationState(bool _state) public returns (bool)
```

_Allows a node to register or deregister from the smoothing pool_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _state | bool | The state to set |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | isRegistered The new registration state of the smoothing pool |

### getSmoothingPoolRegistrationState

```solidity
function getSmoothingPoolRegistrationState(address _nodeAddress) public view returns (bool)
```

_Returns the registration state of the smoothing pool_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nodeAddress | address | The node address to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | isRegistered The registration state of the smoothing pool |

### mockSetNodeOperatorToMinipool

```solidity
function mockSetNodeOperatorToMinipool(address _nodeOperator, address _minipool) public
```

## MockRocketStorage

### setWithdrawalAddress

```solidity
function setWithdrawalAddress(address _nodeAddress, address _newWithdrawalAddress, bool _confirm) public
```

### getNodeWithdrawalAddress

```solidity
function getNodeWithdrawalAddress(address _nodeAddress) public view returns (address)
```

## MockUniswapV3Pool

### sqrtPriceX96

```solidity
uint256 sqrtPriceX96
```

### constructor

```solidity
constructor() public
```

### setSqrtPriceX96

```solidity
function setSqrtPriceX96(uint256 _sqrtPriceX96) external
```

### slot0

```solidity
function slot0() external view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)
```

## RocketClaimNodeInterface

### getEnabled

```solidity
function getEnabled() external view returns (bool)
```

### getClaimPossible

```solidity
function getClaimPossible(address _nodeAddress) external view returns (bool)
```

### getClaimRewardsPerc

```solidity
function getClaimRewardsPerc(address _nodeAddress) external view returns (uint256)
```

### getClaimRewardsAmount

```solidity
function getClaimRewardsAmount(address _nodeAddress) external view returns (uint256)
```

### register

```solidity
function register(address _nodeAddress, bool _enable) external
```

### claim

```solidity
function claim() external
```

## WETH

### constructor

```solidity
constructor() public
```

### deposit

```solidity
function deposit() external payable
```

### withdraw

```solidity
function withdraw(uint256 amount) external
```

## RevertOnTransfer

### fallback

```solidity
fallback() external payable
```

