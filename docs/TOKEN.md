# DSHIT Token Contract Documentation

## Overview

DSHIT is an ERC-20 token deployed on Base L2 with advanced features for community governance and treasury management.

**Contract:** `DSHIT.sol`
**Token Name:** DSHIT
**Token Symbol:** $DSHIT
**Decimals:** 18
**Total Supply:** 1,000,000,000 (1 billion)
**Supply Type:** Fixed (no minting after deployment)

---

## Features

### 1. **Transfer Tax**
- **Default Rate:** 5% (500 basis points out of 10,000)
- **Configurable:** Owner can adjust from 0% to 20%
- **Recipient:** Configurable tax recipient address (default: owner)
- **Application:** Tax applies on all transfers between accounts (not on minting/burning)
- **Formula:** `tax = transferAmount * taxRate / 10000`

**Example:** 
- Transfer: 100 DSHIT
- Tax: 100 × 500 / 10000 = 5 DSHIT
- Recipient gets: 95 DSHIT
- Tax recipient gets: 5 DSHIT

### 2. **Pausable**
- **Purpose:** Emergency circuit breaker to halt all transfers
- **Access:** Owner only
- **Use Cases:** Security incident response, maintenance
- **Methods:** `pause()`, `unpause()`

### 3. **Snapshot**
- **Purpose:** Capture token state for governance voting
- **Use Cases:** Snapshot-based voting (prevents flash-loan attacks)
- **Access:** Owner only
- **Methods:** `snapshot()`, `balanceOfAt()`, `totalSupplyAt()`
- **Returns:** Snapshot ID for querying historical balances

### 4. **Burnable**
- **Purpose:** Permanent token removal from circulation
- **Use Cases:** Deflationary mechanics, token buyback & burn
- **Access:** Any token holder can burn their own tokens
- **Methods:** `burn(amount)`, `burnFrom(account, amount)`

### 5. **Reentrancy Protection**
- **Protection:** OpenZeppelin's ReentrancyGuard
- **Application:** All state-changing transfer operations
- **Prevents:** Reentrancy attack exploits

---

## Core Functions

### Transfers

```solidity
// Standard transfer with tax
transfer(to: address, amount: uint256) -> bool

// Transfer using allowance with tax
transferFrom(from: address, to: address, amount: uint256) -> bool
```

**Note:** Both functions apply the current tax rate automatically.

### Tax Configuration

```solidity
// Set new tax rate (0-2000 basis points)
setTaxRate(newRate: uint256)

// Change tax recipient address
setTaxRecipient(newRecipient: address)

// Query current tax rate
taxRate() -> uint256

// Query current tax recipient
taxRecipient() -> address
```

### Governance

```solidity
// Create a snapshot
snapshot() -> uint256

// Get balance at specific snapshot
balanceOfAt(account: address, snapshotId: uint256) -> uint256

// Get total supply at specific snapshot
totalSupplyAt(snapshotId: uint256) -> uint256
```

### Emergency Controls

```solidity
// Pause all transfers (owner only)
pause()

// Unpause transfers (owner only)
unpause()
```

### Token Management

```solidity
// Burn tokens from your balance
burn(amount: uint256)

// Burn tokens from another account (requires approval)
burnFrom(account: address, amount: uint256)
```

---

## Events

```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
event Approval(address indexed owner, address indexed spender, uint256 value)
event TaxRateUpdated(uint256 oldRate, uint256 newRate)
event TaxRecipientUpdated(address indexed oldRecipient, address indexed newRecipient)
event Snapshot(uint256 indexed snapshotId)
event Paused(address account)
event Unpaused(address account)
```

---

## Security Features

### 1. **Reentrancy Guard**
- Prevents reentrancy attacks via `nonReentrant` modifier
- Applied to all transfer operations

### 2. **Owner Protection**
- All critical functions (pause, snapshot, tax config) require ownership
- Uses OpenZeppelin's `Ownable` pattern

### 3. **Tax Rate Caps**
- Maximum 20% tax rate (2000 basis points)
- Prevents excessive taxation

### 4. **Zero-Address Checks**
- Tax recipient cannot be zero address
- Prevents accidental fund loss

### 5. **Emergency Pause**
- Can halt all transfers immediately
- No recovery needed - just unpause

---

## Deployment

### Base Sepolia (Testnet)

```bash
pnpm -F @dshit/contracts deploy:testnet
```

Requires `.env` file:
```
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### Base Mainnet (Production)

```bash
pnpm -F @dshit/contracts deploy
```

Requires `.env` file:
```
PRIVATE_KEY=your_private_key
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_key
```

---

## Verification

After deployment, verify the contract on Basescan:

```bash
npx hardhat verify --network base-sepolia <contract_address>
```

---

## Testing

Run full test suite:

```bash
pnpm -F @dshit/contracts test
```

Test coverage:

```bash
pnpm -F @dshit/contracts test -- --coverage
```

---

## Gas Optimization Notes

- **Tax Calculation:** Uses bit shifting (division by 10000) for efficiency
- **Snapshot:** Only creates checkpoints when explicitly called
- **Storage Packing:** Uses standard ERC-20 storage layout
- **Optimizer:** Hardhat config enables optimizer with 200 runs

---

## Tokenomics

| Allocation | Amount | Purpose |
|-----------|--------|---------|
| Initial Mint | 1,000,000,000 | To deployer |
| No Inflation | — | Supply fixed forever |
| Tax Redistribution | 5% of transfers | To treasury |

---

## Future Governance

Once DAO is operational:
1. Tax rate can be adjusted via governance proposal
2. Tax recipient can be set to treasury contract
3. Emergency pause/unpause via multi-sig
4. Community voting on tokenomic adjustments

---

## Addresses

### Base Sepolia (Testnet)
```
[Deployed address TBD]
```

### Base Mainnet (Production)
```
[Deployed address TBD]
```

---

## Support

For questions or issues:
- GitHub: https://github.com/dshitxyz/dshitxyz
- Twitter: @dshitxyz
- Discord: [Link TBD]
