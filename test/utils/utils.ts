import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { Protocol, SetupData, Signers } from "../test";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { RocketPool } from "../test";
import { IMinipool, MockMinipool } from "../../typechain-types";
import { createMinipool, generateDepositData, getMinipoolMinimumRPLStake } from "../rocketpool/_helpers/minipool";
import { nodeStakeRPL, registerNode } from "../rocketpool/_helpers/node";
import { mintRPL } from "../rocketpool/_helpers/tokens";
import { userDeposit } from "../rocketpool/_helpers/deposit";
import { ContractTransaction } from "@ethersproject/contracts";
import { Contract, EventFilter, utils } from 'ethers';

// optionally include the names of the accounts
export const printBalances = async (accounts: string[], opts: any = {}) => {
    const { names = [] } = opts;
    for (let i = 0; i < accounts.length; i++) {
        console.log(`Balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(accounts[i]))} at ${names.length > 0 ? names[i] : accounts[i]}`);
    }
};

export const printTokenBalances = async (accounts: string[], token: string, opts: any = {}) => {
    const { names = [] } = opts;
    const weth = await ethers.getContractAt("IWETH", token);
    for (let i = 0; i < accounts.length; i++) {
        console.log(`Token Balance: ${ethers.utils.formatEther(await weth.balanceOf(accounts[i]))} at ${names.length > 0 ? names[i] : accounts[i]}`);

    }
};

// given an object containing other objects that have addresses, print the balances of each address and the name of the object the address belongs to
export const printObjectBalances = async (obj: any) => {
    for (const key in obj) {
        await printBalances([obj[key].address], { names: [key] });
    }
}

export const printObjectTokenBalances = async (obj: any, tokenAddr: string) => {
    for (const key in obj) {
        await printTokenBalances([obj[key].address], tokenAddr, { names: [key] });
    }
}

// acceptableErrorMargin is a number between 0 and 1 to indicate the percentage of error that is acceptable
export const expectNumberE18ToBeApproximately = (actualBig: BigNumber, expectedBig: BigNumber, accpetableErrorMargin: number) => {

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
}

export const evaluateModel = (x: number, k: number, m: number) => {
    // f(x) = maxValue * (e^(k*(x-1)) - e^-k) / (1 - e^-k)
    // Wow I forgot how easy math is in any other language than solidity, 1 line lol
    return (m * (Math.exp(k * (x - 1)) - Math.exp(-k))) / (1 - Math.exp(-k));
};

export const assertMultipleTransfers = async (
    tx: ContractTransaction,
    expectedTransfers: Array<{ from: string, to: string, value: BigNumber }>
) => {
    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Ensure events are defined or default to an empty array
    const events = receipt.events ?? [];

    // Filter for all Transfer events
    const transferEvents = events.filter(event => event.event === "Transfer");

    // Check if there's at least one Transfer event
    expect(transferEvents, "No Transfer events found").to.be.an('array').that.is.not.empty;

    // Iterate over expected transfers and match them with actual transfers
    let foundTransfers = [];
    for (const expectedTransfer of expectedTransfers) {
        const match = transferEvents.find(event => {
            const { from, to, value } = event.args as any;
            return from === expectedTransfer.from && to === expectedTransfer.to && value.eq(expectedTransfer.value);
        });

        if (match) {
            foundTransfers.push(match);
        }
    }

    // If the number of found transfers does not match the expected number, print details of all transfers
    if (foundTransfers.length !== expectedTransfers.length) {
        console.log("Not all expected Transfers were matched. Actual Transfer events:");
        console.table(transferEvents.map(event => ({
            from: event.args!.from,
            to: event.args!.to,
            value: event.args!.value.toString()
        })));
        expect.fail("Not all expected Transfers did not match");
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
    const transferEvents = events.filter(event => event.event === "Transfer");

    // Check if there's at least one Transfer event
    expect(transferEvents, "No Transfer events found").to.be.an('array').that.is.not.empty;

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
                expect.fail("Multiple Transfer events match the expected values");
            }
            isExpectedTransferFound = true;
        }
    }

    // If expected Transfer event is not found, pretty print all transfers
    if (!isExpectedTransferFound) {
        console.log("No Transfer event matched the expected values. All Transfer events:");
        console.table(allTransfers);
        expect.fail("Expected Transfer event not found");
    }
};



