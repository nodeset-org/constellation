import { RocketAuctionManager, RocketDAOProtocolSettingsAuction, RocketNetworkPrices } from '../_utils/artifacts';
import { assertBN } from '../_helpers/bn';


// Create a new lot for auction
export async function createLot(txOptions) {

    // Load contracts
    const [
        rocketAuctionManager,
        rocketAuctionSettings,
        rocketNetworkPrices,
    ] = await Promise.all([
        RocketAuctionManager.deployed(),
        RocketDAOProtocolSettingsAuction.deployed(),
        RocketNetworkPrices.deployed(),
    ]);

    // Get parameters
    const [
        lotMaxEthValue,
        lotDuration,
        startPriceRatio,
        reservePriceRatio,
        rplPrice,
    ] = await Promise.all([
        rocketAuctionSettings.getLotMaximumEthValue.call(),
        rocketAuctionSettings.getLotDuration.call(),
        rocketAuctionSettings.getStartingPriceRatio.call(),
        rocketAuctionSettings.getReservePriceRatio.call(),
        rocketNetworkPrices.getRPLPrice.call(),
    ]);

    // Get auction contract details
    function getContractDetails() {
        return Promise.all([
            rocketAuctionManager.getTotalRPLBalance.call(),
            rocketAuctionManager.getAllottedRPLBalance.call(),
            rocketAuctionManager.getRemainingRPLBalance.call(),
            rocketAuctionManager.getLotCount.call(),
        ]).then(
            ([totalRplBalance, allottedRplBalance, remainingRplBalance, lotCount]) =>
            ({totalRplBalance, allottedRplBalance, remainingRplBalance, lotCount})
        );
    }

    // Get lot details
    function getLotDetails(lotIndex) {
        return Promise.all([
            rocketAuctionManager.getLotExists.call(lotIndex),
            rocketAuctionManager.getLotStartBlock.call(lotIndex),
            rocketAuctionManager.getLotEndBlock.call(lotIndex),
            rocketAuctionManager.getLotStartPrice.call(lotIndex),
            rocketAuctionManager.getLotReservePrice.call(lotIndex),
            rocketAuctionManager.getLotTotalRPLAmount.call(lotIndex),
            rocketAuctionManager.getLotCurrentPrice.call(lotIndex),
            rocketAuctionManager.getLotClaimedRPLAmount.call(lotIndex),
            rocketAuctionManager.getLotRemainingRPLAmount.call(lotIndex),
            rocketAuctionManager.getLotIsCleared.call(lotIndex),
        ]).then(
            ([exists, startBlock, endBlock, startPrice, reservePrice, totalRpl, currentPrice, claimedRpl, remainingRpl, isCleared]) =>
            ({exists, startBlock, endBlock, startPrice, reservePrice, totalRpl, currentPrice, claimedRpl, remainingRpl, isCleared})
        );
    }

    // Get initial contract details
    let details1 = await getContractDetails();

    // Create lot
    await rocketAuctionManager.createLot(txOptions);

    // Get updated contract details
    let [details2, lot] = await Promise.all([
        getContractDetails(),
        getLotDetails(details1.lotCount),
    ]);

    // Get expected values
    const calcBase = '1'.ether;
    const lotMaxRplAmount = calcBase.mul(lotMaxEthValue).div(rplPrice);
    const expectedRemainingRplBalance = (details1.remainingRplBalance.gt(lotMaxRplAmount) ? details1.remainingRplBalance.sub(lotMaxRplAmount) : '0'.ether);
    const expectedLotRplAmount = (details1.remainingRplBalance.lt(lotMaxRplAmount) ? details1.remainingRplBalance : lotMaxRplAmount);

    // Check contract details
    assertBN.equal(details2.totalRplBalance, details1.totalRplBalance, 'Total RPL balance updated and should not have');
    assertBN.equal(details2.remainingRplBalance, expectedRemainingRplBalance, 'Incorrect updated remaining RPL balance');
    assertBN.equal(details2.totalRplBalance, details2.allottedRplBalance.add(details2.remainingRplBalance), 'Incorrect updated RPL balances');
    assertBN.equal(details2.lotCount, details1.lotCount.add('1'.BN), 'Incorrect updated lot count');

    // Check lot details
    assert.isTrue(lot.exists, 'Incorrect lot exists status');
    assertBN.equal(lot.endBlock, lot.startBlock.add(lotDuration), 'Incorrect lot start/end blocks');
    assertBN.equal(lot.startPrice, rplPrice.mul(startPriceRatio).div(calcBase), 'Incorrect lot starting price');
    assertBN.equal(lot.reservePrice, rplPrice.mul(reservePriceRatio).div(calcBase), 'Incorrect lot reserve price');
    assertBN.equal(lot.totalRpl, expectedLotRplAmount, 'Incorrect lot total RPL amount');
    assertBN.equal(lot.currentPrice, lot.startPrice, 'Incorrect lot current price');
    assertBN.equal(lot.claimedRpl, 0, 'Incorrect lot claimed RPL amount');
    assertBN.equal(lot.remainingRpl, lot.totalRpl, 'Incorrect lot remaining RPL amount');
    assert.isFalse(lot.isCleared, 'Incorrect lot cleared status');
}

