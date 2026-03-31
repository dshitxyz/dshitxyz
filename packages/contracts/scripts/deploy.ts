import { ethers } from 'hardhat';

async function main(): Promise<void> {
  console.log('🚀 Deploying DSHIT token...');

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);

  // Get balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);

  // Tax recipient should be set via environment variable
  // For testnet, can default to deployer
  const taxRecipient = process.env.TAX_RECIPIENT || deployer.address;
  console.log(`🏦 Tax Recipient: ${taxRecipient}`);

  // Deploy contract
  const DSHIT = await ethers.getContractFactory('DSHIT');
  const dshit = await DSHIT.deploy(taxRecipient);

  console.log(`⏳ Waiting for deployment confirmation...`);
  await dshit.waitForDeployment();

  const deployedAddress = await dshit.getAddress();
  console.log(`✅ DSHIT deployed to: ${deployedAddress}`);

  // Log token info
  const name = await dshit.name();
  const symbol = await dshit.symbol();
  const decimals = await dshit.decimals();
  const totalSupply = await dshit.totalSupply();
  const taxRate = await dshit.taxRate();

  console.log('\n📊 Token Details:');
  console.log(`  Name: ${name}`);
  console.log(`  Symbol: ${symbol}`);
  console.log(`  Decimals: ${decimals}`);
  console.log(`  Total Supply: ${ethers.formatEther(totalSupply)} DSHIT`);
  console.log(`  Tax Rate: ${Number(taxRate) / 10}%`);
  console.log(`  Tax Recipient: ${taxRecipient}`);

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    address: deployedAddress,
    deployer: deployer.address,
    taxRecipient: taxRecipient,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
  };

  console.log('\n📝 Deployment Info:');
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for Etherscan verification
  console.log('\n🔍 Etherscan Verification:');
  console.log(`npx hardhat verify --network ${network.name} ${deployedAddress} "${taxRecipient}"`);

  console.log('\n✨ Deployment complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
