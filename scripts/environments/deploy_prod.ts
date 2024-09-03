import { ethers, upgrades } from "hardhat";
import { getRocketPool, protocolFixture } from "../../test/test";
import { setDefaultParameters } from "../../test/rocketpool/_helpers/defaults";
import { deployRocketPool } from "../../test/rocketpool/_helpers/deployment";
import { getNextContractAddress } from "../../test/utils/utils";
import { expect } from "chai";
import readline from 'readline';
import { fastDeployProtocol, generateBytes32Identifier, retryOperation } from "../utils/deployment";
import { wEth } from "../../typechain-types/contracts/Testing";


async function main() {
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });