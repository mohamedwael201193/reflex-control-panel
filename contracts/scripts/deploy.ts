// Corrected import: The curly braces {} are removed.
import { ethers } from "hardhat";

async function main() {
  const placeholderTokenAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  console.log("Deploying contracts...");

  // 1. Deploy JITLiquidityVault
  const JITLiquidityVault = await ethers.getContractFactory("JITLiquidityVault");
  const jitLiquidityVault = await JITLiquidityVault.deploy(placeholderTokenAddress);
  await jitLiquidityVault.waitForDeployment();
  const jitLiquidityVaultAddress = await jitLiquidityVault.getAddress();
  console.log("JITLiquidityVault deployed to:", jitLiquidityVaultAddress);

  // 2. Deploy AuctionHouse
  const AuctionHouse = await ethers.getContractFactory("AuctionHouse");
  const auctionHouse = await AuctionHouse.deploy(jitLiquidityVaultAddress);
  await auctionHouse.waitForDeployment();
  const auctionHouseAddress = await auctionHouse.getAddress();
  console.log("AuctionHouse deployed to:", auctionHouseAddress);

  // 3. Deploy OpportunityRouter
  const OpportunityRouter = await ethers.getContractFactory("OpportunityRouter");
  const opportunityRouter = await OpportunityRouter.deploy();
  await opportunityRouter.waitForDeployment();
  const opportunityRouterAddress = await opportunityRouter.getAddress();
  console.log("OpportunityRouter deployed to:", opportunityRouterAddress);

  // 4. Link the Vault to the AuctionHouse
  console.log("\nLinking contracts...");
  const tx = await jitLiquidityVault.setAuctionHouse(auctionHouseAddress);
  await tx.wait();
  console.log("Called setAuctionHouse() on JITLiquidityVault.");
  
  console.log("\nContracts deployed and linked successfully!");
  console.log("----------------------------------------------------");
  console.log("JITLiquidityVault Address: ", jitLiquidityVaultAddress);
  console.log("AuctionHouse Address:    ", auctionHouseAddress);
  console.log("OpportunityRouter Address: ", opportunityRouterAddress);
  console.log("----------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });