import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { protocolFixture, SetupData } from "./test";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

export async function mint_xrEth(setupData: SetupData, from: SignerWithAddress, amount: BigNumber) {
  const { protocol, signers } = setupData;

  return from.sendTransaction({ to: protocol.xrETH.address, value: amount, gasLimit: 1000000 });
}

describe("xrETH", function () {

  // add tests for deposit and withdraw

});