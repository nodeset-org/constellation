import { NewOperator, SetupData } from '../../../test/test';
import { approveHasSignedExitMessageSig, whitelistUserServerSig } from "../../../test/utils/utils";

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
  
    const whitelistResult = await whitelistUserServerSig(setupData, operator.signer);
  
    await protocol.whitelist
      .connect(adminServer)
      .addOperator(operator.signer.address, whitelistResult.timestamp, whitelistResult.sig);
  
    const amountToBeStaked = ethers.utils.parseUnits('1000', await rocketPool.rplContract.decimals());
  
    await rocketPool.rplContract.connect(rplWhale).transfer(protocol.depositPool.address, amountToBeStaked);
  
    await protocol.depositPool.connect(admin).stakeRPLFor(protocol.superNode.address, amountToBeStaked);
    
    
    
    await protocol.superNode
    .connect(operator.signer)
    .createMinipool({
        bondAmount: operator.bondValue,
        depositDataRoot: operator.depositDataRoot,
        expectedMinipoolAddress: operator.expectedMinipoolAddress,
        salt: operator.salt,
        minimumNodeFee: operator.minimumNodeFee,
        timezoneLocation: operator.timezoneLocation,
        validatorPubkey: operator.depositData.pubkey,
        validatorSignature: operator.depositData.signature,

    }, operator.exitMessageSignature.timestamp, operator.exitMessageSignature.sig, {
        value: ethers.utils.parseEther('1'),
    });
};