import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import '@nomiclabs/hardhat-truffle5';

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
  networks: {
    hardhat: {
      // forking: {
      //   url: "https://eth-mainnet.alchemyapi.io/v2/corzgOuIDH87dxZm8NkllrQEsJFUKxCU",
      //   blockNumber: 16394176
      // }
      gasPrice: 25000000000 // This is in wei (25 gwei)
    },
  },

  mocha: {
    timeout: 0,
}
};

export default config;
