import {ethers} from "hardhat";
import {BigNumber} from "ethers";
import { expect } from "chai";
import { SetupData } from "../test";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { RocketPool } from "../test";

// optionally include the names of the accounts
export const printBalances = async (accounts: string[], opts: any = {}) => {
    const {names = []} = opts;
    for (let i = 0; i < accounts.length; i++) {
        console.log(`Balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(accounts[i]))} at ${names.length > 0 ? names[i] : accounts[i]}`);
    }
};

export const printTokenBalances = async (accounts: string[], token: string, opts: any = {}) => {
    const {names = []} = opts;
    const weth = await ethers.getContractAt("IWETH", token);
    for (let i = 0; i < accounts.length; i++) {
        console.log(`Token Balance: ${ethers.utils.formatEther(await weth.balanceOf(accounts[i]))} at ${names.length > 0 ? names[i] : accounts[i]}`);

    }
};

// given an object containing other objects that have addresses, print the balances of each address and the name of the object the address belongs to
export const printObjectBalances = async (obj: any) => {
    for (const key in obj) {
        await printBalances([obj[key].address], {names: [key]});
    }
}

export const printObjectTokenBalances = async (obj: any, tokenAddr: string) => {
    for (const key in obj) {
        await printTokenBalances([obj[key].address], tokenAddr, {names: [key]});
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

export async function deployMockMinipool(signer: SignerWithAddress, rocketPool: RocketPool) {
    const mockMinipoolFactory = await ethers.getContractFactory("MockMinipool");
    const mockMinipool = await mockMinipoolFactory.deploy();
    await mockMinipool.deployed();

    await mockMinipool.initialise(
        signer.address,
    )

    return mockMinipool;
}

export const registerNewValidator = async (setupData: SetupData, nodeOperators: string[]) => {

};