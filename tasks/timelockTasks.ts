
import { task, types } from "hardhat/config";

task("authorizeUpgrade", "Encodes the _authorizeUpgrade(address) function call")
    .addParam("upgrader", "The address to authorize for upgrade", undefined, types.string)
    .setAction(async ({ upgrader }, hre) => {
        const sigs = ["_authorizeUpgrade(address)"];
        const params = [[upgrader]]; // Parameters for each function signature

        console.log(`Encoding _authorizeUpgrade for upgrader: ${upgrader}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });


task("setTreasuryFeeRplVault", "Encodes the setTreasuryFee(uint256) function call for RPLVault")
    .addParam("treasuryFee", "The new treasury fee (uint256)", undefined, types.string)
    .setAction(async ({ treasuryFee }, hre) => {
        const sigs = ["setTreasuryFee(uint256)"];
        const params = [[treasuryFee]];

        console.log(`Encoding setTreasuryFee for RPLVault with fee: ${treasuryFee}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setTreasuryFeeWETHVault", "Encodes the setTreasuryFee(uint256) function call for WETHVault")
    .addParam("treasuryFee", "The new treasury fee (uint256)", undefined, types.string)
    .setAction(async ({ treasuryFee }, hre) => {
        const sigs = ["setTreasuryFee(uint256)"];
        const params = [[treasuryFee]];

        console.log(`Encoding setTreasuryFee for WETHVault with fee: ${treasuryFee}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setNodeOperatorFee", "Encodes the setNodeOperatorFee(uint256) function call for WETHVault")
    .addParam("nodeOperatorFee", "The new node operator fee (uint256)", undefined, types.string)
    .setAction(async ({ nodeOperatorFee }, hre) => {
        const sigs = ["setNodeOperatorFee(uint256)"];
        const params = [[nodeOperatorFee]];

        console.log(`Encoding setNodeOperatorFee for WETHVault with fee: ${nodeOperatorFee}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setProtocolFees", "Encodes the setProtocolFees(uint256,uint256) function call for WETHVault")
    .addParam("nodeOperatorFee", "The new node operator fee (uint256)", undefined, types.string)
    .addParam("treasuryFee", "The new treasury fee (uint256)", undefined, types.string)
    .setAction(async ({ nodeOperatorFee, treasuryFee }, hre) => {
        const sigs = ["setProtocolFees(uint256,uint256)"];
        const params = [[nodeOperatorFee, treasuryFee]];

        console.log(`Encoding setProtocolFees for WETHVault with nodeOperatorFee: ${nodeOperatorFee} and treasuryFee: ${treasuryFee}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setMintFee", "Encodes the setMintFee(uint256) function call for WETHVault")
    .addParam("newMintFee", "The new mint fee (uint256)", undefined, types.string)
    .setAction(async ({ newMintFee }, hre) => {
        const sigs = ["setMintFee(uint256)"];
        const params = [[newMintFee]];

        console.log(`Encoding setMintFee for WETHVault with newMintFee: ${newMintFee}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setLiquidityReservePercentMerkleClaimStreamer", "Encodes the setLiquidityReservePercent(uint256) function call for MerkleClaimStreamer")
    .addParam("liquidityReservePercent", "The new liquidity reserve percent (uint256)", undefined, types.string)
    .setAction(async ({ liquidityReservePercent }, hre) => {
        const sigs = ["setLiquidityReservePercent(uint256)"];
        const params = [[liquidityReservePercent]];

        console.log(`Encoding setLiquidityReservePercent for MerkleClaimStreamer with percent: ${liquidityReservePercent}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setMinWethRplRatio", "Encodes the setMinWethRplRatio(uint256) function call for RPLVault")
    .addParam("minWethRplRatio", "The new minimum WETH/RPL ratio (uint256)", undefined, types.string)
    .setAction(async ({ minWethRplRatio }, hre) => {
        const sigs = ["setMinWethRplRatio(uint256)"];
        const params = [[minWethRplRatio]];

        console.log(`Encoding setMinWethRplRatio for RPLVault with ratio: ${minWethRplRatio}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });
task("setLiquidityReservePercentRPLVault", "Encodes the setLiquidityReservePercent(uint256) function call for RPLVault")
    .addParam("liquidityReservePercent", "The new liquidity reserve percent (uint256)", undefined, types.string)
    .setAction(async ({ liquidityReservePercent }, hre) => {
        const sigs = ["setLiquidityReservePercent(uint256)"];
        const params = [[liquidityReservePercent]];

        console.log(`Encoding setLiquidityReservePercent for RPLVault with percent: ${liquidityReservePercent}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setLockAmount", "Encodes the setLockAmount(uint256) function call for SuperNodeAccount")
    .addParam("newLockThreshold", "The new lock threshold amount (uint256)", undefined, types.string)
    .setAction(async ({ newLockThreshold }, hre) => {
        const sigs = ["setLockAmount(uint256)"];
        const params = [[newLockThreshold]];

        console.log(`Encoding setLockAmount for SuperNodeAccount with threshold: ${newLockThreshold}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setMaxWethRplRatio", "Encodes the setMaxWethRplRatio(uint256) function call for WETHVault")
    .addParam("maxWethRplRatio", "The new maximum WETH/RPL ratio (uint256)", undefined, types.string)
    .setAction(async ({ maxWethRplRatio }, hre) => {
        const sigs = ["setMaxWethRplRatio(uint256)"];
        const params = [[maxWethRplRatio]];

        console.log(`Encoding setMaxWethRplRatio for WETHVault with ratio: ${maxWethRplRatio}`);
        await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });
