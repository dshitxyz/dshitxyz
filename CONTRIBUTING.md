# Contributing to dshit.xyz

Welcome to the dshit.xyz project! This guide will help you get started developing.

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- pnpm 9.0.0+ ([install](https://pnpm.io/installation))
- Docker & Docker Compose (for local database)

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/dshitxyz/dshitxyz.git
cd dshitxyz
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

### 4. Run Development Servers

```bash
pnpm dev
```

This starts:
- **Web**: http://localhost:3000 (Next.js)
- **API**: http://localhost:3001 (Fastify)

## Available Commands

```bash
# Development
pnpm dev          # Start all services
pnpm dev -r       # Run in parallel (if needed)

# Quality
pnpm lint         # Run ESLint
pnpm typecheck    # Check TypeScript
pnpm format       # Format with Prettier
pnpm format:check # Check formatting

# Testing
pnpm test         # Run all tests
pnpm test:watch   # Watch mode

# Building
pnpm build        # Build all packages

# Cleanup
pnpm clean        # Remove all node_modules and build artifacts
```

## Project Structure

```
dshitxyz/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Fastify backend
├── packages/
│   ├── ui/           # Shared React components
│   ├── contracts/    # Smart contracts (Solidity)
│   └── config/       # Shared configs
└── docs/             # Documentation
```

## Commit Convention

We follow conventional commits:

```
type(scope): short description

- feat: new feature
- fix: bug fix
- refactor: code restructure
- test: test additions
- docs: documentation
- chore: tooling, deps, CI
```

Example:
```
feat(web): add glitch animation to hero title
refactor(api): simplify response handling
test(contracts): add transfer tax tests
```

## Testing

```bash
# Run all tests
pnpm test

# Watch specific package
cd packages/contracts
pnpm test:watch
```

## Smart Contract Development

```bash
cd packages/contracts

# Compile
pnpm build

# Test on Hardhat local network
pnpm test

# Deploy to Sepolia testnet
pnpm deploy:sepolia

# Deploy to Base mainnet (caution!)
pnpm deploy:base
```

## Pre-commit Hooks

Husky + lint-staged are configured. Before committing:
- ESLint runs on changed files
- Prettier formats code

To bypass (not recommended):
```bash
git commit --no-verify
```

## Need Help?

- Check [ROADMAP.md](./ROADMAP.md) for project phases
- Review [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for UI/UX guidelines
- Open an issue for questions

## Code Review Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make commits following the commit convention
3. Push and create a pull request
4. Ensure CI passes (lint, typecheck, tests)
5. Request review from team
6. Address feedback and iterate
7. Merge when approved

Happy coding! 💩🚀
