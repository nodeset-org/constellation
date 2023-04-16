# xRPL

An immutable ERC20 token which users may mint and burn in exchange for RPL using a specific exchange rate according to the amount of RPL owned by the protocol. All RPL received by this contract is forwarded to the Deposit Pool, and when the burn function is called, the Deposit Pool supplies the RPL, with the call reverted if there is not enough RPL in reserve.

In contrast with xrETH, which requires a more complex oracle design, xRPL's design is straightforward. RPL is staked at the supernode level (the Deposit Pool in this case), and Rocket Pool is reponsible for tracking and reporting RPL rewards.