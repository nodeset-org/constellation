import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { expect } from 'chai';
import { Protocol, SetupData, Signers } from '../test';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { RocketPool } from '../test';
import { IMinipool, MockMinipool } from '../../typechain-types';
import { createMinipool, generateDepositData, generateDepositDataForStake, getMinipoolMinimumRPLStake } from '../rocketpool/_helpers/minipool';
import { nodeStakeRPL, registerNode } from '../rocketpool/_helpers/node';
import { mintRPL } from '../rocketpool/_helpers/tokens';
import { userDeposit } from '../rocketpool/_helpers/deposit';
import { ContractTransaction } from '@ethersproject/contracts';
import { Contract, EventFilter, utils } from 'ethers';

// optionally include the names of the accounts
export const printBalances = async (accounts: string[], opts: any = {}) => {
  const { names = [] } = opts;
  for (let i = 0; i < accounts.length; i++) {
    console.log(
      `Balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(accounts[i]))} at ${names.length > 0 ? names[i] : accounts[i]
      }`
    );
  }
};


export function computeKeccak256FromBytes32(bytes32String: string): string {
  // Computing the keccak256 hash directly from the Bytes32 string
  const hash = ethers.utils.keccak256(bytes32String);
  return hash;
}

export const printTokenBalances = async (accounts: string[], token: string, opts: any = {}) => {
  const { names = [] } = opts;
  const weth = await ethers.getContractAt('IWETH', token);
  for (let i = 0; i < accounts.length; i++) {
    console.log(
      `Token Balance: ${ethers.utils.formatEther(await weth.balanceOf(accounts[i]))} at ${names.length > 0 ? names[i] : accounts[i]
      }`
    );
  }
};

// given an object containing other objects that have addresses, print the balances of each address and the name of the object the address belongs to
export const printObjectBalances = async (obj: any) => {
  for (const key in obj) {
    await printBalances([obj[key].address], { names: [key] });
  }
};

export const printObjectTokenBalances = async (obj: any, tokenAddr: string) => {
  for (const key in obj) {
    await printTokenBalances([obj[key].address], tokenAddr, { names: [key] });
  }
};

// acceptableErrorMargin is a number between 0 and 1 to indicate the percentage of error that is acceptable
export const expectNumberE18ToBeApproximately = (
  actualBig: BigNumber,
  expectedBig: BigNumber,
  accpetableErrorMargin: number
) => {
  const actual = Number(ethers.utils.formatEther(actualBig));
  const expected = Number(ethers.utils.formatEther(expectedBig));

  const upperBound = expected * (1 + accpetableErrorMargin);
  const lowerBound = expected * (1 - accpetableErrorMargin);
  // handle case where expected is 0
  if (expected === 0) {
    expect(actual).to.be.within(-accpetableErrorMargin, accpetableErrorMargin);
    return;
  }

  expect(actual).to.be.within(lowerBound, upperBound);
};

export const evaluateModel = (x: number, k: number, m: number) => {
  // f(x) = maxValue * (e^(k*(x-1)) - e^-k) / (1 - e^-k)
  // Wow I forgot how easy math is in any other language than solidity, 1 line lol
  return (m * (Math.exp(k * (x - 1)) - Math.exp(-k))) / (1 - Math.exp(-k));
};

export const assertMultipleTransfers = async (
  tx: ContractTransaction,
  expectedTransfers: Array<{ from: string; to: string; value: BigNumber }>
) => {
  // Wait for the transaction to be mined
  const receipt = await tx.wait();

  // Ensure events are defined or default to an empty array
  const events = receipt.events ?? [];

  // Filter for all Transfer events
  const transferEvents = events.filter((event) => event.event === 'Transfer');

  // Check if there's at least one Transfer event
  expect(transferEvents, 'No Transfer events found').to.be.an('array').that.is.not.empty;

  // Iterate over expected transfers and match them with actual transfers
  let foundTransfers = [];
  for (const expectedTransfer of expectedTransfers) {
    const match = transferEvents.find((event) => {
      const { from, to, value } = event.args as any;
      return from === expectedTransfer.from && to === expectedTransfer.to && value.eq(expectedTransfer.value);
    });

    if (match) {
      foundTransfers.push(match);
    }
  }

  // If the number of found transfers does not match the expected number, print details of all transfers
  if (foundTransfers.length !== expectedTransfers.length) {
    console.log('Not all expected Transfers were matched. Actual Transfer events:');
    console.table(
      transferEvents.map((event) => ({
        from: event.args!.from,
        to: event.args!.to,
        value: event.args!.value.toString(),
      }))
    );
    expect.fail('Not all expected Transfers did not match');
  }
};

