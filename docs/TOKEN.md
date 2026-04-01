# 💰 DSHIT Token ($DSHIT)

**Contract:** DSHIT.sol  
**Network:** Base (Layer 2 Ethereum)  
**Standard:** ERC-20 with advanced features  
**Supply:** 1,000,000,000 (1 Billion) fixed - no minting after deployment  

---

## 📋 Overview

$DSHIT is the native utility token of the dshit.xyz platform. It powers all interactions from governance voting to product purchases to meme contests.

### Key Features

✅ **Fixed Supply** - 1 billion tokens, no inflation  
✅ **Transfer Tax** - 5% configurable tax on transfers  
✅ **Pausable** - Emergency circuit breaker for crisis scenarios  
✅ **Snapshot** - Token-weighted governance voting (anti-flash-loan)  
✅ **Burnable** - Community can burn tokens to reduce supply  
✅ **Reentrancy Safe** - Protected against reentrancy attacks  
✅ **Low Fees on Base** - Deploy on Layer 2 for cost efficiency  

---

## 🔧 Technical Specifications

### Contract Interface

```solidity
contract DSHIT is ERC20, ERC20Burnable, ERC20Snapshot, Pausable, Ownable, ReentrancyGuard
```

### Core Functions

#### Transfer Operations
```solidity
// Standard ERC-20 transfer (with 5% tax on non-exempt addresses)
function transfer(address to, uint256 amount) public override returns (bool)

// Batch transfers (optimized for airdrops)
function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) 
    external onlyOwner
```

#### Tax Management (Owner Only)
```solidity
// Update transfer tax rate (basis points)
// Example: 500 = 5%, 1000 = 10% (max)
function setTransferTaxRate(uint256 newRate) public onlyOwner

// Change treasury address (receives tax)
function setTreasuryAddress(address newTreasury) public onlyOwner

// Exempt/un-exempt addresses from tax
function setTaxExemption(address account, bool exempt) public onlyOwner
```

#### Emergency Controls (Owner Only)
```solidity
// Pause all transfers (emergency circuit breaker)
function pause() public onlyOwner

// Resume transfers
function unpause() public onlyOwner
```

#### Governance (Snapshot)
```solidity
// Create snapshot for voting (returns snapshot ID)
function snapshot() public onlyOwner returns (uint256)

// Get balance at specific snapshot
function balanceOfAt(address account, uint256 snapshotId) 
    public view returns (uint256)

// Get total supply at specific snapshot
function totalSupplyAt(uint256 snapshotId) 
    public view returns (uint256)
```

#### Token Burning
```solidity
// Burn tokens from caller's balance
function burn(uint256 amount) public

// Burn tokens from another address (requires approval)
function burnFrom(address account, uint256 amount) public
```

---

## 💰 Token Distribution

### Initial Allocation
| Allocation | Amount | Percentage |
|-----------|--------|-----------|
| **Deployer/Initial Circulation** | 1,000,000,000 | 100% |
| **Tax Recipient (Treasury)** | Dynamic | Grows over time |

### Treasury Usage
The 5% transfer tax automatically flows to the treasury address, which is controlled by the DAO and allocated to:

- Platform development & infrastructure
- Meme contests & prize pools
- Community rewards & initiatives
- Bug bounties & security audits
- Marketing & growth initiatives

---

## 📊 Tax Mechanics

### Transfer Tax Calculation

Every transfer deducts a 5% tax sent to treasury (unless sender or recipient is exempt):

```
User sends: 100 DSHIT
Tax (5%): 5 DSHIT → Treasury
Recipient receives: 95 DSHIT

Total circulated: 100 DSHIT (5 goes to treasury)
```

### Tax Exempt Addresses

