import {
    RocketMinipoolDelegate,
    RocketMinipoolManager,
    RocketMinipoolFactory,
    RocketDAOProtocolSettingsMinipool,
    RocketNetworkPrices,
    RocketNodeDeposit,
    RocketDAOProtocolSettingsNode,
    RocketStorage,
    RocketNodeStaking,
} from '../_utils/artifacts';
import { getValidatorPubkey, getValidatorSignature, getDepositDataRoot } from '../_utils/beacon';
import { assertBN } from './bn';

// Possible states that a proposal may be in
export const minipoolStates = {
    Initialised     : 0,
    Prelaunch       : 1,
    Staking         : 2,
    Withdrawable    : 3,
    Dissolved       : 4
};

// Get the number of minipools a node has
export async function getNodeMinipoolCount(nodeAddress) {
    const rocketMinipoolManager = await RocketMinipoolManager.deployed();
    let count = await rocketMinipoolManager.getNodeMinipoolCount.call(nodeAddress);
    return count;
}

// Get the number of minipools a node has in Staking status
export async function getNodeStakingMinipoolCount(nodeAddress) {
  const rocketMinipoolManager = await RocketMinipoolManager.deployed();
  let count = await rocketMinipoolManager.getNodeStakingMinipoolCount.call(nodeAddress);
  return count;
}

// Get the number of minipools a node has in that are active
export async function getNodeActiveMinipoolCount(nodeAddress) {
    const rocketMinipoolManager = await RocketMinipoolManager.deployed();
    let count = await rocketMinipoolManager.getNodeActiveMinipoolCount.call(nodeAddress);
    return count;
}

// Get the minimum required RPL stake for a minipool
export async function getMinipoolMinimumRPLStake() {

    // Load contracts
    const [
        rocketDAOProtocolSettingsMinipool,
        rocketNetworkPrices,
        rocketDAOProtocolSettingsNode,
    ] = await Promise.all([
        RocketDAOProtocolSettingsMinipool.deployed(),
        RocketNetworkPrices.deployed(),
        RocketDAOProtocolSettingsNode.deployed(),
    ]);

    // Load data
    let [depositUserAmount, minMinipoolStake, rplPrice] = await Promise.all([
        rocketDAOProtocolSettingsMinipool.getHalfDepositUserAmount(),
        rocketDAOProtocolSettingsNode.getMinimumPerMinipoolStake(),
        rocketNetworkPrices.getRPLPrice(),
    ]);

    // Calculate & return
    return depositUserAmount.mul(minMinipoolStake).div(rplPrice);

}

let minipoolSalt = 1

// Create a minipool
export async function createMinipool(txOptions, salt = null) {
    return createMinipoolWithBondAmount(txOptions.value, txOptions, salt);
}

export async function createMinipoolWithBondAmount(bondAmount, txOptions, salt = null) {
    // Load contracts
    const [
        rocketMinipoolFactory,
        rocketNodeDeposit,
        rocketNodeStaking,
        rocketStorage,
    ] = await Promise.all([
        RocketMinipoolFactory.deployed(),
        RocketNodeDeposit.deployed(),
        RocketNodeStaking.deployed(),
        RocketStorage.deployed()
    ]);

    // Get minipool contract bytecode
    let contractBytecode;

    if (salt === null){
        salt = minipoolSalt++;
    }

    let minipoolAddress = (await rocketMinipoolFactory.getExpectedAddress(txOptions.from, salt)).substr(2);

    let withdrawalCredentials = '0x010000000000000000000000' + minipoolAddress;

    // Make node deposit
    const ethMatched1 = await rocketNodeStaking.getNodeETHMatched(txOptions.from);

    // Get validator deposit data
    let depositData = {
        pubkey: getValidatorPubkey(),
        withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), 'hex'),
        amount: BigInt(1000000000), // gwei
        signature: getValidatorSignature(),
    };

    let depositDataRoot = getDepositDataRoot(depositData);

    if (txOptions.value.eq(bondAmount)) {
        await rocketNodeDeposit.deposit(bondAmount, '0'.ether, depositData.pubkey, depositData.signature, depositDataRoot, salt, '0x' + minipoolAddress, txOptions);
    } else {
        await rocketNodeDeposit.depositWithCredit(bondAmount, '0'.ether, depositData.pubkey, depositData.signature, depositDataRoot, salt, '0x' + minipoolAddress, txOptions);
    }

    const ethMatched2 = await rocketNodeStaking.getNodeETHMatched(txOptions.from);

    // Expect node's ETH matched to be increased by (32 - bondAmount)
    assertBN.equal(ethMatched2.sub(ethMatched1), '32'.ether.sub(bondAmount), 'Incorrect ETH matched');

    return RocketMinipoolDelegate.at('0x' + minipoolAddress);
}


