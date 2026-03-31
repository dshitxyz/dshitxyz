# @dshitxyz/contracts

Smart contracts for dshit.xyz, including ERC-20 token and governance.

## Contracts

### DSHIT.sol (Phase 1)
- ERC-20 token with 1B fixed supply
- 5% configurable transfer tax
- Pausable (circuit breaker)
- Burnable
- Snapshot support for governance

## Development

```bash
cd packages/contracts

# Compile
pnpm build

# Run tests
pnpm test

# Watch tests
pnpm test:watch

# Check coverage
pnpm test -- --coverage
```

## Deployment

### Testnet (Sepolia)
```bash
pnpm deploy:sepolia
```

### Mainnet (Base)
```bash
pnpm deploy:base
```

## Environment Variables

```
PRIVATE_KEY=your_private_key
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_KEY
BASE_RPC=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

## Contract Architecture

```
contracts/
├── DSHIT.sol          # Main token contract
├── test/              # Hardhat tests
├── scripts/           # Deployment scripts
└── artifacts/         # Compiled contracts
```

## Gas Optimization

- Storage packing optimized
- Minimal external calls
- Efficient tax calculation

## Security

- OpenZeppelin standard libraries
- ReentrancyGuard on sensitive functions
- Access control with Ownable
- Pausable circuit breaker

## Verification

Contracts are auto-verified on Basescan after deployment if API key is provided.

## Notes

- Solidity ^0.8.20
- Hardhat for development/testing
- TypeChain for TypeScript bindings
