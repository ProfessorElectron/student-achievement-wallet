require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    ...(sepoliaRpcUrl && deployerPrivateKey
      ? {
          sepolia: {
            url: sepoliaRpcUrl,
            accounts: [deployerPrivateKey],
          },
        }
      : {}),
  },
};