// Create a vacant minipool
export async function createVacantMinipool(bondAmount, txOptions, salt = null, currentBalance = '32'.ether, pubkey = null) {
    // Load contracts
    const [
        rocketMinipoolFactory,
        rocketNodeDeposit,
        rocketNodeStaking,
        rocketStorage,
    ] = await Promise.all([
        RocketMinipoolFactory.deployed(),
        RocketNodeDeposit.deployed(),
        RocketNodeStaking.deployed(),
        RocketStorage.deployed()
    ]);

    if (salt === null){
        salt = minipoolSalt++;
    }

    if (pubkey === null){
        pubkey = getValidatorPubkey();
    }

    const minipoolAddress = (await rocketMinipoolFactory.getExpectedAddress(txOptions.from, salt)).substr(2);

    const ethMatched1 = await rocketNodeStaking.getNodeETHMatched(txOptions.from);
    await rocketNodeDeposit.createVacantMinipool(bondAmount, '0'.ether, pubkey, salt, '0x' + minipoolAddress, currentBalance, txOptions);
    const ethMatched2 = await rocketNodeStaking.getNodeETHMatched(txOptions.from);

    // Expect node's ETH matched to be increased by (32 - bondAmount)
    assertBN.equal(ethMatched2.sub(ethMatched1), '32'.ether.sub(bondAmount), 'Incorrect ETH matched');

    return RocketMinipoolDelegate.at('0x' + minipoolAddress);
}


// Refund node ETH from a minipool
export async function refundMinipoolNodeETH(minipool, txOptions) {
    await minipool.refund(txOptions);
}


// Progress a minipool to staking
export async function stakeMinipool(minipool, txOptions) {

    // Get contracts
    const rocketMinipoolManager = await RocketMinipoolManager.deployed();

    // Get minipool validator pubkey
    const validatorPubkey = await rocketMinipoolManager.getMinipoolPubkey(minipool.address);

    // Get minipool withdrawal credentials
    let withdrawalCredentials = await rocketMinipoolManager.getMinipoolWithdrawalCredentials.call(minipool.address);

    // Check if legacy or new minipool
    let legacy = !(await minipool.getDepositType()).eq('4'.BN);

    // Get validator deposit data
    let depositData;

    if (legacy) {
        depositData = {
            pubkey: Buffer.from(validatorPubkey.substr(2), 'hex'),
            withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), 'hex'),
            amount: BigInt(16000000000), // gwei
            signature: getValidatorSignature(),
        };
    } else {
        depositData = {
            pubkey: Buffer.from(validatorPubkey.substr(2), 'hex'),
            withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), 'hex'),
            amount: BigInt(31000000000), // gwei
            signature: getValidatorSignature(),
        };
    }
    let depositDataRoot = getDepositDataRoot(depositData);

    // Stake
    await minipool.stake(depositData.signature, depositDataRoot, txOptions);

}


// Promote a minipool to staking
export async function promoteMinipool(minipool, txOptions) {
    await minipool.promote(txOptions);
}


// Dissolve a minipool
export async function dissolveMinipool(minipool, txOptions) {
    await minipool.dissolve(txOptions);
}


// Close a dissolved minipool and destroy it
export async function closeMinipool(minipool, txOptions) {
    await minipool.close(txOptions);
}

