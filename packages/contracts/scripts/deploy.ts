import hre from "hardhat";

async function main() {
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();

  console.log(`Deploying DSHIT token to ${network}...`);
  console.log(`Deployer: ${deployer.address}`);

  // Use deployer as tax recipient by default
  const taxRecipient = process.env.TAX_RECIPIENT || deployer.address;

  const DSHIT = await hre.ethers.getContractFactory("DSHIT");
  const token = await DSHIT.deploy(taxRecipient);
  await token.waitForDeployment();

  const contractAddress = await token.getAddress();
  console.log(`✅ DSHIT deployed to: ${contractAddress}`);
  console.log(`Tax recipient: ${taxRecipient}`);

  // Print deployment info
  const supply = await token.totalSupply();
  const decimals = await token.decimals();
  console.log(`Total supply: ${supply / 10n ** BigInt(decimals)}`);

  // Wait for block confirmation before verifying
  if (["base-sepolia", "base"].includes(network)) {
    console.log("\nWaiting for block confirmations...");
    await token.deploymentTransaction()?.wait(5);

    // Attempt Basescan verification
    if (process.env.BASESCAN_API_KEY) {
      console.log("Verifying contract on Basescan...");
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [taxRecipient],
        });
        console.log("✅ Contract verified on Basescan");
      } catch (error) {
        console.log("⚠️ Verification failed (may already be verified):", error);
      }
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network,
    address: contractAddress,
    deployer: deployer.address,
    taxRecipient,
    timestamp: new Date().toISOString(),
  };

  console.log("\n📋 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
