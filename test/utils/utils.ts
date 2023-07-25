import {ethers} from "hardhat";

// optionally include the names of the accounts
export const printBalances = async (accounts: string[], opts: any = {}) => {
    const {names = []} = opts;
    for (let i = 0; i < accounts.length; i++) {
        console.log(`Balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(accounts[i]))} at ${names.length > 0 ? names[i] : accounts[i]}`);
    }
};

export const printWETHBalances = async (accounts: string[], wethAddr: string, opts: any = {}) => {
    const {names = []} = opts;
    const weth = await ethers.getContractAt("IWETH", wethAddr);
    for (let i = 0; i < accounts.length; i++) {
        console.log(`WETH Balance: ${ethers.utils.formatEther(await weth.balanceOf(accounts[i]))} at ${names.length > 0 ? names[i] : accounts[i]}`);

    }
};

// given an object containing other objects that have addresses, print the balances of each address and the name of the object the address belongs to
export const printObjectBalances = async (obj: any) => {
    for (const key in obj) {
        await printBalances([obj[key].address], {names: [key]});
    }
}

export const printObjectWETHBalances = async (obj: any, wethAddr: string) => {
    for (const key in obj) {
        await printWETHBalances([obj[key].address], wethAddr, {names: [key]});
    }
}