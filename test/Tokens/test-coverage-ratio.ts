import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from ".././test";

describe("CoverageRatio", function () {
    describe("Initialization", function () {
        it("Should initialize with correct directory address", async function () {
            const { protocol, signers } = await loadFixture(protocolFixture);
            const { oracle, directory } = protocol;
            expect(await oracle.getDirectory()).to.equal(directory.address);
        });
    });

    describe("minting xWETH", async function() {
        describe("when minting from below the coverage ratio", async function() {
            describe("when minting stays below the coverage ratio", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting hits the bottom threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting goes within coverage ratio", async function() {
                it("should pass", async function() {
                });
            });
            describe("when minting hits the top threshold (maxWethRplRatio)", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting is above the top threshold (maxWethRplRatio)", async function() {
                it("should revert", async function() {
                });
            });
        });
        describe("when minting from bottom threshold (minWethRplRatio) of coverage ratio", async function() {
            describe("when minting falls within ratio", async function() {
                it("should pass", async function() {
                });
            });
            describe("when minting hits the top threshold", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                });
            });
        });
        describe("when minting from within the coverage ratio", async function() {
            describe("when minting stays within ratio", async function() {
                it("should pass", async function() {
                });
            });
            describe("when minting hits the top threshold (maxWethRplRatio)", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                });
            });            
        });
        // These cases should never happen
        describe("when minting from top threshold (maxWethRplRatio) the coverage ratio", async function() {
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                });
            }); 
        });
        // These cases should never happen
        describe("when minting from above the coverage ratio", async function() {
            describe("when minting stays above the coverage ratio", async function() {
                it("should revert", async function() {  
                });
            }); 
        });        
    });

    describe("minting xRPL", async function() {
        describe("when minting from below the coverage ratio", async function() {
            describe("when minting stays below the coverage ratio", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting hits the bottom(maxWethRplRatio) threshold", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting goes within coverage ratio", async function() {
                it("should pass", async function() {
                });
            });
            describe("when minting hits the top threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting is above the top threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                });
            });
        });
        describe("when minting from bottom threshold (maxWethRplRatio) of coverage ratio", async function() {
            describe("when minting falls within ratio", async function() {
                it("should pass", async function() {
                });
            });
            describe("when minting hits the top threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                });
            });
        });
        describe("when minting from within the coverage ratio", async function() {
            describe("when minting stays within ratio", async function() {
                it("should pass", async function() {
                });
            });
            describe("when minting hits the top threshold (minWethRplRatio)", async function() {
                it("should revert", async function() {
                });
            });
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                });
            });            
        });
        // These cases should never happen
        describe("when minting from top threshold (minWethRplRatio) the coverage ratio", async function() {
            describe("when minting goes above the coverage ratio", async function() {
                it("should revert", async function() {
                });
            }); 
        });
        // These cases should never happen
        describe("when minting from above the coverage ratio", async function() {
            describe("when minting stays above the coverage ratio", async function() {
                it("should revert", async function() {
                });
            }); 
        });        
    });   
});