export const assertSingleTransferExists = async (
  tx: ContractTransaction,
  expectedFrom: string,
  expectedTo: string,
  expectedValue: BigNumber
) => {
  // Wait for the transaction to be mined
  const receipt = await tx.wait();

  // Ensure events are defined or default to an empty array
  const events = receipt.events ?? [];

  // Filter for all Transfer events
  const transferEvents = events.filter((event) => event.event === 'Transfer');

  // Check if there's at least one Transfer event
  expect(transferEvents, 'No Transfer events found').to.be.an('array').that.is.not.empty;

  // Track if the expected Transfer event is found
  let isExpectedTransferFound = false;

  // Store details of all transfers for pretty printing if needed
  const allTransfers = [];

  for (const transferEvent of transferEvents) {
    const { from, to, value } = transferEvent.args as any;
    allTransfers.push({ from, to, value: value.toString() });

    // Check if this event matches the expected values
    if (from === expectedFrom && to === expectedTo && value.toString() === expectedValue.toString()) {
      if (isExpectedTransferFound) {
        // Found more than one matching Transfer event, which is not expected
        expect.fail('Multiple Transfer events match the expected values');
      }
      isExpectedTransferFound = true;
    }
  }

  // If expected Transfer event is not found, pretty print all transfers
  if (!isExpectedTransferFound) {
    console.log('No Transfer event matched the expected values. All Transfer events:');
    console.table(allTransfers);
    expect.fail('Expected Transfer event not found');
  }
};

export async function deployMinipool(setupData: SetupData, bondValue: BigNumber) {
  const salt = 3;

  const depositData = await generateDepositData(setupData.protocol.superNode.address, salt);

  const config = {
    timezoneLocation: 'Australia/Brisbane',
    bondAmount: bondValue,
    minimumNodeFee: 0,
    validatorPubkey: depositData.depositData.pubkey,
    validatorSignature: depositData.depositData.signature,
    depositDataRoot: depositData.depositDataRoot,
    salt: salt,
    expectedMinipoolAddress: depositData.minipoolAddress,
  };
  console.log('fdasdfa;as');

  const { sig, timestamp } = await approveHasSignedExitMessageSig(
    setupData,
    '0x' + config.expectedMinipoolAddress,
    config.salt
  );

  // can probz delete this line
  //const proxyVAAddr = await setupData.protocol.superNode.connect(setupData.signers.hyperdriver).callStatic.createMinipool(config,sig, {
  //    value: ethers.utils.parseEther("1")
  //})

  console.log('aljsdf;as');
  await setupData.protocol.superNode.connect(setupData.signers.hyperdriver).createMinipool(config.validatorPubkey, config.validatorSignature, config.depositDataRoot, config.salt, config.expectedMinipoolAddress, timestamp, sig, { value: ethers.utils.parseEther('1') });

  console.log('aljsdf;as');

  return config.expectedMinipoolAddress;
}

export async function deployRPMinipool(
  signer: SignerWithAddress,
  rocketPool: RocketPool,
  signers: Signers,
  bondValue: BigNumber
) {
  await registerNode({ from: signer.address });

  // Stake RPL to cover minipools
  let minipoolRplStake = await getMinipoolMinimumRPLStake();
  let rplStake = ethers.BigNumber.from(minipoolRplStake.toString()).mul(3);
  rocketPool.rplContract.connect(signers.rplWhale).transfer(signer.address, rplStake);
  await nodeStakeRPL(rplStake, { from: signer.address });

  const mockMinipool = await createMinipool({
    from: signer.address,
    value: bondValue,
  });

  await userDeposit({ from: signer.address, value: bondValue });

  let scrubPeriod = 60 * 60 * 24; // 24 hours

  return await ethers.getContractAt('RocketMinipoolInterface', mockMinipool.address);
}

