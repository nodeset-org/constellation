import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from ".././test";
import { generateDepositData } from ".././rocketpool/_helpers/minipool";
import { approvedSalt, approveHasSignedExitMessageSig, assertAddOperator } from ".././utils/utils";

describe("Minimum Collateral", async function () {
    describe("when min collateral is not met", async function () {
        it.only("should fail", async function () {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;
           
            // Set minimum RPL collateral on operator distributor to 30%
            await protocol.operatorDistributor.connect(signers.admin).setMinimumStakeRatio(ethers.utils.parseEther("0.3"))
            
            // Deposit 8 ETH for 1 minipool
            const ethMintAmount = ethers.utils.parseEther("8");
            const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)

            await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("1000") });
            await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
            await protocol.vCWETH.connect(signers.ethWhale).deposit(ethMintAmount, signers.ethWhale.address);

            // Deposit 1.6 RPL (i.e. 20% of 8 ETH)
            const rplMintAmount = ethers.utils.parseEther("1.6");
            await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
            await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
            await protocol.vCRPL.connect(signers.ethWhale).deposit(rplMintAmount, signers.ethWhale.address); 

            // Assert failure on minipool creation
            const nodeOperator = signers.hyperdriver;
            await assertAddOperator(setupData, nodeOperator);
            const salt = 3;
            const { rawSalt, pepperedSalt } = await approvedSalt(salt, nodeOperator.address);
            const depositData = await generateDepositData(protocol.superNode.address, pepperedSalt)
            const bond = await setupData.protocol.superNode.bond();

            const config = {
                timezoneLocation: 'Australia/Brisbane',
                bondAmount: bond,
                minimumNodeFee: 0,
                validatorPubkey: depositData.depositData.pubkey,
                validatorSignature: depositData.depositData.signature,
                depositDataRoot: depositData.depositDataRoot,
                salt: pepperedSalt,
                expectedMinipoolAddress: depositData.minipoolAddress,
              };
          
              const { sig, timestamp } = await approveHasSignedExitMessageSig(
                setupData,
                '0x' + config.expectedMinipoolAddress,
                config.salt,
              );

            await expect(
                protocol.superNode
            .connect(nodeOperator)
            .createMinipool({
                validatorPubkey: config.validatorPubkey,
                validatorSignature: config.validatorSignature,
                depositDataRoot: config.depositDataRoot,
                salt: rawSalt,
                expectedMinipoolAddress: config.expectedMinipoolAddress,
                sigGenesisTime: timestamp,
                sig: sig
                }, { value: ethers.utils.parseEther('1') }))
            .to.be.revertedWith("NodeAccount: protocol must have enough rpl and eth");
      

        });
        describe("when more collateral is added", async function () {
            describe("when collateral is less than min collateral after update", async function () {
                it("should fail", async function () {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;
                   
                    // set minimum RPL collateral on operator distributor to 30%
                    // deposit 8 ETH for 1 minipool
                    // deposit 1.6 RPL (i.e. 20% of 8 ETH)
                    // Assert failure on minipool creation
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
                    // Assert failure on minipool creation
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
                    // Assert failure on minipool creation
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
