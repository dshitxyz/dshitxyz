# API (dshit.xyz Backend)

Fastify-based REST API for dshit.xyz, connected to PostgreSQL.

## Features

- RESTful endpoints for memes, products, orders
- PostgreSQL database with Drizzle ORM
- Authentication & authorization
- Request validation
- Error handling

## Development

```bash
cd apps/api

# Start dev server (requires PostgreSQL running)
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Testing
pnpm test
```

## Database

Uses PostgreSQL with Drizzle ORM. Ensure PostgreSQL is running:

```bash
# From root directory
docker-compose up -d
```

Set `DATABASE_URL` in `.env.local`:

```
DATABASE_URL=postgresql://dshit:dshit@localhost:5432/dshit
```

## API Endpoints

### Health Check
- `GET /health` - Server health status
- `GET /api/v1/status` - API status

More endpoints will be added in Phase 3 (Commerce).

## Environment Variables

```
API_PORT=3001
API_HOST=0.0.0.0
NODE_ENV=development
DATABASE_URL=postgresql://dshit:dshit@localhost:5432/dshit
DATABASE_POOL_SIZE=10
```

## Architecture

```
src/
├── index.ts           # Server entry
├── routes/            # API routes
├── middleware/        # Custom middleware
├── services/          # Business logic
├── db/                # Database setup
└── types/             # TypeScript types
```

## Building

```bash
pnpm build
pnpm start
```

## Testing

```bash
pnpm test           # Run tests
pnpm test:watch     # Watch mode
```

## Notes

- Fastify for performance
- Drizzle ORM for type-safe queries
- PostgreSQL for persistence
- TypeScript for type safety
