# Deposit Pool
An upgradeable holding system which keeps a dynamic portion of the protocol's total ETH and RPL assets in reserve to provide liquidity for depositors. 

## Deposits and Withdrawals

The pool is open for ETH and RPL deposits so long as new amount dedicated to staking would not put the total node out of range for RPL rewards (i.e. staked ETH is more than 10% and less than 150% of the amount of RPL staked). 

## Dynamic Reserve

The protocol keeps a dynamic portion of all deposits in reserve for the purpose of liquidity and allows the rest to be used for staking. 



When a call to the `burn` function in either xrETH or xRPL is made, it will either revert if there is not enough assets in reserve or the caller is sent the appropriate amount of underlying assets and the TVL is adjusted accordingly.

### RPL

## Minipool Creation

After a deposit or withdrawal, the Deposit Pool then recalculates the target minipool count, which is equal to `stakedETH / 8 / numOperators` and rounded down to the nearest whole integer. TODO: reconsider and expound upon the target minipool count to ensure withdrawals are incentivized (but not over-incentivized)

Minipools must have their withdrawal address set to Constellation's Yield Distributor and have passed the CL's scrub check (~12 hours after deposit) to be considered valid. Requests to reimburse invalid minipools are reverted, while requests which provide evidence of a valid minipool are reimbursed and the operator's total validator count is updated.