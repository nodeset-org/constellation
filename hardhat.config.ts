import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import '@nomiclabs/hardhat-truffle5';
import 'solidity-docgen';
import 'hardhat-contract-sizer';

// task commands
import './tasks/adminTasks'
import './tasks/viewOperatorDistributorTasks'
import './tasks/viewSuperNodeAccountTasks'

import dotenv from "dotenv";
import findConfig from 'find-config';

const dotenvPath = findConfig('.env');

if (dotenvPath !== null) {
  dotenv.config({ path: dotenvPath });
} else {
  // Handle the case where no .env file is found
  console.error('No .env file found');
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
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
  
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true', //
    outputFile: 'gas-report.txt',
  },

  docgen: {
    exclude: ["Testing", "Interfaces"],
  },

  networks: {
    hardhat: {
      gasPrice: 25000000000, // This is in wei (25 gwei)
    },

    localhost: {
      gasPrice: 25000000000,
    },

    holesky: {
      url: process.env.HOLESKY_RPC || ""
    },

    ethereum: {
      url: process.env.ETHEREUM_MAINNET_RPC || ""
    },
  },
  mocha: {
    timeout: 0,
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "" as string,
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

};


export default config;
