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

// init dotenv
import dotenv from "dotenv";
import findConfig from 'find-config';

const dotenvPath = findConfig('.env');

if (dotenvPath !== null) {
  dotenv.config({ path: dotenvPath });
} else {
  // Handle the case where no .env file is found
  console.error('No .env file found');
}

if (dotenvPath !== null) {
  dotenv.config({ path: dotenvPath });
} else {
  // Use dummy data for CI/CD testing environment
  process.env.GOERLI_URL = "http://dummy-goerli-url";
  process.env.DEPLOYER_PRIVATE_KEY = "0x" + "1".repeat(64); // Dummy private key
  process.env.HOLESKY_RPC = "http://dummy-holesky-url";
  process.env.HOLESKY_DEPLOYER = "0x" + "2".repeat(64); // Another dummy private key
  process.env.HOLEKSY_ADMIN = "0x" + "3".repeat(64); // Yet another dummy private key
  // Set other necessary dummy environment variables here
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
  //networks: {
  //  hardhat: {
  //    forking: {
  //      url: process.env.MAINNET_URL as string,
  //      blockNumber: parseInt(process.env.MAINNET_FORK_NUMBER as string),
  //    }
  //  }
  //},

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

    goerli: {
      url: process.env.GOERLI_URL || "" as string,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || "" as string],
    },

    holesky: {
      url: process.env.HOLESKY_RPC || "" as string,
      accounts: [process.env.HOLESKY_DEPLOYER || "" as string, process.env.HOLEKSY_ADMIN || "" as string],
    }
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
