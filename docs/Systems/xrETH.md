# xrETH

An immutable ERC20 token which users may mint and burn in exchange for ETH using a specific exchange rate as calculated by the [xrETH Oracle](#xrETH%20Oracle). All ETH received by this contract is forwarded to the Deposit Pool, and when the burn function is called, the Deposit Pool supplies the ETH or reverts if there is not enough in reserve.

# xrETH Oracle

## TO DO
- Calculate the appropriate level of the trie to maximize number of sum-hash pairs that can be submitted within the gas limit
- Determine if the algorithm needs to take an arbitrary integer protocol parameter corresponding to this tree level (to account for more/less total minipools)
- Determine appropriate collateral and reward amounts for successful attestations and challenges such that they are profitable even if they come close to the gas limit

## Purpose
xrETH's yield generation comes primarily from validator revenue that must be calculated to determine the appropriate mint and burn rates which the protocol offers in ETH. This could be naively achieved by storing all protocol-owned minipool address balances at a particular block, then repeating this process at regular intervals and noting the difference in total sums. This naive approach is very gas-inefficient, however, necessitating the split of this calculation across multiple blocks at best and substantially cutting into total yield at worst. 

Therefore, Constellation utilizes off-chain calculations to sum up the total yield instead using an optimistic interactive fraud proof system.[1](#Refereneces)

## Oracle Algorithm

1) The public `submitAttestation` function is called after sending X ETH as collateral. This function takes a `Attestation` struct -- essentially a block hash, the level of the trie which is being attested, a list of those merkle hashes and their corresponding sums from that level, and the number of leaves of the whole tree. If an attestation is not challenged within the challenge period (the length of which is determined by the `yieldAttestationChallengePeriod` protocol parameter), attestation's root sum is used to update the protocol's ETH TVL accordingly. For attestations to be valid, they must provide X ETH as collateral, and successful attestations are rewarded with the return of collateral and Y additional ETH per block since the last accepted attestation (`priorAttestation`). 

2) During the challenge period, anyone may submit a proof that the attestation is incorrect by calling the `challengeAttestation` function with a `Challenge` struct and providing a Z ETH collateral. This must contain either a differing number of minipools or a differing hash-sum than one of the attested pairs submitted in step 1.

3) If an attestation is challenged, the original attester now has `yieldAttestationProofPeriod` blocks from the submission of the challenge to call `proveAttestation` with a `YieldProof` that contains either a lower level of the trie (which restarts this process at step 1) or a historical state proof for contested sum which is then verified by the protocol. If the attestation is defended successfully, it is considered successful, the attester's collateral is returned along with the additional reward, and the challenger's collateral is not returned. Otherwise, if the attestation is not defended, the challenger is considered successful and has their collateral returnd and receives a reward instead.

### References

[1] For more background, see [Knoshua's discussion of this mechanism in the context of the core Rocket Pool protocol here](https://knoshua.gitbook.io/analysis-of-odao-duties/verifiable-off-chain-calculations).