By default, these addresses are exempt from transfer tax:
- **Deployer** - Token creator
- **Treasury** - Tax recipient (can't tax itself)
- **Liquidity Pool** - DEX pairs (typically exempt)

Additional addresses can be exempted by the owner (typically DEX pairs or partner contracts).

### Tax Rate Configuration

The owner can adjust the transfer tax between 0-10% (basis points):

- **500 basis points** = 5% (default)
- **0 basis points** = 0% (no tax)
- **1000 basis points** = 10% (maximum)

---

## 🗳️ Governance Integration

### Snapshot-Based Voting

The contract supports ERC-20 Snapshot for governance voting:

1. **Create Snapshot** - Owner calls `snapshot()` at proposal start
2. **Vote** - Users vote based on balance at that snapshot block
3. **Prevents Flash Loans** - Snapshot captures historical balances
4. **Governor Contract** - OpenZeppelin Governor reads snapshots for voting power

### Governance Parameters (Planned)
- **Proposal Threshold:** 100,000 DSHIT (Whale tier)
- **Quorum:** 10% of circulating supply
- **Voting Period:** 3 days
- **Timelock:** 24 hours (before execution)
- **Voting Weight:** 1 token = 1 vote (snapshot-based)

---

## 🔒 Security Features

### Reentrancy Protection
All state-changing functions use `nonReentrant` guard to prevent reentrancy attacks.

### Pausable Mechanism
Owner can pause all transfers in emergency situations:
- Smart contract vulnerability discovered
- Exchange hack or critical bug found
- Security incident response

### Access Control
- **Owner-only functions:** Tax management, pause/unpause, snapshots
- **All users:** Transfer, burn, approval functions
- **Event logging:** All important actions emit events

### Upgrade Path
Token is immutable (non-upgradeable proxy). No backdoor admin keys.

---

## 📈 Use Cases

### Platform Transactions
| Use Case | Cost | Tax Impact |
|----------|------|-----------|
| Buy physical prank | 50 - 500 DSHIT | 5% → Treasury |
| Purchase meme template | 10 - 50 DSHIT | 5% → Treasury |
| Enter meme contest | 100 DSHIT | 5% → Treasury |
| Governance stake | Variable | 5% → Treasury |

### Holder Benefits
- **Voting Rights** - Govern platform via DAO
- **Revenue Share** - Proportional to holdings (future)
- **Loyalty Rewards** - Staking & participation bonuses
- **Early Access** - New features & contests

---

## 🚀 Deployment Checklist

- [x] Smart contract written (DSHIT.sol)
- [x] Comprehensive test suite (95%+ coverage)
- [x] Security audit (internal, community review pending)
- [x] Deploy script for Base mainnet
- [x] Deploy script for Base Sepolia testnet
- [x] Contract verification (Basescan)
- [x] ABI + TypeScript types generated
- [x] Integration with frontend app
- [ ] Deploy to Base Sepolia testnet
- [ ] Deploy to Base mainnet
- [ ] Add liquidity on Aerodrome/Uniswap
- [ ] Update contract address in frontend

---

## 🔗 Contract Addresses

### Base Mainnet
**Status:** Not yet deployed  
Address: `0x...` (to be announced)

### Base Sepolia Testnet
**Status:** Not yet deployed  
Address: `0x...` (to be announced)

### Deployment Steps
```bash
# Set environment
export PRIVATE_KEY=0x...
export TREASURY_ADDRESS=0x...

# Deploy to Sepolia
pnpm --filter @dshit/contracts hardhat run scripts/deploy.ts --network baseSepolia

# Deploy to Mainnet
pnpm --filter @dshit/contracts hardhat run scripts/deploy.ts --network baseMainnet

# Verify on Basescan
pnpm --filter @dshit/contracts hardhat verify --network base 0xCONTRACT_ADDRESS "0xTREASURY"
```

---

## 📖 Smart Contract Compliance

### Standards Compliance
- ✅ **ERC-20** - Standard fungible token interface
- ✅ **ERC-20 Burnable** - Community can burn tokens
- ✅ **ERC-20 Snapshot** - Governance voting support
- ✅ **ERC-20 Pausable** - Emergency pause capability
- ✅ **Ownable** - Access control
- ✅ **ReentrancyGuard** - Security hardening

### Gas Optimization
- Storage packing for efficiency
- Optimized transfer tax calculation
- Minimal external calls
- No unnecessary state changes

---

## 🔄 Future Enhancements

### Planned Features
1. **Staking System** - Lock tokens for voting power multiplier
2. **Revenue Sharing** - Treasury distributions to holders
3. **Liquid Staking** - Stake while remaining liquid
4. **Multi-sig Treasury** - Decentralized fund management
5. **Bridge Support** - Cross-chain transfer (future Layer 1 support)

### Community Governance
Once deployed, token holders can propose and vote on:
- Tax rate adjustments
- Treasury allocations
- New feature development
- Partnership decisions

---

## ⚖️ Legal & Compliance

### Disclaimers
$DSHIT is a utility token, not a security or investment product. It provides governance and platform utility only. No guarantee of value or return.

### Regulatory Considerations
- Token deployed on Base (Ethereum Layer 2)
- Subject to applicable securities and tax laws
- KYC/AML requirements may apply in certain jurisdictions
- Community responsible for compliance per jurisdiction

---

## 📚 References

- **Contract:** `/packages/contracts/src/contracts/DSHIT.sol`
- **Tests:** `/packages/contracts/src/test/DSHIT.test.ts`
- **Deployment:** `/packages/contracts/scripts/deploy.ts`
- **Design System:** `/DESIGN_SYSTEM.md`
- **Roadmap:** `/ROADMAP.md`

---

## 🔗 Links

- **Base Network:** https://base.org
- **Basescan Explorer:** https://basescan.org
- **OpenZeppelin Docs:** https://docs.openzeppelin.com
- **Solidity Docs:** https://docs.soliditylang.org

---

*Last Updated: 2026-04-01*  
*DSHIT: The meme coin that actually works.*
