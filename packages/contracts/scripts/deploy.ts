import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DSHIT token...");

  const DSHIT = await ethers.getContractFactory("DSHIT");
  const dshit = await DSHIT.deploy();

  await dshit.waitForDeployment();

  const deployedAddress = await dshit.getAddress();
  console.log(`✅ DSHIT deployed to: ${deployedAddress}`);

  // Log token details
  const name = await dshit.name();
  const symbol = await dshit.symbol();
  const decimals = await dshit.decimals();
  const totalSupply = await dshit.totalSupply();
  const owner = await dshit.owner();

  console.log(`
Token Details:
  Name: ${name}
  Symbol: ${symbol}
  Decimals: ${decimals}
  Total Supply: ${ethers.formatEther(totalSupply)}
  Owner: ${owner}
  Tax Percentage: 5%
  Tax Recipient: ${owner}
  `);

  // Verify on Basescan (for testnet/mainnet)
  const network = await ethers.provider.getNetwork();
  console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);

  if (network.chainId === 84532) {
    console.log(`\n🔗 Base Sepolia Basescan: https://sepolia.basescan.org/address/${deployedAddress}`);
  } else if (network.chainId === 8453) {
    console.log(`\n🔗 Base Mainnet Basescan: https://basescan.org/address/${deployedAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
