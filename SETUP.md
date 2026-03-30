# DSHIT Development Setup Guide

## Prerequisites

- Node.js 18+ (use `nvm` or `fnm` for version management)
- pnpm 8+ (`npm install -g pnpm`)
- Docker & Docker Compose (for PostgreSQL)
- Git

## Local Development

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

Verify it's running:
```bash
docker ps  # Should see dshitxyz-postgres
```

### 4. Run Development Servers

All servers start in parallel:

```bash
pnpm dev
```

- **Web**: http://localhost:3000
- **API**: http://localhost:3001/health

### 5. Run Tests

```bash
pnpm test
```

### 6. Lint & Type-check

```bash
pnpm lint     # ESLint all code
pnpm type-check  # TypeScript strict mode
```

## Workspace Structure

```
dshitxyz/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # Fastify + PostgreSQL backend
├── packages/
│   ├── contracts/    # Hardhat + Solidity
│   ├── ui/           # Shared React components
│   └── config/       # Shared ESLint, Prettier, TypeScript configs
├── docker-compose.yml
├── ROADMAP.md        # Complete development roadmap
└── CLAUDE.md         # Project context & vision
```

## Git Workflow

### Pre-commit Hooks

Husky + lint-staged automatically run on commit:
- ESLint on changed files
- Prettier formatting
- TypeScript type checking

### Commit Convention

```
type(scope): short description

feat: new feature
fix: bug fix
refactor: code restructure
test: test additions
docs: documentation
chore: tooling/deps/CI
```

Example:
```
feat(web): add glitch animation to hero title
```

## Database Migrations

Using Drizzle ORM:

```bash
# Create migration
pnpm db:migrate

# View studio
pnpm db:studio
```

## Deployment

### Contract Deployment to Base Sepolia

```bash
cd packages/contracts
pnpm deploy:sepolia
```

### Web Deployment (Vercel)

```bash
vercel deploy
```

## Debugging

### Next.js Web

```bash
# Run with debug logging
DEBUG=* pnpm dev
```

### Fastify API

```bash
# Enable debug logs
DEBUG=* pnpm dev
```

### PostgreSQL

```bash
docker exec -it dshitxyz-postgres psql -U postgres -d dshitxyz
```

## Troubleshooting

### Port Conflicts

If ports 3000 or 3001 are in use:

```bash
# Find process using port
lsof -i :3000

# Kill process (use PID from above)
kill -9 <PID>
```

### PostgreSQL Connection Issues

```bash
# Verify container is running
docker ps | grep dshitxyz-postgres

# Restart if needed
docker-compose restart postgres
```

### pnpm Issues

```bash
# Clear pnpm store
pnpm store prune

# Reinstall everything
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## CI/CD

GitHub Actions runs on every PR:
- **Lint**: ESLint checks
- **Type-check**: TypeScript validation
- **Test**: Jest test suites
- **Build**: Full build pipeline

All checks must pass before merging.

---

For detailed roadmap and architecture, see [ROADMAP.md](./ROADMAP.md) and [CLAUDE.md](./CLAUDE.md).
