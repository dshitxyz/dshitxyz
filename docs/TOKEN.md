# DSHIT Token Documentation

## Overview

DSHIT is an ERC-20 token deployed on Base L2 that powers the dshit.xyz platform. It serves as:
- **Currency**: For purchasing meme packages and products
- **Governance**: For voting on platform decisions (via snapshots)
- **Incentives**: For rewarding creators and engaged users

## Token Details

| Property | Value |
|----------|-------|
| Name | DSHIT |
| Symbol | DSHIT |
| Chain | Base (chainId: 8453) |
| Decimals | 18 |
| Total Supply | 1,000,000,000 DSHIT (fixed, no minting) |
| Standard | ERC-20 + Extensions |

## Features

### 1. Fixed Supply
- Total supply of 1 billion tokens minted at deployment
- No ability to mint additional tokens (deflationary only)
- Promotes scarcity and value accrual

### 2. Transfer Tax (5% Default)
- 5% tax on all token transfers
- Tax recipient is the treasury address
- Tax rate is configurable by owner (0-10% range)
- Used to fund platform operations and community initiatives

**Example:**
```
Transfer: 100 DSHIT
Tax (5%): 5 DSHIT → Treasury
Received: 95 DSHIT → Recipient
```

### 3. Pausable
- Owner can pause/unpause token transfers
- Used as emergency circuit breaker for security issues
- When paused, all `transfer()` and `transferFrom()` calls revert

### 4. Burnable
- Token holders can burn their tokens (permanent removal from supply)
- Reduces total supply over time
- Mechanisms: `burn()` and `burnFrom()`

### 5. Snapshots (Governance)
- Owner can create snapshots for governance voting
- Snapshots capture balances at specific points in time
- Prevents flash loan attacks on voting systems
- Functions: `snapshot()`, `balanceOfAt()`, `totalSupplyAt()`

### 6. ReentrancyGuard
- Protects against reentrancy attacks
- Prevents recursive calls during critical operations

## Contract Functions

### Standard ERC-20

```solidity
// Transfer tokens to recipient (with tax applied)
function transfer(address to, uint256 value) public returns (bool)

// Transfer tokens on behalf of another address (with tax applied)
function transferFrom(address from, address to, uint256 value) public returns (bool)

// Approve spending allowance
function approve(address spender, uint256 value) public returns (bool)

// Query balance
function balanceOf(address account) public view returns (uint256)

// Query total supply
function totalSupply() public view returns (uint256)
```

### Burn Functions

```solidity
// Burn your own tokens
function burn(uint256 amount) public

// Burn another account's tokens (requires approval)
function burnFrom(address account, uint256 amount) public
```

### Snapshot Functions

```solidity
// Create a new snapshot (owner only)
function snapshot() public onlyOwner returns (uint256)

// Query balance at snapshot (historical)
function balanceOfAt(address account, uint256 snapshotId) public view returns (uint256)

// Query total supply at snapshot (historical)
function totalSupplyAt(uint256 snapshotId) public view returns (uint256)
```

### Emergency Functions

```solidity
// Pause all transfers (owner only)
function pause() public onlyOwner

// Resume transfers (owner only)
function unpause() public onlyOwner
```

### Treasury Management

```solidity
// Set new tax rate in basis points (0-1000, owner only)
function setTaxRate(uint256 newRate) public onlyOwner

// Set new treasury address (owner only)
function setTreasury(address newTreasury) public onlyOwner

// Query current tax rate
uint256 public taxRate

// Query treasury address
address public treasury

// Query total tax collected
uint256 public totalTaxCollected
```

## Usage Examples

### Transfer with Tax

```typescript
import { ethers } from "ethers";

// Connect to wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Get contract
const dshitABI = [...]; // Contract ABI
const dshit = new ethers.Contract(DSHIT_ADDRESS, dshitABI, signer);

// Transfer 100 DSHIT
// 5% (5 DSHIT) goes to treasury
// 95% (95 DSHIT) goes to recipient
const tx = await dshit.transfer(recipientAddress, ethers.parseEther("100"));
await tx.wait();

console.log("✅ Transfer complete");
```

### Burn Tokens

```typescript
// Burn 50 DSHIT from your balance
const tx = await dshit.burn(ethers.parseEther("50"));
await tx.wait();

console.log("🔥 Tokens burned");
```

### Check Balance at Snapshot

```typescript
// Get balance at snapshot ID 1
const snapshotId = 1;
const balance = await dshit.balanceOfAt(userAddress, snapshotId);

console.log(`Balance at snapshot 1: ${ethers.formatEther(balance)} DSHIT`);
```

### Vote on Governance Proposal

```typescript
// 1. Create snapshot for voting
const snapshotTx = await dshit.snapshot();
const snapshotReceipt = await snapshotTx.wait();
const snapshotId = /* extracted from event */;

// 2. Governance contract uses balanceOfAt for voting power
// This prevents flash loan attacks
```

## Deployment

### Testnet (Base Sepolia)

```bash
# Set environment
export BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
export PRIVATE_KEY="0x..."
export TREASURY_ADDRESS="0x..."

# Deploy
pnpm run deploy:testnet
```

### Mainnet (Base)

```bash
# Set environment
export BASE_MAINNET_RPC_URL="https://mainnet.base.org"
export PRIVATE_KEY="0x..."
export TREASURY_ADDRESS="0x..."

# Deploy
pnpm run deploy
```

## Security Considerations

1. **Tax Rate Limits**: Maximum tax rate is 10% to prevent excessive taxation
2. **Reentrancy Protection**: All state-changing functions protected by ReentrancyGuard
3. **Fixed Supply**: No minting capability after deployment (no inflation)
4. **Pausable**: Owner can pause transfers in case of security issue
5. **Snapshot Integrity**: Snapshots cannot be modified after creation
6. **Owner Only**: Critical functions (pause, snapshot, tax rate, treasury) require owner

## Gas Optimization

The contract includes gas optimizations:
- Storage packing for efficient state layout
- Minimal external calls
- Optimized math operations
- ReentrancyGuard with minimal overhead

## Audit Status

- [ ] Internal review completed
- [ ] Security testing done
- [ ] Test coverage: >95% branch coverage
- [ ] Ready for external audit (pre-deployment)

## Future Upgrades

Potential future enhancements:
- Governance tokenomics (voting power increases with lock period)
- Liquidity mining rewards
- Burn mechanics refinement
- Cross-chain bridging
- DEX integration

## Links

- **Contract Address**: (deployed on mainnet)
- **Explorer**: https://basescan.org/
- **Source**: https://github.com/dshitxyz/dshitxyz
- **Roadmap**: https://github.com/dshitxyz/dshitxyz/blob/main/ROADMAP.md
