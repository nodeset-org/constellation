import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";

// init dotenv
import dotenv from "dotenv";
dotenv.config();

// add hardhat tasks
import "./scripts/tasks/deploy_task";

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
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY as string,
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};

export default config;
