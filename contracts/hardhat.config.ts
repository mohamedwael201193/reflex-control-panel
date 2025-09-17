import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    somnia: {
      url: process.env.SOMNIA_RPC_URL || "https://dream-rpc.somnia.network/",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 50312,
    },
  },
};

export default config;