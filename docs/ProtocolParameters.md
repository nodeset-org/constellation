# Parameter Values: Current Values and Justifications

// NOTE: Meant as a reserach document to note current values and any PR/strategy related to protocol parameter decisions

## Fee-related Parameters

**NO/Admin Fee split: 50%/50%**

If one were to approximate investment into the protocol, that value is probably closer to 1%/99%, but we think it's worthwhile to incentivize network growth and community goodwill by providing NOs a sizable chunk of the pie.

Admin: Spends years of our lives building, maintaining, and upgrading this system
NOs: Spends a handful of hours per year maintaining a node

**Trust Build Period: ?? weeks/months**

A slow increase of payments over several weeks/months encourages NOs to develop sustainable operations while allowing for

**Trust Build Period: 0**

Once NOs are added to the system by the Admin, there is no need to prevent them from earning their full rewards immediately. If they misbehave, the Admin will kick them and their validators will be liquidated. This parameter exists in case it is needed for future automation of Admin duties.

## xrETH Oracle Parameters

**yieldAttestationChallengePeriod 2000 blocks?**

**yieldAttestationProofPeriod: 2000 blocks?**

The number of blocks allowed for the attester to repond to a challenge.

## Deposit Pool Parameters
See [Deposit Pool](Systems/DepositPool.md) for more details.

**maxrETHBalancePortion** and **maxRplBalancePortion** determine the portion of the protocol's ETH and RPL TVL kept in reserve by instead of being used to create new minipools.