# Contributing to dshit.xyz

## Overview

This is a satirical Web3 meme commerce platform built as an autonomous development project. All work follows the phased ROADMAP.md execution plan.

## Project Structure

```
dshit-monorepo/
├── apps/
│   ├── web/           # Next.js 14 frontend (Phase 2+)
│   └── api/           # Fastify REST API (Phase 1+)
├── packages/
│   ├── contracts/     # Hardhat smart contracts (Phase 1+)
│   ├── ui/            # Shared React components (Phase 2+)
│   └── config/        # Shared configuration
├── docs/              # Documentation
├── ROADMAP.md         # Phase-based development roadmap
└── DEVELOPMENT.md     # Development environment guide
```

## Development Workflow

### 1. Branch Naming

Follow the phase structure from ROADMAP.md:

```
phase-X/{feature-description}
feature/{feature-name}
fix/{bug-fix-description}
docs/{documentation-update}
```

Example:
- `phase-1/token-contract`
- `feature/wallet-integration`
- `fix/api-health-check`

### 2. Commit Messages

Use conventional commits:

```
<type>(scope): <subject>

<body>

<footer>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructure
- `test` - Test additions
- `docs` - Documentation
- `chore` - Tooling, dependencies, CI
- `style` - Formatting, CSS

Example:
```
feat(contracts): implement DSHIT token with transfer tax

- Add ERC-20 with 5% configurable transfer tax
- Implement pausable mechanism for circuit breaker
- Add snapshot support for governance votes
- Include ReentrancyGuard on all state changes

Closes #123
```

### 3. Code Style

All code is automatically formatted on commit via Husky + lint-staged:

```bash
# Before pushing
pnpm format          # Format all code
pnpm lint            # Lint all code
pnpm typecheck       # Type check all code
pnpm test            # Run all tests
pnpm build           # Build for production
```

### 4. Pull Request Process

1. Create feature branch from `main`
2. Make changes following code style guidelines
3. Ensure CI passes (lint, typecheck, test, build)
4. Create PR with clear description of changes
5. Address review feedback
6. Squash and merge when approved

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd apps/api
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

### Test Organization

Each package should have:
- `src/` - Source code
- `test/` - Test files
- `test/unit/` - Unit tests
- `test/integration/` - Integration tests

## Cross-Package Dependencies

Import from workspace packages:

```typescript
// From apps/web
import { Button } from '@dshit/ui';
import config from '@dshit/config';

// From apps/api
import { logger } from '@dshit/config';
```

**Do NOT** use relative imports across packages:
```typescript
// ❌ Wrong
import { Button } from '../../../packages/ui/src';

// ✅ Correct
import { Button } from '@dshit/ui';
```

## Phase Progression

### Phase 0: Foundation (COMPLETE)
- Monorepo scaffold ✅
- Basic app structure ✅
- CI/CD pipeline ✅
- Ready for Phase 1 ✅

### Phase 1: Token ($DSHIT)
- ERC-20 smart contract
- Full test suite (>95% coverage)
- Deployment scripts (Base Sepolia + Mainnet)
- Gas optimization
- Etherscan verification

### Phase 2: Frontend (dshit.xyz)
- Landing page with brutalist styling
- Wallet integration (RainbowKit)
- Meme gallery
- Token info page
- Product catalog

### Phases 3-5
See ROADMAP.md for detailed breakdowns.

## Code Review Guidelines

### For Reviewers
- Check code quality and tests
- Verify CI passes
- Ensure no security issues
- Ask clarifying questions
- Approve or request changes

### For Authors
- Keep PRs focused and small
- Write clear commit messages
- Add tests for new features
- Update documentation
- Respond to feedback promptly

## Documentation

All features should include:
1. **Code comments** - For non-obvious logic
2. **Docstrings** - For functions/classes (TypeDoc)
3. **README** - At package level
4. **Integration docs** - For new systems

## Performance & Optimization

### Guidelines
- Profile before optimizing
- Keep bundle sizes minimal
- Lazy load components when possible
- Use proper caching strategies
- Monitor Core Web Vitals

### Tools
- **Web**: Lighthouse, WebPageTest
- **API**: Clinic.js, Autocannon
- **Contracts**: Hardhat gas reporter

## Security

### Requirements
- No secrets in code (use .env)
- Validate all user input
- Use security linters
- Review dependency vulnerabilities
- Test with exploits in mind

### Reporting
Found a security issue? Email security@dshit.xyz (placeholder - use actual process)

## Questions?

- Check ROADMAP.md for project scope
- Review DEVELOPMENT.md for setup
- Ask in discussions or issues
- Check existing documentation

---

**Happy coding! Remember: no guardrails, maximum impact.** 😎
