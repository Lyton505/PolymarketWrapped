const hre = require("hardhat");

async function main() {
  console.log("Deploying PolymarketWrappedBadge to Base...");

  const PolymarketWrappedBadge = await hre.ethers.getContractFactory(
    "PolymarketWrappedBadge"
  );
  const badge = await PolymarketWrappedBadge.deploy();

  await badge.waitForDeployment();

  const address = await badge.getAddress();
  console.log("PolymarketWrappedBadge deployed to:", address);

  console.log("\n✅ Deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Update your .env.local with:");
  console.log(`   NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=${address}`);
  console.log("\n2. Verify the contract on Basescan:");
  console.log(`   npx hardhat verify --network base ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
