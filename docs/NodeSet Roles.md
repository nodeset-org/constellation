# A NodeSet Module's 3 Roles
 - Depositors
 - Node Operators
 - [Administrator]("Admin Address.md")

### Depositors

Depositors are those who exchange their ETH or RPL for xrETH or xRPL respectively. They earn risk-minimized yield on their deposits and have full liquidity with the deposited asset at any time through the protocol or secondary markets.

### Node Operators

Node Operators are responsible for providing hardware services to the network in exchange for yield. The protocol balances Depositors' funds evenly between all Node Operators in a non-custodial manner. That is, they never have access to funds other than their compensation from the protocol for this service. Although nearly 100% of a Node Operator's responsibilities are automated, they are also paid in relation to their performance, so there is always an incentive to be effective.

Node Operators are paid in xrETH, meaning they are also Depositors.

### Administrator

The Admin Address is responsible for keeping the protocol stable. This most obviously happens by adjusting parameters like fee splits and the Deposit Pool size. However, the [Admin Address]("Admin Address.md") is also responsible for growing and maintaining the Node Operator set. In extreme cases of Node Operator negligence, for example, Admin Address can kick a Node Operator from the network so the protocol can recover any assigned funds. The Admin Address receives a portion of protocol revenue as compensation for this role.

### Protocol Ossification

Although the Depositor and Node Operator interactions with the protocol may be fully automated, Administrator duties cannot, and the protocol as a whole cannot be fully ossified.

Currently, the Administrator duties cannot be automated on-chain, so Nodepoint Systems fills this role alongside key community members via a X/Y multi-sig. In the long term, developers may ossify parameter settings and/or replace the Admin Address with a DAO contract. Further research on two topics is necessary to remove the Admin Address and begin protocol ossification:
 • ZK-ID systems
 • EL/CL communication