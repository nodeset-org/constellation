
# Evil Admin Attack Analysis

In these scenarios, the Admin's goal is to profit as much as possible through nefarious means. This generally means attempts to steal protocol funds.

## Scenario: Admin replaces all NOs

1. Admin removes all non-Admin NOs (rate-limited)
2. Admin sets all fees to 100%
3. Never exit validators, keep 100% of rewards forever?

**Predicted Outcome:**
 - Depositors and NOs notice the Admin removing other operators. At 5% maximum operator removal, it takes ~20 days to remove all other operators.
 - No Depositor loses funds, but protocol credibility is damaged and slashing risk increases dramatically as validators are centralized, so TVL decays significantly soon after the attack starts. TVL quickly decays by 99%+ since users will expect an attack even if step 1 is not complete.
 - Depending on the decay rate of the TVL, this attack provides a few days or weeks of increased profits at the expense of all future income. As long as the "threat" of fast TVL decay exists, the Evil Admin can't be sure that the attack will succeed. Given that it requires a high amount of many types of resources to execute, it's more reasonable to expect the Admin to operate honestly and reinvest their 
 
 E.g. Given a more typical Admin fee of ~15% of rewards, this attack is ~6.66x more profitable, but it is not profitable when TVL drops below the same percentage as the fee. If TVL decays below 15% of its original value, then it's no longer profitable at all, so the time between profitability and unprofitablility must be sufficiently long to incentivize an attack. 

   
 doesn't decay  would require almost 7 days of no TVL reduction to be profitable. and  Therefore, it's not profitable compared to the opportunity cost of future revenue from honesty. 
    E.g. if lost TVL is assumed to be > 20%, then this attack is unprofitable at

**This attack is also not plausible due to:**
 - The coordination costs for the multi-sig, including the reputational risk of the administrators
 - The rate limit on the NO removal function (10% of total operators per day?) allows time for Depositors to notice and withdraw
 - Capital costs are very high:
   - Evil admin must create thousands of validators, which carries significant gas costs
   - Evil admin must engineer a complex attack (many weeks of work)
 - There is no guarantee the attack will succeed due to TVL decay between attack start and finish

Questions: 
Rate limiting NO removal causes extra harm during mass inactivity at linearly compared to the rate limit. I.e. with a higher rate limit, more funds are leaked from inactive validators that can't be force-exited due to the rate limit. Keeping in mind there will be a reasonable delay before it's appropriate to begin the removal process, a rate limit would exacerbate the damage if a large portion of NOs were to go down within the same few weeks. Is this an acceptable trade-off to provide an additional guard against the above attack? Or would the market accept the other mitigating factors as enough?

A near-worst-case network state is a small tail risk which is very unlikely and may be disasterous regardless, so additional real risk may be negligble.