export async function upgradePriceFetcherToMock(signers: Signers, protocol: Protocol, price: BigNumber) {
  const mockPriceFetcherFactory = await ethers.getContractFactory('MockPriceFetcher');
  const mockPriceFetcher = await mockPriceFetcherFactory.deploy();
  await mockPriceFetcher.deployed();

  const lastPrice = await protocol.priceFetcher.getPrice();

  await protocol.priceFetcher.connect(signers.admin).upgradeTo(mockPriceFetcher.address);

  const priceFetcherV2 = await ethers.getContractAt('MockPriceFetcher', protocol.priceFetcher.address);
  await priceFetcherV2.setPrice(price);

  return lastPrice;
}

export async function printEventDetails(tx: ContractTransaction, contract: Contract): Promise<void> {
  const receipt = await tx.wait();

  if (receipt.events) {
    for (let i = 0; i < receipt.events.length; i++) {
      const event = receipt.events[i];
      if (event.event && event.args) {
        // Check if event name and args are available
        console.log(`Event Name: ${event.event}`);
        console.log('Arguments:');
        // Ensure event.args is defined before accessing its properties
        if (event.args) {
          Object.keys(event.args)
            .filter((key) => isNaN(parseInt(key))) // Filter out numeric keys
            .forEach((key) => {
              console.log(`  ${key}: ${event.args![key]}`);
            });
        }
      } else if (event.topics && event.topics.length > 0) {
        // Decode the raw log
        try {
          const eventDescription = contract.interface.getEvent(event.topics[0]);
          console.log(`Event Name: ${eventDescription.name}`);
          const decodedData = contract.interface.decodeEventLog(eventDescription, event.data, event.topics);
          if (decodedData) {
            console.log('Arguments:');
            Object.keys(decodedData).forEach((key) => {
              console.log(`  ${key}: ${decodedData[key]}`);
            });
          }
        } catch (e) {
          console.log('Uh oh, error occured printing events due to manual decoding :(');
        }
      }
    }
  }
}

export async function predictDeploymentAddress(address: string, factoryNonceOffset: number): Promise<string> {
  return ethers.utils.getContractAddress({ from: address, nonce: factoryNonceOffset });
}

export async function increaseEVMTime(seconds: number) {
  // Sending the evm_increaseTime request
  await ethers.provider.send('evm_increaseTime', [seconds]);

  // Mining a new block to apply the EVM time change
  await ethers.provider.send('evm_mine', []);
}

