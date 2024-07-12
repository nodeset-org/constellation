import { generateDepositData } from "../../../test/rocketpool/_helpers/minipool";
import { NewOperator, SetupData } from "../../../test/test";
import { prepareOperatorDistributionContract } from "../../../test/utils/utils";
import { ethers } from 'hardhat';

export const prepareNewOperators = async (setupData: SetupData): Promise<[SetupData, NewOperator[]]> => {
    
    console.log('Preparing new operators...');

    const { signers, protocol: { superNode } } = setupData;

    const { operator, random, random2, random3, random4, random5 } = signers;
    
    
    const operators = [
        {
            timezoneLocation: 'Australia/Brisbane',
            signer: operator,
            bondValue: ethers.utils.parseEther('8'),
            minimumNodeFee: 0
        },
        {
            timezoneLocation: 'Australia/Brisbane',
            signer: random,
            bondValue: ethers.utils.parseEther('8'),
            minimumNodeFee: 0
        },
        {
            timezoneLocation: 'Australia/Brisbane',
            signer: random2,
            bondValue: ethers.utils.parseEther('8'),
            minimumNodeFee: 0
        },
        {
            timezoneLocation: 'Australia/Brisbane',
            signer: random3,
            bondValue: ethers.utils.parseEther('8'),
            minimumNodeFee: 0
        } ,
        {
            timezoneLocation: 'Australia/Brisbane',
            signer: random4,
            bondValue: ethers.utils.parseEther('8'),
            minimumNodeFee: 0
        }, 
        {
            timezoneLocation: 'Australia/Brisbane',
            signer: random5,
            bondValue: ethers.utils.parseEther('8'),
            minimumNodeFee: 0
        }
    ];

    const newOperators = await Promise.all(
        operators.map(async (operator, salt) => ({
        ...operator,
        ... await generateDepositData(superNode.address, salt),
        salt
        
    })));

    // TODO: Not sure why the + 1 necessary? Without it we seem to run out of RPL/ETH in the node
    await prepareOperatorDistributionContract(setupData, newOperators.length + 1);

    console.log('Prepared new operators.');
    return [setupData, newOperators];
};