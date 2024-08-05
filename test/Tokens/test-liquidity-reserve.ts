import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from ".././test";

describe("Liquidity Reserve", async function () {
    describe("when liquidity reserve ratio is lowered", async function () {
        it("should have proper ETH sent to OD", async function () {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            // Set the liquidity reserve ratio to 10%
            await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther("0.1"));
            await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther("0.1"));

            // Mint 100 xWETH
            const ethMintAmount = ethers.utils.parseEther("100");
            const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)

            await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("1000") });
            await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
            await protocol.vCWETH.connect(signers.ethWhale).deposit(ethMintAmount, signers.ethWhale.address);

            // Mint 1000 xRPL
            const rplMintAmount = ethers.utils.parseEther("1000");
            await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
            await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
            await protocol.vCRPL.connect(signers.ethWhale).deposit(rplMintAmount, signers.ethWhale.address); 

            // Assert 10 ETH and 100 RPL are in vault (rest in operator distributor)
            expect(await protocol.wETH.balanceOf(protocol.vCWETH.address)).to.equal(ethers.utils.parseEther("10"));
            const odBalance1 = await ethers.provider.getBalance(protocol.operatorDistributor.address)
            expect(odBalance1).to.equal(ethers.utils.parseEther("90"));

            expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).to.equal(ethers.utils.parseEther("100"));
            expect(await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)).to.equal(ethers.utils.parseEther("900"));

            // Set the xETH liquidity reserve to 1%
            await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther("0.01"));
            // Set the xRPL liquidity reserve to 5%
            await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther("0.05"));

            // Mint 1 xWETH and 1 xRPL
            await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1"), signers.ethWhale.address);

            await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
            await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
            await protocol.vCRPL.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1"), signers.ethWhale.address); 

            // Redeem 1 xWETH and 1 xRPL
            await protocol.vCWETH.connect(signers.ethWhale).redeem(ethers.utils.parseEther("1"), signers.ethWhale.address, signers.ethWhale.address);
            await protocol.vCRPL.connect(signers.ethWhale).redeem(ethers.utils.parseEther("1"), signers.ethWhale.address, signers.ethWhale.address);

            // Assert 1 ETH and 50 RPL are in vault (rest in operator distributor)
            // expect(await protocol.wETH.balanceOf(protocol.vCWETH.address)).to.equal(ethers.utils.parseEther("1"));
            // expect(await protocol.wETH.balanceOf(protocol.operatorDistributor.address)).to.equal(ethers.utils.parseEther("99"));

            // expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).to.equal(ethers.utils.parseEther("50"));
            // expect(await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)).to.equal(ethers.utils.parseEther("950"));
        });
    });
    describe("when liquidity reserve ratio is raised", async function () {
        it("should have proper ETH sent to OD", async function () {
            const setupData = await loadFixture(protocolFixture);
            const { protocol, signers, rocketPool } = setupData;

            // Set the liquidity reserve ratio to 10%
            await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther("0.1"));
            await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther("0.1"));

            // Mint 100 xWETH
            const ethMintAmount = ethers.utils.parseEther("100");
            const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)

            await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("1000") });
            await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
            await protocol.vCWETH.connect(signers.ethWhale).deposit(ethMintAmount, signers.ethWhale.address);

            // Mint 1000 xRPL
            const rplMintAmount = ethers.utils.parseEther("1000");
            await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
            await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
            await protocol.vCRPL.connect(signers.ethWhale).deposit(rplMintAmount, signers.ethWhale.address); 

            // Assert 10 ETH and 100 RPL are in vault (rest in operator distributor)
            expect(await protocol.wETH.balanceOf(protocol.vCWETH.address)).to.equal(ethers.utils.parseEther("10"));
            const odBalance1 = await ethers.provider.getBalance(protocol.operatorDistributor.address)
            expect(odBalance1).to.equal(ethers.utils.parseEther("90"));

            expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).to.equal(ethers.utils.parseEther("100"));
            expect(await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)).to.equal(ethers.utils.parseEther("900"));

            // Set the xETH liquidity reserve to 20%
            await protocol.vCWETH.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther("0.20"));
            // Set the xRPL liquidity reserve to 50%
            await protocol.vCRPL.connect(signers.admin).setLiquidityReservePercent(ethers.utils.parseEther("0.50"));

            // Mint 1 xWETH and 1 xRPL
            await protocol.vCWETH.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1"), signers.ethWhale.address);

            await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
            await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
            await protocol.vCRPL.connect(signers.ethWhale).deposit(ethers.utils.parseEther("1"), signers.ethWhale.address); 

            // Redeem 1 xWETH and 1 xRPL
            await protocol.vCWETH.connect(signers.ethWhale).redeem(ethers.utils.parseEther("1"), signers.ethWhale.address, signers.ethWhale.address);
            await protocol.vCRPL.connect(signers.ethWhale).redeem(ethers.utils.parseEther("1"), signers.ethWhale.address, signers.ethWhale.address);

            // Assert 20 ETH and 50 RPL are in vault (rest in operator distributor)
            // expect(await protocol.wETH.balanceOf(protocol.vCWETH.address)).to.equal(ethers.utils.parseEther("20"));
            // expect(await protocol.wETH.balanceOf(protocol.operatorDistributor.address)).to.equal(ethers.utils.parseEther("80"));

            // expect(await rocketPool.rplContract.balanceOf(protocol.vCRPL.address)).to.equal(ethers.utils.parseEther("500"));
            // expect(await rocketPool.rplContract.balanceOf(protocol.operatorDistributor.address)).to.equal(ethers.utils.parseEther("500"));
        });


    });
});