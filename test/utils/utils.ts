import {ethers} from "hardhat";

export const printBalances = async (accounts: string[]) => {
    for (const account of accounts) {
        console.log(`${account} balance: ${(await ethers.provider.getBalance(account)).toString()}`);
    }
};

export const printWETHBalances = async (accounts: string[], weth: string) => {
    for (const account of accounts) {
        console.log(`${account} WETH balance: ${await (await ethers.getContractAt("IWETH", weth)).balanceOf(account)}`);
    }
}