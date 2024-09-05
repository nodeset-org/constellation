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

export async function deployDev(rocketStorageAddress: string, wETHAddress: string, sanctionsAddress: string, deployer: Wallet | SignerWithAddress, admin: Wallet | SignerWithAddress) {
    const { directory, superNode } = await fastDeployProtocol(deployer, deployer, admin, admin, admin, rocketStorageAddress, wETHAddress, sanctionsAddress, admin.address, true, 1);
    upgrades.silenceWarnings()
    await fastParameterization(directory, superNode, admin, deployer, deployer, deployer.address, deployer.address, deployer.address);
    return directory
}