# Constellation Design

Constellation is a non-custodial Ethereum protocol which extends [Rocket Pool](https://github.com/rocket-pool/rocketpool) with two additional ERC20s: xrETH and xRPL. 

Thse tokens are backed by a decentralized group of high-quality Rocket Pool node operators which non-custodially stake on behalf of the protocol. This allows xrETH to provide the full ETH staking APR higher to depositors (zero commission). ield while adding minimal risk.

xrETH

User roles:
- [Depositors](Roles/Depositors.md) are Ethereum addresses which that mint xrETH and/or xRPL.
- [Node Operators (NOs)](Roles/NodeOperators.md) are whitelisted Ethereum addresses which may request reimbursement for the creation of a Rocket Pool minipool on behalf of Constellation. 
- The [Administrator](Roles/Administrator.md) is an Ethereum address which may add and remove addresses from the Operator Whitelist, adjust protocol parameters like the Deposit Pool's reserve portion, and upgrade the systems specified as upgradeable.


Constellation contains the systems described below:

[xrETH](systems/xrETH.md)
[xRPL](systems/xRPL.md)
[Deposit Pool](systems/DepositPool.md)
[Whitelist](systems/Whitelist.md)
[Yield Distributor](systems/xRPL.md)

### Upgradeability

Some systems in Constellation are upgradeable by the Administrator, although there are several restrictions on this. For more details on these restrictions, please see At protocol launch, there is no upgrade delay, but over the first 100 days after deployment, the delay between the Administrator's upgrade request and the implementation of the request should grow from 0 blocks on the first day of deployment to 200,000 blocks on the 100th day after deployment. A new upgrade request from the Administrator will replace any existing requests.

### Protocol Ossification

Although Depositors' and Node Operators' interactions with the protocol may be fully automated, Administrator duties currently cannot, and therefore the protocol as a whole cannot be fully ossified.

Currently, the Administrator duties cannot be automated on-chain, so NodeSet fills this role alongside key community members via a X/Y multi-sig. In the long term, developers may ossify parameter settings and/or replace the Admin Address with another smart contract. Further research on two topics is necessary to remove the Admin Address and begin protocol ossification:
 • ZK-ID systems
 • EL/CL communication