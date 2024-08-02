import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from ".././test";

describe("CoverageRatio", async function () {
    // describe("Initialization", function () {
    //     it("Should initialize with correct directory address", async function () {
    //         const { protocol, signers } = await loadFixture(protocolFixture);
    //         const { oracle, directory } = protocol;
    //         expect(await oracle.getDirectory()).to.equal(directory.address);
    //     });
    // });



    describe("minting xWETH", async function() {
        describe("when minting from below the coverage ratio", async function() {
            describe("when minting stays below the coverage ratio", async function() {
                it("should revert", async function() {
                    const setupData = await loadFixture(protocolFixture);
                    const { protocol, signers, rocketPool } = setupData;
                   
                    await protocol.vCRPL.connect(signers.admin).setWETHCoverageRatio(ethers.BigNumber.from(0));
                    await protocol.vCWETH.connect(signers.admin).setRplCoverageRatio(ethers.constants.MaxUint256);

                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    const ethMintAmount = ethers.utils.parseEther("100");
                    const ethBalance = await ethers.provider.getBalance(signers.ethWhale.address)

                    // Why do we need to deposit to wETH?
                    await protocol.wETH.connect(signers.ethWhale).deposit({ value: ethers.utils.parseEther("100") });
                    await protocol.wETH.connect(signers.ethWhale).approve(protocol.vCWETH.address, ethBalance);
                    await protocol.vCWETH.connect(signers.ethWhale).deposit(ethMintAmount, signers.ethWhale.address);

                    const rplMintAmount = ethers.utils.parseEther("100000");
                    await rocketPool.rplContract.connect(signers.rplWhale).transfer(signers.ethWhale.address, rplMintAmount);
                    await rocketPool.rplContract.connect(signers.ethWhale).approve(protocol.vCRPL.address, rplMintAmount);
                    await protocol.vCRPL.connect(signers.ethWhale).deposit(rplMintAmount, signers.ethWhale.address); 

                    // Set minWethRplRatio to 200%
                    await protocol.vCRPL.connect(signers.admin).setWETHCoverageRatio(ethers.BigNumber.from(2e5));
                    // Set maxWethRplRatio to 300%
                    await protocol.vCWETH.connect(signers.admin).setRplCoverageRatio(ethers.BigNumber.from(3e5));

                    // Mint 1 xWETH
                    // Check if it reverts
                    await expect(
                        protocol.vCWETH.connect(signers.ethWhale)
                            .deposit(ethers.utils.parseEther("1"), signers.ethWhale.address)
                    ).to.be.revertedWith("insufficient RPL coverage");
                });
            });
            describe("when minting hits the bottom threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 200%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1000 xWETH [confirm == 200% exactly]
                    // Check if it reverts                    
                });
            });
            describe("when minting goes within coverage ratio", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 101%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1000 xWETH (i.e. 200% ratio)
                    // Check that it passes                
                });
            });
            describe("when minting hits the top threshold (maxWethRplRatio)", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 200%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 2000 xWETH [confirm == 300% exactly]
                    // Check if it passes      
                });
            });
            describe("when minting is above the top threshold (maxWethRplRatio)", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 101%
                    // Set maxWethRplRatio to 102%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1000 xWETH (i.e. 200% ratio)
                    // Check that it reverts
                });
            });
        });
        describe("when minting from bottom threshold (minWethRplRatio) of coverage ratio", async function() {
            describe("when minting falls within ratio", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 100%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1000 xWETH (i.e. 200% ratio)
                    // Check that it passes                
                });
            });
            describe("when minting hits the top threshold", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 100%
                    // Set maxWethRplRatio to 200%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1000 xWETH (i.e. 200% ratio)
                    // Check that it passes
                });
            });
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 100%
                    // Set maxWethRplRatio to 200%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 2000 xWETH (i.e. 300% ratio)
                    // Check that it reverts
                });
            });
        });
        describe("when minting from within the coverage ratio", async function() {
            describe("when minting stays within ratio", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 50%
                    // Set maxWethRplRatio to 200%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1 xWETH 
                    // Check that it passes
                });
            });
            describe("when minting hits the top threshold (maxWethRplRatio)", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 50%
                    // Set maxWethRplRatio to 200%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1000 xWETH (i.e. 200% ratio)
                    // Check that it passes
                });
            });
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 50%
                    // Set maxWethRplRatio to 101%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1000 xWETH (i.e. 200% ratio)
                    // Check that it reverts
                });
            });            
        });
        // These cases should never happen
        describe("when minting from top threshold (maxWethRplRatio) the coverage ratio", async function() {
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 50%
                    // Set maxWethRplRatio to 100%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1 xWETH
                    // Check that it reverts
                });
            }); 
        });
        // These cases should never happen
        describe("when minting from above the coverage ratio", async function() {
            describe("when minting stays above the coverage ratio", async function() {
                it("should revert", async function() {  
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 50%
                    // Set maxWethRplRatio to 55%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 1 xWETH
                    // Check that it reverts
                });
            }); 
        });        
    });

    describe("minting xRPL", async function() {
        describe("when minting from below the coverage ratio", async function() {
            describe("when minting stays below the coverage ratio", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 200%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            });
        });
        describe("when minting from bottom threshold (minWethRplRatio) of coverage ratio", async function() {
            describe("when minting goes below the coverage ratio", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 100%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            });
        });
        describe("when minting from within the coverage ratio", async function() {
            describe("when minting stays within ratio", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 1%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it passes
                });
            });
            describe("when minting hits the bottom threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 50%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            });
            describe("when minting goes below the coverage ratio", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 75%
                    // Set maxWethRplRatio to 300%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            });            
        });
        describe("when minting from top threshold (maxWethRplRatio) the coverage ratio", async function() {
            describe("when minting goes within coverage ratio", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 10%
                    // Set maxWethRplRatio to 100%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it passes
                });
            });
            describe("when minting hits the bottom threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 50%
                    // Set maxWethRplRatio to 100%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            });
            describe("when minting is below the bottom threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 75%
                    // Set maxWethRplRatio to 100%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            });            
        });
        describe("when minting from above the coverage ratio", async function() {
            describe("when minting stays above the coverage ratio", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 1%
                    // Set maxWethRplRatio to 20%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            }); 
            describe("when minting hits the top threshold (maxWethRplRatio)", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 1%
                    // Set maxWethRplRatio to 70%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it passes
                });
            });
            describe("when minting goes within coverage ratio", async function() {
                it("should pass", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 1%
                    // Set maxWethRplRatio to 70%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it passes
                });
            });
            describe("when minting hits the bottom threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 50%
                    // Set maxWethRplRatio to 70%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            });
            describe("when minting is below the bottom threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                    // Disable enforceRplCoverageRatio
                    // Disable enforceWethCoverageRatio
                    // Mint 1000 xWETH + 100,000 xRPL (i.e. 100% ratio)
                    // Set minWethRplRatio to 55%
                    // Set maxWethRplRatio to 70%
                    // Enable enforceWethCoverageRatio
                    // Enable enforceRplCoverageRatio
                    // Mint 100,000 xRPL (i.e. 50% ratio)
                    // Check that it reverts
                });
            });

        });        
    });   
});