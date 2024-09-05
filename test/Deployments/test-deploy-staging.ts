import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber as BN } from "ethers";
import { deployRocketPool } from "../rocketpool/_helpers/deployment";
import { setDefaultParameters } from "../rocketpool/_helpers/defaults";
import { RocketStorage } from "../rocketpool/_utils/artifacts";
import { IRocketStorage } from "../../typechain-types";
import { deployDev, deployDevUsingEnv } from "../../scripts/environments/deploy_dev";
import { getWalletFromPath } from "../../scripts/environments/keyReader";

describe(`Test Deploy Dev Env`, () => {
    beforeEach(async function () {
        await network.provider.request({
            method: "hardhat_reset",
            params: [{
                forking: {
                    jsonRpcUrl: process.env.HOLESKY_RPC,
                },
            }],
        });
    });

    it("Should pass", async () => {
        const directory = await deployDevUsingEnv();
    })
});