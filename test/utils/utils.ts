import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { Protocol, SetupData, Signers } from "../test";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { RocketPool } from "../test";
import { IMinipool, MockMinipool } from "../../typechain-types";
import { createMinipool, getMinipoolMinimumRPLStake } from "../rocketpool/_helpers/minipool";
import { nodeStakeRPL, registerNode } from "../rocketpool/_helpers/node";
import { mintRPL } from "../rocketpool/_helpers/tokens";
import { userDeposit } from "../rocketpool/_helpers/deposit";

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

export async function deployMockMinipool(signer: SignerWithAddress, rocketPool: RocketPool, signers: Signers, bondValue: BigNumber) {
    await registerNode({ from: signer.address });

    // Stake RPL to cover minipools
    let minipoolRplStake = await getMinipoolMinimumRPLStake();
    let rplStake =  ethers.BigNumber.from(minipoolRplStake.toString()).mul(3);
    rocketPool.rplContract.connect(signers.rplWhale).transfer(signer.address, rplStake);
    await nodeStakeRPL(rplStake, { from: signer.address });

    const mockMinipool = await createMinipool({
        from: signer.address,
        value: bondValue,
    });

    await userDeposit({from: signer.address, value: bondValue});

    let scrubPeriod = (60 * 60 * 24); // 24 hours


    return await ethers.getContractAt("RocketMinipoolInterface", mockMinipool.address);
}

export async function upgradePriceFetcherToMock(protocol: Protocol, price: BigNumber) {
    const mockPriceFetcherFactory = await ethers.getContractFactory("MockPriceFetcher");
    const mockPriceFetcher = await mockPriceFetcherFactory.deploy();
    await mockPriceFetcher.deployed();

    await protocol.priceFetcher.upgradeTo(mockPriceFetcher.address);

    const priceFetcherV2 = await ethers.getContractAt("MockPriceFetcher", protocol.priceFetcher.address);
    await priceFetcherV2.setPrice(price);
};

export async function removeFeesOnRPLVault(protocol: Protocol) {
    await protocol.vCRPL.setFees(0, 0);
}

export async function removeFeesOnBothVaults(protocol: Protocol) {
    await protocol.vCRPL.setFees(0, 0);
    await protocol.vCWETH.setFees(0, 0, 0, 0);
}

export const registerNewValidator = async (setupData: SetupData, nodeOperators: SignerWithAddress[]) => {

    // one currently needs 8 eth in the operatorDistribution contract to register a validator for each node operator
    const requiredEth = ethers.utils.parseEther("8").mul(nodeOperators.length);
    if ((await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address)).lt(requiredEth)) {
        throw new Error(`Not enough eth in operatorDistributor contract to register ${nodeOperators.length} validators. Required ${ethers.utils.formatEther(requiredEth)} eth but only have ${ethers.utils.formatEther(await ethers.provider.getBalance(setupData.protocol.operatorDistributor.address))} eth`);
    }

    const bondValue = ethers.utils.parseEther("8");
    const rocketPool = setupData.rocketPool;

    for (let i = 0; i < nodeOperators.length; i++) {
        const nodeOperator = nodeOperators[i];

        const mockMinipool = await deployMockMinipool(nodeOperator, rocketPool, setupData.signers, bondValue);

        await rocketPool.rockStorageContract.connect(nodeOperator).setWithdrawalAddress(nodeOperator.address, setupData.protocol.depositPool.address, true);

        // NO sets smoothing pool registration state to true
        await rocketPool.rocketNodeManagerContract.connect(nodeOperator).registerNode("Australia/Brisbane");
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
        await setupData.protocol.operatorDistributor.reimburseNodeForMinipool(sig, mockMinipool.address);
        operatorData = await setupData.protocol.whitelist.getOperatorAtAddress(nodeOperator.address);
        expect(operatorData.currentValidatorCount).to.equal(lastCount + 1);
    }
};

export async function prepareOperatorDistributionContract(setupData: SetupData, numOperators: Number) {
    // sends 8 * numOperators eth to operatorDistribution contract
    const requiredEth = ethers.utils.parseEther("8").mul(BigNumber.from(numOperators));
    await setupData.signers.admin.sendTransaction({
        to: setupData.protocol.operatorDistributor.address,
        value: requiredEth
    });
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