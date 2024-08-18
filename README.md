# NodeSet Constellation
------
Made w/ <3 by {::}
------

[See the full documentation here](https://docs.nodeset.io/constellation/introduction)

We use [Hardhat](https://github.com/NomicFoundation/hardhat) for development.

# Dev Setup

- Install dependencies via `npm install`
- `nvm use 20` stops Hardhat's warnings about an unsupported NPM version
- `npx hardhat test` runs the test suite. Mocha Test Explorer extension for VSCode is recommended for a better UX while developing.

# A brief overview...
This repository contains Solidity smart contracts and assocated tests for Constellation, a second layer liquid staking protocol built on top of Rocket Pool. The protocol involves the creation and management of node operators, minipools, and token vaults, with integrated staking and reward distribution mechanisms.

# Protocol Contracts

**PriceFetcher.sol**
   - Fetches and provides the price of ETH denominated in RPL using Uniswap V3 and a fallback mechanism to an oracle

**Whitelist.sol**
   - Manages a list of approved node operators and their controllers

**PoAConstellationOracle.sol**
   - Uses proof-of-authority to allow updates to the total yield accrued using ECDSA signatures

**RocketpoolEncoder.sol**
   - A library for generating keccak256 identifiers for Rocket Pool contracts

**Errors.sol**
   - Defines custom error messages for the protocol

**Constants.sol**
   - Defines constants for roles, directory errors, whitelist errors, treasury errors, and operator distributor errors

**Directory.sol**
   - Holds references to all protocol contracts and manages role mechanisms

**WETHVault.sol**
   - An ERC4626 vault for WETH tokens, managing deposits, withdrawals, and rewards distribution

**RPLVault.sol**
   - An ERC4626 vault for RPL tokens, managing deposits, withdrawals, and rewards distribution

**SuperNodeAccount.sol**
   - Manages node operators and their minipools

**OperatorDistributor.sol**
   - Manages distribution and staking of ETH and RPL tokens for node operators

**MerkleClaimStreamer.sol**
   - Allows for Rocket Pool merkle claim submission on behalf of Constellation and
   - "Streams" the rewards from these claims to the rest of the protocol upon receipt

# External Contracts

These contracts are not part of the Constellation protocol but still serve important purposes of their own

**Treasury.sol**
   - An example contract that a Treasurer might use to manage the earned income
   - Constellation's contracts do not assume a particular treasury contract -- they only require a payable contract such as this

**NodeSetOperatorRewardDistributor.sol**
   - Distributes rewards to a decentralized swarm of operators. Can take in income from any source, not just Constellation
   - Constellation's contracts do not assume a particular operator reward distribution contract -- they only require a payable contract such as this

# Actors
The protocol involves several actors, each with specific roles and incentives to ensure the smooth operation and security of the system.

**Node Operators** or alternitivaly refered to as **Sub-Node Operators**
   - May add themselves to the operator whitelist with the Admin's approval
   - May remove themselves from the operator whitelist (if they have no active minipools)
   - Create and manage minipools
   - Responsible for uptime and performance of their individual node
   - Collects fees from staking

**Admin**
   - Manage protocol configuration to ensure stability
   - Oversee reward distributions
   - Ensure security and compliance within the protocol
   - Develop and update smart contracts
   - Ensure security and efficiency of the code
   - Implement new features and upgrades
   - May set a new Admin
   - May set a new Oracle provider
   - Assumed to be a service provider for the Treasurer

**Liquid Stakers (Depositors)**
   - Exchange their ETH and RPL for liquid staking tokens
   - These LSTs earn staking rewards from ETH and RPL

**Oracle Providers**
   - Provide accurate and reliable external data to the protocol
   - Ensure timely updates of the data feeds

**Treasurer**
   - Receives protocol-wide fees
   - May set a new Treasurer
   - Responsible for using the protocol-wide income to grow the protocol and its ecosystem
   - The "protocol owner"