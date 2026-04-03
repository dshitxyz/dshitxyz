import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

interface DeploymentConfig {
  network: string;
  treasuryAddress: string;
  contractAddress?: string;
  deploymentHash?: string;
  timestamp: number;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log(`\n🚀 Deploying DSHIT Token to ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`📍 Deployer: ${deployer.address}`);
  console.log(`⛽ Network: ${network.name}`);

  // Get treasury address from environment or use deployer
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log(`💰 Treasury: ${treasuryAddress}`);

  try {
    // Deploy contract
    console.log("\n⏳ Deploying contract...");
    const DSHIT = await ethers.getContractFactory("DSHIT");
    const dshit = await DSHIT.deploy(treasuryAddress);
    await dshit.waitForDeployment();

    const contractAddress = await dshit.getAddress();
    console.log(`✅ DSHIT deployed to: ${contractAddress}`);

    // Verify deployment
    const name = await dshit.name();
    const symbol = await dshit.symbol();
    const totalSupply = await dshit.totalSupply();
    const treasury = await dshit.treasuryAddress();

    console.log(`\n📊 Contract Details:`);
    console.log(`   Name: ${name}`);
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Total Supply: ${ethers.formatEther(totalSupply)} tokens`);
    console.log(`   Treasury: ${treasury}`);
    console.log(`   Tax Rate: ${await dshit.transferTaxRate()} basis points (5%)`);

    // Save deployment info
    const deploymentInfo: DeploymentConfig = {
      network: network.name,
      treasuryAddress,
      contractAddress,
      timestamp: Date.now(),
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `${network.name}-${Date.now()}.json`;
    fs.writeFileSync(
      path.join(deploymentsDir, filename),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`\n💾 Deployment saved to: deployments/${filename}`);

    // Instructions for verification
    console.log(`\n🔍 To verify on ${network.name}:`);
    console.log(`   npx hardhat verify --network ${network.name} ${contractAddress} "${treasuryAddress}"`);

    console.log(`\n✨ Deployment complete!`);
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