export const registerNewValidator = async (setupData: SetupData, subNodeOperators: SignerWithAddress[]) => {
  const requiredEth = ethers.utils.parseEther('8').mul(subNodeOperators.length);
  if ((await setupData.protocol.operatorDistributor.balanceEth()).lt(requiredEth)) {
    throw new Error(
      `Not enough eth in operatorDistributor contract to register ${subNodeOperators.length
      } validators. Required ${ethers.utils.formatEther(requiredEth)} eth but only have ${ethers.utils.formatEther(
        await setupData.protocol.operatorDistributor.balanceEth()
      )} eth`
    );
  }

  const { protocol, signers } = setupData;

  const bond = await setupData.protocol.superNode.bond();

  // if (!(await protocol.superNode.hasSufficientLiquidity(bond.mul(subNodeOperators.length)))) {
  //   console.log('not enough liquidity for ', subNodeOperators.length, ' calling prepareOperatorDistributionContract');
  //   await prepareOperatorDistributionContract(setupData, subNodeOperators.length);
  // }

  // console.log('ETH balance of OD', await ethers.provider.getBalance(protocol.operatorDistributor.address)); // 17.46 ether
  // console.log('RPL balance of OD', await setupData.rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)); // 720 RPL
  // console.log('There is enough liquidity for', subNodeOperators.length);
  
  const minipools = []
  for (let i = 0; i < subNodeOperators.length; i++) {
    console.log('setting up node operator %s of %s', i + 1, subNodeOperators.length);
    console.log('ETH balance of OD', await ethers.provider.getBalance(protocol.operatorDistributor.address));
    if (!(await protocol.superNode.hasSufficientLiquidity(bond))) {
      console.log('not enough liquidity for ', subNodeOperators.length, ' calling prepareOperatorDistributionContract');
      await prepareOperatorDistributionContract(setupData, 1);
    }
    console.log('sufficient liquidity for node operator %s of %s', i + 1, subNodeOperators.length);
    const nodeOperator = subNodeOperators[i];
    const salt = i;

    if (!(await protocol.whitelist.getIsAddressInWhitelist(nodeOperator.address))) {
      await assertAddOperator(setupData, nodeOperator);
    }

    const depositData = await generateDepositData(protocol.superNode.address, salt);

    const config = {
      timezoneLocation: 'Australia/Brisbane',
      bondAmount: bond,
      minimumNodeFee: 0,
      validatorPubkey: depositData.depositData.pubkey,
      validatorSignature: depositData.depositData.signature,
      depositDataRoot: depositData.depositDataRoot,
      salt: salt,
      expectedMinipoolAddress: depositData.minipoolAddress,
    };

    minipools.push(depositData.minipoolAddress)

    await setupData.rocketPool.rocketDepositPoolContract.deposit({
      value: ethers.utils.parseEther('32'),
    });
    await setupData.rocketPool.rocketDepositPoolContract.assignDeposits();

    const { sig, timestamp } = await approveHasSignedExitMessageSig(
      setupData,
      '0x' + config.expectedMinipoolAddress,
      config.salt
    );
    console.log('ETH balance of OD before create for operator ', i, await ethers.provider.getBalance(protocol.operatorDistributor.address));
    console.log('RPL balance of OD before create operator ', i, await setupData.rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address));
    await protocol.superNode
      .connect(nodeOperator)
      .createMinipool(config.validatorPubkey, config.validatorSignature, config.depositDataRoot, config.salt, config.expectedMinipoolAddress, timestamp, sig, { value: ethers.utils.parseEther('1') });

    // Simulate the passage of a day
    const oneDayInSeconds = 24 * 60 * 60;
    const nextBlockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + oneDayInSeconds;
    await ethers.provider.send('evm_setNextBlockTimestamp', [nextBlockTimestamp]);
    await ethers.provider.send('evm_mine', []); // Mine a block to apply the new timestamp

    // enter stake mode
    const depositDataStake = await generateDepositDataForStake(config.expectedMinipoolAddress);
    console.log("trying.....", depositDataStake.depositData.signature);
    await protocol.superNode.connect(nodeOperator).stake(depositDataStake.depositData.signature, depositDataStake.depositDataRoot, config.expectedMinipoolAddress);
    console.log("finsihed...", depositDataStake.depositData.signature);
  }

  return minipools;
};

export const approveHasSignedExitMessageSig = async (
  setupData: SetupData,
  expectedMinipoolAddress: string,
  salt: number
) => {
  const goodSigner = setupData.signers.adminServer;
  const role = await setupData.protocol.directory.hasRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_SERVER_ROLE')),
    goodSigner.address
  );
  expect(role).equals(true);

  const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;

  const packedData = ethers.utils.solidityPack(
    ['address', 'uint256', 'uint256', 'address', 'uint256'],
    [expectedMinipoolAddress, salt, timestamp, setupData.protocol.superNode.address, chainId]
  );

  const messageHash = ethers.utils.keccak256(packedData);
  const messageHashBytes = ethers.utils.arrayify(messageHash);
  const sig = await goodSigner.signMessage(messageHashBytes);
  return { sig, timestamp };
};

export const whitelistUserServerSig = async (setupData: SetupData, nodeOperator: SignerWithAddress) => {
  const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;

  const goodSigner = setupData.signers.adminServer;
  const role = await setupData.protocol.directory.hasRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_SERVER_ROLE')),
    goodSigner.address
  );
  expect(role).equals(true);
  const packedData = ethers.utils.solidityPack(
    ['address', 'uint256', 'address', 'uint256'],
    [nodeOperator.address, timestamp, setupData.protocol.whitelist.address, chainId]
  );
  const messageHash = ethers.utils.keccak256(packedData);
  const messageHashBytes = ethers.utils.arrayify(messageHash);
  const sig = await goodSigner.signMessage(messageHashBytes);
  return { sig, timestamp };
};

