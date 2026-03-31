# Web App (dshit.xyz)

The main frontend application built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

- Landing page with brutalist design
- Meme gallery
- Token information dashboard
- Wallet connectivity (RainbowKit)
- Product catalog
- Anonymous user profiles

## Development

```bash
cd apps/web

# Install deps (run from root: pnpm install)
pnpm install

# Start dev server
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Testing
pnpm test
```

## Build

```bash
pnpm build
pnpm start
```

## Environment Variables

Create a `.env.local` in this directory or use the root `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_ANALYTICS_ID=xxx
```

## Design System

All components follow the design system defined in `DESIGN_SYSTEM.md`. Key utilities:

- **Color Classes**: `.shit-yellow`, `.shit-brown`, `.bg-raw`, etc.
- **Typography**: Bebas Neue (display), Space Mono (body), Permanent Marker (accent)
- **Components**: Check `@dshitxyz/ui` for shared components

## Architecture

```
src/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── (pages)/           # Page routes
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities
└── types/                 # TypeScript types
```

## Testing

```bash
pnpm test           # Run tests
pnpm test:watch     # Watch mode
```

## Notes

- Uses `@dshitxyz/ui` for shared components
- Tailwind configured with custom color palette
- RainbowKit for wallet integration
- Next.js 14 App Router
