import { NewOperator, SetupData } from '../../../test/test';
import { whitelistUserServerSig } from "../../../test/utils/utils";

export const setupEachOperator = async ([setupData, newOperators]: [SetupData, NewOperator[]]): Promise<[SetupData, NewOperator[]]> => {
    console.log('Setting up the operators...');
    await Promise.all(newOperators.map(getOperatorSetupIterator(setupData)));
    console.log('Operator setup complete.');
    return [setupData, newOperators];
}


const getOperatorSetupIterator = (setupData: SetupData) => async (operator: NewOperator) => {
    const {
      protocol,
      rocketPool,
      signers: { adminServer, rplWhale, admin },
    } = setupData;
  
    console.log('Setting up operator: ', operator.signer.address);

    const whitelistResult = await whitelistUserServerSig(setupData, operator.signer);
    console.log('gets whitelistResult');
    await protocol.whitelist
    .connect(adminServer)
    .addOperator(operator.signer.address, whitelistResult.timestamp, whitelistResult.sig);
    
    const amountToBeStaked = ethers.utils.parseUnits('1000', await rocketPool.rplContract.decimals());
    console.log('amount of RPL to be staked', amountToBeStaked);
    
    await rocketPool.rplContract.connect(rplWhale).transfer(protocol.depositPool.address, amountToBeStaked);
    
    await protocol.depositPool.connect(admin).stakeRPLFor(protocol.superNode.address, amountToBeStaked);
    
    console.log('transferred and staked RPL', amountToBeStaked);

    const res = await protocol.superNode
    .connect(operator.signer)
    .createMinipool({
        depositDataRoot: operator.depositDataRoot,
        expectedMinipoolAddress: operator.expectedMinipoolAddress,
        salt: operator.salt,
        validatorPubkey: operator.depositData.pubkey,
        validatorSignature: operator.depositData.signature,

    }, operator.exitMessageSignature.timestamp, operator.exitMessageSignature.sig, {
        value: ethers.utils.parseEther('1'),
        gasLimit: 2184148*5 // TODO: figure out why this is needed. Was hitting gas limit here
    },
  ).then(
      (res) => {
        console.log('Finished setting up operator: ', operator.signer.address);
        return res;
      }
    );

    const a = await res.wait();

    console.log('gas used to create minipool', a.gasUsed.toString())

    return res;
};