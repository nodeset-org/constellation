import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Protocol, protocolFixture, RocketPool, SetupData } from "../test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expectNumberE18ToBeApproximately, getEventNames, prepareOperatorDistributionContract, registerNewValidator, upgradePriceFetcherToMock, whitelistUserServerSig } from "../utils/utils";
import { ContractTransaction } from "@ethersproject/contracts";
import { MerkleClaimStreamer, RocketMerkleDistributorMainnet, RocketVault } from "../../typechain-types";

describe("sweepLockedTVL()", async () => {

    describe("When sender is protocol", async () => {
        describe("When streaming interval has finished", async () => {

            describe("When prior eth stream amount is 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {

                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {

                    })
                })
            })

            describe("When prior eth stream amount is not 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should pass (transfer out eth NOT rpl)", async () => {

                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl AND eth)", async () => {

                    })
                })
            })


            describe("When prior rpl stream amount is 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {

                    })
                })

                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth NOT rpl", async () => {

                    })
                })
            })

            describe("When prior rpl stream amount is not 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {

                    })
                })


                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth AND rpl)", async () => {

                    })
                })
            })
        })

        describe("When streaming interval has not finished", async () => {
            it("Should revert", async () => {

            })
        })
    })

    describe("When sender is admin", async () => {
        describe("When streaming interval has finished", async () => {

            describe("When prior eth stream amount is 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {

                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {

                    })
                })
            })

            describe("When prior eth stream amount is not 0", async () => {
                describe("When prior rpl stream amount is 0", async () => {
                    it("Should pass (transfer out eth NOT rpl)", async () => {

                    })
                })


                describe("When prior rpl stream amount is not 0", async () => {
                    it("Should pass (transfer out rpl AND eth)", async () => {

                    })
                })
            })


            describe("When prior rpl stream amount is 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should return (do nothing)", async () => {

                    })
                })

                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth NOT rpl", async () => {

                    })
                })
            })

            describe("When prior rpl stream amount is not 0", async () => {
                describe("When prior eth stream amount is 0", async () => {
                    it("Should pass (transfer out rpl NOT eth)", async () => {

                    })
                })


                describe("When prior eth stream amount is not 0", async () => {
                    it("Should pass (transfer out eth AND rpl)", async () => {

                    })
                })
            })
        })

        describe("When streaming interval has not finished", async () => {
            it("Should revert", async () => {

            })
        })
    })

    describe("When sender is neither protocol nor admin", async () => {
        it("Should revert", async () => {

        })
    })
})