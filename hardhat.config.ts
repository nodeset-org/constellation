import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';

// init dotenv
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_URL as string,
        blockNumber: parseInt(process.env.MAINNET_FORK_NUMBER as string),
      }
    }
  }
};

export default config;
