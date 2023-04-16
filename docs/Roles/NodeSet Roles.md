# A NodeSet Module's 3 Roles
 - Depositors
 - Node Operators
 - [Administrator]("Admin Address.md")

### Depositors

Depositors are those who exchange their ETH or RPL for xrETH or xRPL respectively. xrETH and xRPL earn risk-minimized yield in terms of the underlying asset while retaining liquidity through the protocol or secondary markets.

### Node Operators

Node Operators are responsible for providing hardware services to the network in exchange for yield. The protocol balances Depositors' funds evenly between all Node Operators in a non-custodial manner. That is, they never have access to funds other than their compensation from the protocol for this service. Although nearly 100% of a Node Operator's responsibilities are automated, they are also paid in relation to their performance, so there is always an incentive to be effective.

Node Operators are paid in xrETH, meaning they are also Depositors.

### Administrator

The Admin Address is responsible for keeping the protocol stable. This most obviously happens by adjusting parameters like fee splits and the Deposit Pool size. However, the [Admin Address]("Admin Address.md") is also responsible for growing and maintaining the Node Operator set. In extreme cases of Node Operator negligence, for example, Admin Address can kick a Node Operator from the network so the protocol can recover any assigned funds. The Admin Address receives a portion of protocol revenue as compensation for this role.

