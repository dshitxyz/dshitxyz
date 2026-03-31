# dshit.xyz Development Setup

Complete guide to setting up the monorepo for local development.

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9.0.0+ (package manager)
- **Docker & Docker Compose**: For PostgreSQL database

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

Copy environment templates and fill in values:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp packages/contracts/.env.example packages/contracts/.env
```

### 3. Start PostgreSQL

```bash
docker-compose up -d postgres
```

Verify connection:
```bash
psql postgresql://user:password@localhost:5432/dshitxyz
```

### 4. Run Development Servers

Start all services:
```bash
pnpm dev
```

Or run individually:
```bash
pnpm dev:web  # Next.js on http://localhost:3000
pnpm dev:api  # Fastify on http://localhost:3001
```

## Monorepo Structure

```
dshitxyz/
├── apps/
│   ├── web/           # Next.js 14 + React + TypeScript frontend
│   └── api/           # Fastify + PostgreSQL + Drizzle ORM backend
├── packages/
│   ├── contracts/     # Hardhat + Solidity smart contracts
│   ├── ui/            # Shared React component library
│   └── config/        # Shared TypeScript, ESLint, Prettier configs
└── docs/              # Project documentation
```

## Available Scripts

From the root directory:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all code |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | TypeScript type checking |
| `pnpm clean` | Clean all build artifacts |
| `pnpm ci` | Full CI pipeline (lint → type-check → test → build) |

## Package-Specific Scripts

### Web (`apps/web`)
```bash
pnpm --filter @dshitxyz/web dev    # Development server
pnpm --filter @dshitxyz/web build  # Production build
pnpm --filter @dshitxyz/web start  # Start production server
```

### API (`apps/api`)
```bash
pnpm --filter @dshitxyz/api dev    # Development server
pnpm --filter @dshitxyz/api build  # Compile TypeScript
```

### Contracts (`packages/contracts`)
```bash
pnpm --filter @dshitxyz/contracts compile  # Compile Solidity
pnpm --filter @dshitxyz/contracts test     # Run tests
```

## Git Workflow

1. Create feature branch: `git checkout -b feature/description`
2. Make changes and commit: `git commit -m "type(scope): description"`
3. Push and create PR: `git push origin feature/description`
4. CI will run automatically on every PR

Commit types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`

## IDE Setup

### VS Code

Extensions recommended:
- ESLint
- Prettier
- TypeScript Vue Plugin
- Solidity (for contract development)

Settings (`.vscode/settings.json`):
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Troubleshooting

### pnpm install fails
- Clear cache: `pnpm store prune`
- Delete lock file: `rm pnpm-lock.yaml && pnpm install`

### Port already in use
- Web (3000): `lsof -i :3000` to find process
- API (3001): `lsof -i :3001` to find process

### PostgreSQL connection error
- Verify Docker is running: `docker ps`
- Check connection: `psql postgresql://user:password@localhost:5432/dshitxyz`
- Reset container: `docker-compose down && docker-compose up -d postgres`

## Next Steps

- Review [ROADMAP.md](./ROADMAP.md) for development phases
- Read [CLAUDE.md](./CLAUDE.md) for project context and design system
- Check [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for UI/UX guidelines

---

*Last updated: Phase 0 - Foundation Scaffold*
