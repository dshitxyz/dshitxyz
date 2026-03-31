# DSHIT Token Documentation

## Overview

DSHIT is an ERC-20 token deployed on Base L2 that powers the dshit.xyz platform. It combines standard token functionality with governance, tax, and emergency circuit breaker features.

**Contract Address (Sepolia):** TBD  
**Contract Address (Base):** TBD  
**Token Name:** DSHIT  
**Token Symbol:** $DSHIT  
**Decimals:** 18  
**Total Supply:** 1,000,000,000 (1 billion, fixed at deployment)

---

## Key Features

### 1. Fixed Supply (No Mint/Burn to Adjust Supply)

- Maximum supply: 1 billion tokens (1,000,000,000 * 10^18)
- Entire supply minted at deployment
- No additional minting capability after deployment
- Supply can only decrease through burning

### 2. Transfer Tax

A configurable tax applies to all token transfers:

**Default Tax Rate:** 5% (500 basis points)

**How it Works:**
- When a user transfers tokens, 5% of the transferred amount goes to the Treasury
- The recipient receives 95% of the transferred amount
- Example: Transfer 100 DSHIT → Recipient gets 95 DSHIT, Treasury gets 5 DSHIT

**Tax Exemption:**
- Certain addresses can be exempt from tax
- Default exempt addresses: Token deployer, Treasury address
- Owner can add/remove tax exempt addresses dynamically

**Tax Rate Changes:**
- Owner can adjust tax rate between 0-10% (0-1000 basis points)
- Changes take effect immediately on all new transfers
- Emits `TaxRateUpdated` event

### 3. Treasury Management

The Treasury address receives all collected taxes and is controlled by the DAO.

**Functions:**
- `treasuryAddress()` - Get current treasury address
- `setTreasuryAddress(newAddress)` - Change treasury (owner only)
- Automatically exempt from transfer tax

### 4. Pausable (Emergency Circuit Breaker)

The contract can be paused to stop all token transfers in emergency situations.

**Owner Functions:**
- `pause()` - Stop all transfers
- `unpause()` - Resume transfers
- `paused()` - Check pause status

**Behavior:**
- When paused, all transfer operations revert
- Minting/burning are not affected
- Snapshot creation still works
- Useful for preventing exploits or responding to security issues

### 5. Snapshot (Governance Voting)

Snapshots allow governance voting without flash loan attacks by capturing account balances at a specific block height.

**Functions:**
- `snapshot()` - Create a new snapshot (owner only)
- `balanceOfAt(account, snapshotId)` - Get balance at snapshot
- `totalSupplyAt(snapshotId)` - Get total supply at snapshot

**Use Cases:**
- Voting power determination (prevents flash loan voting)
- Governance proposals
- Historical balance tracking
- Anti-sybil mechanisms

### 6. Burnable

Token holders can permanently remove tokens from circulation.

**Functions:**
- `burn(amount)` - Destroy your own tokens
- `burnFrom(account, amount)` - Destroy with approval
- Emits `TokensBurned` event

**Behavior:**
- Reduces total supply permanently
- Cannot burn more than balance
- Requires approval for burning others' tokens
- Does not generate tax

### 7. Reentrancy Protection

All state-changing functions are protected against reentrancy attacks using OpenZeppelin's ReentrancyGuard.

---

## Token Economics

### Supply Allocation at Launch

| Allocation | Amount | % |
|-----------|--------|---|
| Liquidity Pool | 500,000,000 | 50% |
| Community Fund | 300,000,000 | 30% |
| Ecosystem | 150,000,000 | 15% |
| Treasury | 50,000,000 | 5% |
| **Total** | **1,000,000,000** | **100%** |

### Tax Revenue

All taxes collected are sent to the Treasury address:

**Use Cases:**
- Reward creators (meme contests)
- Buyback and burn operations
- Platform operations
- Community grants
- DAO controlled through governance

---

## Functions Reference

### Core Transfer Functions

```solidity
// Standard ERC20 transfer
transfer(to, amount) -> bool

// Transfer with allowance
transferFrom(from, to, amount) -> bool

// Approve spending
approve(spender, amount) -> bool

// Check allowance
allowance(owner, spender) -> uint256
```

### Tax Management (Owner Only)

```solidity
// Change tax rate (0-1000 basis points)
setTransferTaxRate(newRate)
  - Emits: TaxRateUpdated(oldRate, newRate)
  - Requires: newRate <= 1000 (10%)

// Change treasury address
setTreasuryAddress(newTreasury)
  - Emits: TreasuryAddressUpdated(oldAddress, newAddress)
  - Requires: newTreasury != address(0)

// Exempt/un-exempt address from tax
setTaxExemption(account, isExempt)
  - Emits: TaxExemptionUpdated(account, isExempt)
```

### Emergency Functions (Owner Only)

```solidity
// Pause all transfers
pause()

// Resume transfers
unpause()
```

### Snapshot Functions (Owner Only)

```solidity
// Create a snapshot
snapshot() -> snapshotId
  - Emits: SnapshotCreated(snapshotId)

// Get balance at snapshot
balanceOfAt(account, snapshotId) -> uint256

// Get supply at snapshot
totalSupplyAt(snapshotId) -> uint256
```

### Burn Functions (Public)

```solidity
// Burn your own tokens
burn(amount)
  - Emits: TokensBurned(msg.sender, amount)
  - Requires: amount > 0

// Burn with approval
burnFrom(account, amount)
  - Emits: TokensBurned(account, amount)
  - Requires: amount > 0, approval >= amount
```

