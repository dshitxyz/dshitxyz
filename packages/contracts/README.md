# @dshitxyz/contracts

Smart contracts for the DSHIT token and governance.

## Overview

This package contains Solidity smart contracts for the DSHIT protocol, deployed on Base network.

### Current Contracts

#### DSHIT.sol
ERC-20 token with the following features:
- **Fixed Supply**: 1 billion tokens (no mint after deployment)
- **Transfer Tax**: 5% configurable tax on all transfers
- **Pausable**: Emergency circuit breaker to pause transfers
- **Snapshot**: Governance voting support via snapshots
- **Burnable**: Users can burn their own tokens
- **Reentrancy Guard**: Protected against reentrancy attacks

## Setup

### Prerequisites
- Node.js v18+
- pnpm v9+

### Installation

```bash
pnpm install
```

## Development

### Compile Contracts

```bash
pnpm compile
```

### Run Tests

```bash
pnpm test
```

#### Test Coverage
Run tests with coverage report:
```bash
pnpm hardhat coverage
```

### Local Hardhat Node

```bash
pnpm hardhat node
```

Then in another terminal:
```bash
pnpm hardhat run scripts/deploy.ts --network localhost
```

## Deployment

### Deploy to Base Sepolia Testnet

```bash
# Set environment variables
export PRIVATE_KEY=your_private_key
export TAX_RECIPIENT=0x...  # Optional, defaults to deployer

# Deploy
pnpm deploy:sepolia
```

### Deploy to Base Mainnet

⚠️ **Requires careful verification and testing**

```bash
export PRIVATE_KEY=your_mainnet_private_key
export TAX_RECIPIENT=your_treasury_address

pnpm deploy:mainnet
```

## Contract Details

### Token Mechanics

#### Transfer with Tax
```solidity
// Transfer 1000 DSHIT to user
// User receives: 950 DSHIT (after 5% tax)
// Treasury receives: 50 DSHIT
await dshit.transfer(userAddress, parseEther('1000'));
```

#### Tax Configuration
```solidity
// Change tax rate to 7.5%
await dshit.setTaxRate(75); // 75 basis points / 1000

// Change tax recipient
await dshit.setTaxRecipient(newTreasuryAddress);
```

#### Emergency Pause
```solidity
// Pause all transfers (owner only)
await dshit.pause();

// Unpause transfers
await dshit.unpause();
```

#### Governance Snapshots
```solidity
// Create snapshot for voting
const snapshotId = await dshit.snapshot();

// Query balance at snapshot
const balance = await dshit.balanceOfAt(address, snapshotId);
```

#### Burning Tokens
```solidity
// User burns their own tokens
await dshit.burn(amount);

// Burn on behalf (requires approval)
await dshit.burnFrom(ownerAddress, amount);
```

## Contract Addresses

### Base Sepolia Testnet
```
DSHIT: 0x... (to be deployed)
```

### Base Mainnet
```
DSHIT: 0x... (to be deployed)
```

## Verification

After deployment, verify on Basescan:

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> "<TAX_RECIPIENT_ADDRESS>"
```

## Gas Optimization

The contract is optimized with:
- Storage packing for efficiency
- OpenZeppelin audited implementations
- Minimal external calls
- Batched operations where possible

### Gas Estimates (Sepolia)
- **Deploy**: ~1.2M gas (~$0.50 USD at typical gas prices)
- **Transfer**: ~65k gas with tax
- **Burn**: ~25k gas
- **Snapshot**: ~45k gas

## Architecture

```
DSHIT (ERC-20)
├── ERC20 (OpenZeppelin)
├── ERC20Burnable (OpenZeppelin)
├── ERC20Snapshot (OpenZeppelin)
├── Pausable (OpenZeppelin)
├── Ownable (OpenZeppelin)
└── ReentrancyGuard (OpenZeppelin)
```

## Testing

The test suite covers:
- ✅ Deployment and initialization
- ✅ Basic transfers with tax
- ✅ Tax calculations
- ✅ Pause/unpause functionality
- ✅ Tax rate and recipient configuration
- ✅ Burning mechanics
- ✅ Snapshot creation and querying
- ✅ Approval and transferFrom
- ✅ Edge cases (zero transfers, self-transfers, etc.)

### Run Tests

```bash
pnpm test

# With coverage
pnpm hardhat coverage

# Watch mode
pnpm test:watch
```

## Security Considerations

1. **Reentrancy**: Protected by OpenZeppelin's ReentrancyGuard
2. **Pause Mechanism**: Owner can halt transfers in emergency
3. **Tax Recipient**: Can be updated to ensure treasury stability
4. **Transfer Tax**: Implemented transparently in Transfer events
5. **Burning**: Only contract owner can modify burn mechanics

## Future Enhancements

Phase 1 deliverables in roadmap:
- [ ] Deployment scripts for production networks
- [ ] Mainnet verification and security audit
- [ ] Bridge integration for cross-chain transfers
- [ ] Governance contract integration

## Troubleshooting

### Compilation Errors
```bash
# Clear cache and rebuild
pnpm clean
pnpm compile
```

### Test Failures
```bash
# Check node version
node --version  # Should be v18+

# Reset hardhat cache
pnpm hardhat clean

# Run tests with verbose output
pnpm hardhat test --verbose
```

### Deployment Issues
1. Check private key is valid
2. Ensure sufficient balance for gas
3. Verify network configuration in hardhat.config.ts
4. Check RPC endpoint availability

## Contributing

When modifying contracts:
1. Update tests for new features
2. Run `pnpm test` before committing
3. Maintain >95% test coverage
4. Follow Solidity style guide
5. Add gas optimization comments

## References

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Base Documentation](https://docs.base.org/)
- [Solidity Docs](https://docs.soliditylang.org/)

---

**Phase**: 1 - Token Implementation
**Status**: Active Development
