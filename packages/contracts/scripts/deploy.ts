import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("Deploying DSHIT token...");
  console.log("Network:", network.name);
  console.log("Deployer:", deployer.address);

  // Get treasury address from environment or use deployer as temporary treasury
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log("Treasury address:", treasuryAddress);

  // Deploy DSHIT token
  const DSHIT = await ethers.getContractFactory("DSHIT");
  const dshit = await DSHIT.deploy(treasuryAddress);
  await dshit.waitForDeployment();

  const dshitAddress = await dshit.getAddress();
  console.log("✓ DSHIT deployed to:", dshitAddress);

  // Verify initial state
  const totalSupply = await dshit.totalSupply();
  const owner = await dshit.owner();
  const tax = await dshit.transferTaxBasisPoints();
  const treasury = await dshit.treasuryAddress();

  console.log("\nToken Info:");
  console.log("- Total Supply:", ethers.formatEther(totalSupply), "DSHIT");
  console.log("- Owner:", owner);
  console.log("- Tax Rate:", tax / 100, "%");
  console.log("- Treasury:", treasury);

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    address: dshitAddress,
    deployer: deployer.address,
    treasury: treasuryAddress,
    timestamp: new Date().toISOString(),
    totalSupply: totalSupply.toString(),
  };

  const deploymentDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const filename = path.join(deploymentDir, `${network.name}-deployment.json`);
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✓ Deployment info saved to:", filename);

  console.log("\nNext steps:");
  console.log("1. Verify contract on Basescan (if using Base)");
  console.log("2. Update frontend with token address:", dshitAddress);
  console.log("3. Generate TypeChain types: pnpm -F @dshit/contracts build");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
