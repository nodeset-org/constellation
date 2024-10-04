import { task, types } from "hardhat/config";

task("upgradeProxy", "Upgrades a proxy contract to a new implementation using upgrades.upgradeProxy")
    .addParam("proxy", "The address of the proxy contract", undefined, types.string)
    .addParam("implementation", "The name of the new implementation contract factory", undefined, types.string)
    .setAction(async ({ proxy, implementation }, hre) => {
        try {
            console.log(`Upgrading proxy at address: ${proxy} to new implementation: ${implementation}`);

            const ImplFactory: any = await hre.ethers.getContractFactory(implementation);
            const upgradedContract = await hre.upgrades.upgradeProxy(proxy, ImplFactory, {'kind': 'uups', 'unsafeAllow': ['constructor'] });

            console.log(`Proxy upgraded. Implementation is now at: ${upgradedContract.address}`);
            return upgradedContract.address;
        } catch (error) {
            console.error("An error occurred during the upgrade:", error);
            throw error;
        }
    });

task("deployContract", "Deploys a contract using the provided Factory address")
    .addParam("factory", "The name of the Factory contract", undefined, types.string)
    .setAction(async ({ factory }, hre) => {
        console.log(`Deploying contract using Factory: ${factory}`);

        const FactoryContract: any = await hre.ethers.getContractFactory(factory);

        const deployedContract = await FactoryContract.deploy();
        await deployedContract.deployed();

        console.log(`Contract deployed at address: ${deployedContract.address}`);
        return deployedContract.address;
    });

task("upgradeTo", "Encodes the upgradeTo(address) function call for an upgradable contract")
    .addParam("newImplementation", "The address of the new implementation contract", undefined, types.string)
    .setAction(async ({ newImplementation }, hre) => {
        const sigs = ["upgradeTo(address)"];
        const params = [[newImplementation]];

        console.log(`Encoding upgradeTo with new implementation: ${newImplementation}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("upgradeToAndCall", "Encodes the upgradeToAndCall(address,bytes) function call for an upgradable contract")
    .addParam("newImplementation", "The address of the new implementation contract", undefined, types.string)
    .addParam("data", "The calldata to be executed after the upgrade", undefined, types.string)
    .setAction(async ({ newImplementation, data }, hre) => {
        const sigs = ["upgradeToAndCall(address,bytes)"];
        const params = [[newImplementation, data]];

        console.log(`Encoding upgradeToAndCall with new implementation: ${newImplementation} and data: ${data}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });


task("setTreasuryFeeRplVault", "Encodes the setTreasuryFee(uint256) function call for RPLVault")
    .addParam("treasuryFee", "The new treasury fee (uint256)", undefined, types.string)
    .setAction(async ({ treasuryFee }, hre) => {
        const sigs = ["setTreasuryFee(uint256)"];
        const params = [[treasuryFee]];

        console.log(`Encoding setTreasuryFee for RPLVault with fee: ${treasuryFee}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setTreasuryFeeWETHVault", "Encodes the setTreasuryFee(uint256) function call for WETHVault")
    .addParam("treasuryFee", "The new treasury fee (uint256)", undefined, types.string)
    .setAction(async ({ treasuryFee }, hre) => {
        const sigs = ["setTreasuryFee(uint256)"];
        const params = [[treasuryFee]];

        console.log(`Encoding setTreasuryFee for WETHVault with fee: ${treasuryFee}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setNodeOperatorFee", "Encodes the setNodeOperatorFee(uint256) function call for WETHVault")
    .addParam("nodeOperatorFee", "The new node operator fee (uint256)", undefined, types.string)
    .setAction(async ({ nodeOperatorFee }, hre) => {
        const sigs = ["setNodeOperatorFee(uint256)"];
        const params = [[nodeOperatorFee]];

        console.log(`Encoding setNodeOperatorFee for WETHVault with fee: ${nodeOperatorFee}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setProtocolFees", "Encodes the setProtocolFees(uint256,uint256) function call for WETHVault")
    .addParam("nodeOperatorFee", "The new node operator fee (uint256)", undefined, types.string)
    .addParam("treasuryFee", "The new treasury fee (uint256)", undefined, types.string)
    .setAction(async ({ nodeOperatorFee, treasuryFee }, hre) => {
        const sigs = ["setProtocolFees(uint256,uint256)"];
        const params = [[nodeOperatorFee, treasuryFee]];

        console.log(`Encoding setProtocolFees for WETHVault with nodeOperatorFee: ${nodeOperatorFee} and treasuryFee: ${treasuryFee}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setMintFee", "Encodes the setMintFee(uint256) function call for WETHVault")
    .addParam("newMintFee", "The new mint fee (uint256)", undefined, types.string)
    .setAction(async ({ newMintFee }, hre) => {
        const sigs = ["setMintFee(uint256)"];
        const params = [[newMintFee]];

        console.log(`Encoding setMintFee for WETHVault with newMintFee: ${newMintFee}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setLiquidityReservePercentWETHVault", "Encodes the setLiquidityReservePercent(uint256) function call for WETHVault")
    .addParam("liquidityReservePercent", "The new liquidity reserve percent (uint256)", undefined, types.string)
    .setAction(async ({ liquidityReservePercent }, hre) => {
        const sigs = ["setLiquidityReservePercent(uint256)"];
        const params = [[liquidityReservePercent]];

        console.log(`Encoding setLiquidityReservePercent for MerkleClaimStreamer with percent: ${liquidityReservePercent}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setMinWethRplRatio", "Encodes the setMinWethRplRatio(uint256) function call for RPLVault")
    .addParam("minWethRplRatio", "The new minimum WETH/RPL ratio (uint256)", undefined, types.string)
    .setAction(async ({ minWethRplRatio }, hre) => {
        const sigs = ["setMinWethRplRatio(uint256)"];
        const params = [[minWethRplRatio]];

        console.log(`Encoding setMinWethRplRatio for RPLVault with ratio: ${minWethRplRatio}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });
task("setLiquidityReservePercentRPLVault", "Encodes the setLiquidityReservePercent(uint256) function call for RPLVault")
    .addParam("liquidityReservePercent", "The new liquidity reserve percent (uint256)", undefined, types.string)
    .setAction(async ({ liquidityReservePercent }, hre) => {
        const sigs = ["setLiquidityReservePercent(uint256)"];
        const params = [[liquidityReservePercent]];

        console.log(`Encoding setLiquidityReservePercent for RPLVault with percent: ${liquidityReservePercent}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setLockAmount", "Encodes the setLockAmount(uint256) function call for SuperNodeAccount")
    .addParam("newLockThreshold", "The new lock threshold amount (uint256)", undefined, types.string)
    .setAction(async ({ newLockThreshold }, hre) => {
        const sigs = ["setLockAmount(uint256)"];
        const params = [[newLockThreshold]];

        console.log(`Encoding setLockAmount for SuperNodeAccount with threshold: ${newLockThreshold}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });

task("setMaxWethRplRatio", "Encodes the setMaxWethRplRatio(uint256) function call for WETHVault")
    .addParam("maxWethRplRatio", "The new maximum WETH/RPL ratio (uint256)", undefined, types.string)
    .setAction(async ({ maxWethRplRatio }, hre) => {
        const sigs = ["setMaxWethRplRatio(uint256)"];
        const params = [[maxWethRplRatio]];

        console.log(`Encoding setMaxWethRplRatio for WETHVault with ratio: ${maxWethRplRatio}`);
        return await hre.run("encodeProposal", { sigs: JSON.stringify(sigs), params: JSON.stringify(params) });
    });
