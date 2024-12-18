import { task, types } from 'hardhat/config';


task("upgradeTo", "Encodes the upgradeTo(address) function call for an upgradable contract")
    .addParam("newImplementation", "The address of the new implementation contract", undefined, types.string)
    .setAction(async ({ newImplementation }, hre) => {
        const sigs = ["upgradeTo(address)"];
        const params = [[newImplementation]];
    console.log(`Encoding upgradeTo with new implementation: ${newImplementation}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('upgradeToAndCall', 'Encodes the upgradeToAndCall(address,bytes) function call for an upgradable contract')
  .addParam('newImplementation', 'The address of the new implementation contract', undefined, types.string)
  .addParam('data', 'The calldata to be executed after the upgrade', undefined, types.string)
  .setAction(async ({ newImplementation, data }, hre) => {
    const sigs = ['upgradeToAndCall(address,bytes)'];
    const params = [[newImplementation, data]];

    console.log(`Encoding upgradeToAndCall with new implementation: ${newImplementation} and data: ${data}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('setTreasuryFeeRplVault', 'Encodes the setTreasuryFee(uint256) function call for RPLVault')
  .addParam('treasuryFee', 'The new treasury fee (uint256)', undefined, types.string)
  .setAction(async ({ treasuryFee }, hre) => {
    const sigs = ['setTreasuryFee(uint256)'];
    const params = [[treasuryFee]];

    console.log(`Encoding setTreasuryFee for RPLVault with fee: ${treasuryFee}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('setTreasuryFeeWETHVault', 'Encodes the setTreasuryFee(uint256) function call for WETHVault')
  .addParam('treasuryFee', 'The new treasury fee (uint256)', undefined, types.string)
  .setAction(async ({ treasuryFee }, hre) => {
    const sigs = ['setTreasuryFee(uint256)'];
    const params = [[treasuryFee]];

    console.log(`Encoding setTreasuryFee for WETHVault with fee: ${treasuryFee}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('setNodeOperatorFee', 'Encodes the setNodeOperatorFee(uint256) function call for WETHVault')
  .addParam('nodeOperatorFee', 'The new node operator fee (uint256)', undefined, types.string)
  .setAction(async ({ nodeOperatorFee }, hre) => {
    const sigs = ['setNodeOperatorFee(uint256)'];
    const params = [[nodeOperatorFee]];

    console.log(`Encoding setNodeOperatorFee for WETHVault with fee: ${nodeOperatorFee}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('setProtocolFees', 'Encodes the setProtocolFees(uint256,uint256) function call for WETHVault')
  .addParam('nodeOperatorFee', 'The new node operator fee (uint256)', undefined, types.string)
  .addParam('treasuryFee', 'The new treasury fee (uint256)', undefined, types.string)
  .setAction(async ({ nodeOperatorFee, treasuryFee }, hre) => {
    const sigs = ['setProtocolFees(uint256,uint256)'];
    const params = [[nodeOperatorFee, treasuryFee]];

    console.log(
      `Encoding setProtocolFees for WETHVault with nodeOperatorFee: ${nodeOperatorFee} and treasuryFee: ${treasuryFee}`
    );
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('setMintFee', 'Encodes the setMintFee(uint256) function call for WETHVault')
  .addParam('newMintFee', 'The new mint fee (uint256)', undefined, types.string)
  .setAction(async ({ newMintFee }, hre) => {
    const sigs = ['setMintFee(uint256)'];
    const params = [[newMintFee]];

    console.log(`Encoding setMintFee for WETHVault with newMintFee: ${newMintFee}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task(
  'setLiquidityReservePercentWETHVault',
  'Encodes the setLiquidityReservePercent(uint256) function call for WETHVault'
)
  .addParam('liquidityReservePercent', 'The new liquidity reserve percent (uint256)', undefined, types.string)
  .setAction(async ({ liquidityReservePercent }, hre) => {
    const sigs = ['setLiquidityReservePercent(uint256)'];
    const params = [[liquidityReservePercent]];

    console.log(`Encoding setLiquidityReservePercent for MerkleClaimStreamer with percent: ${liquidityReservePercent}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('setMinWethRplRatio', 'Encodes the setMinWethRplRatio(uint256) function call for RPLVault')
  .addParam('minWethRplRatio', 'The new minimum WETH/RPL ratio (uint256)', undefined, types.string)
  .setAction(async ({ minWethRplRatio }, hre) => {
    const sigs = ['setMinWethRplRatio(uint256)'];
    const params = [[minWethRplRatio]];

    console.log(`Encoding setMinWethRplRatio for RPLVault with ratio: ${minWethRplRatio}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });
task('setLiquidityReservePercentRPLVault', 'Encodes the setLiquidityReservePercent(uint256) function call for RPLVault')
  .addParam('liquidityReservePercent', 'The new liquidity reserve percent (uint256)', undefined, types.string)
  .setAction(async ({ liquidityReservePercent }, hre) => {
    const sigs = ['setLiquidityReservePercent(uint256)'];
    const params = [[liquidityReservePercent]];

    console.log(`Encoding setLiquidityReservePercent for RPLVault with percent: ${liquidityReservePercent}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('setLockAmount', 'Encodes the setLockAmount(uint256) function call for SuperNodeAccount')
  .addParam('newLockThreshold', 'The new lock threshold amount (uint256)', undefined, types.string)
  .setAction(async ({ newLockThreshold }, hre) => {
    const sigs = ['setLockAmount(uint256)'];
    const params = [[newLockThreshold]];

    console.log(`Encoding setLockAmount for SuperNodeAccount with threshold: ${newLockThreshold}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

task('setMaxWethRplRatio', 'Encodes the setMaxWethRplRatio(uint256) function call for WETHVault')
  .addParam('maxWethRplRatio', 'The new maximum WETH/RPL ratio (uint256)', undefined, types.string)
  .setAction(async ({ maxWethRplRatio }, hre) => {
    const sigs = ['setMaxWethRplRatio(uint256)'];
    const params = [[maxWethRplRatio]];

    console.log(`Encoding setMaxWethRplRatio for WETHVault with ratio: ${maxWethRplRatio}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

  task('setOperatorRewardsAddress', 'Encodes the setOperatorRewards(address) function call for Directory')
  .addParam('operatorRewardsAddress', 'The new operator rewards address (string)', undefined, types.string)
  .setAction(async ({ operatorRewardsAddress }, hre) => {
    const sigs = ['setOperatorRewards(address)'];
    const params = [[operatorRewardsAddress]];

    console.log(`Encoding setOperatorRewards for Directory with ratio: ${operatorRewardsAddress}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });

  task('updateDelay', 'Encodes the updateDelay(uint256) function call for ConstellationTimelock')
  .addParam('delay', 'The new delay in seconds (uint256)', undefined, types.string)
  .setAction(async ({ delay }, hre) => {
    const sigs = ['updateDelay(uint256)'];
    const params = [[delay]];

    console.log(`Encoding updateDelay for ConstellationTimelock with delay: ${delay}`);
    return await hre.run('encodeProposal', { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
  });