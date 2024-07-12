import { NewOperator, SetupData } from '../../../test/test';

export const launchMinipools = async ([setupData, newOperators]: [SetupData, NewOperator[]]): Promise<[SetupData, NewOperator[]]> => {
    console.log('Launching minipools...');
    await Promise.all(newOperators.map(getMinipoolLaunchIterator(setupData)));
    console.log('Minipool launching complete.');
    return [setupData, newOperators];
}

const getMinipoolLaunchIterator = (setupData: SetupData) => async (operator: NewOperator) => {

    const { protocol } = setupData;

    await protocol.superNode.connect(operator.signer).stake(operator.minipoolAddress);

}