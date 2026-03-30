# Setup Guide - dshit.xyz

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- Git

## Installation

```bash
# Install dependencies
pnpm install
```

## Environment Variables

### Web App (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_WC_PROJECT_ID=<your-walletconnect-project-id>
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Get a WalletConnect Project ID at: https://cloud.walletconnect.com

### API App (`apps/api/.env.local`)

```bash
PORT=3001
HOST=0.0.0.0
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

## Running Development

### Option 1: Run Everything Together

```bash
pnpm dev
```

This starts:
- Web app on http://localhost:3000
- API on http://localhost:3001

### Option 2: Run Separately

```bash
# Terminal 1 - Web App
pnpm -w -F @dshit/web dev

# Terminal 2 - API Server
pnpm -w -F @dshit/api dev
```

## Project Structure

```
apps/
├── web/          # Next.js frontend
│   ├── src/
│   │   ├── app/  # Pages & layouts
│   │   │   ├── page.tsx           # Home
│   │   │   ├── auth/login/        # Login page
│   │   │   ├── dashboard/         # Dashboard (protected)
│   │   │   └── gallery/           # Meme gallery
│   │   └── components/
│   │       ├── auth/              # Auth components
│   │       └── Providers.tsx       # RainbowKit + Wagmi
│   └── next.config.js
│
└── api/          # Fastify backend
    ├── src/
    │   ├── index.ts               # Main app
    │   ├── routes/
    │   │   ├── auth.ts            # Auth endpoints
    │   │   └── users.ts           # User endpoints
    │   └── lib/
    │       ├── db.ts              # Database utilities
    │       └── profiles.ts        # Profile generation
    └── tsconfig.json

packages/
├── ui/           # Shared UI components
├── contracts/    # Solidity contracts
└── config/       # Shared configs
```

## Authentication Flow

1. User clicks "Connect Wallet" on home page
2. RainbowKit opens wallet connection UI (supports MetaMask, Rainbow, etc.)
3. User signs message to prove wallet ownership
4. Frontend sends signature + message to `/api/auth/verify`
5. Backend verifies signature using ethers.js
6. Backend creates anonymous profile + returns JWT token
7. User is logged in, redirected to dashboard

## Key Features Implemented

✅ Web3-Native Authentication (no passwords)
✅ Wallet signature verification
✅ Auto-generated anonymous profiles (pseudonym + avatar)
✅ JWT token generation & validation
✅ User profile endpoints
✅ Brutalist UI/UX from design system
✅ RainbowKit wallet integration
✅ Base L2 support

## Next Steps (Phase 2+)

- [ ] Meme creation tool
- [ ] Meme commerce/payments
- [ ] DSHIT token integration
- [ ] Governance system
- [ ] NFT minting
- [ ] Analytics dashboard

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### WalletConnect Issues

Make sure you have a valid Project ID at https://cloud.walletconnect.com

### Signature Verification Failing

- Check that the message format matches exactly
- Ensure timestamp is within 5 minutes
- Verify ethers.js version compatibility
