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
      url: process.env.HOLESKY_RPC || "" as string,
    }
  },
  mocha: {
    timeout: 0,
  },

  etherscan: {
    apiKey: {
      holesky: process.env.ETHERSCAN_HOLESKY_API_KEY || "" as string,
      mainnet: process.env.ETHERSCAN_MAINNET_API_KEY || "" as string,
    },
    customChains: [
      {
        network: "holesky",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api",
          browserURL: "https://holesky.etherscan.io"
        }
      }
    ]
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

};


export default config;