export async function deployValidatorAccount(signer: SignerWithAddress, protocol: Protocol, signers: Signers, bondValue: BigNumber) {
    const salt = 3;

    const nextAddress = "0xD9bf496401781cc411AE0F465Fe073872A50D639";
    const depositData = await generateDepositData(nextAddress, salt);

    const config = {
        timezoneLocation: 'Australia/Brisbane',
        bondAmount: bondValue,
        minimumNodeFee: 0,
        validatorPubkey: depositData.depositData.pubkey,
        validatorSignature: depositData.depositData.signature,
        depositDataRoot: depositData.depositDataRoot,
        salt: salt,
        expectedMinipoolAddress: depositData.minipoolAddress
    }

    const proxyVAAddr = await protocol.validatorAccountFactory.connect(signers.hyperdriver).callStatic.createNewValidatorAccount(config, nextAddress, {
        value: ethers.utils.parseEther("1")
    })

    await protocol.validatorAccountFactory.connect(signers.hyperdriver).createNewValidatorAccount(config, nextAddress, {
        value: ethers.utils.parseEther("1")
    })

    return proxyVAAddr;
}


export async function deployRPMinipool(signer: SignerWithAddress, rocketPool: RocketPool, signers: Signers, bondValue: BigNumber) {
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

    let scrubPeriod = (60 * 60 * 24); // 24 hours


    return await ethers.getContractAt("RocketMinipoolInterface", mockMinipool.address);
}

export async function upgradePriceFetcherToMock(signers: Signers, protocol: Protocol, price: BigNumber) {
    const mockPriceFetcherFactory = await ethers.getContractFactory("MockPriceFetcher");
    const mockPriceFetcher = await mockPriceFetcherFactory.deploy();
    await mockPriceFetcher.deployed();

    await protocol.priceFetcher.connect(signers.admin).upgradeTo(mockPriceFetcher.address);

    const priceFetcherV2 = await ethers.getContractAt("MockPriceFetcher", protocol.priceFetcher.address);
    await priceFetcherV2.setPrice(price);
};

