import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DSHIT token...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // Tax recipient is the deployer
  const DSHIT = await ethers.getContractFactory("DSHIT");
  const dshit = await DSHIT.deploy(deployer.address);
  await dshit.waitForDeployment();

  const address = await dshit.getAddress();
  console.log(`DSHIT token deployed to: ${address}`);

  // Verify deployment
  const name = await dshit.name();
  const symbol = await dshit.symbol();
  const totalSupply = await dshit.totalSupply();

  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)}`);
  console.log(`Tax Recipient: ${await dshit.taxRecipient()}`);
  console.log(`Transfer Tax: ${await dshit.transferTaxPercent()}%`);

  // Save deployment info
  const network = (await ethers.provider.getNetwork()).name;
  const chainId = (await ethers.provider.getNetwork()).chainId;

  console.log(`\nDeployment successful on ${network} (Chain ID: ${chainId})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