---

## Gas Optimization

The contract is optimized for:

- **Storage Efficiency:** All state variables packed efficiently
- **Loop Avoidance:** No loops in transfer or tax calculation
- **Computation:** Tax calculation uses only basic arithmetic
- **Delegatecall Prevention:** No delegatecall functionality

**Estimated Gas Usage (per transfer):**
- Simple transfer: ~50,000 - 65,000 gas
- Transfer with tax: ~65,000 - 80,000 gas
- Approval: ~45,000 gas

---

## Security Considerations

### Implemented Safeguards

1. **Tax Rate Ceiling (10%)** - Prevents excessive tax rates
2. **Treasury Address Validation** - Prevents sending taxes to null address
3. **Snapshot Anti-Flash-Loan** - Prevents voting power from flash loans
4. **Reentrancy Protection** - Guards against reentrancy attacks
5. **Pausable Circuit Breaker** - Stops transfers in emergency
6. **No Mint Capability** - Fixed supply prevents inflation
7. **OpenZeppelin Audited Code** - Uses well-tested base contracts

### Security Assumptions

- Treasury address is secure (receives all taxes)
- Owner address is secure (controls tax rate, pause, snapshots)
- Oracle data (if used by governance) is accurate

### Recommended Testing

Before mainnet deployment:

1. ✅ Full test suite (97 test cases covering all functionality)
2. ✅ Gas benchmarks
3. ✅ Snapshot voting mechanism
4. ✅ Tax calculation precision
5. ⏳ Third-party security audit (recommended)

---

## Events

```solidity
// Emitted when tax rate changes
event TaxRateUpdated(uint256 oldRate, uint256 newRate);

// Emitted when treasury address changes
event TreasuryAddressUpdated(address indexed oldTreasury, address indexed newTreasury);

// Emitted when address tax exemption changes
event TaxExemptionUpdated(address indexed account, bool isExempt);

// Emitted when snapshot is created
event SnapshotCreated(uint256 indexed snapshotId);

// Emitted when tokens are burned
event TokensBurned(address indexed burner, uint256 amount);

// Standard ERC20 events (inherited)
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

---

## Deployment

### Requirements

- Ethereum network (Base L2 testnet/mainnet)
- Deployer with sufficient ETH for gas
- Treasury address (for tax collection)

### Step 1: Prepare Environment

```bash
cp .env.example .env
# Edit .env with your values:
# - PRIVATE_KEY: Your deployment wallet private key
# - BASE_RPC_URL: Base RPC endpoint
# - TREASURY_ADDRESS: Address to receive taxes
```

### Step 2: Deploy to Sepolia (Testnet)

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### Step 3: Verify on Basescan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "<TREASURY_ADDRESS>"
```

### Step 4: Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.ts --network base
```

### Step 5: Create Initial Snapshot

After deployment, create an initial snapshot for governance:

```bash
# Via Hardhat console
npx hardhat console --network base
> const dshit = await ethers.getContractAt('DSHIT', '<ADDRESS>')
> const tx = await dshit.snapshot()
> await tx.wait()
```

---

## Integration Guide

### For DEXes (Uniswap, Aerodrome)

1. Create pair with DSHIT/WETH
2. Note: Tax applies automatically (5% by default)
3. Consider exempting liquidity pool from tax for better UX

### For Governance

1. Create snapshot before voting
2. Use `balanceOfAt(voter, snapshotId)` to determine voting power
3. Implement quorum requirements

### For Community Rewards

1. Use treasury address to distribute rewards
2. Can burn DSHIT if desired (reduce supply)
3. Create snapshots before reward distribution

---

## Contract Interactions (Web3 Examples)

### Check Balance

```javascript
const balance = await contract.balanceOf(userAddress);
console.log("Balance:", ethers.formatEther(balance));
```

### Transfer Tokens

```javascript
// User receives 95 tokens (5% tax)
const tx = await contract.transfer(recipientAddress, ethers.parseEther("100"));
await tx.wait();
```

### Check Tax Rate

```javascript
const taxRate = await contract.transferTaxRate();
console.log("Tax Rate:", taxRate, "basis points (5% = 500)");
```

### Burn Tokens

```javascript
const tx = await contract.burn(ethers.parseEther("1000"));
await tx.wait();
```

---

## FAQ

**Q: Why is there a tax?**  
A: The tax funds the treasury, which is controlled by the DAO for grants, rewards, and ecosystem development.

**Q: Can the tax rate be changed?**  
A: Yes, the owner can change it (0-10%) at any time. Changes take effect immediately.

**Q: What if I want to avoid the tax?**  
A: The owner can add addresses to a tax exemption list (e.g., governance contracts, DEX routers).

**Q: Can I burn tokens?**  
A: Yes, anyone can burn their own tokens. Burning removes them from circulation permanently.

**Q: How does voting work?**  
A: Snapshots capture balances at a specific block. Governance uses these snapshots to determine voting power, preventing flash loan attacks.

**Q: Is the contract audited?**  
A: The contract uses OpenZeppelin's audited base contracts. A third-party audit is recommended before mainnet launch.

---

## Support

For questions about DSHIT token mechanics or integration:

1. Check this documentation
2. Review the contract code at `packages/contracts/src/contracts/DSHIT.sol`
3. See test cases at `packages/contracts/src/test/DSHIT.test.ts`
4. Open an issue on GitHub

---

**Last Updated:** 2026-03-31  
**Version:** 1.0.0  
**Status:** Ready for Testnet Deployment
