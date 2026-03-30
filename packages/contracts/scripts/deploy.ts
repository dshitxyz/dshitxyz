import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying DSHIT token...");

  // Get the network
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Deploying to network: ${network.name} (chainId: ${network.chainId})`);

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);

  // Get treasury address from environment or use deployer as default
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log(`💰 Treasury: ${treasuryAddress}`);

  // Deploy contract
  const DSHIT = await ethers.getContractFactory("DSHIT");
  const dshit = await DSHIT.deploy(treasuryAddress);

  await dshit.waitForDeployment();
  const deployedAddress = await dshit.getAddress();

  console.log(`✅ DSHIT deployed to: ${deployedAddress}`);

  // Log contract details
  console.log("\n📊 Contract Details:");
  console.log(`  Name: ${await dshit.name()}`);
  console.log(`  Symbol: ${await dshit.symbol()}`);
  console.log(`  Decimals: ${await dshit.decimals()}`);
  console.log(`  Total Supply: ${ethers.formatEther(await dshit.totalSupply())} DSHIT`);
  console.log(`  Tax Rate: ${(await dshit.taxRate()) / 100}%`);
  console.log(`  Owner: ${await dshit.owner()}`);
  console.log(`  Treasury: ${await dshit.treasury()}`);

  // Save deployment address to environment
  console.log("\n💾 Save this address for future reference:");
  console.log(`DSHIT_ADDRESS=${deployedAddress}`);

  // For verification on Basescan
  if (network.chainId !== 31337 && network.chainId !== 1337) {
    console.log("\n🔐 To verify on Basescan, run:");
    console.log(`npx hardhat verify --network ${network.name} ${deployedAddress} "${treasuryAddress}"`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
