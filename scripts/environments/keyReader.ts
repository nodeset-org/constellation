import { readFileSync } from 'fs';

export async function getWalletFromPath(ethers: any, path: string) {

    let key = readFileSync(path, 'utf8').trim();

    if (!key.startsWith('0x')) {
        key = `0x${key}`;
    }

    if (key.length !== 66) {
        throw new Error(`Private key must be 64 hex characters long. Got: ${key.length - 2}`);
    }

    if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
        throw new Error('Invalid characters in private key. Expected a 64-character hex string.');
    }

    return new ethers.Wallet(key, ethers.provider);

}