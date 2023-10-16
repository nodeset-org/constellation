import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import '@nomiclabs/hardhat-truffle5';
import 'solidity-docgen';

// init dotenv
import dotenv from "dotenv";
import findConfig from 'find-config';

const dotenvPath = findConfig('.env');
dotenv.config({ path: dotenvPath });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 15000,
          },
        },
      }
    ]
  },
  //networks: {
  //  hardhat: {
  //    forking: {
  //      url: process.env.MAINNET_URL as string,
  //      blockNumber: parseInt(process.env.MAINNET_FORK_NUMBER as string),
  //    }
  //  }
  //},

  networks: {
    hardhat: {
      gasPrice: 25000000000, // This is in wei (25 gwei)
    },

    goerli: {
      url: process.env.GOERLI_URL as string,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
  },
  mocha: {
    timeout: 0,
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
