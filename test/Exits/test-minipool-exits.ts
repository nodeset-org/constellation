import { expect } from "chai";
import { ethers, upgrades, hardhatArguments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture } from "../test";
import { prepareOperatorDistributionContract, registerNewValidator } from "../utils/utils";

describe("Exiting Minipools", function () {

    describe("When caller is admin", async () => {
        describe("When minipool balance is greater than minipool Node Refund Balance", async () => {
            describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })
            })

            describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })
        })

        describe("When minipool balance is equal to minipool Node Refund Balance", async () => {
            describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })
            })

            describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })
        })

        describe("When minipool balance is less than minipool Node Refund Balance", async () => {
            it("Shoudl revert", async () => {

            })
        })
    })

    describe("When caller is protocol", async () => {
        describe("When minipool balance is greater than minipool Node Refund Balance", async () => {
            describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })
            })

            describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })
        })

        describe("When minipool balance is equal to minipool Node Refund Balance", async () => {
            describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                describe("When Node Share of Balance After Refund is greater than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })

                describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                    it("Shoudl pass", async () => {

                    })
                })
            })

            describe("When Node Share of Balance After Refund is equal to Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })

            describe("When Node Share of Balance After Refund is less than Node Deposit Balance", async () => {
                it("Shoudl pass", async () => {

                })
            })
        })

        describe("When minipool balance is less than minipool Node Refund Balance", async () => {
            it("Shoudl revert", async () => {

            })
        })
    })

    describe("When caller is neither admin nor protocol", async () => {
        it("Shoudl revert", async () => {

        })
    })
})