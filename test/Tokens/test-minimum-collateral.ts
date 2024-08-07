import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from ".././test";

describe("Minimum Collateral", async function () {
    describe("when min collateral is not met", async function () {
        it("should fail", async function () {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;
           
            // set minimum RPL collateral on operator distributor to 30%
            protocol.operatorDistributor.setMinimumStakeRatio()
            // deposit 8 ETH for 1 minipool
            // deposit 1.6 RPL (i.e. 20% of 8 ETH)
            // assert failure on register and create minipool
        });
        describe("when more collateral is added", async function () {
            describe("when collateral is less than min collateral after update", async function () {
                it("should fail", async function () {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;
                   
                    // set minimum RPL collateral on operator distributor to 30%
                    // deposit 8 ETH for 1 minipool
                    // deposit 1.6 RPL (i.e. 20% of 8 ETH)
                    // assert failure on register and create minipool
                    // deposit 0.4 RPL (i.e. now total of 25% of 8 ETH in vault)
                    // register and create minipool
                });
            });
            describe("when collateral is exactly min collateral after update", async function () {
                it("should be able to register and create minipool", async function () {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;
                   
                    // set minimum RPL collateral on operator distributor to 30%
                    // deposit 8 ETH for 1 minipool
                    // deposit 1.6 RPL (i.e. 20% of 8 ETH)
                    // assert failure on register and create minipool
                    // deposit 0.8 RPL (i.e. now total of 30% of 8 ETH in vault)
                    // register and create minipool
                });
            });
            describe("when collateral is greater than min collateral after update", async function () {
                it("should be able to register and create minipool", async function () {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;
                   
                    // set minimum RPL collateral on operator distributor to 30%
                    // deposit 8 ETH for 1 minipool
                    // deposit 1.6 RPL (i.e. 20% of 8 ETH)
                    // assert failure on register and create minipool
                    // deposit 6.4 RPL (i.e. now total of 100% of 8 ETH in vault)
                    // register and create minipool
                });
            });            
        });
    });
    describe("when min collateral is met", async function () {
        describe("when collateral is exactly min collateral", async function () {
            it("should be able to register and create minipool", async function () {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;
               
                // set minimum RPL collateral on operator distributor to 30%
                // deposit 8 ETH for 1 minipool
                // deposit 2.4 RPL (i.e. 30% of 8 ETH)
                // register and create minipool
            });
        });
        describe("when collateral is greater than min collateral", async function () {
            it("should be able to register and create minipool", async function () {
                const setupData = await loadFixture(protocolFixture);
                const { protocol, signers, rocketPool } = setupData;
               
                // set minimum RPL collateral on operator distributor to 30%
                // deposit 8 ETH for 1 minipool
                // deposit 8 RPL (i.e. 100% of 8 ETH)
                // register and create minipool
            });
        });
    });
});