export const assertAddOperator = async (setupData: SetupData, nodeOperator: SignerWithAddress) => {
  const { sig, timestamp } = await whitelistUserServerSig(setupData, nodeOperator);
  console.log("expect address is NOT in whitelist");
  expect(await setupData.protocol.whitelist.getIsAddressInWhitelist(nodeOperator.address)).equals(false);
  await setupData.protocol.whitelist
    .connect(setupData.signers.adminServer)
    .addOperator(nodeOperator.address, timestamp, sig);
  console.log("expect address IS in whitelist");
  expect(await setupData.protocol.whitelist.getIsAddressInWhitelist(nodeOperator.address)).equals(true);
};

export const badAutWhitelistUserServerSig = async (setupData: SetupData, nodeOperator: SignerWithAddress) => {
  const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;

  const badSigner = setupData.signers.random5;
  const role = await setupData.protocol.directory.hasRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_SERVER_ROLE')),
    badSigner.address
  );
  expect(role).equals(false);
  const packedData = ethers.utils.solidityPack(
    ['address', 'uint256', 'address', 'uint256'],
    [nodeOperator.address, timestamp, setupData.protocol.whitelist.address, chainId]
  );
  const messageHash = ethers.utils.keccak256(packedData);
  const messageHashBytes = ethers.utils.arrayify(messageHash);
  const sig = await badSigner.signMessage(messageHashBytes);
  return { sig, timestamp };
};

// Deprecated: Don't use
export const registerNewValidatorDeprecated = async (setupData: SetupData, nodeOperators: SignerWithAddress[]) => {
  // one currently needs 8 eth in the operatorDistribution contract to register a validator for each node operator
  const requiredEth = ethers.utils.parseEther('8').mul(nodeOperators.length);
  if ((await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address)).lt(requiredEth)) {
    throw new Error(
      `Not enough eth in operatorDistributor contract to register ${nodeOperators.length
      } validators. Required ${ethers.utils.formatEther(requiredEth)} eth but only have ${ethers.utils.formatEther(
        await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address)
      )} eth`
    );
  }

  const bondValue = ethers.utils.parseEther('8');
  const rocketPool = setupData.rocketPool;

  for (let i = 0; i < nodeOperators.length; i++) {
    const nodeOperator = nodeOperators[i];

    const mockMinipool = await deployRPMinipool(nodeOperator, rocketPool, setupData.signers, bondValue);

    await rocketPool.rockStorageContract
      .connect(nodeOperator)
      .setWithdrawalAddress(nodeOperator.address, setupData.protocol.depositPool.address, true);

    // NO sets smoothing pool registration state to true
    await rocketPool.rocketNodeManagerContract.connect(nodeOperator).setSmoothingPoolRegistrationState(true);

    // admin needs to kyc the node operator and register them in the whitelist if they aren't already
    if (!(await setupData.protocol.whitelist.getIsAddressInWhitelist(nodeOperator.address))) {
      await assertAddOperator(setupData, nodeOperator);
    }

    // admin will sign mockMinipool's address via signMessage
    const encodedMinipoolAddress = ethers.utils.defaultAbiCoder.encode(['address'], [mockMinipool.address]);
    const mockMinipoolAddressHash = ethers.utils.keccak256(encodedMinipoolAddress);
    const mockMinipoolAddressHashBytes = ethers.utils.arrayify(mockMinipoolAddressHash);
    const sig = await setupData.signers.adminServer.signMessage(mockMinipoolAddressHashBytes);

    // admin will reimburse the node operator for the minipool
    let operatorData = await setupData.protocol.whitelist.getOperatorAtAddress(nodeOperator.address);
    const lastCount = operatorData.currentValidatorCount;
    //await setupData.protocol.operatorDistributor.connect(setupData.signers.admin).reimburseNodeForMinipool(sig, mockMinipool.address);
    // FUNCTION DNE
    operatorData = await setupData.protocol.whitelist.getOperatorAtAddress(nodeOperator.address);
    expect(operatorData.currentValidatorCount).to.equal(lastCount + 1);
  }
};

