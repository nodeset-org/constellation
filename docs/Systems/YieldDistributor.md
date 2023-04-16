# Yield Distributor

The Yield Distributor is an upgradeable system reponsible for accounting for the yield generated from all Constellation minipools. 

Before yield can be distributed, however, the network state must be updated to account for the new rewards generated since the last update. This state update uses an interactive fraud proof mechanism similar to the one described here: https://knoshua.gitbook.io/analysis-of-odao-duties/verifiable-off-chain-calculations

At a high level, the process is as follows:

1) The public `submitYieldAttestation` function is called after sending X ETH as collateral. This function takes a YieldAttestation object -- essentially a block hash, a list of merkle hashes and their corresponding sums, and the number of leaves in the whole tree.

2) During the challenge period (currently set to 2500 blocks or ~8 hours) anyone may submit a proof that the proposed amount is incorrect by calling the `challengeAttestation` function with a ChallengeObject that contains a contradicting YieldAttestation object for either the number of minipools

Otherwise, the distributeRewards function uses an interactive version of the optimistic fraud proof mechanism described in . Once the sum has been accepted, it the xrETH Oracle updates the value of each minted xrETH in terms of the ETH TVL of Constellation.