export async function printEventDetails(tx: ContractTransaction, contract: Contract): Promise<void> {
    const receipt = await tx.wait();

    if (receipt.events) {
        for (let i = 0; i < receipt.events.length; i++) {
            const event = receipt.events[i];
            if (event.event && event.args) { // Check if event name and args are available
                console.log(`Event Name: ${event.event}`);
                console.log("Arguments:");
                // Ensure event.args is defined before accessing its properties
                if (event.args) {
                    Object.keys(event.args)
                        .filter(key => isNaN(parseInt(key))) // Filter out numeric keys
                        .forEach(key => {
                            console.log(`  ${key}: ${event.args![key]}`);
                        });
                }
            } else if (event.topics && event.topics.length > 0) { // Decode the raw log
                const eventDescription = contract.interface.getEvent(event.topics[0]);
                console.log(`Event Name: ${eventDescription.name}`);
                const decodedData = contract.interface.decodeEventLog(eventDescription, event.data, event.topics);
                if (decodedData) {
                    console.log("Arguments:");
                    Object.keys(decodedData).forEach(key => {
                        console.log(`  ${key}: ${decodedData[key]}`);
                    });
                }
            }
        }
    }
}
/**
* Counts the `ProxyCreated` events emitted by the ValidatorAccountFactory contract.
* @param provider The Ethereum provider.
* @returns The number of `ProxyCreated` events.
*/
export async function countProxyCreatedEvents(setupData: SetupData): Promise<number> {
    const events = await setupData.protocol.validatorAccountFactory.queryFilter(setupData.protocol.validatorAccountFactory.filters.ProxyCreated());
    return events.length;
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

export const registerNewValidator = async (setupData: SetupData, nodeOperators: SignerWithAddress[]) => {
    const requiredEth = ethers.utils.parseEther("8").mul(nodeOperators.length);
    if ((await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address)).lt(requiredEth)) {
        throw new Error(`Not enough eth in operatorDistributor contract to register ${nodeOperators.length} validators. Required ${ethers.utils.formatEther(requiredEth)} eth but only have ${ethers.utils.formatEther(await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address))} eth`);
    }

    const { protocol, signers } = setupData;

    for(let i = 0; i < nodeOperators.length; i++) {
        console.log("setting up node operator %s of %s", i+1, nodeOperators.length)
        const nodeOperator = nodeOperators[i];

        const bond = ethers.utils.parseEther("8");
        const salt = i;
    
        //expect(await protocol.validatorAccountFactory.hasSufficentLiquidity(bond)).equals(false);
        await prepareOperatorDistributionContract(setupData, 2);
        //expect(await protocol.validatorAccountFactory.hasSufficentLiquidity(bond)).equals(true);
    
        if(!(await protocol.whitelist.getIsAddressInWhitelist(nodeOperator.address))) {
            await protocol.whitelist.connect(signers.admin).addOperator(nodeOperator.address);
        }
        
        const deploymentCount = await countProxyCreatedEvents(setupData);
        const nextAddress = await predictDeploymentAddress(protocol.validatorAccountFactory.address, deploymentCount + 1)
        const depositData = await generateDepositData(nextAddress, salt);
    
        const config = {
            timezoneLocation: 'Australia/Brisbane',
            bondAmount: bond,
            minimumNodeFee: 0,
            validatorPubkey: depositData.depositData.pubkey,
            validatorSignature: depositData.depositData.signature,
            depositDataRoot: depositData.depositDataRoot,
            salt: salt,
            expectedMinipoolAddress: depositData.minipoolAddress
        }
    
        await protocol.validatorAccountFactory.connect(nodeOperator).createNewValidatorAccount(config, nextAddress, {
            value: ethers.utils.parseEther("1")
        })
    
        expect(await protocol.directory.hasRole(ethers.utils.id("FACTORY_ROLE"), protocol.validatorAccountFactory.address)).equals(true)
        expect(await protocol.directory.hasRole(ethers.utils.id("CORE_PROTOCOL_ROLE"), protocol.validatorAccountFactory.address)).equals(true)
        expect(await protocol.directory.hasRole(ethers.utils.id("CORE_PROTOCOL_ROLE"), nextAddress)).equals(true)

        await setupData.rocketPool.rocketDepositPoolContract.deposit({
            value:ethers.utils.parseEther("32")
        })
		await setupData.rocketPool.rocketDepositPoolContract.assignDeposits();

        // waits 32 days which could be a problem for other tests
        await increaseEVMTime(60 * 60 * 24 * 7 * 32);

        // enter stake mode
        const validatorAccount = await ethers.getContractAt("ValidatorAccount", nextAddress);
        await validatorAccount.stake();
    }
} 

