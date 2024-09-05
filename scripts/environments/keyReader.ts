import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture } from "../../test/test";
import { setDefaultParameters } from "../../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../../test/utils/utils";
import { expect } from "chai";
import readline from 'readline';
import { devParameterization, fastDeployProtocol, fastParameterization, generateBytes32Identifier, retryOperation } from "../utils/deployment";
import { wEth } from "../../typechain-types/contracts/Testing";
import findConfig from "find-config";
import dotenv from "dotenv";
import { Directory, SuperNodeAccount } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet } from 'ethers';
import { readFileSync } from 'fs';

export async function getWalletFromPath(path: string) {

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

    return new Wallet(key, ethers.provider);

}