export async function prepareOperatorDistributionContract(setupData: SetupData, numOperators: Number) {
  const vweth = setupData.protocol.vCWETH;
  let depositAmount = ethers.utils.parseEther('8').mul(BigNumber.from(numOperators));
  depositAmount = depositAmount.sub(await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address));
  const vaultMinimum = await vweth.getRequiredCollateralAfterDeposit(depositAmount);

  console.log('REQUIRE COLLAT', vaultMinimum);
  const requiredEth = depositAmount
    .add(vaultMinimum)
    .mul((await setupData.protocol.vCWETH.liquidityReserveRatio()).mul(10))
    .div(ethers.utils.parseUnits('1', 5))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 2)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 3)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 4)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 5)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 6)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 7)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 8)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 9)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 10)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 11)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 12)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 13)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 14)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 15)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 16)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 17)))
    .add(depositAmount.div(ethers.utils.parseUnits("1", 18)))
    .add(ethers.constants.One)
  console.log('REQUIRE+ETH', requiredEth);

  await setupData.protocol.wETH.connect(setupData.signers.ethWhale).deposit({ value: requiredEth });
  await setupData.protocol.wETH.connect(setupData.signers.ethWhale).approve(setupData.protocol.vCWETH.address, requiredEth);
  await setupData.protocol.vCWETH.connect(setupData.signers.ethWhale).deposit(requiredEth, setupData.signers.ethWhale.address);
  
  /*
  await setupData.protocol.depositPool.connect(protocolSigner).openGate();
  await setupData.signers.admin.sendTransaction({
    to: setupData.protocol.operatorDistributor.address,
    value: requiredEth,
  });

  await setupData.protocol.depositPool.connect(protocolSigner).onRewardsRecieved(requiredEth)

  await setupData.protocol.depositPool.connect(protocolSigner).closeGate();
  await setupData.protocol.depositPool.connect(protocolSigner).sendEthToDistributors();
  await setupData.protocol.depositPool.connect(protocolSigner).sendRplToDistributors(); */
  

  // send eth to the rocketpool deposit contract (mint rETH to signers[0])
  
  const rplRequired = await setupData.protocol.operatorDistributor.calculateRplStakeShortfall(0, (ethers.utils.parseEther("32").mul(BigNumber.from(numOperators))).sub(depositAmount));
  console.log('rplRequired', rplRequired);
  const protocolSigner = setupData.signers.protocolSigner;
  await setupData.rocketPool.rplContract.connect(setupData.signers.rplWhale).transfer(setupData.protocol.operatorDistributor.address, rplRequired);
  await setupData.protocol.operatorDistributor.connect(protocolSigner).onRplBalanceIncrease(rplRequired)
  
  return requiredEth;
}

export async function getNextContractAddress(signer: SignerWithAddress, offset = 0) {
  // Get current nonce of the signer
  const nonce = (await signer.getTransactionCount()) + offset;

  // Prepare the RLP encoded structure of the to-be-deployed contract
  const rlpEncoded = require('rlp').encode([signer.address, nonce]);

  // Calculate the hash
  const contractAddressHash = ethers.utils.keccak256(rlpEncoded);

  // The last 20 bytes of this hash are the address
  const contractAddress = '0x' + contractAddressHash.slice(-40);

  return contractAddress;
}

export async function getNextFactoryContractAddress(factoryAddress: string, factoryNonce: number) {
  // RLP encode the factory address and nonce
  const rlpEncoded = ethers.utils.solidityPack(['address', 'uint256'], [factoryAddress, factoryNonce]);

  // Calculate the hash
  const contractAddressHash = ethers.utils.keccak256(rlpEncoded);

  // The last 20 bytes of this hash are the address
  const contractAddress = '0x' + contractAddressHash.slice(-40);

  return contractAddress;
}

export async function getEventNames(tx: ContractTransaction, contract: Contract): Promise<string[]> {
  let emittedEvents: string[] = [];
  let emittedArgs: any[] = [];

  const receipt = await tx.wait();

  if (receipt.events) {
    for (let i = 0; i < receipt.events.length; i++) {
      const event = receipt.events[i];
      if (event.event) {
        // Check if event name is available
        emittedEvents.push(event.event);
      } else if (event.topics && event.topics.length > 0) {
        // Decode the raw log
        const eventDescription = contract.interface.getEvent(event.topics[0]);
        emittedEvents.push(eventDescription.name);
        const decodedData = contract.interface.decodeEventLog(eventDescription, event.data, event.topics);
        emittedArgs.push(decodedData);
      }
    }
  }

  return emittedEvents;
}
