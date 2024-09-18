import { readFileSync } from 'fs';

export async function getWalletFromPath(ethers: any, provider: any, path: string) {

    let key = readFileSync(path, 'utf8').trim();

    if (!key.startsWith('0x')) {
        key = `0x${key}`;
    }

    if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
        throw new Error('Invalid characters in private key. Expected a 64-character hex string.');
    }

    return new ethers.Wallet(key, provider);
}