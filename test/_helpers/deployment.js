/*** Dependencies ********************/
import { RocketStorage } from '../_utils/artifacts';

const hre = require('hardhat');
const pako = require('pako');
const fs = require('fs');
const Web3 = require('web3');

/*** Utility Methods *****************/

// Compress / decompress ABIs
function compressABI(abi) {
    return Buffer.from(pako.deflate(JSON.stringify(abi))).toString('base64');
}
function decompressABI(abi) {
    return JSON.parse(pako.inflate(Buffer.from(abi, 'base64'), {to: 'string'}));
}

// Load ABI files and parse
function loadABI(abiFilePath) {
    return JSON.parse(fs.readFileSync(abiFilePath));
}


/*** Contracts ***********************/


// Storage
const rocketStorage =                       ethers.getContractFactory('RocketStorage.sol');

// Network contracts
const contracts = {
    // Vault
    rocketVault:                              ethers.getContractFactory('RocketVault.sol'),
    // Tokens
    rocketTokenRPLFixedSupply:                ethers.getContractFactory('RocketTokenDummyRPL.sol'),
    rocketTokenRETH:                          ethers.getContractFactory('RocketTokenRETH.sol'),
    rocketTokenRPL:                           ethers.getContractFactory('RocketTokenRPL.sol'),
    // Auction
    rocketAuctionManager:                     ethers.getContractFactory('RocketAuctionManager.sol'),
    // Deposit
    rocketDepositPool:                        ethers.getContractFactory('RocketDepositPool.sol'),
    // Minipool
    rocketMinipoolDelegate:                   ethers.getContractFactory('RocketMinipoolDelegate.sol'),
    rocketMinipoolManager:                    ethers.getContractFactory('RocketMinipoolManager.sol'),
    rocketMinipoolQueue:                      ethers.getContractFactory('RocketMinipoolQueue.sol'),
    rocketMinipoolPenalty:                    ethers.getContractFactory('RocketMinipoolPenalty.sol'),
    // Network
    rocketNetworkBalances:                    ethers.getContractFactory('RocketNetworkBalances.sol'),
    rocketNetworkFees:                        ethers.getContractFactory('RocketNetworkFees.sol'),
    rocketNetworkPrices:                      ethers.getContractFactory('RocketNetworkPrices.sol'),
    rocketNetworkPenalties:                   ethers.getContractFactory('RocketNetworkPenalties.sol'),
    // Rewards
    rocketRewardsPool:                        ethers.getContractFactory('RocketRewardsPool.sol'),
    rocketClaimDAO:                           ethers.getContractFactory('RocketClaimDAO.sol'),
    // Node
    rocketNodeDeposit:                        ethers.getContractFactory('RocketNodeDeposit.sol'),
    rocketNodeManager:                        ethers.getContractFactory('RocketNodeManager.sol'),
    rocketNodeStaking:                        ethers.getContractFactory('RocketNodeStaking.sol'),
    // DAOs
    rocketDAOProposal:                        ethers.getContractFactory('RocketDAOProposal.sol'),
    rocketDAONodeTrusted:                     ethers.getContractFactory('RocketDAONodeTrusted.sol'),
    rocketDAONodeTrustedProposals:            ethers.getContractFactory('RocketDAONodeTrustedProposals.sol'),
    rocketDAONodeTrustedActions:              ethers.getContractFactory('RocketDAONodeTrustedActions.sol'),
    rocketDAONodeTrustedUpgrade:              ethers.getContractFactory('RocketDAONodeTrustedUpgrade.sol'),
    rocketDAONodeTrustedSettingsMembers:      ethers.getContractFactory('RocketDAONodeTrustedSettingsMembers.sol'),
    rocketDAONodeTrustedSettingsProposals:    ethers.getContractFactory('RocketDAONodeTrustedSettingsProposals.sol'),
    rocketDAONodeTrustedSettingsMinipool:     ethers.getContractFactory('RocketDAONodeTrustedSettingsMinipool.sol'),
    rocketDAOProtocol:                        ethers.getContractFactory('RocketDAOProtocol.sol'),
    rocketDAOProtocolProposals:               ethers.getContractFactory('RocketDAOProtocolProposals.sol'),
    rocketDAOProtocolActions:                 ethers.getContractFactory('RocketDAOProtocolActions.sol'),
    rocketDAOProtocolSettingsInflation:       ethers.getContractFactory('RocketDAOProtocolSettingsInflation.sol'),
    rocketDAOProtocolSettingsRewards:         ethers.getContractFactory('RocketDAOProtocolSettingsRewards.sol'),
    rocketDAOProtocolSettingsAuction:         ethers.getContractFactory('RocketDAOProtocolSettingsAuction.sol'),
    rocketDAOProtocolSettingsNode:            ethers.getContractFactory('RocketDAOProtocolSettingsNode.sol'),
    rocketDAOProtocolSettingsNetwork:         ethers.getContractFactory('RocketDAOProtocolSettingsNetwork.sol'),
    rocketDAOProtocolSettingsDeposit:         ethers.getContractFactory('RocketDAOProtocolSettingsDeposit.sol'),
    rocketDAOProtocolSettingsMinipool:        ethers.getContractFactory('RocketDAOProtocolSettingsMinipool.sol'),
    // v1.1
    rocketMerkleDistributorMainnet:           ethers.getContractFactory('RocketMerkleDistributorMainnet.sol'),
    rocketDAONodeTrustedSettingsRewards:      ethers.getContractFactory('RocketDAONodeTrustedSettingsRewards.sol'),
    rocketSmoothingPool:                      ethers.getContractFactory('RocketSmoothingPool.sol'),
    rocketNodeDistributorFactory:             ethers.getContractFactory('RocketNodeDistributorFactory.sol'),
    rocketNodeDistributorDelegate:            ethers.getContractFactory('RocketNodeDistributorDelegate.sol'),
    rocketMinipoolFactory:                    ethers.getContractFactory('RocketMinipoolFactory.sol'),
    // v1.2
    rocketMinipoolBase:                       ethers.getContractFactory('RocketMinipoolBase.sol'),
    rocketMinipoolBondReducer:                ethers.getContractFactory('RocketMinipoolBondReducer.sol'),
    // Utils
    addressQueueStorage:                      ethers.getContractFactory('AddressQueueStorage.sol'),
    addressSetStorage:                        ethers.getContractFactory('AddressSetStorage.sol'),
};

