import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying DSHIT Token...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploying with account: ${deployer.address}`);

  // Use deployer as treasury for now
  const treasuryAddress = deployer.address;

  const DSHIT = await hre.ethers.getContractFactory("DSHIT");
  const token = await DSHIT.deploy(treasuryAddress);

  await token.waitForDeployment();
  const address = await token.getAddress();

  console.log(`✅ DSHIT deployed to: ${address}`);

  // Verify on Etherscan if API key exists
  if (process.env.BASESCAN_API_KEY) {
    console.log("📋 Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [treasuryAddress],
      });
      console.log("✅ Contract verified");
    } catch (error) {
      console.log("⚠️ Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
