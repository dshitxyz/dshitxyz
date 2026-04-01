# DSHIT Discord Bot

Official Discord bot for dshit.xyz - Verify wallets, view contests, and participate in governance.

## Quick Start

```bash
pnpm install
pnpm dev
```

See parent directory [`../README.md`](../README.md) for full setup and deployment instructions.

## Slash Commands

- `/verify <wallet>` - Verify wallet and get roles
- `/contests current` - Current contest info
- `/contests leaderboard` - Top creators
- `/govote active` - Active proposals
- `/govote voting-power <0x...>` - Your voting power

## Features

✅ Wallet verification (token-gated)  
✅ Auto role assignment  
✅ Contest announcements  
✅ Governance voting  
✅ Creator leaderboard  
✅ Community engagement

## Environment

```
DISCORD_TOKEN=<bot-token>
DISCORD_CLIENT_ID=<client-id>
DISCORD_GUILD_ID=<guild-id>
DSHIT_API_URL=http://localhost:3001
DSHIT_API_KEY=<optional>
```

## Architecture

See [`./src`](./src) for implementation details.