// Development helper contracts
const revertOnTransfer = ethers.getContractFactory('RevertOnTransfer.sol');
const rocketNodeDepositLEB4 = ethers.getContractFactory('RocketNodeDepositLEB4.sol');

// Instance contract ABIs
const abis = {
    // Minipool
    rocketMinipool:                           [ethers.getContractFactory('RocketMinipoolDelegate.sol'), ethers.getContractFactory('RocketMinipoolBase.sol')],
};

// Construct ABI for rocketMinipool
const rocketMinipoolAbi = []
    .concat(ethers.getContractFactory('RocketMinipoolDelegate').abi)
    .concat(ethers.getContractFactory('RocketMinipoolBase').abi)
    .filter(i => i.type !== 'fallback' && i.type !== 'receive');

rocketMinipoolAbi.push({ stateMutability: 'payable', type: 'fallback'});
rocketMinipoolAbi.push({ stateMutability: 'payable', type: 'receive'});

/*** Deployment **********************/


// Deploy Rocket Pool
export async function deployRocketPool() {
    // Set our web3 provider
    const network = hre.network;
    let $web3 = new Web3(network.provider);

    // Accounts
    let accounts = await $web3.eth.getAccounts(function(error, result) {
        if(error != null) {
            console.log(error);
            console.log("Error retrieving accounts.'");
        }
        return result;
    });

    console.log(`Using network: ${network.name}`);
    console.log(`Deploying from: ${accounts[0]}`)
    console.log('\n');

    const casperDepositABI = loadABI('./contracts/contract/casper/compiled/Deposit.abi');

    // Live deployment
    if ( network.name === 'live' ) {
        // Casper live contract address
        let casperDepositAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
        contracts.casperDeposit = {
            address: casperDepositAddress,
            abi: casperDepositABI,
            precompiled: true
        };
        // Add our live RPL token address in place
        contracts.rocketTokenRPLFixedSupply.address = '0xb4efd85c19999d84251304bda99e90b92300bd93';
    }

    // Goerli test network
    else if (network.name === 'goerli') {
        // Casper deposit contract details
        const casperDepositAddress = '0xff50ed3d0ec03ac01d4c79aad74928bff48a7b2b';       // Prater
        contracts.casperDeposit = {
            address: casperDepositAddress,
            abi: casperDepositABI,
            precompiled: true
        };
    }

    // Test network deployment
    else {
        // Precompiled - Casper Deposit Contract
        const casperDeposit = new $web3.eth.Contract(casperDepositABI, null, {
            from: accounts[0],
            gasPrice: '20000000000' // 20 gwei
        });

        // Create the contract now
        const casperDepositContract = await casperDeposit.deploy(
            // Casper deployment
            {
                data: fs.readFileSync('./contracts/contract/casper/compiled/Deposit.bin').toString()
            }).send({
            from: accounts[0],
            gas: 8000000,
            gasPrice: '20000000000'
        });

        // Set the Casper deposit address
        let casperDepositAddress = casperDepositContract._address;

        // Store it in storage
        contracts.casperDeposit = {
            address: casperDepositAddress,
            abi: casperDepositABI,
            precompiled: true
        };
    }

    // Deploy rocketStorage first - has to be done in this order so that the following contracts already know the storage address
    const rs = await rocketStorage.new();
    rocketStorage.setAsDeployed(rs);
    const rsTx = await $web3.eth.getTransactionReceipt(rs.transactionHash);
    const deployBlock = rsTx.blockNumber;
    // Update the storage with the new addresses
    let rocketStorageInstance = await rocketStorage.deployed();

    // Deploy other contracts - have to be inside an async loop
    const deployContracts = async function() {
        for (let contract in contracts) {
            // Only deploy if it hasn't been deployed already like a precompiled
            let instance
            if(!contracts[contract].hasOwnProperty('precompiled')) {
                switch (contract) {

                    // New RPL contract - pass storage address & existing RPL contract address
                    case 'rocketTokenRPL':
                        instance = await contracts[contract].new(rocketStorageInstance.address, (await contracts.rocketTokenRPLFixedSupply.deployed()).address);
                        contracts[contract].setAsDeployed(instance);
                        break;

                    // Contracts with no constructor args
                    case 'rocketMinipoolDelegate':
                    case 'rocketNodeDistributorDelegate':
                    case 'rocketMinipoolBase':
                        instance = await contracts[contract].new();
                        contracts[contract].setAsDeployed(instance);
                        break;

                    // All other contracts - pass storage address
                    default:
                        instance = await contracts[contract].new(rocketStorageInstance.address);
                        contracts[contract].setAsDeployed(instance);
                        // Slight hack to allow gas optimisation using immutable addresses for non-upgradable contracts
                        if (contract === 'rocketVault' || contract === 'rocketTokenRETH') {
                            await rocketStorageInstance.setAddress(
                                $web3.utils.soliditySha3('contract.address', contract),
                                (await contracts[contract].deployed()).address
                            );
                        }
                        break;

                }
            }
        }
    };
    // Run it
    await deployContracts();

    // Register all other contracts with storage and store their abi
    const addContracts = async function() {
        // Log RocketStorage
        console.log('\x1b[31m%s\x1b[0m:', '   Set Storage Address');
        console.log('     ' + (await rocketStorage.deployed()).address);
        // Add Rocket Storage to deployed contracts
        contracts.rocketStorage = ethers.getContractFactory('RocketStorage.sol');
        // Now process the rest
        for (let contract in contracts) {
            if(contracts.hasOwnProperty(contract)) {
                switch (contract) {
                    default:
                        const address = contract === 'casperDeposit' ? contracts[contract].address : (await contracts[contract].deployed()).address;

                        // Log it
                        console.log('\x1b[31m%s\x1b[0m:', '   Set Storage ' + contract + ' Address');
                        console.log('     ' + address);
                        // Register the contract address as part of the network
                        await rocketStorageInstance.setBool(
                            $web3.utils.soliditySha3('contract.exists', address),
                            true
                        );
                        // Register the contract's name by address
                        await rocketStorageInstance.setString(
                            $web3.utils.soliditySha3('contract.name', address),
                            contract
                        );
                        // Register the contract's address by name (rocketVault and rocketTokenRETH addresses already stored)
                        if (!(contract === 'rocketVault' || contract === 'rocketTokenRETH')) {
                            await rocketStorageInstance.setAddress(
                                $web3.utils.soliditySha3('contract.address', contract),
                                address
                            );
                        }
                        // Compress and store the ABI by name
                        await rocketStorageInstance.setString(
                            $web3.utils.soliditySha3('contract.abi', contract),
                            compressABI(contracts[contract].abi)
                        );
                        break;
                }
            }
        }
    };

    // Register ABI-only contracts
    const addABIs = async function() {
        for (let contract in abis) {
            if(abis.hasOwnProperty(contract)) {
                console.log('\x1b[31m%s\x1b[0m:', '   Set Storage ABI');
                console.log('     '+contract);
                if(Array.isArray(abis[contract])) {
                    // Merge ABIs from multiple artifacts
                    let combinedAbi = [];
                    for (const artifact of abis[contract]) {
                        combinedAbi = combinedAbi.concat(artifact.abi);
                    }
                    // Compress and store the ABI
                    await rocketStorageInstance.setString(
                        $web3.utils.soliditySha3('contract.abi', contract),
                        compressABI(combinedAbi)
                    );
                } else {
                    // Compress and store the ABI
                    await rocketStorageInstance.setString(
                        $web3.utils.soliditySha3('contract.abi', contract),
                        compressABI(abis[contract].abi)
                    );
                }
            }
        }
    };

    // Run it
    console.log('\x1b[34m%s\x1b[0m', '  Deploy Contracts');
    console.log('\x1b[34m%s\x1b[0m', '  ******************************************');
    await addContracts();
    console.log('\n');
    console.log('\x1b[34m%s\x1b[0m', '  Set ABI Only Storage');
    console.log('\x1b[34m%s\x1b[0m', '  ******************************************');
    await addABIs();

    // Store deployed block
    console.log('\n');
    console.log('Setting deploy.block to ' + deployBlock);
    await rocketStorageInstance.setUint(
        $web3.utils.soliditySha3('deploy.block'),
        deployBlock
    );

    // Disable direct access to storage now
    await rocketStorageInstance.setDeployedStatus();
    if(await rocketStorageInstance.getDeployedStatus() !== true) throw 'Storage Access Not Locked Down!!';

    // Log it
    console.log('\n');
    console.log('\x1b[32m%s\x1b[0m', '  Storage Direct Access For Owner Removed... Lets begin! :)');
    console.log('\n');

    // Deploy development help contracts
    if (network.name !== 'live' && network.name !== 'goerli') {
        let instance = await revertOnTransfer.new();
        revertOnTransfer.setAsDeployed(instance);

        instance = await rocketNodeDepositLEB4.new(rocketStorageInstance.address);
        rocketNodeDepositLEB4.setAsDeployed(instance);
    }
};
