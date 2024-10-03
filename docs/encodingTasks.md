
# Encoding Task Documentation

This document provides instructions on how to use encode the functions that are needed to manage the protocol

- **Timelock Tasks**
- **Admin Tasks**

## Admin Tasks

### encodeProposal
**Description**: Encodes a proposal for execution.

**Usage**:
```shell
npx hardhat encodeProposal --sigs '["functionSignature1","functionSignature2"]' --params '[["paramSet1"],["paramSet2"]]'
```

### setStreamingInterval
**Description**: Encodes the setStreamingInterval(uint256) function call.

**Usage**:
```shell
npx hardhat setStreamingInterval --newStreamingInterval <uint256_value>
```

### setMerkleClaimsEnabled
**Description**: Encodes the setMerkleClaimsEnabled(bool) function call.

**Usage**:
```shell
npx hardhat setMerkleClaimsEnabled --isEnabled true
```

### setRplStakeRebalanceEnabled
**Description**: Encodes the setRplStakeRebalanceEnabled(bool) function call.

**Usage**:
```shell
npx hardhat setRplStakeRebalanceEnabled --newValue true
```

### setMinipoolProcessingEnabled
**Description**: Encodes the setMinipoolProcessingEnabled(bool) function call.

**Usage**:
```shell
npx hardhat setMinipoolProcessingEnabled --newValue false
```

### setTargetStakeRatio
**Description**: Encodes the setTargetStakeRatio(uint256) function call.

**Usage**:
```shell
npx hardhat setTargetStakeRatio --targetStakeRatio <uint256_value>
```

### setDepositsEnabledSuperNodeAccount
**Description**: Encodes the setDepositsEnabled(bool) function call for SuperNodeAccount.

**Usage**:
```shell
npx hardhat setDepositsEnabledSuperNodeAccount --newValue true
```

### setBond
**Description**: Encodes the setBond(uint256) function call.

**Usage**:
```shell
npx hardhat setBond --newBond <uint256_value>
```

### setMinimumNodeFee
**Description**: Encodes the setMinimumNodeFee(uint256) function call.

**Usage**:
```shell
npx hardhat setMinimumNodeFee --newMinimumNodeFee <uint256_value>
```

## Timelock Tasks

These tasks are used to encode function calls for upgradable contracts and manage vault parameters.

### upgradeTo
**Description**: Encodes the upgradeTo(address) function call for an upgradable contract.

**Parameters**:
- --newImplementation (string): The address of the new implementation contract.

**Usage**:
```shell
npx hardhat upgradeTo --newImplementation <address>
```

### setMinimumStakeRatio
**Description**: Encodes the setMinimumStakeRatio(uint256) function call.

**Parameters**:
- --minimumStakeRatio (string): The new minimum stake ratio as a uint256 value.

**Usage**:
```shell
npx hardhat setMinimumStakeRatio --minimumStakeRatio <uint256_value>
```

## SuperNodeAccount Tasks

### setDepositsEnabledSuperNodeAccount
**Description**: Encodes the setDepositsEnabled(bool) function call for SuperNodeAccount.

**Parameters**:
- --newValue (boolean): Enable (true) or disable (false) deposits.

**Usage**:
```shell
npx hardhat setDepositsEnabledSuperNodeAccount --newValue true
```

### setMaxValidators
**Description**: Encodes the setMaxValidators(uint256) function call.

**Parameters**:
- --maxValidators (string): The new maximum number of validators as a uint256 value.

**Usage**:
```shell
npx hardhat setMaxValidators --maxValidators <uint256_value>
```

### setSmoothingPoolParticipation
**Description**: Encodes the setSmoothingPoolParticipation(bool) function call.

**Parameters**:
- --useSmoothingPool (boolean): Enable (true) or disable (false) smoothing pool participation.

**Usage**:
```shell
npx hardhat setSmoothingPoolParticipation --useSmoothingPool true
```

### setAllowSubNodeOpDelegateChanges
**Description**: Encodes the setAllowSubNodeOpDelegateChanges(bool) function call.

**Parameters**:
- --newValue (boolean): Allow (true) or disallow (false) sub-node operator delegate changes.

**Usage**:
```shell
npx hardhat setAllowSubNodeOpDelegateChanges --newValue false
```

### setAdminServerCheck
**Description**: Encodes the setAdminServerCheck(bool) function call.

**Parameters**:
- --newValue (boolean): Enable (true) or disable (false) admin server check.

**Usage**:
```shell
npx hardhat setAdminServerCheck --newValue true
```

### setBond
**Description**: Encodes the setBond(uint256) function call.

**Parameters**:
- --newBond (string): The new bond amount as a uint256 value.

**Usage**:
```shell
npx hardhat setBond --newBond <uint256_value>
```


## WETHVault Tasks

### setDepositsEnabledWETHVault
**Description**: Encodes the setDepositsEnabled(bool) function call for WETHVault.

**Parameters**:
- --newValue (boolean): Enable (true) or disable (false) deposits.

**Usage**:
```shell
npx hardhat setDepositsEnabledWETHVault --newValue false
```

## Whitelist Tasks

### invalidateAllOutstandingSigs
**Description**: Encodes the invalidateAllOutstandingSigs() function call.

**Parameters**: None

**Usage**:
```shell
npx hardhat invalidateAllOutstandingSigs
```

### invalidateSingleOutstandingSig
**Description**: Encodes the invalidateSingleOutstandingSig(address) function call.

**Parameters**:
- --nodeOperator (string): The address of the node operator.

**Usage**:
```shell
npx hardhat invalidateSingleOutstandingSig --nodeOperator <address>
```

**Note**: Replace `<address>`, `<calldata>`, and `<uint256_value>` with actual values when running the commands.

**Parameters**:
- --newValue (boolean): Enable (true) or disable (false) admin server check.

**Usage**:
```shell
npx hardhat setAdminServerCheck --newValue true
```

### WETHVault Tasks

#### setDepositsEnabledWETHVault
**Description**: Encodes the `setDepositsEnabled(bool)` function call for WETHVault.

**Parameters**:
- --newValue (boolean): Enable (true) or disable (false) deposits.

**Usage**:
```shell
npx hardhat setDepositsEnabledWETHVault --newValue false
```

### Whitelist Tasks

#### invalidateAllOutstandingSigs
**Description**: Encodes the `invalidateAllOutstandingSigs()` function call.

**Parameters**: None

**Usage**:
```shell
npx hardhat invalidateAllOutstandingSigs
```

#### invalidateSingleOutstandingSig
**Description**: Encodes the `invalidateSingleOutstandingSig(address)` function call.

**Parameters**:
- --nodeOperator (string): The address of the node operator.

**Usage**:
```shell
npx hardhat invalidateSingleOutstandingSig --nodeOperator <address>
```

**Note**: Replace `<address>`, `<calldata>`, and `<uint256_value>` with actual values when running the commands.
