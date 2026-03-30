# Development Guide

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9+
- Docker & Docker Compose (for local database)

### Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   ```

4. **Run development servers**
   ```bash
   pnpm dev
   ```

   This will start:
   - **Web**: http://localhost:3000
   - **API**: http://localhost:3001

### Commands

```bash
# Development
pnpm dev              # Start all dev servers
pnpm dev -r           # With verbose output

# Testing
pnpm test             # Run all tests
pnpm test -r          # Watch mode

# Quality
pnpm lint             # Lint all code
pnpm format           # Auto-format code
pnpm typecheck        # Type check all packages

# Building
pnpm build            # Build for production

# Database
docker-compose up     # Start PostgreSQL
docker-compose down   # Stop PostgreSQL
```

### Project Structure

```
dshit/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # Fastify backend
├── packages/
│   ├── contracts/    # Hardhat + Solidity
│   ├── ui/           # React component library
│   └── config/       # Shared config
└── docs/             # Documentation
```

### Monorepo Workflow

This is a pnpm workspace monorepo. All packages share:
- TypeScript configuration
- ESLint rules
- Prettier formatting
- Testing setup

**Cross-package imports:**
```typescript
// From apps/web
import { Button } from '@dshit/ui';
import config from '@dshit/config';

// From apps/api
import { Button } from '@dshit/ui';
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/description`
2. Make changes and commit with conventional commits
3. Push and create PR for review
4. CI checks must pass before merge

### Debugging

**API**
```bash
cd apps/api
DEBUG=fastify:* pnpm dev
```

**Frontend**
```bash
cd apps/web
pnpm dev
# Then open http://localhost:3000
```

**Contracts**
```bash
cd packages/contracts
npx hardhat test --verbose
```

## Phase Progress

- **Phase 0**: Foundation Scaffold ✅
- **Phase 1**: Token Development (Next)
- **Phase 2**: Frontend Launch
- **Phase 3**: Commerce Engine
- **Phase 4**: Governance DAO
- **Phase 5**: Scale & Growth

See ROADMAP.md for detailed breakdown.
