import {
    RocketMinipoolBondReducer,
    RocketMinipoolManager,
    RocketNodeDeposit,
    RocketNodeStaking,
} from '../_utils/artifacts';
import { assertBN } from '../_helpers/bn';


// Reduce bonding amount of a minipool
export async function reduceBond(minipool, txOptions = null) {
    const rocketNodeDeposit = await RocketNodeDeposit.deployed();
    const rocketNodeStaking = await RocketNodeStaking.deployed();
    const rocketMinipoolBondReducer = await RocketMinipoolBondReducer.deployed();
    const rocketNodeManager = await RocketMinipoolManager.deployed();
    const node = await minipool.getNodeAddress();

    const newBond = await rocketMinipoolBondReducer.getReduceBondValue(minipool.address);
    const prevBond = await minipool.getNodeDepositBalance();

    // Get minipool balances
    function getMinipoolBalances() {
        return Promise.all([
            minipool.getNodeDepositBalance.call(),
            minipool.getUserDepositBalance.call(),
            rocketNodeDeposit.getNodeDepositCredit(node),
            rocketNodeStaking.getNodeETHMatched(node),
        ]).then(
            ([nodeDepositBalance, userDepositBalance, nodeDepositCredit, ethMatched]) =>
                ({nodeDepositBalance, userDepositBalance, nodeDepositCredit, ethMatched})
        );
    }

    // Get node details
    function getNodeDetails() {
        return Promise.all([
            rocketNodeManager.getNodeStakingMinipoolCountBySize(node, prevBond),
            rocketNodeManager.getNodeStakingMinipoolCountBySize(node, newBond),
            rocketNodeManager.getNodeStakingMinipoolCount(node),
        ]).then(
            ([prevBondCount, newBondCount, totalCount]) =>
                ({prevBondCount, newBondCount, totalCount})
        )
    }

    // Get new bond amount
    const amount = await rocketMinipoolBondReducer.getReduceBondValue(minipool.address);

    // Record balances before and after calling reduce bond function
    const balances1 = await getMinipoolBalances();
    const details1 = await getNodeDetails();
    await minipool.reduceBondAmount(txOptions);
    const balances2 = await getMinipoolBalances();
    const details2 = await getNodeDetails();

    // Verify results
    const delta = balances1.nodeDepositBalance.sub(amount);
    assertBN.equal(balances2.nodeDepositBalance, delta);
    assertBN.equal(balances2.userDepositBalance.sub(balances1.userDepositBalance), delta);
    assertBN.equal(balances2.nodeDepositCredit.sub(balances1.nodeDepositCredit), delta);
    assertBN.equal(balances2.ethMatched.sub(balances1.ethMatched), delta);

    // Overall number of minipools shouldn't change
    assertBN.equal(details2.totalCount, details1.totalCount);
    // Prev bond amount should decrement by 1
    assertBN.equal(details1.prevBondCount.sub(details2.prevBondCount), '1'.BN);
    // New bond amount should increment by 1
    assertBN.equal(details2.newBondCount.sub(details1.newBondCount), '1'.BN);
}
