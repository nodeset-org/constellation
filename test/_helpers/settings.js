import {
    RocketDAOProtocolSettingsAuction,
    RocketDAOProtocolSettingsDeposit,
    RocketDAOProtocolSettingsMinipool,
    RocketDAOProtocolSettingsNetwork,
    RocketDAOProtocolSettingsNode,
} from '../_utils/artifacts';


// Auction settings
export async function getAuctionSetting(setting) {
    const rocketAuctionSettings = await RocketDAOProtocolSettingsAuction.deployed();
    let value = await rocketAuctionSettings['get' + setting].call();
    return value;
}

// Deposit settings
export async function getDepositSetting(setting) {
    const rocketDAOProtocolSettingsDeposit = await RocketDAOProtocolSettingsDeposit.deployed();
    let value = await rocketDAOProtocolSettingsDeposit['get' + setting].call();
    return value;
}

// Minipool settings
export async function getMinipoolSetting(setting) {
    const rocketDAOProtocolSettingsMinipool = await RocketDAOProtocolSettingsMinipool.deployed();
    let value = await rocketDAOProtocolSettingsMinipool['get' + setting].call();
    return value;
}

// Network settings
export async function getNetworkSetting(setting) {
    const rocketDAOProtocolSettingsNetwork = await RocketDAOProtocolSettingsNetwork.deployed();
    let value = await rocketDAOProtocolSettingsNetwork['get' + setting].call();
    return value;
}

// Node settings
export async function getNodeSetting(setting) {
    const rocketDAOProtocolSettingsNode = await RocketDAOProtocolSettingsNode.deployed();
    let value = await rocketDAOProtocolSettingsNode['get' + setting].call();
    return value;
}


