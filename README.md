# NodeSet Constellation
------
Made w/ <3 by {::}
------

[See the full documentation here](https://docs.nodeset.io/constellation/introduction)

We use [Hardhat](https://github.com/NomicFoundation/hardhat) for development.

## Dev Setup

- Install dependencies via `npm install`
- `nvm use 20` stops Hardhat's warnings about an unsupported NPM version
- `npx hardhat test` runs the test suite. Mocha Test Explorer extension for VSCode is recommended for a better UX while developing.

# A brief overview...
This repository contains Solidity smart contracts for Constellation, a second layer liquid staking protocol built on top of Rocket Pool. The protocol involves the creation and management of node operators, minipools, and token vaults, with integrated staking and reward distribution mechanisms. The key contracts include:

1. **PriceFetcher.sol**
   - Fetches and provides the price of ETH denominated in RPL using Uniswap V3 and a fallback mechanism to an oracle.

2. **Whitelist.sol**
   - Manages a list of approved node operators and their controllers.

4. **PoAConstellationOracle.sol**
   - Uses proof-of-authority to allow updates to the total yield accrued using ECDSA signatures.

5. **ProtocolMath.sol**
   - A library for performing precise mathematical operations using 64x64 fixed-point arithmetic.

6. **RocketpoolEncoder.sol**
   - A library for generating keccak256 identifiers for Rocket Pool contracts.

7. **Errors.sol**
   - Defines custom error messages for the protocol.

8. **Constants.sol**
   - Defines constants for roles, directory errors, whitelist errors, treasury errors, and operator distributor errors.

9. **Directory.sol**
   - Holds references to all protocol contracts and manages role mechanisms.

10. **WETHVault.sol**
    - An ERC4626 vault for WETH tokens, managing deposits, withdrawals, and rewards distribution.

11. **RPLVault.sol**
    - An ERC4626 vault for RPL tokens, managing deposits, withdrawals, and rewards distribution.

<<<<<<< HEAD
12. **YieldDistributor.sol**
=======
13. **NodeSetOperatorRewardDistributor.sol**
>>>>>>> main
    - Distributes rewards to node operators.

13. **SuperNodeAccount.sol**
    - Manages node operators and their minipools.

14. **OperatorDistributor.sol**
    - Manages distribution and staking of ETH and RPL tokens for node operators.

15. **Treasury.sol**
    - Manages and executes transfers of ETH and ERC20 tokens.

### Actors in the System and Their Incentives
The protocol involves several actors, each with specific roles and incentives to ensure the smooth operation and security of the system. Here’s an overview of these actors and how they are incentivized:

1. **Node Operators** or alternitivaly refered to as **Sub-Node Operators**
   - **Roles:**
     - Create and manage minipools.
     - Stake ETH and RPL to validate transactions.
     - Ensure uptime and performance of their nodes.
   - **Incentives:**
     - Staking Rewards
     - Fee Collection
     - Reputation and Growth

3. **Admin**
   - **Roles:**
     - Manage protocol configuration to ensure stability.
     - Oversee reward distributions.
     - Ensure security and compliance within the protocol.
     - Develop and update smart contracts.
     - Ensure security and efficiency of the code.
     - Implement new features and upgrades.
   - **Incentives:**
     - Protocol Fees
     - Security and Stability

4. **Stakers/Depositors**
   - **Roles:**
     - Provide ETH and RPL to be staked in the protocol.
     - Participate in the governance of the protocol by voting on important decisions.
   - **Incentives:**
     - Vault Income: Staking Rewards ETH and RPL

5. **Whitelist Controllers**
   - **Roles:**
     - Add or remove node operators from the whitelist.
     - Monitor the performance and compliance of node operators.
   - **Incentives:**
     - Security and Integrity
     - Reputation

6. **Oracle Providers**
   - **Roles:**
     - Provide accurate and reliable external data to the protocol.
     - Ensure timely updates of the data feeds.
   - **Incentives:**
     - Data Provision Fees
     - Network Trust

### Using the NodeSetOperatorRewardDistributor
The NodeSetOperatorRewardDistributor is a crucial component of the system that handles the distribution of rewards (yield) to various participants, primarily the node operators. Here’s an in-depth look at how it works, who uses it, and how it is used.

#### Who Uses the NodeSetOperatorRewardDistributor?
- **Node Operators**: Claim their earned rewards based on their contributions to the network.
- **Smart Contracts**: Other contracts within the protocol will send ETH to the NodeSetOperatorRewardDistributor to manage rewards distribution in an automated manner.

#### How the NodeSetOperatorRewardDistributor is Used
1. **Harvesting Rewards**
   - **Function**: `harvest(address _rewardee, Claim claim)`
   - **Purpose**: Allow node operators to claim their rewards.
   - **Who Calls It**: Node operators
   - **Steps**:
     - Verify Parameters
     - Calculate Rewards
     - Distribute Rewards
     - Mark as Claimed