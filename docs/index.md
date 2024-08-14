# Solidity API

## FundRouter

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

_Initializes the FundRouter contract with the specified directory address._

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

### getNodeSetOperatorRewardDistributorAddress

```solidity
function getNodeSetOperatorRewardDistributorAddress() public view returns (address payable)
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

## NodeSetOperatorRewardDistributor

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

### onlyShortTimelock

```solidity
modifier onlyShortTimelock()
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

### TIMELOCK_SHORT

```solidity
bytes32 TIMELOCK_SHORT
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
     and notifying the OperatorDistributor and NodeSetOperatorRewardDistributor contracts._

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

