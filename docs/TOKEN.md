# DSHIT Token - Technical Documentation

## Overview

**DSHIT** is an ERC-20 token deployed on Base L2 with governance-ready features. It's a fixed-supply memecoin designed for community governance, voting, and commerce.

**Contract Address:** (TBD - deployed to Base Sepolia first)

---

## Token Specifications

| Property | Value |
|----------|-------|
| Name | DSHIT |
| Symbol | DSHIT |
| Decimals | 18 |
| Total Supply | 1,000,000,000 (1 billion) |
| Network | Base L2 |
| Standard | ERC-20 |

---

## Key Features

### 1. **Fixed Supply**
- **Total:** 1,000,000,000 tokens
- **Mint:** Disabled after initial deployment
- **No inflation:** Supply never increases

### 2. **Transfer Tax**
- **Default Rate:** 5% per transaction
- **Owner-Adjustable:** Tax rate can be changed (0-100%)
- **Tax Recipient:** Configurable by owner (initially owner address)
- **Purpose:** Funds community treasury and governance operations

#### Tax Calculation Example
```
Transfer Amount: 100 DSHIT
Tax (5%): 5 DSHIT
Recipient Gets: 95 DSHIT
```

### 3. **Pausable**
- **Owner Control:** Can pause/unpause all transfers
- **Use Case:** Emergency circuit breaker during exploits
- **Reverts:** All transfers fail when paused with `EnforcedPause` error

### 4. **Snapshot Capability**
- **Governance Ready:** Create snapshots for voting
- **Flash-Loan Resistant:** Voting power based on historical balances
- **Immutable History:** Snapshots cannot be modified

#### Snapshot Usage
```solidity
// Create snapshot
uint256 snapshotId = dshit.snapshot();

// Query balance at snapshot
uint256 historicalBalance = dshit.balanceOfAt(address, snapshotId);

// Query total supply at snapshot
uint256 historicalSupply = dshit.totalSupplyAt(snapshotId);
```

### 5. **Burnable**
- **Self-Service Burning:** Anyone can burn their own tokens
- **Supply Reduction:** Permanently removes tokens from circulation
- **No Recovery:** Burned tokens cannot be recovered

### 6. **Access Control**
- **Owner Functions:**
  - Pause/Unpause
  - Create Snapshots
  - Configure Tax
  - Transfer Ownership
  - Renounce Ownership
- **User Functions:**
  - Transfer (subject to tax)
  - Approve (for DEX trading)
  - Burn
  - Check balances

### 7. **Reentrancy Protection**
- **ReentrancyGuard:** All state-changing functions protected
- **Non-Reentrant Transfers:** Prevents recursive calls

---

## Security Considerations

### Implemented Safeguards
✅ OpenZeppelin battle-tested contracts
✅ ReentrancyGuard on all external functions
✅ Pausable for emergency stops
✅ Fixed supply (no mint after deploy)
✅ Ownable with standard controls
✅ 95%+ test coverage

### Audit Recommendations
- [ ] Professional smart contract audit before mainnet deployment
- [ ] Formal verification of tax calculation
- [ ] Gas optimization review
- [ ] Access control review

---

## Deployment Instructions

### Prerequisites
```bash
# Install dependencies
pnpm install

# Set environment variables
cp packages/contracts/.env.example packages/contracts/.env.local
# Edit .env.local with your private key
```

### Test Network Deployment (Base Sepolia)
```bash
pnpm -w -F @dshit/contracts deploy:testnet
```

**Note:** Requires `BASE_SEPOLIA_RPC` and `PRIVATE_KEY` in environment.

### Mainnet Deployment (Base)
```bash
pnpm -w -F @dshit/contracts deploy
```

**⚠️ Requires:**
- PRIVATE_KEY environment variable
- Test deployment verification
- Human review before execution

### Deployment Script Output
The deploy script outputs:
- Contract address
- Token metadata (name, symbol, supply)
- Owner address
- Network details
- Basescan link for verification

---

## Testing

### Run All Tests
```bash
pnpm -w -F @dshit/contracts test
```

### Test Coverage
```bash
pnpm -w -F @dshit/contracts test -- --coverage
```

### Test Categories
1. **Deployment Tests**
   - Correct initialization
   - Owner set correctly
   - Supply distributed properly

2. **Transfer Tax Tests**
   - Tax calculation accuracy
   - Tax sent to recipient
   - Edge cases (zero, max, self)

3. **Configuration Tests**
   - Tax percentage updates
   - Tax recipient changes
   - Validation & access control

4. **Pause/Unpause Tests**
   - Paused state blocks transfers
   - Unpause restores functionality
   - Only owner can pause

5. **Snapshot Tests**
   - Snapshot creation
   - Historical balance queries
   - Supply snapshots

6. **Burn Tests**
   - Burn reduces balance
   - Burn reduces supply
   - Non-owner burning works

