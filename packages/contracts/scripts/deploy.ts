import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DSHIT token...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from address: ${deployer.address}`);

  const DSHIT = await ethers.getContractFactory("DSHIT");
  const dshit = await DSHIT.deploy();

  await dshit.waitForDeployment();
  const contractAddress = await dshit.getAddress();

  console.log(`DSHIT token deployed to: ${contractAddress}`);

  // Log initial state
  const totalSupply = await dshit.totalSupply();
  const owner = await dshit.owner();
  const taxRate = await dshit.taxRate();
  const taxRecipient = await dshit.taxRecipient();

  console.log(`Total Supply: ${ethers.formatEther(totalSupply)} DSHIT`);
  console.log(`Owner: ${owner}`);
  console.log(`Tax Rate: ${taxRate.toString()} (5% = 500)`);
  console.log(`Tax Recipient: ${taxRecipient}`);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    address: contractAddress,
    deployer: deployer.address,
    owner: owner,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