// Deprecated: Don't use
export const registerNewValidatorDeprecated = async (setupData: SetupData, nodeOperators: SignerWithAddress[]) => {

    // one currently needs 8 eth in the operatorDistribution contract to register a validator for each node operator
    const requiredEth = ethers.utils.parseEther("8").mul(nodeOperators.length);
    if ((await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address)).lt(requiredEth)) {
        throw new Error(`Not enough eth in operatorDistributor contract to register ${nodeOperators.length} validators. Required ${ethers.utils.formatEther(requiredEth)} eth but only have ${ethers.utils.formatEther(await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address))} eth`);
    }

    const bondValue = ethers.utils.parseEther("8");
    const rocketPool = setupData.rocketPool;

    for (let i = 0; i < nodeOperators.length; i++) {
        const nodeOperator = nodeOperators[i];

        const mockMinipool = await deployRPMinipool(nodeOperator, rocketPool, setupData.signers, bondValue);

        await rocketPool.rockStorageContract.connect(nodeOperator).setWithdrawalAddress(nodeOperator.address, setupData.protocol.depositPool.address, true);

        // NO sets smoothing pool registration state to true
        await rocketPool.rocketNodeManagerContract.connect(nodeOperator).setSmoothingPoolRegistrationState(true);

        // admin needs to kyc the node operator and register them in the whitelist if they aren't already
        if (!(await setupData.protocol.whitelist.getIsAddressInWhitelist(nodeOperator.address))) {
            await setupData.protocol.whitelist.connect(setupData.signers.admin).addOperator(nodeOperator.address);
        }

        // admin will sign mockMinipool's address via signMessage
        const encodedMinipoolAddress = ethers.utils.defaultAbiCoder.encode(["address"], [mockMinipool.address]);
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

// TODO: Make sure the minimums are actaully met. 
// WARNING: This function does not work as exepcted, WARNING!!! it just sends more eth than required to {::} & RP
export async function prepareOperatorDistributionContract(setupData: SetupData, numOperators: Number) {
    const vweth = setupData.protocol.vCWETH;
    const depositAmount = ethers.utils.parseEther("8").mul(BigNumber.from(numOperators));
    const vaultMinimum = await vweth.getRequiredCollateralAfterDeposit(depositAmount);

    // await setupData.protocol.wETH.connect(setupData.signers.ethWhale).deposit({ value: vaultMinimum });
    // await setupData.protocol.wETH.connect(setupData.signers.ethWhale).approve(setupData.protocol.vCWETH.address, vaultMinimum);
    // await setupData.protocol.vCWETH.connect(setupData.signers.ethWhale).deposit(vaultMinimum, setupData.signers.ethWhale.address);

    // sends 8 * numOperators eth to operatorDistribution contract * fee split due to fallback usage
    console.log("REQUIRE COLLAT", vaultMinimum)
    const requiredEth = depositAmount.add(vaultMinimum).mul(ethers.utils.parseUnits("1.1", 5)).div(ethers.utils.parseUnits("1", 5));
    console.log("REQUIRE+ETH", requiredEth);
    await setupData.signers.admin.sendTransaction({
        to: setupData.protocol.operatorDistributor.address,
        value: requiredEth
    });

    // send eth to the rocketpool deposit contract (mint rETH to signers[0])
    

    const rplRequried = await setupData.protocol.operatorDistributor.calculateRequiredRplTopUp(0, requiredEth);
    await setupData.rocketPool.rplContract.connect(setupData.signers.rplWhale).transfer(setupData.protocol.operatorDistributor.address, rplRequried);

}

export async function getMinipoolsInProtocol(setupData: SetupData): Promise<IMinipool[]> {
    const minipoolAddresses = await setupData.protocol.operatorDistributor.getMinipoolAddresses();
    const minipools: IMinipool[] = [];
    for (let i = 0; i < minipoolAddresses.length; i++) {
        const minipool = await ethers.getContractAt("IMinipool", minipoolAddresses[i]);
        minipools.push(minipool);
    }
    return minipools;
}

export async function getMockMinipoolsInProtocol(setupData: SetupData): Promise<MockMinipool[]> {
    const minipoolAddresses = await setupData.protocol.operatorDistributor.getMinipoolAddresses();
    const minipools: MockMinipool[] = [];
    for (let i = 0; i < minipoolAddresses.length; i++) {
        const minipool = await ethers.getContractAt("MockMinipool", minipoolAddresses[i]);
        minipools.push(minipool);
    }
    return minipools;
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
            if (event.event) { // Check if event name is available
                emittedEvents.push(event.event);
            } else if (event.topics && event.topics.length > 0) { // Decode the raw log
                const eventDescription = contract.interface.getEvent(event.topics[0]);
                emittedEvents.push(eventDescription.name);
                const decodedData = contract.interface.decodeEventLog(eventDescription, event.data, event.topics);
                emittedArgs.push(decodedData)
            }
        }
    }

    return emittedEvents
}