7. **Edge Cases**
   - Self-transfers
   - Rapid transfers
   - Insufficient balance
   - Max uint handling

---

## API Reference

### Core Functions

#### `transfer(to, amount)`
Transfer tokens with tax applied.
```solidity
function transfer(address to, uint256 amount) external returns (bool);
```

#### `transferFrom(from, to, amount)`
Transfer tokens on behalf of another account (requires approval).
```solidity
function transferFrom(address from, address to, uint256 amount) external returns (bool);
```

#### `burn(amount)`
Burn tokens from caller's balance.
```solidity
function burn(uint256 amount) external;
```

#### `approve(spender, amount)`
Approve spending of tokens (for DEX trading).
```solidity
function approve(address spender, uint256 amount) external returns (bool);
```

### Owner Functions

#### `pause()`
Pause all token transfers.
```solidity
function pause() external onlyOwner;
```

#### `unpause()`
Resume token transfers.
```solidity
function unpause() external onlyOwner;
```

#### `snapshot()`
Create a governance snapshot.
```solidity
function snapshot() external onlyOwner returns (uint256);
```

#### `setTax(percentage, recipient)`
Update tax rate and recipient.
```solidity
function setTax(uint256 percentage, address recipient) external onlyOwner;
```

### View Functions

#### `balanceOf(account)`
Get token balance of an account.
```solidity
function balanceOf(address account) external view returns (uint256);
```

#### `totalSupply()`
Get total token supply.
```solidity
function totalSupply() external view returns (uint256);
```

#### `balanceOfAt(account, snapshotId)`
Get balance at historical snapshot.
```solidity
function balanceOfAt(address account, uint256 snapshotId) external view returns (uint256);
```

#### `totalSupplyAt(snapshotId)`
Get total supply at historical snapshot.
```solidity
function totalSupplyAt(uint256 snapshotId) external view returns (uint256);
```

#### `getCurrentSnapshotId()`
Get current snapshot ID.
```solidity
function getCurrentSnapshotId() external view returns (uint256);
```

---

## Integration Guide

### Using DSHIT in Other Contracts

```solidity
import "@dshit/contracts/contracts/DSHIT.sol";

contract MyGovernance {
    DSHIT public dshit;

    constructor(address dshitAddress) {
        dshit = DSHIT(dshitAddress);
    }

    // Vote based on snapshot balance
    function vote(uint256 snapshotId, uint256 proposal) external {
        uint256 balance = dshit.balanceOfAt(msg.sender, snapshotId);
        require(balance > 0, "No voting power");
        // ... voting logic
    }
}
```

### Frontend Integration

```typescript
import { DSHIT__factory } from '@dshit/contracts/typechain-types';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
const dshitAddress = '0x...';
const dshit = DSHIT__factory.connect(dshitAddress, provider);

// Get balance
const balance = await dshit.balanceOf(userAddress);
console.log(`Balance: ${ethers.formatEther(balance)}`);

// Get supply
const supply = await dshit.totalSupply();
console.log(`Total Supply: ${ethers.formatEther(supply)}`);
```

---

## Governance Roadmap

**Phase 1 (Current):** Token deployed with fixed supply and tax mechanism
**Phase 2:** Frontend UI for token viewing + wallet integration
**Phase 3:** Commerce integration (purchases with DSHIT)
**Phase 4:** Governance contract (voting on treasury allocation)
**Phase 5:** DAO operations (decentralized management)

---

## FAQ

**Q: Why is there a 5% tax?**
A: Tax funds the community treasury for marketing, development, and operations. It's adjustable by the owner.

**Q: Can the supply increase?**
A: No. The contract mints all 1 billion tokens at deployment. No mint function exists.

**Q: How does snapshot voting work?**
A: Snapshots capture historical balances at specific points in time. This prevents flash-loan attacks on governance.

**Q: Can I recover burned tokens?**
A: No. Burned tokens are permanently removed from circulation.

**Q: What happens if the contract is paused?**
A: All transfers (including burns and approvals leading to transfers) fail. Only the owner can unpause.

---

## Contract Events

```solidity
// Transfer event (inherited from ERC20)
event Transfer(address indexed from, address indexed to, uint256 value);

// Approval event (inherited from ERC20)
event Approval(address indexed owner, address indexed spender, uint256 value);

// Tax configuration updated
event TaxUpdated(uint256 newTaxPercentage, address indexed taxRecipient);

// Snapshot created
event SnapshotCreated(uint256 indexed snapshotId);

// Pause/Unpause events (inherited from Pausable)
event Paused(address indexed account);
event Unpaused(address indexed account);

// Ownership events (inherited from Ownable)
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
```

---

**Last Updated:** 2026-03-30
**Version:** Phase 1 - Production Ready
**Network:** Base L2
