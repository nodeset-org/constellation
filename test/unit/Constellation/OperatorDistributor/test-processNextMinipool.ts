describe("OperatorDistributor.processNextMinipool", function () {
    describe("when the next minipool address is the zero address", function () {
        it("does nothing", async function () {
        });
    });
    describe("when the next minipool address is not the zero address", function () {
        describe("when minipool processing is not enabled", function () {
            it("does nothing", async function () {
            });
        });
        describe("when minipool processing is enabled", function () {
            describe("when the minipool balance is zero", function () {
                it("does nothing", async function () {
                });
            });
            describe("when the minipool balance is not zero", function () {
                describe("when the minipool is not managed by Constellation", function () {
                    it("does nothing", async function () {
                    });
                });
                describe("when the minipool is managed by Constellation", function () {
                    describe("when the minipool is finalised", function () {
                        it("does nothing", async function () {
                        });
                    });
                    describe("when the status is not Staking", function () {
                        it("does nothing", async function () {
                        });
                    });
                    describe("when the minipool is not finalised and the status is Staking", function () {
                        describe("when the post-refund balance is greater than deposit balance", function () {
                            describe("when the minipool balance is less than the launch balance", function () {
                                it("emits a suspected penalized minipool exit message", async function () {
                                });
                            });
                            describe("when the minipool balance is equal to the launch balance", function () {
                                it("distributes and rebalances the vaults", async function () {
                                });
                            });
                            describe("when the minipool balance is greater than the launch balance", function () {
                                it("distributes and rebalances the vaults", async function () {
                                });
                            });
                        });
                        describe("when the post-refund balance is equal to deposit balance", function () {
                            describe("when the minipool balance is less than the launch balance", function () {
                                it("emits a suspected penalized minipool exit message", async function () {
                                });
                            });
                            describe("when the minipool balance is equal to the launch balance", function () {
                                it("distributes and rebalances the vaults", async function () {
                                });
                            });
                            describe("when the minipool balance is greater than the launch balance", function () {
                                it("distributes and rebalances the vaults", async function () {
                                });
                            });
                        });
                        describe("when the post-refund balance is less than deposit balance", function () {
                            it("distributes and rebalances the vaults", async function () {
                            });
                        });
                    });
                });
            });
        });
    });
});