# Operator Lifecycle

1) Admin: Whitelist.addOperator()
    - `operationStartTime = block.timestamp`
    - `currentValidatorCount = 0`
    - `feePortion = 0`
2) Operator: `OperatorDistributor.addValidator()` and `OperatorDistributor.removeValidator()`
- update fee portion:
`feePortion = 1 - abs(currentValidatorCount - targetValidatorCount)/targetValidatorCount`
This provides an increasing incentive for NOs to enter/exit validators as required.

3) Keeper: `YieldDistributor.distributeRewards()`
- send rewards based on this snippet:
`feePortion * min(max((block.timestamp - operationStartTime) / trustBuildPeriod, 1), 1)`

4) Admin: `Whitelist.removeOperator()`
- Implementation TBD
   

### Open Questions
- Should removed operators which are added again retain their original operationStartTime?
- Can the feePortion update be abused by depositors or NOs in any way?
- How long should the trustBuildPeriod be?
- Current design assumes Admin can override feePortion for operators -- can this be abused by the Admin? To do: add this to [Evil Admin Analysis](Evil Admin Analysis.md)