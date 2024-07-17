import { NewOperator, SetupData } from "../../../test/test";
import { increaseEVMTime } from "../../../test/utils/utils";

export const fillDepositPoolAndAssignDeposits = async ([setupData, newOperators]: [SetupData, NewOperator[]]): Promise<[SetupData, NewOperator[]]> => {
    
    const { rocketPool } = setupData;

    await rocketPool.rocketDepositPoolContract.deposit({
        value: ethers.utils.parseEther('32').mul(newOperators.length),
    });
    
    await rocketPool.rocketDepositPoolContract.assignDeposits();
    
    await increaseEVMTime(60 * 60 * 24 * 7 * 32);

    return [setupData, newOperators];
}